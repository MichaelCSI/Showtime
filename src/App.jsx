import GraphOne from './GraphOne.jsx'

export default function App() {
    return (
        <div
            className={`to-bg3' h-[100vh] overflow-y-scroll bg-gradient-to-br from-bg1 via-bg2 to-bg3`}
        >
            <h1 className="text-6xl">DATA SCIENCE</h1>
            <GraphOne />
            <h1 className="text-6xl mt-[100vh]">DATA SCIENCE</h1>
        </div>
    )
}

function Table(props) {
    const criteria = props.criteria
    const data = props.data
    return (
        <table className="mx-[5vw] mt-[5vw] w-[90vw]">
            <tbody>
                <tr className="border-2 border-black p-2">
                    {criteria.map((criteria, index) => (
                        <td
                            key={criteria}
                            className="ml-4 border-b-2 border-black text-sm font-normal leading-6 text-primary md:text-base"
                        >
                            {criteria}
                        </td>
                    ))}
                </tr>
                {data.map((item, index) => (
                    <tr key={index} className="border-2 border-black">
                        {Object.values(item).map((value, index) => (
                            <td
                                key={index}
                                className="ml-4 border-b-2 border-black text-sm font-normal leading-6 text-primary md:text-base"
                            >
                                {value}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
