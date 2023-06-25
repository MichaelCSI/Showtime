import Graphs from './Graphs.jsx'

export default function App() {
    return (
        <div className="h-[100vh] overflow-y-scroll bg-gradient-to-br from-bg1 via-bg2 to-bg3">
            <div className="mt-[5vh] grid h-[20vh] place-items-center ">
                <h1 className="mb-[5vh] text-5xl text-primary">
                    Moneyball Data Analysis
                </h1>
                <img
                    src="./images/oakland.png"
                    alt=""
                    className="h-32 w-32 rounded-lg"
                />
            </div>
            <Info />
            <Graphs />
        </div>
    )
}

function Info() {
    return (
        <div className="mx-[5vw] gap-x-[5vw] flex w-[90vw] h-[90vh] flex-col items-center md:flex-row">
            <div className="text-base leading-7 md:text-lg w-[40vw]">
                <div className="flex items-center gap-x-5 w-[40vw]">
                    <h1 className="mb-2 text-xl font-semibold text-goldOakland">
                        Background Info
                    </h1>
                    <a
                        href=""
                        target="_blank"
                        className="btn-primary -mt-1.5 rounded-full bg-ivory px-4 py-1.5 text-center text-gray-600 hover:bg-bg3 hover:text-primary"
                    >
                        Link
                    </a>
                </div>
                <p className="mt-5 w-[90vw] text-primary md:w-[40vw]">
                    Bla bla History and after the history happened data science
                    and repeat and Bla bla History and after the history
                    happened data science and repeat and Bla bla History and
                    after the history happened data science and repeat and Bla
                    bla History and after the history happened data science and
                    repeat and Bla bla History and after the history happened
                    data science and repeat and Bla bla History and after the
                    history happened data science and repeat and Bla bla History
                    and after the history happened data science and repeat and
                </p>
            </div>
            <img
                src="./images/movie.jpeg"
                alt=""
                className="rounded-lg w-[40vw] mt-[7vh] ml-[5vw]"
            />
        </div>
    )
}
