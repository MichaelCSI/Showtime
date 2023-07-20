import { useState, useEffect } from 'react'

export default function Chat(props) {
    const [messages, setMessages] = useState([])
    const socket = props.socket

    const sendMsg = () => {
        if (!messageInput.value) return
        socket.emit('message', {
            text: messageInput.value,
            name: props.username ? props.username : 'Viewer ' + socket.id.substring(0, 3),
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id,
            color: props.color
        })
        messageInput.value = ''
    }

    socket.on('messageResponse', (data) => {
        setMessages([
            ...messages.slice(Math.max(messages.length - 14, 0)),
            { name: data.name, text: data.text, color: data.color }
        ])
    })

    const handleInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            sendMsg()
        }
    }

    return (
        <>
            {messages.map((msg) => (
                <div key={Math.random() + msg.text} className="mb-2 ml-2 flex">
                    <div style={{ color: msg.color }}>{msg.name + ': '}</div>
                    <div className="text-primary ml-2">{msg.text}</div>
                </div>
            ))}
            <div className="absolute bottom-1 left-4 flex items-center gap-x-5">
                <input
                    id="messageInput"
                    type="text"
                    className="w-[20vw] rounded-lg border-2 border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                    placeholder="Send a chat"
                    onKeyPress={handleInputKeyPress}
                    autoComplete="off"
                />
                <button
                    className="btn-primary text-primary bg-gray-700 hover:bg-blue-600"
                    onClick={sendMsg}
                >
                    Send
                </button>
            </div>
        </>
    )
}
