import { BiTime } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import titles from './titles.js'

export default function Home() {
    const navigate = useNavigate()

    const liveTime = new Date(2023, 6, 28, 20)
    const hourSpacing = 5
    const milliSpacing = 5 * 60 * 60 * 1000

    Date.prototype.addHours = function (hours) {
        var date = new Date(this.valueOf())
        date.setHours(date.getHours() + hours)
        return date
    }

    // Give each movie a showing time
    const schedule = titles.map((movie, index) => ({
        movie: movie,
        time: liveTime.addHours(hourSpacing * index)
    }))

    // If a movie's showing time is old, move the movie to the end of the list
    schedule.forEach((showing, index) => {
        const now = new Date()
        // Push showing back X days until its no longer in the past
        while (showing.time.getTime() + milliSpacing < now.getTime()) {
            showing.time = showing.time.addHours(schedule.length * hourSpacing)
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
                    <div className="mb-4 flex flex-row items-end">
                        <div className="h-[128px] w-[108px]">
                            <img
                                src="./clapperboard.png"
                                className="h-full w-full object-fill"
                            />
                        </div>
                        <div className="text-sky400 mb-4 font-serif text-4xl">
                            Theater Online
                        </div>
                    </div>
                    <div className="ml-4 text-xl">
                        {`Theater Online is a place to watch live movies and
                        shorts that have entered the public domain. Each movie
                        has a chat room that opens ${hourSpacing} hours before and closes 
                        ${hourSpacing} hours after the movie goes live.`}
                        <br></br>
                        <br></br>Enjoy!
                    </div>
                </div>
                <div className="text-primary ml-[30vw]">
                    Have a movie suggestion?
                </div>
            </div>
            <div className="mt-[5vh] flex flex-row flex-wrap items-center justify-center gap-y-8">
                {schedule.map(({ movie, time }, index) => {
                    // Only able to enter rooms within 1 day of showing time
                    const now = new Date()
                    const liveNow =
                        time.getTime() - now.getTime() < milliSpacing

                    return (
                        <div
                            key={movie.title}
                            className="relative flex h-[50vh] w-[25vw] flex-col items-center justify-center"
                        >
                            <div className="h-[256px] w-[180px]">
                                <img
                                    className="h-full w-full rounded-sm object-fill transition duration-500 hover:scale-110 hover:cursor-pointer"
                                    src={movie.img}
                                    onClick={
                                        liveNow
                                            ? () =>
                                                  // Set 'props' with location state for each room
                                                  navigate(`/room${index}`, {
                                                      state: {
                                                          title: movie.title,
                                                          url: movie.url,
                                                          liveTime:
                                                              time.getTime()
                                                      }
                                                  })
                                            : null
                                    }
                                />
                            </div>
                            <div className="mt-4 flex w-[10vw] flex-row items-center justify-center text-center">
                                {liveNow ? (
                                    <>
                                        <span className="mr-2 h-3 w-3 animate-pulse rounded-lg bg-red-500"></span>
                                        <span className="text-sky400">
                                            Live Now
                                        </span>
                                    </>
                                ) : (
                                    <div className=" text-primary h-[5vh]">
                                        {formatDate(time.toString())}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="h-[15vh]"></div>
        </div>
    )
}
