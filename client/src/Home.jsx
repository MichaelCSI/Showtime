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
        if(showing.time + 18_000_000 < new Date()){
            showing.time = showing.time.addDays(schedule.length)
            schedule.splice(index, 1)
            schedule.push(showing)
        }
    })

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
        <div className="flex h-[100vh] w-[100vw] flex-wrap items-center justify-center gap-x-10 gap-y-10 overflow-y-scroll from-bgGray1 via-bgGray2 to-bgGray3 bg-gradient-to-br">
            <div className="text-primary mt-10 h-[10vh] w-full text-center text-3xl">
                Theater Online
            </div>
            {schedule.map(({ movie, time }, index) => {
                // Only able to enter rooms within 1 day of showing time
                const timeUntilLive = time.getTime() - new Date().getTime()

                return (
                    <div
                        key={movie.title}
                        className="relative flex h-[55vh] w-[40vw] flex-row items-center justify-center border-2 border-sky400 rounded-lg"
                    >
                        <div className="h-[280px] w-[180px]">
                            <img
                                className="h-full w-full object-fill"
                                src={movie.img}
                            />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-y-2 -mt-16">
                            <div className="text-primary w-[20vw] px-[2vw] text-center mb-16">
                                {movie.title}
                            </div>
                            <button
                                className="rounded-lg p-2 transition duration-200 hover:scale-105 hover:cursor-pointer"
                                style={{
                                    background:
                                        timeUntilLive < 86400000
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
                                    timeUntilLive < 86400000 ? false : true
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
    )
}
