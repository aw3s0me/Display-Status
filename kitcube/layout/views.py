from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.conf import settings

def index(request):
    data = {
        'title': getattr(settings, 'TITLE'),
        'description': getattr(settings, 'DESCRIPTION')
    }
    response = render_to_response('layout/index.html', data, context_instance=RequestContext(request))
    
    response['Access-Control-Allow-Origin'] = '*'  
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'  
    response['Access-Control-Max-Age'] = '1000'  
    response['Access-Control-Allow-Headers'] = '*'  
    response['Access-Control-Allow-Credentials'] = 'true'
    return response  