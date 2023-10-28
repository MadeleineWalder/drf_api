from rest_framework import generics, permissions
from .models import Contact
from .serializers import ContactFormSerializer
from drf_api.permissions import IsOwnerOrReadOnly
from rest_framework.permissions import IsAdminUser


class ContactList(generics.ListCreateAPIView):
    """
    List or create contact form for logged in users
    """
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Contact.objects.all()
    serializer_class = ContactFormSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ContactDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve a contact message by id if logged in
    Can delete if user logged in and owner
    """
    permission_classes = [permissions.IsAdminUser]
    queryset = Contact.objects.all()
    serializer_class = ContactFormSerializer
