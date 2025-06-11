import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaUser, FaHome, FaTachometerAlt, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion"; // ✅ Import framer-motion

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/");
    }
  };

  const navAnimation = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 0.95 },
  };

  return (
    <nav className="bg-purple-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-xl font-bold">
        FastClaim
      </Link>
      <div className="flex gap-4 items-center">

        <motion.div {...navAnimation}>
          <Link to="/" className="flex items-center gap-1 hover:text-purple-300">
            <FaHome /> Home
          </Link>
        </motion.div>

        {user && (
          <motion.div {...navAnimation}>
            <Link to="/dashboard" className="flex items-center gap-1 hover:text-purple-300">
              <FaTachometerAlt /> Dashboard
            </Link>
          </motion.div>
        )}

        {user && (
          <motion.div {...navAnimation}>
            <Link to="/profile" className="flex items-center gap-1 hover:text-purple-300">
              <FaUser /> Profile
            </Link>
          </motion.div>
        )}

        {user ? (
          <motion.div {...navAnimation}>
            <button onClick={handleLogout} className="flex items-center gap-1 hover:text-purple-300">
              <FaSignOutAlt /> Logout
            </button>
          </motion.div>
        ) : (
          <motion.div {...navAnimation}>
            <Link to="/login" className="flex items-center gap-1 hover:text-purple-300">
              <FaSignInAlt /> Login
            </Link>
          </motion.div>
        )}
      </div>
    </nav>
  );
}
