import { useNavigate } from 'react-router-dom'
import titles from './titles.js'
import { useState } from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import { AiOutlineClose } from 'react-icons/ai'
import { BiSolidCameraMovie } from 'react-icons/bi'

export default function Home() {
    const navigate = useNavigate()
    const [showMovies, setShowMovies] = useState(false)
    const [makeSuggestion, setMakeSuggestion] = useState(false)

    const liveTime = new Date(2023, 6, 28, 20)
    const hourSpacing = 4
    const milliSpacing = hourSpacing * 60 * 60 * 1000

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

    // Format to 12 hour time
    const formatTime = (timeString) => {
        const [hourString, minute] = timeString.split(':')
        const hour = +hourString % 24
        return (hour % 12 || 12) + ':' + minute + (hour < 12 ? 'AM' : 'PM')
    }

    return (
        <div
            className="from-bgGray1 via-bgGray2 to-bgGray3 h-[100vh] w-[100vw] overflow-y-scroll bg-gradient-to-br"
            onClick={() => makeSuggestion && setMakeSuggestion(false)}
        >
            {!showMovies && (
                <>
                    <div className="absolute h-full w-full">
                        <img
                            src="./theater.webp"
                            className="h-full w-full object-fill"
                        />
                    </div>
                    <div className="text-primary ml-[20vw] mt-[25vh] w-[60vw] items-center justify-center md:ml-[30vw] md:mt-[30vh] md:w-[40vw]">
                        <div className="mb-4 flex flex-row items-center justify-center">
                            <div className="h-[96px] w-[80px]">
                                <img
                                    src="./clapperboard.png"
                                    className="h-full w-full object-fill"
                                />
                            </div>
                            <div className="text-sky400 ml-2 font-serif text-4xl md:-mb-4">
                                Theater Online
                            </div>
                        </div>
                        <div className="ml-4 text-center text-xl">
                            Theater Online is a place to watch live movies and
                            shorts that have entered the public domain. Each
                            movie has a chat room that opens shortly before the
                            movie goes live and closes a couple of hours after
                            the movie has ended.
                            <br></br>
                            <br></br>
                        </div>
                        <div className="flex flex-row items-center justify-center gap-x-10">
                            <div className="ml-4 text-xl">Enjoy!</div>
                            <button
                                className="bg-sky400 z-10 -mt-1 rounded-lg p-2 transition duration-200 hover:scale-105 hover:cursor-pointer"
                                onClick={() => setShowMovies(true)}
                            >
                                Browse Movies
                            </button>
                        </div>
                    </div>
                </>
            )}
            {showMovies && (
                <div
                    className={` bg-gradient-to-br transition duration-300 ${
                        makeSuggestion ? 'brightness-50' : 'brightness-100'
                    }`}
                >
                    <div className="hover:bg-sky400 z-10 ml-2 mt-2 h-[56px] w-[56px] rounded-lg transition duration-200 hover:scale-105 hover:cursor-pointer hover:bg-opacity-60">
                        <img
                            src="./clapperboard.png"
                            className="h-full w-full object-fill"
                            onClick={() => setShowMovies(false)}
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="text-primary text-center text-lg">
                            Want to add a movie?
                        </div>
                        <div
                            className="text-sky400 underline hover:cursor-pointer"
                            onClick={() => setMakeSuggestion(true)}
                        >
                            Make a suggestion
                        </div>
                    </div>
                    <div className="mt-[5vh] flex flex-row flex-wrap items-center justify-center gap-y-8">
                        {schedule.map(({ movie, time }, index) => {
                            // Only able to enter rooms within 1 day of showing time
                            const now = new Date()
                            const liveNow =
                                time.getTime() - now.getTime() <
                                milliSpacing / hourSpacing

                            return (
                                <div
                                    key={movie.title}
                                    className="fade-in-animation relative flex h-[60vh] w-[50vw] flex-col items-center justify-center md:h-[55vh] md:w-[25vw]"
                                    style={{
                                        animationDelay: `${index * 0.1}s`
                                    }}
                                >
                                    <div className="h-[256px] w-[180px]">
                                        <img
                                            className="h-full w-full rounded-sm object-fill transition duration-500 hover:scale-110 hover:cursor-pointer"
                                            src={movie.img}
                                            onClick={
                                                liveNow
                                                    ? () =>
                                                          // Set 'props' with location state for each room
                                                          navigate(
                                                              `/room${index}`,
                                                              {
                                                                  state: {
                                                                      title: movie.title,
                                                                      url: movie.url,
                                                                      liveTime:
                                                                          time.getTime()
                                                                  }
                                                              }
                                                          )
                                                    : null
                                            }
                                        />
                                    </div>
                                    <div className="mt-4 flex w-[30vw] flex-row items-center justify-center text-center md:w-[15vw]">
                                        {liveNow ? (
                                            <>
                                                <span className="animate-pulse text-red-500 mr-1 text-xl">
                                                    <BiSolidCameraMovie />
                                                </span>
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
                </div>
            )}
            {makeSuggestion && (
                <Suggestion setMakeSuggestion={setMakeSuggestion} />
            )}
        </div>
    )
}

function Suggestion(props) {
    const inputFields = [
        'Name (Optional)',
        'Movie Suggestion',
        'Reasoning (optional)'
    ]

    const sendSuggestion = () => {
        const inputValues = []
        inputFields.forEach((inputField, index) => {
            const inputElement = document.querySelector(
                `input[placeholder="${inputField}"]`
            )
            const inputValue = inputElement.value

            inputElement.style.borderColor = '#4a5568'
            if (!inputValue && index === 1) {
                inputElement.style.borderColor = '#dc2626'
                return
            }
            inputValues[index] = inputValue
        })
        const subject = 'Movie Request for: ' + inputValues[1]
        const body = inputValues[2] + ', ' + inputValues[0]
        window.open(
            `mailto:TheaterOnlineInfo@gmail.com?subject=${subject}&body=${body}`
        )
    }

    return (
        <div
            className="border-sky400 absolute left-[30vw] top-[30vh] z-10 flex h-[60vh] w-[40vw] flex-col items-center justify-center rounded-lg border-2 bg-black"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="text-primary mb-[2vh] text-center">
                A list of public domain movies can be found
                <a
                    href="https://en.wikipedia.org/wiki/List_of_films_in_the_public_domain_in_the_United_States#Films"
                    target={'_blank'}
                    className="text-sky400 ml-1 underline"
                >
                    here
                </a>
            </div>
            {inputFields.map((inputField) => (
                <input
                    key={inputField}
                    type="text"
                    className="bg-gray700 focus:border-sky400 focus:ring-sky400 my-[2vh] w-2/3 rounded-lg border-2 border-gray-600 p-2.5 text-sm text-white placeholder-gray-400 focus:outline-none"
                    placeholder={inputField}
                />
            ))}
            <div
                className="text-primary hover:text-sky400 absolute bottom-2 right-2 flex flex-row text-2xl transition duration-200 hover:scale-105 hover:cursor-pointer"
                onClick={sendSuggestion}
            >
                <div className="mr-1 text-base">Send</div>
                <AiOutlineSend />
            </div>
            <div
                className="text-primary hover:text-sky400 absolute left-2 top-2 text-3xl transition duration-200 hover:scale-105 hover:cursor-pointer"
                onClick={() => props.setMakeSuggestion(false)}
            >
                <AiOutlineClose />
            </div>
        </div>
    )
}
