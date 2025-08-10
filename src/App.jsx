import React from 'react'
import CoverPage from './pages/Cover/Cover'
import SelectPage from './pages/Select/Select'
import { Route, Routes } from 'react-router-dom'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<CoverPage />} />
      <Route path='/select' element={<SelectPage />} />
    </Routes>
  )
}

export default App