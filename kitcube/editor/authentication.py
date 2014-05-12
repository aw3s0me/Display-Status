from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, renderers
from rest_framework.parsers import JSONParser

from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import api_view, throttle_classes
from social.apps.django_app.utils import strategy
from social.backends.google import GoogleOAuth2
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import HTTP_HEADER_ENCODING
from rest_framework import status
from serializers import UserSerializer

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
import logging
import json
import pdb

def get_authorization_header(request):
    """
    Return request's 'Authorization:' header, as a bytestring.

    Hide some test client ickyness where the header can be unicode.
    """
    auth = request.META.get('HTTP_AUTHORIZATION', b'')
    if type(auth) == type(''):
        # Work around django test client oddness
        auth = auth.encode(HTTP_HEADER_ENCODING)
    return auth


#auth with OAuth users (updating and creating tokens)
class ObtainAuthToken(APIView):
    throttle_classes = ()
    permission_classes = ()
    #parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer
    model = Token
    def post(self, request, backend):
        serializer = self.serializer_class(data=request.DATA)
        if backend == 'auth':
            if serializer.is_valid():
                token, created = Token.objects.get_or_create(user=serializer.object['user'])
                return Response({'token': token.key}) #return only updated token
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Here we call PSA to authenticate like we would if we used PSA on server side.
            user = register_by_access_token(request, backend)
            # If user is active we get or create the REST token and send it back with user data
            if user and user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'id': user.id , 'name': user.username, 'userRole': 'user','token': token.key})

#Python social auth validation. sends request to backend to validate it
@strategy() #strategy framework to getting backend
def register_by_access_token(request, backend):
    backend = request.strategy.backend

    auth = get_authorization_header(request).split()
    if not auth or auth[0].lower() != b'token':
        msg = 'No token header provided.'
        return msg
    if len(auth) == 1:
        msg = 'Invalid token header. No credentials provided.'
        return msg
 
    access_token=auth[1]
    user = backend.do_auth(access_token)
    return user


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
    def post(self, request, format=None):
        #data = self.parser_classes['jsonprs'].parse(request)
        #data = JSONParser().parse(request)
        #serialized = UserSerializer(data=data)
        #serialized = UserSerializer(request.DATA)
        #data = json.loads(request.DATA)
        data = json.loads(request.body)
        serialized = UserSerializer(data=data)
        if serialized.is_valid():
            if len(serialized.init_data['password']) < 5:
                return Response('Password_length', status=status.HTTP_411_LENGTH_REQUIRED)
            if len(serialized.init_data['username']) < 5:
                return Response('Username_length', status=status.HTTP_411_LENGTH_REQUIRED)

            if serialized.init_data['password'] != serialized.init_data['confPassword']:
                return Response('Password_matches', status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(username=serialized.init_data['username']).exists(): 
                #print "EXISTS USERNAME"
                #User.objects.get(username=serialized.init_data['username']).delete()
                return Response('Username_exists', status.HTTP_409_CONFLICT)
            if User.objects.filter(email=serialized.init_data['email']).exists():
                #print "EXISTS EMAIL"
                #User.objects.get(email=serialized.init_data['email']).delete()
                return Response('Email_exists', status.HTTP_409_CONFLICT)

            user = User.objects.create_user(
                serialized.init_data['username'],
                serialized.init_data['email'],
                serialized.init_data['password'],
            )
            #user.groups = 'users'
            user.save()

            if user and user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'id': user.id , 'name': user.username, 'userRole': 'user','token': token.key}, status=status.HTTP_201_CREATED)
        else:
            return Response(serialized._errors, status=status.HTTP_400_BAD_REQUEST)

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
        data = json.loads(request.body)
        """
        if len(data['password']) < 5:
            return Response('Password_length', status=status.HTTP_411_LENGTH_REQUIRED)
        if len(data['username']) < 5:
            return Response('Username_length', status=status.HTTP_411_LENGTH_REQUIRED)
        """
        if not User.objects.filter(username=data['username']).exists(): 
            return Response('User doesnt exist', status=status.HTTP_404_NOT_FOUND)
        user = User.objects.get(username=data['username'])
        if user.check_password(data['password']):
            if user and user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'id': user.id , 'name': user.username, 'userRole': 'user','token': token.key})
            else:
                return Response('User_not_active', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Wrong_pswd', status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer
    userSerializer_class = UserSerializer
    model = Token
    def get(self, request):
        return Response({'User': ''})




