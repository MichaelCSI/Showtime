import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import socketIO from 'socket.io-client'
import Room from './Room.jsx'

export default function Connection(props) {
    const location = useLocation()
    const movieInfo = location.state

    const socket = socketIO.connect('http://localhost:4000')

    useEffect(() => {
        socket.emit('joinRoom', {
            room: props.room
        })
    }, [])

    return <Room socket={socket} room={props.room} movieInfo={movieInfo} />
}
