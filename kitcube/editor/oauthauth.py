from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, parsers, renderers
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import api_view, throttle_classes
from social.apps.django_app.utils import strategy
from social.apps.django_app.utils import load_strategy
from social.backends.google import GoogleOAuth2
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import HTTP_HEADER_ENCODING

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
import logging
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

class ObtainAuthToken(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer
    model = Token
    #pdb.set_trace()
    def post(self, request, backend):
        #pdb.set_trace()
        serializer = self.serializer_class(data=request.DATA)
        if backend == 'auth':
            if serializer.is_valid():
                token, created = Token.objects.get_or_create(user=serializer.object['user'])
                return Response({'token': token.key})
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Here we call PSA to authenticate like we would if we used PSA on server side.
            if backend == 'facebook':
                user = register_by_access_token_fb(request, backend)
            elif backend == 'google':
                pdb.set_trace()
                user = register_by_access_token_google(request, backend='google-oauth2')
            elif backend == 'google-oauth2':
                pdb.set_trace()
                user = register_by_access_token_fb(request, backend)
            # If user is active we get or create the REST token and send it back with user data
            if user and user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'id': user.id , 'name': user.username, 'userRole': 'user','token': token.key})

@strategy()
def register_by_access_token_fb(request, backend):
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

    """
    user = request.user
    user = backend.do_auth(
        access_token=request.GET.get('access_token'),
        user=user.is_authenticated() and user or None
    )
"""
    return user
    #return "ERROR"

@strategy()
def register_by_access_token_google(request, backend):
    backend = 'google-oauth2'
    pdb.set_trace()
    #backend = request.strategy.backend
    #strategy = load_strategy(backend)
    social = request.user.social_auth.get(provider)
    backend = backend(strategy=strategy)
    backend = social.get_backend(strategy)

    auth = get_authorization_header(request).split()
    if not auth or auth[0].lower() != b'token':
        msg = 'No token header provided.'
        return msg
    if len(auth) == 1:
        msg = 'Invalid token header. No credentials provided.'
        return msg
 
    access_token=auth[1]
    pdb.set_trace()
    user = backend.do_auth(access_token)
    """
    user = request.user
    user = backend.do_auth(
        access_token=request.GET.get('access_token'),
        user=user.is_authenticated() and user or None
    )
"""
    return user
    #return "ERROR"


class RegisterView(APIView):
    pass
