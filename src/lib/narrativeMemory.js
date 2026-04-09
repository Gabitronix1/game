// Sistema de memoria narrativa — Cenizas del Frente
// Define qué elecciones generan flags y qué texto extra inyectan en escenas posteriores.
// Las escenas usan el marcador {{inject}} para posicionar las inyecciones dentro del texto.
// Si no hay marcador, el texto extra se añade al final como fallback.

// ──────────────────────────────────────────────
// QUÉ FLAG ACTIVA CADA CHOICE ID
// ──────────────────────────────────────────────
export const CHOICE_FLAGS = {
  // Capítulo I — El llamado
  ask_father:          "escucho_al_padre",
  promise_human:       "prometio_no_monstruo",
  promise_survive:     "prometio_volver",
  read_letter_now:     "leyo_carta_tren",
  save_both_letters:   "guardo_cartas",
  talk_stranger:       "conocio_hans_tren",       // Hans aparece en el tren (farewell_tender)
  journal_on_train:    "escribe_diario",

  // Capítulo II — Los cuarteles
  excel_training:      "destaco_entrenamiento",
  bond_with_hans:      "vinculo_hans",
  question_orders:     "cuestiono_kessler",
  intervene_quietly:   "ayudo_anciano",
  look_away:           "miro_para_otro_lado",
  tell_werner:         "confio_en_werner",

  // Capítulo III — Francia
  stop_child:          "detuvo_por_nino",
  follow_orders_france:"obedecio_en_carretera",
  sit_with_hans:       "acompano_hans_batalla",
  check_prisoner:      "pregunto_nombre_prisionero",
  acknowledge_photo:   "devolvio_foto",

  // Capítulo III — Reflexión
  answer_werner_yes:   "cree_que_puede",
  answer_werner_no:    "duda_de_si_mismo",

  // Capítulo V — Frente Oriental
  care_for_hans:       "cuido_hans_este",
  break_down_alone:    "lloro_solo",
  confess_werner:      "confeso_a_werner",
  bury_it_deep:        "enterro_sentimientos",

  // Capítulo VI — Stalingrado
  give_civilians:      "dio_comida_civiles",
  keep_for_hans:       "guardo_comida_hans",
  split_tin:           "dividio_comida",
  open_second_letter:  "leyo_segunda_carta",
};

// ──────────────────────────────────────────────
// INYECCIONES POR ESCENA
// Cada entrada: { flag, text }
// Se inyectan en el marcador {{inject}} de la narrativa.
// Si hay varias que aplican, se concatenan en orden.
// ──────────────────────────────────────────────
export const SCENE_INJECTIONS = {

  // ── Capítulo II ────────────────────────────

  training_incident: [
    {
      flag: "escucho_al_padre",
      text: `Tu padre te habló de Heinrich, el amigo que murió ahogado en barro. Te dijo que la guerra no es lo que dicen en la radio. Lo estás viendo ahora mismo, en los ojos del anciano que nadie mira. `,
    },
    {
      flag: "escribe_diario",
      text: `En el cuaderno que llevas desde el tren, hay una página en blanco esperando. Aún no sabes qué escribir sobre esto. Pero algo en ti ya lo está registrando, quieras o no. `,
    },
  ],

  // ── Capítulo III ───────────────────────────

  france_village: [
    {
      flag: "ayudo_anciano",
      text: `Has aprendido que la duda tiene un coste. En los cuarteles tardaste, pero al final te moviste. El anciano del brazalete amarillo. Eso lo llevas contigo, aunque pese. `,
    },
    {
      flag: "vinculo_hans",
      text: `Miras a Hans antes de decidir. Él ya sabe lo que vas a hacer antes de que lo hagas — lleváis suficiente tiempo juntos para eso. `,
    },
  ],

  after_battle_reflection: [
    {
      flag: "confio_en_werner",
      text: `Werner ya sabe más de ti de lo que sabe nadie en este ejército. Eso, descubres, es una forma extraña de no estar solo. `,
    },
    {
      flag: "prometio_no_monstruo",
      text: `Werner pregunta si hay forma de hacer esto sin perder algo que no se recupera. No respondes enseguida. Estás pensando en una promesa que hiciste en una carpintería que ahora parece estar en otro planeta. `,
    },
    {
      flag: "acompano_hans_batalla",
      text: `Hans sigue bebiendo en el rincón. Lo viste vomitar en la iglesia — lo que le costó el combate de hoy. Te alegra haberle acompañado después, aunque no hubierais dicho nada. `,
    },
  ],

  // ── Capítulo IV ────────────────────────────

  paris_falls: [
    {
      flag: "detuvo_por_nino",
      text: `En la carretera de refugiados, rompiste el pelotón por un niño que lloraba solo. Brandt te miró. No dijo nada entonces. ¿Lo recuerda ahora, mientras anuncia Rusia? `,
    },
    {
      flag: "obedecio_en_carretera",
      text: `Seguiste marchando en la carretera de refugiados. Cada paso que diste cargando ese pensamiento pesaba más que el fusil. Eso fue hace semanas. Todavía pesa. `,
    },
    {
      flag: "pregunto_nombre_prisionero",
      text: `Le preguntaste el nombre al prisionero francés. Se llamaba Étienne. Lo recuerdas ahora, marchando por los Campos Elíseos. `,
    },
  ],

  // ── Capítulo V ─────────────────────────────

  eastern_front: [
    {
      flag: "leyo_carta_tren",
      text: `La primera carta de tu madre lleva meses en el bolsillo interior. La has releído tantas veces que el papel está suave en los pliegues. "Recuerda que antes de ser soldado eres mi hijo." En cuarenta y dos grados bajo cero, esa frase suena a otro mundo. Pero también es lo único que suena a algo real. `,
    },
    {
      flag: "guardo_cartas",
      text: `Las dos cartas de tu madre siguen sin abrir en el bolsillo interior. Intactas. Hay noches en que las tocas sin sacarlas — solo para saber que siguen ahí. `,
    },
    {
      flag: "conocio_hans_tren",
      text: `En el tren a Baviera, Hans hablaba demasiado y reía con facilidad. Entonces no entendías cómo alguien podía hacer eso yendo a la guerra. Ahora lo entiendes — era exactamente lo que necesitabais. `,
    },
  ],

  atrocity_crossroads: [
    {
      flag: "prometio_no_monstruo",
      text: `Las palabras que le dijiste a tu padre en la carpintería llevan semanas sin salir de tu cabeza: "No me convertiré en un monstruo." Las dijiste en serio. Ahora, parado delante de esto, descubres lo que cuestan.`,
    },
    {
      flag: "ayudo_anciano",
      text: `Ya lo hiciste una vez — en los cuarteles, con el anciano del brazalete amarillo. Entonces también había razones para no hacerlo. Las ignoraste. Tus manos lo recuerdan aunque tu mente quisiera olvidarlo.`,
    },
    {
      flag: "escucho_al_padre",
      text: `Tu padre te dijo que había una sola cosa que sí podías evitar. No convertirte en algo que no eres. Lo estás viendo ahora frente a ti, esa línea exacta.`,
    },
    {
      flag: "miro_para_otro_lado",
      text: `En el campo de entrenamiento miraste para otro lado. El anciano del brazalete amarillo. Lo recuerdas ahora — la grieta en la madera, los disparos. Llevas meses practicando no ver. Ahora te preguntas si ya eres demasiado bueno en eso.`,
    },
    {
      flag: "cuestiono_kessler",
      text: `Le hiciste una pregunta al sargento Kessler que nadie se atrevía a hacer. Entonces buscabas respuestas incómodas. Ahora tienes una delante y no es una pregunta — es una decisión.`,
    },
  ],

  watch_aftermath: [
    {
      flag: "ayudo_anciano",
      text: `\nPiensas en el anciano del brazalete amarillo. Entonces actuaste. Esta vez no. La diferencia entre los dos momentos te resulta imposible de articular — y eso, de alguna forma, lo hace peor.`,
    },
    {
      flag: "miro_para_otro_lado",
      text: `\nYa lo habías hecho antes. En el campo de entrenamiento. La primera vez fue más fácil — no sabías aún lo que sonaba después. Ahora sí lo sabes. Y lo elegiste de todas formas.`,
    },
    {
      flag: "enterro_sentimientos",
      text: `\nSabes lo que deberías hacer: enterrar esto también. Añadirlo a la pila. Seguir funcionando. Llevas meses haciéndolo. Pero cada vez que entierras algo, el suelo sube un poco más.`,
    },
  ],

  // ── Capítulo VI ────────────────────────────

  stalingrad_approach: [
    {
      flag: "cuido_hans_este",
      text: `Hans está demasiado enfermo para estar de pie. Lo sostiene Werner. Lo miras y recuerdas todas las noches que pasaste despertándole para que comiera, que le dabas tu ración cuando no miraba nadie. No fue suficiente. Nada es suficiente aquí. `,
    },
    {
      flag: "vinculo_hans",
      text: `Hans, que en los cuarteles convertía cualquier barracón en algo parecido a un hogar — ese Hans está ahora irreconocible. Pero cuando te mira, en sus ojos todavía hay algo de aquel panadero de Hamburgo que reía demasiado fuerte. `,
    },
    {
      flag: "lloro_solo",
      text: `Aquella noche en el frente ruso, te apartaste solo y dejaste que todo saliera. Pensabas que eso te aliviaría. En cambio, fue como vaciar un recipiente que se llenó solo a la mañana siguiente. `,
    },
  ],

  stalingrad_siege: [
    {
      flag: "leyo_carta_tren",
      text: `\nEn el bolsillo interior llevas todavía las dos cartas de tu madre. La primera ya leída — "recuerda que antes de ser soldado eres mi hijo" — y la segunda, intacta, esperando el momento que tu madre sabía que llegaría. Setenta y cinco gramos de pan negro al día. Te preguntas si ese momento ya llegó.`,
    },
    {
      flag: "guardo_cartas",
      text: `\nLas dos cartas de tu madre siguen sin abrir. Hay algo que te impide abrirlas — como si mientras estén cerradas la promesa de que puede ir a peor no se haya cumplido del todo.`,
    },
    {
      flag: "dio_comida_civiles",
      text: `\nDiste la lata a la madre rusa. Sus hijos la necesitaban más. En el sótano, mirando a Hans con fiebre, te dices que tomarías la misma decisión. Y a la vez no sabes si es verdad.`,
    },
  ],

  hans_death: [
    {
      flag: "prometio_volver",
      text: `Le prometiste a tu padre que volverías. En la carpintería, con olor a barniz y serrín. Esa noche en Stalingrado, enterrando a Hans en la nieve, la promesa pesa de una forma que no sabías que podía pesar una palabra. `,
    },
    {
      flag: "prometio_no_monstruo",
      text: `No te convertiste en un monstruo. Eso puedes decírtelo. Pero estás en la nieve de Stalingrado enterrando a tu mejor amigo, y no sabes si eso es suficiente para que valga algo. `,
    },
    {
      flag: "vinculo_hans",
      text: `Desde el primer día en los cuarteles elegiste cuidar antes que destacar. A Hans, a Werner. Esa decisión te definió. Esta noche, con la bayoneta grabando su nombre en la madera, entiendes que fue la correcta — y que eso no lo hace menos doloroso. `,
    },
    {
      flag: "conocio_hans_tren",
      text: `Lo conociste en el tren a Baviera. Él hablaba demasiado. Tú no sabías aún que ibas a necesitar exactamente eso. `,
    },
    {
      flag: "acompano_hans_batalla",
      text: `Después de la iglesia en las Ardenas, cuando Hans vomitaba en el rincón, te sentaste a su lado sin decir nada. Él lo supo. Nunca os lo dijisteis. Pero lo supo. `,
    },
  ],

  breakout_planning: [
    {
      flag: "cuido_hans_este",
      text: `\nLlevas semanas haciéndole comer cuando no quería. Despertándole. Dándole tu ración cuando no miraba nadie. Werner lo sabe. Hans lo sabe. Y ahora Hans te está pidiendo que pares.`,
    },
    {
      flag: "prometio_volver",
      text: `\nFritz. La promesa al padre. Volver. Eso es lo que Hans te está dando — una razón para no quedarte.`,
    },
  ],

  stalingrad_final: [
    {
      flag: "leyo_segunda_carta",
      text: `\nLlevas la segunda carta de tu madre doblada en el bolsillo interior. Ya la leíste — después de enterrar a Hans, en la nieve. "Vuelve. Por las razones que sean. Vuelve." Das el siguiente paso pensando en eso.`,
    },
    {
      flag: "confeso_a_werner",
      text: `\nLe dijiste a Werner que tenía razón — y que no sabías cómo vivir con eso. Él no te dio una respuesta. Solo asintió. A veces eso es lo único que existe.`,
    },
    {
      flag: "devolvio_foto",
      text: `\nEl sargento francés de las Ardenas. Le hiciste un gesto para que guardara la foto. Una mujer joven, un niño de tres años. Te preguntas si llegó a verlos.`,
    },
  ],

  // ── Finales ────────────────────────────────

  ending_supervivencia: [
    {
      flag: "prometio_volver",
      text: `\nLe prometiste a tu padre que volverías. Doce años después. Él no está en el andén — lleva cinco años muerto. Pero volviste. La promesa se cumplió de una forma que ninguno de los dos imaginó.`,
    },
    {
      flag: "escribe_diario",
      text: `\nEl cuaderno que empezaste en el tren a Baviera no sobrevivió a Stalingrado. Pero en el campo de trabajo soviético empezaste otro. Y otro. Escribir fue, durante doce años, la única forma de seguir siendo Karl Müller y no solo un número.`,
    },
  ],

  ending_desercion: [
    {
      flag: "devolvio_foto",
      text: `\nA veces piensas en el sargento francés de las Ardenas — la foto que le dejaste guardar. Una mujer joven, un niño. Esperas que haya llegado a verlos.`,
    },
    {
      flag: "ayudo_anciano",
      text: `\nEl anciano del brazalete amarillo. La madre rusa. Nadezhda. Hay una línea que conecta esos gestos, aunque no tuvieras palabras para ella cuando los hacías.`,
    },
  ],

  ending_tragedia: [
    {
      flag: "miro_para_otro_lado",
      text: `\nEl anciano del brazalete amarillo en el campo de entrenamiento. Los disparos en el pueblo soviético. La puerta de Nadezhda. Una línea recta entre tres momentos en que miraste para otro lado. No lo ves así — nadie se ve así a sí mismo. Pero la línea existe.`,
    },
    {
      flag: "enterro_sentimientos",
      text: `\nEnterraste todo lo que no podías procesar. Era la única forma de seguir funcionando. El problema es que lo que entierras sin procesar crece en la oscuridad — lo dijiste tú mismo, o lo pensaste. Ahora lo sabes de verdad.`,
    },
  ],

  ending_sacrificio: [
    {
      flag: "confio_en_werner",
      text: `\nWerner fue el primero al que le contaste lo que sentías de verdad — en los cuarteles, aquella noche después del brazalete amarillo. Él nunca lo olvidó. Y tú no le abandonaste en la nieve.`,
    },
    {
      flag: "cree_que_puede",
      text: `\nLe dijiste a Werner que sí se podía hacer esto sin perder algo que no se recupera. Que requería saber exactamente quién eras. Esta noche, cargándole sobre los hombros, sabes quién eres.`,
    },
  ],
};

// ──────────────────────────────────────────────
// FUNCIÓN PRINCIPAL: construir narrativa con inyecciones
// ──────────────────────────────────────────────
export function buildNarrative(scene, narrativeFlags) {
  const injections = (SCENE_INJECTIONS[scene.id] || [])
    .filter(({ flag }) => narrativeFlags[flag])
    .map(({ text }) => text)
    .join("");

  if (!injections) return scene.narrative;

  // Si la escena tiene marcador de posición, inyectar ahí
  if (scene.narrative.includes("{{inject}}")) {
    return scene.narrative.replace("{{inject}}", injections);
  }

  // Fallback: añadir al final
  return scene.narrative + injections;
}
