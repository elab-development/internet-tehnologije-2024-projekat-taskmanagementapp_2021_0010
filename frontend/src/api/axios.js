import axios from 'axios';

const api = axios.create({
  //znači da će svi zahtevi koje šalješ preko api objekta automatski koristiti ovu baznu adresu.
  baseURL: 'http://127.0.0.1:8000/api/v1',
});
//Interceptor je funkcija koja se izvršava pre svakog zahteva koji šalješ preko Axios-a.
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); 
  if (token) {
    //Ako postoji token, automatski se dodaje u header kako se ne bi morao dodavati rucno kod svakog zahteva
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;


