from rest_framework import serializers
from .models import Account, Order, Item
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
MAX_ITEM_AMOUNT = 4

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "id"]

class AccountSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[]
    )
    class Meta:
        model = Account
        fields = ['first_name', 'last_name', 'email', 'phone_number']

class OrderCreateSerializer(serializers.Serializer):
    user = AccountSerializer()
    amount_of_items = serializers.IntegerField(min_value=1)
    
    def validate(self, data):
        user_serializer = AccountSerializer(data=data['user'])
        user_serializer.is_valid(raise_exception=True)  # this triggers validate_email!
        data['user'] = user_serializer.validated_data
        print("VALIDATED")
        return data

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
            total_items = Item.objects.filter(order__account=account).count()
            print(total_items)
            if total_items + amount_of_items >= MAX_ITEM_AMOUNT:
                # TODO ogarnac ile jeszcze mozna domówić i dać znać userowi
                raise serializers.ValidationError("Wykorzystano limit słuchawek do rezerwacji na ten adres email")
        
        order = Order.objects.create(account=account)

        for i in range(amount_of_items):
            Item.objects.create(
                order=order,
                state='zarezerwowane',
            )

        return order
    
class OrderStateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['state']

    def validate(self, value):
        allowed_states = [choice[0] for choice in Order.STATE_CHOICES]
        print(value)
        print(value["state"])
        if value["state"] not in allowed_states:
            raise serializers.ValidationError("Nieprawidłowy stan.")
        return value