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
from django.conf import settings

class ProjectListView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, format=None):  
        #pdb.set_trace()
        data = json.loads(request.body)
    def get(self, request, format=None):  
        #pdb.set_trace()
        data = json.loads(request.body)

class ProjectDetailView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, format=None):  
        #pdb.set_trace()
        data = json.loads(request.body)
    def get(self, request, format=None):  
        #pdb.set_trace()
        data = json.loads(request.body)
    
class ConfigListView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, format=None):  
        #pdb.set_trace()
        data = json.loads(request.body)
    def get(self, request, format=None):
        data = json.loads(request.body)

class ConfigDetailView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, format=None):  
        #pdb.set_trace()
        data = json.loads(request.body)
    def get(self, request, format=None):
        data = json.loads(request.body)
        
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