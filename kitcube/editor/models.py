from django.db import models

# Create your models here.
class Project(models.Model):
	owner = models.ForeignKey('auth.User', related_name = 'projects')
	#configs = CommaSeparatedIntegerField(max_length = 200)
	title = models.CharField(max_length = 200)
	description = models.TextField()
	addition_date = models.DateTimeField(auto_now_add=True)
	changed_date = models.DateTimeField(auto_now=True)

	def __str__(self):
		return self.title

class Config(models.Model):
	projects = models.ManyToManyField(Project)
	title = models.CharField(max_length = 200)
	description = models.TextField()

	def __str__(self):
		return self.title
