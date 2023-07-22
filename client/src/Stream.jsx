import { useState, useEffect, useRef } from 'react'
import { BsFillVolumeUpFill } from 'react-icons/bs'
import { BsFillVolumeMuteFill } from 'react-icons/bs'

export default function Stream(props) {
    const [numUsers, setNumUsers] = useState(0)
    const [muted, setMuted] = useState(true)
    const [goLive, setGoLive] = useState(false)
    const [countDown, setCountdown] = useState()

    const socket = props.socket
    const videoRef = useRef()
    const countDownRef = useRef()

    socket.on('newUserResponse', (users) => {
        setNumUsers(users.length)
    })

    const liveTime = props.liveTime

    function updateClock() {
        const now = new Date().getTime()
        const timeDifference = liveTime - now
        if (timeDifference < 1000 && timeDifference > -1000) {
            setGoLive(true)
        } else {
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
            const hours = Math.floor(
                (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
            )
            const minutes = Math.floor(
                (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
            )
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)
            setCountdown(
                days + ' d, ' + hours + 'h, ' + minutes + 'm, ' + seconds + 's'
            )
        }

        setTimeout(updateClock, 1000)
    }

    useEffect(() => {
        updateClock()
    }, [])
    useEffect(() => {
        if (goLive && videoRef.current) {
            videoRef.current.play()
        }
    }, [goLive])

    return (
        <>
            {goLive ? (
                <video
                    ref={videoRef}
                    className="pointer-events-none h-[95vh] w-[74vw]"
                    muted={muted}
                >
                    <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" />
                </video>
            ) : (
                <div
                    ref={countDownRef}
                    className="text-primary bg-blue flex h-[95vh] w-[74vw] flex-col items-center justify-center text-xl"
                >
                    <p className="text-2xl">Going live in</p>
                    <br></br>
                    {countDown}
                </div>
            )}
            <div className="mb-[3vh] ml-1 flex h-[2vh] flex-row items-center gap-x-5 text-red-400">
                <div>{numUsers + ' viewers'}</div>
                <button
                    className="text-3xl transition duration-200 hover:scale-110"
                    onClick={() => setMuted(!muted)}
                >
                    {muted ? <BsFillVolumeMuteFill /> : <BsFillVolumeUpFill />}
                </button>
            </div>
        </>
    )
}
