// Sistema de memoria narrativa
// Define qué elecciones generan flags y qué texto extra inyectan en escenas posteriores

// Qué flag activa cada choice ID
export const CHOICE_FLAGS = {
  promise_human:       "prometio_no_monstruo",
  promise_survive:     "prometio_volver",
  read_letter_now:     "leyo_carta_tren",
  intervene_quietly:   "ayudo_anciano",
  tell_werner:         "confio_en_werner",
  ask_father:          "escucho_al_padre",
  confess_werner:      "confeso_a_werner",
};

// Texto adicional inyectado al final de la narrativa de una escena si el flag está activo
// Cada entrada: { flag, text }
// Se puede tener múltiples inyecciones por escena; se añaden las que apliquen.
export const SCENE_INJECTIONS = {

  atrocity_crossroads: [
    {
      flag: "prometio_no_monstruo",
      text: `\nLas palabras que le dijiste a tu padre en la carpintería llevan semanas sin salir de tu cabeza: "No me convertiré en un monstruo." Las dijiste en serio. Ahora, parado delante de esto, descubres lo que cuestan.`,
    },
    {
      flag: "ayudo_anciano",
      text: `\nYa lo hiciste una vez — en los cuarteles, con el anciano del brazalete amarillo. Entonces también había razones para no hacerlo. Las ignoraste. Tus manos lo recuerdan aunque tu mente quisiera olvidarlo.`,
    },
    {
      flag: "escucho_al_padre",
      text: `\nTu padre te dijo que había una sola cosa que sí podías evitar. No convertirte en algo que no eres. Lo ves ahora frente a ti, esa línea exacta.`,
    },
  ],

  stalingrad_siege: [
    {
      flag: "leyo_carta_tren",
      text: `\nEn el bolsillo interior llevas todavía las dos cartas de tu madre. La primera, ya leída, la has releído tantas veces que el papel está suave en los pliegues. "Recuerda que antes de ser soldado eres mi hijo." En un sótano de Stalingrado, con setenta y cinco gramos de pan negro al día, esa frase suena a otro mundo. Pero también es lo único que suena a algo real.`,
    },
  ],

  watch_aftermath: [
    {
      flag: "ayudo_anciano",
      text: `\nPiensas en el anciano del brazalete amarillo. Entonces actuaste. Esta vez no. La diferencia entre los dos momentos te resulta imposible de articular — y eso, de alguna forma, lo hace peor.`,
    },
  ],

  france_village: [
    {
      flag: "ayudo_anciano",
      text: `\nHas aprendido que la duda tiene un coste. En los cuarteles tardaste, pero al final actuaste. Eso lo llevas contigo, aunque pese.`,
    },
  ],

  after_battle_reflection: [
    {
      flag: "confio_en_werner",
      text: `\nWerner ya sabe más de ti de lo que sabe nadie en este ejército. Eso, descubres, es una forma extraña de no estar solo.`,
    },
    {
      flag: "prometio_no_monstruo",
      text: `\nWerner pregunta si hay forma de hacer esto sin perder algo que no se recupera. No respondes enseguida. Estás pensando en una promesa que hiciste en una carpintería que ahora parece estar en otro planeta.`,
    },
  ],
};
