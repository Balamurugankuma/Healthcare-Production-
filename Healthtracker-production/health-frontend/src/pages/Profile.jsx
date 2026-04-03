import { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [avatar, setAvatar] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const [passwordMessage, setPasswordMessage] = useState("");
const handlePasswordChange = async (e) => {
  e.preventDefault();
  setPasswordMessage("");

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    setPasswordMessage("New passwords do not match");
    return;
  }

  try {
    await API.put("/profile/change-password", {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });

    setPasswordMessage("Password changed successfully");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  } catch (err) {
    setPasswordMessage(
      err.response?.data?.message || "Password change failed"
    );
  }
};



  // Fetch profile from backend
 useEffect(() => {
  API.get("/profile")
    .then((res) => {
      setForm(res.data);
      setAvatar(res.data.avatar || "");
    })
    .catch(() => setMessage("Failed to load profile"));
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await API.put("/profile", form);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage("Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-8">
      <div className="max-w-xl mx-auto bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">My Account</h2>

        {message && (
          <p className="mb-4 text-sm text-green-400">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
  <img
    src={
      avatar
        ? `http://localhost:5000/${avatar}`
        : "https://via.placeholder.com/120"
    }
    alt="avatar"
    className="w-28 h-28 rounded-full object-cover border-4 border-blue-600"
  />

  <label className="mt-3 cursor-pointer text-blue-400 text-sm">
    Change Avatar
    <input
      type="file"
      hidden
      accept="image/*"
      onChange={async (e) => {
        const formData = new FormData();
        formData.append("avatar", e.target.files[0]);

        const res = await API.post("/profile/avatar", formData);
        setAvatar(res.data.avatar);
      }}
    />
  </label>
</div>

          <div>
            <label className="text-gray-400 text-sm font-semibold">
              Name
            </label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm font-semibold">
              Email
            </label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-gray-400 cursor-not-allowed"
              value={form.email}
              disabled
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm font-semibold">
              Phone
            </label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
              value={form.phone || ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm font-semibold">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full mt-1 p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
              value={form.dateOfBirth || ""}
              onChange={(e) =>
                setForm({ ...form, dateOfBirth: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
        <hr className="my-8 border-slate-700" />

<h3 className="text-xl font-bold text-white mb-4">
  Change Password
</h3>

{passwordMessage && (
  <p className="mb-3 text-sm text-blue-400">{passwordMessage}</p>
)}

<form onSubmit={handlePasswordChange} className="space-y-4">
  <input
    type="password"
    placeholder="Current Password"
    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
    value={passwordForm.currentPassword}
    onChange={(e) =>
      setPasswordForm({
        ...passwordForm,
        currentPassword: e.target.value,
      })
    }
    required
  />

  <input
    type="password"
    placeholder="New Password"
    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
    value={passwordForm.newPassword}
    onChange={(e) =>
      setPasswordForm({
        ...passwordForm,
        newPassword: e.target.value,
      })
    }
    required
  />

  <input
    type="password"
    placeholder="Confirm New Password"
    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
    value={passwordForm.confirmPassword}
    onChange={(e) =>
      setPasswordForm({
        ...passwordForm,
        confirmPassword: e.target.value,
      })
    }
    required
  />

  <button
    type="submit"
    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 font-semibold text-white"
  >
    Update Password
  </button>
</form>

      </div>
    </div>
    
  );
}

