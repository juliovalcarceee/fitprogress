import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.78:3000/api';

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const api = {
  get: async (url: string, config?: any) => {
    const headers = await getHeaders();
    let fullUrl = API_URL + url;
    if (config?.params) {
      const params = Object.entries(config.params)
        .filter(([_, v]) => v !== undefined && v !== null && v !== '')
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&');
      if (params) fullUrl += '?' + params;
    }
    const res = await fetch(fullUrl, { headers });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  },
  post: async (url: string, body?: any) => {
    const headers = await getHeaders();
    const res = await fetch(API_URL + url, { method: 'POST', headers, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  },
  put: async (url: string, body?: any) => {
    const headers = await getHeaders();
    const res = await fetch(API_URL + url, { method: 'PUT', headers, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  },
  delete: async (url: string) => {
    const headers = await getHeaders();
    const res = await fetch(API_URL + url, { method: 'DELETE', headers });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  }
};

// Auth
export const registrarse = (nombre: string, email: string, password: string) =>
  api.post('/auth/registro', { nombre, email, password });

export const iniciarSesion = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const obtenerPerfil = () =>
  api.get('/auth/perfil');

export const actualizarPerfil = (datos: any) =>
  api.put('/auth/perfil', datos);

// Ejercicios
export const obtenerEjercicios = (grupoMuscular?: string, busqueda?: string) =>
  api.get('/ejercicios', { params: { grupoMuscular, busqueda } });

export const obtenerGruposMusculares = () =>
  api.get('/ejercicios/grupos');

export const crearEjercicio = (datos: any) =>
  api.post('/ejercicios', datos);

// Rutinas
export const obtenerRutinas = () =>
  api.get('/rutinas');

export const obtenerRutinaPorId = (id: number) =>
  api.get(`/rutinas/${id}`);

export const crearRutina = (datos: any) =>
  api.post('/rutinas', datos);

export const actualizarRutina = (id: number, datos: any) =>
  api.put(`/rutinas/${id}`, datos);

export const eliminarRutina = (id: number) =>
  api.delete(`/rutinas/${id}`);

export const duplicarRutina = (id: number) =>
  api.post(`/rutinas/${id}/duplicar`);

export const marcarRutinaActiva = (id: number) =>
  api.put(`/rutinas/${id}/activar`);

export const archivarRutina = (id: number) =>
  api.put(`/rutinas/${id}/archivar`);

// Sesiones
export const iniciarSesionEntrenamiento = (datos: any) =>
  api.post('/sesiones/iniciar', datos);

export const finalizarSesionEntrenamiento = (id: number, datos: any) =>
  api.put(`/sesiones/${id}/finalizar`, datos);

export const obtenerHistorial = () =>
  api.get('/sesiones/historial');

export const obtenerSesionPorId = (id: number) =>
  api.get(`/sesiones/${id}`);

export const eliminarSesion = (id: number) =>
  api.delete(`/sesiones/${id}`);

export const registrarSerie = (datos: any) =>
  api.post('/sesiones/serie', datos);

export const actualizarSerie = (id: number, datos: any) =>
  api.put(`/sesiones/serie/${id}`, datos);

export const eliminarSerie = (id: number) =>
  api.delete(`/sesiones/serie/${id}`);

// Medidas corporales
export const registrarMedida = (datos: any) =>
  api.post('/medidas', datos);

export const obtenerMedidas = () =>
  api.get('/medidas');

export const actualizarMedida = (id: number, datos: any) =>
  api.put(`/medidas/${id}`, datos);

export const eliminarMedida = (id: number) =>
  api.delete(`/medidas/${id}`);

// Estadísticas
export const obtenerEvolucionPeso = () =>
  api.get('/medidas/estadisticas/peso');

export const obtenerEvolucionMedidas = () =>
  api.get('/medidas/estadisticas/medidas');

export const obtenerCargasMaximas = (ejercicioId: number) =>
  api.get(`/medidas/estadisticas/cargas/${ejercicioId}`);

export const obtenerVolumenPorSesion = () =>
  api.get('/medidas/estadisticas/volumen');

export const obtenerResumen = () =>
  api.get('/medidas/estadisticas/resumen');

// Favoritos
export const obtenerFavoritos = () =>
  api.get('/favoritos');

export const toggleFavorito = (ejercicioId: number) =>
  api.post(`/favoritos/${ejercicioId}`);

export const verificarFavorito = (ejercicioId: number) =>
  api.get(`/favoritos/${ejercicioId}`);

export default api;