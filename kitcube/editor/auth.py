from kitcube.authentication.helpers import get_authorization_header


def get_user_by_token(request):
    auth = get_authorization_header(request).split()
    if not auth or auth[0].lower() != b'token':
        msg = 'No token header provided.'
        return Response(msg, status=status.HTTP_400_BAD_REQUEST)
    if len(auth) == 1:
        msg = 'Invalid token header. No credentials provided.'
        return Response(msg, status=status.HTTP_400_BAD_REQUEST)
    access_token = auth[0]
    token = Token.objects.get(key=access_token)
    user = token.user
    return Response({'id': user.id , 'name': user.username, 'userRole': 'user','token': token.key})