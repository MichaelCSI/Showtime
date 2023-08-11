import { useNavigate } from 'react-router-dom'
import titles from './titles.js'
import { useState } from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import { AiOutlineClose } from 'react-icons/ai'
import { BiSolidCameraMovie } from 'react-icons/bi'
import { MdMovieEdit } from 'react-icons/md'

export default function Home() {
    const navigate = useNavigate()
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
            className="from-bgGray3 h-[100vh] w-[100vw] overflow-y-scroll bg-gradient-to-b to-sky-950"
            onClick={() => makeSuggestion && setMakeSuggestion(false)}
        >
            <div
                className={`transition duration-300 ${
                    makeSuggestion ? 'brightness-50' : 'brightness-100'
                }`}
            >
                <div className="mb-[10vh] mt-[2vh] flex flex-col items-center justify-center md:flex-row">
                    <div className="text-primary w-[80vw] md:w-[40vw]">
                        <div className="mb-4 flex flex-row items-center">
                            <div className="h-[74px] w-[64px]">
                                <img
                                    src="./clapperboard.png"
                                    className="h-full w-full object-fill"
                                />
                            </div>
                            <div className="text-sky400 ml-2 font-serif text-4xl md:-mb-4">
                                Showtime
                            </div>
                        </div>
                        <div className="ml-4 text-xl">
                            At Showtime you can watch live movies that have
                            entered the public domain! Each movie has a chat
                            room that opens shortly before the movie goes live
                            and closes a couple of hours after the movie has
                            ended. Enjoy!
                        </div>
                    </div>
                    <div className="border-sky400 ml-[5vw] mt-[8vh] flex w-[80vw] flex-col items-center justify-center gap-y-4 rounded-lg border-2 p-2 md:ml-[12vw] md:w-[36vw]">
                        <div className="text-primary text-center text-lg">
                            There's a long list of public domain movies! If you
                            would like to see one added, make a suggestion!
                        </div>
                        <button
                            className="btn-primary text-primary bg-bgGray1 hover:bg-sky400 right-1 flex flex-row px-4 py-1.5 text-base"
                            onClick={() => setMakeSuggestion(true)}
                        >
                            <div className="mr-1 mt-0.5 text-xl">
                                <MdMovieEdit />
                            </div>
                            Submit a request
                        </button>
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
                                                          `/${movie.title}`,
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
                                            <span className="mr-1 animate-pulse text-xl text-red-500">
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
                <div className="h-[10vh]" />
            </div>
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
            }
            inputValues[index] = inputValue
        })
        if (!inputValues[1]) {
            return
        }
        const subject = 'Movie Request for: ' + inputValues[1]
        const body = inputValues[0]
            ? (inputValues[2] += ' - From ' + inputValues[0])
            : inputValues[2]
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
