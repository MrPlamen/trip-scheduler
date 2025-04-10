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
import Logout from './components/logout/Logout'
import VisitItemCatalog from './components/item-catalog/VisitItemCatalog'
import VisitItemDetails from './components/item-details/VisitItemDetails'
import Search from './components/search/Search'
import PrivateRoute from './components/PrivateRoute'
import './App.css'

function App() {
  const [authData, setAuthData] = useState({});

  const userLoginHandler = (resultData) => {
    setAuthData(resultData);
  };

  const userLogoutHandler = () => {
    setAuthData({});
  };

  return (
    <UserContext.Provider value={{ ...authData, userLoginHandler, userLogoutHandler }}>
      <div id="hero-header">
        <Header />

        <main id="main-content">
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/search' element={<Search />} />

            {/* Protected Routes */}
            <Route path='/trips/create' element={
              <PrivateRoute>
                <TripCreate />
              </PrivateRoute>
            } />
            <Route path='/trips/:tripId/edit' element={
              <PrivateRoute>
                <TripEdit />
              </PrivateRoute>
            } />
            <Route path='/trips' element={
              <PrivateRoute>
                <TripCatalog />
              </PrivateRoute>
            } />
            <Route path='/visits' element={
              <PrivateRoute>
                <VisitItemCatalog />
              </PrivateRoute>
            } />
            <Route path='/trips/:tripId/details' element={
              <PrivateRoute>
                <TripDetails />
              </PrivateRoute>
            } />
            <Route path='/visits/:visitItemId/details' element={
              <PrivateRoute>
                <VisitItemDetails />
              </PrivateRoute>
            } />
            <Route path='/logout' element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            } />
          </Routes>
        </main>
      </div>
    </UserContext.Provider>
  )
}

export default App;
