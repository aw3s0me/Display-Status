from rest_framework import serializers
from editor.models import Project
from django.contrib.auth.models import User

class ProjectSerializer(serializers.ModelSerializer):
	owner = serializers.Field('owner.username')
	class Meta:
		model = Project
		fields = ('id', 'owner', 'title', 'description', 'addition_date', 'changed_date')


class UserSerializer(serializers.ModelSerializer):
	#projects = serializers.PrimaryKeyRelatedField(many=True)

	class Meta:
		model = User
		#fields = ('id', 'username', 'projects')
		fields = ('id', 'username', 'password', 'email')