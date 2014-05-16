from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, renderers
from rest_framework.parsers import JSONParser
from editor.serializers import UserSerializer
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from helpers import is_empty,generate_new_hash_with_length,get_first
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from editor.models import NewUserEntry
from django.conf import settings
from django.contrib.sites.models import get_current_site
from django.shortcuts import render_to_response
from mainscreen.views import get_banner

import json
import pdb
import re
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
    if data['password'] != data['confPassword']:
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
    get, created = NewUserEntry.objects.get_or_create(username=user.username,link=link)
    #created.save()

#'http:/ipetd1.ipe.kit.edu:8000/api-token/email_register/' link root
class SendMailView(APIView):
    model = User
    def post(self, request, format=None):  
        #pdb.set_trace()
        data = json.loads(request.body)
        errors = validate_user(data)
        if not is_empty(errors):
            return Response(errors, status.HTTP_400_BAD_REQUEST)
        link=generate_new_hash_with_length(20)
        site=get_current_site(request)
        ctx_dict = {'activation_key': link, 'expiration_days': settings.ACCOUNT_ACTIVATION_DAYS, 'site': site}
        subject = render_to_string('editor/../mail/activation_email_subject.txt', ctx_dict)
            # Email subject *must not* contain newlines
        subject = ''.join(subject.splitlines())
        message_text = render_to_string('editor/../mail/activation_email.txt', ctx_dict)
        #message_html = render_to_string('editor/../mail/activation_email.html', ctx_dict)
        msg = EmailMultiAlternatives(subject, message_text, settings.DEFAULT_FROM_EMAIL, [data['email']])
        #msg.attach_alternative(message_html, "text/html")
        msg.send()
        
        create_user(data, link)
        return Response('Please activate user via mail', status=status.HTTP_201_CREATED)

def render_activation_completed(user):
    group = Group.objects.get(user.groups)


class ActivateUserView(APIView):
    model = User
    def get(self, request, link):
        #pdb.set_trace()
        if not NewUserEntry.objects.filter(link=link).exists():
            return Response('Wrong or expired link', status=status.HTTP_400_BAD_REQUEST)
        entry = NewUserEntry.objects.get(link=link)
        username = entry.username
        if not User.objects.filter(username=username):
            raise 'User hasnt been created'
        user = User.objects.get(username=username)
        user.is_active = True
        user.save()
        entry.delete()
        data = {
            'title': getattr(settings, 'TITLE'),
            'description': getattr(settings, 'DESCRIPTION'),
            'username': username
        }
        response = render_to_response('mainscreen/activation_completed.html', data)
        return response

class TestRendering(APIView):
    model = User
    def get(self, request):
        data = {
            'title': getattr(settings, 'TITLE'),
            'description': getattr(settings, 'DESCRIPTION'),
            'username': 'Allah'
        }
        response = render_to_response('mainscreen/activation_completed.html', data)
        return response


#for registered users
class RegisterView(APIView):
    throttle_classes = ()
    permission_classes = ()
    #parser_classes = {'formprs': parsers.FormParser,'partprs': parsers.MultiPartParser,'jsonprs': parsers.JSONParser}
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer
    userSerializer_class = UserSerializer
    model = Token
    #@permission_classes((AllowAny,))
    def post(self, request, url):
        

        if user and user.is_active:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'id': user.id , 'name': user.username, 'userRole': 'user','token': token.key}, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)



