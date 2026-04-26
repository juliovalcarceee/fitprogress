require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ejercicios = [
  { nombre: 'Press banca con barra', descripcion: 'Acostado en banco plano, bajar la barra al pecho y empujar hacia arriba.', grupoMuscular: 'pecho', videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
  { nombre: 'Press banca inclinado', descripcion: 'Igual que press banca pero en banco inclinado a 30-45 grados.', grupoMuscular: 'pecho', videoUrl: 'https://www.youtube.com/watch?v=SrqOu55lrYU' },
  { nombre: 'Press banca con mancuernas', descripcion: 'Acostado en banco plano, empujar mancuernas hacia arriba.', grupoMuscular: 'pecho', videoUrl: 'https://www.youtube.com/watch?v=VmB1G1K7v94' },
  { nombre: 'Aperturas con mancuernas', descripcion: 'Acostado en banco, abrir brazos con mancuernas y juntar arriba.', grupoMuscular: 'pecho', videoUrl: 'https://www.youtube.com/watch?v=eozdVDA78K0' },
  { nombre: 'Fondos en paralelas', descripcion: 'Bajar el cuerpo entre barras paralelas flexionando los codos.', grupoMuscular: 'pecho', videoUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As' },
  { nombre: 'Cruces en polea', descripcion: 'De pie entre poleas, cruzar las manos frente al pecho.', grupoMuscular: 'pecho', videoUrl: 'https://www.youtube.com/watch?v=taI4XduLpTk' },
  { nombre: 'Dominadas', descripcion: 'Colgado de barra, subir el cuerpo hasta que la barbilla supere la barra.', grupoMuscular: 'espalda', videoUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
  { nombre: 'Remo con barra', descripcion: 'Inclinado hacia delante, tirar de la barra hacia el abdomen.', grupoMuscular: 'espalda', videoUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8bnQ' },
  { nombre: 'Remo con mancuerna', descripcion: 'Apoyado en banco con una mano, tirar mancuerna hacia la cadera.', grupoMuscular: 'espalda', videoUrl: 'https://www.youtube.com/watch?v=pYcpY20QaE8' },
  { nombre: 'Jalon al pecho', descripcion: 'Sentado en maquina de polea alta, tirar la barra hacia el pecho.', grupoMuscular: 'espalda', videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc' },
  { nombre: 'Remo en polea baja', descripcion: 'Sentado, tirar del agarre de la polea baja hacia el abdomen.', grupoMuscular: 'espalda', videoUrl: 'https://www.youtube.com/watch?v=GZbfZ033f74' },
  { nombre: 'Peso muerto', descripcion: 'Levantar barra del suelo hasta ponerse de pie, manteniendo espalda recta.', grupoMuscular: 'espalda', videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q' },
  { nombre: 'Press militar con barra', descripcion: 'De pie o sentado, empujar la barra desde los hombros hacia arriba.', grupoMuscular: 'hombros', videoUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI' },
  { nombre: 'Press militar con mancuernas', descripcion: 'Sentado, empujar mancuernas desde los hombros hacia arriba.', grupoMuscular: 'hombros', videoUrl: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
  { nombre: 'Elevaciones laterales', descripcion: 'De pie, subir mancuernas hacia los lados hasta la altura de los hombros.', grupoMuscular: 'hombros', videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo' },
  { nombre: 'Elevaciones frontales', descripcion: 'De pie, subir mancuernas por delante hasta la altura de los hombros.', grupoMuscular: 'hombros', videoUrl: 'https://www.youtube.com/watch?v=-t7fuZ0KhDA' },
  { nombre: 'Pajaros con mancuernas', descripcion: 'Inclinado hacia delante, abrir brazos con mancuernas hacia los lados.', grupoMuscular: 'hombros', videoUrl: 'https://www.youtube.com/watch?v=ttvfGg9d76c' },
  { nombre: 'Face pull en polea', descripcion: 'Tirar de la cuerda de polea alta hacia la cara, abriendo los codos.', grupoMuscular: 'hombros', videoUrl: 'https://www.youtube.com/watch?v=rep-qVOkqgk' },
  { nombre: 'Curl con barra', descripcion: 'De pie, flexionar los brazos subiendo la barra.', grupoMuscular: 'brazos', videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
  { nombre: 'Curl con mancuernas', descripcion: 'De pie o sentado, flexionar los brazos alternando mancuernas.', grupoMuscular: 'brazos', videoUrl: 'https://www.youtube.com/watch?v=sAq_ocpRh_I' },
  { nombre: 'Curl martillo', descripcion: 'De pie, curl con mancuernas en posicion neutra.', grupoMuscular: 'brazos', videoUrl: 'https://www.youtube.com/watch?v=zC3nLlEvin4' },
  { nombre: 'Curl en banco predicador', descripcion: 'Apoyado en banco predicador, flexionar brazos con barra o mancuerna.', grupoMuscular: 'brazos', videoUrl: 'https://www.youtube.com/watch?v=fIWP-FRFNU0' },
  { nombre: 'Press frances', descripcion: 'Acostado, bajar barra hacia la frente y extender los brazos.', grupoMuscular: 'brazos', videoUrl: 'https://www.youtube.com/watch?v=d_KZxkY_0cM' },
  { nombre: 'Extensiones de triceps en polea', descripcion: 'De pie frente a polea alta, empujar hacia abajo extendiendo los brazos.', grupoMuscular: 'brazos', videoUrl: 'https://www.youtube.com/watch?v=2-LAMcpzODU' },
  { nombre: 'Fondos en banco', descripcion: 'Apoyado en banco, bajar el cuerpo flexionando los codos.', grupoMuscular: 'brazos', videoUrl: 'https://www.youtube.com/watch?v=6kALZikXxLc' },
  { nombre: 'Patada de triceps', descripcion: 'Inclinado, extender el brazo hacia atras con mancuerna.', grupoMuscular: 'brazos', videoUrl: 'https://www.youtube.com/watch?v=6SS6K3lAwZ8' },
  { nombre: 'Sentadilla con barra', descripcion: 'Barra en la espalda, flexionar rodillas hasta que los muslos esten paralelos al suelo.', grupoMuscular: 'piernas', videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8' },
  { nombre: 'Prensa de piernas', descripcion: 'En maquina, empujar la plataforma con los pies.', grupoMuscular: 'piernas', videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ' },
  { nombre: 'Extensiones de cuadriceps', descripcion: 'Sentado en maquina, extender las piernas.', grupoMuscular: 'piernas', videoUrl: 'https://www.youtube.com/watch?v=YyvSfVjQeL0' },
  { nombre: 'Curl femoral', descripcion: 'Tumbado en maquina, flexionar las piernas hacia los gluteos.', grupoMuscular: 'piernas', videoUrl: 'https://www.youtube.com/watch?v=1Tq3QdYUuHs' },
  { nombre: 'Zancadas con mancuernas', descripcion: 'Dar un paso adelante y flexionar ambas rodillas.', grupoMuscular: 'piernas', videoUrl: 'https://www.youtube.com/watch?v=D7KaRcUTQeE' },
  { nombre: 'Peso muerto rumano', descripcion: 'Con barra, bajar el tronco manteniendo piernas casi rectas.', grupoMuscular: 'piernas', videoUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM' },
  { nombre: 'Elevacion de gemelos', descripcion: 'De pie, subir sobre las puntas de los pies.', grupoMuscular: 'piernas', videoUrl: 'https://www.youtube.com/watch?v=gwLzBJYoWlI' },
  { nombre: 'Hip thrust', descripcion: 'Apoyado en banco, empujar cadera hacia arriba con barra.', grupoMuscular: 'piernas', videoUrl: 'https://www.youtube.com/watch?v=SEdqd1n0icg' },
  { nombre: 'Sentadilla bulgara', descripcion: 'Un pie apoyado en banco detras, flexionar la pierna delantera.', grupoMuscular: 'piernas', videoUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE' },
  { nombre: 'Plancha abdominal', descripcion: 'Mantener el cuerpo recto apoyado en antebrazos y puntas de los pies.', grupoMuscular: 'core', videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
  { nombre: 'Crunch abdominal', descripcion: 'Tumbado boca arriba, elevar el tronco contrayendo el abdomen.', grupoMuscular: 'core', videoUrl: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU' },
  { nombre: 'Elevacion de piernas colgado', descripcion: 'Colgado de barra, subir las piernas rectas o flexionadas.', grupoMuscular: 'core', videoUrl: 'https://www.youtube.com/watch?v=hdng3Nm1x_E' },
  { nombre: 'Russian twist', descripcion: 'Sentado con tronco inclinado, girar el torso de lado a lado.', grupoMuscular: 'core', videoUrl: 'https://www.youtube.com/watch?v=wkD8rjkodUI' },
  { nombre: 'Ab wheel', descripcion: 'De rodillas, rodar la rueda abdominal hacia delante y volver.', grupoMuscular: 'core', videoUrl: 'https://www.youtube.com/watch?v=rqiTPmK8O2k' },
  { nombre: 'Plancha lateral', descripcion: 'Apoyado en un antebrazo de lado, mantener el cuerpo recto.', grupoMuscular: 'core', videoUrl: 'https://www.youtube.com/watch?v=K2VljzCC16g' },
  { nombre: 'Cinta de correr', descripcion: 'Correr o caminar en cinta a ritmo constante o por intervalos.', grupoMuscular: 'cardio', videoUrl: null },
  { nombre: 'Bicicleta estatica', descripcion: 'Pedalear en bicicleta estatica a ritmo moderado o intenso.', grupoMuscular: 'cardio', videoUrl: null },
  { nombre: 'Eliptica', descripcion: 'Movimiento combinado de brazos y piernas en maquina eliptica.', grupoMuscular: 'cardio', videoUrl: null },
  { nombre: 'Remo en maquina', descripcion: 'Tirar y empujar en maquina de remo simulando el movimiento de remar.', grupoMuscular: 'cardio', videoUrl: null },
  { nombre: 'Saltar a la comba', descripcion: 'Saltar la cuerda a ritmo constante o con variaciones.', grupoMuscular: 'cardio', videoUrl: 'https://www.youtube.com/watch?v=FJmRQ5iTXKE' },
  { nombre: 'Burpees', descripcion: 'Sentadilla, plancha, flexion y salto en un solo movimiento.', grupoMuscular: 'cardio', videoUrl: 'https://www.youtube.com/watch?v=dZgVxmf6jkA' },
];

async function main() {
  console.log('Eliminando datos dependientes...');
  await prisma.serieLog.deleteMany({});
  await prisma.sesionEntrenamiento.deleteMany({});
  await prisma.rutinaEjercicio.deleteMany({});
  await prisma.rutina.deleteMany({});
  await prisma.ejercicio.deleteMany({ where: { esPredefinido: true } });

  console.log('Insertando ejercicios con videos...');
  for (const ej of ejercicios) {
    await prisma.ejercicio.create({
      data: { nombre: ej.nombre, descripcion: ej.descripcion, grupoMuscular: ej.grupoMuscular, imagenUrl: ej.videoUrl, esPredefinido: true }
    });
  }
  console.log(ejercicios.length + ' ejercicios insertados con videos');
}

main()
  .catch(e => { console.error('Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());