import React from 'react'
import Route from 'found/lib/Route'
import makeRouteConfig from 'found/lib/makeRouteConfig'

import App from './App'
import HomePage from '../../pages/home/home'
import PostsPage from '../../pages/post/Posts'
import LoginPage from '../../pages/user/login/login'
import RegisterPage from '../../pages/user/register/register'
import ProfilePage from '../../pages/user/Profile'
import UserPostsPage from '../../pages/user/posts/UserPosts'
import CreatePostPage from '../../pages/user/createPost/CreatePost'
import PostDetailPage from '../../pages/post/PostDetail'

import ViewerQuery from '../../queries/ViewerQuery'

export default makeRouteConfig(
  <Route path="/" Component={App} queries={ViewerQuery}>
    <Route Component={HomePage} queries={ViewerQuery} />
    <Route path="login" Component={LoginPage} queries={ViewerQuery} />
    <Route path="register" Component={RegisterPage} queries={ViewerQuery} />
    <Route path="user" Component={ProfilePage} queries={ViewerQuery} />
    <Route path="user/posts" Component={UserPostsPage} queries={ViewerQuery} />
    <Route
      path="user/post/create"
      Component={CreatePostPage}
      queries={ViewerQuery}
    />
    <Route path="posts" Component={PostsPage} queries={ViewerQuery} />
    <Route
      path="post/:postId"
      Component={PostDetailPage}
      queries={ViewerQuery}
    />
  </Route>,
)
