/* Directorio de modelos 3D — datos y render.
   Datos verificados en septiembre de 2026. Los sitios cambian de dueño y de reglas: revisa siempre la fuente. */
const CATS = [
  ["todos", "Todos"],
  ["comunidad", "Comunidades"],
  ["mercado", "Diseñadores y miniaturas"],
  ["ingenieria", "Ingeniería y CAD"],
  ["ciencia", "Ciencia, arte y patrimonio"],
  ["nicho", "Nicho y proyectos"],
  ["buscador", "Buscadores"],
];
const COSTOS = [["todos", "Todos"], ["gratis", "Gratis"], ["pago", "Con opción de pago"]];

const SITIOS = [
  /* ---------- Comunidades ---------- */
  {
    id: "printables", n: "Printables", url: "https://www.printables.com", cat: "comunidad", costo: "gratis",
    tag: "La comunidad de Prusa que ya no necesita una Prusa.",
    meta: [["Origen", "Prusa Research · Chequia"], ["Desde", "2019 (como PrusaPrinters)"], ["Licencia", "CC, por modelo"]],
    fuertes: ["Abierta a cualquier marca de impresora", "Comunidad activa: concursos, colecciones y comentarios con fotos de impresiones reales", "Tienda de modelos de pago desde diciembre de 2023, con creadores que monetizan su trabajo"],
    ojo: "Los modelos de la tienda son de pago y tienen sus propios términos; revisa la licencia de cada archivo.",
    dato: ["Dato curioso", "Se llamó PrusaPrinters hasta marzo de 2022. Cambió de nombre porque mucha gente creía que solo podía usarlo con una impresora Prusa."],
    tags: ["General", "Perfiles de impresión", "Concursos"],
  },
  {
    id: "makerworld", n: "MakerWorld", url: "https://makerworld.com", cat: "comunidad", costo: "gratis",
    tag: "Modelos con perfil de impresión listo: abres, calientas e imprimes.",
    meta: [["Origen", "Bambu Lab · China"], ["Desde", "2023"], ["Licencia", "Por modelo; por defecto no comercial"]],
    fuertes: ["Perfiles de impresión probados que se abren directo en Bambu Studio (formato 3MF)", "Sistema de puntos por subir, descargar e interactuar, canjeables por recompensas", "Herramientas de personalización y generación de modelos (MakerLab)"],
    ojo: "Por defecto los modelos son de uso personal y no comercial: no vendas impresiones sin revisar la licencia. Está pensado para el ecosistema Bambu, aunque los STL sirven en cualquier máquina.",
    dato: ["Dato curioso", "Los puntos se pueden canjear por filamento, tarjetas de regalo e incluso impresoras. Además tiene un sistema tipo crowdfunding para proyectos de impresión elaborados."],
    tags: ["General", "3MF", "Bambu Lab"],
  },
  {
    id: "thingiverse", n: "Thingiverse", url: "https://www.thingiverse.com", cat: "comunidad", costo: "gratis",
    tag: "El archivo histórico de la impresión 3D doméstica.",
    meta: [["Origen", "MakerBot · EE. UU."], ["Desde", "2008"], ["Dueño actual", "MyMiniFactory (feb. 2026)"]],
    fuertes: ["Casi cualquier repuesto, adaptador o mod de impresora existe ahí desde hace años", "Muchos modelos con Customizer (basado en OpenSCAD) para ajustar medidas en el navegador", "Enorme cadena de remixes: puedes partir del trabajo de otros"],
    ojo: "Calidad muy dispar, duplicados por todas partes y casi nunca trae perfil de impresión. Está en transición de dueño: espera cambios.",
    dato: ["Dato curioso", "El 3DBenchy, el barquito de pruebas más popular de la impresión 3D, se publicó aquí en 2015."],
    tags: ["General", "Histórico", "Remixes"],
  },
  {
    id: "myminifactory", n: "MyMiniFactory", url: "https://www.myminifactory.com", cat: "comunidad", costo: "pago",
    tag: "Curaduría y diseñadores por suscripción, con fuerte tradición en miniaturas.",
    meta: [["Origen", "Reino Unido"], ["Desde", "2013"], ["Licencia", "Por modelo; gratis y premium"]],
    fuertes: ["Modelos con sello de “probados y verificados” por su equipo", "“Tribes”: suscripciones mensuales a diseñadores, muy populares en juegos de mesa y cosplay", "Aloja el proyecto cultural Scan the World"],
    ojo: "Buena parte del contenido más vistoso es premium o por suscripción: revisa qué es gratis antes de enamorarte de un modelo.",
    dato: ["Dato curioso", "En febrero de 2026 compró Thingiverse a UltiMaker: la plataforma joven adquirió a la más antigua."],
    tags: ["Miniaturas", "Tabletop", "Suscripción"],
  },

  /* ---------- Diseñadores y miniaturas ---------- */
  {
    id: "cults", n: "Cults", url: "https://cults3d.com", cat: "mercado", costo: "pago",
    tag: "Marketplace independiente, sin fabricante detrás.",
    meta: [["Origen", "Francia"], ["Desde", "2014"], ["Licencia", "Por modelo"]],
    fuertes: ["Gratis y de pago en el mismo lugar; el diseñador fija el precio", "Fuerte en decoración, diseño de producto, juguetes y cosplay", "No favorece a ningún fabricante de impresoras"],
    ojo: "Los modelos de pago suelen ser de uso personal; si quieres vender piezas impresas, busca una licencia comercial explícita.",
    dato: ["Dato curioso", "Lo fundaron en 2014 Hugo Fromont, Pierre Ayroles y Sunny Ripert, y se presenta como el primer marketplace de impresión 3D completamente independiente."],
    tags: ["Marketplace", "Diseño", "Cosplay"],
  },
  {
    id: "gambody", n: "Gambody", url: "https://www.gambody.com", cat: "mercado", costo: "pago",
    tag: "Figuras y personajes premium, ya partidos en piezas.",
    meta: [["Origen", "Ucrania"], ["Especialidad", "Figuras de fan art"], ["Licencia", "Personal"]],
    fuertes: ["Modelos divididos y listos para FDM, y versiones pensadas para resina", "Personajes de videojuegos, cine y cómics", "Buen punto de partida para pintar y exhibir"],
    ojo: "Es fan art: los personajes pertenecen a terceros, así que la licencia es personal y no comercial.",
    dato: ["Para tener en cuenta", "Las figuras grandes vienen en muchas piezas; revisa el volumen de tu cama antes de comprar y planea el tiempo de pegado y acabado."],
    tags: ["Figuras", "Premium", "Fan art"],
  },
  {
    id: "heroforge", n: "Hero Forge", url: "https://www.heroforge.com", cat: "mercado", costo: "pago",
    tag: "Diseña tu propio personaje de rol en un editor web.",
    meta: [["Tipo", "Generador de miniaturas"], ["Origen", "Kickstarter"], ["Licencia", "Personal"]],
    fuertes: ["Editor 3D: pose, armadura, armas, accesorios y base", "Descarga el STL para imprimirlo tú o encárgalo impreso", "Ideal para campañas de Dungeons & Dragons y similares"],
    ojo: "Las descargas son de pago y con términos propios: revisa el uso comercial antes de vender figuras.",
    dato: ["Dato curioso", "Nació de una campaña de Kickstarter y se volvió una herramienta de referencia para jugadores de rol de mesa."],
    tags: ["Personalizable", "Rol", "Miniaturas"],
  },
  {
    id: "cgtrader", n: "CGTrader", url: "https://www.cgtrader.com", cat: "mercado", costo: "pago",
    tag: "Mercado gigante de modelos 3D pensados sobre todo para render.",
    meta: [["Origen", "Lituania"], ["Desde", "2011"], ["Licencia", "Por modelo"]],
    fuertes: ["Enorme variedad: vehículos, arquitectura, personajes, objetos", "Tiene una sección específica de modelos listos para impresión 3D", "Sirve también si necesitas el mismo modelo para visualización"],
    ojo: "Muchos modelos son de calidad render: se ven espectaculares pero no siempre son estancos. Revisa y repara la malla antes de imprimir.",
    dato: ["Dato curioso", "Nació en Vilnius como mercado para artistas 3D de render y videojuegos; la impresión es solo una de sus categorías."],
    tags: ["Marketplace", "Render", "Malla"],
  },

  /* ---------- Ingeniería y CAD ---------- */
  {
    id: "grabcad", n: "GrabCAD Community", url: "https://grabcad.com/library", cat: "ingenieria", costo: "gratis",
    tag: "La biblioteca de CAD de los ingenieros.",
    meta: [["Origen", "Estonia → EE. UU."], ["Desde", "2009"], ["Dueño", "Stratasys (2014)"]],
    fuertes: ["Modelos en formatos nativos y neutros (SolidWorks, Inventor, STEP, IGES…)", "Ensambles completos y piezas de máquinas reales", "Concursos de ingeniería con premios"],
    ojo: "Muchos modelos no están pensados para imprimirse tal cual, y la licencia no siempre es clara. Requiere cuenta gratuita.",
    dato: ["Dato curioso", "En 2013 GE lanzó ahí un reto para rediseñar un soporte de motor de avión; según GE, el ganador redujo su peso cerca de 84 %. Stratasys compró GrabCAD en 2014 por unos 100 millones de dólares."],
    tags: ["CAD nativo", "STEP", "Ingeniería"],
  },
  {
    id: "mcmaster", n: "McMaster-Carr", url: "https://www.mcmaster.com", cat: "ingenieria", costo: "gratis",
    tag: "El catálogo industrial que trae el CAD de casi todo.",
    meta: [["Origen", "EE. UU."], ["Tipo", "Catálogo industrial"], ["Formatos", "STEP y nativos"]],
    fuertes: ["Modelo CAD de la gran mayoría de tornillos, tuercas, rodamientos, perfiles y herrajes", "Dimensiones exactas para diseñar alojamientos, insertos y ajustes", "Cada página trae planos y tablas de especificaciones"],
    ojo: "Es catálogo comercial de EE. UU.: el CAD es para diseñar, no para redistribuir. Combínalo con la Guía de barrenos para dimensionar los agujeros.",
    dato: ["Dato curioso", "Su sitio web es famoso entre desarrolladores como ejemplo de velocidad y diseño funcional sin adornos."],
    tags: ["Tornillería", "STEP", "Referencia"],
  },
  {
    id: "traceparts", n: "TraceParts", url: "https://www.traceparts.com", cat: "ingenieria", costo: "gratis",
    tag: "Catálogos oficiales de fabricantes, listos para tu ensamble.",
    meta: [["Origen", "Francia"], ["Tipo", "Catálogos de fabricantes"], ["Formatos", "Muchos CAD"]],
    fuertes: ["Modelos oficiales de rodamientos, guías lineales, neumática, perfiles y más", "Descarga en múltiples formatos CAD", "Integraciones directas con varios programas de diseño"],
    ojo: "Suele requerir registro gratuito. Los modelos son del fabricante: úsalos para diseñar, no para redistribuir.",
    dato: ["Truco Tritic", "Usar el modelo oficial del componente que vas a comprar evita rehacerlo a ojo y descubrir en la prueba que los barrenos no coinciden."],
    tags: ["Componentes", "Fabricantes", "CAD"],
  },
  {
    id: "partcommunity", n: "PARTcommunity", url: "https://www.partcommunity.com", cat: "ingenieria", costo: "gratis",
    tag: "Piezas normalizadas que se generan según la medida que eliges.",
    meta: [["Origen", "CADENAS · Alemania"], ["Tipo", "Catálogos paramétricos"], ["Formatos", "Muchos CAD"]],
    fuertes: ["Catálogos de fabricantes y piezas normalizadas (DIN, ISO, etc.)", "Eliges parámetros y descargas la variante exacta", "Muchos formatos CAD de salida"],
    ojo: "Requiere registro gratuito, y algunos catálogos varían según el fabricante.",
    dato: ["Dato curioso", "Muchas piezas no existen como archivo fijo: el servidor las genera al vuelo con los parámetros que seleccionas."],
    tags: ["Normalizadas", "Paramétrico", "DIN/ISO"],
  },
  {
    id: "onshape", n: "Onshape (documentos públicos)", url: "https://www.onshape.com", cat: "ingenieria", costo: "gratis",
    tag: "CAD en el navegador con miles de diseños que puedes abrir y copiar.",
    meta: [["Origen", "EE. UU."], ["Desde", "2012"], ["Dueño", "PTC (2019)"]],
    fuertes: ["Abres el diseño y ves su árbol de operaciones: aprendes cómo se modeló", "Puedes copiar un documento público y editarlo (parametrizado)", "No instalas nada"],
    ojo: "En el plan gratuito tus propios documentos son públicos. Revisa la licencia del diseño que copies.",
    dato: ["Dato curioso", "Lo fundó, entre otros, Jon Hirschtick, quien antes creó SolidWorks."],
    tags: ["Paramétrico", "Navegador", "Aprendizaje"],
  },
  {
    id: "freecad", n: "FreeCAD-library", url: "https://github.com/FreeCAD/FreeCAD-library", cat: "ingenieria", costo: "gratis",
    tag: "Biblioteca comunitaria de piezas para el CAD libre.",
    meta: [["Origen", "Comunidad FreeCAD"], ["Dónde vive", "GitHub"], ["Licencia", "Abierta"]],
    fuertes: ["Tornillería, electrónica, perfiles y otras piezas para FreeCAD", "Todo abierto: puedes auditar, corregir y proponer piezas", "Sin cuentas ni pagos"],
    ojo: "Calidad variable según quién la contribuyó: verifica las dimensiones contra la hoja de datos.",
    dato: ["Dato curioso", "Como todo vive en GitHub, cualquiera puede aportar sus propias piezas con un pull request."],
    tags: ["Open source", "FreeCAD", "GitHub"],
  },

  /* ---------- Ciencia, arte y patrimonio ---------- */
  {
    id: "smithsonian", n: "Smithsonian 3D", url: "https://3d.si.edu", cat: "ciencia", costo: "gratis",
    tag: "Miles de objetos de museo en dominio público (CC0).",
    meta: [["Origen", "Smithsonian · EE. UU."], ["Licencia", "CC0 en modelos marcados"], ["Uso", "Incluso comercial"]],
    fuertes: ["Los modelos marcados como CC0 se pueden descargar, remixar y usar sin permiso, incluso comercialmente", "Objetos históricos, especímenes y arte escaneados con alta calidad", "Filtros por colección y por objetos con descarga"],
    ojo: "Son escaneos hechos para visualización: casi siempre hay que reparar y simplificar la malla antes de imprimir. No todos son descargables.",
    dato: ["Dato curioso", "Entre sus modelos destacados hay piezas icónicas de la historia de la aviación y la carrera espacial, como el módulo de mando del Apolo 11."],
    tags: ["CC0", "Museo", "Escaneo"],
  },
  {
    id: "nasa", n: "NASA 3D Resources", url: "https://nasa3d.arc.nasa.gov", cat: "ciencia", costo: "gratis",
    tag: "Cohetes, satélites, rovers y telescopios, gratis.",
    meta: [["Origen", "NASA · EE. UU."], ["Tamaño", "Cientos de modelos"], ["Espejo", "GitHub"]],
    fuertes: ["Modelos de naves, rovers, telescopios y misiones", "Algunos vienen listos para imprimir", "Todo el repositorio está espejado en GitHub (nasa/NASA-3D-Resources)"],
    ojo: "Aplican las guías de uso de imágenes y medios de NASA: no uses su logo de forma que sugiera aval.",
    dato: ["Dato curioso", "Como el repositorio está en GitHub, puedes clonarlo completo con un solo comando."],
    tags: ["Espacio", "Dominio público", "Ciencia"],
  },
  {
    id: "nih3d", n: "NIH 3D", url: "https://3d.nih.gov", cat: "ciencia", costo: "gratis",
    tag: "Virus, proteínas, órganos y neuronas para imprimir.",
    meta: [["Origen", "NIH · EE. UU."], ["Tamaño", "Más de 12,000 activos"], ["Formatos", "STL, VRML, X3D, Blender"]],
    fuertes: ["Modelos biomédicos: células, bacterias, virus, moléculas, corazones con malformaciones y neurociencia", "Herramientas que convierten datos moleculares, tomografías o imágenes de microscopio en archivos imprimibles", "Ideal para docencia y divulgación"],
    ojo: "Para compartir modelos necesitas cuenta; descargar es libre. Revisa la licencia indicada en cada modelo.",
    dato: ["Dato curioso", "Puedes convertir la estructura de una molécula publicada por científicos en un STL imprimible, directamente desde el sitio."],
    tags: ["Biomédico", "Educación", "STL"],
  },
  {
    id: "morphosource", n: "MorphoSource", url: "https://www.morphosource.org", cat: "ciencia", costo: "gratis",
    tag: "Fósiles y esqueletos escaneados por museos y universidades.",
    meta: [["Origen", "Duke University · EE. UU."], ["Desde", "2013"], ["Acceso", "Definido por autor"]],
    fuertes: ["Escaneos de especímenes biológicos y fósiles de decenas de instituciones", "Ideal para paleontología, anatomía comparada y museos escolares", "Datos científicos reales, no reinterpretaciones"],
    ojo: "Cada autor define el acceso: algunos escaneos son abiertos y otros requieren solicitud. La plataforma ha pasado por una migración de versión, así que ciertas funciones pueden variar.",
    dato: ["Dato curioso", "En 2016 ya reunía cerca de 9,000 escaneos de más de 70 instituciones; lo lanzó el paleoantropólogo Doug Boyer y hoy es el mayor repositorio abierto de fósiles digitales."],
    tags: ["Fósiles", "Biología", "Museos"],
  },
  {
    id: "scantheworld", n: "Scan the World", url: "https://www.myminifactory.com/scantheworld/", cat: "ciencia", costo: "gratis",
    tag: "Miles de esculturas y patrimonio, escaneados por la comunidad.",
    meta: [["Origen", "MyMiniFactory"], ["Desde", "2014"], ["Tamaño", "Más de 18,000 obras"]],
    fuertes: ["Esculturas, arquitectura y hallazgos arqueológicos de todo el mundo", "Modelos gratuitos hechos con fotogrametría por voluntarios y museos aliados", "Ideal para arte, educación y decoración"],
    ojo: "Los modelos están pensados para verse bien; escala, unión de piezas y soportes dependen de ti. Revisa la licencia de cada uno.",
    dato: ["Dato curioso", "Incluye clásicos como El pensador de Rodin y el David de Miguel Ángel, capturados con fotografías y convertidos en archivos imprimibles."],
    tags: ["Arte", "Fotogrametría", "Patrimonio"],
  },
  {
    id: "sketchfab", n: "Sketchfab", url: "https://sketchfab.com", cat: "ciencia", costo: "gratis",
    tag: "El visor 3D de internet, con cuentas de museos e instituciones.",
    meta: [["Origen", "Francia"], ["Dueño actual", "KitBash (ago. 2026)"], ["Antes", "Epic Games (2021)"]],
    fuertes: ["Visualiza el modelo en el navegador antes de descargar", "Filtra por “descargables” y por licencia Creative Commons", "Museos e instituciones publican sus colecciones"],
    ojo: "No es un sitio de impresión: las mallas suelen tener texturas y no ser estancas. Su tienda cerró en favor de Fab, y museos e historiadores han expresado preocupación por sus archivos; descarga lo que necesites.",
    dato: ["Dato curioso", "Epic Games compró Sketchfab en 2021 y el 10 de agosto de 2026 anunció su traspaso a KitBash, mientras conserva Fab."],
    tags: ["Visor", "CC", "Museos"],
  },
  {
    id: "commons", n: "Wikimedia Commons", url: "https://commons.wikimedia.org", cat: "ciencia", costo: "gratis",
    tag: "Modelos con licencia libre, en el repositorio de Wikipedia.",
    meta: [["Origen", "Wikimedia"], ["Tipo", "Archivo libre"], ["Licencia", "CC / dominio público"]],
    fuertes: ["Acepta modelos STL con licencias libres", "Cada archivo indica autor y licencia con claridad", "Los modelos pueden ilustrar artículos de Wikipedia"],
    ojo: "Es un repositorio pequeño y poco conocido: busca por “STL” o “modelo 3D”. Requiere atribución en la mayoría de los casos.",
    dato: ["Dato curioso", "Todo lo que se sube ahí debe poder reutilizarse libremente, así que cualquiera puede usar, y a menudo vender, lo que encuentre respetando la atribución."],
    tags: ["Licencia libre", "Wikipedia", "Atribución"],
  },

  /* ---------- Nicho y proyectos ---------- */
  {
    id: "enable", n: "e-NABLE", url: "https://enablingthefuture.org", cat: "nicho", costo: "gratis",
    tag: "Prótesis de mano de código abierto, hechas por voluntarios.",
    meta: [["Origen", "Comunidad global"], ["Idea", "Van As y Owen, 2011"], ["Coordinación", "Jon Schull, RIT"]],
    fuertes: ["Diseños abiertos de manos y antebrazos para imprimir", "Una red de voluntarios que conecta a quienes imprimen con quienes las necesitan", "Documentación y guías de ensamble abiertas"],
    ojo: "No son dispositivos médicos certificados: sigue las guías de la comunidad y respeta el marco regulatorio de tu país.",
    dato: ["Dato curioso", "Nació cuando un carpintero sudafricano que perdió dedos y un maquetista de utilería en EE. UU. diseñaron una mano a distancia. Los materiales de una mano impresa cuestan menos de 50 dólares, frente a más de 10,000 de una prótesis comercial."],
    tags: ["Prótesis", "Impacto social", "Open source"],
  },
  {
    id: "voron", n: "Voron Design", url: "https://github.com/VoronDesign", cat: "nicho", costo: "gratis",
    tag: "Los archivos para construir tu propia impresora CoreXY.",
    meta: [["Tipo", "Impresora de código abierto"], ["Dónde vive", "GitHub"], ["Licencia", "Abierta"]],
    fuertes: ["STL de las piezas impresas de una de las impresoras DIY más admiradas", "Documentación de ensamble abierta y comunidad muy activa", "Miles de modificaciones aportadas por usuarios"],
    ojo: "Es un proyecto de construcción exigente, con lista de compras y semanas de armado. Las piezas se imprimen en materiales de ingeniería, no en PLA.",
    dato: ["Dato curioso", "Necesitas una impresora que pueda imprimir en ABS o ASA para fabricar las piezas de otra impresora. Muchos lo consideran un rito de paso."],
    tags: ["DIY", "Hardware abierto", "GitHub"],
  },
  {
    id: "gridfinity", n: "Gridfinity (generador)", url: "https://gridfinity.perplexinglabs.com", cat: "nicho", costo: "gratis",
    tag: "Organización modular: genera cajas y bases con tus medidas.",
    meta: [["Creador", "Zack Freedman"], ["Sistema", "Cuadrícula de 42 mm"], ["Generador", "Perplexing Labs"]],
    fuertes: ["Genera bases y contenedores a la medida de tu cama y tus herramientas", "Miles de accesorios compatibles en las comunidades de modelos", "Modular: lo que imprimes hoy encaja con lo que imprimas mañana"],
    ojo: "Es un estándar comunitario con variantes: confirma que tus bases y contenedores sean compatibles entre sí.",
    dato: ["Dato curioso", "Todo el sistema se basa en una cuadrícula de 42 mm y una altura estándar de 7 mm. Se volvió viral y tiene una enorme cantidad de piezas compatibles."],
    tags: ["Organización", "Paramétrico", "Taller"],
  },
  {
    id: "tinkercad", n: "Tinkercad Gallery", url: "https://www.tinkercad.com/things", cat: "nicho", costo: "gratis",
    tag: "Diseños que puedes abrir, remezclar y exportar sin instalar nada.",
    meta: [["Origen", "Autodesk"], ["Desde", "2011 (adquirida en 2013)"], ["Ideal para", "Educación"]],
    fuertes: ["Abres el diseño de otra persona y lo modificas en el navegador", "Curva de aprendizaje suave para estudiantes y principiantes", "Exportas a STL o a otros formatos cuando termines"],
    ojo: "La galería es muy amplia en calidad. Revisa la licencia de cada diseño antes de reutilizarlo.",
    dato: ["Dato curioso", "Empezó como una herramienta independiente en 2011 y Autodesk la compró en 2013. Hoy es una de las puertas de entrada al diseño 3D más usadas en escuelas."],
    tags: ["Educación", "Navegador", "Remix"],
  },

  /* ---------- Buscadores ---------- */
  {
    id: "yeggi", n: "Yeggi", url: "https://www.yeggi.com", cat: "buscador", costo: "gratis",
    tag: "Un buscador que rastrea muchos repositorios a la vez.",
    meta: [["Tipo", "Meta-buscador"], ["Aloja archivos", "No"], ["Costo", "Gratis"]],
    fuertes: ["Busca en varios repositorios con una sola consulta", "Compara la misma pieza en varios sitios, con sus licencias y valoraciones", "Ahorra abrir diez pestañas"],
    ojo: "No aloja archivos: te lleva al sitio de origen, y ahí aplica su licencia. Algunos enlaces pueden estar caídos.",
    dato: ["Truco Tritic", "Busca el nombre del objeto real (“bisagra de piano”, “soporte VESA”), no el estilo que imaginas, y compara lo que aparece."],
    tags: ["Búsqueda", "Multi-sitio", "Comparar"],
  },
  {
    id: "thangs", n: "Thangs", url: "https://thangs.com", cat: "buscador", costo: "gratis",
    tag: "Busca por forma: sube un modelo y encuentra piezas parecidas.",
    meta: [["Origen", "Physna · EE. UU."], ["Lanzamiento", "2020"], ["Motor", "Búsqueda geométrica"]],
    fuertes: ["Búsqueda geométrica con aprendizaje profundo, no solo por texto", "Indexa modelos de otros sitios además de los propios", "Herramientas de colaboración para diseñadores"],
    ojo: "El motor es más potente con formas mecánicas que con figuras orgánicas. Revisa siempre la licencia del sitio de origen.",
    dato: ["Dato curioso", "Nació de Physna, empresa fundada en 2015 por Paul Powers y Glenn Warner; al lanzar en 2020 ya indexaba más de un millón de modelos y buscaba ser algo así como “Google para lo 3D”."],
    tags: ["Búsqueda geométrica", "Multi-sitio", "Ingeniería"],
  },
];

const GUIA = [
  ["Una pieza funcional rápida, con perfil de impresión", ["makerworld", "printables"]],
  ["Miniaturas, figuras y cosplay", ["myminifactory", "cults", "gambody", "heroforge"]],
  ["Las dimensiones exactas de un tornillo, rodamiento o perfil", ["mcmaster", "traceparts", "partcommunity"]],
  ["Editar el diseño o entender cómo se modeló", ["onshape", "tinkercad", "freecad"]],
  ["Encontrar “algo parecido a esto”", ["thangs", "yeggi"]],
  ["Arte, esculturas y museos", ["scantheworld", "smithsonian", "sketchfab"]],
  ["Ciencia, espacio y anatomía para enseñar", ["nih3d", "nasa", "morphosource"]],
  ["Un proyecto con propósito o para construir algo grande", ["enable", "voron", "gridfinity"]],
  ["Usar el modelo con fines comerciales", ["smithsonian", "commons", "nasa"]],
];

const LINEA = [
  ["Mar. 2022", "PrusaPrinters cambia de nombre a Printables para dejar claro que es para todos, no solo para usuarios de Prusa."],
  ["Dic. 2023", "Printables lanza su tienda de modelos de pago, uniéndose al modelo de creadores que cobran por sus diseños."],
  ["Feb. 2026", "MyMiniFactory adquiere Thingiverse a UltiMaker, el sitio más antiguo de la impresión 3D doméstica cambia de manos."],
  ["Ago. 2026", "Epic Games anuncia que ArtStation y Sketchfab pasan a KitBash, y se queda con Fab, su mercado unificado."],
];

const LIC = [
  ["CC0", "Dominio público", "Todo: copiar, modificar y vender, sin atribución", "Nada", "Smithsonian, NASA (según modelo)"],
  ["CC BY", "Atribución", "Usar, modificar y vender, citando al autor", "Dar crédito", "Printables, Thingiverse, Commons"],
  ["CC BY-SA", "Atribución + CompartirIgual", "Usar y vender, citando y compartiendo igual", "Mismo tipo de licencia en tus derivados", "Commons, varios sitios"],
  ["CC BY-NC", "Atribución + No comercial", "Usar y modificar solo sin fines de lucro", "No vender impresiones ni derivados", "MakerWorld (por defecto), otros"],
  ["CC BY-ND", "Atribución + Sin derivadas", "Imprimir tal cual, sin publicar versiones modificadas", "No compartir remixes", "Ocasional"],
  ["Personal (plataforma)", "Términos del sitio", "Imprimir para uso propio", "Suele prohibir venta o redistribución", "Modelos de pago en general"],
];

const CHECKS = [
  ["Licencia", "Confirma qué puedes hacer: uso personal, modificar, vender."],
  ["Fotos de impresión real", "Un modelo con fotos “impresas” de otras personas es mucho más confiable que uno solo con render."],
  ["Comentarios y remixes", "Ahí se cuentan los problemas: soportes, tolerancias, ajustes que hicieron falta."],
  ["Escala y unidades", "El STL no guarda unidades: se asume milímetros. Verifica el tamaño en tu laminador."],
  ["Formato adecuado", "Para editar, busca STEP o el CAD nativo. Para imprimir, 3MF suele traer más información que STL."],
  ["Malla estanca", "Los modelos de render o escaneo pueden tener huecos: repáralos antes de laminar."],
  ["Tolerancias", "Las piezas que encajan necesitan holgura: imprime una prueba pequeña primero."],
];

const $ = (s, el = document) => el.querySelector(s);
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nombreCat = (id) => CATS.find((c) => c[0] === id)[1];
const num = (s) => String(SITIOS.indexOf(s) + 1).padStart(2, "0");
const norm = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const estado = { cat: "todos", costo: "todos", q: "" };

function visibles() {
  const q = norm(estado.q.trim());
  return SITIOS.filter((s) => {
    if (estado.cat !== "todos" && s.cat !== estado.cat) return false;
    if (estado.costo === "gratis" && s.costo !== "gratis") return false;
    if (estado.costo === "pago" && s.costo !== "pago") return false;
    if (!q) return true;
    const texto = norm([s.n, s.tag, s.tags.join(" "), s.fuertes.join(" "), s.dato[1], s.meta.map((m) => m.join(" ")).join(" "), nombreCat(s.cat)].join(" "));
    return texto.includes(q);
  });
}

function tarjeta(s) {
  return `<article class="card sitio" id="${s.id}">
    <div class="head"><span class="chip">${num(s)}</span><span class="label estado">${esc(nombreCat(s.cat))}</span></div>
    <div><h3>${esc(s.n)}</h3><p class="dominio">${esc(s.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</p></div>
    <p class="tagline">${esc(s.tag)}</p>
    <div class="badges"><span class="badge ${s.costo === "gratis" ? "ok" : "warn"}">${s.costo === "gratis" ? "Gratis" : "Gratis + pago"}</span></div>
    <dl class="meta">${s.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
    <h4>Puntos fuertes</h4>
    <ul class="lista">${s.fuertes.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
    <div class="dato"><span class="label">${esc(s.dato[0])}</span><p>${esc(s.dato[1])}</p></div>
    <div class="ojo"><span class="label">Ojo</span><p>${esc(s.ojo)}</p></div>
    <div class="pie"><span class="tags">${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</span>
    <a class="visitar" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">Visitar sitio ↗</a></div>
  </article>`;
}

function pintarFiltros() {
  $("#cats").innerHTML = CATS.map(([id, t]) => `<button type="button" class="pill" data-cat="${id}" aria-pressed="${id === estado.cat}">${t}</button>`).join("");
  $("#costos").innerHTML = COSTOS.map(([id, t]) => `<button type="button" data-costo="${id}" aria-pressed="${id === estado.costo}">${t}</button>`).join("");
}

function pintarLista() {
  const v = visibles();
  $("#lista").innerHTML = v.length ? v.map(tarjeta).join("") : `<p class="lead">Ningún sitio coincide con tu búsqueda. Prueba con otra palabra o quita los filtros.</p>`;
  $("#resultado").innerHTML = `<span class="label">Mostrando</span> <b>${v.length}</b> <span class="sub">de ${SITIOS.length} sitios</span>`;
}

function pintarGuia() {
  $("#rapida").innerHTML = GUIA.map(([q, ids]) => `<div class="fila-g"><p>${esc(q)}</p><div class="pills chips-s">${ids.map((id) => `<button type="button" class="pill" data-ir="${id}">${esc(SITIOS.find((s) => s.id === id).n)}</button>`).join("")}</div></div>`).join("");
}

function pintarEstatico() {
  $("#linea").innerHTML = LINEA.map(([f, t]) => `<li><span class="label">${esc(f)}</span><p>${esc(t)}</p></li>`).join("");
  $("#tabla-lic").innerHTML = `<thead><tr><th scope="col">Licencia</th><th scope="col">Qué es</th><th scope="col">Puedes</th><th scope="col">Debes</th><th scope="col">Ejemplos</th></tr></thead><tbody>${LIC.map((r) => `<tr><th scope="row"><span class="v">${esc(r[0])}</span></th><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td><td>${esc(r[4])}</td></tr>`).join("")}</tbody>`;
  $("#checks").innerHTML = CHECKS.map(([t, d], i) => `<li><span class="chip">${String(i + 1).padStart(2, "0")}</span><div><b>${esc(t)}</b><p>${esc(d)}</p></div></li>`).join("");
  $("#total").textContent = SITIOS.length;
}

function ir(id) {
  estado.cat = "todos"; estado.costo = "todos"; estado.q = ""; $("#q").value = "";
  pintarFiltros(); pintarLista();
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion:reduce)").matches ? "auto" : "smooth", block: "start" });
  el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
  history.replaceState(null, "", `#${id}`);
}

document.addEventListener("click", (e) => {
  const c = e.target.closest("[data-cat]");
  if (c) { estado.cat = c.dataset.cat; pintarFiltros(); pintarLista(); return; }
  const k = e.target.closest("[data-costo]");
  if (k) { estado.costo = k.dataset.costo; pintarFiltros(); pintarLista(); return; }
  const g = e.target.closest("[data-ir]");
  if (g) ir(g.dataset.ir);
});
$("#q").addEventListener("input", (e) => { estado.q = e.target.value; pintarLista(); });
$("#azar").addEventListener("click", () => {
  const s = SITIOS[Math.floor(Math.random() * SITIOS.length)];
  ir(s.id);
  const t = $("#toast"); t.textContent = `Te tocó: ${s.n}`; t.classList.add("on");
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 2000);
});

pintarFiltros();
pintarGuia();
pintarLista();
pintarEstatico();
if (location.hash.length > 1) { const el = document.getElementById(location.hash.slice(1)); if (el && el.classList.contains("sitio")) requestAnimationFrame(() => ir(location.hash.slice(1))); }
