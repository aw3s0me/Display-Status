from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

from django.contrib import admin
admin.autodiscover()


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'kitcube.views.home', name='home'),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^snippets/', include('snippets.urls')),
    url(r'^$', include('mainscreen.urls')),
    url(r'^layout/', include('layout.urls')),
    url(r'^admin/', include(admin.site.urls))
)

urlpatterns += staticfiles_urlpatterns()
