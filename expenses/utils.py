from userpreferences.models import UserPreference
from .models import Expense, Category
import datetime

def get_user_currency_symbol(request_user):
    # get user currency
    try:
        user_preferences_object = UserPreference.objects.get(user=request_user)
    except UserPreference.DoesNotExist:
        user_preferences_object = UserPreference.objects.create(user=request_user)
    finally:
        user_currency_symbol = user_preferences_object.get_user_preference()
        return user_currency_symbol

# returns dictionary with valid fields and error messages
def server_validation(amount=None, date=None, category=None, description=None):

    error_messages = []
    valid_fields = {}

    # no error checking for description
    valid_fields['description'] = description

    try:
        # round to 2dp
        amount = float(amount)
        amount = round(amount, 2)
        if amount < 0:
            error_messages.append(f"please enter a positive amount.")
            valid_fields['amount'] = None
        else:
            valid_fields['amount'] = amount
    except ValueError:
        error_messages.append(f"please enter a valid amount.")
        valid_fields['amount'] = None

    try:
        date_string = str(date)
        date_format = '%Y-%m-%d'
        date_object = datetime.datetime.strptime(date_string, date_format)
        valid_fields['date'] = date_string

    except ValueError:
        error_messages.append('please enter a valid date.')
        valid_fields['date'] = None
    
    try:
        Category.objects.get(category=category)
        valid_fields['category'] = category
    except:
        error_messages.append('please select a category.')
        valid_fields['category'] = None

    valid_fields['error_messages'] = error_messages

    return valid_fields