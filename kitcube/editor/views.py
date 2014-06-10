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
from provider.user.userValidation import is_user_valid_obj, is_user_valid_obj_groups

from django.template import Context, Template, loader

#from django.views.decorators.csrf import csrf_exempt

import pdb

def render_user_block(user=None):
    #pdb.set_trace()
    if user == None:
        userblock = loader.get_template('editor/notloggeduserblock.html')
        userblock_html = userblock.render(Context({}))
    else:
        userblock = loader.get_template('editor/loggeduserblock.html')
        userblock_html = userblock.render(Context({'username': user.username}))
    return userblock_html



def index(request):
    data = {
        'title': getattr(settings, 'TITLE'),
        'description': getattr(settings, 'DESCRIPTION'),
        'csrf_token': get_token(request)
    }
    tokenkey = request.COOKIES.get('access_token')
    #pdb.set_trace()
    if tokenkey and (len(tokenkey) > 0):
        userObj = is_user_valid_obj_groups(tokenkey)
        if userObj:
            if userObj[0]:
                groups = "" #forming the list of groups that are separated by commas
                data['userblock'] = render_user_block(userObj[0])
                for group in userObj[1]:
                    groups = groups + group.name + ','
                    groups = groups[:-1]

                data['projects'] = groups
            else:
                data['userblock'] = render_user_block()
        else:
            data['userblock'] = render_user_block()
    else:
        data['userblock'] = render_user_block()

    response = render_to_response('editor/index.html', data)#, context_instance=RequestContext(request))
    
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

