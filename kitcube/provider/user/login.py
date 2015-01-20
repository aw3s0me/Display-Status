from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, renderers
from rest_framework.parsers import JSONParser
from serializers import UserSerializer
from helpers import get_authorization_header
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from helpers import is_empty
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from provider.datamgmt.models import Project
import json
import pdb

def validate_user_by_group(data):
    errors = {}
    groupname = data['group']
    #pdb.set_trace()
    try:
        group = Group.objects.get(name=groupname).user_set.all()
    except Group.DoesNotExist:
        raise 'Group hasnt been specified correctly'
    if not User.objects.filter(username=data['username']).exists(): 
        errors['username'] = 'User doesnt exist'
        #errros['password'] = 'Wrong password'
    else:
        user = User.objects.get(username=data['username'])
        if not user.check_password(data['password']):
            errors['password'] = 'Wrong password'
        if not Group.objects.filter(name=groupname).exists(): 
            raise 'Group hasnt been specified correctly'
            #errors['group'] = 'Group hasnt been specified correctly'
        if not user in group:
            errors['username'] = 'User is not in this group'
            #errors['group'] = 'User is not in this group'
    if len(data['password']) < 5:
        errors['password'] = 'Password length should be more than 5'
    if len(data['username']) < 5:
        errors['username'] = 'Username length should be more than 5'
    
    return errors

def validate_user_without_group(data):
    errors = {}
    if not User.objects.filter(username=data['username']).exists():
        errors['username'] = 'User doesnt exist'
    else:
        user = User.objects.get(username=data['username'])
        if not user.check_password(data['password']):
            errors['password'] = 'Wrong password'
    if len(data['password']) < 5:
        errors['password'] = 'Password length should be more than 5'
    if len(data['username']) < 5:
        errors['username'] = 'Username length should be more than 5'
    
    return errors


#to login user that were registered without backend
class LoginView(APIView):
    throttle_classes = ()
    permission_classes = ()
    #parser_classes = {'formprs': parsers.FormParser,'partprs': parsers.MultiPartParser,'jsonprs': parsers.JSONParser}
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer
    userSerializer_class = UserSerializer
    model = Token
    def post(self, request):
        pdb.set_trace()
        data = json.loads(request.body)
        if 'group' in data:
            errors = validate_user_by_group(data)
        else:
            errors = validate_user_without_group(data)
        if is_empty(errors):
            user = User.objects.get(username=data['username'])
            # groups = user.groups.all()
            # group_arr = []
            # for group in groups:
            #     project = Project.objects.get(link=group.name)
            #     configs = project.config_set.all()
            #     config_arr = []
            #     for config in configs:

                #group_arr.append({'name': group.name, 'title': project.title})
            if user and user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'id': user.id , 'name': user.username, 'userRole': 'user','token': token.key})
            else:
                return Response('user is not active', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(errors)


class LogoutView(APIView):
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer
    userSerializer_class = UserSerializer
    model = Token
    def get(self, request):
        #data = json.loads(request.body)
        auth = get_authorization_header(request).split()
        #pdb.set_trace()
        if not auth or auth[0].lower() != b'token':
            msg = 'No token header provided.'
        if len(auth) == 1:
            msg = 'Invalid token header. No credentials provided.'
        if not msg:
            return Response('Invalid token header', status=status.HTTP_400_BAD_REQUEST)
        key=auth[0]
        if not Token.objects.filter(key=key).exists(): 
            return Response('Token doesnt exist', status=status.HTTP_400_BAD_REQUEST)
        else:
            Token.objects.get(key=key).delete()
        return Response({'User': ''})
