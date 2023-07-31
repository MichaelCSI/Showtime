import { useState, useEffect, useRef } from 'react'
import { BsEmojiSmile } from 'react-icons/bs'
import { BiErrorCircle } from 'react-icons/bi'
import { AiOutlineSend } from 'react-icons/ai'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

export default function Chat(props) {
    const [messages, setMessages] = useState([])
    const [autoScroll, setAutoScroll] = useState(true)
    const [showEmoji, setShowEmoji] = useState(false)
    const [messageError, setMessageError] = useState(false)
    const [username, setUsername] = useState()
    const [usernameError, setUsernameError] = useState(false)

    const chatBoxRef = useRef()
    const messageInputRef = useRef()
    const usernameInputRef = useRef()

    const socket = props.socket

    // Send a message to the chat
    const sendMsg = () => {
        if (
            !messageInputRef.current.value ||
            messageInputRef.current.value.length > 330
        ) {
            messageInputRef.current.style.borderColor = '#dc2626'
            messageInputRef.current.value.length > 330
                ? setMessageError('Message too long')
                : setMessageError('Please write a message')
            return
        }
        messageInputRef.current.style.borderColor = '#4a5568'
        setMessageError(false)
        socket.emit('message', {
            room: props.room,
            text: messageInputRef.current.value,
            name: username,
            id: `${socket.id}${Math.random()}`,
            socketID: socket.id,
            color: props.color
        })
        messageInputRef.current.value = ''
        setShowEmoji(false)
    }

    // Set username
    const submitUsername = (username) => {
        if (
            !usernameInputRef.current.value ||
            usernameInputRef.current.value.length > 25
        ) {
            usernameInputRef.current.style.borderColor = '#dc2626'
            usernameInputRef.current.value.length > 25
                ? setUsernameError('Username too long')
                : setUsernameError('Please enter a username')
            return
        }
        setUsername(usernameInputRef.current.value)
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
                ref={chatBoxRef}
            >
                <div className="text-primary ml-2 mt-1 border-b-2 border-gray-600">
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
            <div
                className="absolute bottom-1 left-4 mb-4 flex flex-col gap-y-4"
                style={{ pointerEvents: username ? 'auto' : 'none' }}
            >
                {!username && (
                    <div className="border-sky400 pointer-events-auto z-10 flex h-[24vh] w-[20vw] flex-col items-center justify-center gap-y-4 rounded-lg border-2 bg-black">
                        <div className="text-primary text-center">
                            Enter a username to chat
                        </div>
                        <input
                            ref={usernameInputRef}
                            type="text"
                            className="bg-gray700 focus:border-sky400 focus:ring-sky400 w-[16vw] rounded-lg border-2 border-gray-600 p-2.5 text-sm text-white placeholder-gray-400 focus:outline-none"
                            placeholder="Username"
                            autoComplete="off"
                        />
                        {usernameError && (
                            <div className="flex h-[0vh] flex-row items-center justify-center gap-x-2 text-xl text-red-600">
                                <BiErrorCircle />
                                <div className="text-base">{usernameError}</div>
                            </div>
                        )}
                        <button
                            onClick={submitUsername}
                            className="btn-primary text-primary bg-gray700 hover:bg-sky400 right-1 px-4 py-1.5"
                        >
                            Start chatting
                        </button>
                    </div>
                )}
                {messageError && (
                    <div className="flex h-[1vh] flex-row items-center justify-center gap-x-2 text-xl text-red-600">
                        <BiErrorCircle />
                        <div className="text-base">{messageError}</div>
                    </div>
                )}
                {showEmoji && (
                    <Picker
                        data={data}
                        emojiSize={20}
                        emojiButtonSize={28}
                        onEmojiSelect={addEmoji}
                        maxFrequentRows={0}
                        previewPosition="none"
                        noCountryFlags={true}
                    />
                )}
                <input
                    ref={messageInputRef}
                    type="text"
                    className="bg-gray700 focus:border-sky400 focus:ring-sky400 rounded-lg border-2 border-gray-600 p-2.5 text-sm text-white placeholder-gray-400 focus:outline-none"
                    placeholder="Send a chat"
                    onKeyPress={handleInputKeyPress}
                    autoComplete="off"
                />
                <div className="ml-1 flex w-[20vw] flex-row items-center gap-x-7">
                    <button
                        className="btn-primary text-primary bg-gray700 hover:bg-sky400 right-1 px-4 py-1.5"
                        onClick={() => setAutoScroll(!autoScroll)}
                    >
                        Auto Scroll: {autoScroll ? 'on' : 'off'}
                    </button>
                    <div
                        onClick={() => {
                            messageInputRef.current.focus()
                            setShowEmoji(!showEmoji)
                        }}
                        className="text-primary hover:text-sky400 text-2xl transition duration-200 hover:scale-105 hover:cursor-pointer"
                    >
                        <BsEmojiSmile />
                    </div>
                    <div
                        onClick={sendMsg}
                        className="text-primary hover:text-sky400 text-2xl transition duration-200 hover:scale-105 hover:cursor-pointer"
                    >
                        <AiOutlineSend />
                    </div>
                </div>
            </div>
        </>
    )
}
