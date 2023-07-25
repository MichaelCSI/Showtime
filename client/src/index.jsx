import './style.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Connection from './Connection.jsx'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/room1" element={<Connection room="room1" />} />
            <Route exact path="/room2" element={<Connection room="room2" />} />
            <Route exact path="/room3" element={<Connection room="room3" />} />
        </Routes>
    </BrowserRouter>
)
