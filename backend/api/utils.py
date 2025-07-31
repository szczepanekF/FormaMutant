import math
import qrcode
from io import BytesIO
from config.settings import EMAIL_HOST_PASSWORD, EMAIL_HOST_USER
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from email.mime.image import MIMEImage


EXAMPLE_ITEM_PRICE = 100

PLANETA_LUZU_FOOTER = (
    "© 2025 PlanetaLuzu. Wszystkie prawa zastrzeżone. \n"
    "Odwiedź naszą stronę: https://planetaluzu.pl Kontakt: planetaluzu.sd@gmail.com"
)
PAYMENT_LINK = "https://revolut.me/michalg02"

DEFAULT_BODIES = {
    "payment": """
Cześć {first_name}

Twoja wstępna rezerwacja słuchawek o numerze {order_code} została pomyślnie zarejestrowana!
Aby potwierdzić rezerwację, prosimy o dokonanie opłaty rezerwacyjnej w wysokości {full_price:.2f} PLN w ciągu 12 godzin.
Tytuł płatności: {first_name} {last_name} 

Link do płatności: {payment_link}

Dzięki! 🗿 Zespół PlanetaLuzu
{footer}
""",
    "confirmation": """
Cześć {first_name}

Twoja rezerwacja słuchawek o numerze {order_code} została opłacona! W załączniku znajdziesz kod QR potrzebny do odbioru słuchawek. Zeskanuj go przy odbiorze.

Kod słuchawek: {item_token}

DOZO! 🗿 Zespół PlanetaLuzu 
{footer}""",
    "cancellation": """
 Cześć {first_name}

Twoja rezerwacja słuchawek o numerze {order_code} została anulowana. Trochę szkoda, że Cię nie będzie 🥲

DOZO! 🗿 Zespół PlanetaLuzu
{footer}""",
}


def ceil_2_decimal_places(x):
    """Rounds up a number to 2 decimal places."""
    return math.ceil(x * 100) / 100


def generate_qr_image(data):
    """Generates a QR code image from the provided data."""
    qr = qrcode.make(data)
    buffer = BytesIO()
    qr.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


def send_payment_mail(user, order_code, item_amount):
    """Sends a payment request email for headphone reservation."""
    full_order_price = ceil_2_decimal_places(item_amount * EXAMPLE_ITEM_PRICE)

    context = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "full_price": f"{full_order_price:.2f}",
        "order_code": order_code,
    }

    body = DEFAULT_BODIES["payment"].format(
        first_name=user.first_name,
        last_name=user.last_name,
        order_code=order_code,
        full_price=full_order_price,
        payment_link=PAYMENT_LINK,
        footer=PLANETA_LUZU_FOOTER,
    )

    email_message = EmailMultiAlternatives(
        subject="Opłata rezerwacji słuchawek",
        body=body,
        from_email=EMAIL_HOST_USER,
        to=[user.email],
    )
    html_content = render_to_string("emails/paymentRequest.html", context)
    email_message.attach_alternative(html_content, "text/html")

    email_message.send()


def send_confirmation_mail(user, order_code, item_tokens):
    """Sends a confirmation email with a QR code for headphone pickup."""
    if not item_tokens:
        raise ValueError("item_tokens cannot be empty")

    qr_images = []
    for i, item_id in enumerate(item_tokens):
        qr_buffer = generate_qr_image(item_id)
        cid = f"qr_code_{i}"
        qr_images.append((cid, qr_buffer))

    body = DEFAULT_BODIES["confirmation"].format(
        first_name=user.first_name,
        order_code=order_code,
        item_token=item_tokens[0],
        footer=PLANETA_LUZU_FOOTER,
    )
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
        subject="Potwierdzenie płatności i kod do obioru słuchawek",
        body=body,
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


def send_cancellation_mail(user, order_code):
    """Sends a confirmation email with a QR code for headphone pickup."""

    context = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "order_code": order_code,
    }
    body = DEFAULT_BODIES["cancellation"].format(
        first_name=user.first_name, order_code=order_code, footer=PLANETA_LUZU_FOOTER
    )
    email_message = EmailMultiAlternatives(
        subject="Anulowanie rezerwacji sluchawek",
        body=body,
        from_email=EMAIL_HOST_USER,
        to=[user.email],
    )

    html_content = render_to_string("emails/cancellation.html", context)
    email_message.attach_alternative(html_content, "text/html")
    email_message.send()
