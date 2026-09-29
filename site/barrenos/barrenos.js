/* Guía de barrenos — datos y render.
   Todo se almacena en mm (ANSI en pulgadas y se convierte). Valores de referencia de taller: verifica con tu proveedor. */

// [rosca, paso, machuelo corte, machuelo formado, fino, normal, holgado, Ø cabeza Allen, cajeado Ø, cajeado prof.]
const METRICAS = [
  ["M1.6", 0.35, 1.25, 1.45, 1.7, 1.8, 2.0, 3.0, null, null],
  ["M2", 0.4, 1.6, 1.8, 2.2, 2.4, 2.6, 3.8, null, null],
  ["M2.5", 0.45, 2.05, 2.3, 2.7, 2.9, 3.1, 4.5, null, null],
  ["M3", 0.5, 2.5, 2.8, 3.2, 3.4, 3.6, 5.5, 6.5, 3.4],
  ["M4", 0.7, 3.3, 3.7, 4.3, 4.5, 4.8, 7, 8, 4.6],
  ["M5", 0.8, 4.2, 4.6, 5.3, 5.5, 5.8, 8.5, 10, 5.7],
  ["M6", 1, 5.0, 5.55, 6.4, 6.6, 7, 10, 11, 6.8],
  ["M8", 1.25, 6.8, 7.4, 8.4, 9, 10, 13, 15, 9],
  ["M10", 1.5, 8.5, 9.3, 10.5, 11, 12, 16, 18, 11],
  ["M12", 1.75, 10.2, 11.2, 13, 13.5, 14.5, 18, 20, 13],
  ["M14", 2, 12, null, 15, 15.5, 16.5, 21, null, null],
  ["M16", 2, 14, null, 17, 17.5, 18.5, 24, null, null],
  ["M20", 2.5, 17.5, null, 21, 22, 24, 30, null, null],
  ["M24", 3, 21, null, 25, 26, 28, 36, null, null],
];
const METRICAS_FINO = [
  ["M6×0.75", 0.75, 5.2], ["M8×1", 1, 7.0], ["M10×1", 1, 9.0], ["M10×1.25", 1.25, 8.8],
  ["M12×1.25", 1.25, 10.8], ["M12×1.5", 1.5, 10.5], ["M14×1.5", 1.5, 12.5],
  ["M16×1.5", 1.5, 14.5], ["M20×1.5", 1.5, 18.5], ["M24×2", 2, 22],
];
const csD = d => Math.round(parseFloat(d.slice(1)) * 2.24 * 10) / 10; // ISO 10642, cabeza plana

// [rosca, serie, hilos/pulg, Ø nominal (in), designación broca, Ø broca (in)]
const ANSI = [
  ["#2-56", "UNC", 56, 0.0860, "#50", 0.0700],
  ["#3-48", "UNC", 48, 0.0990, "#47", 0.0785],
  ["#4-40", "UNC", 40, 0.1120, "#43", 0.0890],
  ["#5-40", "UNC", 40, 0.1250, "#38", 0.1015],
  ["#6-32", "UNC", 32, 0.1380, "#36", 0.1065],
  ["#8-32", "UNC", 32, 0.1640, "#29", 0.1360],
  ["#10-24", "UNC", 24, 0.1900, "#25", 0.1495],
  ["#10-32", "UNF", 32, 0.1900, "#21", 0.1590],
  ["#12-24", "UNC", 24, 0.2160, "#16", 0.1770],
  ["#12-28", "UNF", 28, 0.2160, "#14", 0.1820],
  ["1/4\"-20", "UNC", 20, 0.2500, "#7", 0.2010],
  ["1/4\"-28", "UNF", 28, 0.2500, "#3", 0.2130],
  ["5/16\"-18", "UNC", 18, 0.3125, "F", 0.2570],
  ["5/16\"-24", "UNF", 24, 0.3125, "I", 0.2720],
  ["3/8\"-16", "UNC", 16, 0.3750, "5/16\"", 0.3125],
  ["3/8\"-24", "UNF", 24, 0.3750, "Q", 0.3320],
  ["7/16\"-14", "UNC", 14, 0.4375, "U", 0.3680],
  ["1/2\"-13", "UNC", 13, 0.5000, "27/64\"", 0.4219],
  ["1/2\"-20", "UNF", 20, 0.5000, "29/64\"", 0.4531],
  ["9/16\"-12", "UNC", 12, 0.5625, "31/64\"", 0.4844],
  ["5/8\"-11", "UNC", 11, 0.6250, "17/32\"", 0.5312],
  ["3/4\"-10", "UNC", 10, 0.7500, "21/32\"", 0.6562],
  ["7/8\"-9", "UNC", 9, 0.8750, "49/64\"", 0.7656],
  ["1\"-8", "UNC", 8, 1.0000, "7/8\"", 0.8750],
];

// Inserto por calor: [clave, Ø rosca, barreno Tritic, Ø ext. inserto, largo típico]
const INSERTOS = [
  ["M2", 2, 3.5, 3.5, 4],
  ["M3", 3, 4.7, 5, 5.7],
  ["M4", 4, 5.6, 6, 8.1],
  ["M5", 5, 6.6, 7, 9.5],
  ["M6", 6, 7.6, 8, 12.7],
];

// Pines: [nominal, H7 tolerancia sup (mm), m6 [min, max], H12 tolerancia sup]
const PINES = [
  [2, 0.010, [0.002, 0.008], 0.10], [3, 0.010, [0.002, 0.008], 0.12],
  [4, 0.012, [0.004, 0.012], 0.12], [5, 0.012, [0.004, 0.012], 0.12],
  [6, 0.012, [0.004, 0.012], 0.15], [8, 0.015, [0.006, 0.015], 0.15],
  [10, 0.015, [0.006, 0.015], 0.15], [12, 0.018, [0.007, 0.018], 0.18],
  [16, 0.018, [0.007, 0.018], 0.18],
];

const TUBERIA = [
  ["NPT", "1/8\"-27", "11/32\"", 11 / 32], ["NPT", "1/4\"-18", "7/16\"", 7 / 16],
  ["NPT", "3/8\"-18", "37/64\"", 37 / 64], ["NPT", "1/2\"-14", "23/32\"", 23 / 32],
  ["NPT", "3/4\"-14", "59/64\"", 59 / 64], ["NPT", "1\"-11½", "1-5/32\"", 1 + 5 / 32],
  ["BSP G", "G 1/8-28", "8.8 mm", 8.8 / 25.4], ["BSP G", "G 1/4-19", "11.8 mm", 11.8 / 25.4],
  ["BSP G", "G 3/8-19", "15.25 mm", 15.25 / 25.4], ["BSP G", "G 1/2-14", "19 mm", 19 / 25.4],
  ["BSP G", "G 3/4-14", "24.5 mm", 24.5 / 25.4], ["BSP G", "G 1-11", "30.75 mm", 30.75 / 25.4],
];

const AJUSTES = [
  { id: "presion", n: "A presión", off: 0.10, t: "Pin, imán o rodamiento que debe quedar fijo" },
  { id: "cenido", n: "Ceñido", off: 0.20, t: "Eje o pin que gira con fricción o se retira a mano con esfuerzo" },
  { id: "libre", n: "Libre", off: 0.30, t: "Tornillo pasante, varilla o pin que debe entrar sin esfuerzo" },
  { id: "holgado", n: "Holgado", off: 0.50, t: "Alineación aproximada, tolerar error de posición entre piezas" },
];
const OFF_HOR = 0.10;
const PRESETS = [2, 3, 4, 5, 6, 8, 10, 12];
const TAM = ["M2", "M2.5", "M3", "M4", "M5", "M6", "M8", "M10", "M12"];

// Series de brocas para el buscador (Ø en mm)
const BROCAS = (() => {
  const mm = [];
  for (let d = 5; d <= 100; d++) mm.push([d / 10 + " mm", d / 10]);
  for (let d = 105; d <= 200; d += 5) mm.push([d / 10 + " mm", d / 10]);
  const num = [.2280,.2210,.2130,.2090,.2055,.2040,.2010,.1990,.1960,.1935,.1910,.1890,.1850,.1820,.1800,.1770,.1730,.1695,.1660,.1610,
    .1590,.1570,.1540,.1520,.1495,.1470,.1440,.1405,.1360,.1285,.1200,.1160,.1130,.1110,.1100,.1065,.1040,.1015,.0995,.0980,
    .0960,.0935,.0890,.0860,.0820,.0810,.0785,.0760,.0730,.0700,.0670,.0635,.0595,.0550,.0520,.0465,.0430,.0420,.0410,.0400]
    .map((v, i) => ["#" + (i + 1), v * 25.4]);
  const let_ = [.2340,.2380,.2420,.2460,.2500,.2570,.2610,.2660,.2720,.2770,.2810,.2900,.2950,.3020,.3160,.3230,.3320,.3390,.3480,.3580,
    .3680,.3770,.3860,.3970,.4040,.4130].map((v, i) => [String.fromCharCode(65 + i), v * 25.4]);
  const fr = [];
  for (let n = 4; n <= 64; n++) {
    let a = n, b = 64; while (a % 2 === 0) { a /= 2; b /= 2; }
    fr.push([a + "/" + b + "\"", n / 64 * 25.4]);
  }
  return [["Milimétricas", mm], ["Fracciones", fr], ["Números (#)", num], ["Letras", let_]];
})();

/* ---------- Estado y utilidades ---------- */
const $ = s => document.querySelector(s);
const KEY = "tt-barrenos-";
const load = (k, d) => { try { return localStorage.getItem(KEY + k) ?? d; } catch (e) { return d; } };
const save = (k, v) => { try { localStorage.setItem(KEY + k, v); } catch (e) {} };
const st = {
  unit: load("unit", "mm") === "in" ? "in" : "mm",
  sel: load("sel", "M3"),
  fit: load("fit", "libre"),
  cal: parseFloat(load("cal", "0")) || 0,
  hor: false, q: "", nom: 3, broca: 4.2,
};
const IN = () => st.unit === "in";
const U = () => (IN() ? "in" : "mm");
const trim = s => s.replace(/(\.\d)0+$/, "$1");
const fm = mm => (IN() ? (mm / 25.4).toFixed(4) : trim(mm.toFixed(3)));          // valor
const fx = mm => (IN() ? (mm / 25.4).toFixed(4) : mm.toFixed(3));                // 3 decimales fijos (tolerancias)
const fi = inch => (IN() ? inch.toFixed(4) : trim((inch * 25.4).toFixed(3)));    // desde pulgadas
const val = (txt, extra = "") => `<button class="val${extra}" type="button" data-c="${txt}" title="Copiar">${txt}</button>`;
const dash = '<span class="sub">—</span>';
const opt = (v, fn) => (v == null ? dash : fn(v));

function fila(k, hay, celdas) {
  const e = t => t.replace(/"/g, "&quot;");
  return `<tr data-k="${e(k)}" data-q="${e(hay.toLowerCase())}">${celdas.join("")}</tr>`;
}
const th = (t, cls = "") => `<th scope="row" class="${cls}">${t}</th>`;
const td = (t, cls = "n") => `<td class="${cls}">${t}</td>`;
const grupo = (t, n) => `<tr class="grupo"><th colspan="${n}">${t}</th></tr>`;
const head = cols => `<thead><tr>${cols.map((c, i) => `<th class="${i ? "n" : ""}">${c}</th>`).join("")}</tr></thead>`;

/* ---------- Render de tablas ---------- */
function tMetrica() {
  const u = U();
  let h = head(["Rosca", "Paso (mm)", `Machuelo (${u})`, `Formado (${u})`]);
  h += "<tbody>" + grupo("Paso grueso", 4);
  METRICAS.forEach(r => {
    h += fila(r[0], `${r[0]} m${r[0].slice(1)}x${r[1]} grueso`, [th(r[0]), td(`<span class="v">${r[1]}</span>`), td(val(fm(r[2]))), td(opt(r[3], v => val(fm(v))))]);
  });
  h += grupo("Paso fino", 4);
  METRICAS_FINO.forEach(r => {
    h += fila(r[0], `${r[0]} fino`, [th(r[0]), td(`<span class="v">${r[1]}</span>`), td(val(fm(r[2]))), td(dash)]);
  });
  return h + "</tbody>";
}

function tPasante() {
  const u = U();
  let h = head(["Rosca", `Ajustado (${u})`, `Normal (${u})`, `Holgado (${u})`, `Cabeza Allen Ø (${u})`, `Cajeado Ø × prof. (${u})`, `Avellanado Ø (${u})`]);
  h += "<tbody>";
  METRICAS.forEach(r => {
    const cb = r[8] == null ? dash : `${val(fm(r[8]))} × ${val(fm(r[9]))}`;
    const cs = r[0] === "M1.6" ? dash : val(fm(csD(r[0])));
    h += fila(r[0], `${r[0]} pasante clearance cajeado avellanado`, [th(r[0]), td(val(fm(r[4]))), td(val(fm(r[5]))), td(val(fm(r[6]))), td(val(fm(r[7]))), td(cb), td(cs)]);
  });
  return h + "</tbody>";
}

function tAnsi() {
  const u = U();
  let h = head(["Rosca", "Serie", "Hilos / pulg", `Ø nominal (${u})`, "Broca", `Ø broca (${u})`]);
  h += "<tbody>" + grupo("Tornillos por número (#)", 6);
  const num = ANSI.filter(r => r[0][0] === "#"), fra = ANSI.filter(r => r[0][0] !== "#");
  const rows = a => a.map(r => fila(r[0], `${r[0]} ${r[1]} ${r[4]} ${r[0].replace(/["\-]/g, " ")}`, [th(r[0]), td(`<span class="v">${r[1]}</span>`), td(`<span class="v">${r[2]}</span>`), td(`<span class="v">${fi(r[3])}</span>`), td(`<span class="v">${r[4]}</span>`), td(val(fi(r[5])))])).join("");
  h += rows(num) + grupo("Fraccionales", 6) + rows(fra);
  return h + "</tbody>";
}

function tInsertos() {
  const u = U();
  let h = head(["Inserto", `Ø rosca (${u})`, `Barreno (${u})`, `Ø ext. inserto (${u})`, `Largo típico (${u})`, `Prof. barreno (${u})`]);
  h += "<tbody>";
  INSERTOS.forEach(r => {
    h += fila(r[0], `inserto ${r[0]} heat set`, [th("Inserto " + r[0]), td(`<span class="v">${fm(r[1])}</span>`), td(val(fm(r[2]))), td(`<span class="v">${fm(r[3])}</span>`), td(`<span class="v">${fm(r[4])}</span>`), td(val(fm(r[4] + 1)))]);
  });
  return h + "</tbody>";
}

function tPines() {
  const u = U();
  let h = head(["Ø nominal", `Barreno previo (${u})`, `Agujero H7 rimado (${u})`, `Pin m6 (${u})`, `Elástico: agujero H12 (${u})`]);
  h += "<tbody>";
  PINES.forEach(([d, h7, m6, h12]) => {
    const rango = (a, b) => val(`${fx(a)}–${fx(b)}`);
    h += fila("pin" + d, `pin dowel pasador ${d} mm`, [th(fm(d) + " " + U()), td(val(fm(d - 0.2))), td(rango(d, d + h7)), td(rango(d + m6[0], d + m6[1])), td(rango(d, d + h12))]);
  });
  return h + "</tbody>";
}

function tFits() {
  const u = U();
  let h = head(["Ajuste", `Añadir al Ø nominal (${u})`, "Uso"]);
  h += "<tbody>";
  AJUSTES.forEach(a => {
    h += fila("fit-" + a.id, `ajuste ${a.n} impresion 3d tolerancia`, [th(a.n), td(`<span class="v">+${fm(a.off)}</span>`), `<td>${a.t}</td>`]);
  });
  h += fila("fit-h", "horizontal", [th("Agujero horizontal"), td(`<span class="v">+${fm(OFF_HOR)}</span>`), "<td>Suma extra: el arco superior sin soporte cae y el agujero queda ovalado</td>"]);
  return h + "</tbody>";
}

function tTuberia() {
  const u = U();
  let h = head(["Tipo", "Rosca", "Broca", `Ø broca (${u})`]);
  h += "<tbody>";
  TUBERIA.forEach(r => {
    h += fila(r[1], `${r[0]} ${r[1]} tuberia pipe`, [th(r[0]), td(`<span class="v">${r[1]}</span>`), td(`<span class="v">${r[2]}</span>`), td(val(fi(r[3])))]);
  });
  return h + "</tbody>";
}

/* ---------- Consulta rápida ---------- */
function tiles() {
  const m = METRICAS.find(r => r[0] === st.sel), ins = INSERTOS.find(r => r[0] === st.sel);
  if (!m) return;
  const t = (k, v, s = "") => `<div class="tile"><span class="label">${k}</span><div class="tv">${v}</div><div class="ts">${s}</div></div>`;
  const cs = csD(m[0]);
  $("#tiles").innerHTML =
    t("Machuelo", val(fm(m[2])), `${U()} · paso ${m[1]} mm`) +
    t("Machuelo formado", opt(m[3], v => val(fm(v))), U() + " · sin viruta") +
    t("Pasante ajustado", val(fm(m[4])), U()) +
    t("Pasante normal", val(fm(m[5])), U()) +
    t("Pasante holgado", val(fm(m[6])), U()) +
    t("Cajeado (Allen)", m[8] == null ? dash : val(fm(m[8])), m[8] == null ? "" : `${U()} · prof. ${fm(m[9])}`) +
    t("Avellanado 90°", m[0] === "M1.6" ? dash : val(fm(cs)), U() + " · cabeza plana") +
    t("Inserto por calor", ins ? val(fm(ins[2])) : dash, ins ? `${U()} · prof. ${fm(ins[4] + 1)}` : "no probado");
}

function pills() {
  $("#sizes").innerHTML = TAM.map(s => `<button class="pill" type="button" data-s="${s}" aria-pressed="${s === st.sel}">${s}</button>`).join("");
}

/* ---------- Calculadora de impresión 3D ---------- */
function calc() {
  const nom = IN() ? st.nom * 25.4 : st.nom;
  const fit = AJUSTES.find(a => a.id === st.fit) || AJUSTES[2];
  const total = nom + fit.off + (st.hor ? OFF_HOR : 0) + st.cal;
  const ok = isFinite(total) && nom > 0;
  const b = $("#c-res");
  b.textContent = ok ? fm(total) + " " + U() : "—";
  b.dataset.c = ok ? fm(total) : "";
  $("#c-desglose").textContent = ok
    ? `${fm(nom)} nominal + ${fm(fit.off)} ajuste «${fit.n}»${st.hor ? " + " + fm(OFF_HOR) + " horizontal" : ""}${st.cal ? " " + (st.cal > 0 ? "+" : "−") + " " + fm(Math.abs(st.cal)) + " calibración" : ""}`
    : "Escribe un diámetro mayor que 0.";
  $("#c-hint").textContent = fit.t + ".";
}
function fitPills() {
  $("#c-fit").innerHTML = AJUSTES.map(a => `<button class="pill" type="button" data-f="${a.id}" aria-pressed="${a.id === st.fit}">${a.n}</button>`).join("");
}
function presets() {
  $("#c-presets").innerHTML = PRESETS.map(p => `<button class="pill" type="button" data-p="${p}">${fm(p)}</button>`).join("");
}

/* ---------- Buscador de brocas ---------- */
function brocas() {
  const t = IN() ? st.broca * 25.4 : st.broca;
  const el = $("#t-brocas");
  if (!(t > 0)) { el.innerHTML = `<tbody><tr><td class="vacio">Escribe un diámetro mayor que 0.</td></tr></tbody>`; return; }
  const cell = (e, best) => {
    if (!e) return dash;
    const d = e[1] - t;
    return `<b>${e[0]}</b> ${val(fm(e[1]), best ? " best" : "")} <span class="sub">Δ ${d >= 0 ? "+" : "−"}${Math.abs(d).toFixed(2)}</span>`;
  };
  let h = `<thead><tr><th>Serie</th><th>Menor o igual</th><th>Más cercana</th><th>Mayor o igual</th></tr></thead><tbody>`;
  BROCAS.forEach(([n, arr]) => {
    let lo = null, hi = null;
    arr.forEach(e => {
      if (e[1] <= t + 1e-9 && (!lo || e[1] > lo[1])) lo = e;
      if (e[1] >= t - 1e-9 && (!hi || e[1] < hi[1])) hi = e;
    });
    const near = lo && hi ? (t - lo[1] <= hi[1] - t ? lo : hi) : lo || hi;
    h += `<tr><th scope="row">${n}</th><td>${cell(lo)}</td><td>${cell(near, true)}</td><td>${cell(hi)}</td></tr>`;
  });
  el.innerHTML = h + "</tbody>";
}

/* ---------- Filtro y selección ---------- */
function marcar() {
  document.querySelectorAll("tr[data-k]").forEach(r => r.classList.toggle("sel", r.dataset.k === st.sel));
}
function filtrar() {
  const q = st.q.trim().toLowerCase();
  document.querySelectorAll(".tabla").forEach(tb => {
    if (!tb.querySelector("tr[data-q]")) return;
    let g = null, n = 0, tot = 0;
    const cerrar = () => { if (g) g.hidden = n === 0; };
    tb.querySelectorAll("tbody tr").forEach(r => {
      if (r.classList.contains("grupo")) { cerrar(); g = r; n = 0; return; }
      if (!r.dataset.q) return;
      const v = !q || r.dataset.q.includes(q);
      r.hidden = !v; if (v) { n++; tot++; }
    });
    cerrar();
    let vac = tb.querySelector("tr.sin");
    if (!tot) {
      if (!vac) { vac = document.createElement("tr"); vac.className = "sin"; vac.innerHTML = `<td class="vacio" colspan="9">Sin resultados para «<span></span>».</td>`; tb.tBodies[0].appendChild(vac); }
      vac.querySelector("span").textContent = st.q.trim();
      vac.hidden = false;
    } else if (vac) vac.hidden = true;
  });
}

function render() {
  $("#t-metrica").innerHTML = tMetrica();
  $("#t-pasante").innerHTML = tPasante();
  $("#t-ansi").innerHTML = tAnsi();
  $("#t-insertos").innerHTML = tInsertos();
  $("#t-pines").innerHTML = tPines();
  $("#t-fits").innerHTML = tFits();
  $("#t-tuberia").innerHTML = tTuberia();
  document.querySelectorAll("[data-u]").forEach(e => (e.textContent = U()));
  document.querySelectorAll("[data-unit]").forEach(b => b.setAttribute("aria-pressed", b.dataset.unit === st.unit));
  presets(); tiles(); calc(); brocas(); marcar(); filtrar();
}

/* ---------- Eventos ---------- */
let tmr;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("on");
  clearTimeout(tmr); tmr = setTimeout(() => t.classList.remove("on"), 1400);
}
function copiar(txt) {
  const ok = () => toast("Copiado: " + txt);
  const fallback = () => {
    const a = document.createElement("textarea"); a.value = txt; document.body.appendChild(a); a.select();
    try { document.execCommand("copy"); ok(); } catch (e) { toast("No se pudo copiar"); }
    a.remove();
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(ok, fallback); else fallback();
}

document.addEventListener("click", e => {
  const v = e.target.closest(".val");
  if (v && v.dataset.c) return copiar(v.dataset.c);
  const s = e.target.closest("[data-s]");
  if (s) { st.sel = s.dataset.s; save("sel", st.sel); pills(); tiles(); return marcar(); }
  const u = e.target.closest("[data-unit]");
  if (u && u.dataset.unit !== st.unit) {
    const old = st.unit; st.unit = u.dataset.unit; save("unit", st.unit);
    const k = st.unit === "in" ? 1 / 25.4 : 25.4, r = st.unit === "in" ? 4 : 2;
    st.nom = +(st.nom * k).toFixed(r); st.broca = +(st.broca * k).toFixed(r);
    $("#c-nom").value = st.nom; $("#b-d").value = st.broca;
    return render();
  }
  const f = e.target.closest("[data-f]");
  if (f) { st.fit = f.dataset.f; save("fit", st.fit); fitPills(); return calc(); }
  const p = e.target.closest("[data-p]");
  if (p) { st.nom = IN() ? +(p.dataset.p / 25.4).toFixed(4) : +p.dataset.p; $("#c-nom").value = st.nom; return calc(); }
});
$("#q").addEventListener("input", e => { st.q = e.target.value; filtrar(); });
$("#c-nom").addEventListener("input", e => { st.nom = parseFloat(e.target.value); calc(); });
$("#c-hor").addEventListener("change", e => { st.hor = e.target.checked; calc(); });
$("#c-cal").addEventListener("input", e => { st.cal = parseFloat(e.target.value) || 0; save("cal", st.cal); calc(); });
$("#b-d").addEventListener("input", e => { st.broca = parseFloat(e.target.value); brocas(); });

$("#c-cal").value = st.cal;
$("#c-nom").value = st.nom;
$("#b-d").value = st.broca;
pills(); fitPills(); render();
