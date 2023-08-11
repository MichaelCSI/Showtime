import './style.css'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Connection from './Connection.jsx'
import titles from './titles.js'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <HashRouter>
        <Routes>
            <Route exact path="/" element={<Home />} />
            {titles.map((movie, index) => (
                <Route
                    key={movie.title}
                    exact
                    path={`/${movie.title}`}
                    element={<Connection room={`${movie.title}`} />}
                />
            ))}
        </Routes>
    </HashRouter>
)
