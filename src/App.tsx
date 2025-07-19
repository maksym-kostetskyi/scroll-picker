import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setDate(new Date()), 1);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      Milliseconds since midnight, January 1, 1970 UTC: {date.getTime()}
    </div>
  );
}

export default App;
