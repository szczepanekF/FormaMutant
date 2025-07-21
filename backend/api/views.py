from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from .serializers import AccountSerializer, OrderCreateSerializer
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
            
@api_view(['POST'])
@permission_classes([AllowAny])
def create_order(request):
    account_serializer = AccountSerializer(data=request.data)
    print(account_serializer)
    
    serializer = OrderCreateSerializer(data=request.data)
    print(serializer)
    # return Response({"msg": "Hello world"})
    
    if serializer.is_valid():
        order = serializer.save()
        return Response({
            'order_id': order.id,
            'account_email': order.account.email,
            'items_count': order.items.count(),
        }, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
@api_view(["GET"])
@permission_classes([AllowAny])
def index(request):
    #TODO
    return Response({"msg": "Hello world"})

# @api_view(["POST"])
# @permission_classes([AllowAny])
# def create_order(request):
#     #TODO
#     return Response({"msg": "Hello world"})