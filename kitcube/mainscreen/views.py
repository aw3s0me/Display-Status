from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
#from mainscreen.models import Config
#from mainscreen.serializers import ConfigSerializer

class JSONResponse(HttpResponse):
    """
    An HttpResponse that renders its content into JSON.
    """
    def __init__(self, data, **kwargs):
        content = JSONRenderer().render(data)
        kwargs['content_type'] = 'application/json'
        super(JSONResponse, self).__init__(content, **kwargs)

def index(request):
    data = {
        'title': getattr(settings, 'TITLE'),
        'description': getattr(settings, 'DESCRIPTION')
    }
    response = render_to_response('mainscreen/index.html', data, context_instance=RequestContext(request))
    
    response['Access-Control-Allow-Origin'] = '*'  
    response['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'  
    response['Access-Control-Max-Age'] = '1000'  
    response['Access-Control-Allow-Headers'] = '*'  
    response['Access-Control-Allow-Credentials'] = 'true'
    return response  

"""
@csrf_exempt
def configfile(request, pk):
    try:
        config = Config.objects.get(pk=pk)
    except Config.DoesNotExist:
        return HttpResponse(status=404)
    if request.method == 'GET':
        serializer = ConfigSerializer(config)
        return JSONResponse(serializer.data)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = ConfigSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JSONResponse(serializer.data, status=201)
        return JSONResponse(serializer.errors, status=400)


    return request
"""