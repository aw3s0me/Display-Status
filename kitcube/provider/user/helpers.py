from rest_framework.response import Response
from rest_framework import HTTP_HEADER_ENCODING
from django.utils.crypto import get_random_string

import json
import pdb


HASH_CHARACTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

def generate_new_hash_with_length(length):
    """
    Generates a random string with the alphanumerical character set and given length.
    """
    return get_random_string(length, HASH_CHARACTERS)

def get_authorization_header(request):
    """
    Return request's 'Authorization:' header, as a bytestring.

    Hide some test client ickyness where the header can be unicode.
    """
    auth = request.META.get('HTTP_AUTHORIZATION', b'')
    if type(auth) == type(''):
        # Work around django test client oddness
        auth = auth.encode(HTTP_HEADER_ENCODING)
    return auth 

def is_empty(any_structure):
    if any_structure:
        print('Structure is not empty.')
        return False
    else:
        print('Structure is empty.')
        return True

def get_first(qs):
    return qs.objects.all()[:1].get()