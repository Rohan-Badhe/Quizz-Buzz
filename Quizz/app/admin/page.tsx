"use client"

import { useState, useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { toast } from "react-toastify"

export default function AdminPage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [roomId, setRoomId] = useState("")
  const [question, setQuestion] = useState("")
  const [participants, setParticipants] = useState<string[]>([])
  const [buzzerQueue, setBuzzerQueue] = useState<string[]>([])

  useEffect(() => {
    const newSocket = io("http://localhost:3000")
    setSocket(newSocket)

    newSocket.on("participantJoined", (name: string) => {
      setParticipants((prev) => [...prev, name])
      toast.success(`${name} joined the room!`)
    })

    newSocket.on("buzzerPressed", (name: string) => {
      setBuzzerQueue((prev) => [...prev, name])
      toast.info(`${name} pressed the buzzer!`)
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const createRoom = () => {
    const newRoomId = Math.floor(10000 + Math.random() * 90000).toString()
    setRoomId(newRoomId)
    socket?.emit("createRoom", newRoomId)
    toast.success(`Room created with ID: ${newRoomId}`)
  }

  const sendQuestion = () => {
    if (!question.trim()) {
      toast.error("Please enter a question")
      return
    }
    socket?.emit("newQuestion", { roomId, question })
    setQuestion("")
    setBuzzerQueue([])
    toast.success("Question sent to participants")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">Admin Interface</h1>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <button
          onClick={createRoom}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full mb-6 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create Room
        </button>
        {roomId && (
          <div className="mb-6">
            <p className="text-2xl font-semibold mb-4">
              Room ID: <span className="text-blue-600">{roomId}</span>
            </p>
            <div className="flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question"
                className="flex-grow border rounded-l-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendQuestion}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-r-full transition duration-300 ease-in-out"
              >
                Send Question
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="w-full md:w-1/2 mb-6 md:mb-0">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Participants ({participants.length})</h2>
            <ul className="bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto">
              {participants.map((name, index) => (
                <li key={index} className="mb-2 p-2 bg-white rounded shadow">
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Buzzer Queue</h2>
            <ol className="bg-gray-100 rounded-lg p-4 h-64 overflow-y-auto">
              {buzzerQueue.map((name, index) => (
                <li key={index} className="mb-2 p-2 bg-white rounded shadow">
                  <span className="font-bold mr-2">{index + 1}.</span> {name}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

