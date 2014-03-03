from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse


def index(request):
    data = {}
    return render_to_response('mainscreen/index.html',
        data,
        context_instance=RequestContext(request))
