import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-5xl font-bold mb-8 text-white">EnhancedQuickBuzz</h1>
      <p className="text-xl mb-8 text-white">Interactive Quiz Buzzer System</p>
      <div className="flex space-x-4">
        <Link
          href="/admin"
          className="bg-white text-blue-600 hover:bg-blue-100 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Admin Interface
        </Link>
        <Link
          href="/user"
          className="bg-white text-purple-600 hover:bg-purple-100 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          User Interface
        </Link>
      </div>
    </main>
  )
}

