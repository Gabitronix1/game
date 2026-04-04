// WWII Choose Your Adventure — Cenizas del Frente
// Karl Müller, Berlín 1939 — Historia expandida

export const EMOTIONS = {
  miedo:         { label: "Miedo",          color: "hsl(260, 50%, 55%)", icon: "😰" },
  ira:           { label: "Ira",            color: "hsl(0,   70%, 55%)", icon: "😤" },
  patriotismo:   { label: "Patriotismo",    color: "hsl(38,  60%, 50%)", icon: "⚔️" },
  incertidumbre: { label: "Incertidumbre",  color: "hsl(200, 30%, 55%)", icon: "😶" },
  perdida:       { label: "Pérdida",        color: "hsl(220, 20%, 45%)", icon: "💔" },
};

export const INITIAL_EMOTIONS = {
  miedo: 20,
  ira: 10,
  patriotismo: 55,
  incertidumbre: 25,
  perdida: 5,
};

// Helper to access scenes by id
export const scenes = {

  // ══════════════════════════════════════════════════════════
  // CAPÍTULO I — EL LLAMADO (Berlín, septiembre 1939)
  // ══════════════════════════════════════════════════════════
  intro: {
    id: "intro",
    chapter: "Capítulo I",
    title: "El Sobre con el Águila",
    year: "1 de septiembre, 1939",
    location: "Berlín — barrio obrero de Wedding",
    atmosphere: "tension",
    narrative: `La radio lleva semanas hablando de destino y de gloria. Esta mañana, sin embargo, el destino ha llegado en forma de sobre.

Estás en la cocina. Huele a café aguado y a madera recién cortada — el olor de la carpintería de tu padre, que lleva impregnado en tu ropa desde los doce años. Tu madre sostiene el sobre con las dos manos, como si pesara más de lo que pesa. El sello del águila imperial mira hacia arriba.

"Convocatoria de incorporación al ejército del Reich."

Tienes veintiún años. Te llamas Karl Müller. Hasta ayer eras carpintero.

Tu hermano Fritz, dieciséis años, entra corriendo desde la habitación con los ojos encendidos. "¿Es la carta? ¿Es la carta, Karl?" Tu padre, sentado en la cabecera de la mesa, no se mueve. Él estuvo en la Gran Guerra. Nunca habla de ella. Pero sus manos, apoyadas sobre la mesa, tiemblan ligeramente.

Tu madre empieza a llorar sin hacer ruido. Solo se le mueven los hombros.

El sobre sigue ahí. Lo tienes que abrir tú.`,
    historicalNote: "El 1 de septiembre de 1939 Alemania invadió Polonia. En las semanas siguientes, más de un millón de jóvenes alemanes recibieron su convocatoria militar. Para muchos fue la última vez que verían a sus familias.",
    emotionShift: { miedo: 10, incertidumbre: 10, patriotismo: 5 },
    choices: [
      {
        id: "accept_proud",
        text: "Abrir el sobre con calma y decir: \"Es mi deber. Alemania me necesita.\"",
        subtext: "Fritz te mira con admiración. Pero tu padre cierra los ojos.",
        emotionShift: { patriotismo: 20, ira: 5, miedo: -5 },
        nextScene: "farewell_proud",
      },
      {
        id: "accept_afraid",
        text: "Abrir el sobre y abrazar a tu madre sin decir nada.",
        subtext: "Las palabras sobran. Ella huele igual que cuando eras pequeño.",
        emotionShift: { perdida: 15, miedo: 15, incertidumbre: 5 },
        nextScene: "farewell_tender",
      },
      {
        id: "ask_father",
        text: "Dejar el sobre sobre la mesa y mirar a tu padre: \"Cuéntame lo que viste tú.\"",
        subtext: "Lleva veinte años callando. Quizá hoy hable.",
        emotionShift: { incertidumbre: 20, miedo: 10, patriotismo: -10 },
        nextScene: "father_talk",
      },
    ],
  },

  // — Rama A: Despedida del soldado orgulloso
  farewell_proud: {
    id: "farewell_proud",
    chapter: "Capítulo I",
    title: "La Última Noche en Casa",
    year: "Septiembre, 1939",
    location: "Berlín",
    atmosphere: "intimate",
    narrative: `Esa noche, Fritz no puede dormir. Entra a tu cuarto y se sienta en el borde de la cama como hacía cuando era pequeño y tenía pesadillas.

"¿Tendrás miedo?" te pregunta.

Mentiras pequeñas o verdades grandes. Ese es el dilema.

Le dices que no, que los soldados alemanes son invencibles. Sonríe, aliviado, y se va. Entonces te quedas solo en la oscuridad y notas que el corazón se te va a salir del pecho.

A las tres de la mañana bajas a la carpintería. Tu padre está ahí, lijando una tabla de roble que no necesita ser lijada. Trabajar cuando no puede dormir — lo has visto toda tu vida.

Te sienta en el banco de trabajo. Saca una pequeña cruz de madera de su bolsillo — tosca, sin pintar, la misma que llevó a la Gran Guerra. "Me la dio mi padre cuando me fui. Volvió conmigo."

La pone en tu mano sin decir nada más. Las palabras que no os decís llenan el taller entero.

A la mañana siguiente, en la estación, tu madre te mete dos cartas en el bolsillo. "Una para que la leas hoy. Otra para que la leas si algún día piensas que no puedes más."`,
    historicalNote: "Millones de familias alemanas vivieron estas despedidas. Muchos padres que habían sobrevivido la Primera Guerra Mundial veían con horror repetirse la historia.",
    emotionShift: { perdida: 10, miedo: 10, patriotismo: 5 },
    choices: [
      {
        id: "read_letter_now",
        text: "Leer la primera carta de tu madre en el tren — ahora mismo.",
        subtext: "\"Karl mío, recuerda que antes de ser soldado eres mi hijo.\"",
        emotionShift: { perdida: 15, incertidumbre: 5 },
        nextScene: "training_barracks",
      },
      {
        id: "save_both_letters",
        text: "Guardar ambas cartas sin leerlas — cuando las necesites, las leerás.",
        subtext: "Hay cosas que es mejor no sentir hasta que sea necesario.",
        emotionShift: { patriotismo: 10, incertidumbre: 10 },
        nextScene: "training_barracks",
      },
    ],
  },

  // — Rama B: Despedida emotiva
  farewell_tender: {
    id: "farewell_tender",
    chapter: "Capítulo I",
    title: "Lo Que No Se Dice",
    year: "Septiembre, 1939",
    location: "Berlín",
    atmosphere: "intimate",
    narrative: `Esa última noche en casa es la más larga de tu vida.

Tu madre cocina tu plato favorito — Sauerbraten, estofado de ternera — aunque sabe que no tienes hambre. Comes en silencio. Fritz habla demasiado, nerviosamente, de fútbol y de música, porque no sabe qué otra cosa hacer con el miedo.

Tu padre sale a la carpintería después de cenar. Lo sigues. Está parado mirando las herramientas colgadas en la pared: gubias, formones, serruchos — cada una en su sitio, como siempre. El orden de una vida construida con las manos.

"Hay cosas que no puedes evitar", dice sin girarse. "Pero nunca permitas que te ordenen convertirte en algo que no eres. Eso sí puedes evitarlo."

No entiendes del todo lo que quiere decir. Pero algo en esas palabras se queda dentro de ti como una astilla.

A la mañana siguiente, en la estación, Fritz se abraza a ti y no te suelta. Tu madre te abrocha el último botón del abrigo como si tuvieras ocho años. Tu padre te da la mano, fuerte, y no te la suelta durante un segundo más de lo normal.

El tren parte. Miras por la ventanilla hasta que la figura de tu familia se vuelve un punto y luego nada.`,
    historicalNote: "Las estaciones de tren se convirtieron en lugares de despedida masiva. Fotógrafos de la época documentaron miles de estos momentos que definen la guerra más allá de los campos de batalla.",
    emotionShift: { perdida: 20, miedo: 10, incertidumbre: 10 },
    choices: [
      {
        id: "journal_on_train",
        text: "Sacar un cuaderno y empezar a escribir — necesitas procesar todo esto.",
        subtext: "Escribir es la única forma que conoces de poner orden al caos.",
        emotionShift: { incertidumbre: 10, perdida: 5 },
        nextScene: "training_barracks",
      },
      {
        id: "talk_stranger",
        text: "Hablar con el soldado que tienes al lado — también va a los cuarteles.",
        subtext: "Se llama Hans. Panadero de Hamburgo. Tiene una sonrisa demasiado grande para ir a la guerra.",
        emotionShift: { miedo: -5, patriotismo: 5 },
        nextScene: "training_barracks",
      },
    ],
  },

  // — Rama C: El padre habla
  father_talk: {
    id: "father_talk",
    chapter: "Capítulo I",
    title: "Las Cicatrices del Padre",
    year: "Septiembre, 1939",
    location: "Berlín — la carpintería",
    atmosphere: "intimate",
    narrative: `Tu padre te lleva al taller. Cierra la puerta con llave — algo que nunca hace.

Entre el olor a barniz y serrín, enciende un cigarrillo y tarda en hablar. El humo sube en espiral bajo la bombilla amarilla.

"Verdún. 1916. Tenía tu edad exacta."

Hace una pausa tan larga que piensas que no va a continuar. Luego:

"Vi a mi mejor amigo morir ahogado en barro. No por una bala. Por barro. Se llamaba Heinrich y cantaba ópera mientras limpiaba los fusiles. Le sostenía la mano cuando murió y llamaba a su madre. Tenía diecinueve años."

Se levanta, te agarra por los hombros. Sus manos, que han tallado madera durante treinta años, te aprietan fuerte.

"La guerra, Karl, no es lo que dicen en la radio. La radio miente. Los generales mienten. Solo dicen la verdad los que ya no pueden contarla."

Sus ojos, que siempre creíste duros como el roble, están húmedos.

"No puedes no ir. Si no vas, te fusilarán o irá Fritz en tu lugar. Pero escúchame: haz lo que tengas que hacer para sobrevivir. No para ganar. Para volver. A mí. A tu madre. A Fritz. ¿Me entiendes?"

Asentir es lo único que puedes hacer.`,
    historicalNote: "Un millón de veteranos alemanes de la Primera Guerra Mundial vieron partir a sus hijos en 1939. Su silencio sobre las atrocidades que habían vivido fue, paradójicamente, lo que permitió que una nueva generación marchara con entusiasmo.",
    emotionShift: { miedo: 20, incertidumbre: 20, perdida: 10, patriotismo: -15 },
    choices: [
      {
        id: "promise_survive",
        text: "\"Te lo juro, padre. Volveré.\" — Y lo dices en serio.",
        subtext: "Sabes que es una promesa que puede que no puedas cumplir. La haces igualmente.",
        emotionShift: { perdida: 10, miedo: 5, incertidumbre: -5 },
        nextScene: "farewell_tender",
      },
      {
        id: "promise_human",
        text: "\"No me convertiré en un monstruo. Eso sí te lo prometo.\"",
        subtext: "No sabes aún lo que eso costará.",
        emotionShift: { incertidumbre: 15, miedo: 10, patriotismo: -10 },
        nextScene: "farewell_tender",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // CAPÍTULO II — LOS CUARTELES (Baviera, octubre 1939)
  // ══════════════════════════════════════════════════════════
  training_barracks: {
    id: "training_barracks",
    chapter: "Capítulo II",
    title: "Fabricar Soldados",
    year: "Octubre, 1939",
    location: "Campo de entrenamiento — Baviera",
    atmosphere: "intense",
    narrative: `El campo huele a barro, pólvora y sudor de hombres que no han elegido estar aquí.

Te asignan litera, número de identificación y un fusil Karabiner 98k que pesa como una culpa. Durante seis semanas aprenderás a desmontar ese fusil con los ojos vendados, a marchar bajo la lluvia durante horas, a obedecer sin pensar. Especialmente eso último.

Tu compañero de litera se llama Hans Becker — panadero de Hamburgo, habla demasiado y ríe con facilidad, el tipo de hombre que convierte cualquier barracón en algo parecido a un hogar. A tu otro lado duerme Werner Broch, estudiante de filosofía en Leipzig, que lee a Heidegger a escondidas debajo de la manta y a veces susurra preguntas que nadie quiere escuchar.

El sargento Kessler es un hombre pequeño con una voz que parece venir del suelo. Os grita, os humilla, os hace correr hasta que vomitáis. Pero una noche, cuando cree que nadie lo ve, lo ves sentado solo fumando y mirando al horizonte con una expresión que reconoces: es la misma de tu padre.

Al final de la cuarta semana, el Oberleutnant Brandt os reúne: "Francia. En primavera. El Führer tiene el plan más audaz de la historia militar."

Werner te susurra por la noche: "¿Has notado que nunca dicen cuántos no volverán?"

Hans, desde arriba, responde: "Calla, filósofo. Hablas demasiado para quien tan poco sabe."

Pero Werner tiene razón. Y todos lo sabéis.`,
    historicalNote: "El entrenamiento básico de la Wehrmacht duraba entre seis y ocho semanas. Los reclutas eran sometidos a una intensa presión psicológica diseñada para reemplazar su identidad individual por la del soldado del Reich.",
    emotionShift: { miedo: 10, incertidumbre: 10, patriotismo: 5 },
    choices: [
      {
        id: "excel_training",
        text: "Destacar en el entrenamiento — ser el mejor tirador, el más disciplinado.",
        subtext: "Si vas a ir a la guerra, al menos irás preparado. Y quizás eso te mantenga vivo.",
        emotionShift: { patriotismo: 15, ira: 5, miedo: -5 },
        nextScene: "training_incident",
      },
      {
        id: "bond_with_hans",
        text: "Concentrarte en sobrevivir y en cuidar a los tuyos — Hans, Werner.",
        subtext: "En la guerra, los amigos son más valiosos que las medallas.",
        emotionShift: { perdida: 5, miedo: 5, incertidumbre: 10 },
        nextScene: "training_incident",
      },
      {
        id: "question_orders",
        text: "Hacerle una pregunta al sargento Kessler que nadie se atreve a hacer.",
        subtext: "\"¿Usted ha estado en combate, Herr Feldwebel?\" — Las respuestas incómodas son las honestas.",
        emotionShift: { incertidumbre: 15, miedo: 10, patriotismo: -5 },
        nextScene: "training_incident",
      },
    ],
  },

  training_incident: {
    id: "training_incident",
    chapter: "Capítulo II",
    title: "El Precio de Obedecer",
    year: "Noviembre, 1939",
    location: "Campo de entrenamiento — Baviera",
    atmosphere: "moral_dilemma",
    narrative: `Día cuarenta y dos de entrenamiento. Algo que no estaba en el programa.

Un camión llega al campo al atardecer. No es militar. De él bajan a empujones una docena de hombres con el brazalete amarillo cosido al abrigo. Vecinos de algún pueblo cercano, imaginas. Sus caras son de miedo, ese miedo específico que aún no reconoces pero que aprenderás a identificar.

El sargento Kessler forma a vuestra compañía. "Estos hombres deberán cavar zanjas en el sector norte. Vosotros los vigilaréis."

Vigilar. La palabra parece inocente. No lo es.

Uno de los hombres del brazalete amarillo cae de rodillas al tercer intento de cargar una pala — tiene más de sesenta años. El soldado a tu lado lo levanta de una patada.

Hans mira al suelo. Werner aprieta la mandíbula. Tú sientes que algo dentro de ti se mueve, como una placa tectónica que empezara a agrietarse.

Nadie ha dado la orden de pegarle. Pero nadie ha dado la orden de no hacerlo.

El anciano te mira. Sus ojos no piden ayuda — hace tiempo que aprendió que pedir ayuda no sirve. Solo miran.`,
    historicalNote: "La persecución de judíos y otras minorías fue sistemática y visible en la Alemania nazi. Los soldados rasos fueron testigos frecuentes o participantes de estos actos incluso antes del comienzo del Holocausto industrializado.",
    emotionShift: { miedo: 10, incertidumbre: 20, perdida: 10 },
    choices: [
      {
        id: "intervene_quietly",
        text: "Acercarte al anciano y ayudarle a levantar la pala — sin hacer ruido, sin llamar la atención.",
        subtext: "No es un gesto heroico. Es lo mínimo que puedes hacer siendo humano.",
        emotionShift: { incertidumbre: 10, perdida: 5, patriotismo: -10 },
        nextScene: "france_roads",
      },
      {
        id: "look_away",
        text: "Apartar la mirada y cumplir con tu puesto — no es tu responsabilidad.",
        subtext: "\"Órdenes son órdenes.\" Esa frase, descubres, tiene un peso enorme cuando se usa para callarse.",
        emotionShift: { ira: 10, incertidumbre: 15, perdida: 15 },
        nextScene: "france_roads",
      },
      {
        id: "tell_werner",
        text: "Esa noche, decirle a Werner lo que sentiste — necesitas entender qué acaba de pasar.",
        subtext: "Werner tiene más palabras que tú para lo que estáis viendo.",
        emotionShift: { incertidumbre: 20, perdida: 10, miedo: 5 },
        nextScene: "france_roads",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // CAPÍTULO III — FRANCIA (mayo 1940)
  // ══════════════════════════════════════════════════════════
  france_roads: {
    id: "france_roads",
    chapter: "Capítulo III",
    title: "La Carretera de los Refugiados",
    year: "Mayo, 1940",
    location: "Norte de Francia — Carretera D9",
    atmosphere: "chaos",
    narrative: `La Blitzkrieg es exactamente lo que promete: un rayo. Cruzáis Bélgica en días. Los Panzer III abren camino como cuchillos en mantequilla. Desde el suelo, con el polvo de las orugas metálicas en la boca, la guerra parece casi... fácil.

Hasta que veis la carretera.

Kilómetros y kilómetros de civiles franceses y belgas huyendo al sur. Carros con colchones encima. Niños sentados en las aceras, exhaustos. Ancianos que ya no pueden más y se han sentado a esperar no saben qué. Mujeres que cargan con lo que pueden y miran a vuestras columnas con un terror que os hiela la sangre.

Los Stuka atacan la carretera. No porque haya tropas enemigas — sino para colapsar el tráfico y retrasar los refuerzos aliados. Un Stuka, con su sirena infernal, pica en vertical. Las bombas caen sobre el gentío.

Cuando el humo se disipa, hay cuerpos entre los carros volcados. Una mujer grita el nombre de alguien. Un niño pequeño, de no más de cuatro años, está sentado en el asfalto llorando junto a algo que no quieres mirar.

El Oberleutnant Brandt levanta el brazo: "¡Seguimos! ¡No os detengáis!"

El niño sigue llorando.`,
    historicalNote: "Los bombardeos de la Luftwaffe sobre las columnas de refugiados en las carreteras de Francia y Bélgica en mayo de 1940 causaron miles de muertes civiles. El éxodo fue uno de los movimientos masivos de población más grandes de la historia.",
    emotionShift: { miedo: 15, perdida: 20, incertidumbre: 15, patriotismo: -10 },
    choices: [
      {
        id: "stop_child",
        text: "Romperte del pelotón y acudir al niño — aunque Brandt te esté mirando.",
        subtext: "No sabes qué vas a hacer cuando llegues. Pero no puedes dejarlo ahí.",
        emotionShift: { perdida: 10, miedo: 10, patriotismo: -15, incertidumbre: -5 },
        nextScene: "france_village",
      },
      {
        id: "follow_orders_france",
        text: "Seguir marchando — Brandt tiene razón, detenerse no cambia lo que ya pasó.",
        subtext: "Cada paso que das cargando ese pensamiento pesa más que el fusil.",
        emotionShift: { ira: 15, perdida: 20, incertidumbre: 10 },
        nextScene: "france_village",
      },
      {
        id: "ask_hans",
        text: "Mirar a Hans — ¿él también lo ha visto? ¿Qué hace él?",
        subtext: "A veces buscamos en los otros permiso para sentir lo que ya sentimos.",
        emotionShift: { perdida: 15, incertidumbre: 15, miedo: 5 },
        nextScene: "france_village",
      },
    ],
  },

  france_village: {
    id: "france_village",
    chapter: "Capítulo III",
    title: "El Pueblo y la Iglesia",
    year: "Mayo, 1940",
    location: "Pueblo francés — Ardenas",
    atmosphere: "violence",
    narrative: `Un pueblo pequeño. Casas de piedra, una iglesia, un café con las sillas todavía en las mesas. La mitad de los habitantes ha huido. La otra mitad no ha podido o no ha querido.

Un grupo de soldados franceses se ha atrincherado en el campanario. Disparan hacia vuestra columna. Dos soldados alemanes caen. El polvo de la fachada de la iglesia explota en nubes blancas con cada impacto.

Brandt te señala: "Müller. Escuadrón Gamma. Elimina esa resistencia. Ahora."

Tu primera orden de combate real. El corazón no late — golpea, como si quisiera salirse del pecho.

Hans te toca el hombro: "Juntos."

Werner no dice nada pero está a tu izquierda, con el fusil levantado, pálido como la cal.

Desde el campanario, los franceses siguen disparando. Uno de ellos grita algo en francés — quizás insultos, quizás el nombre de alguien.

Hay tres opciones delante de ti y tienes quince segundos para elegir.`,
    historicalNote: "El combate urbano en los pueblos franceses fue frecuente durante la invasión de 1940. Los soldados tomaban decisiones de vida o muerte en segundos, con información incompleta y bajo fuego real.",
    emotionShift: { miedo: 25, ira: 10 },
    choices: [
      {
        id: "assault_direct",
        text: "Asalto directo — correr hacia la iglesia con tu escuadrón bajo cobertura de fuego.",
        subtext: "Rápido, brutal, arriesgado. Algunos no llegarán a la puerta.",
        emotionShift: { ira: 20, miedo: 10, patriotismo: 10 },
        nextScene: "church_assault",
      },
      {
        id: "shout_surrender",
        text: "Gritar en francés antes de atacar — darles la oportunidad de rendirse.",
        subtext: "Tu francés del colegio es terrible. Pero es un intento.",
        emotionShift: { incertidumbre: 15, miedo: 15, perdida: -5 },
        nextScene: "church_parley",
      },
      {
        id: "flank_through_houses",
        text: "Flanquear por los jardines traseros — sorprenderles sin un disparo si es posible.",
        subtext: "Más tiempo. Más riesgo personal. Menos bajas para ambos lados.",
        emotionShift: { miedo: 15, incertidumbre: 10, perdida: 5 },
        nextScene: "church_flank",
      },
    ],
  },

  church_assault: {
    id: "church_assault",
    chapter: "Capítulo III",
    title: "Bautismo de Fuego",
    year: "Mayo, 1940",
    location: "Iglesia del pueblo, Ardenas",
    atmosphere: "violence",
    narrative: `Corres. El mundo se reduce a veinte metros de distancia y al sonido del aire partiéndose junto a tu cabeza.

Hans lanza una granada por la ventana lateral. La explosión sacude los cimientos. Un francés cae del campanario — no lo ves caer, lo escuchas.

Entras por la puerta principal derribándola de un hombro. Humo, polvo, la luz del sol atravesando los agujeros de las balas. Un vitral de la Virgen tiene un agujero del tamaño de un puño.

Un soldado francés aparece frente a ti — joven, tu edad, con sangre en la frente. Levanta las manos.

Otro francés dispara desde detrás del altar. La bala pasa tan cerca de tu oreja que oyes el zumbido. Disparas por instinto. El francés cae sobre el altar, tirando los cirios, y arde.

El olor. No te lo habían dicho. El olor es lo peor.

Cuando termina, cinco minutos después, Brandt entra sonriendo. "Excelente, Müller. Limpio y rápido."

Tú miras tus manos. No tiemblan. Y eso — que no tiemblen — es lo que más te asusta.

Hans está vomitando en un rincón. El francés joven que se rindió está arrodillado mirando el suelo. Es exactamente como Werner: gafas de alambre, manos de estudiante.

Hay un muerto entre los tuyos: Friedrich, un chico de Dresde cuyo nombre no habías aprendido todavía. Ya no podrás aprenderlo.`,
    historicalNote: "Estudios psicológicos realizados tras la guerra mostraron que muchos soldados describían el primer combate como una experiencia disociativa — como si actuaran desde fuera de su cuerpo. La normalización de matar fue uno de los efectos más profundos y duraderos de la guerra.",
    emotionShift: { miedo: 10, ira: 10, perdida: 20, patriotismo: -5 },
    choices: [
      {
        id: "sit_with_hans",
        text: "Ir a donde está Hans y sentarte a su lado sin decir nada.",
        subtext: "A veces el silencio compartido es la única forma honesta de procesar lo que acaba de pasar.",
        emotionShift: { perdida: 10, incertidumbre: -5 },
        nextScene: "after_battle_reflection",
      },
      {
        id: "check_prisoner",
        text: "Acercarte al prisionero francés — preguntarle su nombre.",
        subtext: "No sabes por qué. Quizá porque Friedrich ya no tiene nombre para ti y necesitas que este hombre siga siendo una persona.",
        emotionShift: { perdida: 10, incertidumbre: 10, patriotismo: -10 },
        nextScene: "after_battle_reflection",
      },
      {
        id: "report_brandt",
        text: "Informar a Brandt profesionalmente — bajas, prisioneros, munición consumida.",
        subtext: "Convertirte en el soldado que esperan. Quizá sea más fácil así.",
        emotionShift: { patriotismo: 10, ira: 5, perdida: 5 },
        nextScene: "after_battle_reflection",
      },
    ],
  },

  church_parley: {
    id: "church_parley",
    chapter: "Capítulo III",
    title: "Palabras entre Balas",
    year: "Mayo, 1940",
    location: "Plaza del pueblo, Ardenas",
    atmosphere: "tension",
    narrative: `"Rendez-vous! La guerre est perdue! Vous serez traités avec respect!"

Tu francés del colegio suena ridículo. Werner, detrás de ti, te corrige en voz baja: "Finie, no perdue. Perdue suena raro." 

Un silencio imposible cae sobre el pueblo. Los disparos cesan.

Luego, una voz desde el campanario: "Comment savoir qu'on peut vous faire confiance?"

¿Cómo saber que podemos fiaros? Una pregunta legítima. Los tienen rodeados con superioridad numérica. Han visto lo que les pasa a los que se rinden.

Brandt aparece a tu lado con el rostro rojo de ira. "¡Müller! ¿Qué demonios estás haciendo?"

"Dándoles la oportunidad de rendirse, Herr Oberleutnant. Es más eficiente."

Brandt te mira durante un segundo eterno. Luego: "Tienes dos minutos."

Vuelves a gritar hacia el campanario. Esta vez más despacio, más claro. Prometiendo que los prisioneros serán tratados según las convenciones de Ginebra.

Otro silencio.

Luego, lentamente, aparece una bandera blanca improvisada con un trapo.

Cuatro soldados franceses bajan. Están exhaustos, hambrientos, con heridas sin atender. El último en bajar — el que gritaba — es un hombre de unos cuarenta años con la cara llena de polvo. Te mira y asiente. No como rendición. Como reconocimiento.

Brandt te agarra del brazo en cuanto termina: "No vuelvas a hacer eso sin mi orden."`,
    historicalNote: "El Convenio de Ginebra de 1929 establecía el trato a los prisioneros de guerra. Fue sistemáticamente violado por todas las partes durante la guerra, especialmente en el Frente Oriental.",
    emotionShift: { incertidumbre: 10, miedo: -5, perdida: -10, patriotismo: 5 },
    choices: [
      {
        id: "accept_brandt_warning",
        text: "Aceptar la advertencia de Brandt — \"Entendido, Herr Oberleutnant.\"",
        subtext: "Sabes cuándo ceder. Pero también sabes lo que acaba de pasar tiene valor.",
        emotionShift: { patriotismo: 5, incertidumbre: 10 },
        nextScene: "after_battle_reflection",
      },
      {
        id: "push_back_brandt",
        text: "Responder: \"Sin bajas propias, Herr Oberleutnant. Solo cuatro prisioneros.\"",
        subtext: "Los resultados te dan la razón. Aunque Brandt nunca te lo agradecerá.",
        emotionShift: { ira: 15, incertidumbre: 5, patriotismo: -5 },
        nextScene: "after_battle_reflection",
      },
    ],
  },

  church_flank: {
    id: "church_flank",
    chapter: "Capítulo III",
    title: "Por los Jardines",
    year: "Mayo, 1940",
    location: "Pueblo francés, Ardenas",
    atmosphere: "stealth",
    narrative: `Los jardines traseros del pueblo huelen a manzanos en flor. Una grotesca ironía — la primavera no entiende de guerras.

Werner y tú avanzáis agachados entre los frutales. Encuentras una puerta de madera detrás de la sacristía, sin cerrojo. Dentro, los franceses miran hacia la plaza, esperando el ataque frontal que nunca llega.

"Hände hoch." — Calma. Sin gritos.

Seis fusiles apuntan a sus espaldas. Los franceses se giran. Uno de ellos, un sargento, evalúa la situación en un segundo y lentamente levanta las manos.

Los demás lo imitan.

Sin disparos. Sin muertos.

Entonces ves lo que tiene el sargento francés en la mano izquierda: una fotografía arrugada. No la suelta ni cuando le atas las manos. La sostiene entre los dedos como si fuera lo más importante del mundo.

Cuando Brandt llega y ve que habéis tomado la iglesia sin bajas, te felicita y habla de recomendarte para una condecoración.

Tú miras la foto del sargento francés — una mujer joven y un niño de unos tres años. Miráis los dos esa foto al mismo tiempo. Él te mira a ti. Tiene tus mismos ojos de no querer estar aquí.`,
    historicalNote: "Las tácticas de flanqueo y sorpresa eran fundamentales en la doctrina alemana de la Blitzkrieg. Muchos soldados veteranos insistían en que la táctica que minimizaba bajas era siempre la preferible, independientemente del orgullo.",
    emotionShift: { perdida: 15, incertidumbre: 10, miedo: 5 },
    choices: [
      {
        id: "acknowledge_photo",
        text: "Señalar la foto y decirle con gestos que la guarde — que la mantendrán con él.",
        subtext: "No hace falta idioma para ese gesto.",
        emotionShift: { perdida: 10, patriotismo: -5, incertidumbre: -5 },
        nextScene: "after_battle_reflection",
      },
      {
        id: "ignore_photo",
        text: "Ignorar la foto y ocuparte de entregar los prisioneros a Brandt.",
        subtext: "Cuanto menos veas, menos cargas. O eso te dices.",
        emotionShift: { ira: 5, incertidumbre: 10, perdida: 5 },
        nextScene: "after_battle_reflection",
      },
    ],
  },

  after_battle_reflection: {
    id: "after_battle_reflection",
    chapter: "Capítulo III",
    title: "Lo Que Queda Después",
    year: "Mayo, 1940",
    location: "Pueblo francés — Noche",
    atmosphere: "melancholy",
    narrative: `La noche cae sobre el pueblo. Vuestra compañía ocupa la escuela como cuartel improvisado. Alguien ha encontrado vino francés. Hans bebe más de lo que debería.

Werner y tú os sentáis fuera, en los peldaños de la entrada, mirando el cielo despejado. A lo lejos, resplandores anaranjados — otro pueblo, otro combate, otro incendio.

"¿Sabes lo que me preguntó hoy el sargento Kessler?" dice Werner. "Me preguntó qué era más importante: la disciplina o la conciencia. Le dije que la pregunta no tendría sentido si hubiera suficiente disciplina. Me miró raro."

Se queda en silencio. Luego:

"¿Crees que hay alguna forma de hacer esto sin perder algo que no se recupera?"

No tienes respuesta. Pero la pregunta se queda contigo, como todas las preguntas de Werner — entrando por la oreja y quedándose a vivir.

Al día siguiente llegan órdenes: avanzar hacia París.

Y luego, mucho más tarde, hacia el este.`,
    historicalNote: "El filósofo alemán Viktor Frankl, prisionero en campos de concentración, escribió que incluso en las condiciones más extremas, el ser humano conserva la última libertad: la de elegir su actitud ante lo que le ocurre.",
    emotionShift: { incertidumbre: 10, perdida: 5 },
    choices: [
      {
        id: "answer_werner_yes",
        text: "Responder a Werner: \"Creo que sí. Pero requiere saber exactamente quién eres antes de empezar.\"",
        subtext: "No estás seguro de saberlo. Pero quieres creerlo.",
        emotionShift: { incertidumbre: 10, miedo: -5, patriotismo: 5 },
        nextScene: "paris_falls",
      },
      {
        id: "answer_werner_no",
        text: "Responder a Werner: \"No. Creo que esto cambia a todo el mundo. La pregunta es en qué dirección.\"",
        subtext: "La honestidad a veces duele más que una bala.",
        emotionShift: { perdida: 10, incertidumbre: 10, patriotismo: -5 },
        nextScene: "paris_falls",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // CAPÍTULO IV — PARÍS (junio 1940)
  // ══════════════════════════════════════════════════════════
  paris_falls: {
    id: "paris_falls",
    chapter: "Capítulo IV",
    title: "La Ciudad de la Luz Apagada",
    year: "14 de junio, 1940",
    location: "París, Francia",
    atmosphere: "bittersweet",
    narrative: `Marchas por los Campos Elíseos.

El sol de junio hace brillar los adoquines. El Arco del Triunfo se alza al fondo. Las banderas del Reich ondean donde nunca deberían ondear. La escena es tan desproporcionadamente grandiosa que se siente irreal, como una película mal hecha.

Los parisinos os miran desde las aceras. Una anciana escupe al suelo cuando pasáis. Un hombre bien vestido os mira con un odio tan concentrado que podrías cortarlo. Una niña de unos siete años ondea un pequeño pañuelo —no de bienvenida, descubres, sino de despedida: le está diciendo adiós a su ciudad.

Brandt está eufórico. "¡Seis semanas! ¡Hemos conquistado Francia en seis semanas!"

Hans silba. Werner mira la arquitectura con los ojos muy abiertos, como un turista en el momento más equivocado.

Esa noche, en un restaurante requisado donde bebéis Bordeaux robado, Brandt recibe un mensaje y lo lee dos veces. Luego lo dobla con cuidado y os mira.

"Nuevas órdenes. Rusia."

La palabra cae sobre la mesa como una piedra.

Nadie bebe más. Nadie habla. Hans mira su copa durante un rato muy largo y luego dice, en voz baja, con la voz de un hombre que acaba de entender algo que no quería entender:

"Entonces todavía no hemos terminado."`,
    historicalNote: "París fue declarada 'ciudad abierta' el 14 de junio de 1940 para evitar su destrucción. La ciudad permaneció ocupada hasta el 25 de agosto de 1944. La Operación Barbarroja — invasión de la URSS — comenzó el 22 de junio de 1941.",
    emotionShift: { incertidumbre: 20, miedo: 20, patriotismo: -5, perdida: 5 },
    choices: [
      {
        id: "volunteer_east_pride",
        text: "\"Si hay que ir al este, iremos al este. Donde manden.\" — Lo dices en serio.",
        subtext: "El patriotismo, decides, no puede ser condicional. O lo eres o no lo eres.",
        emotionShift: { patriotismo: 20, ira: 10, miedo: -5 },
        nextScene: "eastern_front",
      },
      {
        id: "write_home_paris",
        text: "Excusarte y salir a escribir una carta a casa — necesitas hablar con alguien que no esté aquí.",
        subtext: "Le escribes a Fritz. Le dices que París es hermosa. No le dices lo demás.",
        emotionShift: { perdida: 20, incertidumbre: 10, miedo: 5 },
        nextScene: "eastern_front",
      },
      {
        id: "ask_werner_east",
        text: "Mirar a Werner y preguntarle en voz baja: \"¿Cuánto sabes de Rusia?\"",
        subtext: "Werner siempre sabe más de lo que conviene saber.",
        emotionShift: { incertidumbre: 20, miedo: 15, patriotismo: -10 },
        nextScene: "eastern_front",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // CAPÍTULO V — FRENTE ORIENTAL (diciembre 1941)
  // ══════════════════════════════════════════════════════════
  eastern_front: {
    id: "eastern_front",
    chapter: "Capítulo V",
    title: "El Frío como Enemigo",
    year: "Diciembre, 1941",
    location: "A 30 km de Moscú — URSS",
    atmosphere: "despair",
    narrative: `Nadie te dijo cómo huele el frío cuando mata a un hombre.

Tu compañía cruzó la frontera soviética en junio con 180 hombres y canciones patrióticas. Hoy, en diciembre, sois 67. No todos murieron en combate. El tifus se llevó a once. La disentería a ocho. El frío —el frío que ningún general mencionó en sus planes— se ha llevado a los demás.

Cuarenta y dos grados bajo cero. El aceite del fusil se congela. Los pies ennegrecen. Para cuando lo notas, ya no sientes nada, y eso es peor.

Werner perdió dos dedos del pie izquierdo hace tres semanas. Camina con una cojera que no tenía y ya no habla de filosofía — ahora cuenta los pasos entre un lugar con techo y el siguiente.

Hans tose de una forma que reconoces. El mismo sonido que hacía Friedrich antes de morir en aquel pueblo francés. Lo sabes pero no lo dices.

El Oberleutnant Brandt ha cambiado. Sus ojos, que en Francia brillaban de entusiasmo, ahora tienen la textura del plomo. Os reúne una tarde bajo la nevada: "Moscú no cae este año. Nos replegamos a posiciones defensivas. Orden del Alto Mando."

Un soldado nuevo — un niño de diecisiete años de Baden, con la cara sin afeitar todavía — pregunta: "¿Cuánto tiempo estaremos aquí?"

Brandt lo mira durante un segundo. "Lo que haga falta."`,
    historicalNote: "La Operación Barbarroja se detuvo ante Moscú en diciembre de 1941, cuando las temperaturas cayeron a -40°C. El ejército alemán no estaba equipado para el invierno ruso. Fue la primera gran derrota de la Wehrmacht.",
    emotionShift: { miedo: 25, perdida: 25, incertidumbre: 15, patriotismo: -20 },
    choices: [
      {
        id: "care_for_hans",
        text: "Dedicarte a cuidar a Hans — hacer que coma, que duerma, que no se rinda.",
        subtext: "Si Hans muere, algo en ti muere también. Y lo sabes.",
        emotionShift: { perdida: 15, miedo: 10, incertidumbre: -5 },
        nextScene: "atrocity_crossroads",
      },
      {
        id: "take_command",
        text: "Tomar el liderazgo informal del grupo — alguien tiene que mantener a la gente viva.",
        subtext: "No eres oficial. Pero eres el que más claro piensa cuando otros se paralizan.",
        emotionShift: { patriotismo: 10, ira: 5, miedo: -5 },
        nextScene: "atrocity_crossroads",
      },
      {
        id: "break_down_alone",
        text: "Una noche, apartarte solo y dejar que te vengan abajo — necesitas llorar aunque sea una vez.",
        subtext: "Los hombres no lloran. Pero eso es mentira, y lo sabes.",
        emotionShift: { perdida: 20, incertidumbre: 20, miedo: -10 },
        nextScene: "atrocity_crossroads",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // BIFURCACIÓN MORAL CRÍTICA — Las SS y el pueblo
  // ══════════════════════════════════════════════════════════
  atrocity_crossroads: {
    id: "atrocity_crossroads",
    chapter: "Capítulo V",
    title: "El Pueblo en Llamas",
    year: "Enero, 1942",
    location: "Pueblo soviético — Frente Central",
    atmosphere: "horror",
    narrative: `Tu compañía llega a un pueblo que debería ser un lugar de descanso. Veinte casas. Un pozo. Humo saliendo de las chimeneas.

Pero otro grupo ya está aquí.

Son SS. Waffen-SS, identificables por las rúnicas en el cuello. Su oficial — un Hauptsturmführer con la mandíbula cuadrada y ojos que no parpadean— habla con Brandt apartados del grupo.

Werner te agarra del brazo. Señala con la mirada: en la plaza del pueblo, los habitantes han sido congregados. Hombres, mujeres, niños. Ancianos que apenas pueden estar de pie. Todos con el mismo miedo que aprendiste a reconocer en el campo de entrenamiento.

El SS Hauptsturmführer vuelve a caminar hacia sus hombres. Escucháis algo que no queréis haber escuchado: la orden.

"Colaboradores del enemigo. Ejecutad."

Hans te agarra la muñeca. Sus dedos, siempre tan cálidos, están fríos.

Brandt os mira. Luego mira al suelo. Se da la vuelta y se va hacia el extremo opuesto del pueblo. Ha elegido no ver.

Tú tienes diez segundos.`,
    historicalNote: "Los Einsatzgruppen y unidades Waffen-SS perpetraron masacres masivas de civiles en la URSS entre 1941 y 1944. Se calcula que asesinaron a más de 1,5 millones de personas. Muchos soldados de la Wehrmacht fueron testigos de estas acciones.",
    emotionShift: { miedo: 30, perdida: 20, incertidumbre: 20, ira: 20, patriotismo: -25 },
    choices: [
      {
        id: "intervene_atrocity",
        text: "Ponerte delante — plantar los pies entre los SS y los civiles.",
        subtext: "No tienes autoridad para esto. No tienes el rango. No tienes ninguna razón práctica. Pero tienes las palabras de tu padre: 'no te conviertas en un monstruo.'",
        emotionShift: { miedo: 30, ira: 15, incertidumbre: -10, perdida: -10, patriotismo: -20 },
        nextScene: "intervene_aftermath",
      },
      {
        id: "take_cover_watch",
        text: "Meterte en una casa — no puedes pararlo, pero no tienes que verlo.",
        subtext: "No matar no es lo mismo que no ser cómplice. Pero es lo único que puedes controlar.",
        emotionShift: { perdida: 30, incertidumbre: 15, miedo: 15, ira: 10 },
        nextScene: "watch_aftermath",
      },
      {
        id: "follow_brandt",
        text: "Seguir a Brandt — si él mira hacia otro lado, tú también.",
        subtext: "La obediencia como mecanismo de defensa. Dejar de pensar para dejar de sentir.",
        emotionShift: { perdida: 25, incertidumbre: 20, ira: 15, patriotismo: -30 },
        nextScene: "watch_aftermath",
      },
    ],
  },

  intervene_aftermath: {
    id: "intervene_aftermath",
    chapter: "Capítulo V",
    title: "El Precio de Ser Humano",
    year: "Enero, 1942",
    location: "Pueblo soviético",
    atmosphere: "tension",
    narrative: `Das tres pasos al frente y te pones entre los soldados SS y el grupo de civiles.

El Hauptsturmführer SS te mira como si acabaras de aparecer de la nada. Sus hombres os señalan con los fusiles. A ti y, detrás tuyo, a Werner y Hans —que se han puesto a tu lado sin que se lo pidieras.

"Soldier. Move." — En alemán, pero con la frialdad del acero.

"Estos civiles no están armados. No han combatido." Tu voz no tiembla. No sabes de dónde viene esa calma. "Las Convenciones de Ginebra—"

"No me cites las Convenciones, soldado de segunda. Conozco mis órdenes."

El Hauptsturmführer da un paso hacia ti. Está a medio metro. Sus ojos no tienen nada dentro.

Brandt aparece. Ha vuelto. Os mira a todos y durante un segundo que dura un siglo entero, sopesa. Luego se dirige al SS: "Este sector es responsabilidad de mi compañía, Herr Hauptsturmführer. No interfiera."

Una mentira. Una mentira absurda. Pero la dice con la voz de alguien que está dispuesto a respaldarlo.

Los SS se retiran. Los civiles no entienden qué ha pasado. Una mujer mayor te dice algo en ruso. No lo entiendes. Pero su expresión sí.

Esa noche, Brandt te llama aparte: "Lo que pasó hoy no pasó. ¿Me entiendes, Müller? Si alguien pregunta, no estuvimos aquí." Hace una pausa. "Fue valiente. Y fue una estupidez. Ambas cosas a la vez."`,
    historicalNote: "Hubo casos documentados de oficiales y soldados de la Wehrmacht que se opusieron a masacres, a veces con éxito. Eran la excepción, no la regla. Algunos pagaron con su carrera militar o con su vida.",
    emotionShift: { miedo: 15, perdida: -10, incertidumbre: 10, patriotismo: -10 },
    choices: [
      {
        id: "thank_brandt",
        text: "Agradecer a Brandt en privado — él también arriesgó algo hoy.",
        subtext: "Los hombres son más complicados que las etiquetas que les ponemos.",
        emotionShift: { incertidumbre: 10, perdida: -5 },
        nextScene: "stalingrad_approach",
      },
      {
        id: "write_record",
        text: "Escribir en tu cuaderno lo que pasó — con nombres, fechas, detalles.",
        subtext: "Alguien tiene que ser testigo. Aunque ese alguien seas solo tú.",
        emotionShift: { perdida: 10, incertidumbre: 5, miedo: 5 },
        nextScene: "stalingrad_approach",
      },
    ],
  },

  watch_aftermath: {
    id: "watch_aftermath",
    chapter: "Capítulo V",
    title: "Lo Que No Puedes Desoir",
    year: "Enero, 1942",
    location: "Pueblo soviético",
    atmosphere: "horror",
    narrative: `Los disparos duran ocho minutos.

Los escuchas desde dentro de la casa donde te has metido con Hans. Hans tiene la cabeza entre las manos. Tú miras el suelo — una grieta en la madera que atraviesa toda la habitación de lado a lado.

Los disparos cesan.

Werner entra empapado en nieve, sin decir nada. Se sienta en el suelo, saca su libro de Heidegger, lo abre en una página cualquiera y lo cierra sin leer nada. Luego lo vuelve a abrir.

Cuando salís, la plaza está vacía. Los SS se han ido. Brandt está sentado en los peldaños de una casa fumando. Os mira sin decir nada.

No hay nada que decir.

Esa noche no duermes. No es una metáfora. Literalmente, durante las seis horas que tenéis para descansar, no puedes cerrar los ojos sin ver la grieta en la madera y escuchar lo que sonaba fuera.

Werner te escribe una nota a la mañana siguiente, en un papel diminuto: "Lo que no paramos es igual de nuestro que lo que hicieron. Eso es lo que significa ser testigo."

Guardas la nota. No respondes. No tienes respuesta.`,
    historicalNote: "La psicología moral denomina 'daño moral' al sufrimiento causado por participar en, o no impedir, actos que violan los propios valores éticos. Los veteranos de la Segunda Guerra Mundial sufrieron altísimas tasas de este tipo de trauma, muchas veces en silencio.",
    emotionShift: { perdida: 35, incertidumbre: 20, ira: 15, miedo: 10 },
    choices: [
      {
        id: "confess_werner",
        text: "Decirle a Werner que tiene razón — y que no sabes cómo vivir con eso.",
        subtext: "La honestidad no resuelve nada. Pero la mentira lo empeora todo.",
        emotionShift: { perdida: 10, incertidumbre: -5 },
        nextScene: "stalingrad_approach",
      },
      {
        id: "bury_it_deep",
        text: "Enterrar todo lo que sentiste — necesitas seguir funcionando.",
        subtext: "Lo que entierras sin procesar crece en la oscuridad.",
        emotionShift: { ira: 20, incertidumbre: 5, perdida: 5 },
        nextScene: "stalingrad_approach",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // CAPÍTULO VI — STALINGRADO (nov. 1942 – feb. 1943)
  // ══════════════════════════════════════════════════════════
  stalingrad_approach: {
    id: "stalingrad_approach",
    chapter: "Capítulo VI",
    title: "La Ciudad Maldita",
    year: "Septiembre, 1942",
    location: "Stalingrado — URSS",
    atmosphere: "horror",
    narrative: `Stalingrado no es una ciudad. Es una pesadilla con coordenadas geográficas.

Los alemanes la llaman Rattenkrieg — guerra de ratas. Luchis palmo a palmo, habitación por habitación, piso por piso. Cada edificio es un universo de muerte. El sótano que controlabas esta mañana pertenece al enemigo esta tarde. El pasillo que limpiasteis ayer tiene franctiradores hoy.

Los soviéticos son distintos a los franceses. No retroceden. No se rinden. Contraatacan con una ferocidad que hace que los manuales militares parezcan ficción.

El nuevo comandante de vuestra unidad es el Hauptmann Steiner — SS, Cruz de Caballero, ojos como rendijas. Brandt fue evacuado con metralla en la pierna. Lo echas de menos más de lo que creías posible.

Hans ya no tose — ahora tiene fiebre alta y se arrastra. Werner ha perdido el libro de Heidegger en algún asalto y a veces mira el suelo donde debería estar como si hubiera perdido algo más importante que un libro.

Tú llevas semanas sin dormir más de dos horas seguidas. Los sueños —cuando llegan— no son mejores que la vigilia.

Y entonces llega la noticia que lo cambia todo: el Ejército Rojo ha lanzado la Operación Urano. Dos millones de soldados soviéticos han roto las líneas al norte y al sur. El 6.° Ejército está rodeado. 300.000 hombres. Vosotros entre ellos.

La radio emite las palabras de Hitler: "El 6.° Ejército se mantendrá hasta el último hombre. No hay retirada."

Steiner reúne lo que queda de vuestra compañía — 31 hombres de los 180 que cruzaron la frontera. "Escuchadme bien", dice. "Los que fallen en el deber de defender esta posición serán ejecutados sumariamente. Eso incluye cualquier intento de rendición no autorizada."

Hans está demasiado enfermo para estar de pie. Lo sostiene Werner.

Tú miras las ruinas de Stalingrado a tu alrededor y piensas en la carpintería de tu padre.`,
    historicalNote: "La Operación Urano (noviembre de 1942) fue el contraataque soviético que cercó al 6.° Ejército alemán en Stalingrado. De los 300.000 soldados cercados, unos 91.000 se rindieron en febrero de 1943. Menos de 6.000 volvieron a Alemania con vida.",
    emotionShift: { miedo: 30, perdida: 25, incertidumbre: 20, patriotismo: -25, ira: 15 },
    choices: [
      {
        id: "plan_breakout",
        text: "Proponer a Werner una fuga — de noche, por el flanco suroeste, mientras queda tiempo.",
        subtext: "Deserción. Pelotón de fusilamiento si te cogen los alemanes. Campo de prisioneros si te cogen los rusos. Pero quizás la única salida real.",
        emotionShift: { miedo: 20, incertidumbre: 20, perdida: 5 },
        nextScene: "breakout_planning",
      },
      {
        id: "obey_hold",
        text: "Mantener la posición — cumplir las órdenes mientras haya una oportunidad.",
        subtext: "Quizás el mando tiene un plan. Quizás vengan refuerzos. Quizás.",
        emotionShift: { patriotismo: 10, ira: 10, miedo: 5 },
        nextScene: "stalingrad_siege",
      },
      {
        id: "focus_hans",
        text: "Lo único que importa ahora mismo es que Hans no muera esta noche.",
        subtext: "El mundo puede esperar. Tu amigo no puede.",
        emotionShift: { perdida: 15, miedo: 10, incertidumbre: -5 },
        nextScene: "stalingrad_siege",
      },
    ],
  },

  stalingrad_siege: {
    id: "stalingrad_siege",
    chapter: "Capítulo VI",
    title: "Hambre de Invierno",
    year: "Enero, 1943",
    location: "Stalingrado — sótano del sector norte",
    atmosphere: "despair",
    narrative: `La ración diaria: 75 gramos de pan negro y medio litro de sopa que parece agua teñida. Los caballos muertos llevan semanas siendo la principal fuente de proteínas. Esta semana no hay caballos.

Hans tiene treinta y ocho de fiebre. Lo habéis instalado en el rincón más caliente del sótano —que no es nada caliente— con mantas robadas de los muertos. Cuando está consciente habla de su panadería. "Las medialunas con mantequilla", dice, "tienen que dorar por los bordes, Karl, por los bordes, eso es lo importante."

Werner cuida de él cuando tú sales a patrullar. Pero Werner también está fallando — la cojera se ha vuelto más pronunciada, la tos que tenía el mes pasado ha empeorado.

Una mañana, mientras rebuscas entre los escombros de un edificio buscando comida o medicamentos, encuentras algo: una familia rusa escondida en un sótano. Una madre con dos niños, quizás cuatro y seis años. Esqueléticos. Aterrados. Han aprendido que el ruido puede matarlos y están en silencio absoluto.

La madre levanta las manos cuando te ve, protegiéndose con el cuerpo a los niños.

En tu mochila tienes lo único que te queda: una lata de carne en conserva. La última.

Y entonces piensas en Hans, con su fiebre, que lleva tres días sin comer casi nada.`,
    historicalNote: "Durante el cerco de Stalingrado, la población civil rusa también estaba atrapada en la ciudad. Compartían con los combatientes el hambre y el frío. Se calcula que más de 40.000 civiles murieron durante la batalla.",
    emotionShift: { perdida: 25, miedo: 15, incertidumbre: 15 },
    choices: [
      {
        id: "give_civilians",
        text: "Dar la lata a la madre — los niños la necesitan más.",
        subtext: "Hans te entendería. Aunque muera, te entendería.",
        emotionShift: { perdida: 20, patriotismo: -10, incertidumbre: -5 },
        nextScene: "stalingrad_final",
      },
      {
        id: "keep_for_hans",
        text: "Guardar la lata para Hans — es tu amigo, y quizás esto le salve.",
        subtext: "La lealtad también tiene un precio. Todo lo tiene.",
        emotionShift: { incertidumbre: 15, ira: 5, perdida: 10 },
        nextScene: "stalingrad_final",
      },
      {
        id: "split_tin",
        text: "Abrir la lata y dividirla — la mitad para los niños, la mitad para Hans.",
        subtext: "No es suficiente para nadie. Pero es lo que tienes.",
        emotionShift: { perdida: 10, incertidumbre: 10, miedo: 5 },
        nextScene: "stalingrad_final",
      },
    ],
  },

  breakout_planning: {
    id: "breakout_planning",
    chapter: "Capítulo VI",
    title: "La Grieta en el Cerco",
    year: "Diciembre, 1942",
    location: "Stalingrado — franja suroeste",
    atmosphere: "tension",
    narrative: `Werner tiene un mapa dibujado a mano con los puestos de guardia soviéticos que ha ido recopilando durante semanas. "Lo tenía por si acaso", dice. Siempre lo supo.

Hay una franja al suroeste — un río, terreno accidentado, patrullas soviéticas separadas entre sí por más de dos kilómetros. Una ventana. Estrecha, peligrosa, pero una ventana.

"¿Hans?" preguntas.

Werner baja la mirada. "Hans no puede caminar más de cien metros."

El silencio entre los dos vale por una conversación entera.

Tenéis que decidir esa noche. Mañana Steiner realiza una inspección y si nota algo, si falta alguien...

Hans se despierta y os mira con ojos febriles pero lúcidos. "Lo he oído todo", dice. Su voz es un susurro. "Id. No esperéis por mí."

Werner empieza a protestar. Hans le pone la mano en el brazo: "Werner. Tengo treinta y nueve grados de fiebre y los pulmones llenos de líquido. Os arrastraré a los dos. Lo sabes."

Te mira a ti. "Cuida de Werner, Karl."

Hay un tipo de silencio que no tiene nada que ver con la ausencia de sonido.`,
    historicalNote: "Los intentos de fuga del cerco de Stalingrado eran sumamente peligrosos. La mayoría de los que lo intentaron fueron capturados por los soviéticos o ejecutados por sus propios oficiales al ser descubiertos.",
    emotionShift: { miedo: 25, perdida: 30 },
    choices: [
      {
        id: "escape_leave_hans",
        text: "Aceptar lo que dice Hans y preparar la fuga — esta noche.",
        subtext: "La mayor crueldad a veces es hacer lo que alguien te pide.",
        emotionShift: { perdida: 30, miedo: 20, incertidumbre: 10 },
        nextScene: "escape_attempt",
      },
      {
        id: "refuse_leave",
        text: "No. No vais a dejarlo. Buscáis otra forma — los tres juntos o ninguno.",
        subtext: "Quizás sea una condena para todos. Lo sabes. Te da igual.",
        emotionShift: { perdida: 15, miedo: 10, incertidumbre: -10, patriotismo: 5 },
        nextScene: "stalingrad_final",
      },
    ],
  },

  escape_attempt: {
    id: "escape_attempt",
    chapter: "Capítulo VI",
    title: "A Través del Hielo",
    year: "Enero, 1943",
    location: "Estepa soviética — sur de Stalingrado",
    atmosphere: "tension",
    narrative: `Sin insignias. Sin documentos. Solo vosotros dos, la nieve, y el mapa de Werner.

Avanzáis de noche. Las estrellas son lo único fijo en un mundo que ha perdido todas sus referencias. Cada crujido de la nieve suena como una señal de alarma. Cada sombra es un soldado soviético.

Al cruzar el río congelado, el hielo cede bajo el peso de Werner. Cae hasta las rodillas. Lo sacas antes de que se hunda más pero sus piernas están empapadas. En este frío, eso es una condena en cámara lenta.

Caminad toda la noche. Al amanecer os refugiáis en los restos de un granero quemado.

Werner está temblando de una forma que no para. Sus pies mojados se están poniendo de un color que reconoces. "No siento los dedos", dice, con esa calma extraña que tienen las personas cuando su cuerpo ya ha aceptado algo que la mente aún no puede.

Seguís. Porque parar es morir.

En algún momento del segundo día, en una granja abandonada, encontráis a una campesina rusa de unos sesenta años. Os mira, mira vuestros uniformes destrozados, y después de un silencio que dura siglos, os hace un gesto para que entréis.

No hay explicación para ese gesto. Solo existe.`,
    historicalNote: "Algunos desertores alemanes encontraron ayuda inesperada en la población civil soviética, a menudo personas que habían perdido a sus propios hijos en la guerra y actuaban desde una humanidad que ningún régimen había podido extinguir.",
    emotionShift: { miedo: 20, perdida: 20, incertidumbre: 10 },
    choices: [
      {
        id: "trust_farmer",
        text: "Entrar — confiar en esa mujer aunque no haya ninguna razón lógica para hacerlo.",
        subtext: "Hay momentos en que la única opción es confiar en la humanidad de un extraño.",
        emotionShift: { incertidumbre: -10, miedo: -10, perdida: -5 },
        nextScene: "ending_desercion",
      },
      {
        id: "run_from_farmer",
        text: "Agradecer con un gesto y seguir — no podéis arriesgar que alguien os denuncie.",
        subtext: "La desconfianza también es una forma de miedo.",
        emotionShift: { miedo: 15, incertidumbre: 10, perdida: 10 },
        nextScene: "ending_tragedia",
      },
    ],
  },

  stalingrad_final: {
    id: "stalingrad_final",
    chapter: "Capítulo VI",
    title: "2 de Febrero",
    year: "2 de febrero, 1943",
    location: "Stalingrado — sótano del 6.° Ejército",
    atmosphere: "despair",
    narrative: `El Feldmarschall Paulus se rinde esta mañana.

La radio lo anuncia con voz apagada. El primer mariscal de campo alemán en rendirse en la historia. Hitler, desde Berlín, está furioso. Los hombres del sótano están simplemente... aliviados. El alivio más triste del mundo: sobrevivir lo suficiente para rendirse.

Steiner se pega un tiro. No habla con nadie. Sale del búnker y cinco minutos después se escucha el disparo.

Os rendís con las manos en alto. Los soldados soviéticos que os reciben son más jóvenes de lo que esperabas. Uno de ellos — un chaval de quizás dieciséis años con una estrella roja en el gorro de piel — os mira con algo que no es odio. Es algo más antiguo: cansancio.

Hans murió tres noches atrás. Lo enterrasteis tú y Werner como pudisteis — en la nieve, con un trozo de madera como lápida y el nombre escrito con la bayoneta. "Hans Becker. Panadero. Hijo." No supisteis qué más poner.

Werner camina cojeando a tu lado. Os miráis. No hay palabras para esto tampoco.

La marcha hacia los campos de prisioneros comienza bajo un cielo gris que parece no tener fin.`,
    historicalNote: "La rendición de Stalingrado el 2 de febrero de 1943 fue percibida en Alemania como una catástrofe nacional. El régimen nazi había prometido la victoria. La realidad de la derrota fue devastadora para la moral del país.",
    emotionShift: { perdida: 30, miedo: 10, patriotismo: -20 },
    choices: [
      {
        id: "walk_for_fritz",
        text: "Poner un pie delante del otro pensando en Fritz — él te espera.",
        subtext: "Fritz tendría ahora diecinueve años. La misma edad que tú cuando te fuiste.",
        emotionShift: { perdida: 10, incertidumbre: 5 },
        nextScene: "ending_supervivencia",
      },
      {
        id: "walk_with_werner",
        text: "Darle el brazo a Werner y caminar juntos — lo que quede de este camino, juntos.",
        subtext: "Dos hombres que ya no tienen país. Solo se tienen el uno al otro.",
        emotionShift: { perdida: 15, incertidumbre: -5 },
        nextScene: "ending_sacrificio",
      },
    ],
  },

  // ══════════════════════════════════════════════════════════
  // LOS CINCO FINALES
  // ══════════════════════════════════════════════════════════
  ending_supervivencia: {
    id: "ending_supervivencia",
    chapter: "Epílogo",
    title: "El Largo Camino a Casa",
    year: "Octubre, 1955",
    location: "Estación Anhalter — Berlín",
    atmosphere: "bittersweet",
    narrative: `Doce años.

Doce años en campos de trabajo soviéticos. Siberia. Minas de carbón donde el sol no llega nunca. Trabajos que doblaron tu espalda pero no la quebraron, porque cada mañana te repetías el mismo nombre como un conjuro: Fritz.

El tren llega a la estación de Berlín en un martes de octubre. La ciudad que encuentras no se parece a la que dejaste. Está dividida, lleva un muro en el corazón, está llena de cicatrices que la gente pretende no ver. Pero está viva.

En el andén hay familias esperando. Caras con la misma expresión: esperanza con miedo, miedo con esperanza. La misma mezcla imposible.

Fritz está ahí. Tiene treinta y dos años. Entradas en las sienes. Una mandíbula que se parece a la de tu padre. Cuando te reconoce — aunque no estás seguro de que te reconozca, porque ¿qué queda de aquel Karl de veintiún años? — abre los brazos.

Te cuenta las cosas que no sabías: tu madre sobrevivió los bombardeos del 44 pero murió de un infarto en el 50. Tu padre la siguió seis meses después. La carpintería no existe ya. Donde estaba hay un edificio de apartamentos soviético.

Nada de lo que dejaste sigue en pie.

Excepto Fritz. Excepto tú.

Esa noche, en el apartamento pequeño de Fritz en Kreuzberg, abres la ventana y miras los tejados de Berlín bajo la lluvia de octubre. En algún lugar de la ciudad alguien toca un piano. La música sube por los patios interiores.

Piensas en Hans, que olía a levadura y reía demasiado fuerte. En Werner y sus preguntas sin respuesta. En tu padre, que lo sabía todo y no pudo decirte nada que te preparara para esto.

Mañana buscarás trabajo. Empezarás de nuevo. Habrá maderas que trabajar y cosas que construir.

Pero esta noche simplemente escuchas el piano y dejas que el llanto venga, el mismo que guardaste durante doce años, y que ahora sale solo, silencioso, sin que puedas —ni quieras— pararlo.

Karl Müller. Carpintero. Hijo. Superviviente.`,
    historicalNote: "Los últimos prisioneros de guerra alemanes no regresaron de la URSS hasta 1955-1956. Más de diez años después del final de la guerra. Muchos volvieron a un país irreconocible, a familias que habían construido nuevas vidas sin ellos. La reintegración fue un proceso doloroso y largo que la sociedad alemana tardó décadas en reconocer.",
    emotionShift: {},
    isEnding: true,
    endingType: "supervivencia",
    choices: [],
  },

  ending_sacrificio: {
    id: "ending_sacrificio",
    chapter: "Epílogo",
    title: "Un Paso Más",
    year: "Marzo, 1943",
    location: "Llanuras de la estepa — camino al campo de prisioneros",
    atmosphere: "somber",
    narrative: `Werner se cae por primera vez en el décimo día de marcha.

No es dramático. Simplemente sus piernas dejan de obedecer y él cae de rodillas en la nieve. Los guardias soviéticos siguen caminando — los que caen se quedan. Esa es la regla no escrita.

Tú te detienes.

Un guardia te grita algo. No lo entiendes pero su significado es universal: mueve.

No te mueves.

El guardia viene hacia ti. Werner te mira desde el suelo con esa mirada suya de filósofo que ha encontrado la respuesta justo cuando ya no le sirve de nada: "Karl. Sigue."

"No."

Lo levantas. Lo pones sobre tus hombros como aprendiste a cargar tablones de madera en la carpintería de tu padre. El guardia os mira, sopesa, y finalmente hace un gesto con el fusil: adelante.

Así camináis. Tú cargando a Werner. Werner que va repitiendo en voz baja, como un mantra, los versos de Goethe que se sabe de memoria. "Über allen Gipfeln ist Ruh..." — Sobre todas las cimas hay paz.

Llegas con Werner al campo de prisioneros.

Werner muere de tuberculosis seis semanas después. Pero llega al campo. Llega con techo. Con algo parecido a calor. Con la dignidad de no haber sido abandonado en la nieve.

Tú mueres diez días después de Werner, de lo mismo, en el mismo barracón.

Pero en esos diez días escribes tres cartas: una para Fritz, una para la novia de Hans en Hamburgo, y una para la familia del sargento francés de las Ardenas cuya fotografía no pudiste devolver.

No sabes si llegarán. Pero las escribes.

Algunos hombres dejan grandes monumentos. Tú dejaste tres cartas y el recuerdo de haber cargado a un amigo cuando todos los demás siguieron andando.`,
    historicalNote: "En los campos de prisioneros soviéticos, la mortalidad fue extremadamente alta en los primeros años: estimaciones históricas apuntan a que entre un 35 y un 57% de los prisioneros alemanes murieron durante el cautiverio. La solidaridad entre prisioneros fue, para muchos, la única razón para seguir.",
    emotionShift: {},
    isEnding: true,
    endingType: "sacrificio",
    choices: [],
  },

  ending_desercion: {
    id: "ending_desercion",
    chapter: "Epílogo",
    title: "Lo Que Construimos con las Manos",
    year: "1943 — 1949",
    location: "Suiza — Berlín",
    atmosphere: "melancholy",
    narrative: `La campesina rusa se llama Nadezhda. Tiene tres hijos muertos en la guerra — dos rusos, uno alemán, aunque eso no lo sabéis entonces.

Os esconde durante tres semanas. Os da de comer su escasa comida. Os habla en un ruso que no entendéis pero cuyo tono es inequívoco: hay personas que trascienden las guerras de sus gobiernos.

Cuando podéis caminar, seguís hacia el oeste. Meses de camino. Werner y tú, con documentos falsos conseguidos de formas que es mejor no detallar, cruzáis Polonia, Checoslovaquia, Austria. En cada frontera, un corazón que se paraliza. En cada guardia, el miedo a que todo termine aquí.

En el verano del 43 llegáis a Suiza. Os internan. Sois, oficialmente, desertores del ejército del Reich.

Werner muere en Suiza en el 44 — no de la guerra, sino de las secuelas de la congelación. Una infección que no había manera de prever. Muere en una cama limpia, con sábanas blancas, escuchando música en la radio. Le sostienes la mano y él dice, casi con sorpresa: "Es extraño. Tengo paz."

Cuando la guerra termina en el 45, vuelves a Berlín.

La carpintería es escombros. Tu madre está viva. Tu padre, no.

Reconstruyes el taller con tus manos, ladrillo a ladrillo, tabla a tabla. Le pones a cada mueble que haces las iniciales H.B. en un lugar que solo tú ves: Hans Becker, panadero de Hamburgo, que murió en un sótano de Stalingrado creyendo que tú y Werner teníais que vivir.

Nunca hablas de la guerra. Pero en invierno, cuando la primera nevada cubre el patio del taller, te sientas en el banco de trabajo de tu padre y te quedas en silencio durante un buen rato.

No es tristeza exactamente. Es algo más difícil de nombrar — la gratitud impura de los que sobreviven cuando otros no pudieron.`,
    historicalNote: "Después de la guerra, los desertores alemanes enfrentaron una situación paradójica: en la Alemania Occidental no fueron oficialmente rehabilitados hasta 1998, cuando el Bundestag anuló las condenas de los tribunales militares nazis. Durante décadas vivieron en una especie de vergüenza social impuesta.",
    emotionShift: {},
    isEnding: true,
    endingType: "desercion",
    choices: [],
  },

  ending_tragedia: {
    id: "ending_tragedia",
    chapter: "Epílogo",
    title: "El Peso de lo que No Hiciste",
    year: "1943 — 1950",
    location: "Campo de prisioneros — Berlín",
    atmosphere: "dark",
    narrative: `La decisión de no entrar en la granja de Nadezhda os cuesta la libertad.

Una patrulla soviética os encuentra al día siguiente, congelados y exhaustos, en un campo sin refugio. La captura es casi un alivio — al menos paráis de caminar.

El campo de prisioneros es Karagandá, en Kazakhstan. Werner no llega al verano. La tuberculosis lo encuentra antes.

Sus últimas palabras son para ti: "No te culpes, Karl. Hiciste lo que pudiste."

Mientes con la mirada y asientes. Porque lo contrario —decirle que no, que podrías haber hecho más, que había una puerta abierta que cerraste por miedo— le quitaría su último consuelo.

Vuelves a Berlín en 1949. Amigdalectomía de la guerra: todo extirpado. Tu madre te reconoce pero tú tardas un momento en reconocerla a ella. Fritz ha crecido tanto que parece otro. La ciudad es un fantasma de sí misma.

Reconstruyes la carpintería. Trabajas. Vives. Tienes incluso, algunos años después, algo parecido a la felicidad — una mujer, dos hijos, un jardín pequeño.

Pero hay inviernos en que te despiertas a las tres de la mañana con la certeza exacta de cuánto pesa una decisión tomada en un segundo de miedo.

La campesina que no esperaste. El paso que no diste.

Tus hijos crecen y te preguntan por la guerra. Les dices que fue terrible y que ya pasó. Eso es verdad. Lo que no les dices es que algunas guerras no terminan con los tratados de paz — las que uno lleva dentro duran lo que dura la memoria.

Karl Müller vivió ochenta y un años. Construyó mesas y sillas y armarios que todavía existen. Amó a su familia. Fue, en muchos sentidos, un buen hombre.

Pero nunca pudo mirar la nieve sin ver una puerta cerrada.`,
    historicalNote: "El trastorno de estrés postraumático —llamado entonces 'neurosis de guerra'— afectó a millones de veteranos que nunca recibieron tratamiento ni reconocimiento. La idea de que 'un soldado no habla de esas cosas' causó un daño generacional silencioso en las familias alemanas, como en las de todos los países involucrados.",
    emotionShift: {},
    isEnding: true,
    endingType: "tragedia",
    choices: [],
  },

  ending_heroismo: {
    id: "ending_heroismo",
    chapter: "Epílogo",
    title: "Un Nombre en la Nieve",
    year: "Enero, 1943",
    location: "Stalingrado",
    atmosphere: "somber",
    narrative: `Los últimos días del cerco son un caos de huida hacia ninguna parte.

En ese caos, encuentras algo que no esperabas: una oportunidad de hacer algo concreto, real, sin estrategia ni cálculo.

Un grupo de civiles rusos está atrapado entre las líneas — una escuela, una maestra, once niños de no más de diez años. Los bombardeos han destruido los únicos accesos que conocen. Los soviéticos no pueden entrar. Los alemanes, técnicamente, deberían ignorarlos.

Werner diseña la ruta. Tú la ejecutas. Hans, que apenas puede caminar, se queda para cubrir vuestra retirada con los últimos cargadores.

Guiáis a los niños a través de las ruinas. La maestra no habla alemán. Tú no hablas ruso. La comunicación es de gestos, de manos que apuntan, de miradas que piden calma.

Los niños pasan. La maestra es la última en cruzar. Se gira y te dice algo en ruso que no entiendes.

Werner, que ha aprendido algunas palabras, te traduce después en voz baja: "Dijo que que Dios te recuerde."

Una bala perdida. No sabes si rusa o alemana. Ya no importa.

Caes en la nieve de Stalingrado mirando un cielo que, por primera vez en meses, está completamente despejado. Las estrellas sobre la ciudad destruida como si nada de lo que ha pasado aquí tuviera ningún sentido bajo esa inmensidad.

El último pensamiento es para Fritz. Y para la carpintería. Y para un banco de trabajo que huele a serrín y donde tu padre lijaba madera que no necesitaba ser lijada.

Luego solo el frío, que ya no duele.

Luego nada.

Luego paz.

En algún lugar de Berlín, Fritz recibirá una carta meses después. Escrita por Werner, que sobrevivió y volvió. La carta dirá lo que pasó. Y Fritz, que ya tiene diecinueve años y ha visto demasiado para su edad, la leerá y la doblará y la guardará en el cajón de la mesilla.

La leerá todas las noches durante el resto de su vida.`,
    historicalNote: "Existen testimonios documentados de soldados alemanes que, en los últimos días del cerco de Stalingrado, realizaron actos de rescate de civiles. La historia registra principalmente a los perpetradores de atrocidades; los pequeños actos de humanidad individual raramente encuentran su lugar en los libros.",
    emotionShift: {},
    isEnding: true,
    endingType: "heroismo",
    choices: [],
  },
};

export const ENDINGS_INFO = {
  supervivencia: {
    title: "Supervivencia",
    description: "Karl sobrevivió doce años de cautiverio y regresó a una Berlín irreconocible.",
    color: "hsl(38, 60%, 50%)",
    icon: "🏠",
  },
  heroismo: {
    title: "Heroísmo",
    description: "Karl murió en Stalingrado salvando a once niños. Werner contó su historia.",
    color: "hsl(200, 50%, 55%)",
    icon: "⭐",
  },
  desercion: {
    title: "Deserción",
    description: "Karl huyó, perdió a Werner, y reconstruyó con sus manos lo que la guerra destruyó.",
    color: "hsl(120, 30%, 45%)",
    icon: "🌲",
  },
  sacrificio: {
    title: "Sacrificio",
    description: "Karl cargó a Werner hasta el campo. Murió allí, pero no solo y no sin hacer lo correcto.",
    color: "hsl(280, 40%, 55%)",
    icon: "✉️",
  },
  tragedia: {
    title: "Tragedia",
    description: "Karl sobrevivió, pero una puerta cerrada en un segundo de miedo lo persiguió toda la vida.",
    color: "hsl(0, 50%, 45%)",
    icon: "❄️",
  },
};