import { Routes, Route } from 'react-router'
import Header from './components/header/Header'
import Home from './components/home/Home'
import TripCreate from './components/trip-create/TripCreate'
import Register from './components/register/Register'
import Login from './components/login/Login'
import TripCatalog from './components/trip-catalog/TripCatalog'
import './App.css'

function App() {

  return (
    <div id="hero-header">
      <Header />
      
      <main id="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/trips/create' element={<TripCreate />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/trips' element={<TripCatalog />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
