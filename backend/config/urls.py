"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    create_order,
    logout,
    is_logged_in,
    is_admin,
    change_order_state,
    get_all_order,
    get_order,
    set_item_state,
    get_all_items,
    get_account_with_token,
    set_item_number,
    get_account_with_number,
    send_order_reminder
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", CookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", CookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", logout),
    path("api/authcheck/", is_logged_in),
    path("api/checkAdmin/", is_admin),
    path("api/order/", create_order),
    path("api/order/<int:id>/", get_order),
    path("api/orderChangeState/<int:order_id>/", change_order_state),
    path("api/getAllOrders/", get_all_order),
    path("api/updateItemState/<str:token>/", set_item_state),
    path("api/getAllItems/", get_all_items),
    path("api/getAccountForItem/<str:token>/", get_account_with_token),
    path("api/setItemNumber/<str:token>/", set_item_number),
    path("api/getAccountForNumber/<str:number>/", get_account_with_number),
    path("api/sendOrderReminder/<int:id>/", send_order_reminder),
]
