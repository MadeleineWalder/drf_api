from django.contrib.auth.models import User
from .models import Post
from rest_framework import status
from rest_framework.test import APITestCase


class PostListViewTests(APITestCase):
    # create a user to run the tests
    def setUp(self):
        User.objects.create_user(username='terry', password='terrythetester')

    def test_can_list_posts(self):
        # creating a post as the user
        terry = User.objects.get(username='terry')
        Post.objects.create(owner=terry, title='terrys title')
        # get request the post
        response = self.client.get('/posts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # check its data and length
        print(response.data)
        print(len(response.data))

    def test_logged_in_user_can_create_post(self):
        # must log in to test this works
        self.client.login(username='terry', password='terrythetester')
        # making a post request
        response = self.client.post('/posts/', {'title': 'a title'})
        # count the posts
        count = Post.objects.count()
        # check there is just one
        self.assertEqual(count, 1)
        # assert response code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_not_logged_in_cant_create_post(self):
        # attempt to create post
        response = self.client.post('/posts/', {'title': 'a title'})
        # check it is a forbidden request
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class PostDetailViewTests(APITestCase):
    # set up situation to test in
    def setUp(self):
        adam = User.objects.create_user(username='adam', password='pass')
        brian = User.objects.create_user(username='brian', password='pass')
        Post.objects.create(
            owner=adam, title='a title', content='adams content'
        )
        Post.objects.create(
            owner=brian, title='another title', content='brians content'
        )

    def test_can_retrieve_post_using_valid_id(self):
        response = self.client.get('/posts/1/')
        self.assertEqual(response.data['title'], 'a title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_cant_retrieve_post_using_invalid_id(self):
        response = self.client.get('/posts/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_own_post(self):
        self.client.login(username='adam', password='pass')
        response = self.client.put('/posts/1/', {'title': 'a new title'})
        post = Post.objects.filter(pk=1).first()
        self.assertEqual(post.title, 'a new title')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cant_update_another_users_post(self):
        self.client.login(username='adam', password='pass')
        response = self.client.put('/posts/2/', {'title': 'a new title'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
