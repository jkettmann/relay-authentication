import React from 'react'
import { graphql } from 'react-relay'
import Route from 'found/lib/Route'
import makeRouteConfig from 'found/lib/makeRouteConfig'

import App from './App'
import HomePage from '../pages/home/Home'
import PostsPage, { POST_COUNT } from '../pages/post/Posts'
import PostDetailPage from '../pages/post/PostDetail'
import LoginPage from '../pages/user/Login'
import RegisterPage from '../pages/user/Register'
import ProfilePage from '../pages/user/Profile'
import UserPostsPage, { POST_COUNT as USER_POST_COUNT } from '../pages/user/UserPosts'
import CreatePostPage from '../pages/user/CreatePost'

const appQuery = graphql`query Routes_App_Query { viewer { ...App_viewer } }`
const homepQuery = graphql`query Routes_Home_Query { viewer { ...Home_viewer } }`
const postsQuery = graphql`query Routes_Posts_Query ($afterCursor: String, $count: Int!) { viewer { ...Posts_viewer } }`
const postDetailQuery = graphql`query Routes_PostDetail_Query ($postId: String!) { viewer { ...PostDetail_viewer } }`
const loginQuery = graphql`query Routes_Login_Query { viewer { ...Login_viewer } }`
const registerQuery = graphql`query Routes_Register_Query { viewer { ...Register_viewer } }`
const userProfileQuery = graphql`query Routes_Profile_Query { viewer { ...Profile_viewer } }`
const userPostsQuery = graphql`query Routes_UserPosts_Query ($afterCursor: String, $count: Int!) { viewer { ...UserPosts_viewer } }`
const createPostQuery = graphql`query Routes_CreatePost_Query { viewer { ...CreatePost_viewer } }`

export default makeRouteConfig(
  <Route
    path="/"
    query={appQuery}
    // we use the render method instead of Component here to always display Header
    // and Navigation even if the data has not been fetched yet
    render={({ match, ownProps, props }) =>
      <App {...match} {...ownProps} {...props} isLoading={!props} />}
  >
    <Route Component={HomePage} query={homepQuery} />

    <Route
      path="posts"
      Component={PostsPage}
      query={postsQuery}
      prepareVariables={params => ({
        ...params,
        count: POST_COUNT,
        afterCursor: null,
      })}
    />

    <Route
      path="post/:postId"
      Component={PostDetailPage}
      query={postDetailQuery}
    />

    <Route path="login" Component={LoginPage} query={loginQuery} />
    <Route path="register" Component={RegisterPage} query={registerQuery} />

    <Route path="user" Component={ProfilePage} query={userProfileQuery} />
    <Route
      path="user/posts"
      Component={UserPostsPage}
      query={userPostsQuery}
      prepareVariables={params => ({
        ...params,
        count: USER_POST_COUNT,
        afterCursor: null,
      })}
    />

    <Route
      path="user/post/create"
      Component={CreatePostPage}
      query={createPostQuery}
    />
  </Route>,
)
