from django.shortcuts import render
from django.template import Context, Template
from django.http import HttpResponse
from django.template.loader import get_template
from choice.processor import get_context
from django.conf.urls import patterns, url

def render_choice(request):
	t = get_template('index.html')
	html = t.render(Context(get_context(request)))
	return HttpResponse(html)

