/* Guía de diseño para impresión 3D FDM — datos y render.
   Valores de referencia de práctica común en la comunidad FDM (guías de Prusa, Protolabs/Hubs y Teaching Tech).
   Son puntos de partida: cada impresora, material y perfil los desplaza un poco. Validar con pieza de prueba. */
const BOQUILLAS = [0.2, 0.4, 0.6, 0.8];

/* Dimensiones mínimas en función del diámetro de boquilla d. [nombre, mín (×d), máx (×d) o null, nota] */
const MINIMOS = [
  ["Ancho de línea típico", 1.1, 1.25, "Lo que realmente deposita el laminador; suele ser 10–25 % mayor que la boquilla."],
  ["Altura de capa", 0.25, 0.75, "Entre 25 y 75 % del diámetro de la boquilla."],
  ["Pared mínima (2 líneas)", 2, null, "Menos que esto no se imprime de forma consistente."],
  ["Pared funcional", 3, 4, "Para piezas que soportan carga o llevan tornillos."],
  ["Trazo mínimo de texto o relieve", 2, null, "Ancho del trazo; con altura de al menos 2 capas."],
  ["Ranura o grabado (ancho)", 2, null, "Más angosto se rellena o se cierra."],
  ["Pin o columna (Ø mínimo)", 5, null, "Los más delgados se rompen al desprenderse de la cama."],
  ["Agujero (Ø mínimo)", 5, null, "Más chico, mejor perfora con broca después."],
];

const REGLAS = [
  ["Diseña para la boquilla", "Usa espesores que sean múltiplos del ancho de línea: 0.8, 1.2, 1.6 mm con boquilla de 0.4. Un espesor intermedio deja huecos o líneas mal rellenas."],
  ["Evita soportes", "Orienta la pieza y usa chaflanes de 45° para que se imprima sola. Cada soporte deja mal acabado y gasta material."],
  ["Base plana y grande", "Una cara plana contra la cama da adhesión y precisión. Si la pieza no tiene una, agrégale un corte plano."],
  ["Redondea las esquinas", "Los filetes de 1 mm o más en esquinas exteriores reparten esfuerzos y reducen el warping. Las esquinas vivas concentran ambos."],
  ["Chaflán en la base", "Un chaflán de 0.4–0.6 mm en el borde inferior evita la “pata de elefante” y hace que la pieza encaje bien."],
  ["Divide las piezas complejas", "Varias piezas simples e imprimibles en su mejor orientación superan a una sola pieza con soportes por todos lados."],
];

const VOLADIZOS = [
  ["0–45°", "Sin soporte", "Se imprime sin problema. Es la regla general del 45°.", "ok"],
  ["45–60°", "Sin soporte, con acabado peor", "La cara inferior queda rugosa. Sube el enfriamiento o reduce la velocidad.", "info"],
  ["60–90°", "Requiere soporte o rediseño", "Se cae o se deforma. Cambia el ángulo, orienta distinto o agrega soportes.", "warn"],
  ["90° (puente)", "Depende de la longitud", "Hasta unos 20–40 mm suele funcionar con buen enfriamiento. Más largo, agrega apoyo intermedio.", "warn"],
];

const ORIENTACION = [
  ["Resistencia a la tensión", "Que las líneas corran en la dirección de la carga", "Si la carga separa capas, la pieza se parte por ahí."],
  ["Acabado visible", "Cara buena contra la cama o en vertical", "Las superficies inclinadas muestran escalones."],
  ["Precisión en agujeros", "Ejes de agujeros verticales (en Z)", "Salen más redondos que los horizontales."],
  ["Soportes", "La orientación que minimice voladizos", "Ahorra material, tiempo y acabado."],
  ["Estabilidad de impresión", "Base ancha, centro de masa bajo", "Piezas altas y delgadas vibran y se despegan."],
];

const HOLGURAS = [
  ["Presión (ajuste a presión)", "0.00–0.10 mm", "Piezas que se unen con fuerza y no vuelven a separarse. Prueba primero."],
  ["Apretado", "0.10–0.15 mm", "Se arma a mano con esfuerzo; ideal para tapas y pines."],
  ["Deslizante", "0.15–0.25 mm", "Se mueve sin juego notable; ejes, cajones, guías."],
  ["Holgado (móvil)", "0.30–0.50 mm", "Piezas que giran o se imprimen ya ensambladas (print-in-place)."],
];

const AGUJEROS = [
  ["Salen más chicos", "Compensa +0.1 a +0.2 mm en el diámetro (más en agujeros pequeños). Verifica con una pieza de prueba."],
  ["Mejor con broca", "Para tolerancia real (ejes, baleros, tornillos de precisión) imprime el agujero 0.3–0.5 mm más chico y termínalo con broca o rima."],
  ["Verticales redondos, horizontales ovalados", "En agujeros horizontales, el techo sin soporte se hunde. Dibuja gota o diamante."],
  ["Roscas impresas: solo M6 o más", "Las roscas finas se aplastan. Para M3–M5 usa insertos térmicos, tuercas atrapadas o macheleo directo en plástico."],
  ["Insertos térmicos y tuercas", "Diseña el alojamiento para el inserto y refuerza con paredes gruesas a su alrededor. Ver medidas en la guía de barrenos."],
  ["Tuerca atrapada", "Un hueco hexagonal con 0.2–0.3 mm de holgura y una pausa de impresión (M600) o un puente sobre él."],
];

const ENSAMBLES = [
  ["Snap-fit (broche)", "Diseña el brazo con un largo mínimo de 5× su espesor y la garra con un ángulo suave de entrada. Imprímelo de modo que la flexión no separe capas. PETG y nailon aguantan más que PLA."],
  ["Bisagra viva", "Solo funciona en materiales flexibles como PP y TPU, con la zona delgada (0.4–0.8 mm) alineada con las capas."],
  ["Pines y alineación", "Usa pines cónicos o con punta redondeada con holgura de 0.1–0.2 mm. Ayudan a ensamblar y a mantener la posición sin pegamento."],
  ["Tornillos", "Cabeza avellanada o cajeado del lado hacia la cama. Deja paredes de al menos 3× el ancho de línea alrededor del agujero."],
  ["Piezas grandes", "Divide con cortes en cola de milano, cuñas o pines. Los cortes planos se pegan con adhesivo para plásticos del material correspondiente."],
  ["Print-in-place", "Holgura de 0.3–0.5 mm entre piezas móviles, y pon la primera capa de la pieza móvil separada de la fija. Prueba con una versión pequeña."],
];

const MATERIALES = [
  ["PLA", "Bajo", "Rígido y frágil; se deforma con calor (≈ 55–60 °C). Evita snap-fits que se flexionan mucho."],
  ["PETG", "Bajo a medio", "Más tenaz y flexible que PLA. Buen candidato para broches y piezas mecánicas; cuidado con hilos y adherencia excesiva a la cama."],
  ["ABS / ASA", "Alto", "Esquinas redondeadas, bases anchas y cámara cerrada. Contrae más que PLA: considera compensación dimensional."],
  ["PP", "Muy alto", "Excelente para bisagras vivas y resistencia química, pero se deforma y despega muy fácil. Requiere superficie de adhesión especial."],
  ["TPU", "Bajo", "Paredes gruesas, sin voladizos ni puentes largos. Impresión lenta y con retracción mínima."],
  ["Con fibra de carbono", "Depende del material base", "Más rígido y con mejor estabilidad, pero más frágil; usa filetes generosos y boquilla endurecida."],
];

const LISTA = [
  "El modelo es sólido, sin caras invertidas ni agujeros en la malla.",
  "Las paredes cumplen el espesor mínimo de la boquilla que usaré.",
  "Ningún voladizo pasa de 45° sin justificarlo, o tengo previsto el soporte.",
  "La pieza tiene una cara plana que descansa en la cama.",
  "Elegí la orientación según la carga y el acabado.",
  "Los agujeros tienen compensación y los horizontales están en forma de gota.",
  "Las piezas que encajan tienen la holgura calculada.",
  "Las esquinas exteriores tienen filete y la base tiene chaflán.",
  "El material elegido soporta la temperatura y el esfuerzo de uso.",
  "Imprimí una versión pequeña o parcial para validar antes de la pieza final.",
];

const $ = (s, el = document) => el.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const num = (n) => String(+n.toFixed(2));
const KEY = "tritic-dis-lista";
const KEY_B = "tritic-dis-boquilla";
let hechos = new Set();
let boq = 0.4;
try { hechos = new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch (e) { /* sin almacenamiento */ }
try { const b = parseFloat(localStorage.getItem(KEY_B)); if (BOQUILLAS.includes(b)) boq = b; } catch (e) { /* sin almacenamiento */ }
const guardar = () => { try { localStorage.setItem(KEY, JSON.stringify([...hechos])); } catch (e) { /* sin almacenamiento */ } };

const rango = (a, b) => (b == null ? `${num(a * boq)} mm` : `${num(a * boq)}–${num(b * boq)} mm`);

function pintarBoquilla() {
  $("#boq").innerHTML = BOQUILLAS.map((b) => `<button type="button" data-boq="${b}" aria-pressed="${b === boq}">${b} mm</button>`).join("");
  document.querySelectorAll("span[data-boq]").forEach((s) => { s.textContent = num(boq); });
}

function pintarMedidas() {
  const t = (i) => MINIMOS[i];
  const tile = (etq, val, sub) => `<div class="tile"><span class="label">${etq}</span><div class="tv">${val}</div><div class="ts">${sub}</div></div>`;
  $("#tiles").innerHTML = [
    tile("Pared mínima", rango(t(2)[1]), "2 líneas de extrusión"),
    tile("Pared funcional", rango(t(3)[1], t(3)[2]), "para carga o tornillos"),
    tile("Altura de capa", rango(t(1)[1], t(1)[2]), "25–75 % de la boquilla"),
    tile("Agujero mínimo", rango(t(7)[1]), "Ø sin post-proceso"),
  ].join("");
  $("#t-min").innerHTML = `<thead><tr><th scope="col">Elemento</th><th scope="col" class="n">Valor (mm)</th><th scope="col">Nota</th></tr></thead><tbody>${MINIMOS.map(([n, a, b, nota]) => `<tr><th scope="row">${esc(n)}</th><td class="n"><span class="v">${rango(a, b).replace(" mm", "")}</span></td><td>${esc(nota)}</td></tr>`).join("")}</tbody>`;
}

const badge = (c, t) => `<span class="badge ${c}">${esc(t)}</span>`;

function pintarEstatico() {
  $("#l-reglas").innerHTML = REGLAS.map(([t, d], i) => `<li><span class="chip">${String(i + 1).padStart(2, "0")}</span><div><b>${esc(t)}</b><p>${esc(d)}</p></div></li>`).join("");
  $("#t-vol").innerHTML = `<thead><tr><th scope="col">Ángulo</th><th scope="col">Resultado</th><th scope="col">Recomendación</th></tr></thead><tbody>${VOLADIZOS.map(([a, r, n, c]) => `<tr><th scope="row">${esc(a)}</th><td>${badge(c, r)}</td><td>${esc(n)}</td></tr>`).join("")}</tbody>`;
  $("#t-ori").innerHTML = `<thead><tr><th scope="col">Criterio</th><th scope="col">Orienta la pieza para…</th><th scope="col">Por qué importa</th></tr></thead><tbody>${ORIENTACION.map(([a, b, c]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("")}</tbody>`;
  $("#t-hol").innerHTML = `<thead><tr><th scope="col">Tipo de ajuste</th><th scope="col" class="n">Holgura por lado</th><th scope="col">Cuándo usarlo</th></tr></thead><tbody>${HOLGURAS.map(([a, b, c]) => `<tr><th scope="row">${esc(a)}</th><td class="n"><span class="v">${esc(b)}</span></td><td>${esc(c)}</td></tr>`).join("")}</tbody>`;
  $("#l-agu").innerHTML = AGUJEROS.map(([t, d], i) => `<li><span class="chip">${String(i + 1).padStart(2, "0")}</span><div><b>${esc(t)}</b><p>${esc(d)}</p></div></li>`).join("");
  $("#g-ens").innerHTML = ENSAMBLES.map(([t, d], i) => `<article class="card"><div class="head"><span class="chip">${String(i + 1).padStart(2, "0")}</span></div><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("");
  $("#t-mat").innerHTML = `<thead><tr><th scope="col">Material</th><th scope="col">Warping</th><th scope="col">Qué considerar al diseñar</th></tr></thead><tbody>${MATERIALES.map(([a, b, c]) => `<tr><th scope="row">${esc(a)}</th><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join("")}</tbody>`;
}

function pintarLista() {
  $("#l-lista").innerHTML = LISTA.map((t, i) => `<li><label><input type="checkbox" data-i="${i}" ${hechos.has(i) ? "checked" : ""}> <span>${esc(t)}</span></label></li>`).join("");
  progreso();
}

function progreso() {
  const n = LISTA.filter((_, i) => hechos.has(i)).length;
  $("#prog-txt").textContent = `${n} de ${LISTA.length} revisados`;
  $("#prog-bar").style.width = `${(n / LISTA.length) * 100}%`;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-boq]");
  if (b) {
    boq = parseFloat(b.dataset.boq);
    try { localStorage.setItem(KEY_B, String(boq)); } catch (err) { /* sin almacenamiento */ }
    pintarBoquilla(); pintarMedidas();
  }
});
document.addEventListener("change", (e) => {
  const c = e.target.closest("input[data-i]");
  if (!c) return;
  const i = Number(c.dataset.i);
  c.checked ? hechos.add(i) : hechos.delete(i);
  guardar(); progreso();
});
$("#reiniciar").addEventListener("click", () => { hechos.clear(); guardar(); pintarLista(); });

pintarBoquilla();
pintarMedidas();
pintarEstatico();
pintarLista();
if (location.hash.length > 1) { const el = document.getElementById(location.hash.slice(1)); if (el) requestAnimationFrame(() => el.scrollIntoView()); }
