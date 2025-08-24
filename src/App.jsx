import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Cover from './pages/Cover/Cover'
import Select from './pages/Select/Select'
import GeneralSignup from './pages/GeneralSignup/GeneralSignup'
import StoreSignup from './pages/StoreSignup/StoreSignup'
import Login from './pages/Login/Login'
import Information from './pages/Information/Information'
import Nicetomeetyou from './pages/Nicetomeetyou/Nicetomeetyou'
import Tutorial1 from './pages/Tutorial1/Tutorial1'
import Tutorial2 from './pages/Tutorial2/Tutorial2'
import Tutorial3 from './pages/Tutorial3/Tutorial3'
import Success from './pages/Success/Success'
import Main from './pages/Main/Main'
import RewardShop from './pages/RewardShop/RewardShop'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cover />} />
        <Route path="/select" element={<Select />} />
        <Route path="/signup/general" element={<GeneralSignup />} />
        <Route path="/signup/store" element={<StoreSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/information" element={<Information />} />
        <Route path="/nicetomeetyou" element={<Nicetomeetyou />} />
        <Route path="/tutorial1" element={<Tutorial1 />} />
        <Route path="/tutorial2" element={<Tutorial2 />} />
        <Route path="/tutorial3" element={<Tutorial3 />} />
        <Route path="/success" element={<Success />} />
        <Route path="/main" element={<Main />} />
        <Route path="/rewardshop" element={<RewardShop />} />
      </Routes>
    </Router>
  )
}

export default App
