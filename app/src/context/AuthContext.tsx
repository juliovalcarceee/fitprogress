import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario, RespuestaAuth } from '../types/types';
import * as api from '../services/api';

interface AuthContextProps {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  login: (email: string, password: string) => Promise<void>;
  registro: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  actualizarUsuario: (datos: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarSesion();
  }, []);

  const cargarSesion = async () => {
    try {
      const tokenGuardado = await AsyncStorage.getItem('token');
      if (tokenGuardado) {
        setToken(tokenGuardado);
        const respuesta = await api.obtenerPerfil();
        setUsuario(respuesta.data);
      }
    } catch (error) {
      await AsyncStorage.removeItem('token');
    } finally {
      setCargando(false);
    }
  };

  const login = async (email: string, password: string) => {
    const respuesta = await api.iniciarSesion(email, password);
    const datos: RespuestaAuth = respuesta.data;
    await AsyncStorage.setItem('token', datos.token);
    setToken(datos.token);
    setUsuario(datos.usuario);
  };

  const registro = async (nombre: string, email: string, password: string) => {
    const respuesta = await api.registrarse(nombre, email, password);
    const datos: RespuestaAuth = respuesta.data;
    await AsyncStorage.setItem('token', datos.token);
    setToken(datos.token);
    setUsuario(datos.usuario);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  const actualizarUsuario = async (datos: any) => {
    const respuesta = await api.actualizarPerfil(datos);
    setUsuario(respuesta.data.usuario);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, cargando, login, registro, logout, actualizarUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);