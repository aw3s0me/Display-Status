from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.conf import settings
from rest_framework.generics import (ListCreateAPIView, RetrieveUpdateDestroyAPIView)
from editor.models import Project
from editor.serializers import ProjectSerializer
from editor.permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from editor.serializers import UserSerializer
from django.core.context_processors import csrf
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets

#from django.views.decorators.csrf import csrf_exempt

#@csrf_exempt
def index(request):
    data = {
        'title': getattr(settings, 'TITLE'),
        'description': getattr(settings, 'DESCRIPTION'),
        'csrf_token': get_token(request)
    }
    #request.META["CSRF_COOKIE_USED"] = True
    #data.update(csrf(request))

    response = render_to_response('editor/index.html', data)#, context_instance=RequestContext(request))
    
    #response['Access-Control-Allow-Origin'] = '*'  
    #response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'  
    #response['Access-Control-Max-Age'] = '1000'  
    #response['Access-Control-Allow-Headers'] = '*'  
    #response['Access-Control-Allow-Credentials'] = 'true'
    return response  


class ProjectMixin(object):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = (IsOwnerOrReadOnly, )
    def pre_save(self, obj):
        obj.owner = self.request.user

class ProjectList(ProjectMixin, ListCreateAPIView):
    pass

class ProjectDetail(ProjectMixin, RetrieveUpdateDestroyAPIView):
    pass

class UserMixin(object):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserList(UserMixin, ListCreateAPIView):
    pass

class UserDetail(UserMixin, RetrieveUpdateDestroyAPIView):
    pass

class AuthorizeUser():
    authorization_link = None
    def post(self, request, *args, **kwargs):
        kwargs['authorization_link'] = request.GET.get('authorization_link', None)

class PointsViewSet(viewsets.ModelViewSet):
    def get(self, request, *args, **kwargs):
        return Response()

class ProjectViewSet(viewsets.ModelViewSet):
    def getlist(self, request, *args, **kwargs):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


"""
@api_view(['GET', 'POST'])
def project_list(request):
    if request.method == 'GET':
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ProjectSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.data, status = status.HTTP_BAD_REQUEST)
"""

#Refreshing the Token

class UserTokenEnded():
    def get(self, request, *args, **kwargs):
        if 'access_token' in request.GET:
            form = AccessTokenDataForm(initial={
                'access_token': request.GET.get('access_token', None),
                'token_type': request.GET.get('token_type', None),
                'expires_in': request.GET.get('expires_in', None),
                'refresh_token': request.GET.get('refresh_token', None),
            })
            kwargs['form'] = form
        return form

