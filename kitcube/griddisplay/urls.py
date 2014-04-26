from django.conf.urls import patterns, url
from griddisplay import views


# my code starts here

urlpatterns = patterns('',
    url(r'^$', views.index),
)


