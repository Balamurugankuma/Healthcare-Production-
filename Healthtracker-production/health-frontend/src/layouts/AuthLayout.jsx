import Navbar from "../components/Navbar";
import useMedicineReminder from "../hooks/useMedicineReminder";
import API from "../services/api";
import { useEffect, useState, useRef } from "react";
import ReminderToast from "../components/ReminderToast";

export default function AuthLayout({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef(null);

  // 🔓 Unlock sound (user click)
  const enableSound = () => {
    audioRef.current = new Audio("/notification.wav");
    audioRef.current.volume = 1;
    audioRef.current
      .play()
      .then(() => setSoundEnabled(true))
      .catch(() => alert("Please allow sound"));
  };

  // 🔔 Reminder polling (GLOBAL)
  useEffect(() => {
    if (!soundEnabled) return;

    const interval = setInterval(async () => {
      try {
        const res = await API.get("/medicines/reminders/due");

        if (res.data.length > 0) {
          audioRef.current?.play().catch(() => {});
          // later → toast instead of alert
        }
      } catch (err) {
        console.log("Reminder check failed");
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [soundEnabled]);
  const [reminder, setReminder] = useState(null);
const snoozeUntilRef = useRef(null);
const handleTaken = async () => {
  try {
    await API.post(`/medicines/take/${reminder.id}`);
    setReminder(null);
  } catch {
    alert("Failed to mark taken");
  }
};

const handleSnooze = (minutes) => {
  const snoozeUntil = new Date();
  snoozeUntil.setMinutes(snoozeUntil.getMinutes() + minutes);

  snoozeUntilRef.current = snoozeUntil;
  setReminder(null);
};

  useMedicineReminder(); // ✅ GLOBAL REMINDER
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const now = new Date();

      if (snoozeUntilRef.current && now < snoozeUntilRef.current) return;

      const res = await API.get("/medicines/reminders/due");

      if (res.data.length > 0 && !reminder) {
        const r = res.data[0];

        setReminder({
          id: r._id,
          medicineName: r.name,
          time: r.time
        });

        audioRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.error("Reminder error");
    }
  }, 60000);

  return () => clearInterval(interval);
}, [reminder]);



  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">

      <Navbar />
       {!soundEnabled && (
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={enableSound}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg"
          >
            🔔 Enable Notifications
          </button>
        </div>
      )}
      <div className="pt-16">
        {children}
        <ReminderToast
    reminder={reminder}
    onClose={handleTaken}
    onSnooze={handleSnooze}
  />
      </div>
    </div>
  );
}
