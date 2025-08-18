import time
from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from django_q.tasks import async_task
from django.utils.timezone import now
from datetime import datetime

from .serializers import (
    AccountSerializer,
    OrderCreateSerializer,
    UserSerializer,
    OrderStateUpdateSerializer,
    AllItemsSerializer,
    AllOrdersSerializer,
)
from .models import Item, Order


# Create your views here.
class CookieTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        try:
            data = request.data.copy()
            refresh = request.COOKIES.get("refresh")
            data["refresh"] = refresh
            if not refresh:
                return Response(
                    {"refreshed": False, "reason": "No refresh token provided"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            request._full_data = data
            response = super().post(request, *args, **kwargs)
            data = response.data
            access = data["access"]
            response = Response({"refreshed": True})

            response.set_cookie(
                key="access",
                value=access,
                httponly=True,
                secure=True,
                samesite="None",
                path="/",
            )
            return response

        except Exception as e:
            return Response(
                {"refreshed": False, "reason": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        ip_address = request.META.get("HTTP_X_FORWARDED_FOR")
        if ip_address:
            ip_address = ip_address.split(",")[0]
        else:
            ip_address = request.META.get("REMOTE_ADDR")
        try:
            response = super().post(request, *args, **kwargs)
            data = response.data
            access = data["access"]
            refresh = data["refresh"]
            response = Response({"success": True})

            response.set_cookie(
                key="access",
                value=f"{access}",
                httponly=True,
                secure=True,
                samesite="None",
                path="/",
            )

            response.set_cookie(
                key="refresh",
                value=f"{refresh}",
                httponly=True,
                secure=True,
                samesite="None",
                path="/",
            )
            return response
        except Exception as e:
            return Response(
                {"success": False, "reason": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        res = Response({"success": True})
        res.delete_cookie("access", path="/", samesite="None")
        res.delete_cookie("refresh", path="/", samesite="None")
        return res
    except Exception as e:
        return Response(
            {"succes": False, "reason": str(e)}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def is_logged_in(request):
    serializer = UserSerializer(request.user, many=False)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def is_admin(request):
    return Response({"is_admin": request.user.is_superuser})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_all_order(requests):
    try:
        orders = Order.objects.all().prefetch_related("items").select_related("account")
        serializer = AllOrdersSerializer(orders, many=True)
    except Exception as e:
        return Response(
            {"reason": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_order(requests, id):
    try:
        order = get_object_or_404(
            Order.objects.select_related("account").prefetch_related("items"),
            pk=id,
        )
        serializer = AllOrdersSerializer(order)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"reason": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_all_items(request):
    items = Item.objects.select_related("order__account")
    serializer = AllItemsSerializer(items, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_account_with_token(request, token):
    try:
        item = Item.objects.select_related("order__account").get(token=token)
    except Item.DoesNotExist:
        return Response(
            {"reason": f'Nie znaleziono słuchawek o numerze "{token}"'},
            status=status.HTTP_404_NOT_FOUND,
        )
    if item.state is None or item.state != "zarezerwowane":
        return Response(
            {"reason": 'Słuchawki muszą w stanie "zarezerwowane"'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    account = item.order.account
    serializer = AccountSerializer(account)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_account_with_number(request, number):
    try:
        item = Item.objects.select_related("order__account").get(item_real_ID=number)
    except Item.DoesNotExist:
        return Response(
            {"reason": f'Nie znaleziono słuchawek o numerze "{number}"'},
            status=status.HTTP_404_NOT_FOUND,
        )
    except Exception as e:
        return Response(
            {"reason": f"Unexpected error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if item.state is None or item.state != "wydane":
        return Response(
            {"reason": f'Słuchawki muszą być "wydane"'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    account = item.order.account
    return Response(
        {
            "first_name": account.first_name,
            "last_name": account.last_name,
            "email": account.email,
            "phone_number": account.phone_number,
            "token": item.token,
        }
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def create_order(request):
    max_allowed_date = datetime(2025, 8, 21, 23, 59, 59, tzinfo=now().tzinfo)
    print(max_allowed_date.strftime("%H:%M:%S %d %m %Y"))
    if now() > max_allowed_date:
        return Response(
            {"reason": f"Rejestracja zamówień była możliwa do {max_allowed_date.strftime("%H:%M:%S dnia %d.%m.%Y")}"}, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        serializer = OrderCreateSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            order = serializer.save()
            async_task(
                "api.utils.send_payment_mail",
                order.account,
                order.order_code,
                order.items_count,
            )
            return Response(
                {
                    "order_id": order.id,
                    "account_email": order.account.email,
                    "items_count": order.items_count,
                },
                status=status.HTTP_201_CREATED,
            )
    except Exception as e:
        return Response(
            {"reason": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([IsAdminUser])
def change_order_state(request, order_id):

    try:
        order = (
            Order.objects.select_related("account")
            .prefetch_related("items")
            .get(id=order_id)
        )
    except Order.DoesNotExist:
        return Response(
            {"reason": f"Nie znaleziono zamówienia o id {order_id}"},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = OrderStateUpdateSerializer(order, data=request.data, partial=True)
    try:
        if serializer.is_valid(raise_exception=True):
            old_state = order.state
            if old_state != "oczekujące":
                raise Exception(
                    "Nie można zmienić stanu zamówienia, które nie jest oczekujące"
                )
            serializer.save()
            new_state = serializer.validated_data.get("state")
            if new_state != old_state:
                if new_state == "zaakceptowane":
                    async_task(
                        "api.utils.send_confirmation_mail",
                        order.account,
                        order.order_code,
                        order.items.values_list("token", flat=True),
                    )
                elif new_state == "anulowane":
                    async_task(
                        "api.utils.send_cancellation_mail",
                        order.account,
                        order.order_code,
                    )
            return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(
            {"reason": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def set_item_state(request, token):
    try:
        item = Item.objects.select_related("order__account").get(token=token)
    except Item.DoesNotExist:
        return Response({"reason": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

    new_state = request.data.get("state")
    if not new_state:
        return Response(
            {"reason": "item_real_ID field is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if item.state != "wydane":
        return Response(
            {"reason": 'Słuchawki muszą być w stanie "wydane"'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if new_state == "zgubione" or new_state == "uszkodzone":
        async_task(
            "api.utils.send_lost_or_broken_item_payment_mail",
            item.order.account,
            item.item_real_ID,
            new_state,
        )

    item.state = new_state
    item.save()
    return Response({"message": "item_real_ID updated successfully"})


@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def set_item_number(request, token):
    print(request.data)
    try:
        item = Item.objects.get(token=token)
    except Item.DoesNotExist:
        return Response(
            {"reason": "Nie znaleziono przedmiotu dla tokenu:"},
            status=status.HTTP_404_NOT_FOUND,
        )

    new_state = request.data.get("state")
    if not new_state:
        return Response(
            {"reason": "Pole stan jest wymagane"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    number = request.data.get("number")
    if not number:
        return Response(
            {"reason": "Pole numer jest wymagane"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if item.item_real_ID is not None:
        return Response(
            {"reason": f"Przedmiot posiada już przypisany numer"},
            status=status.HTTP_409_CONFLICT,
        )
    if item.state != "zarezerwowane":
        return Response(
            {"reason": 'Słuchawki muszą być w stanie "zarezerwowane"'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        item.state = new_state
        item.item_real_ID = number
        item.save()
        return Response({"message": "Pomyślnie uakualniono numer przedmiotu"})
    except IntegrityError as e:
        return Response(
            {"reason": f"Istnieje już przedmiot o takim numerze"},
            status=status.HTTP_409_CONFLICT,
        )
    except Exception as e:
        return Response(
            {"reason": f"An error occurred while updating item_real_ID: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["POST"])
@permission_classes([IsAdminUser])
def send_order_reminder(request, id):
    try:
        order = (
            Order.objects.select_related("account").prefetch_related("items").get(id=id)
        )
    except Order.DoesNotExist:
        return Response(
            {"reason": f"Nie znaleziono zamówienia o ID {id}"},
            status=status.HTTP_404_NOT_FOUND,
        )
    if order.state == "anulowane":
        async_task(
            "api.utils.send_cancellation_mail",
            order.account,
            order.order_code,
        )
    elif order.state == "zaakceptowane":
        async_task(
            "api.utils.send_confirmation_mail",
            order.account,
            order.order_code,
            order.items.values_list("token", flat=True),
        )
    else:
        async_task(
            "api.utils.send_payment_mail",
            order.account,
            order.order_code,
            order.items_count,
        )
    return Response(status=status.HTTP_200_OK)
