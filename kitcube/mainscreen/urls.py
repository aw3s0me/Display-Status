from django.conf.urls import patterns, url
from mainscreen import views

urlpatterns = patterns('',
    #url(r'^(?P<projname>\w+)$', views.index, name='index'),
    url(r'^$', views.index, name='index'),
)

