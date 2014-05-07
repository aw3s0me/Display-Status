from django.conf.urls import patterns, url
from editor import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^projects/$', views.ProjectList.as_view()),
    url(r'^projects/(?P<pk>[0-9]+)/$', views.ProjectDetail.as_view()),
    url(r'^users/$', views.UserList.as_view()),
    url(r'^users/(?P<pk>[0-9]+)/$', views.UserDetail.as_view())
)

