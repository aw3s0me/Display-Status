from rest_framework import serializers
from provider.datamgmt.models import Project
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    #projects = serializers.PrimaryKeyRelatedField(many=True)

    class Meta:
        model = User
        #fields = ('id', 'username', 'projects')
        fields = ('id', 'username', 'password', 'email') 
