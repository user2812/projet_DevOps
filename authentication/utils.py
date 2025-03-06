from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.models import AbstractBaseUser
import re

class AppTokenGenerator(PasswordResetTokenGenerator):

    # more on making hash value at: https://github.com/django/django/blob/main/django/contrib/auth/tokens.py#L8
    def _make_hash_value(self, user: AbstractBaseUser, timestamp: int) -> str:
        return str(user.is_active)+str(user.pk)+str(timestamp)

class testPasswordStrength:

    def __init__(self) -> None:
        pass

    def test_strength(self, password):

        MIN_PASSWORD_LENGTH = 8
        MAX_PASSWORD_LENGTH = 15
        error_messages = []

        if len(password) < MIN_PASSWORD_LENGTH or len(password) > MAX_PASSWORD_LENGTH:
            error_messages.append("password must have a length of 8 to 15 characters.")

        # regex pattern
        string_pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"
        regex_pattern = re.compile(string_pattern)
        if len(regex_pattern.findall(str(password))) == 0:
            error_messages.append("password must contain at least one uppercase letter, lowercase letter and one numeric digit.")
        
        return error_messages