import { Routes, Route } from 'react-router'
import Header from './components/header/Header'
import Home from './components/home/Home'
import TripCreate from './components/trip-create/TripCreate'
import Register from './components/register/Register'
import Login from './components/login/Login'
import TripCatalog from './components/trip-catalog/TripCatalog'
import TripDetails from './components/trip-details/TripDetails'
import TripEdit from './components/trip-edit/TripEdit'
import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('');

  const userLoginHandler = (authData) => {
    setEmail(authData.email);
  };

  return (
    <div id="hero-header">
      <Header />
      
      <main id="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/trips/create' element={<TripCreate />} />
          <Route path='/trips/:tripId/details' element={<TripDetails email={email} />} />
          <Route path='/trips/:tripId/edit' element={<TripEdit />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login onLogin={userLoginHandler}/>} />
          <Route path='/trips' element={<TripCatalog />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
