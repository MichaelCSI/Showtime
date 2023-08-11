import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import socketIO from 'socket.io-client'
import Room from './Room.jsx'

export default function Connection(props) {
    const location = useLocation()
    const movieInfo = location.state

    const socket = socketIO.connect('https://showtime-service.onrender.com')

    useEffect(() => {
        socket.emit('joinRoom', {
            room: props.room
        })
    }, [])

    return <Room socket={socket} room={props.room} movieInfo={movieInfo} />
}
