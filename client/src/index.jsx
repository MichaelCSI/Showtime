import './style.css'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Connection from './Connection.jsx'
import titles from './titles.js'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<Home />} />
            {titles.map((movie, index) => (
                <Route
                    key={movie.title}
                    exact
                    path={`/room${index}`}
                    element={<Connection room={`room${index}`} />}
                />
            ))}
        </Routes>
    </BrowserRouter>
)
