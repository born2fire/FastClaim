import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="bg-purple-100 py-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        {/* Left content */}
        <div className="mb-8 md:mb-0">
          <h1 className="text-4xl font-extrabold text-purple-800 mb-4">
            Never Lose a Receipt Again.
          </h1>
          <p className="text-gray-700 mb-6">
            FastClaim makes it easy to store, track, and manage your warranty receipts — all in one place.
          </p>
          <button
            onClick={() => navigate("/get-started")}
            className="bg-purple-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple-800 transition"
          >
            Get Started
          </button>
        </div>

        {/* Right SVG Icon */}
        <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#7C3AED"
            className="w-48 h-48"
          >
            <path d="M4 7V5a3 3 0 013-3h10a3 3 0 013 3v2h1a1 1 0 011 1v11a3 3 0 01-3 3H5a3 3 0 01-3-3V8a1 1 0 011-1h1zm2 0h12V5a1 1 0 00-1-1H7a1 1 0 00-1 1v2zm5 4v2h4v-2h-4z" />
          </svg>
        </div>
      </div>
    </section>
  );
}
