#  FitProgress

**Aplicación móvil para la creación de rutinas de entrenamiento y seguimiento de la evolución física del usuario.**

Trabajo Final de Ciclo — Desarrollo de Aplicaciones Multiplataforma (DAM)

---

##  Descripción

FitProgress es una aplicación móvil multiplataforma pensada para personas que entrenan en el gimnasio de forma autónoma. Permite crear rutinas de entrenamiento personalizadas, registrar sesiones con peso y repeticiones por serie, y visualizar la evolución física a lo largo del tiempo.

##  Funcionalidades

- **Registro e inicio de sesión** con autenticación JWT
- **Perfil de usuario** editable con foto y objetivo de entrenamiento
- **Catálogo de 47 ejercicios** predefinidos organizados por grupo muscular
- **Vídeos demostrativos** de YouTube integrados en cada ejercicio
- **Crear ejercicios personalizados** para añadir a tus rutinas
- **Ejercicios favoritos** con filtro dedicado para acceso rápido
- **Crear rutinas** organizadas por días de la semana con series, repeticiones y descanso
- **Gestión de rutinas**: editar, duplicar, archivar, eliminar y marcar como activa
- **Sesión de entrenamiento en vivo** con registro de peso y repeticiones por serie
- **Temporizador de descanso** configurable entre series con alerta por vibración
- **Historial completo** de entrenamientos con detalle de cada sesión
- **Registro de medidas corporales**: peso, grasa, pecho, cintura, brazo y pierna
- **Gráficos de evolución** de peso corporal y volumen de entrenamiento
- **Pantalla de inicio** con resumen y acceso rápido al entrenamiento
- **Logo personalizado** y pantalla de bienvenida animada

##  Tecnologías

### Frontend
- React Native con Expo
- TypeScript
- React Navigation (tabs + stack)
- Ionicons
- AsyncStorage
- expo-image-picker
- expo-linking

### Backend
- Node.js con Express
- TypeScript
- Prisma ORM
- JWT + bcrypt
- express-validator

### Base de datos
- PostgreSQL


##  Modelo de datos

La base de datos cuenta con 8 tablas principales:

- **usuarios** — Datos del usuario y autenticación
- **ejercicios** — Catálogo de ejercicios (predefinidos y personalizados)
- **ejercicios_favoritos** — Lista de ejercicios marcados como favoritos
- **rutinas** — Rutinas de entrenamiento del usuario
- **rutina_ejercicios** — Ejercicios dentro de cada rutina por día
- **sesiones_entrenamiento** — Registro de sesiones de entrenamiento
- **series_log** — Detalle de cada serie (peso, repeticiones, fallo)
- **medidas_corporales** — Seguimiento de medidas físicas

##  Instalación

### Requisitos previos
- Node.js v18+
- PostgreSQL
- Expo Go (en el móvil)

### Backend

```bash
cd server
npm install
# Configurar .env con la URL de PostgreSQL
npx prisma migrate dev --name init
npx prisma generate
node seed.js
npm run dev
```

### Frontend

```bash
cd app
npm install
npx expo start
```

Escanear el código QR con Expo Go para ver la app en el móvil.

##  Autor

**Julio Valcárcel Vigier**

Ciclo Formativo: Desarrollo de Aplicaciones Multiplataforma (DAM)

Curso Académico: 2025 – 2026
