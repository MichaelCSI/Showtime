import { useEffect } from 'react'
import socketIO from 'socket.io-client'
import Room from './Room.jsx'

export default function App() {
    const username = Math.random().toString().substring(0, 4)
    const socket = socketIO.connect('http://localhost:4000')
    socket.on('connect', () => {
        socket.emit('newUser', {
            username: username,
            socketID: socket.id
        })
    })

    return <Room socket={socket} username={username} />
}
