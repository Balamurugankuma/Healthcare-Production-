import { Link, useNavigate } from "react-router-dom";


export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-lg">Health Tracker</h1>

      <div className="flex gap-6 items-center">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/add">Add Health</Link>
        <Link to="/report">AI Assist</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/treatments">Treatment</Link>
        <button onClick={logout} className="text-red-400">
          Logout
        </button>
      </div>
    </nav>
  );
}
