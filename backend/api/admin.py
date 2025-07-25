from django.contrib import admin
from .models import Account, Order, Item

admin.site.register(Account)
admin.site.register(Order)
admin.site.register(Item)