import math
import secrets
import qrcode
from io import BytesIO
from config.settings import EMAIL_HOST_PASSWORD, EMAIL_HOST_USER
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from email.mime.image import MIMEImage


def generate_qr_image(data):
    qr = qrcode.make(data)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


EXAMPLE_ITEM_PRICE = 100


def send_payment_mail(user, order_code, item_amount):
    full_order_price = ceil_2_decimal_places(item_amount * EXAMPLE_ITEM_PRICE)

    context = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_price": f"{full_order_price:.2f}",
        "order_code": order_code,
    }
    email_message = EmailMultiAlternatives(
        subject="Opłata rezerwacji słuchawek",
        body=(
            f"Cześć {user.first_name}, dzieki za rezerwacje. Koszt całej rezerwacji: {full_order_price}. Link do płatności: https://revolut.me/michalg02"
        ),
        from_email=EMAIL_HOST_USER,
        to=[user.email],
    )
    html_content = render_to_string("emails/paymentRequest.html", context)
    email_message.attach_alternative(html_content, "text/html")

    email_message.send()


def ceil_2_decimal_places(x):
    return math.ceil(x * 100) / 100


def send_confirmation_mail(user, order_code, item_tokens):

    qr_images = []
    for i, item_id in enumerate(item_tokens):
        qr_buffer = generate_qr_image(item_id)
        cid = f"qr_code_{i}"
        qr_images.append((cid, qr_buffer))

    context = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "qr_codes": [
            {"cid": cid, "item_id": item_id}
            for (cid, _), item_id in zip(qr_images, item_tokens)
        ],
        "order_code": order_code,
    }
    email_message = EmailMultiAlternatives(
        subject="Potwierdzenie rezerwacji słuchawek.",
        body=(
            f"Cześć {user.first_name}, trzymaj kody qr potrzebne do odbioru słuchawek."
        ),
        from_email=EMAIL_HOST_USER,
        to=[user.email],
    )
    html_content = render_to_string("emails/confirmation.html", context)
    email_message.attach_alternative(html_content, "text/html")
    for cid, qr_buffer in qr_images:
        image = MIMEImage(qr_buffer.read(), _subtype="png")
        image.add_header("Content-ID", f"<{cid}>")
        image.add_header("Content-Disposition", "inline", filename=f"{cid}.png")
        email_message.attach(image)

    email_message.send()


def generate_password():
    return secrets.token_urlsafe(8)


def send_cancellation_mail(user, order_code):
    context = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "order_code": order_code,
    }
    email_message = EmailMultiAlternatives(
        subject="Potwierdzenie anulowania rezerwacji sluchawek.",
        body=(
            f"Cześć {user.first_name}, trzymaj kody qr potrzebne do odbioru słuchawek."
        ),
        from_email=EMAIL_HOST_USER,
        to=[user.email],
    )
    html_content = render_to_string("emails/cancellation.html", context)
    email_message.attach_alternative(html_content, "text/html")
    email_message.send()
