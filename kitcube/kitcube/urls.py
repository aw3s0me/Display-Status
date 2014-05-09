from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.models import User, Group
from django.contrib import admin
from editor.oauthauth import ObtainAuthToken

admin.autodiscover()

from rest_framework import viewsets, routers
from rest_framework import permissions

from oauth2_provider.ext.rest_framework import TokenHasReadWriteScope, TokenHasScope

class UserViewSet(viewsets.ModelViewSet):
	permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]
	model = User

class GroupViewSet(viewsets.ModelViewSet):
	permission_classes = [permissions.IsAuthenticated, TokenHasScope]
	required_scopes = ['groups']
	model = Group

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)

"""
router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
"""

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'kitcube.views.home', name='home'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-token/login/(?P<backend>[^/]+)/$', ObtainAuthToken.as_view()),
    #url(r'^api-token/login/(?P<backend>[^/]+)/$', 'editor.oauthauth.ObtainAuthToken'),
    url(r'^snippets/', include('snippets.urls')),
    #url(r'^accounts/login/$', 'django.contrib.auth.views.login'),
    #url(regex=r'^accounts/login/$',view='django.contrib.auth.views.login',kwargs={'template_name': 'example/login.html'}),
    #url(r'^', include(router.urls)),
    #url(r'^', include(router.urls)),
    #url(r'^oauth2/', include('provider.oauth2.urls', namespace='oauth2')),
    url(r'^$', include('mainscreen.urls')),
    url(r'^editor/', include('editor.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
)

#urlpatterns += staticfiles_urlpatterns()
