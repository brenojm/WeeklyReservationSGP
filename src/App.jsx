import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReservationFormComponent } from "./components/reservation-form-component";

function App() {
  return (
    <>
      <ToastContainer position="top-right" hideProgressBar theme="colored" />
      <ReservationFormComponent />
    </>
  );
}

export default App;
