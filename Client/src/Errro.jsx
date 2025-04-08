export default function Error({ message = "Something went wrong." }) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">⚠️ Error</h2>
        <p className="text-lg text-gray-700">{message}</p>
      </div>
    )
  }