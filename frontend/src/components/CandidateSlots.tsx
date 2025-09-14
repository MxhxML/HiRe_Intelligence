import { useEffect, useState } from "react";

export default function CandidateSlots({ candidateEmail }: { candidateEmail: string }) {
  const [slots, setSlots] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const fetchSlots = async () => {
    const res = await fetch(`/api/get_slots/${candidateEmail}`);
    const data = await res.json();
    setSlots(data.proposed);
    setConfirmed(data.confirmed);
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 5000); // toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h3>Créneaux proposés :</h3>
      <ul>
        {slots.map(slot => (
          <li key={slot} style={{ fontWeight: slot === confirmed ? "bold" : "normal" }}>
            {slot} {slot === confirmed && "(Confirmé)"}
          </li>
        ))}
      </ul>
    </div>
  );
}
