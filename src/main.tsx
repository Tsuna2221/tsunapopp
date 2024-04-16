// @ts-nocheck 

import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Main from './components/Main'
import MainCreate from './components/MainCreate'

import './main.css'
import CreationProvider from './components/context/CreationContext';
import Header from './components/Header';
import QuizList from './components/QuizList';
import QuizProvider from './components/context/QuizContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <QuizList/>,
  },
  {
    path: "/create",
    element: (
      <CreationProvider>
        <MainCreate/>
      </CreationProvider>
    ),
  },
  {
    path: "/quiz/:id",
    element: <QuizProvider><Main/></QuizProvider>,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Header/>
    <RouterProvider router={router} />
  </React.StrictMode>,
)