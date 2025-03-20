import { Routes, Route } from 'react-router'
import Header from './components/header/Header'
import Home from './components/home/Home'
import TripCreate from './components/trip-create/TripCreate'
import Register from './components/register/Register'
import Login from './components/login/Login'
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
        </Routes>
      </main>
    </div>
  )
}

export default App
