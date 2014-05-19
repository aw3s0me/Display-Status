from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth.models import User, Group
from django.contrib import admin
from provider.user.socialAuth import ObtainAuthToken
from provider.user.registration import SendMailView, ActivateUserView, TestRendering
from provider.user.login import LoginView, LogoutView
from provider.datamgmt.views import *
from mainscreen.views import mainscreen_index
from choice import views as ChoiceViews

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
    url(r'^api-token/register/', SendMailView.as_view()),
    #url(r'^api-token/register-oauth/', OAuthRegisterEmailView.as_view()),
    #url(r'^api-token/confirm_register/', 'editor.authentication.confirm_register'),
    url(r'^api-token/email_register/(?P<link>[^/]+)/$', ActivateUserView.as_view(), name='activate'),
    url(r'^api-token/login_reg/', LoginView.as_view()),
    url(r'^api-token/logout/', LogoutView.as_view()),
    #url(r'^api-token/get_user/', 'editor.authentication.get_user_by_token'),
    url(r'^snippets/', include('snippets.urls')),
    #url(r'^', mainscreen_index, name='index'),
    #url(r'katrin/', include('mainscreen.urls')),
    url(r'katrin/', mainscreen_index, {'name' : 'index', 'projname' : 'katrin'}),
    url(r'kitcube/', mainscreen_index, {'name' : 'index', 'projname' : 'kitcube'}),
    #url(r'^(?P<projname>\w{1,20})$', include('mainscreen.urls')),
    #url(r'^(?!editor)|(?P<projname>[^/]+)/$', mainscreen_index, name='index'),
    #url(r'^(.(?!editor))*$', mainscreen_index, name='index'),
    url(r'^$', 'choice.views.render_choice'),
    url(r'^editor/', include('editor.urls')),
    url(r'^projects/$', ProjectListView.as_view()),
    url(r'^katrin/projects/$', ProjectDetailView.as_view(), {'projname' : 'katrin'}),
    url(r'^kitcube/projects/$', ProjectDetailView.as_view(), {'projname' : 'kitcube'}),
    url(r'^katrin/configs/$', ConfigListView.as_view(), {'projname' : 'katrin'}),
    url(r'^katrin/configs/(?P<confname>[0-9]+)/$', ConfigDetailView.as_view(), {'projname' : 'katrin'}),
    url(r'^kitcube/configs/$', ConfigListView.as_view(), {'projname' : 'kitcube'}),
    url(r'^kitcube/configs/(?P<confname>[0-9]+)/$', ConfigDetailView.as_view(), {'projname' : 'kitcube'}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^test/', TestRendering.as_view()),
)

#urlpatterns += staticfiles_urlpatterns()
