import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Homepage from './pages/Homepage/Homepage';
import App from './App';
import Register from './pages/LoginAndRegister/Register/Register';
import Login from './pages/LoginAndRegister/Login/Login';
import ForgotPassword from './pages/LoginAndRegister/ForgotPassword/ForgotPassword';
import CoupleSpace from './pages/CoupleSpace/CoupleSpace';




const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: "",
        element: <Homepage />
      }
      // },
      // {
      //   path: "about",
      //   element: <About />
      // },
      // {
      //   path: "contact",
      //   element: <Contact />
      // }
    ]
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword/>
  },
  {
    path: '/couplespace',
    element: <CoupleSpace/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)