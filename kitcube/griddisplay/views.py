from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def test(request):
    return HttpResponse('test ok')

def index(request):
    return render(request, 'griddisplay/index.html')
