from django.contrib.auth.models import User, Group
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token

def is_user_valid(tokenKey, groupname):
    if not Token.objects.filter(key=tokenKey).exists():
        return False
    token = Token.objects.get(key=tokenKey)
    if not User.objects.filter(id=token.user_id).exists():
        return False
    user = User.objects.get(id=token.user_id)
    if not Group.objects.filter(name=groupname).exists(): 
        return False
    group = Group.objects.get(name=groupname).user_set.all()
    if user and user.is_active and (user in group):
        return True
    else:
        return False

def is_user_valid_obj(tokenKey, groupname):
    if not Token.objects.filter(key=tokenKey).exists():
        return False
    token = Token.objects.get(key=tokenKey)
    if not User.objects.filter(id=token.user_id).exists():
        return False
    user = User.objects.get(id=token.user_id)
    if not Group.objects.filter(name=groupname).exists(): 
        return False
    group = Group.objects.get(name=groupname).user_set.all()
    if user and user.is_active and (user in group):
        return user
    else:
        return False

def is_user_valid_obj_groups(tokenKey):
    if not Token.objects.filter(key=tokenKey).exists():
        return False
    token = Token.objects.get(key=tokenKey)
    if not User.objects.filter(id=token.user_id).exists():
        return False
    user = User.objects.get(id=token.user_id)
    groups = user.groups.all()
    if user and user.is_active:
        return (user, groups)
    else:
        return False

def check_user_token(tokenKey):
    if not Token.objects.filter(key=tokenKey).exists():
        return False
    token = Token.objects.get(key=tokenKey)
    if not User.objects.filter(id=token.user_id).exists():
        return False
    user = User.objects.get(id=token.user_id)
    if user and user.is_active:
        return user
    else:
        return False


