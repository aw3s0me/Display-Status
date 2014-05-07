from rest_framework.authentication import SessionAuthentication

class SuperUserAuth(SessionAuthentication):
	def authenticate(self, request):
		request = request._request
		user = getattr(request, 'username', None)

		#if not user or not user.is_active or not user.is_superuser:
			#return None
		if not username:
			return None

		try:
			user = User.objects.get(username=username)
		except User.DoesNotExist:
			raise exceptions.AuthenticationFailed('No such user')

		return (user, None)
		#self.enforce_csrf(request)
