from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

class NewUserEntry(models.Model):
    username = models.CharField(max_length=200)
    link = models.CharField(max_length=200)
    registration_date = models.DateTimeField(auto_now=True)
    valid_until_date = models.DateTimeField()
    redirect_to_proj = models.CharField(max_length=200) #there is only name of project 
    class Meta:
        app_label = 'provider'
