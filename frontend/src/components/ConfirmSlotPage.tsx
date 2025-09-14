import { useState, useEffect } from "react"; 
import { useParams } from "react-router-dom";

export default function ConfirmSlotPage() {
  const { email } = useParams<{ email: string }>();
  const decodedEmail = email ? decodeURIComponent(email) : "";

  const [slots, setSlots] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmedSlot, setConfirmedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupère les créneaux proposés et le créneau confirmé
  const fetchSlots = async () => {
    if (!decodedEmail) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/get_slots/${decodedEmail}`);
      const data = await res.json();
      setSlots(data.proposed || []);
      setConfirmedSlot(data.confirmed || null);
    } catch (err) {
      console.error(err);
      alert("Impossible de récupérer les créneaux");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [decodedEmail]);

  // Confirme le créneau sélectionné
  const confirmSlot = async () => {
    if (!selected || !decodedEmail) return;

    try {
      const res = await fetch("http://localhost:8000/api/confirm_slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_email: decodedEmail, confirmed_slot: selected }),
      });

      if (!res.ok) throw new Error("Erreur lors de la confirmation");

      alert(`Vous avez confirmé : ${selected}`);
      setConfirmedSlot(selected); // met à jour localement le créneau confirmé
      setSelected(null);          // reset sélection
      setSlots([]);               // tu peux vider ou garder selon ton UX
    } catch (err) {
      console.error(err);
      alert("Impossible de confirmer le créneau");
    }
  };

  if (!decodedEmail) return <p>Email non fourni dans l'URL</p>;

  if (loading) return <p>Chargement des créneaux...</p>;

  return (
    <div className="p-6 max-w-md mx-auto mt-10 bg-white rounded shadow">
      {confirmedSlot ? (
        <p className="text-green-600 font-semibold text-lg">
          RDV organisé le {confirmedSlot}
        </p>
      ) : (
        <>
          <h2 className="text-lg font-bold mb-4">Choisissez un créneau :</h2>
          {slots.length === 0 ? (
            <p>Aucun créneau proposé pour le moment.</p>
          ) : (
            <div className="space-y-2">
              {slots.map((slot) => (
                <label
                  key={slot}
                  className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${
                    selected === slot ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="slot"
                    value={slot}
                    checked={selected === slot}
                    onChange={() => setSelected(slot)}
                    className="hidden"
                  />
                  {slot}
                </label>
              ))}
            </div>
          )}
          <button
            onClick={confirmSlot}
            disabled={!selected}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Confirmer
          </button>
        </>
      )}
    </div>
  );
}
