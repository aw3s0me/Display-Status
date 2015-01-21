from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, renderers
from rest_framework.parsers import JSONParser
from serializers import UserSerializer
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from helpers import is_empty,generate_new_hash_with_length
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from models import NewUserEntry
from django.conf import settings
from django.contrib.sites.models import get_current_site
from django.shortcuts import render_to_response
import threading
import time #for profiling
import json
import pdb
import re
from datetime import datetime, timedelta #for time comparision and adding days
from django.utils import timezone #for time zone
EMAIL_REGEX = re.compile(r"[^@]+@[^@]+\.[^@]+")

def validate_user(data):
    errors = {}
    groupname = data['group']
    if not Group.objects.filter(name=groupname).exists(): 
        raise 'Group hasnt been specified correctly'
    if len(data['password']) < 5:
        errors['password'] = 'Password length should be more than 5'
    if len(data['username']) < 5:
        errors['username'] = 'Username length should be more than 5'
    if data['password'] != data['match']:
        errors['match'] = 'Passwords don\'t match'
    if User.objects.filter(username=data['username']).exists(): 
        errors['username'] = 'User is already exists'
    if not EMAIL_REGEX.match(data['email']):
        errors['email'] = 'Email should be similar to pattern <foo@example.com>'
    if User.objects.filter(email=data['email']).exists():
        errors['email'] = 'Email exists'
    return errors

def create_user(data, link):
    serialized = UserSerializer(data=data)
    user = User.objects.create_user(
        username=serialized.init_data['username'],
        email=serialized.init_data['email'],
        password=serialized.init_data['password'],
    )
    groupname = data['group']
    if not Group.objects.filter(name=groupname):
        raise 'Group doesn\t exists'
    group = Group.objects.get(name=groupname)
    user.groups.add(group)
    user.is_active=False
    user.save()
    #pdb.set_trace()
    until_valid_datetime = datetime.now() + timedelta(days=settings.ACCOUNT_ACTIVATION_DAYS)
    #redirect to proj is just groupname. Appends in url like localhost/projname/
    get, created = NewUserEntry.objects.get_or_create(username=user.username,link=link, valid_until_date=until_valid_datetime, redirect_to_proj=groupname)
    #created.save()

#'http:/ipetd1.ipe.kit.edu:8000/api-token/email_register/' link root
class SendMailView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, format=None):  
        #pdb.set_trace()
        data = json.loads(request.body)
        errors = validate_user(data)
        if not is_empty(errors):
            return Response(errors)
        link=generate_new_hash_with_length(20)
        site=get_current_site(request)
        ctx_dict = {'activation_key': link, 'expiration_days': settings.ACCOUNT_ACTIVATION_DAYS, 'site': site}
        subject = render_to_string('provider/../mail/activation_email_subject.txt', ctx_dict)
            # Email subject *must not* contain newlines
        subject = ''.join(subject.splitlines())
        message_text = render_to_string('provider/../mail/activation_email.txt', ctx_dict)
        #message_html = render_to_string('editor/../mail/activation_email.html', ctx_dict)
        msg = EmailMultiAlternatives(subject, message_text, settings.DEFAULT_FROM_EMAIL, [data['email']])
        #msg.attach_alternative(message_html, "text/html")
        #start_time_msg = time.time() #I'll leave profiling code, maybe we can optimize this
        msg.send()
        #print time.time() - start_time_msg, "seconds"
        #t1 = threading.Thread(target = msg.send, args=()) #tried to user threads
        #t2 = threading.Thread(target = create_user, args = (data, link))
        #start_time_creation = time.time()
        create_user(data, link)
        #print time.time() - start_time_creation, "seconds"
        return Response('Please activate user via mail', status=status.HTTP_201_CREATED)

def is_activation_time_valid(until_valid_not_aware):
    now = timezone.make_aware(datetime.now(), timezone.get_default_timezone())
    #until_valid = timezone.make_aware(until_valid_not_aware, timezone.get_default_timezone())
    if now > until_valid_not_aware:
        return False
    else:
        return True



class ActivateUserView(APIView):
    model = User
    def get(self, request, link):
        #pdb.set_trace()
        if not NewUserEntry.objects.filter(link=link).exists():
            return Response('Wrong or expired link', status=status.HTTP_400_BAD_REQUEST)
        entry = NewUserEntry.objects.get(link=link)
        username = entry.username
        redirect_to = entry.redirect_to_proj
        if not User.objects.filter(username=username):
            raise 'User hasnt been created'
        user = User.objects.get(username=username)
        user.is_active = True
        user.save()
        entry.delete()
        #pdb.set_trace()
        activation_time = entry.valid_until_date
        data = {
            'title': getattr(settings, 'TITLE'),
            'description': getattr(settings, 'DESCRIPTION'),
            'username': username,
            'redirect_to': redirect_to
        }
        if (is_activation_time_valid(activation_time)):
            response = render_to_response('mainscreen/activation_completed.html', data)
        else: 
            #delete user code
            response = render_to_response('mainscreen/activation_failed.html', data)
        return response

class TestRendering(APIView):
    model = User
    def get(self, request):
        data = {
            'title': getattr(settings, 'TITLE'),
            'description': getattr(settings, 'DESCRIPTION'),
            'username': 'Allah',
            'redirect_to': 'katrin',
        }
        #response = render_to_response('mainscreen/activation_completed.html', data)
        response = render_to_response('mainscreen/activation_failed.html', data)
        return response
