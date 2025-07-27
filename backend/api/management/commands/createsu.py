import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction

class Command(BaseCommand):
    help = "Create a superuser if none exists"

    def handle(self, *args, **options):
        User = get_user_model()

        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(self.style.SUCCESS("Superuser already exists."))
            return

        username = os.environ.get("DJANGO_SUPERUSER_USERNAME", "admin")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD", "admin")

        with transaction.atomic():
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
            )

        self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' created."))
