from rest_framework import serializers
from models import Project, Config
from django.contrib.auth.models import User

class ProjectSerializer(serializers.ModelSerializer):
	owner = serializers.Field('owner.username')
	class Meta:
		model = Project
		fields = ('id', 'owner', 'title', 'description', 'addition_date', 'changed_date') 

class ConfigSerializer(serializers.ModelSerializer):
	class Meta:
		model = Config
		fields = ('id', 'title', 'description')
