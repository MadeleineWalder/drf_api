from django.db import models
from django.contrib.auth.models import User


class Contact(models.Model):
    """
    Contact model related to 'owner', i.e. a User instance.
    Form to be saved to database.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=20)
    message = models.TextField(max_length=250)
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.owner} : {self.title}"
