from django.conf.urls import patterns, url
from layout import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
)

