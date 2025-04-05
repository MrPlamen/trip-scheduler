import { Routes, Route } from 'react-router'
import { useState } from 'react'
import { UserContext } from './contexts/UserContext'
import Header from './components/header/Header'
import Home from './components/home/Home'
import TripCreate from './components/trip-create/TripCreate'
import Register from './components/register/Register'
import Login from './components/login/Login'
import TripCatalog from './components/trip-catalog/TripCatalog'
import TripDetails from './components/trip-details/TripDetails'
import TripEdit from './components/trip-edit/TripEdit'
import './App.css'
import Logout from './components/logout/Logout'
import VisitItemCatalog from './components/item-catalog/VisitItemCatalog'

function App() {
  const [authData, setAuthData] = useState({});

  const userLoginHandler = (resultData) => {
    setAuthData(resultData);
  };

  const userLogoutHandler = () => {
    setAuthData({});
  };

  return (
    <UserContext.Provider value={{...authData, userLoginHandler, userLogoutHandler}}>
      <div id="hero-header">
        <Header />

        <main id="main-content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/trips/create' element={<TripCreate />} />
            <Route path='/trips/:tripId/details' element={<TripDetails />} />
            <Route path='/trips/:tripId/edit' element={<TripEdit />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/trips' element={<TripCatalog />} />
            <Route path='/visits' element={<VisitItemCatalog />} />
            <Route path='/logout' element={<Logout />} />
          </Routes>
        </main>
      </div>
    </UserContext.Provider>
  )
}

export default App
