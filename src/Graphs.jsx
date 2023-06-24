import ScatterGraph from './Scatter.jsx'
import { useState } from 'react'

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { makeStyles } from '@mui/styles'

export default function Graphs() {
    const [runsGraph, setRunsGraph] = useState(0)
    const handleRunsChange = (event) => {
        setRunsGraph(event.target.value)
    }

    const [statsGraph, setStatsGraph] = useState(0)
    const handleStatsChange = (event) => {
        setStatsGraph(event.target.value)
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
        <>
            <h1 className="grid place-items-center text-3xl text-primary">
                Analysis of stats vs runs scored
            </h1>
            <div className="my-[2vh] grid w-[100vw] place-items-center">
                <Select
                    value={statsGraph}
                    onChange={handleStatsChange}
                    sx={{ border: '1px solid white', color: '#ffffff' }}
                    className={classes.select}
                >
                    <MenuItem value={0}>
                        On Base Percentage vs Runs Scored
                    </MenuItem>
                    <MenuItem value={1}>
                        Slugging Percentage vs Runs Scored
                    </MenuItem>
                </Select>
            </div>
            <div className="mx-[10vw] h-[100vh] w-[80vw]">
                {statsGraph === 0 && (
                    <ScatterGraph
                        title="On Base Percentage vs Runs Scored"
                        xKey="OBP"
                        yKey="RS"
                        axesTitles={{
                            x: 'On Base Percentage',
                            y: 'Runs Scored'
                        }}
                        pointTitles={{ x: ' on base, ', y: ' runs scored' }}
                        usePlayoffColors={true}
                    />
                )}
                {statsGraph === 1 && (
                    <ScatterGraph
                        title="Slugging Percentage vs Runs Scored"
                        xKey="SLG"
                        yKey="RS"
                        axesTitles={{
                            x: 'Slugging Percentage',
                            y: 'Runs Scored'
                        }}
                        pointTitles={{ x: ' slugging, ', y: ' runs scored' }}
                        usePlayoffColors={true}
                    />
                )}
            </div>
            <h1 className="grid place-items-center text-3xl text-primary">
                Analysis of runs vs wins
            </h1>
            <div className="my-[2vh] grid w-[100vw] place-items-center">
                <Select
                    value={runsGraph}
                    onChange={handleRunsChange}
                    sx={{ border: '1px solid white', color: '#ffffff' }}
                    className={classes.select}
                >
                    <MenuItem value={0}>Runs Allowed vs Wins</MenuItem>
                    <MenuItem value={1}>Runs Scored vs Wins</MenuItem>
                    <MenuItem value={2}>Run Difference vs Wins</MenuItem>
                </Select>
            </div>
            <div className="mx-[10vw] h-[100vh] w-[80vw]">
                {runsGraph === 0 && (
                    <ScatterGraph
                        title="Runs Allowed vs Wins"
                        xKey="RA"
                        yKey="W"
                        axesTitles={{ x: 'Runs Allowed', y: 'Wins' }}
                        pointTitles={{ x: ' runs allowed, ', y: ' wins' }}
                        usePlayoffColors={true}
                    />
                )}
                {runsGraph === 1 && (
                    <ScatterGraph
                        title="Runs Scored vs Wins"
                        xKey="RS"
                        yKey="W"
                        axesTitles={{ x: 'Runs Scored', y: 'Wins' }}
                        pointTitles={{ x: ' runs scored, ', y: ' wins' }}
                        usePlayoffColors={true}
                    />
                )}
                {runsGraph === 2 && (
                    <ScatterGraph
                        title="Runs Difference (Scored - Allowed) vs Wins"
                        diff={true}
                        xKey="RS"
                        xKey2="RA"
                        yKey="W"
                        axesTitles={{ x: 'Run Difference', y: 'Wins' }}
                        pointTitles={{ x: ' run difference, ', y: ' wins' }}
                        usePlayoffColors={true}
                    />
                )}
            </div>
        </>
    )
}
