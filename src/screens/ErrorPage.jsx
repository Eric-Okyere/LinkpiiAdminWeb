import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-ink-50 px-4 text-center">
      <Helmet>
        <title>Page Not Found — Linkpii</title>
      </Helmet>
      <span className="font-display text-8xl font-extrabold text-brand-600">404</span>
      <h1 className="mt-4 text-2xl font-semibold text-ink-900">Page Not Found</h1>
      <p className="mt-2 max-w-sm text-ink-500">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-6 rounded-xl bg-brand-600 px-6 py-3 text-lg font-medium text-white shadow-soft transition-colors duration-200 hover:bg-brand-700"
      >
        Go to Home
      </button>
    </div>
  );
};

export default ErrorPage;
