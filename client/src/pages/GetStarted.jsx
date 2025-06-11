import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-300 p-6">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Welcome to FastClaim</h2>
        <p className="text-gray-600 mb-8">Already a customer? Log in. Otherwise, sign up to get started.</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-purple-700 text-white py-2 rounded-full hover:bg-purple-800 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="border border-purple-700 text-purple-700 py-2 rounded-full hover:bg-purple-100 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
