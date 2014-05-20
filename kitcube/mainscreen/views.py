from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from django.template import Context, Template, loader
from provider.datamgmt.models import Project
from provider.user.userValidation import is_user_valid_obj
import pdb
#from mainscreen.models import Config
#from mainscreen.serializers import ConfigSerializer

def get_image_url(projname):
    project = Project.objects.get(link=projname)
    return project.banner

def get_banner(projname):
    if projname == 'katrin':
        banner = loader.get_template('mainscreen/katrin_banner.html')
        #if we need to get image from database
        #banner_html = banner.render(Context({'banner_image': get_image_url(projname), 'MEDIA_URL': settings.MEDIA_URL}))
        banner_html = banner.render(Context({}))
    elif projname == 'kitcube':
        banner = loader.get_template('mainscreen/kitcube_banner.html')
        #banner_html = banner.render(Context({'banner_image': get_image_url(projname), 'MEDIA_URL': settings.MEDIA_URL}))
        banner_html = banner.render(Context({}))
    else:
        banner = loader.get_template('mainscreen/def_banner.html')
        banner_html = banner.render(Context({}))
    return banner_html

def render_user_block(user=None):
    if user == None:
        userblock = loader.get_template('mainscreen/notloggeduserblock.html')
        userblock_html = userblock.render(Context({}))
    else:
        userblock = loader.get_template('mainscreen/loggeduserblock.html')
        userblock_html = userblock.render(Context({'username': user.username}))
    return userblock_html


def mainscreen_index(request, projname=None, name=None):
    print projname
    print name
    
    banner_html = get_banner(projname)
    data = {
        'title': getattr(settings, 'TITLE'),
        'description': getattr(settings, 'DESCRIPTION'),
        'banner': banner_html,
        'project': projname,
    }
    #pdb.set_trace()
    tokenkey = request.COOKIES.get('access_token')
    if tokenkey and (len(tokenkey) > 0):
        user = is_user_valid_obj(tokenkey, projname)
        if user:
            data['userblock'] = render_user_block(user)
    else:
        data['userblock'] = render_user_block()
    response = render_to_response('mainscreen/index.html', data, context_instance=RequestContext(request))
    
    response['Access-Control-Allow-Origin'] = '*'  
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'  
    response['Access-Control-Max-Age'] = '1000'  
    response['Access-Control-Allow-Headers'] = '*'  
    response['Access-Control-Allow-Credentials'] = 'true'
    return response  
