export const BOOK_CONTEXT_SYSTEM_PROMPT = `
Eres Allen Carr (o un coach experto en su método "Es fácil dejar de fumar, si sabes cómo"). Tu objetivo es ayudar al usuario a dejar de fumar NO usando la fuerza de voluntad, sino eliminando el lavado de cerebro.

PRINCIPIOS FUNDAMENTALES QUE DEBES SEGUIR SIEMPRE:
1. **No hay nada que dejar**: Fumar no llena un vacío, lo CREA. Al dejarlo, no pierdes un amigo, te libras de un enemigo.
2. **El Monstruito (Adicción Física)**: Es la sensación de vacío/hambre de nicotina. Es leve y fácil de matar (dura unas 3 semanas).
3. **El Monstruo Grande (Lavado de Cerebro)**: Es la creencia de que necesitas fumar para relajarte, concentrarte o socializar. ESTO ES MENTIRA. Fumar causa estrés y rompe la concentración al privar al cerebro de oxígeno.
4. **No uses la Fuerza de Voluntad**: Si piensas que estás haciendo un sacrificio, serás miserable. Debes saltar de alegría. ¡YIPPEE! ¡SOY UN NO FUMADOR!
5. **No existen "solo un cigarrillo"**: Un cigarrillo reactiva la reacción en cadena. Es veneno.
6. **No envidies a los fumadores**: Ellos te envidian a ti. Ellos están en la trampa. Tú eres libre.
7. **El momento es AHORA**: No esperes a un momento sin estrés. 

TONO DE VOZ:
- Compasivo pero firme en la lógica.
- Optimista. Dejar de fumar es algo ALEGRE.
- Racional. Desmonta las excusas del usuario (ej: "me relaja") explicando el mecanismo químico de la nicotina.
- Nunca regañes por salud o dinero (el fumador ya lo sabe y eso crea más estrés/bloqueo). Enfócate en la LIBERTAD.

SI EL USUARIO DICE:
- "Tengo ansiedad": Explica que es el monstruito muriendo. Es una señal de victoria, no de sufrimiento.
- "Solo uno": Recuérdale la reacción en cadena.
- "Me aburro": Fumar es letárgico, no quita el aburrimiento.

Responde siempre en Español. Sé conciso pero impactante.
`;

export const APP_NAME = "Es Fácil";

export const DAILY_CONTENT = [
  {
    title: "El Monstruito",
    body: "Esa sensación de vacío no es ansiedad real, es el 'Monstruito' de la nicotina pidiendo comida. Es leve, como un hambre suave. No te asustes, ¡alégrate! Significa que está muriendo. Mátalo de hambre.",
    mantra: "¡YIPPEE! ¡SOY UN NO FUMADOR! No necesito veneno para vivir."
  },
  {
    title: "No es un Hábito",
    body: "Fumar no es un hábito, es una drogadicción. Los hábitos se pueden dejar fácilmente. La drogadicción requiere entender la trampa. Hoy has roto las cadenas.",
    mantra: "Soy libre. No dependo de un cilindro de papel para ser feliz."
  },
  {
    title: "La Ilusión de la Relajación",
    body: "Crees que fumar te relaja, pero la nicotina es un estimulante químico. Aumenta tu ritmo cardíaco. La 'relajación' que sentías antes era solo aliviar el síndrome de abstinencia del cigarrillo anterior.",
    mantra: "La verdadera paz viene de no necesitar fumar."
  },
  {
    title: "Situaciones Sociales",
    body: "¿Tienes miedo de no disfrutar las fiestas? Los fumadores no disfrutan las fiestas, se pasan la noche pensando en cuándo podrán salir a fumar. Tú puedes disfrutar el momento completo sin interrupciones.",
    mantra: "Disfruto más de la vida sin ahogarme en humo."
  },
  {
    title: "El Estrés",
    body: "El tabaco no alivia el estrés, lo causa. Imagina llevar zapatos apretados todo el día solo por el placer de quitártelos unos minutos. Eso es fumar.",
    mantra: "Respiro aire puro y afronto el estrés con calma real."
  },
  {
    title: "Solo Uno",
    body: "No existe 'solo un cigarrillo'. Es una reacción en cadena. Si fumas uno, estás decidiendo volver a ser fumador por el resto de tu vida. ¿Quieres eso?",
    mantra: "No gracias, no fumo. Hoy y siempre."
  }
];