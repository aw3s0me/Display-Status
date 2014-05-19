from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        
        return obj.owner == request.user

#need to rewrite code according to mixins
#class ReadOnlyMixin()
#class WriteOnlyMixin()
#class ReadWriteMixin()

class ReadOnlyPermission(BasePermission):
	def has_object_permission(self, request, view, obj):
		if request.method == 'GET':
			return True
		return obj.owner == request.user

class WriteOnlyPermission(BasePermission):
	def has_object_permission(self, request, view, obj):
		if request.method == 'POST' and request.user and request.is_authenticated():
			return True
		return obj.owner == request.user

class ReadWritePermission(BasePermission):
	def has_object_permission(self, request, view, obj):
		if request.method == 'POST' or request.method == 'GET':
			return True
		return obj.owner == request.user

class AdminOnlyPermission(BasePermission):
	def has_object_permission(self, request, view, obj):
		if request.user.is_superuser:
			return True
		return obj.owner == request.user

