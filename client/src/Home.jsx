import Connection from './Connection.jsx'
import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-row gap-x-10">
            <button
                className="h-[10vh] w-[20vw] bg-blue-400"
                onClick={() => navigate('/room1')}
            >
                Room 1
            </button>
            <button
                className="h-[10vh] w-[20vw] bg-red-400"
                onClick={() => navigate('/room2')}
            >
                Room 2
            </button>
            <button
                className="h-[10vh] w-[20vw] bg-green-400"
                onClick={() => navigate('/room3')}
            >
                Room 3
            </button>
        </div>
    )
}
