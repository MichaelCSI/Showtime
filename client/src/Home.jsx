import { BiTime } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import titles from './titles.js'

export default function Home() {
    const navigate = useNavigate()

    const liveTime = new Date(2023, 6, 28, 20)
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }

    // Give each movie a showing time
    const schedule = titles.map((movie, index) => ({
        movie: movie,
        time: liveTime.addDays(index)
    }))
    // If a movie's showing time is old (5hrs), move the movie to the end of the list
    schedule.forEach((showing, index) => {
        const now = new Date()
        // Push showing back X days until its no longer in the past
        while (showing.time.getTime() + 86_400_000 < now.getTime()) {
            showing.time = showing.time.addDays(schedule.length)
        }
    })
    // Re-order schedule based on dates
    schedule.sort((show1, show2) => show1.time.getTime() - show2.time.getTime())

    const formatDate = (date) => {
        const timeValues = date.split(' ')
        return (
            'Live at ' +
            formatTime(timeValues[4]) +
            ' on ' +
            timeValues[0] +
            ' ' +
            timeValues[1] +
            ' ' +
            timeValues[2]
        )
    }

    const formatTime = (timeString) => {
        const [hourString, minute] = timeString.split(':')
        const hour = +hourString % 24
        return (hour % 12 || 12) + ':' + minute + (hour < 12 ? 'AM' : 'PM')
    }

    return (
        <div className="from-bgGray1 via-bgGray2 to-bgGray3 h-[100vh] w-[100vw] overflow-y-scroll bg-gradient-to-br">
            <div className="ml-10 mt-10 flex flex-row">
                <div className="text-primary w-[40vw]">
                    <div className="text-sky400 h-[10vh] font-serif text-4xl">
                        Theater Online
                    </div>
                    <div className="ml-2 text-xl">
                        Theater Online is a place to watch live movies and
                        shorts that have entered the public domain. Each movie
                        has a chat room that opens 24 hours before and closes 24
                        hours after the movie goes live.
                        <br></br>
                        <br></br>Enjoy!
                    </div>
                </div>
                <div className="text-primary ml-[30vw]">
                    Have a movie suggestion?
                </div>
            </div>
            <div className="ml-[4vw] mt-[5vh] flex flex-row flex-wrap items-center justify-center">
                {schedule.map(({ movie, time }, index) => {
                    // Only able to enter rooms within 1 day of showing time
                    const now = new Date()
                    const timeUntilLive = time.getTime() - now.getTime()

                    return (
                        <div
                            key={movie.title}
                            className="relative flex h-[50vh] w-[30vw] flex-row items-center justify-center"
                        >
                            <div className="h-[256px] w-[180px]">
                                <img
                                    className="h-full w-full rounded-sm object-fill"
                                    src={movie.img}
                                />
                            </div>
                            <div className="-ml-8 flex flex-col items-center justify-center gap-y-2">
                                <div className="text-primary mb-8 w-[20vw] px-[2vw] text-center">
                                    {movie.title}
                                </div>
                                <button
                                    className="rounded-lg p-2 transition duration-200 hover:scale-105 hover:cursor-pointer"
                                    style={{
                                        background:
                                            timeUntilLive < 86_400_000
                                                ? '#38bdf8'
                                                : '#9ca3af'
                                    }}
                                    onClick={() =>
                                        // Set 'props' with location state for each room
                                        navigate(`/room${index}`, {
                                            state: {
                                                title: movie.title,
                                                url: movie.url,
                                                liveTime: time.getTime()
                                            }
                                        })
                                    }
                                    disabled={
                                        timeUntilLive < 86_400_000 ? false : true
                                    }
                                >
                                    Watch Live
                                </button>
                                <div className="text-primary w-[10vw] text-center">
                                    {formatDate(time.toString())}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
