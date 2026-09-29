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
];

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
const ESCALA = { boq: [180, 300], cama: [20, 120] };

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
