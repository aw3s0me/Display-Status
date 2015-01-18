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

def get_logo(projname):
    if projname == 'katrin':
        logo = loader.get_template('mainscreen/katrin_logo.html')
    elif projname == 'kitcube':
        logo = loader.get_template('mainscreen/kitcube_logo.html')
    logo_html = logo.render(Context({}))
    return logo_html

def get_banner(projname, user):
    user_panel_html = render_user_panel(user)
    banner = loader.get_template('mainscreen/banner.html')
    logo = get_logo(projname)
    banner_html = banner.render(Context({'user_panel': user_panel_html, 'logo': logo }))
    #if projname == 'katrin':
        #banner = loader.get_template('mainscreen/katrin_banner.html')

        #if we need to get image from database
        #banner_html = banner.render(Context({'banner_image': get_image_url(projname), 'MEDIA_URL': settings.MEDIA_URL}))
        #banner_html = banner.render(Context({'userPanel': user_panel_html}))
    #elif projname == 'kitcube':

        #banner = loader.get_template('mainscreen/kitcube_banner.html')
        #banner_html = banner.render(Context({'banner_image': get_image_url(projname), 'MEDIA_URL': settings.MEDIA_URL}))
        #banner_html = banner.render(Context({'userPanel': user_panel_html}))
    #else:
        #banner = loader.get_template('mainscreen/def_banner.html')
        #banner_html = banner.render(Context({}))
    return banner_html

def render_user_panel(user=None):
    #pdb.set_trace()
    user_panel = loader.get_template('mainscreen/user_panel.html')
    if user == None:
        user_panel_html = user_panel.render(Context({ 'user': '' }))
    else:
        user_panel_html = user_panel.render(Context({ 'user': user }))
    return user_panel_html


def mainscreen_index(request, projname=None, name=None):
    tokenkey = request.COOKIES.get('access_token')
    user = None
    if tokenkey and (len(tokenkey) > 0):
        user = is_user_valid_obj(tokenkey, projname)

    banner_html = get_banner(projname, user)
    data = {
        'title': getattr(settings, 'TITLE'),
        'description': getattr(settings, 'DESCRIPTION'),
        'banner': banner_html,
        'project': projname,
    }
    #pdb.set_trace()
    
        
    response = render_to_response('mainscreen/index.html', data, context_instance=RequestContext(request))
    
    response['Access-Control-Allow-Origin'] = '*'  
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'  
    response['Access-Control-Max-Age'] = '1000'  
    response['Access-Control-Allow-Headers'] = '*'  
    response['Access-Control-Allow-Credentials'] = 'true'
    return response  
