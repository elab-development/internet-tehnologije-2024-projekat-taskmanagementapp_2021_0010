import { useState } from "react";
import api from "../api/axios";
//Ovaj custom hook služi da izdvoji i ponovo iskoristi svu logiku za paginirano dobavljanje podataka sa API-ja, 
// tako da komponente ostanu čiste, a pagination se rešava na jednom mestu.
export default function usePaginatedFetch() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
//Extractor je funkcija koja iz celog API odgovora izdvaja (ekstraktuje) samo onaj deo podataka koji je potreban komponenti, najčešće niz objekata za prikaz.
//potreban jer api ne salje uvek isti format podataka 
const fetchData = async (url, page = 1, extractor) => {
    setLoading(true);

    try {
      const finalUrl =
        url.includes("?") ? `${url}&page=${page}` : `${url}?page=${page}`;

      const res = await api.get(finalUrl);

      const incomingData = extractor
        ? extractor(res)
        : res.data.data;

      setData(Array.isArray(incomingData) ? incomingData : []);

      if (res.data.meta) {
        setCurrentPage(res.data.meta.current_page);
        setLastPage(res.data.meta.last_page);
      } else if (res.data.current_page) {//zbog drugacijeg formata kad se ne vraca preko resursa i tad nema meta
        // Dashboard fallback
        setCurrentPage(res.data.current_page);
        setLastPage(res.data.last_page);
      }
    } catch (err) {
      console.error("Pagination fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    currentPage,
    lastPage,
    loading,
    fetchData,
  };
}
