from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated,IsAdminUser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status

from .utils import send_confirmation_mail, send_cancellation_mail
from .serializers import AccountSerializer, OrderCreateSerializer, UserSerializer, OrderStateUpdateSerializer,AllOrdersSerializer
from .models import Order, Account

# Create your views here.
class CookieTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        try:
            data = request.data.copy()
            refresh = request.COOKIES.get("refresh")
            data["refresh"] = refresh
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
        print('LOG')
        ip_address = request.META.get('HTTP_X_FORWARDED_FOR')
        if ip_address:
            ip_address = ip_address.split(',')[0]
        else:
            ip_address = request.META.get('REMOTE_ADDR')
        print(ip_address)
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

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_order(requests):
    orders = Order.objects.all().prefetch_related('items').select_related('account')
    serializer = AllOrdersSerializer(orders, many=True)
    return Response(serializer.data)
        
@api_view(['POST'])
@permission_classes([AllowAny])
# TODO mail z linkiem do revoluta i potwierdzeniem
def create_order(request):
    serializer = OrderCreateSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        order = serializer.save()
        return Response({
            'order_id': order.id,
            'account_email': order.account.email,
            'items_count': order.items.count(),
        }, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            

@api_view(["POST"])
@permission_classes([IsAdminUser])
# TODO check cookies token - isAuthenticated
def change_order_state(request, order_id):
    
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Nie znaleziono zamówienia."}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = OrderStateUpdateSerializer(order, data=request.data, partial=True)
    if serializer.is_valid():
        old_state = order.state
        serializer.save()
        new_state = serializer.validated_data.get('state')
        if new_state != old_state:
            if new_state is 'zaakceptowane':
                send_confirmation_mail(order.account, order.items.values_list('id', flat=True))
            elif new_state is 'anulowane':
                send_cancellation_mail(order.account)
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    