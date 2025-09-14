import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PhoneButton({ phone }: { phone: string }) {
  const [showNumber, setShowNumber] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setShowNumber(!showNumber)}
      >
        <Phone className="h-4 w-4" />
      </Button>

      {showNumber && (
        <div className="absolute top-full mt-2 right-0 w-48 p-2 bg-white border rounded shadow-lg z-50">
          <p className="text-sm mb-2">Numéro : {phone}</p>
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={handleCall} className="bg-green-600 text-white hover:bg-green-700">
              Appeler
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowNumber(false)}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
