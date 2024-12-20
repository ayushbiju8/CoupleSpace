import React from 'react';
import ReactDOM from 'react-dom/client'; // Import ReactDOM
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Homepage from './pages/Homepage/Homepage';
import App from './App';




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
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)