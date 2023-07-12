import Graphs from './Graphs.jsx'
import Models from './Models.jsx'
import csv from 'jquery-csv'
import { useState, useEffect } from 'react'

export default function App() {
    const [importData, setImportData] = useState([])

    // Fetch initial data
    useEffect(() => {
        fetch('./datasets/baseball.csv')
            .then((response) => response.text())
            .then((csvData) => {
                const jsonArray = csv.toObjects(csvData)
                setImportData(jsonArray)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }, [])

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
            <Graphs data={importData} />
            <Models data={importData} />
            <div className='h-[10vh]'/>
        </div>
    )
}

function Info() {
    return (
        <div className="mx-[5vw] flex h-[90vh] w-[90vw] flex-col items-center gap-x-[5vw] md:flex-row">
            <div className="w-[40vw] text-base leading-7 md:text-lg">
                <div className="flex w-[40vw] items-center gap-x-5">
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
                className="ml-[5vw] mt-[7vh] w-[40vw] rounded-lg"
            />
        </div>
    )
}
