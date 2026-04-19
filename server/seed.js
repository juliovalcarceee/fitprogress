require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ejercicios = [
  { nombre: 'Press banca con barra', descripcion: 'Acostado en banco plano, bajar la barra al pecho y empujar hacia arriba.', grupoMuscular: 'pecho' },
  { nombre: 'Press banca inclinado', descripcion: 'Igual que press banca pero en banco inclinado a 30-45 grados.', grupoMuscular: 'pecho' },
  { nombre: 'Press banca con mancuernas', descripcion: 'Acostado en banco plano, empujar mancuernas hacia arriba.', grupoMuscular: 'pecho' },
  { nombre: 'Aperturas con mancuernas', descripcion: 'Acostado en banco, abrir brazos con mancuernas y juntar arriba.', grupoMuscular: 'pecho' },
  { nombre: 'Fondos en paralelas', descripcion: 'Bajar el cuerpo entre barras paralelas flexionando los codos.', grupoMuscular: 'pecho' },
  { nombre: 'Cruces en polea', descripcion: 'De pie entre poleas, cruzar las manos frente al pecho.', grupoMuscular: 'pecho' },
  { nombre: 'Dominadas', descripcion: 'Colgado de barra, subir el cuerpo hasta que la barbilla supere la barra.', grupoMuscular: 'espalda' },
  { nombre: 'Remo con barra', descripcion: 'Inclinado hacia delante, tirar de la barra hacia el abdomen.', grupoMuscular: 'espalda' },
  { nombre: 'Remo con mancuerna', descripcion: 'Apoyado en banco con una mano, tirar mancuerna hacia la cadera.', grupoMuscular: 'espalda' },
  { nombre: 'Jalon al pecho', descripcion: 'Sentado en maquina de polea alta, tirar la barra hacia el pecho.', grupoMuscular: 'espalda' },
  { nombre: 'Remo en polea baja', descripcion: 'Sentado, tirar del agarre de la polea baja hacia el abdomen.', grupoMuscular: 'espalda' },
  { nombre: 'Peso muerto', descripcion: 'Levantar barra del suelo hasta ponerse de pie, manteniendo espalda recta.', grupoMuscular: 'espalda' },
  { nombre: 'Press militar con barra', descripcion: 'De pie o sentado, empujar la barra desde los hombros hacia arriba.', grupoMuscular: 'hombros' },
  { nombre: 'Press militar con mancuernas', descripcion: 'Sentado, empujar mancuernas desde los hombros hacia arriba.', grupoMuscular: 'hombros' },
  { nombre: 'Elevaciones laterales', descripcion: 'De pie, subir mancuernas hacia los lados hasta la altura de los hombros.', grupoMuscular: 'hombros' },
  { nombre: 'Elevaciones frontales', descripcion: 'De pie, subir mancuernas por delante hasta la altura de los hombros.', grupoMuscular: 'hombros' },
  { nombre: 'Pajaros con mancuernas', descripcion: 'Inclinado hacia delante, abrir brazos con mancuernas hacia los lados.', grupoMuscular: 'hombros' },
  { nombre: 'Face pull en polea', descripcion: 'Tirar de la cuerda de polea alta hacia la cara, abriendo los codos.', grupoMuscular: 'hombros' },
  { nombre: 'Curl con barra', descripcion: 'De pie, flexionar los brazos subiendo la barra.', grupoMuscular: 'brazos' },
  { nombre: 'Curl con mancuernas', descripcion: 'De pie o sentado, flexionar los brazos alternando mancuernas.', grupoMuscular: 'brazos' },
  { nombre: 'Curl martillo', descripcion: 'De pie, curl con mancuernas en posicion neutra.', grupoMuscular: 'brazos' },
  { nombre: 'Curl en banco predicador', descripcion: 'Apoyado en banco predicador, flexionar brazos con barra o mancuerna.', grupoMuscular: 'brazos' },
  { nombre: 'Press frances', descripcion: 'Acostado, bajar barra hacia la frente y extender los brazos.', grupoMuscular: 'brazos' },
  { nombre: 'Extensiones de triceps en polea', descripcion: 'De pie frente a polea alta, empujar hacia abajo extendiendo los brazos.', grupoMuscular: 'brazos' },
  { nombre: 'Fondos en banco', descripcion: 'Apoyado en banco, bajar el cuerpo flexionando los codos.', grupoMuscular: 'brazos' },
  { nombre: 'Patada de triceps', descripcion: 'Inclinado, extender el brazo hacia atras con mancuerna.', grupoMuscular: 'brazos' },
  { nombre: 'Sentadilla con barra', descripcion: 'Barra en la espalda, flexionar rodillas hasta que los muslos esten paralelos al suelo.', grupoMuscular: 'piernas' },
  { nombre: 'Prensa de piernas', descripcion: 'En maquina, empujar la plataforma con los pies.', grupoMuscular: 'piernas' },
  { nombre: 'Extensiones de cuadriceps', descripcion: 'Sentado en maquina, extender las piernas.', grupoMuscular: 'piernas' },
  { nombre: 'Curl femoral', descripcion: 'Tumbado en maquina, flexionar las piernas hacia los gluteos.', grupoMuscular: 'piernas' },
  { nombre: 'Zancadas con mancuernas', descripcion: 'Dar un paso adelante y flexionar ambas rodillas.', grupoMuscular: 'piernas' },
  { nombre: 'Peso muerto rumano', descripcion: 'Con barra, bajar el tronco manteniendo piernas casi rectas.', grupoMuscular: 'piernas' },
  { nombre: 'Elevacion de gemelos', descripcion: 'De pie, subir sobre las puntas de los pies.', grupoMuscular: 'piernas' },
  { nombre: 'Hip thrust', descripcion: 'Apoyado en banco, empujar cadera hacia arriba con barra.', grupoMuscular: 'piernas' },
  { nombre: 'Sentadilla bulgara', descripcion: 'Un pie apoyado en banco detras, flexionar la pierna delantera.', grupoMuscular: 'piernas' },
  { nombre: 'Plancha abdominal', descripcion: 'Mantener el cuerpo recto apoyado en antebrazos y puntas de los pies.', grupoMuscular: 'core' },
  { nombre: 'Crunch abdominal', descripcion: 'Tumbado boca arriba, elevar el tronco contrayendo el abdomen.', grupoMuscular: 'core' },
  { nombre: 'Elevacion de piernas colgado', descripcion: 'Colgado de barra, subir las piernas rectas o flexionadas.', grupoMuscular: 'core' },
  { nombre: 'Russian twist', descripcion: 'Sentado con tronco inclinado, girar el torso de lado a lado.', grupoMuscular: 'core' },
  { nombre: 'Ab wheel', descripcion: 'De rodillas, rodar la rueda abdominal hacia delante y volver.', grupoMuscular: 'core' },
  { nombre: 'Plancha lateral', descripcion: 'Apoyado en un antebrazo de lado, mantener el cuerpo recto.', grupoMuscular: 'core' },
  { nombre: 'Cinta de correr', descripcion: 'Correr o caminar en cinta a ritmo constante o por intervalos.', grupoMuscular: 'cardio' },
  { nombre: 'Bicicleta estatica', descripcion: 'Pedalear en bicicleta estatica a ritmo moderado o intenso.', grupoMuscular: 'cardio' },
  { nombre: 'Eliptica', descripcion: 'Movimiento combinado de brazos y piernas en maquina eliptica.', grupoMuscular: 'cardio' },
  { nombre: 'Remo en maquina', descripcion: 'Tirar y empujar en maquina de remo simulando el movimiento de remar.', grupoMuscular: 'cardio' },
  { nombre: 'Saltar a la comba', descripcion: 'Saltar la cuerda a ritmo constante o con variaciones.', grupoMuscular: 'cardio' },
  { nombre: 'Burpees', descripcion: 'Sentadilla, plancha, flexion y salto en un solo movimiento.', grupoMuscular: 'cardio' },
];

async function main() {
  console.log('Insertando ejercicios...');
  for (const ej of ejercicios) {
    await prisma.ejercicio.create({
      data: { nombre: ej.nombre, descripcion: ej.descripcion, grupoMuscular: ej.grupoMuscular, esPredefinido: true }
    });
  }
  console.log(ejercicios.length + ' ejercicios insertados correctamente');
}

main()
  .catch(e => { console.error('Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());