from django.db import models
from django.contrib.auth.models import User


class Clips(models.Model):
    """
    Clips model, related to 'owner', i.e. a User instance.
    Exension validator to allow only certain video formats.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    title = models.CharField(max_length=25)
    content = models.TextField(blank=True)
    video = models.FileField(
        upload_to='video/',
        default='https://res.cloudinary.com/dn0xxjn32/image/upload/v1698058977/default_jgmasr.jpg',
        blank=True,
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.id} {self.title}'
