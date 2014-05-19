from django.contrib.auth.models import User, Group
from models import Project, Config
from django.conf import settings
from provider.user.permissions import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, renderers
from rest_framework.parsers import JSONParser
from rest_framework import viewsets, generics
from rest_framework.decorators import throttle_classes
from rest_framework import status
from django.conf import settings
from serializers import ProjectSerializer

import pdb

class ProjectListView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, format=None):  
        
        data = json.loads(request.body)
        return Response(None, status=status.HTTP_200_OK)
    def get(self, request, format=None):  
        #data = json.loads(request.body)
        pdb.set_trace()
        projects = ProjectSerializer(Project.objects.all(), many=True)
        return Response({ 'projects' : projects.data }, status=status.HTTP_200_OK)

class ProjectDetailView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, projname):  
        #pdb.set_trace()
        data = json.loads(request.body)
        return Response(None, status=status.HTTP_200_OK)
    def get(self, request, projname):  
        #pdb.set_trace()
        data = json.loads(request.body)
        if not Project.objects.filter(link=projname).exists():
            return Response('Doesn\'t exists', status=status.HTTP_404_NOT_FOUND)
        project = Project.objects.get(link=projname)
        return Response({ 'project' : project }, status=status.HTTP_200_OK)

class ConfigListView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, projname):  
        #pdb.set_trace()
        data = json.loads(request.body)
    def get(self, request, projname):
        data = json.loads(request.body)
        projname = data['projname']
        if not Project.objects.filter(link=projname).exists():
            return Response('Doesn\'t exists', status=status.HTTP_404_NOT_FOUND)

class ConfigDetailView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, projname, confname):  
        #pdb.set_trace()
        data = json.loads(request.body)
    def get(self, request, projname, confname):
        data = json.loads(request.body)
        