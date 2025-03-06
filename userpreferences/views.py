from django.shortcuts import render
from django.conf import settings
import os
import json
from .models import UserPreference
from django.contrib import messages
from django.shortcuts import redirect
import django.core.exceptions
from django.contrib.auth.models import User
from authentication.utils import testPasswordStrength
from validate_email import validate_email
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate

# Create your views here.

@login_required(login_url='/authentication/login')
def index(request):

    try:
        user_preferences_object = UserPreference.objects.get(user=request.user)
    except UserPreference.DoesNotExist:
        user_preferences_object = UserPreference.objects.create(user=request.user)

    user_currency = user_preferences_object.get_user_preference()

    json_file_path = os.path.join(settings.BASE_DIR, 'currencies.json')
    currencies_list = []

    with open(json_file_path, 'r') as json_file:
        json_object = json_file.read()
        currencies = json.loads(json_object)

        for key, value in currencies.items():
            currency = { 'symbol' : key, 'name' : value }
            currencies_list.append(currency)

    return render(request, 'userpreferences/index.html', {'currencies' : currencies_list, 'user_currency' : user_currency})

@login_required(login_url='/authentication/login')
def change_currency(request):

    try:
        user_preferences_object = UserPreference.objects.get(user=request.user)
    except UserPreference.DoesNotExist:
        user_preferences_object = UserPreference.objects.create(user=request.user)

    if request.method == 'POST':

        selected_currency = request.POST.get('currency')
        user_preferences_object.currency = selected_currency
        user_preferences_object.save()

        messages.success(request, 'changes saved.')
        return redirect('user-preferences')

@login_required(login_url='/authentication/login')
def change_personal_particulars(request):

    if request.method == 'POST':

        error_count = 0

        new_username = request.POST.get('new-username')
        new_email = request.POST.get('new-email')
        old_password = request.POST.get('old-password')
        new_password = request.POST.get('new-password')
        cfm_password = request.POST.get('confirm-password')

        # Server side validation
        user_to_validate = authenticate(username=request.user.username, password=old_password)
        if user_to_validate is None:
            messages.error(request, 'old password incorrect.')
            error_count += 1

        if User.objects.exclude(id=request.user.id).filter(email=new_email).exists():
            messages.error(request, 'email is already taken.')
            error_count += 1
        if not validate_email(str(new_email)):
            messages.error(request, 'invalid email.')
            error_count += 1

        if not str(new_username).isalnum():
            messages.error(request, 'username should only contain alphanumeric characters.')
            error_count += 1
        if User.objects.exclude(id=request.user.id).filter(username=new_username).exists():
            messages.error(request, 'username taken.')
            error_count += 1

        password_error_messages = testPasswordStrength().test_strength(new_password)
        error_count += len(password_error_messages)

        for message in password_error_messages:
            messages.error(request, message)
        
        if new_password != cfm_password:
            messages.error(request, 'passwords do not match.')
            error_count += 1
        
        if error_count == 0:
            # update user object. upon updating, user object is different.
            # thus re-login is required
            try:
                userObj = User.objects.get(pk=request.user.id)
                userObj.username = new_username
                userObj.email = new_email
                userObj.set_password(new_password)
                userObj.save()
                
                messages.success(request, "updated information successfully. You must log in with your new credentials.")
                return redirect('login')

            except User.DoesNotExist:
                messages.warning(request, 'user does not exist. (server error)')
                return redirect('login')
            

 
    return redirect('user-preferences')
        

        
    