import { useState, useEffect } from 'react'
import csv from 'jquery-csv'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'
import { Scatter } from 'react-chartjs-2'

Chart.register(CategoryScale)
Chart.defaults.backgroundColor = '#9BD0F5'
Chart.defaults.borderColor = '#ffffff'
Chart.defaults.color = '#ffffff'

export default function ScatterGraph(props) {
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
            const scatterData = importData.map((item) => ({
                x: props.diff
                    ? item[props.xKey] - item[props.xKey2]
                    : item[props.xKey],
                y: item[props.yKey]
            }))

            const scatterLabels = importData.map(
                (item) => item['Team'] + ', ' + item['Year'] + ': '
            )

            const scatterColors = importData.map(
                (item) => {
                    const value = parseInt(item['Playoffs'])
                    if(value === 0){
                        return 'rgb(255, 99, 132)'
                    } else{
                        return 'rgb(255, 255, 255)'
                    }
                }
            )
            const bgColor = props.usePlayoffColors ? scatterColors : 'rgb(255, 99, 132)'
            setGraphData({
                datasets: [
                    {
                        label: "Non-playoff teams",
                        labels: scatterLabels,
                        data: scatterData,
                        backgroundColor: bgColor,
                        borderColor: '#222222'
                    },
                    {
                        label: 'Playoff teams',
                        backgroundColor: 'rgb(255, 255, 255)',
                        borderColor: '#222222'
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
                <Scatter
                    data={graphData}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: props.title,
                                font: {
                                    size: 18
                                }
                            },
                            legend: {
                                display: true,
                                onClick: () => {}
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (ctx) {
                                        let label =
                                            ctx.dataset.labels[ctx.dataIndex]
                                        label +=
                                            ' (' +
                                            ctx.parsed.x +
                                            props.pointTitles.x +
                                            ctx.parsed.y +
                                            props.pointTitles.y
                                        return label
                                    }
                                }
                            }
                        },
                        scales: {
                            x: axisProperties(props.axesTitles.x),
                            y: axisProperties(props.axesTitles.y)
                        }
                    }}
                />
            ) : null}
        </>
    )
}
