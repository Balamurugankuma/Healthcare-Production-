export default function ReminderToast({ reminder, onClose, onSnooze }) {
  if (!reminder) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-slate-900 border border-blue-500 rounded-xl shadow-2xl p-4 animate-slide-in">
      <h3 className="text-white font-bold mb-1">⏰ Medicine Reminder</h3>

      <p className="text-blue-300 text-sm mb-3">
        {reminder.medicineName} — {reminder.time}
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => onSnooze(5)}
          className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm"
        >
          Snooze 5m
        </button>

        <button
          onClick={() => onSnooze(10)}
          className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm"
        >
          Snooze 10m
        </button>

        <button
          onClick={onClose}
          className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm"
        >
          Taken
        </button>
      </div>
    </div>
  );
}
