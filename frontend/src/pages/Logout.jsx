import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Logout() {
  const navigate = useNavigate();

  //Osigurava da se funkcija performLogout poziva samo jednom kada se komponenta učita
  useEffect(() => {
    const performLogout = async () => {
      const token = localStorage.getItem("token");

      //  Ako korisnik nije ulogovan — odmah ga vrati na login
      if (!token) {
        alert("Niste prijavljeni!");
        console.warn("Nema tokena — preusmeravam na login.");
        navigate("/login");
        return;
      }

      try {
        //  Logout samo ako ima token (ulogovan korisnik)
        await api.post("/logout");
        console.log("Logout uspešan");
      } catch (err) {
        if (err.response?.status === 401) {
          console.warn("Nalog nije autentifikovan — redirect na login.");
        } else {
          console.error("Greška pri odjavi:", err);
        }
      }

      // U svakom slučaju obriši token i vrati ga na login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    };

    performLogout();
    //Moderne verzije Reacta/ESLinta zahtevaju da se sve funkcije i varijable korišćene unutar useEffect bloka (kao što je Maps) navedu u nizu zavisnosti
  }, [navigate]);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#ff8fa3",
        fontSize: "1.2rem",
      }}
    >
      Logging out...
    </div>
  );
}
