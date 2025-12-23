'use client'
 
export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">{error.message || 'An unexpected error occurred'}</p>
        <div className="space-x-4">
          <button 
            onClick={() => reset()}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Try again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}