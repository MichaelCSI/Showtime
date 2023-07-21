import socketIO from 'socket.io-client'
import Chat from './Chat.jsx'
import Stream from './Stream.jsx'

export default function App() {
    const socket = socketIO.connect('http://localhost:4000')
    const colors = [
        '#FF0000',
        '#00FF00',
        '#7777FF',
        '#FFFF00',
        '#FF00FF',
        '#00FFFF',
        '#FFA500',
        '#FFC0CB',
        '#FFD700'
    ]
    const color = colors[Math.floor(Math.random() * colors.length)]

    // let username = prompt('Please enter your name')
    let username = Math.random().toString().substring(0, 4)

    socket.on('connect', () => {
        socket.emit('newUser', {
            username: username,
            socketID: socket.id
        })
    })

    return (
        <div className="flex h-[100vh] items-center overflow-y-scroll bg-black">
            <div className="from-bg4 via-bg5 to-bg6 relative h-[100vh] w-[26vw] overflow-y-scroll rounded-lg bg-gradient-to-br">
                <Chat socket={socket} color={color} username={username} />
            </div>
            <div className="relative h-[100vh] w-[74vw]">
                <Stream socket={socket} />
            </div>
        </div>
    )
}
