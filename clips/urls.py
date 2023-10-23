from django.urls import path
from clips import views

urlpatterns = [
    path('clips/', views.ClipsList.as_view()),
    path('clips/<int:pk>/', views.ClipsDetail.as_view())
]
