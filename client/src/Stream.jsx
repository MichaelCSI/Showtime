import { useState, useEffect, useRef } from 'react'
import { BsFillVolumeUpFill } from 'react-icons/bs'
import { BsFillVolumeMuteFill } from 'react-icons/bs'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { GoPerson } from 'react-icons/go'
import titles from './titles.js'

export default function Stream(props) {
    const [numUsers, setNumUsers] = useState(0)
    const [muted, setMuted] = useState(true)
    const [goLive, setGoLive] = useState(false)
    const [countDown, setCountdown] = useState()
    const [upTime, setUpTime] = useState()

    const videoRef = useRef()
    const countDownRef = useRef()

    const socket = props.socket
    socket.on('newUserResponse', (users) => {
        setNumUsers(users.length)
    })

    const liveTime = props.liveTime

    function updateClock() {
        const now = new Date().getTime()
        const timeDifference = liveTime - now
        if (timeDifference < 1000 && timeDifference > -1000) {
            setGoLive(true)
        } else if (timeDifference >= 1000) {
            const times = getTimeValues(timeDifference)
            setCountdown(
                times[0] +
                    'd, ' +
                    times[1] +
                    'h, ' +
                    times[2] +
                    'm, ' +
                    times[3] +
                    's'
            )
        } else {
            const times = getTimeValues(now - liveTime).map((time) =>
                String(time).padStart(2, '0')
            )
            setUpTime(times[1] + ':' + times[2] + ':' + times[3])
        }
        setTimeout(updateClock, 1000)
    }

    function getTimeValues(time) {
        const days = Math.floor(time / (1000 * 60 * 60 * 24))
        const hours = Math.floor(
            (time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((time % (1000 * 60)) / 1000)
        return [days, hours, minutes, seconds]
    }

    useEffect(() => {
        updateClock()
    }, [])
    useEffect(() => {
        if (goLive && videoRef.current) {
            videoRef.current.play()
        }
    }, [goLive])

    const currentMovie = titles[0]

    return (
        <>
            {goLive ? (
                <div
                    ref={countDownRef}
                    className="flex flex-col items-center justify-center"
                >
                    <video
                        ref={videoRef}
                        className="pointer-events-none mb-[2vh] h-[93vh]"
                        muted={muted}
                    >
                        <source src={currentMovie.url} />
                    </video>
                </div>
            ) : (
                <div
                    ref={countDownRef}
                    className="text-primary bg-blue flex h-[95vh] flex-col items-center justify-center text-xl"
                >
                    <p className="text-2xl">
                        {currentMovie.title + ' is starting in'}
                    </p>
                    <br></br>
                    {countDown}
                </div>
            )}
            <div className="mb-[3vh] ml-1 flex h-[2vh] flex-row items-center gap-x-5 text-red-400">
                <GoPerson />
                <div className="-ml-4">{numUsers}</div>
                <div className="text-primary mt-0.5">
                    <AiOutlineClockCircle />
                </div>
                <div className="text-primary -ml-4 w-[64px]">
                    {upTime ? upTime : ' not live'}
                </div>
                <button
                    className="text-3xl transition duration-200 hover:scale-105 bg-hover"
                    onClick={() => setMuted(!muted)}
                >
                    {muted ? <BsFillVolumeMuteFill /> : <BsFillVolumeUpFill />}
                </button>
            </div>
        </>
    )
}
