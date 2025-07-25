import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator, MaxValueValidator
from django.utils.timezone import now

MAX_ITEM_AMOUNT = 4

class Account(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True) 
    phone_number = models.CharField(
        validators=[
            RegexValidator(
                r"^(?:\+48)?\d{9}$",
                message=(
                    "Nieprawidłowy numer telefonu. Wprowadź 9-cyfrowy numer, opcjonalnie poprzedzony kodem kraju +48."
                ),
            )
        ]
    )

    def __str__(self):
        return f"""USER
    Imie: {self.first_name}
    Nazwisko: {self.last_name}
    Email: {self.email}
    Numer telefonu: {self.phone_number}"""

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

class Order(models.Model):
    STATE_CHOICES = [
        ("oczekujące", "Oczekujące"),
        ("zaakceptowane", "Zaakceptowane"),
        ("anulowane", "Anulowane"),
    ]

    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name="orders"
    )
    state = models.CharField(max_length=20, choices=STATE_CHOICES, default="oczekujące")
    items_count = models.PositiveSmallIntegerField(
        default=1, validators=[MaxValueValidator(MAX_ITEM_AMOUNT)]
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    modification_date = models.DateTimeField(auto_now=True)
    order_code = models.CharField(
        max_length=32, unique=True, blank=True, editable=False
    )

    def save(self, *args, **kwargs):
        if not self.order_code:
            today_str = now().strftime("%Y%m%d")
            short_uuid = uuid.uuid4().hex[:4].upper()
            self.order_code = f"ZAM-{today_str}-{short_uuid}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order #{self.order_code} for {self.account} - State: {self.state}"


def generate_token():
    return uuid.uuid4().hex


class Item(models.Model):
    STATE_CHOICES = [
        ("zarezerwowane", "Zarezerwowane"),
        ("wydane", "Wydane"),
        ("zwrócone", "Zwrócone"),
        ("zgubione", "Zgubione"),
        ("uszkodzone", "Uszkodzone"),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    token = models.CharField(
        max_length=32, unique=True, default=generate_token, editable=False
    )
    state = models.CharField(
        max_length=20, choices=STATE_CHOICES, default="zarezerwowane"
    )
    item_real_ID = models.CharField(max_length=100, default="", unique=True)

    def __str__(self):
        return f"Item - Order: {self.order}, Token: {self.token}, Assigned_ID: {self.item_real_ID}, State: {self.state}"
