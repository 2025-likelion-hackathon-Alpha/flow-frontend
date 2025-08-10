import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Cover from './pages/Cover/Cover'
import Select from './pages/Select/Select'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Cover />} />
        <Route path="/select" element={<Select />} />
      </Routes>
    </Router>
  )
}

export default App
