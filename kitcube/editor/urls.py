from django.conf.urls import patterns, url
from provider.datamgmt.views import * 
from editor.views import index

urlpatterns = patterns('',
    url(r'^$', index, name='index'),
)


