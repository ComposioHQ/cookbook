import 'rsuite/Loader/styles/index.css';
import { Loader } from 'rsuite';

export default function AddNewUserOutline({ loading, onClick }) {
  return (
    <button
      id="add-new-user-section"
      type="button"
      onClick={onClick}
      className="min-w-3xl mx-8 h-24 rounded-lg border-2 border-dashed border-gray-300 px-12 py-2 text-center hover:border-gray-400 hover:bg-green-50"
    >
      {loading ? <Loader speed="slow" size="sm" /> : (
        <>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
            className="mx-auto h-10 w-10 text-gray-300"
          >
            <path
              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mt-2 block text-sm font-medium text-gray-800">Add a new user</span>
        </>
      )}
    </button>
  )
}
