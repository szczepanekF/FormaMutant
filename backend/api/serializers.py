from rest_framework import serializers
from .models import Account, Order, Item
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "id"]

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['first_name', 'last_name', 'email', 'phone_number']


class OrderCreateSerializer(serializers.Serializer):
    user = AccountSerializer()
    amount_of_items = serializers.IntegerField(min_value=1)

    def create(self, validated_data):
        account_data = validated_data['user']
        amount_of_items = validated_data['amount_of_items']
        account, created = Account.objects.get_or_create(
            email=account_data['email'],
            defaults={
                'first_name': account_data['first_name'],
                'last_name': account_data['last_name'],
                'phone_number': account_data['phone_number'],
            }
        )
        if not created:
            # Optionally update fields if changed
            updated = False
            if account.first_name != account_data['first_name']:
                account.first_name = account_data['first_name']
                updated = True
            if account.last_name != account_data['last_name']:
                account.last_name = account_data['last_name']
                updated = True
            if str(account.phone_number) != str(account_data['phone_number']):
                account.phone_number = account_data['phone_number']
                updated = True
            if updated:
                account.save()
        order = Order.objects.create(account=account)

        for i in range(amount_of_items):
            Item.objects.create(
                order=order,
                state='zarezerwowane',
            )

        return order