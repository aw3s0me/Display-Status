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
from editor.serializers import UserSerializer
from helpers import get_authorization_header
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
#from editor.validation import validate_user as validate_user
from django.core.mail import send_mail
import logging
import json
import pdb



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






