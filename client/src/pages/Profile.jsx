import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    dob: "",
    gender: "",
    contact: "",
    altContact: "",
    address: "",
    profilePic: "",
  });
  const [uploading, setUploading] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleInput = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const storageRef = ref(storage, `profilePics/${user.uid}`);
    setUploading(true);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setProfile({ ...profile, profilePic: url });
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await setDoc(doc(db, "users", user.uid), profile);
      alert("Profile updated!");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-purple-800 mb-6 text-center">Profile Settings</h2>

      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={
            profile.profilePic
              ? profile.profilePic
              : "https://www.svgrepo.com/show/382106/default-avatar.svg"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-4 border-purple-300 shadow-md"
        />

        <label className="text-purple-700 underline cursor-pointer mt-2">
          {uploading ? "Uploading..." : "Upload Profile Picture"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleInput}
          placeholder="Full Name"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="date"
          name="dob"
          value={profile.dob}
          onChange={handleInput}
          className="w-full border rounded px-3 py-2"
        />
        <select
          name="gender"
          value={profile.gender}
          onChange={handleInput}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Non-binary">Non-binary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        <input
          type="text"
          name="contact"
          value={profile.contact}
          onChange={handleInput}
          placeholder="Contact Number"
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          name="altContact"
          value={profile.altContact}
          onChange={handleInput}
          placeholder="Alternate Contact Number"
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          name="address"
          value={profile.address}
          onChange={handleInput}
          placeholder="Address"
          className="w-full border rounded px-3 py-2"
        />

        <button
          type="submit"
          className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
