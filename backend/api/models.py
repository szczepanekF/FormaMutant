from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

# Create your models here.
class Account(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True) ## TODO add regex
    phone_number = models.CharField(      
            validators=[
                RegexValidator(
                    r'^(?:\+48)?\d{9}$', message=("Nieprawidłowy numer telefonu. Wprowadź 9-cyfrowy numer, opcjonalnie poprzedzony kodem kraju +48."))
            ])

    def __str__(self):
        return f"""USER
    Imie: {self.first_name}
    Nazwisko: {self.last_name}
    Email: {self.email}
    Numer telefonu: {self.phone_number}"""

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class Order(models.Model):
    STATE_CHOICES = [
        ('oczekujące', 'Oczekujące'),
        ('zaakceptowane', 'Zaakceptowane'),
        ('anulowane', 'Anulowane'),
    ]

    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='orders')
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='oczekujące')
    creation_date = models.DateTimeField(auto_now_add=True)
    modification_date = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order #{self.id} for {self.account.email} - State: {self.state}"
    
class Item(models.Model):
    STATE_CHOICES = [
        ('zarezerwowane', 'Zarezerwowane'),
        ('wydane', 'Wydane'),
        ('zwrócone', 'Zwrócone'),
        ('zgubione', 'Zgubione'),
        ('uszkodzone', 'Uszkodzone'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default='zarezerwowane')
    item_real_ID = models.CharField(max_length=100, default="")
 

    def __str__(self):
        return f"Item {self.name} (x{self.quantity}) in Order #{self.order.id} - State: {self.state}"
        