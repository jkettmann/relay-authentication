import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App';
import HomePage from '../../pages/home/home';
import PostsPage from '../../pages/post/Posts';
import LoginPage from '../../pages/user/login/login';
import RegisterPage from '../../pages/user/register/register';
import ProfilePage from '../../pages/user/Profile';
import UserPostsPage from '../../pages/user/posts/UserPosts';
import CreatePostPage from '../../pages/user/createPost/CreatePost';
import PostDetailPage from '../../pages/post/PostDetail';

import ViewerQuery from '../../queries/ViewerQuery';


export default (
  <Route path="/" component={App} queries={ViewerQuery}>
    <IndexRoute component={HomePage} queries={ViewerQuery}/>
    <Route path="login" component={LoginPage} queries={ViewerQuery} />
    <Route path="register" component={RegisterPage} queries={ViewerQuery} />
    <Route path="user" component={ProfilePage} queries={ViewerQuery} />
    <Route path="user/posts" component={UserPostsPage} queries={ViewerQuery} />
    <Route path="user/post/create" component={CreatePostPage} queries={ViewerQuery} />
    <Route path="posts" component={PostsPage} queries={ViewerQuery} />
    <Route path="post/:postId" component={PostDetailPage} queries={ViewerQuery} />
  </Route>
);
