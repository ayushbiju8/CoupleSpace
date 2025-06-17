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
import Calendar from './pages/Calendar/Calendar';
import JoinCoupleSpace from './pages/JoinCoupleSpace/JoinCoupleSpace'
import Wishlist from './pages/Wishlist/Wishlist';
import Chat from './pages/Chat/Chat';
import QualityTalks from './pages/Games/QualityTalks/QualityTalks';
import WouldYouRather from './pages/Games/WouldYouRather/WouldYouRather';
import TruthOrDare from './pages/Games/TruthOrDare/TruthOrDare';
import Funquests from './pages/Funquests/Funquests';
import Gifts from './pages/Gifts/Gifts';
import Roadmap from './pages/Roadmap/Roadmap';
import Profile from './pages/Profile/Profile';
import Discover from './pages/Discover/Discover';




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
  },
  {
    path: '/calendar',
    element: <Calendar/>
  },
  {
    path: '/accept-invite',
    element: <JoinCoupleSpace/>
  },
  {
    path: '/wishlist',
    element: <Wishlist/>
  },
  {
    path: '/chat',
    element: <Chat/>
  },
  {
    path: '/roadmap',
    element: <Roadmap/>
  },
  {
    path: '/games/qualitytalks',
    element: <QualityTalks/>
  },
  {
    path: '/games/wouldyourather',
    element: <WouldYouRather/>
  },
  {
    path: '/games/truthordare',
    element: <TruthOrDare/>
  },
  {
    path: '/funquests',
    element: <Funquests/>
  },
  {
    path: '/gifts',
    element: <Gifts/>
  },
  {
    path: '/profile',
    element: <Profile/>
  },
  {
    path: '/discover',
    element: <Discover/>
  },

])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)