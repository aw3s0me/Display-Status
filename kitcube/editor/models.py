from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# Create your models here.
class Project(models.Model):
	owner = models.ForeignKey('auth.User', related_name = 'projects')
	#configs = CommaSeparatedIntegerField(max_length = 200)
	title = models.CharField(max_length = 200)
	link = models.CharField(max_length=20)
	description = models.TextField()
	addition_date = models.DateTimeField(auto_now_add=True)
	changed_date = models.DateTimeField(auto_now=True)
	banner = models.TextField(default='default')

	def __str__(self):
		return self.title
	@classmethod
	def create(self, ownerid, title, link, desc, banner=None):
		owner = User.objects.get(pk=ownerid)
		book = self(owner=owner, title=title, link=link, description=desc, banner=banner)
		return book

class Config(models.Model):
	projects = models.ManyToManyField(Project)
	title = models.CharField(max_length = 200)
	description = models.TextField()

	def __str__(self):
		return self.title

class NewUserEntry(models.Model):
	username = models.CharField(max_length=200)
	link = models.CharField(max_length=200)
	registration_date = models.DateTimeField(auto_now=True)
	valid_until_date = models.DateTimeField()
	redirect_to_proj = models.CharField(max_length=200) #there is only name of project
