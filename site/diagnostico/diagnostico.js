/* Diagnóstico de fallas de impresión FDM — datos y render.
   Las causas se ordenan de más a menos probable dentro de cada síntoma. Criterios basados en las guías de Ellis, Prusa y Teaching Tech.
   Cada causa apunta al paso de la guía de calibración que la resuelve. */
const GRUPOS = [
  ["todos", "Todos"],
  ["primera", "Primera capa"],
  ["extrusion", "Extrusión"],
  ["superficie", "Superficie"],
  ["estructura", "Estructura y medidas"],
];

/* Causas: t título · p qué pasa · c cómo confirmarlo · s qué hacer · cal paso de calibración · n nivel (1 rápido, 2 ajuste, 3 hardware) */
const CAUSAS = {
  "filamento-humedo": { t: "Filamento húmedo", n: 1, cal: "secado",
    p: "El agua absorbida hierve en la boquilla y forma burbujas: hilos, granos y superficie áspera.",
    c: "Chasquidos o burbujas al extruir, vapor, superficie mate y áspera. Prueba con un carrete nuevo o recién secado.",
    s: ["Seca el filamento con la temperatura y tiempo de su ficha técnica.", "Guárdalo en caja con desecante.", "Repite la impresión de prueba antes de tocar otros ajustes."] },
  "cama-sucia": { t: "Superficie de impresión sucia o con grasa", n: 1, cal: "primera-capa",
    p: "Grasa de los dedos o restos de adhesivo impiden que el plástico se pegue.",
    c: "Prueba a limpiar la cama y repetir: si mejora, era esto.",
    s: ["Lava la placa con agua tibia y jabón, o límpiala con alcohol isopropílico.", "No la toques con los dedos después.", "Si es PEI texturizado, el jabón suele funcionar mejor que el alcohol."] },
  "z-offset-alto": { t: "Z offset muy alto (boquilla lejos de la cama)", n: 2, cal: "primera-capa",
    p: "El filamento cae sobre la cama sin aplastarse; se pega poco y deja huecos entre líneas.",
    c: "Líneas redondas y separadas, se ve luz entre ellas.",
    s: ["Baja el Z offset en pasos pequeños mientras imprimes la primera capa (babystepping).", "Usa el modelo de parches de primera capa para verlo en toda la cama."] },
  "z-offset-bajo": { t: "Z offset muy bajo (boquilla muy cerca)", n: 2, cal: "primera-capa",
    p: "La boquilla aplasta demasiado el filamento: ondas, líneas fundidas y pata de elefante.",
    c: "Primera capa ondulada, rayada por la boquilla o con bordes inflados.",
    s: ["Sube el Z offset en pasos pequeños mientras imprimes.", "Comprueba también que la cama no esté demasiado caliente."] },
  "cama-nonivelada": { t: "Cama sin nivelar o malla mal hecha", n: 2, cal: "primera-capa",
    p: "La distancia a la boquilla cambia de una zona a otra: buena adhesión en un lado y mala en otro.",
    c: "Primera capa buena en una parte de la cama y mala en otra, siempre en el mismo lugar.",
    s: ["Nivela la cama o repite la malla con la cama y el hotend calientes y estables.", "Si no se corrige, revisa si la cama está deformada o tiene tornillos flojos.", "Imprime parches en esquinas y centro para comprobar."] },
  "temp-cama-baja": { t: "Temperatura de cama insuficiente", n: 1, cal: null,
    p: "La primera capa se enfría demasiado rápido y no se adhiere ni se relaja.",
    c: "La pieza se despega con facilidad al inicio o cuando la impresión avanza.",
    s: ["Sube la cama de 5 en 5 °C dentro del rango del material (consulta el catálogo de materiales).", "Deja que la cama se estabilice antes de empezar."] },
  "cama-caliente": { t: "Cama demasiado caliente", n: 1, cal: null,
    p: "Las primeras capas se mantienen blandas y se abultan bajo el peso de la pieza.",
    c: "El borde inferior sobresale de la pieza y desaparece por encima de unas capas.",
    s: ["Baja la temperatura de cama de 5 en 5 °C.", "Activa la compensación de pata de elefante del laminador como último ajuste."] },
  "primera-capa-rapida": { t: "Primera capa demasiado rápida", n: 1, cal: null,
    p: "El plástico no tiene tiempo de adherirse ni de aplastarse bien.",
    c: "Adhesión irregular que mejora al bajar la velocidad.",
    s: ["Imprime la primera capa entre 20 y 30 mm/s.", "Mantén el ventilador de capa apagado en las primeras capas."] },
  "adherencia-excesiva": { t: "Adherencia excesiva a la cama", n: 1, cal: null,
    p: "El plástico se funde con la placa: la pieza no se suelta o arranca trozos de superficie.",
    c: "Ocurre sobre todo con PETG en PEI liso.",
    s: ["Aplica una capa de pegamento en barra como separador.", "Baja la temperatura de cama y deja enfriar del todo antes de retirar.", "Usa una superficie texturizada o específica para ese material."] },
  "temp-boquilla-baja": { t: "Temperatura de boquilla baja", n: 2, cal: "temp",
    p: "El plástico sale poco fluido: mala unión entre capas, huecos y riesgo de chasquidos.",
    c: "Capas que se separan con facilidad, superficie mate, extrusor que salta.",
    s: ["Sube la temperatura de 5 en 5 °C.", "Haz una torre de temperatura para encontrar el punto óptimo de ese filamento."] },
  "temp-boquilla-alta": { t: "Temperatura de boquilla alta", n: 2, cal: "temp",
    p: "El plástico está demasiado fluido: gotea, hace hilos, se derrama en voladizos y pierde detalle.",
    c: "Hilos y goteo, puentes caídos, brillo excesivo y detalles derretidos.",
    s: ["Baja la temperatura de 5 en 5 °C.", "Haz una torre de temperatura para encontrar el punto óptimo de ese filamento."] },
  "retraccion-mal": { t: "Retracción insuficiente", n: 2, cal: "retraccion",
    p: "El filamento sigue saliendo por la boquilla mientras viaja entre partes, dejando hilos y granos.",
    c: "Hilos finos entre columnas o partes separadas, gotas al inicio de líneas.",
    s: ["Activa retracción si estaba apagada.", "Sube la distancia de a poco (0.2 mm) o usa la torre de retracción.", "Revisa temperatura y humedad antes: influyen mucho."] },
  "retraccion-excesiva": { t: "Retracción excesiva o muy rápida", n: 2, cal: "retraccion",
    p: "Demasiada retracción arrastra plástico fundido hacia la zona fría y puede atascar el hotend.",
    c: "Atascos tras muchas retracciones, el extrusor muele el filamento o hay huecos después de viajes.",
    s: ["Reduce la distancia y la velocidad de retracción.", "Usa la torre de retracción y toma la distancia más corta que dé un resultado limpio."] },
  "viajes-largos": { t: "Viajes largos sobre espacios abiertos", n: 1, cal: null,
    p: "Cada viaje largo es una oportunidad para dejar hilos.",
    c: "Los hilos aparecen entre piezas o zonas separadas.",
    s: ["Activa “evitar cruzar paredes” (avoid crossing perimeters) o combing.", "Reduce viajes: imprime piezas separadas en objetos distintos o cambia su orientación."] },
  "pa-mal": { t: "Pressure advance mal calibrado", n: 2, cal: "pa",
    p: "La presión en la boquilla no se compensa: esquinas abultadas y huecos después de ellas.",
    c: "Bulto en las esquinas y huecos al terminarlas, costuras marcadas, variaciones de grosor tras aceleraciones.",
    s: ["Calibra pressure advance por filamento, con la aceleración que usarás.", "Elige el valor donde las esquinas se ven parejas."] },
  "flujo-alto": { t: "Flujo demasiado alto", n: 2, cal: "flow",
    p: "Sale más plástico del que el laminador calcula: rugosidad, piezas grandes y agujeros pequeños.",
    c: "Superficie superior rugosa, líneas que se aprietan entre sí, medidas mayores a las del modelo.",
    s: ["Calibra el flujo con el método de dos pasadas de Orca o con los cubos de Ellis.", "Antes, verifica el E-steps para que no compenses un error del extrusor."] },
  "flujo-bajo": { t: "Flujo demasiado bajo", n: 2, cal: "flow",
    p: "Sale menos plástico del necesario: huecos, paredes débiles y superficies con valles.",
    c: "Líneas visibles con huecos entre ellas, capas superiores con grietas, paredes que se pueden despegar.",
    s: ["Calibra el flujo con el método de dos pasadas de Orca o con los cubos de Ellis.", "Verifica antes el E-steps y que no haya obstrucciones."] },
  "flujo-vol-limite": { t: "Velocidad superior al flujo máximo del hotend", n: 2, cal: "flujo-vol",
    p: "El hotend no funde tan rápido como se le pide y extruye de menos.",
    c: "El problema aparece en zonas grandes, rellenos o velocidades altas y desaparece al imprimir más lento.",
    s: ["Baja la velocidad o limita el flujo volumétrico máximo en el perfil del filamento.", "Determina el límite real con la torre de flujo volumétrico.", "Sube la temperatura unos grados si el material lo permite."] },
  "esteps": { t: "E-steps o rotation distance incorrectos", n: 2, cal: "esteps",
    p: "El extrusor empuja más o menos filamento del que se le pide.",
    c: "Al pedir 100 mm de filamento, sale una longitud distinta.",
    s: ["Mide y corrige el E-steps siguiendo el paso de calibración del extrusor.", "Hazlo antes de calibrar flujo y pressure advance."] },
  "boquilla-parcial": { t: "Boquilla parcialmente obstruida o desgastada", n: 2, cal: null,
    p: "El paso de plástico se reduce: extrusión débil e irregular, o desviada.",
    c: "Extrusión que sale torcida, ruido de extrusor, problema que empieza de golpe y no mejora con temperatura.",
    s: ["Haz una carga en frío (cold pull) o limpia con la aguja adecuada.", "Cambia la boquilla si tiene desgaste, sobre todo tras imprimir filamentos con fibras.", "Si es de latón y usas fibra de carbono o vidrio, pasa a una de acero endurecido."] },
  "heat-creep": { t: "Heat creep: el calor sube y ablanda el filamento arriba", n: 3, cal: null,
    p: "El filamento se ablanda antes de llegar a la zona caliente y se atasca.",
    c: "Atascos a mitad de impresión en PLA, sobre todo con la cámara caliente o con retracciones largas.",
    s: ["Confirma que el ventilador del disipador gira y no está tapado.", "Baja la temperatura y la retracción.", "Imprime con puertas abiertas si usas PLA en una cámara cerrada."] },
  "extrusor-tension": { t: "Tensión o engranaje del extrusor", n: 2, cal: null,
    p: "Poco agarre: el engranaje patina. Demasiado: aplasta el filamento.",
    c: "El engranaje muele el filamento y deja polvo, el filamento marca dientes, el motor salta.",
    s: ["Ajusta la tensión del resorte: lo suficiente para empujar sin marcar.", "Limpia el polvo de plástico del engranaje.", "Revisa que el filamento no esté enredado en el carrete."] },
  "trayecto-filamento": { t: "Trayecto del filamento con fricción o enredado", n: 2, cal: null,
    p: "El carrete o el tubo ofrecen resistencia y el extrusor no consigue empujar.",
    c: "El carrete gira con dificultad, hay vueltas cruzadas, o el tubo PTFE está doblado o mal asentado.",
    s: ["Gira el carrete a mano: debe soltar filamento sin esfuerzo.", "Revisa el tubo PTFE: cortado recto, bien asentado y sin dobleces.", "Usa un soporte de carrete con rodamientos si el carrete pesa mucho."] },
  "costura": { t: "Ajuste de la costura (seam)", n: 1, cal: "pa",
    p: "El inicio y final de cada perímetro dejan un bulto o una línea visible.",
    c: "Los granos se alinean verticalmente en un solo lugar de la pieza.",
    s: ["Cambia la posición de costura (alineada, trasera, en esquinas cóncavas).", "Activa wipe en la costura y revisa pressure advance."] },
  "solape-relleno": { t: "Solape de relleno y perímetros", n: 1, cal: null,
    p: "El relleno se superpone con las paredes de más o de menos.",
    c: "Bultos donde el relleno toca las paredes; o paredes separadas del relleno.",
    s: ["Ajusta el porcentaje de solape (infill/perimeter overlap): ~15–25 % suele funcionar.", "Revisa el flujo antes: puede ser la causa real."] },
  "enfriamiento-poco": { t: "Enfriamiento insuficiente", n: 2, cal: "enfriamiento",
    p: "El plástico no solidifica a tiempo: voladizos y puentes caídos, bordes enrollados y detalles derretidos.",
    c: "Los voladizos mejoran al subir el ventilador; los detalles pequeños se ven más derretidos que los grandes.",
    s: ["Sube la velocidad del ventilador de capa (PLA, y PETG hasta cierto punto).", "Baja la temperatura de boquilla.", "Aumenta el tiempo mínimo por capa en piezas pequeñas."] },
  "enfriamiento-excesivo": { t: "Enfriamiento excesivo", n: 2, cal: "enfriamiento",
    p: "El plástico se enfría tan rápido que las capas no se unen, o se contrae y se despega de la cama.",
    c: "Capas separadas, grietas verticales, esquinas que se levantan; más común en ABS, ASA, PC y nailon.",
    s: ["Baja o apaga el ventilador de capa en materiales de alta contracción.", "Cierra la cámara o corrige las corrientes de aire."] },
  "tiempo-capa": { t: "Capas demasiado rápidas en piezas pequeñas", n: 1, cal: "enfriamiento",
    p: "Cada capa se apoya en la anterior antes de solidificar.",
    c: "Las puntas y detalles pequeños se derriten mientras el resto sale bien.",
    s: ["Aumenta el tiempo mínimo por capa.", "Imprime dos piezas a la vez para dar tiempo entre capas."] },
  "corriente-aire": { t: "Corrientes de aire o cámara inadecuada", n: 1, cal: null,
    p: "El aire enfría la pieza de forma desigual y provoca contracción.",
    c: "Warping y grietas en materiales de alta contracción, sobre todo si hay ventanas, puertas o ventiladores cerca.",
    s: ["Usa cámara cerrada para ABS, ASA, PC y nailon.", "Aleja la impresora de ventanas y corrientes.", "Precalienta la cámara o deja que la cama caliente la temple."] },
  "brim-orient": { t: "Poca superficie de contacto con la cama", n: 1, cal: null,
    p: "Las piezas con base pequeña o esquinas afiladas tienen poca fuerza de adhesión.",
    c: "Se levantan primero las esquinas y las zonas más alejadas del centro.",
    s: ["Añade brim de 5–8 mm o “orejas de ratón” en las esquinas.", "Cambia la orientación para tener más base plana."] },
  "camara-caliente": { t: "Cámara demasiado caliente para el material", n: 1, cal: null,
    p: "El PLA se ablanda con temperaturas de cámara moderadas y se deforma.",
    c: "Ocurre con la puerta cerrada y la impresora en un lugar caluroso.",
    s: ["Abre la puerta o la tapa superior al imprimir PLA.", "Aumenta el enfriamiento de capa."] },
  "choque-boquilla": { t: "La boquilla choca con la pieza", n: 2, cal: null,
    p: "La boquilla empuja partes levantadas y desplaza o arranca la pieza.",
    c: "Ruidos de golpe durante los viajes, rayas o restos en la superficie.",
    s: ["Activa Z hop al retraer, o evita cruzar paredes.", "Resuelve la causa de la esquina levantada (flujo, enfriamiento, adhesión)."] },
  "aceleracion-alta": { t: "Aceleración o jerk demasiado altos", n: 2, cal: "aceleracion",
    p: "Los cambios bruscos de velocidad hacen vibrar la estructura y dejan ondas en la pieza.",
    c: "Ondas junto a bordes y letras, que mejoran al bajar aceleración.",
    s: ["Baja la aceleración de paredes externas.", "Calibra con la torre de aceleración de Teaching Tech o las pruebas de Orca (cornering)."] },
  "input-shaping": { t: "Input shaping ausente o mal configurado", n: 3, cal: "aceleracion",
    p: "Sin compensar la resonancia, cada cambio de velocidad hace vibrar el cabezal.",
    c: "Ringing regular, con distancia constante entre ondas.",
    s: ["Activa y calibra input shaping en firmware (Klipper, Marlin reciente o Bambu automático).", "Calibra la aceleración después."] },
  "vibracion-mecanica": { t: "Vibraciones y piezas flojas", n: 2, cal: "mecanica",
    p: "Componentes flojos o superficie inestable amplifican las vibraciones.",
    c: "Ondas que mejoran si apoyas la impresora sobre una base firme o si apretas tornillos.",
    s: ["Apoya la impresora sobre una base rígida y pesada, con amortiguadores.", "Aprieta el cabezal, el hotend, los ventiladores y la fijación de la cama.", "Revisa el balance de los ventiladores."] },
  "correas": { t: "Correas flojas o desiguales", n: 3, cal: "mecanica",
    p: "Una correa floja permite que el cabezal se retrase o salte dientes.",
    c: "Layer shift en un eje, ondas en un solo eje, piezas que no son cuadradas.",
    s: ["Tensa las correas por igual: deben sonar parecido al pulsarlas.", "Revisa que no haya dientes gastados ni poleas desalineadas."] },
  "polea-floja": { t: "Poleas o acoples sueltos", n: 3, cal: "mecanica",
    p: "Si la polea gira sobre el eje del motor, el cabezal pierde posición sin que el firmware se entere.",
    c: "Desplazamiento súbito de capas en un solo eje; la polea tiene juego respecto al eje.",
    s: ["Aprieta los prisioneros de las poleas sobre la parte plana del eje.", "Aplica fijador de roscas (media resistencia) si se aflojan seguido."] },
  "motor-corriente": { t: "Corriente de motores insuficiente o driver sobrecalentado", n: 3, cal: "mecanica",
    p: "El motor pierde pasos cuando el driver limita corriente o se apaga por temperatura.",
    c: "Layer shift al acelerar o tras mucho tiempo imprimiendo; los motores o drivers están muy calientes.",
    s: ["Revisa la corriente configurada de los drivers y la ventilación de la electrónica.", "Baja aceleración y velocidad para confirmar la causa."] },
  "friccion-eje": { t: "Fricción o atasco en un eje", n: 3, cal: "mecanica",
    p: "Si el eje ofrece resistencia, el motor puede perder pasos.",
    c: "Al mover el eje a mano se siente irregular o duro en algún punto.",
    s: ["Limpia y lubrica varillas, rieles y rodamientos.", "Revisa que ningún cable o pieza roce con el recorrido."] },
  "z-varillas": { t: "Varilla Z torcida o acoples desalineados (Z wobble)", n: 3, cal: "mecanica",
    p: "El eje Z se mueve con un pequeño balanceo que se repite en cada vuelta del husillo.",
    c: "Bandas horizontales regulares, con un espaciado constante.",
    s: ["Revisa que el husillo esté recto y los acoples bien alineados.", "Suelta y vuelve a apretar los soportes con el eje centrado.", "Lubrica el husillo y las guías."] },
  "z-altura-capa": { t: "Altura de capa que no coincide con los pasos del eje Z", n: 1, cal: null,
    p: "Si la altura de capa no es múltiplo del paso completo del motor Z, algunas capas salen distintas.",
    c: "Bandas regulares que mejoran al cambiar la altura de capa.",
    s: ["Calcula el paso completo del husillo (avance ÷ pasos por vuelta; por ejemplo 0.04 mm en un T8 de 8 mm de avance).", "Usa alturas de capa que sean múltiplos de ese valor."] },
  "temp-inconsistente": { t: "Temperatura inestable", n: 2, cal: "pid",
    p: "Si la temperatura oscila, el plástico se extruye con distinta fluidez según la capa.",
    c: "Bandas de brillo o grosor alternando, sobre todo con ventilador de capa; la temperatura oscila en pantalla.",
    s: ["Ejecuta el PID de hotend y cama.", "Revisa la conexión del termistor y el calentador."] },
  "filamento-irregular": { t: "Filamento de diámetro irregular", n: 1, cal: null,
    p: "El diámetro cambia y, con él, la cantidad de plástico que sale.",
    c: "Variaciones de grosor que no son regulares; al medir con calibrador el diámetro varía.",
    s: ["Mide el diámetro en varios puntos con calibrador (debería ser estable).", "Cambia de marca si es muy irregular."] },
  "vfa-motor": { t: "Motores paso a paso y velocidad de paredes (VFA)", n: 2, cal: "aceleracion",
    p: "A ciertas velocidades, la vibración del motor deja líneas verticales finas y regulares en las paredes.",
    c: "Líneas verticales finas y repetidas que cambian o desaparecen al variar la velocidad de paredes externas.",
    s: ["Prueba distintas velocidades en paredes externas; suele haber velocidades “buenas” y “malas”.", "Usa la prueba VFA de Orca para encontrarlas.", "Revisa tensión de correas y microstepping en firmware."] },
  "capas-superiores-pocas": { t: "Pocas capas superiores o relleno muy bajo", n: 1, cal: null,
    p: "Sobre un relleno poco denso, el techo se hunde y se ven las líneas del relleno.",
    c: "Se ven patrones del relleno a través del techo, o huecos en el techo.",
    s: ["Sube las capas superiores (por ejemplo 5 o 6 con capa de 0.2 mm).", "Sube el relleno o usa un patrón más denso en la zona superior.", "Mejora el enfriamiento en la capa superior."] },
  "soportes-mal": { t: "Soportes mal configurados u orientación desfavorable", n: 1, cal: null,
    p: "Sin soportes o con orientación difícil, los voladizos largos no se sostienen.",
    c: "El fallo empieza siempre en el mismo voladizo.",
    s: ["Gira la pieza para reducir voladizos.", "Activa soportes de árbol o normales según la pieza.", "Mejora el enfriamiento y baja la temperatura."] },
  "contraccion": { t: "Contracción del material", n: 2, cal: "escala",
    p: "El plástico se contrae al enfriarse; el resultado es más pequeño que el modelo.",
    c: "Todas las piezas salen más pequeñas por un porcentaje constante, más en ABS, ASA y nailon.",
    s: ["Mide un cubo de calibración y aplica compensación de escala por material.", "Recuerda que la compensación es por material y no por impresora."] },
  "steps-xy-mal": { t: "Pasos de ejes mal configurados", n: 2, cal: "escala",
    p: "Los ejes se desplazan más o menos que lo indicado.",
    c: "El mismo error porcentual en todos los materiales.",
    s: ["Mide un cubo de 20 mm y compara cada eje con el calibrador.", "Ajusta los pasos por mm o la rotation distance en firmware."] },
  "escuadra": { t: "Ejes no escuadrados", n: 3, cal: "mecanica",
    p: "Los ejes no forman un ángulo recto: los cuadrados salen como paralelogramos.",
    c: "Al medir las diagonales de una pieza cuadrada, son distintas.",
    s: ["Escuadra el gantry y verifica correas y marcos.", "Usa Califlower o un cuadrado grande para medir el sesgo."] },
  "diseno-holgura": { t: "Holgura de diseño insuficiente", n: 1, cal: "tolerancia",
    p: "Las piezas se ensamblan sin margen: la impresora no reproduce dimensiones exactas.",
    c: "Piezas que se ajustan bien en el CAD pero no en la realidad; agujeros ligeramente menores.",
    s: ["Añade holgura al diseño (décimas de milímetro) según el ajuste que busques.", "Imprime la prueba de tolerancia para encontrar tu valor."] },
};

const NIVELES = { 1: ["Rápido", "ok"], 2: ["Ajuste", "info"], 3: ["Hardware", "warn"] };

/* Síntomas. Árbol: cada nodo tiene q (pregunta) y o (opciones). Una opción es [texto, destino]:
   destino = "clave" (siguiente nodo), "sint:id" (otro síntoma) o array de ids de causa (resultado, de más a menos probable). */
const SINTOMAS = [
  { id: "no-adhiere", g: "primera", n: "No se pega a la cama", v: "La pieza se despega o el filamento se arrastra en la primera capa.",
    a: { start: { q: "¿Cuándo se despega la pieza?", o: [
      ["Desde la primera capa: el filamento se arrastra o no queda pegado", "capa"],
      ["Empieza bien y se levanta después, en las esquinas", "sint:warping"],
      ["Se pega demasiado y no puedo retirarla", ["adherencia-excesiva", "z-offset-bajo", "cama-caliente"]],
    ] }, capa: { q: "¿Cómo se ve el filamento sobre la cama?", o: [
      ["Redondo, como espagueti, sin aplastar", ["z-offset-alto", "cama-nonivelada", "cama-sucia", "primera-capa-rapida"]],
      ["Aplastado, pero se despega con facilidad", ["cama-sucia", "temp-cama-baja", "primera-capa-rapida"]],
      ["Se pega en algunas zonas y en otras no", ["cama-nonivelada", "cama-sucia", "z-offset-alto"]],
    ] } } },
  { id: "primera-irregular", g: "primera", n: "Primera capa irregular", v: "Huecos, ondas o rayas en la primera capa.",
    a: { start: { q: "¿Cómo son las líneas de la primera capa?", o: [
      ["Hay huecos entre líneas y se ve luz", ["z-offset-alto", "flujo-bajo", "cama-nonivelada", "boquilla-parcial"]],
      ["Superficie ondulada, arrugada o líneas fundidas", ["z-offset-bajo", "flujo-alto", "cama-caliente"]],
      ["Buena en un lado y mala en otro", ["cama-nonivelada", "escuadra"]],
      ["Rayas o huecos en zonas al azar", ["boquilla-parcial", "filamento-humedo", "extrusor-tension"]],
    ] } } },
  { id: "elephant-foot", g: "primera", n: "Pata de elefante", v: "Las primeras capas se abultan hacia afuera en la base de la pieza.",
    a: { start: { q: "La base ensancha por unas pocas capas.", o: [
      ["Es lo que veo", ["z-offset-bajo", "cama-caliente", "primera-capa-rapida"]],
    ] } } },
  { id: "warping", g: "primera", n: "Esquinas levantadas", v: "La pieza se curva y las esquinas se despegan de la cama.",
    a: { start: { q: "¿Qué material imprimes?", o: [
      ["PLA o PETG", ["cama-sucia", "temp-cama-baja", "brim-orient", "corriente-aire"]],
      ["ABS, ASA, PC o nailon", ["corriente-aire", "enfriamiento-excesivo", "temp-cama-baja", "brim-orient", "cama-sucia"]],
    ] } } },
  { id: "sub-extrusion", g: "extrusion", n: "Falta de material", v: "Capas delgadas, huecos entre líneas o paredes débiles.",
    a: { start: { q: "¿Cuándo aparece el problema?", o: [
      ["Hay chasquidos o el extrusor salta hacia atrás", ["boquilla-parcial", "heat-creep", "extrusor-tension", "temp-boquilla-baja", "flujo-vol-limite"]],
      ["Solo a velocidades altas o en rellenos", ["flujo-vol-limite", "temp-boquilla-baja", "flujo-bajo"]],
      ["Huecos después de esquinas o costuras", ["pa-mal", "flujo-bajo"]],
      ["Desde el inicio y en toda la pieza", ["esteps", "flujo-bajo", "boquilla-parcial", "filamento-humedo", "trayecto-filamento"]],
      ["Empeora con el tiempo hasta que no sale nada", ["heat-creep", "boquilla-parcial", "trayecto-filamento", "extrusor-tension"]],
    ] } } },
  { id: "sobre-extrusion", g: "extrusion", n: "Exceso de material", v: "Bultos, superficie rugosa o medidas mayores de lo esperado.",
    a: { start: { q: "¿Dónde se ve?", o: [
      ["Bultos en esquinas o al inicio de paredes", ["pa-mal", "costura"]],
      ["En toda la superficie; los agujeros salen pequeños", ["flujo-alto", "esteps", "temp-boquilla-alta"]],
      ["Solo en rellenos pequeños o zonas estrechas", ["flujo-alto", "solape-relleno"]],
    ] } } },
  { id: "stringing", g: "extrusion", n: "Hilos (stringing)", v: "Hilos finos entre partes de la pieza, como telarañas.",
    a: { start: { q: "¿Cómo está el filamento?", o: [
      ["Hay chasquidos, burbujas o lleva meses abierto", ["filamento-humedo", "temp-boquilla-alta"]],
      ["Está seco y es nuevo", ["retraccion-mal", "temp-boquilla-alta", "viajes-largos"]],
    ] } } },
  { id: "blobs", g: "extrusion", n: "Manchas y granos", v: "Granos, gotas o bultos sobre la superficie.",
    a: { start: { q: "¿Dónde aparecen?", o: [
      ["Alineados en una línea vertical (costura)", ["costura", "pa-mal", "retraccion-mal"]],
      ["Al azar, por toda la pieza", ["filamento-humedo", "temp-boquilla-alta", "retraccion-mal", "boquilla-parcial"]],
      ["Al inicio de capas o líneas tras un viaje largo", ["retraccion-mal", "pa-mal", "viajes-largos"]],
    ] } } },
  { id: "clog", g: "extrusion", n: "Obstrucción", v: "El filamento se atora, no sale, o el extrusor lo muele.",
    a: { start: { q: "¿Qué pasa exactamente?", o: [
      ["Se atora a mitad de la impresión", ["heat-creep", "boquilla-parcial", "trayecto-filamento", "retraccion-excesiva"]],
      ["No sale desde el arranque", ["boquilla-parcial", "extrusor-tension", "trayecto-filamento"]],
      ["El extrusor muele el filamento", ["extrusor-tension", "retraccion-excesiva", "boquilla-parcial", "flujo-vol-limite"]],
    ] } } },
  { id: "ringing", g: "superficie", n: "Ondas y fantasmas", v: "Ecos de bordes y letras en la superficie (ringing o ghosting).",
    a: { start: { q: "¿En qué ejes se ven?", o: [
      ["En ambos, junto a bordes y letras", ["aceleracion-alta", "input-shaping", "vibracion-mecanica", "correas"]],
      ["Solo en un eje", ["correas", "vibracion-mecanica", "friccion-eje"]],
    ] } } },
  { id: "vfa", g: "superficie", n: "Líneas verticales finas", v: "Líneas verticales finas y regulares en las paredes (VFA).",
    a: { start: { q: "Aparecen líneas finas verticales en paredes rectas.", o: [
      ["Es lo que veo", ["vfa-motor", "correas", "vibracion-mecanica"]],
    ] } } },
  { id: "z-banding", g: "superficie", n: "Bandas horizontales", v: "Franjas horizontales en la superficie de la pieza.",
    a: { start: { q: "¿Cómo son las bandas?", o: [
      ["Regulares, a espaciado constante", ["z-varillas", "z-altura-capa"]],
      ["Irregulares: capas más gruesas y delgadas alternando", ["extrusor-tension", "esteps", "temp-inconsistente", "filamento-irregular"]],
    ] } } },
  { id: "voladizos", g: "superficie", n: "Voladizos y puentes caídos", v: "Bordes enrollados o puentes que cuelgan.",
    a: { start: { q: "¿Qué se ve?", o: [
      ["Puentes caídos o colgando", ["enfriamiento-poco", "temp-boquilla-alta", "flujo-alto"]],
      ["Bordes enrollados hacia arriba en voladizos", ["enfriamiento-poco", "temp-boquilla-alta", "flujo-alto", "choque-boquilla", "camara-caliente"]],
      ["Piezas pequeñas que se derriten arriba", ["tiempo-capa", "enfriamiento-poco", "camara-caliente"]],
    ] } } },
  { id: "superior", g: "superficie", n: "Capas superiores malas", v: "Huecos, líneas visibles o aspereza en el techo de la pieza.",
    a: { start: { q: "¿Cómo se ve el techo?", o: [
      ["Se ven las líneas del relleno debajo", ["capas-superiores-pocas", "enfriamiento-poco", "flujo-bajo"]],
      ["Líneas separadas con huecos", ["flujo-bajo", "boquilla-parcial", "temp-boquilla-baja"]],
      ["Superficie áspera o arrugada", ["flujo-alto", "temp-boquilla-alta", "choque-boquilla"]],
    ] } } },
  { id: "layer-shift", g: "estructura", n: "Capas desplazadas", v: "Desde cierta altura, las capas se corren hacia un lado.",
    a: { start: { q: "¿Cómo se desplazan?", o: [
      ["En un solo eje", ["correas", "polea-floja", "motor-corriente", "friccion-eje"]],
      ["En X e Y a la vez, tras un golpe de la boquilla", ["choque-boquilla", "aceleracion-alta", "correas"]],
    ] } } },
  { id: "delaminacion", g: "estructura", n: "Capas separadas", v: "La pieza se parte entre capas o se agrieta.",
    a: { start: { q: "¿Qué material y cómo falla?", o: [
      ["Grietas verticales en ABS, ASA o PC", ["enfriamiento-excesivo", "corriente-aire", "temp-boquilla-baja"]],
      ["PLA o PETG: las capas no se unen", ["temp-boquilla-baja", "enfriamiento-excesivo", "filamento-humedo", "flujo-bajo"]],
      ["Solo las paredes se separan del relleno", ["solape-relleno", "flujo-bajo"]],
    ] } } },
  { id: "dimensiones", g: "estructura", n: "Medidas incorrectas", v: "La pieza no mide lo que debería o no encaja.",
    a: { start: { q: "¿Qué tipo de error ves?", o: [
      ["Todas las piezas salen más grandes o pequeñas en un % constante", ["contraccion", "steps-xy-mal", "flujo-alto"]],
      ["Agujeros pequeños o ajustes apretados", ["flujo-alto", "diseno-holgura", "contraccion"]],
      ["Los cuadrados no son cuadrados", ["escuadra", "correas"]],
    ] } } },
  { id: "espagueti", g: "estructura", n: "Se convierte en espagueti", v: "A mitad de impresión, la pieza se desarma en hilos.",
    a: { start: { q: "¿Qué pasó antes de que se estropeara?", o: [
      ["Ocurre al inicio, en las primeras capas", "sint:no-adhiere"],
      ["La pieza se despegó de la cama", ["cama-sucia", "temp-cama-baja", "brim-orient", "choque-boquilla"]],
      ["Se atoró el filamento o se acabó", ["heat-creep", "boquilla-parcial", "trayecto-filamento"]],
      ["Falló un voladizo o soporte", ["soportes-mal", "enfriamiento-poco"]],
    ] } } },
];

const $ = (s, el = document) => el.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const num = (s) => String(SINTOMAS.indexOf(s) + 1).padStart(2, "0");
const grupoNombre = (id) => GRUPOS.find((g) => g[0] === id)[1];

const estado = { g: "todos", q: "", sint: null, ruta: [], descartadas: new Set() };

function visibles() {
  const q = norm(estado.q.trim());
  return SINTOMAS.filter((s) => {
    if (estado.g !== "todos" && s.g !== estado.g) return false;
    return !q || norm([s.n, s.v, grupoNombre(s.g)].join(" ")).includes(q);
  });
}

function pintarFiltros() {
  $("#grupos").innerHTML = GRUPOS.map(([id, t]) => `<button type="button" class="pill" data-g="${id}" aria-pressed="${id === estado.g}">${t}</button>`).join("");
}

function pintarSintomas() {
  const v = visibles();
  $("#sintomas").innerHTML = v.length
    ? v.map((s) => `<button type="button" class="card sint-card" data-sint="${s.id}"><div class="head"><span class="chip">${num(s)}</span><span class="label estado">${esc(grupoNombre(s.g))}</span></div><h3>${esc(s.n)}</h3><p>${esc(s.v)}</p></button>`).join("")
    : `<p class="lead">Ningún síntoma coincide. Prueba con otra palabra o quita los filtros.</p>`;
  $("#resultado").innerHTML = `<span class="label">Mostrando</span> <b>${v.length}</b> <span class="sub">de ${SINTOMAS.length} síntomas</span>`;
}

/* Recorre el árbol con la ruta de respuestas (índices) y devuelve el nodo actual o el resultado. */
function recorrer(s, ruta) {
  let nodo = s.a.start;
  const pasos = [];
  for (const i of ruta) {
    const op = nodo.o[i];
    if (!op) break;
    pasos.push([nodo.q, op[0]]);
    const d = op[1];
    if (Array.isArray(d)) return { pasos, res: d };
    if (typeof d === "string" && d.startsWith("sint:")) return { pasos, salto: d.slice(5) };
    nodo = s.a[d];
  }
  return { pasos, nodo };
}

function causa(id, i) {
  const c = CAUSAS[id];
  const [nv, cl] = NIVELES[c.n];
  const desc = estado.descartadas.has(id);
  return `<article class="causa${desc ? " descartada" : ""}" id="c-${id}">
    <header><span class="chip">${i + 1}</span><h3>${esc(c.t)}</h3><span class="badge ${cl}">${nv}</span></header>
    <p>${esc(c.p)}</p>
    <h4>Cómo confirmarlo</h4><p>${esc(c.c)}</p>
    <h4>Qué hacer</h4>
    <ol class="pasos-l">${c.s.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
    <div class="causa-pie">
      ${c.cal ? `<a class="visitar sec" href="../calibracion/#${c.cal}">Ver paso de calibración →</a>` : "<span></span>"}
      <button type="button" class="link-b" data-desc="${id}">${desc ? "Volver a considerarla" : "Ya la descarté"}</button>
    </div>
  </article>`;
}

function pintarDiagnostico() {
  const panel = $("#diag");
  const s = SINTOMAS.find((x) => x.id === estado.sint);
  if (!s) { panel.hidden = true; return; }
  panel.hidden = false;
  const r = recorrer(s, estado.ruta);
  if (r.salto) { abrir(r.salto, [], true); return; }
  let html = `<div class="diag-head"><span class="chip">${num(s)}</span><div><p class="label">${esc(grupoNombre(s.g))}</p><h2>${esc(s.n)}</h2><p class="sub">${esc(s.v)}</p></div>
    <button type="button" class="link-b" id="cerrar">Cambiar síntoma</button></div>`;
  if (r.pasos.length) html += `<ol class="ruta">${r.pasos.map(([q, a]) => `<li><span class="label">${esc(q)}</span> <b>${esc(a)}</b></li>`).join("")}</ol>`;
  if (r.nodo) {
    html += `<div class="pregunta" role="group" aria-labelledby="pq"><h3 id="pq">${esc(r.nodo.q)}</h3>
      <div class="opciones">${r.nodo.o.map((o, i) => `<button type="button" class="opcion" data-op="${i}">${esc(o[0])}</button>`).join("")}</div></div>`;
  } else {
    html += `<p class="resultado"><span class="label">Causas posibles</span> <span class="sub">de más a menos probable. Empieza por la primera.</span></p>
      <div class="causas">${r.res.map(causa).join("")}</div>`;
  }
  html += `<div class="diag-pie">${estado.ruta.length ? `<button type="button" class="pill" id="atras">← Volver una pregunta</button>` : ""}${estado.ruta.length ? `<button type="button" class="pill" id="reinicio">Empezar de nuevo</button>` : ""}</div>`;
  panel.innerHTML = html;
}

function abrir(id, ruta = [], reemplazar = false) {
  estado.sint = id; estado.ruta = ruta; estado.descartadas = new Set();
  const h = `#${id}${ruta.length ? "/" + ruta.join(".") : ""}`;
  reemplazar ? history.replaceState(null, "", h) : history.pushState(null, "", h);
  pintarDiagnostico();
  $("#diag").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth", block: "start" });
}

function cerrar() {
  estado.sint = null; estado.ruta = [];
  history.pushState(null, "", location.pathname);
  pintarDiagnostico();
  $("#elegir").scrollIntoView({ block: "start" });
}

function desdeHash() {
  const h = location.hash.slice(1);
  if (!h) { estado.sint = null; estado.ruta = []; pintarDiagnostico(); return; }
  const [id, r] = h.split("/");
  if (!SINTOMAS.some((s) => s.id === id)) return;
  estado.sint = id;
  estado.ruta = r ? r.split(".").map(Number).filter((n) => Number.isInteger(n)) : [];
  pintarDiagnostico();
}

document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-g]");
  if (g) { estado.g = g.dataset.g; pintarFiltros(); pintarSintomas(); return; }
  const s = e.target.closest("[data-sint]");
  if (s) { abrir(s.dataset.sint); return; }
  const o = e.target.closest("[data-op]");
  if (o) { abrir(estado.sint, [...estado.ruta, Number(o.dataset.op)]); return; }
  const d = e.target.closest("[data-desc]");
  if (d) {
    const id = d.dataset.desc;
    estado.descartadas.has(id) ? estado.descartadas.delete(id) : estado.descartadas.add(id);
    const art = document.getElementById(`c-${id}`);
    art.classList.toggle("descartada", estado.descartadas.has(id));
    d.textContent = estado.descartadas.has(id) ? "Volver a considerarla" : "Ya la descarté";
    return;
  }
  if (e.target.closest("#cerrar")) { cerrar(); return; }
  if (e.target.closest("#atras")) { abrir(estado.sint, estado.ruta.slice(0, -1)); return; }
  if (e.target.closest("#reinicio")) { abrir(estado.sint, []); }
});
$("#q").addEventListener("input", (e) => { estado.q = e.target.value; pintarSintomas(); });
window.addEventListener("popstate", desdeHash);

pintarFiltros();
pintarSintomas();
desdeHash();
