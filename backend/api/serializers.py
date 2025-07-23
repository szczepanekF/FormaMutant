from rest_framework import serializers
from .models import Account, Order, Item
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist

MAX_ITEM_AMOUNT = 4


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "id"]


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "state", "item_real_ID"]


class AccountSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[])

    class Meta:
        model = Account
        fields = ["first_name", "last_name", "email", "phone_number"]


class OrderCreateSerializer(serializers.Serializer):
    user = AccountSerializer()
    amount_of_items = serializers.IntegerField(min_value=1)

    def validate(self, data):
        user_serializer = AccountSerializer(data=data["user"])
        user_serializer.is_valid(raise_exception=True)  # this triggers validate_email!
        data["user"] = user_serializer.validated_data
        print("VALIDATED")
        return data

    def create(self, validated_data):
        account_data = validated_data["user"]
        amount_of_items = validated_data["amount_of_items"]
        account, created = Account.objects.get_or_create(
            email=account_data["email"],
            defaults={
                "first_name": account_data["first_name"],
                "last_name": account_data["last_name"],
                "phone_number": account_data["phone_number"],
            },
        )
        if not created:
            total_items = Item.objects.filter(
                order__account=account, order__state__in=["oczekujące", "zaakceptowane"]
            ).count()
            if total_items == MAX_ITEM_AMOUNT:
                raise serializers.ValidationError(
                    "Wykorzystano limit słuchawek do rezerwacji na ten adres email"
                )
            elif total_items + amount_of_items > MAX_ITEM_AMOUNT:
                raise serializers.ValidationError(
                    f"Przekroczono dozwoloną liczbę słuchawe, dostępna liczba rezerwacji: {MAX_ITEM_AMOUNT - total_items}"
                )

        order = Order.objects.create(account=account)

        for i in range(amount_of_items):
            Item.objects.create(
                order=order,
                state="zarezerwowane",
            )

        return order


class OrderStateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["state"]

    def validate(self, value):
        allowed_states = [choice[0] for choice in Order.STATE_CHOICES]
        print(value)
        print(value["state"])
        if value["state"] not in allowed_states:
            raise serializers.ValidationError("Nieprawidłowy stan.")
        return value


class AllOrdersSerializer(serializers.ModelSerializer):
    account = AccountSerializer()
    items_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "account",
            "state",
            "creation_date",
            "modification_date",
            "items_count",
        ]

    def get_items_count(self, obj):
        return obj.items.count()

class AllItemsSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = ['id', 'token', 'state', 'item_real_ID', 'order', 'first_name', 'last_name']

    def get_first_name(self, obj):
        return obj.order.account.first_name if obj.order and obj.order.account else None

    def get_last_name(self, obj):
        return obj.order.account.last_name if obj.order and obj.order.account else None


class ItemRealIdUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["item_real_ID"]

    def validate(self, value):
        allowed_states = [choice[0] for choice in Order.STATE_CHOICES]
        print(value)
        print(value["state"])
        if value["state"] not in allowed_states:
            raise serializers.ValidationError("Nieprawidłowy stan.")
        return value
