import { useState, useEffect, useRef } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import { BiErrorCircle } from 'react-icons/bi'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

export default function Chat(props) {
    const [messages, setMessages] = useState([])
    const [autoScroll, setAutoScroll] = useState(true)
    const [showEmoji, setShowEmoji] = useState(false)
    const [messageTooLong, setMessageTooLong] = useState(false)

    const chatBoxRef = useRef(null)
    const messageInputRef = useRef(null)

    const socket = props.socket

    // Send a message to the chat
    const sendMsg = () => {
        if (!messageInput.value || messageInput.value.length > 330) {
            messageInput.style.borderColor = '#dc2626'
            setMessageTooLong(true)
            return
        }
        messageInput.style.borderColor = '#4a5568'
        setMessageTooLong(false)
        socket.emit('message', {
            room: props.room,
            text: messageInput.value,
            name: props.username,
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id,
            color: props.color
        })
        messageInput.value = ''
        setShowEmoji(false)
    }

    // Update chat with new messages - show up to 50
    socket.on('messageResponse', (data) => {
        setMessages([
            ...messages.slice(Math.max(messages.length - 50, 0)),
            { name: data.name, text: data.text, color: data.color }
        ])
    })

    // Handle enter click for sending chat message
    const handleInputKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            sendMsg()
        }
    }

    // Input emojis into chat box - (issue with country flags)
    const addEmoji = (e) => {
        const emojiCode = e.unified
        const emoji = String.fromCodePoint(parseInt('0x' + emojiCode, 16))
        messageInputRef.current.value = messageInputRef.current.value + emoji
    }

    // Handle auto scroll
    useEffect(() => {
        if (autoScroll) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
        }
    }, [messages])

    return (
        <>
            <div
                className="relative h-[80vh] w-[22vw] overflow-scroll"
                id="chatBox"
                ref={chatBoxRef}
            >
                <div className="text-primary ml-2 mt-1">
                    Welcome to Theater Online!
                </div>
                {messages.map((msg) => (
                    <div
                        key={Math.random() + msg.text}
                        className="mb-2 ml-2 flex break-all"
                    >
                        <div style={{ color: msg.color }}>
                            {msg.name + ':'}
                            <span className="text-primary ml-2">
                                {msg.text}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute bottom-1 left-4 mb-4 flex flex-col gap-y-4">
                {showEmoji && (
                    <div>
                        <Picker
                            data={data}
                            emojiSize={20}
                            emojiButtonSize={28}
                            onEmojiSelect={addEmoji}
                            maxFrequentRows={0}
                            previewPosition="none"
                            noCountryFlags={true}
                        />
                    </div>
                )}
                <div className="flex flex-row items-center gap-x-5">
                    <input
                        id="messageInput"
                        ref={messageInputRef}
                        type="text"
                        className="w-[20vw] rounded-lg border-2 border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-blue-600"
                        placeholder="Send a chat"
                        onKeyPress={handleInputKeyPress}
                        autoComplete="off"
                    />
                    <div
                        onClick={() => {
                            messageInputRef.current.focus()
                            setShowEmoji(!showEmoji)
                        }}
                        className="text-primary text-2xl transition duration-200 hover:scale-105 hover:cursor-pointer hover:text-blue-600"
                    >
                        <BsEmojiSmile />
                    </div>
                </div>
                <div className="ml-1 flex flex-row items-center gap-x-5">
                    <button
                        className="btn-primary text-primary right-1 bg-gray-700 px-4 py-1.5 hover:bg-blue-600"
                        onClick={() => setAutoScroll(!autoScroll)}
                    >
                        Auto Scroll: {autoScroll ? 'on' : 'off'}
                    </button>
                    <button
                        className="btn-primary text-primary bg-gray-700 px-6 py-2 hover:bg-blue-600"
                        onClick={sendMsg}
                    >
                        Send
                    </button>
                    {messageTooLong && (
                        <div className="flex flex-row items-center gap-x-2 text-xl text-red-600">
                            <BiErrorCircle />
                            <div className="text-base">Msg too long</div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
