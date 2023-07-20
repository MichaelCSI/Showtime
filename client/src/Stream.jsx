import { useState, useEffect } from 'react'

export default function Stream(props) {
    const [numUsers, setNumUsers] = useState(0)
    const socket = props.socket

    socket.on('newUserResponse', (users) => {
        setNumUsers(users.length)
    })

    return (
        <>
            <div className="absolute text-red-400 bottom-1 left-2">{numUsers + ' viewers'}</div>
        </>
    )
}
