/* Catálogo de filamentos FDM — datos y render.
   Valores de referencia genéricos por familia; ratings 1–5 son relativos entre estos cinco materiales. */
const MATERIALES = [
  {
    id: "pla", nombre: "PLA", familia: "Ácido poliláctico",
    desc: "Material base de taller: fácil de imprimir, buen detalle y baja deformación. Rígido pero frágil y con poca resistencia al calor.",
    boq: [190, 220], cama: [50, 60], vent: [100, 100], cam: "No requerida", boquilla: "Estándar (latón)",
    sec: "45 °C · 4–6 h", dens: "1.24", hdt: "≈ 55",
    req: { camara: false, endurecida: false, secado: false },
    r: { rigidez: 4, calor: 1, impacto: 1, flex: 1, uv: 2, quim: 2, facil: 5 },
    ap: ["Prototipos visuales y de forma", "Maquetas y modelos de presentación", "Guías, plantillas y soportes de baja carga"],
    pr: ["No apto cerca de fuentes de calor (deforma desde ≈ 55 °C).", "Fluencia bajo carga sostenida y fractura frágil en snap-fits.", "Sensible a humedad con almacenamiento prolongado."],
  },
  {
    id: "petg", nombre: "PETG", familia: "Tereftalato de polietileno glicolizado",
    desc: "Equilibrio entre facilidad y resistencia: más tenaz que PLA, buena adhesión entre capas y resistencia química moderada.",
    boq: [230, 250], cama: [70, 85], vent: [30, 60], cam: "Opcional", boquilla: "Estándar (latón)",
    sec: "65 °C · 4–6 h", dens: "1.27", hdt: "≈ 70",
    req: { camara: false, endurecida: false, secado: false },
    r: { rigidez: 3, calor: 2, impacto: 3, flex: 2, uv: 3, quim: 4, facil: 4 },
    ap: ["Piezas funcionales de uso general", "Carcasas y protecciones", "Contacto con humedad y químicos suaves"],
    pr: ["Tiende a formar hilos (stringing): ajustar retracción y temperatura.", "Se adhiere en exceso a PEI liso: usar adhesivo separador.", "Más rayable que ABS/ASA."],
  },
  {
    id: "asa", nombre: "ASA", familia: "Acrilonitrilo estireno acrilato",
    desc: "Alternativa a ABS con resistencia UV e intemperie. Adecuado para exterior y piezas expuestas a temperatura.",
    boq: [240, 260], cama: [90, 110], vent: [0, 30], cam: "Requerida", boquilla: "Estándar (latón)",
    sec: "80 °C · 4 h", dens: "1.07", hdt: "≈ 95",
    req: { camara: true, endurecida: false, secado: false },
    r: { rigidez: 3, calor: 3, impacto: 3, flex: 2, uv: 5, quim: 3, facil: 3 },
    ap: ["Piezas de exterior y expuestas al sol", "Componentes automotrices y de maquinaria", "Carcasas con acabado por vapor de acetona"],
    pr: ["Requiere cámara cerrada para evitar warping y delaminación.", "Emite vapores al imprimir: ventilación o filtración obligatoria.", "Contracción alta: compensar en piezas grandes."],
  },
  {
    id: "tpu", nombre: "TPU", familia: "Poliuretano termoplástico (95A)",
    desc: "Elastómero flexible con alta resistencia a abrasión y fatiga. Ideal para piezas que deben doblarse o amortiguar.",
    boq: [220, 240], cama: [30, 60], vent: [50, 100], cam: "No requerida", boquilla: "Estándar (latón)",
    sec: "55 °C · 6–8 h", dens: "1.21", hdt: "n/a (elastómero)",
    req: { camara: false, endurecida: false, secado: true },
    r: { rigidez: 1, calor: 2, impacto: 5, flex: 5, uv: 3, quim: 4, facil: 2 },
    ap: ["Sellos, juntas y amortiguadores", "Fundas, topes y protecciones", "Agarres y piezas antivibración"],
    pr: ["Imprimir lento (≈ 20–40 mm/s) y con retracción mínima o nula.", "Preferir extrusor de accionamiento directo.", "Evitar puentes largos y soportes densos: son difíciles de retirar."],
  },
  {
    id: "pa-cf", nombre: "PA-CF", familia: "Poliamida reforzada con fibra de carbono",
    desc: "Material de ingeniería con alta rigidez, estabilidad térmica y resistencia mecánica. Para piezas de carga y herramentales.",
    boq: [260, 290], cama: [80, 100], vent: [0, 20], cam: "Recomendada", boquilla: "Endurecida (acero / carburo)",
    sec: "80 °C · 8–12 h", dens: "1.10–1.20", hdt: "120–180",
    req: { camara: true, endurecida: true, secado: true },
    r: { rigidez: 5, calor: 5, impacto: 3, flex: 1, uv: 3, quim: 4, facil: 1 },
    ap: ["Herramentales, plantillas y fixtures", "Piezas estructurales y soportes de carga", "Reemplazo de piezas metálicas ligeras"],
    pr: ["Muy higroscópico: secar antes de imprimir y almacenar sellado.", "Abrasivo: usar boquilla endurecida obligatoriamente.", "Polvo de fibra: evitar lijado en seco sin protección respiratoria."],
  },
  {
    id: "abs", nombre: "ABS", familia: "Acrilonitrilo butadieno estireno",
    desc: "Termoplástico técnico clásico: tenaz, resistente a temperatura moderada y fácil de post-procesar (lijado, pegado, alisado con vapor de acetona).",
    boq: [230, 260], cama: [90, 110], vent: [0, 30], cam: "Requerida", boquilla: "Estándar (latón)",
    sec: "80 °C · 4 h", dens: "1.04", hdt: "≈ 95",
    req: { camara: true, endurecida: false, secado: false },
    r: { rigidez: 3, calor: 3, impacto: 4, flex: 2, uv: 2, quim: 3, facil: 3 },
    ap: ["Carcasas y piezas funcionales con temperatura", "Piezas que requieren lijado, pegado o alisado con vapor", "Prototipos de ingeniería y herramentales ligeros"],
    pr: ["Requiere cámara cerrada: sin ella warping y delaminación entre capas.", "Emite vapores (estireno) al imprimir: ventilación o filtración obligatoria.", "Se degrada con la radiación UV: para exterior preferir ASA."],
  },
  {
    id: "pp", nombre: "PP", familia: "Polipropileno",
    desc: "Poliolefina ligera con excelente resistencia química y fatiga. Permite bisagras vivas, pero es de los materiales más difíciles de adherir y estabilizar.",
    boq: [220, 250], cama: [80, 100], vent: [30, 60], cam: "Recomendada", boquilla: "Estándar (latón)",
    sec: "55 °C · 4 h", dens: "0.90–0.95", hdt: "≈ 90",
    req: { camara: true, endurecida: false, secado: false },
    r: { rigidez: 2, calor: 3, impacto: 4, flex: 3, uv: 2, quim: 5, facil: 1 },
    ap: ["Contenedores, tuberías y piezas en contacto con químicos", "Bisagras vivas y piezas con fatiga por flexión", "Piezas ligeras que deben flotar (densidad < 1 g/cm³)"],
    pr: ["Adhesión a cama muy baja: usar superficie o cinta de PP.", "Warping elevado: cámara cerrada y esquinas redondeadas.", "No se pega con adhesivos comunes ni se pinta sin tratamiento superficial."],
  },
  {
    id: "petg-cf", nombre: "PETG-CF", familia: "PETG reforzado con fibra de carbono",
    desc: "PETG cargado con fibra corta: más rígido y dimensionalmente estable, con acabado mate y buena imprimibilidad para un material técnico.",
    boq: [240, 270], cama: [65, 80], vent: [30, 60], cam: "Opcional", boquilla: "Endurecida (acero / carburo)",
    sec: "65 °C · 6–8 h", dens: "1.25–1.35", hdt: "≈ 75",
    req: { camara: false, endurecida: true, secado: true },
    r: { rigidez: 4, calor: 2, impacto: 2, flex: 1, uv: 3, quim: 4, facil: 3 },
    ap: ["Fixtures, soportes y brackets rígidos", "Estructuras de dron, RC y robótica", "Piezas con acabado mate sin post-procesado"],
    pr: ["Abrasivo: usar boquilla endurecida obligatoriamente.", "Menor tenacidad al impacto que el PETG sin carga.", "Polvo de fibra: evitar lijado en seco sin protección respiratoria."],
  },
  {
    id: "pc-cf", nombre: "PC-CF", familia: "Policarbonato reforzado con fibra de carbono",
    desc: "Material de altas prestaciones: rigidez y resistencia térmica superiores, para herramentales y piezas estructurales exigentes.",
    boq: [270, 310], cama: [100, 120], vent: [0, 20], cam: "Requerida (calefactada)", boquilla: "Endurecida (acero / carburo)",
    sec: "80 °C · 8–12 h", dens: "1.20–1.25", hdt: "125–140",
    req: { camara: true, endurecida: true, secado: true },
    r: { rigidez: 5, calor: 5, impacto: 4, flex: 1, uv: 2, quim: 3, facil: 1 },
    ap: ["Herramentales y fixtures para alta temperatura", "Piezas estructurales aeronáuticas y automotrices", "Reemplazo de piezas metálicas en carga y calor"],
    pr: ["Requiere hotend de alta temperatura (≥ 300 °C) y cámara calefactada.", "Muy higroscópico: secar antes de imprimir y almacenar sellado.", "Warping y delaminación severos sin cama a 100 °C o más.", "Abrasivo: boquilla endurecida obligatoria."],
  },
];

/* Fichas técnicas (TDS) de fabricantes. tipo: "pdf" = PDF directo; "web" = página oficial del producto.
   Solo enlaces oficiales de cada marca verificados. Falta de entrada = la marca no publica TDS de ese material. */
const SUNLU = "SUNLU", CREALITY = "Creality", POLYMAKER = "Polymaker", BAMBU = "Bambu Lab";
const PMK = "https://wiki.polymaker.com/polymaker-products/more-about-our-products/documents/technical-data-sheets/";
const BBL = "https://wiki.bambulab.com/filament-acc/";
const SLU = "https://media.sunlu.com/prod/";
const CRE = "https://store.creality.com/products/";
const TDS = {
  pla: [
    { marca: SUNLU, producto: "PLA", tipo: "pdf", url: SLU + "20260618/73632671781747576290.pdf?filename=TDS" },
    { marca: CREALITY, producto: "Hyper PLA", tipo: "web", url: CRE + "hyper-series-pla-3d-printing-filament-1kg" },
    { marca: POLYMAKER, producto: "PolyLite PLA", tipo: "web", url: PMK + "pla/polylite-tm-pla" },
    { marca: BAMBU, producto: "PLA Basic", tipo: "pdf", url: BBL + "abs-asa-pc/bambu_pla_basic_technical_data_sheet.pdf" },
  ],
  petg: [
    { marca: SUNLU, producto: "PETG", tipo: "pdf", url: SLU + "20260330/f27808f0-3a19-49e3-bd79-6e846d6f4c15.pdf?filename=TDS" },
    { marca: CREALITY, producto: "Hyper PETG", tipo: "web", url: CRE + "hyper-series-petg-3d-printing-filament-1kg" },
    { marca: POLYMAKER, producto: "PolyLite PETG", tipo: "web", url: PMK + "petg-pet/polylite-tm-petg" },
    { marca: BAMBU, producto: "PETG Basic", tipo: "pdf", url: "https://store.bblcdn.com/s1/default/cb94589bf7994fdcbfa833badefae9cd/Bambu_PETG_Basic_Technical_Data_Sheet.pdf" },
  ],
  asa: [
    { marca: SUNLU, producto: "ASA", tipo: "pdf", url: SLU + "20260330/7d61617c-7540-4ae2-88d3-a0d206e5d801.pdf?filename=TDS" },
    { marca: CREALITY, producto: "HP ASA", tipo: "web", url: CRE + "creality-hp-asa-3d-printing-filament" },
    { marca: POLYMAKER, producto: "Polymaker ASA", tipo: "web", url: PMK + "abs-asa/polymaker-tm-asa" },
    { marca: BAMBU, producto: "ASA", tipo: "pdf", url: BBL + "abs-asa-pc/6eaf4c432d1d4014a1975e55a55ed00b.pdf" },
  ],
  tpu: [
    { marca: SUNLU, producto: "TPU 95A", tipo: "pdf", url: SLU + "20260330/e8b9c06a-4b93-46cb-9532-d9deb185a7c8.pdf?filename=TDS" },
    { marca: CREALITY, producto: "HP TPU", tipo: "web", url: CRE + "hp-tpu-fdm-3d-printer-filament-1-75mm-1kg" },
    { marca: POLYMAKER, producto: "PolyFlex TPU95", tipo: "web", url: PMK + "tpu/polyflex-tm-tpu95" },
    { marca: BAMBU, producto: "TPU 95A HF", tipo: "pdf", url: "https://store.bblcdn.com/58df32731eab4c90a7dac9b12e13ba88.pdf" },
  ],
  "pa-cf": [
    { marca: SUNLU, producto: "PA6-CF", tipo: "pdf", url: SLU + "20260330/68c0ccf4-9059-4b50-ad40-95ba3634f0ae.pdf?filename=TDS" },
    { marca: SUNLU, producto: "PA12-CF", tipo: "pdf", url: SLU + "20260330/93d827f4-50e9-45b4-8b24-bf5ddaf8273f.pdf?filename=TDS" },
    { marca: POLYMAKER, producto: "Fiberon PA6-CF20", tipo: "web", url: PMK + "nylon/fiberon-tm-pa6-cf20" },
    { marca: BAMBU, producto: "PA6-CF", tipo: "pdf", url: BBL + "petcf-ppacf/c750bddfb8e44af6ae9f7dd9625fa458.pdf" },
    { marca: BAMBU, producto: "PAHT-CF", tipo: "pdf", url: BBL + "asacf-pahtcf/65f1b18a6d6142d794a1a6a00f1496ef.pdf" },
  ],
  abs: [
    { marca: SUNLU, producto: "ABS", tipo: "pdf", url: SLU + "20260327/499dacc6-a1e4-4f81-b1ae-8bf1b8e424ec.pdf?filename=TDS" },
    { marca: CREALITY, producto: "Hyper ABS", tipo: "web", url: CRE + "hyper-abs" },
    { marca: POLYMAKER, producto: "PolyLite ABS", tipo: "web", url: PMK + "abs-asa/polylite-tm-abs" },
    { marca: BAMBU, producto: "ABS", tipo: "pdf", url: BBL + "abs-asa-pc/bambu_abs_technical_data_sheet_v3.pdf" },
  ],
  pp: [
    { marca: SUNLU, producto: "PP", tipo: "pdf", url: SLU + "20260413/fbfe6e74-b29f-4f0f-a9b3-84aaa6b2fc85.pdf?filename=TDS" },
  ],
  "petg-cf": [
    { marca: SUNLU, producto: "PETG-CF", tipo: "pdf", url: SLU + "20260330/433432a8-dfcb-485e-bd8e-a7be94dda4ce.pdf?filename=TDS" },
    { marca: POLYMAKER, producto: "Fiberon PETG-rCF08 (fibra reciclada)", tipo: "web", url: PMK + "petg-pet/fiberon-tm-petg-rcf08" },
  ],
  "pc-cf": [
    { marca: SUNLU, producto: "PC (sin fibra)", tipo: "pdf", url: SLU + "20260330/46dca9d5-d877-4a9d-b416-3ad38450204a.pdf?filename=TDS", base: true },
    { marca: CREALITY, producto: "Hyper PC (sin fibra)", tipo: "web", url: CRE + "hyper-pc-filament-1-75mm-1kg", base: true },
    { marca: POLYMAKER, producto: "PolyMax PC (sin fibra)", tipo: "web", url: PMK + "polycarbonate/polymax-tm-pc", base: true },
    { marca: BAMBU, producto: "PC (sin fibra)", tipo: "pdf", url: BBL + "abs-asa-pc/a52afdccddfd448583d119587122c8c5.pdf", base: true },
  ],
};
const TDS_NOTAS = {
  "pc-cf": "No se encontró un TDS de PC-CF en ninguna de estas cuatro marcas. Se enlazan los TDS del policarbonato base como referencia; la versión con fibra de carbono es más rígida y más abrasiva.",
  pp: "Solo SUNLU tiene TDS de PP entre estas marcas.",
  "petg-cf": "No se encontró TDS oficial de PETG-CF de Bambu Lab ni de Creality.",
  "pa-cf": "No se encontró TDS de PA-CF de Creality.",
};
MATERIALES.forEach((m) => { m.tds = TDS[m.id] || []; m.tdsNota = TDS_NOTAS[m.id] || ""; });

const PROPS = [
  ["facil", "Facilidad de impresión"], ["rigidez", "Rigidez"], ["impacto", "Tenacidad al impacto"],
  ["flex", "Flexibilidad"], ["calor", "Resistencia al calor"], ["uv", "Resistencia UV / exterior"], ["quim", "Resistencia química"],
];
const NECESIDADES = [
  ["todos", "Todos", null],
  ["facil", "Fácil de imprimir", "facil"],
  ["uv", "Exterior / UV", "uv"],
  ["flex", "Flexible", "flex"],
  ["calor", "Alta temperatura", "calor"],
  ["rigidez", "Rigidez / carga", "rigidez"],
];
const ESCALA = { boq: [180, 320], cama: [20, 120] };
const MARCAS = ["SUNLU", "Creality", "Polymaker", "Bambu Lab"];
const enlace = (t, txt) => `<a href="${t.url}" target="_blank" rel="noopener noreferrer">${txt}</a>`;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const rango = (a) => (a[0] === a[1] ? `${a[0]}` : `${a[0]}–${a[1]}`);

function barra(key, val) {
  const [lo, hi] = ESCALA[key];
  const l = ((val[0] - lo) / (hi - lo)) * 100;
  const w = Math.max(((val[1] - val[0]) / (hi - lo)) * 100, 2);
  return `<span class="rng" aria-hidden="true"><i style="left:${l}%;width:${w}%"></i></span>`;
}
function medidor(n) {
  let s = "";
  for (let i = 1; i <= 5; i++) s += `<i class="${i <= n ? "on" : ""}"></i>`;
  return `<span class="med" role="img" aria-label="${n} de 5">${s}</span>`;
}

/* ---------- estado ---------- */
const estado = { activos: new Set(MATERIALES.map((m) => m.id)), necesidad: "todos", ficha: MATERIALES[0].id };

function coincide(m) {
  const n = NECESIDADES.find((x) => x[0] === estado.necesidad);
  return !n[2] || m.r[n[2]] >= 4;
}

/* ---------- selector de necesidad ---------- */
function pintarNecesidades() {
  $("#necesidades").innerHTML = NECESIDADES.map(
    ([id, txt]) => `<button type="button" class="pill" data-nec="${id}" aria-pressed="${id === estado.necesidad}">${txt}</button>`
  ).join("");
  const n = NECESIDADES.find((x) => x[0] === estado.necesidad);
  const ok = MATERIALES.filter(coincide).map((m) => m.nombre);
  $("#nec-resultado").innerHTML = n[2]
    ? `<span class="label">Recomendados</span> ${ok.length ? ok.map((x) => `<b>${x}</b>`).join(", ") : "Ninguno de este catálogo"} <span class="sub">(nivel 4–5 de 5 en “${PROPS.find((p) => p[0] === n[2])[1]}”)</span>`
    : `<span class="sub">Elige un requisito para resaltar los materiales que lo cumplen.</span>`;
}

/* ---------- comparador ---------- */
function pintarToggles() {
  $("#toggles").innerHTML = MATERIALES.map(
    (m) => `<button type="button" class="pill" data-mat="${m.id}" aria-pressed="${estado.activos.has(m.id)}">${m.nombre}</button>`
  ).join("");
}

function pintarTabla() {
  const cols = MATERIALES.filter((m) => estado.activos.has(m.id));
  const th = cols.map((m) => `<th scope="col" class="${estado.necesidad !== "todos" && coincide(m) ? "hit" : ""}"><a href="#${m.id}" data-ficha="${m.id}">${m.nombre}</a></th>`).join("");
  const grupo = (t) => `<tr class="grupo"><th colspan="${cols.length + 1}">${t}</th></tr>`;
  const fila = (k, fn) => `<tr><th scope="row">${k}</th>${cols.map((m) => `<td>${fn(m)}</td>`).join("")}</tr>`;
  const rng = (key) => (m) => `<span class="v">${rango(m[key])}</span>${barra(key, m[key])}`;
  const cuerpo = [
    grupo("Impresión"),
    fila("Temp. boquilla (°C)", rng("boq")),
    fila("Temp. cama (°C)", rng("cama")),
    fila("Ventilador de capa (%)", (m) => `<span class="v">${rango(m.vent)}</span>`),
    fila("Cámara cerrada", (m) => `<span class="v">${m.cam}</span>`),
    fila("Boquilla", (m) => `<span class="v">${m.boquilla}</span>`),
    fila("Secado", (m) => `<span class="v">${m.sec}</span>`),
    grupo("Propiedades relativas (1–5)"),
    ...PROPS.map(([k, t]) => fila(t, (m) => medidor(m.r[k]))),
    grupo("Datos"),
    fila("Densidad (g/cm³)", (m) => `<span class="v">${m.dens}</span>`),
    fila("HDT aprox. (°C)", (m) => `<span class="v">${m.hdt}</span>`),
    grupo("Fichas técnicas (TDS)"),
    ...MARCAS.map((marca) => fila(marca, (m) => {
      const ls = m.tds.filter((t) => t.marca === marca);
      return ls.length ? `<span class="tds-c">${ls.map((t) => enlace(t, `${t.producto}<span class="ext" aria-hidden="true"> ↗</span>`)).join("")}</span>` : `<span class="sub">—</span>`;
    })),
  ].join("");
  $("#tabla").innerHTML = cols.length
    ? `<thead><tr><th scope="col"></th>${th}</tr></thead><tbody>${cuerpo}</tbody>`
    : `<tbody><tr><td class="vacio">Activa al menos un material para comparar.</td></tr></tbody>`;
}

/* ---------- fichas ---------- */
function pintarTabs() {
  $("#tabs").innerHTML = MATERIALES.map(
    (m, i) => `<button type="button" role="tab" id="tab-${m.id}" aria-selected="${m.id === estado.ficha}" aria-controls="ficha" data-ficha="${m.id}" tabindex="${m.id === estado.ficha ? 0 : -1}" class="${estado.necesidad !== "todos" && coincide(m) ? "hit" : ""}"><span class="chip">${String(i + 1).padStart(2, "0")}</span>${m.nombre}</button>`
  ).join("");
}

function pintarFicha() {
  const i = MATERIALES.findIndex((m) => m.id === estado.ficha);
  const m = MATERIALES[i];
  const badge = (on, si, no) => `<span class="badge ${on ? "warn" : "ok"}">${on ? si : no}</span>`;
  $("#ficha").setAttribute("aria-labelledby", `tab-${m.id}`);
  $("#ficha").innerHTML = `
    <div class="mat-head"><span class="chip">${String(i + 1).padStart(2, "0")}</span><div><h3>${m.nombre}</h3><p class="label">${m.familia}</p></div></div>
    <div class="mat-body">
      <div class="col-a">
        <p class="mat-desc">${m.desc}</p>
        <div class="badges">
          ${badge(m.req.camara, "Cámara cerrada", "Sin cámara")}
          ${badge(m.req.endurecida, "Boquilla endurecida", "Boquilla estándar")}
          ${badge(m.req.secado, "Secado previo obligatorio", "Secado recomendado")}
        </div>
        <h4>Parámetros</h4>
        <dl class="params">
          <div><dt>Boquilla (°C)</dt><dd><span class="v">${rango(m.boq)}</span>${barra("boq", m.boq)}<span class="esc"><em>${ESCALA.boq[0]}</em><em>${ESCALA.boq[1]}</em></span></dd></div>
          <div><dt>Cama (°C)</dt><dd><span class="v">${rango(m.cama)}</span>${barra("cama", m.cama)}<span class="esc"><em>${ESCALA.cama[0]}</em><em>${ESCALA.cama[1]}</em></span></dd></div>
          <div><dt>Ventilador (%)</dt><dd><span class="v">${rango(m.vent)}</span></dd></div>
          <div><dt>Secado</dt><dd><span class="v">${m.sec}</span></dd></div>
          <div><dt>Densidad (g/cm³)</dt><dd><span class="v">${m.dens}</span></dd></div>
          <div><dt>HDT aprox. (°C)</dt><dd><span class="v">${m.hdt}</span></dd></div>
        </dl>
      </div>
      <div class="col-b">
        <h4>Perfil de propiedades</h4>
        <ul class="perfil">${PROPS.map(([k, t]) => `<li><span>${t}</span>${medidor(m.r[k])}</li>`).join("")}</ul>
        <h4>Aplicaciones</h4>
        <ul class="lista">${m.ap.map((x) => `<li>${x}</li>`).join("")}</ul>
      </div>
    </div>
    <div class="tds">
      <h4>Fichas técnicas del fabricante (TDS)</h4>
      <ul class="tds-l">${m.tds.map((t) => `<li><span class="label">${t.marca}</span>${enlace(t, t.producto)}<span class="badge ${t.tipo === "pdf" ? "ok" : "info"}">${t.tipo === "pdf" ? "PDF" : "Página oficial"}</span></li>`).join("")}</ul>
      ${m.tdsNota ? `<p class="tds-n">${m.tdsNota}</p>` : ""}
      <p class="tds-n">Enlaces oficiales de cada marca. Las revisiones cambian: confirma la versión vigente antes de fijar parámetros.</p>
    </div>
    <div class="callout"><span class="tab-c"><i></i>Precaución</span><ul class="lista">${m.pr.map((x) => `<li>${x}</li>`).join("")}</ul></div>
    <div class="nav-fichas">
      ${i > 0 ? `<button type="button" data-ficha="${MATERIALES[i - 1].id}">← ${MATERIALES[i - 1].nombre}</button>` : "<span></span>"}
      ${i < MATERIALES.length - 1 ? `<button type="button" data-ficha="${MATERIALES[i + 1].id}">${MATERIALES[i + 1].nombre} →</button>` : "<span></span>"}
    </div>`;
}

function seleccionarFicha(id, { scroll = false, focus = false } = {}) {
  if (!MATERIALES.some((m) => m.id === id)) return;
  estado.ficha = id;
  history.replaceState(null, "", `#${id}`);
  pintarTabs();
  pintarFicha();
  if (focus) $(`#tab-${id}`).focus();
  if (scroll) $("#fichas").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- eventos ---------- */
document.addEventListener("click", (e) => {
  const nec = e.target.closest("[data-nec]");
  if (nec) {
    estado.necesidad = nec.dataset.nec;
    pintarNecesidades(); pintarTabla(); pintarTabs();
    return;
  }
  const mat = e.target.closest("[data-mat]");
  if (mat) {
    const id = mat.dataset.mat;
    if (estado.activos.has(id)) estado.activos.delete(id); else estado.activos.add(id);
    pintarToggles(); pintarTabla();
    return;
  }
  const f = e.target.closest("[data-ficha]");
  if (f) {
    e.preventDefault();
    seleccionarFicha(f.dataset.ficha, { scroll: !f.matches("[role=tab], .nav-fichas button") || f.matches(".nav-fichas button") });
  }
});
$("#tabs").addEventListener("keydown", (e) => {
  const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
  if (!k) return;
  const i = MATERIALES.findIndex((m) => m.id === estado.ficha);
  seleccionarFicha(MATERIALES[(i + k + MATERIALES.length) % MATERIALES.length].id, { focus: true });
});
window.addEventListener("hashchange", () => seleccionarFicha(location.hash.slice(1)));

pintarNecesidades();
pintarToggles();
pintarTabla();
const inicial = MATERIALES.find((m) => m.id === location.hash.slice(1));
seleccionarFicha(inicial ? inicial.id : MATERIALES[0].id);
