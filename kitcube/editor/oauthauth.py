from django.contrib.auth.models import User, Group
from rest_framework import viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, parsers, renderers
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import api_view, throttle_classes
from social.apps.django_app.utils import strategy
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
import pdb
import logging

class ObtainAuthToken(APIView):
    throttle_classes = ()
    permission_classes = ()
    parser_classes = (parsers.FormParser, parsers.MultiPartParser, parsers.JSONParser,)
    renderer_classes = (renderers.JSONRenderer,)
    serializer_class = AuthTokenSerializer
    model = Token
    logger = logging.getLogger(__name__)
    # Accept backend as a parameter and 'auth' for a login / pass
    def post(self, request, backend):
        serializer = self.serializer_class(data=request.DATA)
        pdb.set_trace()

        print request
        logger.error('eee')
        if backend == 'auth':
            if serializer.is_valid():
                token, created = Token.objects.get_or_create(user=serializer.object['user'])
                return Response({'token': token.key})
                #return "debug"
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            #return 'BAD'

        else:
            # Here we call PSA to authenticate like we would if we used PSA on server side.
            user = register_by_access_token(request, backend)
            #user = None
            pdb.set_trace()
            # If user is active we get or create the REST token and send it back with user data
            if user and user.is_active:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'id': user.id , 'name': user.username, 'userRole': 'user','token': token.key})
                #return "msg"

@strategy()
def register_by_access_token(request, backend):
    backend = request.strategy.backend
    auth = get_authorization_header(request).split()
    pdb.set_trace()
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
