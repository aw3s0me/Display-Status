from django.shortcuts import render
from django.template import Context, Template
from django.http import HttpResponse

def render_choice(request):
	t = Template("<html></html>") 
	html = t.render(Context({'field1': 'val1'}))
	return HttpResponse(html)