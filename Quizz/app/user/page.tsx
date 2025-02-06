"use client"

import { useState, useEffect } from "react"
import { io, type Socket } from "socket.io-client"
import { toast } from "react-toastify"

export default function UserPage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [name, setName] = useState("")
  const [roomId, setRoomId] = useState("")
  const [joined, setJoined] = useState(false)
  const [question, setQuestion] = useState("")
  const [buzzerPressed, setBuzzerPressed] = useState(false)

  useEffect(() => {
    const newSocket = io("http://localhost:3000")
    setSocket(newSocket)

    newSocket.on("questionReceived", (newQuestion: string) => {
      setQuestion(newQuestion)
      setBuzzerPressed(false)
      toast.info("New question received!")
    })

    newSocket.on("roomNotFound", () => {
      toast.error("Room not found. Please check the Room ID.")
    })

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" && !buzzerPressed && joined) {
        pressBuzzer()
      }
    }

    window.addEventListener("keydown", handleKeyPress)

    return () => {
      newSocket.disconnect()
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [buzzerPressed, joined])

  const joinRoom = () => {
    if (name && roomId) {
      socket?.emit("joinRoom", { name, roomId })
      socket?.on("roomJoined", () => {
        setJoined(true)
        toast.success(`Welcome, ${name}! You've joined room ${roomId}`)
      })
    } else {
      toast.error("Please enter your name and room ID")
    }
  }

  const pressBuzzer = () => {
    if (!buzzerPressed) {
      socket?.emit("pressBuzzer", { name, roomId })
      setBuzzerPressed(true)
      playBuzzerSound()
      toast.success("Buzzer pressed!")
    }
  }

  const playBuzzerSound = () => {
    const audio = new Audio("/buzzer-sound.mp3")
    audio.play()
  }

  if (!joined) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">Join a Room</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full border rounded-full p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="w-full border rounded-full p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={joinRoom}
            className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Join Room
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">User Interface</h1>
        <p className="text-xl mb-6 text-center">
          Welcome, <span className="font-bold text-purple-600">{name}</span>!
        </p>
        {question ? (
          <div>
            <p className="text-lg mb-6 p-4 bg-gray-100 rounded-lg">Question: {question}</p>
            <button
              onClick={pressBuzzer}
              disabled={buzzerPressed}
              className={`w-full ${
                buzzerPressed ? "bg-gray-500" : "bg-red-500 hover:bg-red-700"
              } text-white font-bold py-4 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105`}
            >
              {buzzerPressed ? "Buzzer Pressed" : "Press Buzzer"}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              You can also press the spacebar to activate the buzzer
            </p>
          </div>
        ) : (
          <p className="text-lg text-center">Waiting for a question...</p>
        )}
      </div>
    </div>
  )
}

