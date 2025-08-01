from rest_framework import serializers
from .models import Account, Order, Item, MAX_ITEM_AMOUNT
from django.contrib.auth.models import User
from django.db.models import Sum
from django.utils.timezone import now
from datetime import datetime

MAX_ITEM_AMOUNT = 1


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "id"]


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "state", "item_real_ID"]


class AccountSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[],
        required=True,
        error_messages={
            "invalid": ("Wprowadź poprawny adres e-mail"),
            "required": ("Adres e-mail jest wymagany"),
        },
    )
    first_name = serializers.CharField(
        max_length=50,
        required=True,
        error_messages={
            "max_length": ("Imię musi być krótsze niż 50 znaków"),
            "required": ("Imię jest wymagane"),
        },
    )
    last_name = serializers.CharField(
        max_length=50,
        required=True,
        error_messages={
            "max_length": ("Nazwisko musi być krótsze niż 50 znaków"),
            "required": ("Nazwisko jest wymagane"),
        },
    )
    phone_number = serializers.CharField(
        required=True,
        error_messages={
            "required": ("Numer telefonu jest wymagany"),
        },
    )

    class Meta:
        model = Account
        fields = ["first_name", "last_name", "email", "phone_number"]


class OrderCreateSerializer(serializers.Serializer):
    user = AccountSerializer()
    items_count = serializers.IntegerField(
        min_value=1,
        error_messages={
            "min_value": ("Liczba słuchawek musi być większa niż zero"),
            "required": ("Podaj liczbę słuchawek"),
        },
    )

    def validate(self, data):
        user_serializer = AccountSerializer(data=data["user"])
        user_serializer.is_valid(raise_exception=True)
        data["user"] = user_serializer.validated_data
        return data

    def create(self, validated_data):
        account_data = validated_data["user"]
        items_count = validated_data["items_count"]

        account, _ = Account.objects.get_or_create(
            email=account_data["email"],
            defaults={
                "first_name": account_data["first_name"],
                "last_name": account_data["last_name"],
                "phone_number": account_data["phone_number"],
            },
        )
        min_allowed_date = datetime(2025, 8, 20, tzinfo=now().tzinfo)
        print(min_allowed_date.strftime("%d %m %Y"))
        if now() > min_allowed_date:
            raise serializers.ValidationError(
                f"Rejestracja zamówień była możliwa do {min_allowed_date.strftime("%d.%m.%Y")}"
            )

            # For other MAX_ITEM_AMOUNT than 1
        total_items = (
            Order.objects.filter(account=account)
            .exclude(state="anulowane")
            .aggregate(total=Sum("items_count"))
            .get("total")
            or 0
        )
        if total_items + items_count > MAX_ITEM_AMOUNT:
            raise serializers.ValidationError(
                f"Istnieje już rezerwacja dla tego adresu e-mail"
            )

        order = Order.objects.create(account=account, items_count=items_count)
        return order


class OrderStateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["state"]

    def validate(self, value):
        allowed_states = [choice[0] for choice in Order.STATE_CHOICES]
        if value["state"] not in allowed_states:
            raise serializers.ValidationError("Nieprawidłowy stan")
        return value

    def update(sllef, instance, validated_data):
        new_state = validated_data.get("state")

        if new_state == "zaakceptowane" and instance.items.count() == 0:
            for _ in range(instance.items_count):
                Item.objects.create(
                    order=instance,
                    state="zarezerwowane",
                )
        instance.state = new_state
        instance.save()
        return instance


class AllOrdersSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Order
        fields = [
            "id",
            "account",
            "state",
            "creation_date",
            "modification_date",
            "items_count",
            "order_code",
        ]


class AllItemsSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            "id",
            "token",
            "state",
            "item_real_ID",
            "order",
            "first_name",
            "last_name",
        ]

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
        if value["state"] not in allowed_states:
            raise serializers.ValidationError("Nieprawidłowy stan")
        return value
