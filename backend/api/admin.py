from django.contrib import admin
from .models import Account, Admin, Order, Item

admin.site.register(Account)
admin.site.register(Admin)
admin.site.register(Order)
admin.site.register(Item)