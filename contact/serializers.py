from django.contrib.humanize.templatetags.humanize import naturaltime
from rest_framework import serializers
from .models import Contact


class ContactSerializer(serializers.ModelSerializer):
    """
    Serializer for the Contact model
    """
    owner = serializers.ReadOnlyField(source='owner.username')
    profile_id = serializers.ReadOnlyField(source='owner.profile.id')
    profile_pic = serializers.ReadOnlyField(
        source='owner.profile.profile_pic.url')
    created_at = serializers.SerializerMethodField()
    updated_at = serializers.SerializerMethodField()

    def get_created_at(self, obj):
        """
        Shows the date the form was created
        """
        return naturaltime(obj.created_at)

    def get_updated_at(self, obj):
        """
        Updates the form date
        """
        return naturaltime(obj.updated_at)

    class Meta:
        """
        Fields from Contact model
        """
        model = Contact
        fields = [
            'id', 'owner', 'title', 'message',
            'profile_id', 'profile_pic', 'created_at',
            'updated_at',
        ]
