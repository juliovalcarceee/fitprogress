import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ejerciciosPredefinidos = [
  // Pecho
  { nombre: 'Press banca con barra', descripcion: 'Acostado en banco plano, bajar la barra al pecho y empujar hacia arriba.', grupoMuscular: 'pecho', imagenUrl: null },
  { nombre: 'Press banca inclinado', descripcion: 'Igual que press banca pero en banco inclinado a 30-45 grados.', grupoMuscular: 'pecho', imagenUrl: null },
  { nombre: 'Press banca con mancuernas', descripcion: 'Acostado en banco plano, empujar mancuernas hacia arriba.', grupoMuscular: 'pecho', imagenUrl: null },
  { nombre: 'Aperturas con mancuernas', descripcion: 'Acostado en banco, abrir brazos con mancuernas y juntar arriba.', grupoMuscular: 'pecho', imagenUrl: null },
  { nombre: 'Fondos en paralelas', descripcion: 'Bajar el cuerpo entre barras paralelas flexionando los codos.', grupoMuscular: 'pecho', imagenUrl: null },
  { nombre: 'Cruces en polea', descripcion: 'De pie entre poleas, cruzar las manos frente al pecho.', grupoMuscular: 'pecho', imagenUrl: null },

  // Espalda
  { nombre: 'Dominadas', descripcion: 'Colgado de barra, subir el cuerpo hasta que la barbilla supere la barra.', grupoMuscular: 'espalda', imagenUrl: null },
  { nombre: 'Remo con barra', descripcion: 'Inclinado hacia delante, tirar de la barra hacia el abdomen.', grupoMuscular: 'espalda', imagenUrl: null },
  { nombre: 'Remo con mancuerna', descripcion: 'Apoyado en banco con una mano, tirar mancuerna hacia la cadera.', grupoMuscular: 'espalda', imagenUrl: null },
  { nombre: 'Jalón al pecho', descripcion: 'Sentado en máquina de polea alta, tirar la barra hacia el pecho.', grupoMuscular: 'espalda', imagenUrl: null },
  { nombre: 'Remo en polea baja', descripcion: 'Sentado, tirar del agarre de la polea baja hacia el abdomen.', grupoMuscular: 'espalda', imagenUrl: null },
  { nombre: 'Peso muerto', descripcion: 'Levantar barra del suelo hasta ponerse de pie, manteniendo espalda recta.', grupoMuscular: 'espalda', imagenUrl: null },

  // Hombros
  { nombre: 'Press militar con barra', descripcion: 'De pie o sentado, empujar la barra desde los hombros hacia arriba.', grupoMuscular: 'hombros', imagenUrl: null },
  { nombre: 'Press militar con mancuernas', descripcion: 'Sentado, empujar mancuernas desde los hombros hacia arriba.', grupoMuscular: 'hombros', imagenUrl: null },
  { nombre: 'Elevaciones laterales', descripcion: 'De pie, subir mancuernas hacia los lados hasta la altura de los hombros.', grupoMuscular: 'hombros', imagenUrl: null },
  { nombre: 'Elevaciones frontales', descripcion: 'De pie, subir mancuernas por delante hasta la altura de los hombros.', grupoMuscular: 'hombros', imagenUrl: null },
  { nombre: 'Pájaros con mancuernas', descripcion: 'Inclinado hacia delante, abrir brazos con mancuernas hacia los lados.', grupoMuscular: 'hombros', imagenUrl: null },
  { nombre: 'Face pull en polea', descripcion: 'Tirar de la cuerda de polea alta hacia la cara, abriendo los codos.', grupoMuscular: 'hombros', imagenUrl: null },

  // Brazos - Bíceps
  { nombre: 'Curl con barra', descripcion: 'De pie, flexionar los brazos subiendo la barra.', grupoMuscular: 'brazos', imagenUrl: null },
  { nombre: 'Curl con mancuernas', descripcion: 'De pie o sentado, flexionar los brazos alternando mancuernas.', grupoMuscular: 'brazos', imagenUrl: null },
  { nombre: 'Curl martillo', descripcion: 'De pie, curl con mancuernas en posición neutra (pulgares arriba).', grupoMuscular: 'brazos', imagenUrl: null },
  { nombre: 'Curl en banco predicador', descripcion: 'Apoyado en banco predicador, flexionar brazos con barra o mancuerna.', grupoMuscular: 'brazos', imagenUrl: null },

  // Brazos - Tríceps
  { nombre: 'Press francés', descripcion: 'Acostado, bajar barra hacia la frente y extender los brazos.', grupoMuscular: 'brazos', imagenUrl: null },
  { nombre: 'Extensiones de tríceps en polea', descripcion: 'De pie frente a polea alta, empujar hacia abajo extendiendo los brazos.', grupoMuscular: 'brazos', imagenUrl: null },
  { nombre: 'Fondos en banco', descripcion: 'Apoyado en banco, bajar el cuerpo flexionando los codos.', grupoMuscular: 'brazos', imagenUrl: null },
  { nombre: 'Patada de tríceps', descripcion: 'Inclinado, extender el brazo hacia atrás con mancuerna.', grupoMuscular: 'brazos', imagenUrl: null },

  // Piernas
  { nombre: 'Sentadilla con barra', descripcion: 'Barra en la espalda, flexionar rodillas hasta que los muslos estén paralelos al suelo.', grupoMuscular: 'piernas', imagenUrl: null },
  { nombre: 'Prensa de piernas', descripcion: 'En máquina, empujar la plataforma con los pies.', grupoMuscular: 'piernas', imagenUrl: null },
  { nombre: 'Extensiones de cuádriceps', descripcion: 'Sentado en máquina, extender las piernas.', grupoMuscular: 'piernas', imagenUrl: null },
  { nombre: 'Curl femoral', descripcion: 'Tumbado en máquina, flexionar las piernas hacia los glúteos.', grupoMuscular: 'piernas', imagenUrl: null },
  { nombre: 'Zancadas con mancuernas', descripcion: 'Dar un paso adelante y flexionar ambas rodillas.', grupoMuscular: 'piernas', imagenUrl: null },
  { nombre: 'Peso muerto rumano', descripcion: 'Con barra, bajar el tronco manteniendo piernas casi rectas.', grupoMuscular: 'piernas', imagenUrl: null },
  { nombre: 'Elevación de gemelos', descripcion: 'De pie, subir sobre las puntas de los pies.', grupoMuscular: 'piernas', imagenUrl: null },
  { nombre: 'Hip thrust', descripcion: 'Apoyado en banco, empujar cadera hacia arriba con barra.', grupoMuscular: 'piernas', imagenUrl: null },
  { nombre: 'Sentadilla búlgara', descripcion: 'Un pie apoyado en banco detrás, flexionar la pierna delantera.', grupoMuscular: 'piernas', imagenUrl: null },

  // Core
  { nombre: 'Plancha abdominal', descripcion: 'Mantener el cuerpo recto apoyado en antebrazos y puntas de los pies.', grupoMuscular: 'core', imagenUrl: null },
  { nombre: 'Crunch abdominal', descripcion: 'Tumbado boca arriba, elevar el tronco contrayendo el abdomen.', grupoMuscular: 'core', imagenUrl: null },
  { nombre: 'Elevación de piernas colgado', descripcion: 'Colgado de barra, subir las piernas rectas o flexionadas.', grupoMuscular: 'core', imagenUrl: null },
  { nombre: 'Russian twist', descripcion: 'Sentado con tronco inclinado, girar el torso de lado a lado.', grupoMuscular: 'core', imagenUrl: null },
  { nombre: 'Ab wheel', descripcion: 'De rodillas, rodar la rueda abdominal hacia delante y volver.', grupoMuscular: 'core', imagenUrl: null },
  { nombre: 'Plancha lateral', descripcion: 'Apoyado en un antebrazo de lado, mantener el cuerpo recto.', grupoMuscular: 'core', imagenUrl: null },

  // Cardio
  { nombre: 'Cinta de correr', descripcion: 'Correr o caminar en cinta a ritmo constante o por intervalos.', grupoMuscular: 'cardio', imagenUrl: null },
  { nombre: 'Bicicleta estática', descripcion: 'Pedalear en bicicleta estática a ritmo moderado o intenso.', grupoMuscular: 'cardio', imagenUrl: null },
  { nombre: 'Elíptica', descripcion: 'Movimiento combinado de brazos y piernas en máquina elíptica.', grupoMuscular: 'cardio', imagenUrl: null },
  { nombre: 'Remo en máquina', descripcion: 'Tirar y empujar en máquina de remo simulando el movimiento de remar.', grupoMuscular: 'cardio', imagenUrl: null },
  { nombre: 'Saltar a la comba', descripcion: 'Saltar la cuerda a ritmo constante o con variaciones.', grupoMuscular: 'cardio', imagenUrl: null },
  { nombre: 'Burpees', descripcion: 'Sentadilla, plancha, flexión y salto en un solo movimiento.', grupoMuscular: 'cardio', imagenUrl: null },
];

async function main() {
  console.log('Insertando ejercicios predefinidos...');

  for (const ejercicio of ejerciciosPredefinidos) {
    await prisma.ejercicio.upsert({
      where: { id: 0 },
      update: {},
      create: {
        nombre: ejercicio.nombre,
        descripcion: ejercicio.descripcion,
        grupoMuscular: ejercicio.grupoMuscular,
        imagenUrl: ejercicio.imagenUrl,
        esPredefinido: true
      }
    });
  }

  console.log(`${ejerciciosPredefinidos.length} ejercicios insertados correctamente.`);
}

main()
  .catch((e) => {
    console.error('Error al ejecutar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });