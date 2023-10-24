from django.db.models import Count
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from drf_api.permissions import IsOwnerOrReadOnly
from .models import Clips
from .serializers import ClipsSerializer


class ClipsList(generics.ListCreateAPIView):
    """
    List clips or create a clip if logged in
    The perform_create method associates the clip with the logged in user.
    """
    serializer_class = ClipsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Clips.objects.annotate(
        likes_count=Count('like', distinct=True),
        comments_count=Count('comment', distinct=True)
    ).order_by('-created_at')
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = [
        'owner__followed__owner__profile',
        # 'likes__owner__profile',
        'owner__profile',
        'owner__followed__owner__profile',
    ]
    search_fields = [
        'owner__username',
        'title',
    ]
    ordering_fields = [
        'likes_count',
        'comments_count',
        'likes__created_at',
    ]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ClipsDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve a clip and edit or delete it if you own it.
    """
    serializer_class = ClipsSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Clips.objects.annotate(
        likes_count=Count('like', distinct=True),
        comments_count=Count('comment', distinct=True)
    ).order_by('-created_at')
