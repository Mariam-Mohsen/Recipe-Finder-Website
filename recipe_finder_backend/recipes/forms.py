from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.models import User
from .models import Recipe
        
from .models import UserProfile

class SignUpForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput, label='Confirm password')

    class Meta:
        model = User
        fields = ('username', 'email')

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        password2 = cleaned_data.get('password2')
        if password and password2 and password != password2:
            self.add_error('password2', "Passwords do not match")
        return cleaned_data

class LoginForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)

class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        fields = ['title', 'description', 'ingredients', 'instructions', 'image_url']


class ProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        fields = ['photo']