import { useState, useEffect } from 'react'
import csv from 'jquery-csv'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Scatter } from 'react-chartjs-2'

Chart.register(CategoryScale)
Chart.defaults.backgroundColor = '#9BD0F5'
Chart.defaults.borderColor = '#36A2EB'
Chart.defaults.color = '#ffffff'

export default function App() {
    const [importData, setImportData] = useState([])
    const [graphData, setGraphData] = useState(false)

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

    // Get graph data
    useEffect(() => {
        if (importData.length > 0) {
            // const runsScored = criteria[3]
            // const onBasePercentage = criteria[6]
            const scatterData = importData.map((item) => ({
                x: item['RS'],
                y: item['OBP']
            }))
            setGraphData({
                datasets: [
                    {
                        data: scatterData,
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: '#ff0000'
                    }
                ]
            })
        }
    }, [importData])

    function axisProperties(title) {
        return {
            ticks: {
                beginAtZero: true,
                color: 'white'
            },
            title: {
                display: true,
                text: title,
                font: {
                    size: 14
                }
            }
        }
    }

    return (
        <>
            {graphData ? (
                <div className="mx-[5vw] h-[80vh] w-[90vw]">
                    <Scatter
                        data={graphData}
                        options={{
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Runs Scored vs On Base Percentage',
                                    font: {
                                        size: 18
                                    }
                                },
                                legend: {
                                    display: false
                                }
                            },
                            scales: {
                                y: axisProperties('On Base Percentage'),
                                x: axisProperties('Runs Scored')
                            }
                        }}
                    />
                </div>
            ) : null}
        </>
    )
}
