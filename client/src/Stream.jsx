import { useState, useEffect } from 'react'

export default function Stream(props) {
    const [numUsers, setNumUsers] = useState(0)
    const socket = props.socket

    socket.on('newUserResponse', (users) => {
        setNumUsers(users.length)
    })

    return (
        <>
            <iframe
                className='w-[74vw] h-[100vh]'
                src="https://www.youtube.com/embed/XmtXC_n6X6Q"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
            ></iframe>
            <div className="absolute bottom-1 left-2 text-red-400">
                {numUsers + ' viewers'}
            </div>
        </>
    )
}
