import { useState, useEffect, useRef } from 'react'
import { BsHouseFill } from 'react-icons/bs'
import { BsFillVolumeUpFill } from 'react-icons/bs'
import { BsFillVolumeMuteFill } from 'react-icons/bs'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { GoPerson } from 'react-icons/go'
import { useNavigate } from 'react-router-dom'

export default function Stream(props) {
    const navigate = useNavigate()

    const [numUsers, setNumUsers] = useState(0)
    const [muted, setMuted] = useState(true)
    const [goLive, setGoLive] = useState(false)
    const [movieOver, setMovieOver] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [countDown, setCountdown] = useState()
    const [upTime, setUpTime] = useState()

    const videoRef = useRef()
    const countDownRef = useRef()

    const socket = props.socket
    socket.on('newUserResponse', (users) => {
        setNumUsers(Object.keys(users).length)
    })

    const liveTime = props.movieInfo.liveTime

    // Handle when we show the movie/movie countdown, as well as the uptime counter
    function updateClock() {
        const now = new Date().getTime()
        const timeDifference = liveTime - now
        // Movie is playing, set to live and handle uptime counter
        if (timeDifference < 1000) {
            setGoLive(true)
            const times = getTimeValues(now - liveTime).map((time) =>
                String(time).padStart(2, '0')
            )
            setUpTime(times[0] + ':' + times[1] + ':' + times[2])
        }
        // Movie is not yet playing, handle countdown counter
        else {
            const times = getTimeValues(timeDifference)
            setCountdown(times[0] + 'h, ' + times[1] + 'm, ' + times[2] + 's')
        }
        setTimeout(updateClock, 1000)
    }

    function getTimeValues(time) {
        const hours = Math.floor(
            (time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((time % (1000 * 60)) / 1000)
        return [hours, minutes, seconds]
    }

    useEffect(() => {
        updateClock()
    }, [])
    useEffect(() => {
        if (goLive && videoRef.current) {
            videoRef.current.currentTime =
                (new Date().getTime() - liveTime) / 1000
            videoRef.current.play()
        }
    }, [goLive])

    return (
        <>
            {goLive ? (
                <div className="flex flex-col items-center justify-center">
                    {isLoading ? (
                        <div className="text-primary absolute top-[45vh] text-xl">
                            Movie is loading...
                        </div>
                    ) : null}
                    {movieOver ? (
                        <div className="text-primary mb-[2vh] h-[93vh] text-xl">
                            Movie is over
                        </div>
                    ) : (
                        <video
                            ref={videoRef}
                            className="pointer-events-none mb-[2vh] h-[93vh]"
                            muted={muted}
                            onEnded={() => setMovieOver(true)}
                            onLoadStart={() => setIsLoading(true)}
                            onLoadedData={() => setIsLoading(false)}
                        >
                            <source src={props.movieInfo.url} />
                        </video>
                    )}
                </div>
            ) : (
                <div
                    ref={countDownRef}
                    className="text-primary bg-blue flex h-[95vh] flex-col items-center justify-center text-xl"
                >
                    <p>{props.movieInfo.title + ' is starting in'}</p>
                    {countDown}
                </div>
            )}
            <div className="mb-[3vh] ml-1 flex h-[2vh] flex-row items-center gap-x-3 text-red-400">
                <button
                    className="bg-hover text-2xl transition duration-200 hover:scale-105"
                    onClick={() => navigate('/')}
                >
                    <BsHouseFill />
                </button>
                <button
                    className="bg-hover mt-0.5 text-2xl transition duration-200 hover:scale-105"
                    onClick={() => setMuted(!muted)}
                >
                    {muted ? <BsFillVolumeMuteFill /> : <BsFillVolumeUpFill />}
                </button>
                <GoPerson />
                <div className="-ml-2">{numUsers}</div>
                <div className="text-primary">
                    <AiOutlineClockCircle />
                </div>
                <div className="text-primary -ml-2 mb-0.5 w-[64px]">
                    {upTime ? upTime : ' not live'}
                </div>
            </div>
        </>
    )
}
