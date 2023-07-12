import * as tf from '@tensorflow/tfjs'
import { useState, useEffect } from 'react'

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'

export default function Models(props) {
    const [model, setModel] = useState(0)
    const handleModelChange = (event) => {
        setModel(event.target.value)
    }

    const useStyles = makeStyles({
        select: {
            '& .MuiSvgIcon-root': {
                color: 'white'
            }
        }
    })
    const classes = useStyles()

    return (
        <div className="grid h-[50vh] w-[100vw] place-items-center">
            <h1 className="text-3xl text-primary">
                Linear Regression Analysis
            </h1>
            <div className="my-[2vh] grid w-[100vw] place-items-center">
                <Select
                    value={model}
                    onChange={handleModelChange}
                    sx={{ border: '1px solid white', color: '#ffffff' }}
                    className={classes.select}
                >
                    <MenuItem value={0}>
                        Predicting RS based on OBP and SLG
                    </MenuItem>
                    <MenuItem value={1}>
                        Predicting RA based on opponent OBP and opponent SLG
                    </MenuItem>
                    <MenuItem value={2}>
                        Predicting Wins based on run difference
                    </MenuItem>
                </Select>
            </div>
            {model === 0 && (
                <>
                    <Model
                        xLabel="OBP"
                        xLabel2="SLG"
                        yLabel="RS"
                        data={props.data}
                    />
                </>
            )}
            {model === 1 && (
                <Model
                    xLabel="OOBP"
                    xLabel2="OSLG"
                    yLabel="RA"
                    data={props.data}
                />
            )}
            {model === 2 && (
                <Model
                    xLabel="RS"
                    xLabel2="RA"
                    yLabel="W"
                    data={props.data}
                    difference={true}
                />
            )}
        </div>
    )
}

function Model(props) {
    const [predictionValue, setPredictionValue] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [randTeam, setRandTeam] = useState(false)
    const importData = props.data
    const filterData = importData.filter((entry) => entry[props.xLabel] !== '')

    const numCols = props.difference ? 1 : 2
    const model = tf.sequential()
    model.add(tf.layers.dense({ units: 1, inputShape: [numCols] }))
    model.compile({
        loss: 'meanSquaredError',
        optimizer: 'sgd'
        // optimizer: tf.train.sgd(0.01)
    })

    const x1Data = filterData
        .map((item) => parseFloat(item[props.xLabel]))
        .filter(Boolean)
    const x2Data = filterData
        .map((item) => parseFloat(item[props.xLabel2]))
        .filter(Boolean)
    const yData = filterData.map((item) => parseFloat(item[props.yLabel]))

    useEffect(() => {
        if (randTeam) {
            const value1 = parseFloat(randTeam[props.xLabel])
            const value2 = parseFloat(randTeam[props.xLabel2])
            const outputTensor = tf.tensor1d(yData)

            const twoVarNormalize = (arr1, arr2) => {
                // Normalize each variable with its respective min/max
                const max1 = Math.max.apply(Math, arr1)
                const min1 = Math.min.apply(Math, arr1)
                const max2 = Math.max.apply(Math, arr2)
                const min2 = Math.min.apply(Math, arr2)

                const xData = arr1.map((element, i) => [
                    (element - min1) / (max1 - min1),
                    (arr2[i] - min2) / (max2 - min2)
                ])

                const inputTensor = tf.tensor2d(xData, [xData.length, numCols])

                model
                    .fit(inputTensor, outputTensor, { epochs: 25 })
                    .then(() => {
                        const prediction = model.predict(
                            tf.tensor2d(
                                [
                                    (value1 - min1) / (max1 - min1),
                                    (value2 - min2) / (max2 - min2)
                                ],
                                [1, numCols]
                            )
                        )
                        setPredictionValue(prediction.dataSync()[0])
                    })
            }

            const oneVarNormalize = (arr1, arr2) => {
                // Compute difference, normalize with min/max
                const diffArr = arr1.map((element, i) => element - arr2[i])
                const max1 = Math.max.apply(Math, diffArr)
                const min1 = Math.min.apply(Math, diffArr)

                const xData = diffArr.map(
                    (element) => (element - min1) / (max1 - min1)
                )

                const inputTensor = tf.tensor1d(xData)

                model
                    .fit(inputTensor, outputTensor, { epochs: 25 })
                    .then(() => {
                        const prediction = model.predict(
                            tf.tensor1d([
                                (value1 - value2 - min1) / (max1 - min1)
                            ])
                        )
                        setPredictionValue(prediction.dataSync()[0])
                    })
            }

            // Check if we're looking at 2 input variables or 1, if 2 we normalize here
            props.difference
                ? oneVarNormalize(x1Data, x2Data)
                : twoVarNormalize(x1Data, x2Data)

        }
    }, [importData, refresh])

    return (
        <>
            <a
                onClick={() => {
                    setRefresh(!refresh)
                    setPredictionValue(null)
                    setRandTeam(
                        filterData[
                            Math.floor(Math.random() * filterData.length)
                        ]
                    )
                }}
                className="btn-primary -mt-1.5 rounded-full bg-ivory px-4 py-1.5 text-center text-gray-600 hover:cursor-pointer hover:bg-bg3 hover:text-primary"
            >
                Refresh team
            </a>
            <table className="text-primary">
                <tbody>
                    <tr>
                        <th className="border-b-2 border-r-2 border-gold p-2">
                            Team
                        </th>
                        <th className="border-b-2 border-r-2 border-gold p-2">
                            Year
                        </th>
                        <th className="border-b-2 border-r-2 border-gold p-2">
                            {props.xLabel}
                        </th>
                        {props.xLabel2 ? (
                            <th className="border-b-2 border-r-2 border-gold p-2">
                                {props.xLabel2}
                            </th>
                        ) : null}
                        <th className="border-b-2 border-r-2 border-gold p-2">
                            {'Predicted ' + props.yLabel}
                        </th>
                        <th className="border-b-2 border-gold p-2">
                            {'Actual ' + props.yLabel}
                        </th>
                    </tr>
                    <tr className="text-center">
                        <td className="border-r-2 border-gold p-2">
                            {randTeam ? randTeam['Team'] : '-'}
                        </td>
                        <td className="border-r-2 border-gold p-2">
                            {randTeam ? randTeam['Year'] : '-'}
                        </td>
                        <td className="border-r-2 border-gold p-2">
                            {randTeam ? randTeam[props.xLabel] : '-'}
                        </td>
                        {props.xLabel2 ? (
                            <td className="border-r-2 border-gold p-2">
                                {randTeam ? randTeam[props.xLabel2] : '-'}
                            </td>
                        ) : null}
                        <td className="border-r-2 border-gold p-2">
                            {predictionValue
                                ? predictionValue.toFixed(0)
                                : randTeam
                                ? 'loading...'
                                : '-'}
                        </td>
                        <td>{randTeam ? randTeam[props.yLabel] : '-'}</td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}
