import Chat from './Chat.jsx'
import Stream from './Stream.jsx'
import { useRef, useState } from 'react'
import { BsArrowBarLeft } from 'react-icons/bs'
import { BsArrowBarRight } from 'react-icons/bs'

export default function Room(props) {
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
    const liveTime = new Date().getTime() + 5000

    const [chatHidden, setChatHidden] = useState(false)
    const chatRef = useRef(null)
    const streamRef = useRef(null)

    // Hide chat on left side
    const hideChat = () => {
        chatRef.current.style.transition = '1s'
        chatRef.current.style.left = '-26vw'
        chatRef.current.style.width = '0'
        streamRef.current.style.transition = '1s'
        streamRef.current.style.width = '100vw'
        setTimeout(() => setChatHidden(true), 1000)
    }
    // Show chat from left side
    const showChat = () => {
        setChatHidden(false)
        chatRef.current.style.transition = '1s'
        chatRef.current.style.left = '0'
        chatRef.current.style.width = '26vw'
        streamRef.current.style.transition = '1s'
        streamRef.current.style.width = '74vw'
    }

    return (
        <div className="flex h-[100vh] w-[100vw] items-center overflow-y-scroll bg-black">
            <div
                className="from-bg4 via-bg5 to-bg6 relative left-0 h-[100vh] w-[26vw] overflow-y-scroll rounded-lg border-r-2 border-gray-700 bg-gradient-to-br"
                ref={chatRef}
            >
                <div
                    className="text-primary absolute right-2 top-2 text-xl transition duration-200 hover:scale-110 hover:cursor-pointer bg-hover"
                    onClick={hideChat}
                >
                    <BsArrowBarLeft />
                </div>
                <Chat
                    socket={props.socket}
                    color={color}
                    username={props.username}
                />
            </div>
            {chatHidden && (
                <div
                    className="text-primary absolute left-2 top-2 z-10 mb-4 w-[2vw] text-xl transition duration-200 hover:scale-105 hover:cursor-pointer bg-hover"
                    onClick={showChat}
                >
                    <BsArrowBarRight />
                </div>
            )}
            <div className="relative h-[100vh] w-[74vw]" ref={streamRef}>
                <Stream
                    socket={props.socket}
                    liveTime={liveTime}
                />
            </div>
        </div>
    )
}
