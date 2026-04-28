-- CreateTable
CREATE TABLE "ejercicios_favoritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "ejercicio_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ejercicios_favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ejercicios_favoritos_usuario_id_ejercicio_id_key" ON "ejercicios_favoritos"("usuario_id", "ejercicio_id");

-- AddForeignKey
ALTER TABLE "ejercicios_favoritos" ADD CONSTRAINT "ejercicios_favoritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejercicios_favoritos" ADD CONSTRAINT "ejercicios_favoritos_ejercicio_id_fkey" FOREIGN KEY ("ejercicio_id") REFERENCES "ejercicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
