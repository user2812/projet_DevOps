from django.shortcuts import render, redirect
from django.views import View
import json
from django.http import JsonResponse
from django.contrib.auth.models import User
from validate_email import validate_email
from django.contrib import messages
from django.core.mail import EmailMessage

from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str

from .utils import AppTokenGenerator, testPasswordStrength
from django.contrib.auth.tokens import PasswordResetTokenGenerator
import re
from django.contrib.auth import authenticate, login, logout
import threading

from django.conf import settings
import os

# Create your views here.

class EmailThread(threading.Thread):
    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)
    
    def run(self):
        self.email.send(fail_silently=False)


class EmailValidationView(View):
    def post(self, request):
        data = json.loads(request.body)
        email = data.get('email')
        if not validate_email(email):
            return JsonResponse({'email_error': 'invalid email.'}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'email_error': 'email is already taken.'}, status=409)
        return JsonResponse({'email_valid': 'looks good!'})

class UsernameValidationView(View):
    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        if not str(username).isalnum():
            return JsonResponse({'username_error': 'username should only contain alphanumeric characters.'}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({'username_error': 'username taken.'}, status=409)
        return JsonResponse({'username_valid': 'looks good!'})

class PasswordValidationView(View):
    def post(self, request):
        data = json.loads(request.body)
        password = str(data.get('password'))

        # regex pattern
        string_pattern = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$"
        regex_pattern = re.compile(string_pattern)

        if len(password) < 8 or len(password) > 15:
            return JsonResponse({'password_error': 'password must have a length of 8 to 15 characters.'}, status=400)

        if len(regex_pattern.findall(password)) == 0:
            return JsonResponse({'password_error': 'password must contain at least one uppercase letter, lowercase letter and one numeric digit.'}, status=400)

        return JsonResponse({'password_valid': 'looks good!'})


class RegistrationView(View):
    def get(self, request):
        return render(request, 'authentication/register.html')

    def post(self, request):

        error_count = 0

        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Server side validation
        if User.objects.filter(email=email).exists():
            messages.error(request, 'email is already taken.')
            error_count += 1
        if not validate_email(str(email)):
            messages.error(request, 'invalid email.')
            error_count += 1

        if not str(username).isalnum():
            messages.error(request, 'username should only contain alphanumeric characters.')
            error_count += 1
        if User.objects.filter(username=username).exists():
            messages.error(request, 'username taken.')
            error_count += 1

        password_error_messages = testPasswordStrength().test_strength(password)
        error_count += len(password_error_messages)

        for message in password_error_messages:
            messages.error(request, message)
        
        if error_count == 0:
            # Validation completed. Update Database.
            new_user = User.objects.create_user(username=username, email=email, password=password)
            new_user.is_active = False

            # URI path to UserActivationView class.
            # Users click on link in email inbox to activate account.
            current_site = get_current_site(request)
            current_site_domain = current_site.domain

            # user primary key is a unique user id
            uidb64_encoded = urlsafe_base64_encode(force_bytes(new_user.pk)) 
            token_generator = AppTokenGenerator()
            

            verification_link = reverse('activate-user', kwargs={'uidb64' : uidb64_encoded, 'token' : token_generator.make_token(new_user)})
            full_url_link = str('http://'+current_site_domain+verification_link)

            message_body = f"Welcome {new_user.username}!\n\nThanks for signing up with Fat Cat!\n\nYou must follow this link to activate your account: {full_url_link}"

            # Email Message
            activation_email = EmailMessage(
                '[Fat Cat] Confirm Your E-mail Address', 
                message_body,
                'lohzy@outlook.com',
                [str(email)], 
                reply_to=['helpdesk@fatcat.com'],
            )

            # To debug if email send is unsuccessful
            try:
                EmailThread(activation_email).start()
                messages.success(request, 'account successfully created. Verify your account using your email address.')
                new_user.save()
            except:
                messages.warning(request, 'failed to send email. account activation unsuccessful.')
                new_user.delete()
            finally:
                context = { 'fieldValues' : None }

        else:
            context = { 'fieldValues' : request.POST }
            return render(request, 'authentication/register.html', context)
        
        return render(request, 'authentication/register.html', context)


class UserActivationView(View):
    def get(self, request, uidb64, token):

        try:

            uid = int(force_str(urlsafe_base64_decode(uidb64)))
            user = User.objects.get(pk=uid)
            token_generator = AppTokenGenerator()

            if token_generator.check_token(user, token) and not user.is_active:
                user.is_active = True
                user.save()
                messages.success(request, 'account activated successfully.')
        
        except Exception as e:
            pass
        finally:
            return redirect('login')

class LoginView(View):
    def get(self, request):
        return render(request, 'authentication/login.html')

    def post(self, request):

        username = request.POST.get('username')
        password = request.POST.get('password')

        if not username or not password:
            messages.error(request, 'please ensure that all fields are filled.')
        else:
            # read about authentication methods at https://docs.djangoproject.com/en/4.1/topics/auth/default/
            #NOTE: to authenticate successfully, username, password, and is_active must ALL be present/correct.
            user = authenticate(username=username, password=password)

            if user:

                # Configure user session (May not work in Chrome)
                if request.POST.__contains__('remember-me'):
                    settings.SESSION_EXPIRE_AT_BROWSER_CLOSE = False
                else:
                    settings.SESSION_EXPIRE_AT_BROWSER_CLOSE = True


                login(request, user)
                messages.success(request, f"Welcome, {user.get_username()}! You are successfully logged in.")
                return redirect('overview')

            else:
                potential_user_list = User.objects.filter(username=username)

                if len(potential_user_list) == 0:
                    # username entered wrongly
                    messages.error(request, 'invalid username and/or password.')
                else:
                    if (potential_user_list.first().is_active):
                        # password entered wrongly
                        messages.error(request, 'invalid username and/or password.')
                    else:
                        # username and password correct, but account not activated.
                        messages.error(request, 'please activate your account via the link in the email sent.')
            
        return redirect('login')

class LogoutView(View):
    def post(self, request):
        logout(request)
        messages.success(request, f"You have logged out successfully.")
        return redirect('login')

class ForgotPassword(View):
    def get(self, request):
        return render(request, 'authentication/forgot_password.html')
    
    def post(self, request):

        email = request.POST.get('email')

        if not validate_email(email):
            messages.error(request, "please enter a valid email.")
            return render(request, 'authentication/forgot_password.html', { "emailFieldValue": email })

        elif len(User.objects.filter(email=email)) == 0:
            messages.error(request, "this email is not registered with any existing account.")
            return render(request, 'authentication/forgot_password.html', { "emailFieldValue": email })
        
        else:
        
            user_obj = User.objects.get(email=email)
            current_site_domain = get_current_site(request).domain
            uidb64_encoded = urlsafe_base64_encode(force_bytes(user_obj.pk))
            token = PasswordResetTokenGenerator().make_token(user_obj)

            reset_link = reverse('reset-password', kwargs={'uidb64' : uidb64_encoded, 'token' : token})
            full_url_link = str('http://'+current_site_domain+reset_link)

            message_body = f"Hi {user_obj.username}!\n\nWe heard that you lost your password. But no worries!\n\nYou can use the following link to reset your password: {full_url_link}"

            # Email Message
            activation_email = EmailMessage(
                '[Fat Cat] Reset Your Password', 
                message_body,
                os.environ.get('EMAIL_HOST_USER'),
                [str(email)], 
                reply_to=['helpdesk@fatcat.com'],
            )

            # To debug if email send is unsuccessful
            try:
                EmailThread(activation_email).start()
                messages.success(request, 'reset link sent to your email successfully.')
                return redirect('forgot-password')
            except:
                messages.warning(request, 'failed to send email. (server error)')
                return render(request, 'authentication/forgot_password.html', { "emailFieldValue": email })

class ResetPassword(View):
    def get(self, request, uidb64, token):

        try:
            uid = int(force_str(urlsafe_base64_decode(uidb64)))
            user = User.objects.get(pk=uid)

            token_generator = PasswordResetTokenGenerator()
            
            if not token_generator.check_token(user, token):
                messages.error(request, "reset link invalid. please request a new link.")
                return redirect('login')
            else:
                return render(request, 'authentication/reset_password.html', {'tk': token, 'uid': uidb64, 'user': user })
        except:
            # if token or uid is invalid, such as a malicious user key in url manually
            messages.error(request, "error getting user identity.")
            return redirect('login')
    
    def post(self, request, uidb64, token):

        password = request.POST.get('password')
        confirm_password = request.POST.get('confirm-password')


        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            context = {'tk': token, 'uid': uidb64, 'user': user }

            if confirm_password != password:
                messages.error(request, "passwords do not match.")
                return render(request, 'authentication/reset_password.html', context)
        
            password_error_messages = testPasswordStrength().test_strength(password)

            if len(password_error_messages) != 0:
                for message in password_error_messages:
                    messages.error(request, message)
                return render(request, 'authentication/reset_password.html', context)

            user.set_password(password)
            user.save()

            messages.success(request, "password reset successfully.")
            return redirect('login')

        except:
            messages.warning(request, "error getting user identity. (server error)")
            return render(request, 'authentication/reset_password.html')