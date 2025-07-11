import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Register from './Register'

const MainPro = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<div className="text-center text-red-500">404 Not Found</div>} />
            </Routes>
        </Router>
    )
}

export default MainPro
