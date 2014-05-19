from rest_framework import serializers
from models import Project
from django.contrib.auth.models import User

class ProjectSerializer(serializers.ModelSerializer):
	owner = serializers.Field('owner.username')
	class Meta:
		model = Project
		fields = ('id', 'owner', 'title', 'description', 'addition_date', 'changed_date') 
