import { useState, useEffect } from "react";

interface ScheduleButtonProps {
  candidate: { email: string };
}

export default function ScheduleButton({ candidate }: ScheduleButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null);

  // Génère les 10 prochains jours
  const next10Days = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const generateTimeSlots = (start = 8, end = 18) => {
    const slots: string[] = [];
    for (let h = start; h < end; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
      slots.push(`${h.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();

  // Récupère le créneau confirmé côté candidat
  const fetchConfirmed = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/get_slots/${encodeURIComponent(candidate.email)}`
      );
      const data = await res.json();
      setConfirmedSlot(data.confirmed);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConfirmed();
  }, [candidate.email]);

  const toggleDay = (day: Date) => {
    setSelectedDays(prev => {
      const exists = prev.some(d => d.toDateString() === day.toDateString());
      if (exists) return prev.filter(d => d.toDateString() !== day.toDateString());
      return [...prev, day];
    });
  };

  const toggleSlot = (day: Date, slot: string) => {
    const slotId = `${day.toISOString().split("T")[0]} ${slot}`;
    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slotId));
    } else if (selectedSlots.length < 5) {
      setSelectedSlots([...selectedSlots, slotId]);
    } else {
      alert("Maximum 5 créneaux autorisés !");
    }
  };

  const sendSlots = async () => {
    if (selectedSlots.length === 0) return;

    try {
      await fetch(`http://localhost:8000/api/propose_slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_email: candidate.email,
          proposed_slots: selectedSlots,
        }),
      });

      // Après proposition, on récupère le créneau confirmé pour rester synchro
      await fetchConfirmed();

      setOpen(false);
      setSelectedDays([]);
      setSelectedSlots([]);
      alert("Créneaux envoyés au candidat !");
    } catch (err) {
      console.error(err);
      alert("Impossible d'envoyer les créneaux");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {confirmedSlot ? `RDV organisé le ${confirmedSlot}` : "Planifier RDV"}
      </button>

      {open && !confirmedSlot && (
        <div className="absolute z-50 top-16 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-xl p-4 bg-white border rounded shadow-lg">
          <h3 className="text-lg font-bold mb-2">Choisir vos jours</h3>

          <div className="grid grid-cols-5 gap-2 mb-4">
            {next10Days.map(day => {
              const isSelected = selectedDays.some(d => d.toDateString() === day.toDateString());
              return (
                <div
                  key={day.toDateString()}
                  onClick={() => toggleDay(day)}
                  className={`cursor-pointer rounded-lg p-2 text-center transition ${
                    isSelected ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div className="text-xs">
                    {day.toLocaleDateString(undefined, { weekday: "short" })}
                  </div>
                  <div className="text-sm font-semibold">{day.getDate()}</div>
                </div>
              );
            })}
          </div>

          {selectedDays.map(day => (
            <div key={day.toDateString()} className="mb-4">
              <h4 className="font-semibold mb-1">{day.toDateString()}</h4>
              <div className="grid grid-cols-6 gap-1">
                {timeSlots.map(slot => {
                  const slotId = `${day.toISOString().split("T")[0]} ${slot}`;
                  const isSelected = selectedSlots.includes(slotId);
                  return (
                    <div
                      key={slotId}
                      onClick={() => toggleSlot(day, slot)}
                      className={`cursor-pointer rounded px-2 py-1 text-xs text-center border transition ${
                        isSelected
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-gray-100 hover:bg-gray-200 border-gray-300"
                      }`}
                    >
                      {slot}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={sendSlots}
              disabled={selectedSlots.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Envoyer au candidat
            </button>
            <button
              onClick={() => setOpen(false)}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Annuler
            </button>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            Vous pouvez sélectionner jusqu'à 5 créneaux maximum
          </p>
        </div>
      )}
    </>
  );
}
