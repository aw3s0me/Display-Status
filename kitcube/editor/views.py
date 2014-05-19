from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.conf import settings
from rest_framework.generics import (ListCreateAPIView, RetrieveUpdateDestroyAPIView)
from provider.datamgmt.models import Project
from provider.datamgmt.serializers import ProjectSerializer
from provider.user.permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from provider.user.serializers import UserSerializer
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
    #print "TEST INDEX"
    #request.COOKIES.get('logged_in_status') #work with cookie


    response = render_to_response('editor/index.html', data)#, context_instance=RequestContext(request))
    
    #response['Access-Control-Allow-Origin'] = '*'  
    #response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'  
    #response['Access-Control-Max-Age'] = '1000'  
    #response['Access-Control-Allow-Headers'] = '*'  
    #response['Access-Control-Allow-Credentials'] = 'true'
    return response  


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

