import { useEffect, useState } from "react";

export default function QuestionTimer({ timeout, onTimeOut, mode }) {
  // Δημιουργούμε μια κατάσταση (state) για να παρακολουθούμε τον υπόλοιπο χρόνο.
  const [remainingTime, setRemainingTime] = useState(timeout);

  // Αυτό το useEffect ενεργοποιείται όταν αλλάζει το `timeout` ή το `onTimeOut`.
  // Ορίζει ένα timeout που καλεί τη `onTimeOut` συνάρτηση όταν ο χρόνος εξαντληθεί.
  useEffect(() => {
    const timer = setTimeout(onTimeOut, timeout);

    // Καθαρίζει το timeout αν το component απομακρυνθεί ή ο `timeout` αλλάξει.
    return () => {
      clearTimeout(timer);
    };
  }, [timeout, onTimeOut]);

  // Αυτό το useEffect ενεργοποιείται μία φορά κατά το πρώτο render.
  // Δημιουργεί ένα interval που μειώνει τον υπόλοιπο χρόνο κάθε 100ms.
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => prevRemainingTime - 100); // Μειώνει τον χρόνο κατά 100ms.
    }, 100);

    // Καθαρίζει το interval αν το component απομακρυνθεί.
    return () => {
      clearInterval(interval);
    };
  }, []);

  // Επιστρέφει το στοιχείο progress για να δείξει τον υπόλοιπο χρόνο.
  // Ορίζει το πλάτος του progress bar και το `mode` για να αλλάξει το στυλ.
  return (
    <progress className={`w-96 ${mode}`} max={timeout} value={remainingTime} />
  );
}
