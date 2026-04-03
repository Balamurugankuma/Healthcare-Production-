import { useEffect } from "react";
import API from "../services/api";

export default function useMedicineReminder() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await API.get("/medicines/reminders/due");

        if (res.data.length > 0) {
          alert(
            "💊 Medicine Reminder:\n\n" +
              res.data
                .map(
                  (m) =>
                    `${m.name} (${m.dosage})`
                )
                .join("\n")
          );
        }
      } catch (err) {
        console.log("Reminder check failed");
      }
    }, 60000); // every 1 minute

    return () => clearInterval(interval);
  }, []);
}
