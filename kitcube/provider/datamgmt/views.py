from django.contrib.auth.models import User, Group
from models import Project, Config
from django.conf import settings
from django.http import HttpResponse
from provider.user.permissions import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions, renderers
from rest_framework.parsers import JSONParser
from rest_framework import viewsets, generics
from rest_framework.decorators import throttle_classes
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from django.conf import settings

import os
from serializers import ProjectSerializer, ConfigSerializer
from provider.user.userValidation import is_user_valid
import json
#from django.middleware.gzip import GZipMiddleware
import cStringIO, gzip

import pdb


class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

class ProjectListView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def get(self, request, format=None):  
        #data = json.loads(request.body)
        pdb.set_trace()
        projects = ProjectSerializer(Project.objects.all(), many=True)
        return Response(projects.data, status=status.HTTP_200_OK)

class ProjectDetailView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, projname):  
        data = json.loads(request.body)
        #pdb.set_trace()
        if data['username'] and (len(data['username']) > 0) and data['token'] and (len(data['token']) > 0):
            if not is_user_valid(data['token'], projname):
                return Response('User is not valid', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Username or token hasnt been specified', status=status.HTTP_400_BAD_REQUEST)
        if not Project.objects.filter(link=projname).exists():
            return Response('Doesn\'t exists', status=status.HTTP_404_NOT_FOUND)
        project = Project.objects.get(link=projname)
        if data['title'] and (len(data['title']) > 0):
            project.title = data['title']
        if data['description'] and (len(data['description']) > 0):
            project.description = data['description']
        project.save()
        return Response(None, status=status.HTTP_202_ACCEPTED)
    def get(self, request, projname):  
        #pdb.set_trace()
        #data = json.loads(request.body)
        if not Project.objects.filter(link=projname).exists():
            return Response('Doesn\'t exists', status=status.HTTP_404_NOT_FOUND)
        proj_to_serialize = Project.objects.get(link=projname)
        project = ProjectSerializer(proj_to_serialize)
        return Response(project.data, status=status.HTTP_200_OK)

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


def dec(request, *args, **kwargs):
    response = func(request, *args, **kwargs)
    return gzip_middleware.process_response(request, response)
    return dec

class ConfigDetailView(APIView):
    model = User
    throttle_classes = ()
    permission_classes = ()
    renderer_classes = (renderers.JSONRenderer,)
    def post(self, request, projname, confname):  
        #pdb.set_trace()
        data = json.loads(request.body)
    def get(self, request, projname, confname):
        if not Config.objects.filter(projects__link=projname, name=confname).exists():
            return Response('Doesn\'t exists', status=status.HTTP_404_NOT_FOUND)
        cfg_to_serialize = Config.objects.get(projects__link=projname, name=confname)
        cfg = ConfigSerializer(cfg_to_serialize)

        path = os.path.dirname(__file__)
        file_path = os.path.join(path, 'cfgs/' + cfg_to_serialize.path)
        file = open(file_path)
        #cfg.data['content'] = json.dumps(file.read())
        cfg.data['content'] = file.read()
        print cfg.data
        #gzip_middleware = GZipMiddleware()
        #print file.read()
        #zbuf = cStringIO.StringIO()
        #zfile = gzip.GzipFile(mode='wb', compresslevel=6, fileobj=zbuf)
        #zfile.write(file.read().encode('utf-8'))
        #zfile.close()
        #print zbuf.getvalue()

        #return Response(cfg.data, status=status.HTTP_200_OK)
        return JSONResponse(cfg.data, status=status.HTTP_200_OK)
        #return gzip_middleware.process_response(response) 
        #data = json.loads(request.body)
        