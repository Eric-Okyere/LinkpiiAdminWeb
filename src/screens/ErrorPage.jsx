
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 px-4">
      <h1 className="text-8xl font-bold text-red-500">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-lg text-gray-600 mt-2">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg font-medium rounded hover:bg-blue-600 transition duration-200"
      >
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;
