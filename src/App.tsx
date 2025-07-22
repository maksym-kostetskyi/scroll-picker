import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ScrollPicker } from "./scroll-picker/ScrollPicker";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ScrollPicker />} />
    </Routes>
  );
}

export default App;
