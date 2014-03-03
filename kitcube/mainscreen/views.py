from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.conf import settings


def index(request):
    data = {
        'title': getattr(settings, 'TITLE'),
        'description': getattr(settings, 'DESCRIPTION')
    }
    return render_to_response('mainscreen/index.html',
        data,
        context_instance=RequestContext(request))
