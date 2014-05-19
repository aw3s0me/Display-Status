from django.conf.urls import patterns, url
from provider.datamgmt.views import * 
from editor.views import index

urlpatterns = patterns('',
    url(r'^$', index, name='index'),
    url(r'^projects/$', ProjectListView.as_view()),
    url(r'^projects/(?P<pk>[0-9]+)/$', ProjectDetailView.as_view()),
)


