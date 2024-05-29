import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider, createBrowserRouter} from 'react-router-dom';
import './index.css';
import Layout from './components/Layout';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import Authors from './pages/Authors';
import CreatePost from './pages/CreatePost';
import Register from './pages/Register';
import CategoryPosts from './pages/CategoryPosts';
import Dashboard from './pages/Dashboard';
import AuthorPosts from './pages/AuthorPosts';
import Logout from './pages/Logout';
import EditPost from './pages/EditPost';
import UserProvider from './context/userContext';

const router=createBrowserRouter([
  {
    path: "/",
    element: <UserProvider> <Layout/> </UserProvider>,
    errorElement: <ErrorPage />,
    children:[
      {
        index: true,element:<Home />
      },
      {
        path:'posts/:id',element:<PostDetail />
      },
      {
        path:'register',element:<Register />
      },
      {
        path:'login',element:<Login />
      },
      {
        path:'profile/:id',element:<UserProfile />
      },
      {
        path:'authors',element:<Authors />
      },
      {
        path:'create',element:<CreatePost />
      },
      {
        path:'posts/category/:category',element:<CategoryPosts />
      },
      {
        path:'myposts/:id',element:<Dashboard />
      },
      {
        path:'posts/:id/edit',element:<EditPost />
      },
      {
        path:'posts/users/:id',element:<AuthorPosts />
      },
      {
        path:'logout',element:<Logout />
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);