import { Routes, Route } from 'react-router'
import Header from './components/header/Header'
import Home from './components/home/Home'
import TripCreate from './components/trip-create/TripCreate'
import './App.css'

function App() {

  return (
    <div id="hero-header">
      <Header />
      
      <main id="main-content">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/trips/create' element={<TripCreate />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
