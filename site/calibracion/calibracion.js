/* Guía de calibración — datos y render.
   Métodos y modelos tomados de fuentes abiertas y muy usadas (Ellis' Print Tuning Guide, Teaching Tech, OrcaSlicer, Klipper).
   Fuentes revisadas en septiembre de 2026. Los sitios cambian: si un enlace falla, busca el nombre del método. */
const FASES = [
  ["todas", "Todas"],
  ["base", "1 · Base"],
  ["extrusion", "2 · Extrusión"],
  ["material", "3 · Material"],
  ["movimiento", "4 · Movimiento"],
  ["validacion", "5 · Validación"],
];

const ORCA = "https://github.com/SoftFever/OrcaSlicer/wiki/";
const ELLIS = "https://ellis3dp.com/Print-Tuning-Guide/articles/";
const TT = "https://teachingtechyt.github.io/calibration.html";

const PASOS = [
  {
    id: "mecanica", fase: "base", nivel: "Esencial", n: "Revisa la mecánica",
    que: "Que nada esté flojo, desalineado ni con fricción. Ningún ajuste de software compensa una máquina floja.",
    cuando: "Al armar la impresora, tras moverla o transportarla, y de forma periódica.",
    herr: "Llaves Allen, regla o escuadra, tu oído.",
    pasos: [
      "Aprieta tornillería, poleas y prisioneros de motores y ejes.",
      "Revisa las correas: parejas, sin holgura y sin dientes saltados. Al pulsarlas deben sonar parecido.",
      "Con los motores apagados, mueve cada eje a mano: el recorrido debe ser suave y parejo.",
      "Confirma que el cabezal no tenga juego y que el gantry esté escuadrado (en CoreXY y Voron es un paso propio).",
      "Boquilla apretada en caliente y tubo PTFE bien asentado si tu extrusor es Bowden.",
    ],
    leer: "No hay modelo que imprimir: se revisa a mano. Si algo se siente duro, flojo o desigual, corrígelo antes de seguir.",
    fuentes: [
      ["Teaching Tech — Frame check", TT, "Lista de revisión mecánica, primer paso de su guía completa."],
      ["Ellis — Voron V2 gantry squaring", ELLIS + "voron_v2_gantry_squaring.html", "Escuadrado del gantry en máquinas Voron."],
    ],
    sint: ["layer-shift", "ringing", "dimensiones"],
  },
  {
    id: "secado", fase: "base", nivel: "Esencial", n: "Seca y almacena el filamento",
    que: "Un filamento húmedo arruina cualquier otra calibración: burbujea, hace hilos y cambia de comportamiento.",
    cuando: "Antes de cada calibración y siempre que un carrete lleve tiempo al aire, sobre todo PETG, nailon, TPU y PVA.",
    herr: "Secador de filamento (o horno de baja temperatura confiable), bolsas o cajas con desecante.",
    pasos: [
      "Escucha y mira mientras imprimes: chasquidos, burbujas, vapor o superficie áspera indican humedad.",
      "Sécalo siguiendo la temperatura y el tiempo del fabricante (consulta la ficha en el catálogo de materiales).",
      "Imprime desde una caja seca cuando el material sea muy higroscópico y guarda el resto con desecante.",
    ],
    leer: "Después de secar, chasquidos y burbujas desaparecen y la superficie se ve pareja. Si no, la causa es otra.",
    fuentes: [["Catálogo de materiales de Tritic", "../materiales/", "Fichas técnicas y recomendaciones de cada material."]],
    sint: ["stringing", "blobs", "sub-extrusion"],
  },
  {
    id: "pid", fase: "base", nivel: "Recomendado", n: "PID de hotend y cama",
    que: "Que la temperatura se mantenga estable y no oscile. Una temperatura inestable se ve como bandas en la pieza.",
    cuando: "Al armar, tras cambiar el calentador, el termistor o la boquilla, o si la temperatura oscila.",
    herr: "Terminal o consola de tu firmware. Las impresoras cerradas (Bambu, Prusa) ya vienen calibradas.",
    pasos: [
      "Marlin: envía M303 E0 S200 C8 (hotend a 200 °C, 8 ciclos) y guarda con M500. Repite con E-1 para la cama.",
      "Klipper: PID_CALIBRATE HEATER=extruder TARGET=200 y luego SAVE_CONFIG. Repite con HEATER=heater_bed.",
      "Calibra a una temperatura cercana a la que usarás normalmente, con el ventilador de capa al valor típico.",
    ],
    leer: "El resultado son nuevos valores PID que el firmware guarda. Después, la temperatura debe mantenerse dentro de un par de grados.",
    fuentes: [["Teaching Tech — PID autotune", TT, "Comandos y explicación paso a paso."]],
    sint: ["z-banding"],
  },
  {
    id: "esteps", fase: "extrusion", nivel: "Esencial", n: "Extrusor: E-steps o rotation distance",
    que: "Que cuando le pides 100 mm de filamento, el extrusor empuje exactamente 100 mm.",
    cuando: "Al armar, o tras cambiar el extrusor, el motor o el firmware. Se hace una vez por extrusor, no por filamento.",
    herr: "Cinta o marcador, regla o calibrador.",
    pasos: [
      "Calienta el hotend a temperatura de impresión (sin boquilla obstruida) y libera el filamento.",
      "Marca el filamento a 120 mm de la entrada del extrusor.",
      "Extruye 100 mm despacio (por ejemplo, G1 E100 F100).",
      "Mide cuánto quedó entre la entrada y la marca. Real extruido = 120 − lo que quedó.",
      "Marlin: E-steps nuevos = E-steps actuales × 100 ÷ real extruido. Klipper: rotation_distance nueva = actual × real extruido ÷ 100.",
      "Repite hasta que pidas 100 mm y salgan 100 ± 1 mm.",
    ],
    leer: "La medición es numérica, no visual. Es la base de flujo y pressure advance: si esta está mal, las demás se compensan a medias.",
    fuentes: [
      ["Teaching Tech — Extruder E-steps", TT, "Procedimiento con marcas de 120 mm."],
      ["Ellis — Extruder calibration", ELLIS + "extruder_calibration.html", "Versión detallada con casos particulares."],
    ],
    sint: ["sub-extrusion", "sobre-extrusion"],
  },
  {
    id: "primera-capa", fase: "base", nivel: "Esencial", n: "Primera capa: Z offset y nivelación",
    que: "La distancia justa entre boquilla y cama. Es el origen de la mayoría de fallos de adhesión.",
    cuando: "Al cambiar de superficie de impresión o de boquilla, y si notas primeras capas irregulares.",
    herr: "Modelo de parches de primera capa; espátula y jabón o alcohol isopropílico para limpiar la cama.",
    pasos: [
      "Limpia la cama y caliéntala a la temperatura del material.",
      "Usa primera capa de 0.25 mm o más y ancho de línea de 120 % o más: es más fácil ver el resultado.",
      "Reparte los parches por la cama (esquinas y centro) y empieza a imprimir.",
      "Ajusta el Z offset en vivo (babystepping) mientras se imprime, mirando el resultado.",
      "Guarda el Z offset cuando todos los parches se vean parejos.",
    ],
    leer: "Correcto: las líneas se distinguen y no hay huecos entre ellas. Muy cerca: las líneas desaparecen o hay ondas. Muy lejos: se ve luz entre líneas.",
    fuentes: [
      ["Ellis — First layer squish", ELLIS + "first_layer_squish.html", "Método con parches. Los modelos están en su repositorio (test_prints)."],
      ["Modelos de Ellis en GitHub", "https://github.com/AndrewEllis93/Print-Tuning-Guide/tree/main/test_prints", "Parches de primera capa y cubos de extrusion multiplier."],
      ["Teaching Tech — First layer", TT, "Generador de primera capa con cinco cuadros."],
    ],
    sint: ["no-adhiere", "primera-irregular", "elephant-foot"],
  },
  {
    id: "temp", fase: "material", nivel: "Recomendado", n: "Temperatura: torre de temperatura",
    que: "La temperatura de boquilla que equilibra adhesión entre capas, puentes limpios y poco stringing.",
    cuando: "Cada vez que estrenes un filamento de otra marca o color. El mismo material puede imprimir distinto entre carretes.",
    herr: "Función integrada de Orca Slicer, o la torre de Teaching Tech. Parte del rango que marca el carrete.",
    pasos: [
      "En Orca Slicer: Calibración → Temperatura. Elige el material y el rango del fabricante.",
      "Imprime la torre. Cada bloque se imprime a una temperatura distinta, de arriba hacia abajo o al revés según el modelo.",
      "Inspecciona cada bloque: adhesión entre capas, puentes, voladizos, stringing y acabado.",
      "Guarda en el perfil del filamento la temperatura del mejor bloque.",
    ],
    leer: "Prioriza la adhesión entre capas. Si dos bloques se ven igual, empieza por el de menor temperatura: hay menos hilos y más detalle. Tu perfil final puede variar unos grados según la pieza.",
    fuentes: [
      ["OrcaSlicer — Temperature calibration", ORCA + "temp_calib", "Torre integrada en el laminador."],
      ["Teaching Tech — Temperature tuning", TT, "Torre alternativa con generación de G-code."],
    ],
    sint: ["stringing", "delaminacion", "voladizos"],
  },
  {
    id: "flujo-vol", fase: "material", nivel: "Recomendado", n: "Flujo volumétrico máximo",
    que: "Cuánto plástico por segundo (mm³/s) puede fundir tu hotend con este filamento sin quedarse corto.",
    cuando: "Al estrenar un hotend, una boquilla de otro tamaño o un filamento de comportamiento distinto (por ejemplo, con fibras).",
    herr: "Función integrada de Orca Slicer.",
    pasos: [
      "En Orca Slicer: Calibración → Velocidad volumétrica máxima. Define el rango de flujo.",
      "Imprime la torre: el flujo aumenta con la altura.",
      "Identifica la altura donde la superficie empieza a degradarse (huecos, líneas débiles, chasquidos).",
      "Calcula el flujo de esa altura y quédate cerca de un 10 % por debajo como margen. Guárdalo en el perfil del filamento.",
    ],
    leer: "Es tu techo de velocidad: el laminador limitará la velocidad de las zonas grandes o rápidas para no pasarse de este flujo.",
    fuentes: [
      ["OrcaSlicer — Volumetric speed", ORCA + "volumetric_speed_calib", "Torre integrada."],
      ["Ellis — Max volumetric flow rate", ELLIS + "determining_max_volumetric_flow_rate.html", "Método manual con marcas en el filamento."],
    ],
    sint: ["sub-extrusion", "clog"],
  },
  {
    id: "pa", fase: "extrusion", nivel: "Esencial", n: "Pressure advance / linear advance",
    que: "Compensa la presión que se acumula en la boquilla, para que las esquinas no se abulten y no queden huecos tras ellas.",
    cuando: "Por cada filamento (marca y material). Repite si cambias hotend, boquilla o largo del tubo Bowden.",
    herr: "Función integrada de Orca Slicer, patrón de Ellis, o la herramienta de linear advance de Marlin.",
    pasos: [
      "Calibra con las aceleraciones y velocidades que realmente usarás.",
      "En Orca Slicer: Calibración → Pressure Advance. Método Patrón (analiza varios valores) o Torre (no depende de la primera capa).",
      "Elige el valor donde las esquinas se ven parejas: sin bulto y sin hueco después.",
      "Guarda el valor en el perfil del filamento.",
    ],
    leer: "Referencia en Klipper: los valores típicos van de 0.05 a 1.0; los más altos suelen ser de extrusores Bowden. En directo lo normal es un valor bajo.",
    fuentes: [
      ["OrcaSlicer — Pressure advance", ORCA + "pressure_advance_calib", "Métodos línea, patrón y torre."],
      ["Ellis — Pressure advance", ELLIS + "index_pressure_advance.html", "Método del patrón que Orca adoptó; incluye la torre."],
      ["Klipper — Pressure advance", "https://www.klipper3d.org/Pressure_Advance.html", "Explicación del concepto y el ajuste."],
    ],
    sint: ["blobs", "sobre-extrusion", "sub-extrusion"],
  },
  {
    id: "flow", fase: "extrusion", nivel: "Esencial", n: "Flujo: extrusion multiplier o flow ratio",
    que: "Cuánto plástico sale por cada milímetro que el laminador calcula. Ajusta el acabado superior y las dimensiones finas.",
    cuando: "Después de temperatura y pressure advance, por cada filamento.",
    herr: "Función integrada de Orca Slicer, o los cubos de extrusion multiplier de Ellis.",
    pasos: [
      "En Orca Slicer: Calibración → Flujo, Pasada 1: imprime nueve bloques con distintos modificadores y elige la superficie superior más lisa.",
      "Calcula: flujo nuevo = flujo actual × (100 + modificador) ÷ 100 y guarda.",
      "Pasada 2: imprime diez bloques con modificadores de −9 a 0 y elige de nuevo el más liso.",
      "Aplica la misma fórmula y guarda en el perfil del filamento.",
    ],
    leer: "La superficie superior debe sentirse lisa. Demasiado flujo la vuelve rugosa; muy poco deja huecos o valles entre líneas.",
    fuentes: [
      ["OrcaSlicer — Flow ratio", ORCA + "flow_ratio_calib", "Método de dos pasadas."],
      ["Ellis — Extrusion multiplier", ELLIS + "extrusion_multiplier.html", "Cubos de 30 × 30 × 3 mm, evaluación visual y al tacto."],
      ["Teaching Tech — Slicer flow", TT, "Alternativa midiendo un cubo de pared simple con calibrador."],
    ],
    sint: ["sobre-extrusion", "superior", "dimensiones"],
  },
  {
    id: "retraccion", fase: "extrusion", nivel: "Esencial", n: "Retracción",
    que: "Cuánto retrocede el filamento al viajar entre partes para evitar hilos, sin causar atascos.",
    cuando: "Por cada filamento y cada tipo de extrusor (directo o Bowden).",
    herr: "Función integrada de Orca Slicer, o la torre de retracción de Teaching Tech.",
    pasos: [
      "En Orca Slicer: Calibración → Retracción. Directo: 0–2 mm en pasos de 0.1. Bowden: 1–6 mm en pasos de 0.2.",
      "Imprime la torre; cada nivel usa una retracción distinta.",
      "Identifica el nivel con menos hilos y ooze. Elige la retracción más corta que dé un resultado limpio.",
      "Busca en la vista previa del G-code el comentario Calib_Retraction_tower para saber el valor exacto de ese nivel.",
    ],
    leer: "Menos es más: demasiada retracción o muy rápida puede atascar el hotend o molerlo. La mejor es la más corta que quita los hilos.",
    fuentes: [
      ["OrcaSlicer — Retraction", ORCA + "retraction_calib", "Torre integrada."],
      ["Ellis — Retraction", ELLIS + "retraction.html", "Explicación completa de retracción y wipe."],
      ["Teaching Tech — Retraction tuning", TT, "Torre alternativa."],
    ],
    sint: ["stringing", "blobs", "clog"],
  },
  {
    id: "enfriamiento", fase: "material", nivel: "Recomendado", n: "Enfriamiento y tiempo por capa",
    que: "Cuánto aire recibe cada capa y cuánto tiempo se le da para solidificarse antes de la siguiente.",
    cuando: "Por material, y otra vez si imprimes piezas muy pequeñas o voladizos exigentes.",
    herr: "Un modelo de voladizos y puentes, por ejemplo 3DBenchy, o los que trae tu laminador.",
    pasos: [
      "Parte del ventilador típico del material: alto en PLA, medio en PETG, bajo o apagado en ABS y ASA.",
      "Imprime un modelo con voladizos y puentes. Observa curling, puentes caídos y detalle en zonas pequeñas.",
      "Sube el ventilador si los voladizos se enrollan; bájalo si hay separación de capas o grietas.",
      "Ajusta el tiempo mínimo por capa para piezas pequeñas: si son muy rápidas, no alcanzan a enfriarse.",
    ],
    leer: "Poco aire: voladizos caídos y detalles derretidos. Demasiado: capas mal unidas, grietas y warping.",
    fuentes: [
      ["Ellis — Cooling and layer times", ELLIS + "cooling_and_layer_times.html", "Criterios de ventilador y tiempo de capa."],
      ["3DBenchy", "https://www.3dbenchy.com/", "Modelo de prueba con voladizos, puentes y detalles."],
    ],
    sint: ["voladizos", "delaminacion", "warping"],
  },
  {
    id: "aceleracion", fase: "movimiento", nivel: "Avanzado", n: "Aceleración, cornering e input shaping",
    que: "Equilibrio entre velocidad y calidad: reduce las ondas (ringing) sin volver la impresión eterna.",
    cuando: "Cuando ya calibraste extrusión y aún ves ondas junto a bordes y detalles, o quieres subir la velocidad.",
    herr: "Funciones integradas de Orca Slicer. En Klipper, un acelerómetro permite medir la resonancia con precisión.",
    pasos: [
      "Empieza con aceleraciones moderadas para tu máquina y ve subiendo.",
      "En Orca Slicer: Calibración → Cornering (jerk / junction deviation) e Input Shaping. Imprime y observa el ringing.",
      "Si tu máquina tiene input shaping (Klipper, Marlin reciente o Bambu automático), calíbralo antes de subir aceleraciones.",
      "Para líneas verticales finas, revisa la calibración VFA de Orca.",
    ],
    leer: "Busca la aceleración más alta a la que las esquinas y letras siguen limpias. Más alto solo cambia el tiempo de impresión, no el resultado.",
    fuentes: [
      ["OrcaSlicer — Cornering", ORCA + "cornering_calib", "Jerk y junction deviation."],
      ["OrcaSlicer — Input shaping", ORCA + "input_shaping_calib", "Resonancia y ringing."],
      ["OrcaSlicer — VFA", ORCA + "vfa_calib", "Vertical fine artifacts."],
      ["Ellis — Max speeds and accelerations", ELLIS + "determining_max_speeds_accels.html", "Límites mecánicos de la máquina."],
      ["Klipper — Resonance compensation", "https://www.klipper3d.org/Resonance_Compensation.html", "Input shaping en Klipper."],
    ],
    sint: ["ringing", "vfa"],
  },
  {
    id: "escala", fase: "validacion", nivel: "Recomendado", n: "Escala y escuadra (XYZ)",
    que: "Que las medidas impresas coincidan con las del modelo y que los ejes sean perpendiculares.",
    cuando: "Tras armar, mover o cambiar correas. La contracción de cada material es distinta: repite por material si necesitas precisión.",
    herr: "Calibrador (vernier). Cubo XYZ de 20 mm o el modelo Califlower.",
    pasos: [
      "Imprime un cubo de 20 mm con el perfil ya calibrado.",
      "Mide cada eje con calibrador, en varios puntos. Compara con 20 mm.",
      "Si hay diferencia constante, aplica una compensación de escala por material en el laminador. No mezcles esto con flujo: primero flujo.",
      "Si el cubo sale como paralelogramo, hay un problema de escuadra: revisa la mecánica antes de compensar.",
    ],
    leer: "Diferencias menores a unas décimas de milímetro suelen ser normales en FDM. Las mayores indican flujo, escala o escuadra.",
    fuentes: [
      ["Teaching Tech — XYZ steps", TT, "Cubo de 20 mm y método con calibrador."],
      ["Califlower (Vector 3D, Printables)", "https://www.printables.com/model/682023-califlower-calibration-stl-calculator-mk1", "Mide escala y sesgo con una hoja de cálculo. Licencia personal no comercial."],
    ],
    sint: ["dimensiones"],
  },
  {
    id: "tolerancia", fase: "validacion", nivel: "Recomendado", n: "Tolerancias de ensamble",
    que: "La holgura mínima que necesitas entre piezas para que encajen, deslicen o queden apretadas.",
    cuando: "Cuando diseñes piezas que se ensamblan. Repite si cambias de material, boquilla o impresora.",
    herr: "Función integrada de Orca Slicer.",
    pasos: [
      "En Orca Slicer: Calibración → Tolerancia. Imprime la pieza con agujeros de distintas holguras.",
      "Prueba cuál pieza entra con el ajuste que buscas: deslizante, ligeramente apretado o a presión.",
      "Anota la holgura como regla de diseño para ese material e impresora.",
    ],
    leer: "El resultado es una regla para tus diseños, en décimas de milímetro. Depende de la máquina y el material: anótala por perfil.",
    fuentes: [["OrcaSlicer — Tolerance", ORCA + "tolerance_calib", "Prueba de ajuste integrada."]],
    sint: ["dimensiones"],
  },
  {
    id: "validacion", fase: "validacion", nivel: "Recomendado", n: "Valida y guarda el perfil",
    que: "Comprobar que todo funciona junto y dejar el perfil listo para repetirse.",
    cuando: "Al terminar cada filamento nuevo.",
    herr: "3DBenchy o cualquier pieza de prueba que ya conozcas bien.",
    pasos: [
      "Imprime un 3DBenchy (o tu pieza de referencia) con el perfil calibrado.",
      "Revisa: primera capa, casco y ventanas, chimenea, voladizos de proa y popa, letras y cubierta.",
      "Si algo falla, usa la guía de diagnóstico para encontrar la causa.",
      "Guarda el perfil con un nombre reproducible: marca, material, color y fecha.",
    ],
    leer: "Un mismo modelo impreso antes y después de calibrar es la mejor manera de ver el progreso. Guarda la primera impresión como referencia.",
    fuentes: [["3DBenchy", "https://www.3dbenchy.com/", "El modelo de referencia más usado. Revisa la licencia en su sitio."]],
    sint: [],
  },
];

const MODELOS = [
  ["Parches de primera capa", "Z offset y nivelación", "Ellis (GitHub)", "https://github.com/AndrewEllis93/Print-Tuning-Guide/tree/main/test_prints", "Método documentado en su guía, con criterios claros de lectura."],
  ["Cubos de extrusion multiplier", "Acabado superior y flujo", "Ellis (GitHub)", "https://github.com/AndrewEllis93/Print-Tuning-Guide/tree/main/test_prints", "Evaluación visual y al tacto, sin depender de medir paredes."],
  ["Pruebas integradas de Orca Slicer", "Temperatura, flujo, PA, retracción, tolerancia, VFA e input shaping", "OrcaSlicer (wiki)", ORCA + "Calibration", "Están dentro del laminador y se documentan en su wiki; miles de usuarios las usan."],
  ["Herramienta de calibración de Teaching Tech", "Torres, primera capa, retracción y aceleración", "Teaching Tech", TT, "Guía completa en orden con generador de G-code; muy difundida."],
  ["Patrón de pressure advance", "Pressure advance", "Ellis / Orca", ELLIS + "index_pressure_advance.html", "Adoptado por Orca Slicer como uno de sus métodos."],
  ["Cubo XYZ de 20 mm", "Escala y dimensiones", "iDig3Dprinting (vía Teaching Tech)", TT, "Referencia clásica: se mide con calibrador."],
  ["3DBenchy", "Validación general", "3dbenchy.com", "https://www.3dbenchy.com/", "El modelo de prueba más usado; muy fácil de comparar entre impresiones."],
  ["Califlower", "Escala y sesgo", "Vector 3D (Printables)", "https://www.printables.com/model/682023-califlower-calibration-stl-calculator-mk1", "Incluye hoja de cálculo. Licencia estándar no comercial."],
];

const CRITERIOS = [
  ["Método documentado", "Explica qué mide, cómo se imprime y cómo se lee. Nada de “se ve bien”."],
  ["Resultado numérico o comparable", "Termina en un valor que guardas en el perfil, no en una impresión bonita."],
  ["Una sola variable", "Cada modelo prueba una cosa. Así sabes qué cambió."],
  ["Rápido y barato", "Poco material y poco tiempo, para que sea fácil repetirlo con cada filamento."],
  ["Reproducible por otros", "Mucha gente lo usó y llegó al mismo resultado con impresoras distintas."],
  ["Abierto", "Puedes ver el método, y de ser posible, el archivo original."],
];

const $ = (s, el = document) => el.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nombreFase = (id) => FASES.find((f) => f[0] === id)[1].replace(/^\d · /, "");
const KEY = "tritic-cal-hechos";
let hechos = new Set();
try { hechos = new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch (e) { /* sin almacenamiento */ }
const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify([...hechos])); } catch (e) { /* sin almacenamiento */ } };

const estado = { fase: "todas" };

function paso(p) {
  const i = PASOS.indexOf(p) + 1;
  const nivel = p.nivel === "Esencial" ? "ok" : p.nivel === "Avanzado" ? "warn" : "info";
  const sint = p.sint.length
    ? `<p class="sint"><span class="label">Si ves esto →</span> ${p.sint.map((s) => `<a href="../diagnostico/#${s}">${esc(SINT_NOMBRES[s] || s)}</a>`).join("")}</p>`
    : "";
  return `<article class="paso${hechos.has(p.id) ? " hecho" : ""}" id="${p.id}">
    <header class="paso-head">
      <span class="chip">${String(i).padStart(2, "0")}</span>
      <div><h3>${esc(p.n)}</h3>
      <div class="badges"><span class="badge ${nivel}">${esc(p.nivel)}</span><span class="badge info">${esc(nombreFase(p.fase))}</span></div></div>
      <label class="chk-h"><input type="checkbox" data-hecho="${p.id}" ${hechos.has(p.id) ? "checked" : ""}> Hecho</label>
    </header>
    <div class="paso-body">
      <div>
        <h4>Qué ajusta</h4><p>${esc(p.que)}</p>
        <h4>Cuándo repetirlo</h4><p>${esc(p.cuando)}</p>
        <h4>Qué necesitas</h4><p>${esc(p.herr)}</p>
      </div>
      <div>
        <h4>Procedimiento</h4>
        <ol class="pasos-l">${p.pasos.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
        <div class="leer"><span class="label">Cómo leerlo</span><p>${esc(p.leer)}</p></div>
      </div>
    </div>
    <div class="paso-pie">
      <h4>Modelos y fuentes</h4>
      <ul class="fuentes">${p.fuentes.map(([n, u, d]) => `<li><a href="${esc(u)}"${u.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(n)}${u.startsWith("http") ? " ↗" : ""}</a><span>${esc(d)}</span></li>`).join("")}</ul>
      ${sint}
    </div>
  </article>`;
}

function pintarFases() {
  $("#fases").innerHTML = FASES.map(([id, t]) => `<button type="button" class="pill" data-fase="${id}" aria-pressed="${id === estado.fase}">${t}</button>`).join("");
}

function pintarPasos() {
  const v = PASOS.filter((p) => estado.fase === "todas" || p.fase === estado.fase);
  $("#pasos").innerHTML = v.map(paso).join("");
  progreso();
}

function progreso() {
  const n = PASOS.filter((p) => hechos.has(p.id)).length;
  $("#prog-txt").textContent = `${n} de ${PASOS.length} pasos`;
  $("#prog-bar").style.width = `${(n / PASOS.length) * 100}%`;
}

function pintarEstatico() {
  $("#tabla-mod").innerHTML = `<thead><tr><th scope="col">Modelo o herramienta</th><th scope="col">Para qué sirve</th><th scope="col">Fuente</th><th scope="col">Por qué es confiable</th></tr></thead><tbody>${MODELOS.map((m) => `<tr><th scope="row"><a href="${esc(m[3])}" target="_blank" rel="noopener noreferrer">${esc(m[0])} ↗</a></th><td>${esc(m[1])}</td><td>${esc(m[2])}</td><td>${esc(m[4])}</td></tr>`).join("")}</tbody>`;
  $("#criterios").innerHTML = CRITERIOS.map(([t, d], i) => `<li><span class="chip">${String(i + 1).padStart(2, "0")}</span><div><b>${esc(t)}</b><p>${esc(d)}</p></div></li>`).join("");
  $("#indice").innerHTML = PASOS.map((p, i) => `<li><a href="#${p.id}"><span class="chip">${String(i + 1).padStart(2, "0")}</span>${esc(p.n)}</a></li>`).join("");
}

/* Nombres de síntomas para enlazar con la guía de diagnóstico. */
const SINT_NOMBRES = {
  "layer-shift": "Capas desplazadas", "ringing": "Ondas y fantasmas", "dimensiones": "Medidas incorrectas",
  "stringing": "Hilos (stringing)", "blobs": "Manchas y granos", "sub-extrusion": "Falta de material",
  "z-banding": "Bandas horizontales", "sobre-extrusion": "Exceso de material", "no-adhiere": "No se pega a la cama",
  "primera-irregular": "Primera capa irregular", "elephant-foot": "Pata de elefante", "delaminacion": "Capas separadas",
  "voladizos": "Voladizos caídos", "clog": "Obstrucción", "superior": "Capas superiores malas",
  "vfa": "Líneas verticales finas", "warping": "Esquinas levantadas",
};

document.addEventListener("click", (e) => {
  const f = e.target.closest("[data-fase]");
  if (f) { estado.fase = f.dataset.fase; pintarFases(); pintarPasos(); }
});
document.addEventListener("change", (e) => {
  const h = e.target.closest("[data-hecho]");
  if (!h) return;
  h.checked ? hechos.add(h.dataset.hecho) : hechos.delete(h.dataset.hecho);
  guardar();
  h.closest(".paso").classList.toggle("hecho", h.checked);
  progreso();
});
$("#reiniciar").addEventListener("click", () => { hechos.clear(); guardar(); pintarPasos(); });

pintarFases();
pintarPasos();
pintarEstatico();
if (location.hash.length > 1) { const el = document.getElementById(location.hash.slice(1)); if (el) requestAnimationFrame(() => el.scrollIntoView()); }
