import { useState, useEffect } from 'react'
import socketIO from 'socket.io-client'

export default function App() {
    const [messages, setMessages] = useState([])
    const socket = socketIO.connect('http://localhost:4000')

    const sendMsg = () => {
        socket.emit('message', {
            text: 'Testing',
            name: 'Big Mike',
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id
        })
    }

    useEffect(() => {
        socket.on('messageResponse', (data) => setMessages([...messages, data]))
    }, [socket, messages])

    return (
        <div className="from-bg1 via-bg2 to-bg3 h-[100vh] overflow-y-scroll bg-gradient-to-br">
            <div className="mt-[5vh] grid h-[20vh] place-items-center ">
                <h1 className="text-secondary mb-[5vh] text-5xl">
                    Theater Online
                </h1>
            </div>
            <button
                className="btn-primary rounded-full px-4 py-1.5 text-center text-gray-600 hover:bg-blue-200"
                onClick={sendMsg}
            >
                Send
            </button>
            {messages.map((msg, index) => {
                const top = 'mt-'+index
                return <div className={`${top}`}>msg</div>
            })}
        </div>
    )
}
