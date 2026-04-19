-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('masculino', 'femenino', 'otro');

-- CreateEnum
CREATE TYPE "Objetivo" AS ENUM ('ganancia', 'perdida', 'mantenimiento');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "foto_url" VARCHAR(500),
    "edad" INTEGER,
    "sexo" "Sexo",
    "altura_cm" DECIMAL(5,1),
    "objetivo" "Objetivo",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ejercicios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "grupo_muscular" VARCHAR(50) NOT NULL,
    "imagen_url" VARCHAR(500),
    "es_predefinido" BOOLEAN NOT NULL DEFAULT true,
    "creado_por" INTEGER,

    CONSTRAINT "ejercicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rutinas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "es_activa" BOOLEAN NOT NULL DEFAULT false,
    "archivada" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rutinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rutina_ejercicios" (
    "id" SERIAL NOT NULL,
    "rutina_id" INTEGER NOT NULL,
    "ejercicio_id" INTEGER NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,
    "series_objetivo" INTEGER NOT NULL,
    "repeticiones_obj" VARCHAR(50) NOT NULL,
    "descanso_seg" INTEGER NOT NULL,
    "notas" TEXT,

    CONSTRAINT "rutina_ejercicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones_entrenamiento" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "rutina_id" INTEGER,
    "fecha" DATE NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "duracion_min" INTEGER,
    "notas" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_entrenamiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series_log" (
    "id" SERIAL NOT NULL,
    "sesion_id" INTEGER NOT NULL,
    "ejercicio_id" INTEGER NOT NULL,
    "num_serie" INTEGER NOT NULL,
    "peso_kg" DECIMAL(6,2) NOT NULL,
    "repeticiones" INTEGER NOT NULL,
    "al_fallo" BOOLEAN NOT NULL DEFAULT false,
    "notas" TEXT,

    CONSTRAINT "series_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medidas_corporales" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha" DATE NOT NULL,
    "peso_kg" DECIMAL(5,2),
    "grasa_pct" DECIMAL(4,1),
    "medida_pecho_cm" DECIMAL(5,1),
    "medida_cintura_cm" DECIMAL(5,1),
    "medida_brazo_cm" DECIMAL(5,1),
    "medida_pierna_cm" DECIMAL(5,1),
    "notas" TEXT,

    CONSTRAINT "medidas_corporales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- AddForeignKey
ALTER TABLE "ejercicios" ADD CONSTRAINT "ejercicios_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutinas" ADD CONSTRAINT "rutinas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_rutina_id_fkey" FOREIGN KEY ("rutina_id") REFERENCES "rutinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutina_ejercicios" ADD CONSTRAINT "rutina_ejercicios_ejercicio_id_fkey" FOREIGN KEY ("ejercicio_id") REFERENCES "ejercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_entrenamiento" ADD CONSTRAINT "sesiones_entrenamiento_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones_entrenamiento" ADD CONSTRAINT "sesiones_entrenamiento_rutina_id_fkey" FOREIGN KEY ("rutina_id") REFERENCES "rutinas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series_log" ADD CONSTRAINT "series_log_sesion_id_fkey" FOREIGN KEY ("sesion_id") REFERENCES "sesiones_entrenamiento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series_log" ADD CONSTRAINT "series_log_ejercicio_id_fkey" FOREIGN KEY ("ejercicio_id") REFERENCES "ejercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medidas_corporales" ADD CONSTRAINT "medidas_corporales_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
