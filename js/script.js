// ==========================================================================
// CONTROL DE BENDICIÓN: LA MANZANA (2024 - JUNIO 2027)
// Aplicación de Control Financiero y Compromisos de Fe
// Conexión directa a Google Sheets
// ==========================================================================

const API_URL = "https://script.google.com/macros/s/AKfycbzAIpzN32ZaFQ2StlgYTPBLlCzJx7taXsb-xQoG8J_s99q5Gi6EIXTtCFEst6MSv2lR/exec";

// Estado global de la aplicación
let listaHermanos = [];
let filtroActual = "todos"; // "todos", "pendiente", "completado"
let terminoBusqueda = "";
let hermanoAEliminar = null;
let hermanoHistorialActual = null;
let pagoAEliminar = null;

// Estado del Historial de Pagos y Cuotas
let historialAportes = [];
let filtroMetodoPago = "todos"; // "todos", "Efectivo", "Yape / Plin", "Transferencia"
let terminoBusquedaPagos = "";
const STORAGE_HISTORIAL_KEY = "historial_aportes_manzana_v2";

// Elementos del DOM - Pestañas Principales (Apartados)
const elTabBtnHermanos = document.getElementById("tabBtnHermanos");
const elTabBtnHistorial = document.getElementById("tabBtnHistorial");
const elSeccionHermanos = document.getElementById("seccionHermanos");
const elSeccionHistorial = document.getElementById("seccionHistorial");
const elBadgeTotalPagos = document.getElementById("badgeTotalPagos");

// Elementos del DOM - Métricas y Dashboard de Hermanos
const elTotalPrometido = document.getElementById("metricTotalPrometido");
const elTotalAportado = document.getElementById("metricTotalAportado");
const elTotalSaldo = document.getElementById("metricTotalSaldo");
const elTotalHermanos = document.getElementById("metricTotalHermanos");
const elProgressBar = document.getElementById("progressBar");
const elMetricPorcentaje = document.getElementById("metricPorcentaje");

// Elementos del DOM - Sección de Historial de Pagos
const elPagosMetricTotal = document.getElementById("pagosMetricTotal");
const elPagosMetricCount = document.getElementById("pagosMetricCount");
const elPagosMetricUltimoMonto = document.getElementById("pagosMetricUltimoMonto");
const elPagosMetricUltimoDetalle = document.getElementById("pagosMetricUltimoDetalle");
const elInputBusquedaPagos = document.getElementById("inputBusquedaPagos");
const elBtnClearSearchPagos = document.getElementById("btnClearSearchPagos");
const elFilterBtnsPago = document.querySelectorAll(".filter-btn-pago");
const elContadorPagos = document.getElementById("contadorPagos");
const elTablaPagosCuerpo = document.getElementById("tablaPagosCuerpo");
const elPagosEmptyState = document.getElementById("pagosEmptyState");

// Elementos del DOM - Tabla de Hermanos y Búsqueda
const elTablaCuerpo = document.getElementById("tablaCuerpo");
const elLoadingState = document.getElementById("loadingState");
const elEmptyState = document.getElementById("emptyState");
const elContadorResultados = document.getElementById("contadorResultados");
const elInputBusqueda = document.getElementById("inputBusqueda");
const elBtnClearSearch = document.getElementById("btnClearSearch");
const elFilterBtns = document.querySelectorAll(".filter-btn");

// Elementos del DOM - Modal Aporte
const elModalAporte = document.getElementById("modalAporte");
const elFormAporte = document.getElementById("formAporte");
const elBtnAbrirModalNuevo = document.getElementById("btnAbrirModalNuevo");
const elBtnCerrarModal = document.getElementById("btnCerrarModal");
const elBtnCancelarModal = document.getElementById("btnCancelarModal");
const elSelectHermano = document.getElementById("selectHermano");
const elInfoSaldoHermano = document.getElementById("infoSaldoHermano");
const elInputMonto = document.getElementById("inputMonto");
const elInputFecha = document.getElementById("inputFecha");
const elSelectMetodo = document.getElementById("selectMetodo");
const elInputObservacion = document.getElementById("inputObservacion");
const elBtnGuardarAporte = document.getElementById("btnGuardarAporte");

// Elementos del DOM - Modal Nuevo Hermano
const elBtnAbrirModalHermano = document.getElementById("btnAbrirModalHermano");
const elModalNuevoHermano = document.getElementById("modalNuevoHermano");
const elFormNuevoHermano = document.getElementById("formNuevoHermano");
const elBtnCerrarModalHermano = document.getElementById("btnCerrarModalHermano");
const elBtnCancelarModalHermano = document.getElementById("btnCancelarModalHermano");
const elInputNuevoNombre = document.getElementById("inputNuevoNombre");
const elInputNuevaPromesa = document.getElementById("inputNuevaPromesa");
const elInputNuevoAportado = document.getElementById("inputNuevoAportado");
const elInputNuevoDetalle = document.getElementById("inputNuevoDetalle");
const elBtnGuardarNuevoHermano = document.getElementById("btnGuardarNuevoHermano");

// Elementos del DOM - Modal Editar Hermano
const elModalEditarHermano = document.getElementById("modalEditarHermano");
const elFormEditarHermano = document.getElementById("formEditarHermano");
const elBtnCerrarModalEditar = document.getElementById("btnCerrarModalEditar");
const elBtnCancelarModalEditar = document.getElementById("btnCancelarModalEditar");
const elInputEditarNombreOriginal = document.getElementById("inputEditarNombreOriginal");
const elInputEditarNombre = document.getElementById("inputEditarNombre");
const elInputEditarPromesa = document.getElementById("inputEditarPromesa");
const elInfoEditarSaldo = document.getElementById("infoEditarSaldo");
const elBtnGuardarEditarHermano = document.getElementById("btnGuardarEditarHermano");

// Elementos del DOM - Modal Confirmar Eliminación de Hermano
const elModalConfirmarEliminar = document.getElementById("modalConfirmarEliminar");
const elNombreHermanoEliminar = document.getElementById("nombreHermanoEliminar");
const elBtnCancelarEliminar = document.getElementById("btnCancelarEliminar");
const elBtnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

// Elementos del DOM - Modal Confirmar Eliminación de Pago
const elModalConfirmarEliminarPago = document.getElementById("modalConfirmarEliminarPago");
const elPagoEliminarMonto = document.getElementById("pagoEliminarMonto");
const elPagoEliminarHermano = document.getElementById("pagoEliminarHermano");
const elBtnCancelarEliminarPago = document.getElementById("btnCancelarEliminarPago");
const elBtnConfirmarEliminarPago = document.getElementById("btnConfirmarEliminarPago");

// Elementos del DOM - Modal Historial de Aportes
const elModalHistorialAportes = document.getElementById("modalHistorialAportes");
const elHistorialTitulo = document.getElementById("historialTitulo");
const elHistorialSubtitulo = document.getElementById("historialSubtitulo");
const elHistorialPromesa = document.getElementById("historialPromesa");
const elHistorialAportado = document.getElementById("historialAportado");
const elHistorialSaldo = document.getElementById("historialSaldo");
const elHistorialLoading = document.getElementById("historialLoading");
const elTablaHistorial = document.getElementById("tablaHistorial");
const elHistorialCuerpo = document.getElementById("historialCuerpo");
const elHistorialTotalSuma = document.getElementById("historialTotalSuma");
const elHistorialVacio = document.getElementById("historialVacio");
const elBtnCerrarModalHistorial = document.getElementById("btnCerrarModalHistorial");
const elBtnCerrarHistorialFooter = document.getElementById("btnCerrarHistorialFooter");
const elBtnAbonarDesdeHistorial = document.getElementById("btnAbonarDesdeHistorial");

// Elementos del DOM - Generales
const elBtnRecargar = document.getElementById("btnRecargar");
const elToast = document.getElementById("toast");

// Elementos del DOM - Termómetro de Avance (Panel)
const elTabBtnTermometro = document.getElementById("tabBtnTermometro");
const elSeccionTermometro = document.getElementById("seccionTermometro");

// ==========================================================================
// SEGURIDAD Y VISTAS: PÚBLICA vs GESTIÓN PASTORAL
// ==========================================================================
const PIN_PASTOR = "300703";

// Elementos de Vista Pública y Privada
const elVistaPublica = document.getElementById("vistaPublica");
const elVistaGestion = document.getElementById("vistaGestion");
const elBtnAccesoPastoral = document.getElementById("btnAccesoPastoral");
const elBtnCerrarSesion = document.getElementById("btnCerrarSesion");

// Elementos del Modal de PIN
const elModalPin = document.getElementById("modalPin");
const elFormPin = document.getElementById("formPin");
const elInputPin = document.getElementById("inputPin");
const elPinErrorMsg = document.getElementById("pinErrorMsg");
const elBtnCancelarPin = document.getElementById("btnCancelarPin");

// Elementos Dinámicos de la Vista Pública
const elPublicVersiculoTexto = document.getElementById("publicVersiculoTexto");
const elPublicVersiculoCita = document.getElementById("publicVersiculoCita");
const elBtnRotarVersiculo = document.getElementById("btnRotarVersiculo");
const elBtnCambiarFondo = document.getElementById("btnCambiarFondo");
const elPubPorcentajeBadge = document.getElementById("pubPorcentajeBadge");
const elPubTermometroFill = document.getElementById("pubTermometroFill");
const elPubTermometroTooltip = document.getElementById("pubTermometroTooltip");
const elPubMesesRestantesChip = document.getElementById("pubMesesRestantesChip");
const elPubMetaLabelFinal = document.getElementById("pubMetaLabelFinal");
const elPubTotalRecaudado = document.getElementById("pubTotalRecaudado");
const elPubTotalMeta = document.getElementById("pubTotalMeta");

// Elementos del Panel Pastoral
const elBtnCerrarSesionTop = document.getElementById("btnCerrarSesionTop");
const elPastoralFechaHoy = document.getElementById("pastoralFechaHoy");

// ==========================================================================
// COLECCIÓN DE VERSÍCULOS BÍBLICOS SOBRE FIDELIDAD, OFRENDA Y MAYORDOMÍA
// ==========================================================================
const versiculosMayordomia = [
  { 
    texto: "Cada uno dé como propuso en su corazón: no con tristeza, ni por necesidad, porque Dios ama al dador alegre.", 
    cita: "2 Corintios 9:7" 
  },
  { 
    texto: "Honra a Jehová con tus bienes, y con las primicias de todos tus frutos; y serán llenos tus graneros con abundancia.", 
    cita: "Proverbios 3:9-10" 
  },
  { 
    texto: "Dad, y se os dará; medida buena, apretada, remecida y rebosando darán en vuestro regazo.", 
    cita: "Lucas 6:38" 
  },
  { 
    texto: "Porque ¿quién soy yo, y quién es mi pueblo, para que pudiésemos ofrecer de nuestra voluntad cosas semejantes? Pues todo es tuyo, y de lo recibido de tu mano te damos.", 
    cita: "1 Crónicas 29:14" 
  },
  { 
    texto: "Traed todos los diezmos al alfolí y haya alimento en mi casa; y probadme ahora en esto, dice Jehová de los ejércitos.", 
    cita: "Malaquías 3:10" 
  },
  { 
    texto: "Y poderoso es Dios para hacer que abunde en vosotros toda gracia, a fin de que tengáis siempre en todas las cosas todo lo suficiente para toda buena obra.", 
    cita: "2 Corintios 9:8" 
  },
  { 
    texto: "El alma generosa será prosperada; y el que saciare, él también será saciado.", 
    cita: "Proverbios 11:25" 
  },
  { 
    texto: "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.", 
    cita: "Filipenses 4:19" 
  }
];

let indiceVersiculoActual = 0;
let timerRotacionVersiculo = null;

/**
 * Muestra el siguiente versículo bíblico con animación de transición suave
 */
function rotarSiguienteVersiculo() {
  if (!elPublicVersiculoTexto || !elPublicVersiculoCita) return;
  indiceVersiculoActual = (indiceVersiculoActual + 1) % versiculosMayordomia.length;
  const v = versiculosMayordomia[indiceVersiculoActual];

  elPublicVersiculoTexto.style.opacity = "0";
  elPublicVersiculoCita.style.opacity = "0";

  setTimeout(() => {
    elPublicVersiculoTexto.textContent = `"${v.texto}"`;
    elPublicVersiculoCita.textContent = `— ${v.cita}`;
    elPublicVersiculoTexto.style.opacity = "1";
    elPublicVersiculoCita.style.opacity = "1";
  }, 220);
}

/**
 * Inicia la rotación automática de versículos cada 12 segundos
 */
function iniciarRotacionAutomaticaVersiculos() {
  if (timerRotacionVersiculo) clearInterval(timerRotacionVersiculo);
  timerRotacionVersiculo = setInterval(rotarSiguienteVersiculo, 12000);
}

// ==========================================================================
// TEMA LITÚRGICO: PERGAMINO CÁLIDO vs NOCHE SOLEMNE / VIGILIA
// ==========================================================================
function aplicarTemaGuardado() {
  const tema = localStorage.getItem("tema_liturgico");
  if (tema === "solemne") {
    document.body.classList.add("tema-solemne");
    actualizarBotonTema(true);
  } else {
    document.body.classList.remove("tema-solemne");
    actualizarBotonTema(false);
  }
}

function alternarTemaLiturgico() {
  const esSolemne = document.body.classList.toggle("tema-solemne");
  localStorage.setItem("tema_liturgico", esSolemne ? "solemne" : "pergamino");
  actualizarBotonTema(esSolemne);
  mostrarToast(
    esSolemne ? "🌙 Modo Noche Solemne / Vigilia activado" : "☀️ Modo Pergamino Cálido activado",
    "toast-info"
  );
}

function actualizarBotonTema(esSolemne) {
  if (!elBtnCambiarFondo) return;
  if (esSolemne) {
    elBtnCambiarFondo.innerHTML = "☀️ Modo Pergamino";
    elBtnCambiarFondo.setAttribute("title", "Cambiar a Pergamino Cálido");
  } else {
    elBtnCambiarFondo.innerHTML = "🌙 Modo Noche Solemne";
    elBtnCambiarFondo.setAttribute("title", "Cambiar a Modo Noche Solemne / Vigilia");
  }
}

/**
 * Formatea y muestra la fecha del día en la cabecera pastoral
 */
function inicializarFechaPastoral() {
  if (!elPastoralFechaHoy) return;
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const hoy = new Date();
  const fechaStr = hoy.toLocaleDateString('es-PE', opciones);
  elPastoralFechaHoy.textContent = fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1);
}

// ==========================================================================
// UTILIDAD: MESES RESTANTES HASTA JUNIO 2027
// ==========================================================================
/**
 * Devuelve el número de meses completos que faltan desde hoy hasta junio 2027.
 * Mínimo 1 para evitar división por cero.
 */
function calcularMesesRestantes() {
  const ahora = new Date();
  const meta  = new Date(2027, 5, 30); // 30 de junio 2027 (mes 5 = junio, base-0)
  const diffMs = meta - ahora;
  if (diffMs <= 0) return 1;
  const meses = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30.44));
  return Math.max(1, meses);
}

// ==========================================================================
// 1. INICIALIZACIÓN
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const hoy = new Date().toISOString().split("T")[0];
  if (elInputFecha) {
    elInputFecha.value = hoy;
  }

  // Aplicar tema litúrgico guardado (Pergamino Cálido o Modo Noche Solemne)
  aplicarTemaGuardado();

  // Inicializar fecha en el detalle pastoral superior
  inicializarFechaPastoral();

  // Inicializar estado de sesión: ¿Pública o Pastoral?
  verificarEstadoSesion();

  // Mostrar el primer versículo de mayordomía e iniciar rotación cada 12 segundos
  if (elPublicVersiculoTexto && elPublicVersiculoCita && versiculosMayordomia.length > 0) {
    elPublicVersiculoTexto.textContent = `"${versiculosMayordomia[0].texto}"`;
    elPublicVersiculoCita.textContent = `— ${versiculosMayordomia[0].cita}`;
  }
  iniciarRotacionAutomaticaVersiculos();

  cargarHistorialLocal();
  actualizarMetricasPagos();
  renderizarTablaPagos();

  configurarEventos();
  cargarDatos();
});

/**
 * Controla qué vista se muestra según sessionStorage
 */
function verificarEstadoSesion() {
  const sesionActiva = sessionStorage.getItem("sesion_pastor") === "activa";
  if (sesionActiva) {
    if (elVistaPublica) elVistaPublica.classList.add("hidden");
    if (elVistaGestion) elVistaGestion.classList.remove("hidden");
  } else {
    if (elVistaPublica) elVistaPublica.classList.remove("hidden");
    if (elVistaGestion) elVistaGestion.classList.add("hidden");
  }
}

function abrirModalPin() {
  if (elModalPin) {
    elModalPin.classList.remove("hidden");
    if (elPinErrorMsg) elPinErrorMsg.classList.add("hidden");
    if (elInputPin) {
      elInputPin.value = "";
      setTimeout(() => elInputPin.focus(), 150);
    }
  }
}

function cerrarModalPin() {
  if (elModalPin) {
    elModalPin.classList.add("hidden");
  }
  if (elInputPin) elInputPin.value = "";
  if (elPinErrorMsg) elPinErrorMsg.classList.add("hidden");
}

function procesarAccesoPin() {
  if (!elInputPin) return;
  const pinIngresado = elInputPin.value.trim();
  if (pinIngresado === PIN_PASTOR) {
    sessionStorage.setItem("sesion_pastor", "activa");
    cerrarModalPin();
    verificarEstadoSesion();
    mostrarToast("🔐 Sesión pastoral iniciada correctamente", "toast-success");
    // Al entrar al panel, refrescar tablas y métricas
    actualizarMetricas();
    renderizarTabla();
  } else {
    if (elPinErrorMsg) elPinErrorMsg.classList.remove("hidden");
    elInputPin.value = "";
    elInputPin.focus();
    mostrarToast("❌ Clave incorrecta. Acceso denegado.", "toast-error");
  }
}

function cerrarSesionPastoral() {
  sessionStorage.removeItem("sesion_pastor");
  verificarEstadoSesion();
  mostrarToast("⛪ Has vuelto a la Vista Pública de la Congregación", "toast-info");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Registra los escuchadores de eventos del interfaz
 */
function configurarEventos() {
  // ---- EVENTOS DE SESIÓN Y VISTA PÚBLICA ----
  if (elBtnAccesoPastoral) {
    elBtnAccesoPastoral.addEventListener("click", abrirModalPin);
  }
  if (elBtnCerrarSesion) {
    elBtnCerrarSesion.addEventListener("click", cerrarSesionPastoral);
  }
  if (elBtnCerrarSesionTop) {
    elBtnCerrarSesionTop.addEventListener("click", cerrarSesionPastoral);
  }
  if (elBtnCancelarPin) {
    elBtnCancelarPin.addEventListener("click", cerrarModalPin);
  }
  if (elFormPin) {
    elFormPin.addEventListener("submit", (e) => {
      e.preventDefault();
      procesarAccesoPin();
    });
  }
  if (elBtnRotarVersiculo) {
    elBtnRotarVersiculo.addEventListener("click", () => {
      rotarSiguienteVersiculo();
      iniciarRotacionAutomaticaVersiculos(); // reinicia el intervalo
    });
  }
  if (elBtnCambiarFondo) {
    elBtnCambiarFondo.addEventListener("click", alternarTemaLiturgico);
  }

  // Buscador en tiempo real
  elInputBusqueda.addEventListener("input", (e) => {
    terminoBusqueda = e.target.value.trim().toLowerCase();
    elBtnClearSearch.classList.toggle("hidden", terminoBusqueda === "");
    renderizarTabla();
  });

  // Botón limpiar búsqueda
  elBtnClearSearch.addEventListener("click", () => {
    elInputBusqueda.value = "";
    terminoBusqueda = "";
    elBtnClearSearch.classList.add("hidden");
    elInputBusqueda.focus();
    renderizarTabla();
  });

  // Filtros de estado (Todos / Pendiente / Completado)
  elFilterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      elFilterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filtroActual = btn.getAttribute("data-filter");
      renderizarTabla();
    });
  });

  // Botón recargar / sincronizar
  elBtnRecargar.addEventListener("click", () => {
    const icon = elBtnRecargar.querySelector(".icon-spin-target");
    if (icon) icon.classList.add("icon-spin");
    cargarDatos().finally(() => {
      if (icon) icon.classList.remove("icon-spin");
    });
  });

  // ---- PESTAÑAS PRINCIPALES (APARTADOS) ----
  if (elTabBtnHermanos) {
    elTabBtnHermanos.addEventListener("click", () => cambiarPestana("hermanos"));
  }
  if (elTabBtnHistorial) {
    elTabBtnHistorial.addEventListener("click", () => cambiarPestana("historial"));
  }
  if (elTabBtnTermometro) {
    elTabBtnTermometro.addEventListener("click", () => cambiarPestana("termometro"));
  }

  // ---- BÚSQUEDA Y FILTROS DEL HISTORIAL DE PAGOS ----
  if (elInputBusquedaPagos) {
    elInputBusquedaPagos.addEventListener("input", (e) => {
      terminoBusquedaPagos = e.target.value.trim().toLowerCase();
      if (elBtnClearSearchPagos) {
        elBtnClearSearchPagos.classList.toggle("hidden", terminoBusquedaPagos === "");
      }
      renderizarTablaPagos();
    });
  }

  if (elBtnClearSearchPagos) {
    elBtnClearSearchPagos.addEventListener("click", () => {
      elInputBusquedaPagos.value = "";
      terminoBusquedaPagos = "";
      elBtnClearSearchPagos.classList.add("hidden");
      elInputBusquedaPagos.focus();
      renderizarTablaPagos();
    });
  }

  if (elFilterBtnsPago) {
    elFilterBtnsPago.forEach(btn => {
      btn.addEventListener("click", () => {
        elFilterBtnsPago.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        filtroMetodoPago = btn.getAttribute("data-metodo") || "todos";
        renderizarTablaPagos();
      });
    });
  }

  // ---- MODAL APORTE ----
  elBtnAbrirModalNuevo.addEventListener("click", () => abrirModalAporte());
  elBtnCerrarModal.addEventListener("click", cerrarModalAporte);
  elBtnCancelarModal.addEventListener("click", cerrarModalAporte);
  elSelectHermano.addEventListener("change", actualizarInfoHermanoSeleccionado);
  elFormAporte.addEventListener("submit", manejarSubmitAporte);

  // ---- MODAL NUEVO HERMANO ----
  if (elBtnAbrirModalHermano) {
    elBtnAbrirModalHermano.addEventListener("click", abrirModalNuevoHermano);
  }
  if (elBtnCerrarModalHermano) {
    elBtnCerrarModalHermano.addEventListener("click", cerrarModalNuevoHermano);
  }
  if (elBtnCancelarModalHermano) {
    elBtnCancelarModalHermano.addEventListener("click", cerrarModalNuevoHermano);
  }
  if (elFormNuevoHermano) {
    elFormNuevoHermano.addEventListener("submit", manejarSubmitNuevoHermano);
  }

  // ---- MODAL EDITAR HERMANO ----
  if (elBtnCerrarModalEditar) {
    elBtnCerrarModalEditar.addEventListener("click", cerrarModalEditarHermano);
  }
  if (elBtnCancelarModalEditar) {
    elBtnCancelarModalEditar.addEventListener("click", cerrarModalEditarHermano);
  }
  if (elFormEditarHermano) {
    elFormEditarHermano.addEventListener("submit", manejarSubmitEditarHermano);
  }

  // ---- MODAL ELIMINAR HERMANO ----
  if (elBtnCancelarEliminar) {
    elBtnCancelarEliminar.addEventListener("click", cerrarModalEliminar);
  }
  if (elBtnConfirmarEliminar) {
    elBtnConfirmarEliminar.addEventListener("click", ejecutarEliminarHermano);
  }

  // ---- MODAL ELIMINAR REGISTRO DE PAGO ----
  if (elBtnCancelarEliminarPago) {
    elBtnCancelarEliminarPago.addEventListener("click", cerrarModalEliminarPago);
  }
  if (elBtnConfirmarEliminarPago) {
    elBtnConfirmarEliminarPago.addEventListener("click", ejecutarEliminarPago);
  }

  // ---- MODAL HISTORIAL APORTES ----
  if (elBtnCerrarModalHistorial) {
    elBtnCerrarModalHistorial.addEventListener("click", cerrarModalHistorial);
  }
  if (elBtnCerrarHistorialFooter) {
    elBtnCerrarHistorialFooter.addEventListener("click", cerrarModalHistorial);
  }
  if (elBtnAbonarDesdeHistorial) {
    elBtnAbonarDesdeHistorial.addEventListener("click", () => {
      const nombre = hermanoHistorialActual;
      cerrarModalHistorial();
      if (nombre) {
        abrirModalAporte(nombre);
      }
    });
  }

  // Cierre de modales al hacer clic en el fondo difuminado
  window.addEventListener("click", (e) => {
    if (e.target === elModalAporte) cerrarModalAporte();
    if (e.target === elModalNuevoHermano) cerrarModalNuevoHermano();
    if (e.target === elModalEditarHermano) cerrarModalEditarHermano();
    if (e.target === elModalConfirmarEliminar) cerrarModalEliminar();
    if (e.target === elModalConfirmarEliminarPago) cerrarModalEliminarPago();
    if (e.target === elModalHistorialAportes) cerrarModalHistorial();
    if (e.target === elModalPin) cerrarModalPin();
    const elModalExitoBg = document.getElementById("modalExito");
    if (e.target === elModalExitoBg) cerrarModalExito();
  });

  // Cerrar modales con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!elModalAporte.classList.contains("hidden")) cerrarModalAporte();
      if (elModalNuevoHermano && !elModalNuevoHermano.classList.contains("hidden")) cerrarModalNuevoHermano();
      if (elModalEditarHermano && !elModalEditarHermano.classList.contains("hidden")) cerrarModalEditarHermano();
      if (elModalConfirmarEliminar && !elModalConfirmarEliminar.classList.contains("hidden")) cerrarModalEliminar();
      if (elModalConfirmarEliminarPago && !elModalConfirmarEliminarPago.classList.contains("hidden")) cerrarModalEliminarPago();
      if (elModalHistorialAportes && !elModalHistorialAportes.classList.contains("hidden")) cerrarModalHistorial();
      if (elModalPin && !elModalPin.classList.contains("hidden")) cerrarModalPin();
      const elModalExitoEsc = document.getElementById("modalExito");
      if (elModalExitoEsc && !elModalExitoEsc.classList.contains("hidden")) cerrarModalExito();
    }
  });
}


// ==========================================================================
// 2. CONEXIÓN Y CARGA DE DATOS (GET DIRECTO A GOOGLE SHEETS)
// ==========================================================================
/**
 * Consulta los datos en vivo desde Google Sheets
 */
async function cargarDatos() {
  mostrarCargando(true);

  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) {
      throw new Error(`HTTP error! status: ${respuesta.status}`);
    }
    const data = await respuesta.json();
    const items = Array.isArray(data) ? data : (data.hermanos || data.datos || data.data || []);
    
    listaHermanos = normalizarDatos(items);
    mostrarToast(`✅ ${listaHermanos.length} hermanos sincronizados con Google Sheets`, "toast-success");

    // Si es la primera vez que se sincroniza y hay aportes, poblar con los hermanos reales
    if (localStorage.getItem("historial_seed_completado_v4") === null) {
      listaHermanos.forEach((h, idx) => {
        if (h.aportado > 0) {
          const yaExiste = historialAportes.some(p => p.nombre.toLowerCase() === h.nombre.toLowerCase());
          if (!yaExiste) {
            historialAportes.push({
              id: 'init-' + (idx + 1),
              fecha: new Date().toISOString().split("T")[0],
              nombre: h.nombre,
              monto: h.aportado,
              metodo: "Efectivo",
              observacion: "Cuota acumulada registrada"
            });
          }
        }
      });
      localStorage.setItem("historial_seed_completado_v4", "true");
      guardarHistorialLocal();
      actualizarMetricasPagos();
      renderizarTablaPagos();
    }

    // Sincronizar aportes en segundo plano si la API lo soporta
    cargarHistorialRemoto();
  } catch (error) {
    console.error("Error al cargar datos desde Google Apps Script:", error);
    mostrarToast("❌ Error al sincronizar con Google Sheets. Revisa tu conexión a internet.", "toast-error");
  } finally {
    mostrarCargando(false);
    actualizarMetricas();
    poblarSelectorHermanos();
    renderizarTabla();
  }
}

/**
 * Normaliza los campos que provienen de Google Sheets
 */
function normalizarDatos(items) {
  return items
    .filter(item => {
      const nombre = (item.nombre || item.Nombre || item.HERMANO || item.miembro || item.Miembro || "").toString().trim();
      return nombre !== "" && !nombre.toLowerCase().includes("total") && !nombre.toLowerCase().includes("resumen");
    })
    .map((item, index) => {
      const nombre = (item.nombre || item.Nombre || item.HERMANO || item.miembro || item.Miembro || `Hermano ${index + 1}`).toString().trim();
      const promesa = parseFloat(item.promesa || item.Promesa || item.TOTAL || item.total || item.compromiso || 0) || 0;
      const pagado = parseFloat(item.pagado || item.Pagado || item.aportado || item.Aportado || item.PAGADO || item.abono || 0) || 0;
      
      let saldo = parseFloat(item.saldo !== undefined ? item.saldo : (item.Saldo !== undefined ? item.Saldo : (promesa - pagado)));
      if (isNaN(saldo)) saldo = Math.max(0, promesa - pagado);

      let estado = (item.estado || item.Estado || "").toString().trim();
      if (!estado) {
        estado = saldo <= 0.05 ? "Completado" : "En progreso";
      }

      return {
        id: item.id || `h-${index + 1}`,
        nombre,
        promesa,
        aportado: pagado,
        saldo,
        estado
      };
    });
}


// ==========================================================================
// 3. DASHBOARD Y MÉTRICAS
// ==========================================================================
function actualizarMetricas() {
  const totalPrometido = listaHermanos.reduce((acc, h) => acc + h.promesa, 0);
  const totalAportado = listaHermanos.reduce((acc, h) => acc + h.aportado, 0);
  const totalSaldo = listaHermanos.reduce((acc, h) => acc + h.saldo, 0);

  elTotalPrometido.textContent = formatearMoneda(totalPrometido);
  elTotalAportado.textContent = formatearMoneda(totalAportado);
  elTotalSaldo.textContent = formatearMoneda(totalSaldo);
  elTotalHermanos.textContent = `${listaHermanos.length} hermanos en el pacto`;

  let porcentaje = 0;
  if (totalPrometido > 0) {
    porcentaje = Math.min(100, Math.round((totalAportado / totalPrometido) * 100));
  }

  elProgressBar.style.width = `${porcentaje}%`;
  elMetricPorcentaje.textContent = `${porcentaje}% alcanzado`;

  // Actualizar Termómetro si está visible o en segundo plano
  renderizarTermometro();
}


// ==========================================================================
// 4. RENDERIZADO DE TABLA Y FILTROS
// ==========================================================================
function renderizarTabla() {
  const filtrados = listaHermanos.filter(h => {
    const coincideNombre = h.nombre.toLowerCase().includes(terminoBusqueda);
    let coincideEstado = true;
    if (filtroActual === "pendiente") {
      coincideEstado = h.estado.toLowerCase() !== "completado" && h.saldo > 0.05;
    } else if (filtroActual === "completado") {
      coincideEstado = h.estado.toLowerCase() === "completado" || h.saldo <= 0.05;
    }
    return coincideNombre && coincideEstado;
  });

  elContadorResultados.textContent = `Mostrando ${filtrados.length} de ${listaHermanos.length} hermanos`;

  if (filtrados.length === 0) {
    elTablaCuerpo.innerHTML = "";
    elEmptyState.classList.remove("hidden");
    return;
  } else {
    elEmptyState.classList.add("hidden");
  }

  let html = "";
  const mesesRestantes = calcularMesesRestantes();

  filtrados.forEach(h => {
    const iniciales = obtenerIniciales(h.nombre);
    const porcentajeHermano = h.promesa > 0 ? Math.min(100, Math.round((h.aportado / h.promesa) * 100)) : 0;
    const esCompletado = h.estado.toLowerCase() === "completado" || h.saldo <= 0.05;
    const cuotaSugerida = esCompletado ? 0 : (h.saldo / mesesRestantes);

    html += `
      <tr>
        <td>
          <div 
            class="member-cell clickable" 
            onclick="abrirModalHistorial('${escapeHtml(h.nombre)}')" 
            title="Haz clic para ver el historial de cuotas de ${escapeHtml(h.nombre)}"
          >
            <div class="member-avatar">${iniciales}</div>
            <div>
              <div class="member-name">${escapeHtml(h.nombre)}</div>
              <div class="member-sub">Ver cuotas registradas 📋</div>
            </div>
          </div>
        </td>
        <td class="text-right val-promised">${formatearMoneda(h.promesa)}</td>
        <td class="text-right val-paid">${formatearMoneda(h.aportado)}</td>
        <td class="text-right val-due ${esCompletado ? 'completed' : ''}">${formatearMoneda(h.saldo)}</td>
        <td class="text-center">
          <div class="row-progress-wrap">
            <div class="row-progress-bar">
              <div class="row-progress-fill" style="width: ${porcentajeHermano}%"></div>
            </div>
            <span class="row-progress-pct">${porcentajeHermano}%</span>
          </div>
        </td>
        <td class="text-center">
          ${esCompletado
            ? `<span class="cuota-chip cuota-chip-done">✅ Completado</span>`
            : `<span class="cuota-chip" title="${mesesRestantes} meses restantes hasta Junio 2027">
                 ${formatearMoneda(cuotaSugerida)}<span class="cuota-chip-sub">/mes</span>
               </span>`
          }
        </td>
        <td class="text-center">
          <span class="badge ${esCompletado ? 'badge-completado' : 'badge-pendiente'}">
            ${esCompletado ? 'Completado' : 'En progreso'}
          </span>
        </td>
        <td class="text-center">
          <div class="action-buttons">
            <button 
              type="button" 
              class="btn-abonar" 
              onclick="abrirModalAporte('${escapeHtml(h.nombre)}')"
              title="Registrar abono para ${escapeHtml(h.nombre)}"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Abonar
            </button>
            <button 
              type="button" 
              class="btn-editar" 
              onclick="abrirModalEditarHermano('${escapeHtml(h.nombre)}')"
              title="Modificar a ${escapeHtml(h.nombre)}"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
              </svg>
            </button>
            <button 
              type="button" 
              class="btn-eliminar" 
              onclick="solicitarEliminarHermano('${escapeHtml(h.nombre)}')"
              title="Eliminar a ${escapeHtml(h.nombre)}"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  elTablaCuerpo.innerHTML = html;
}


// ==========================================================================
// 4.5 APARTADO Y GESTIÓN DEL HISTORIAL DE PAGOS (CUOTAS)
// ==========================================================================
/**
 * Cambia la vista entre la pestaña de Hermanos y el Historial de Pagos
 */
function cambiarPestana(tab) {
  // Ocultar todas las secciones y desactivar todos los tabs
  [elSeccionHermanos, elSeccionHistorial, elSeccionTermometro].forEach(s => s && s.classList.add("hidden"));
  [elTabBtnHermanos, elTabBtnHistorial, elTabBtnTermometro].forEach(b => b && b.classList.remove("active"));

  if (tab === "hermanos") {
    if (elTabBtnHermanos) elTabBtnHermanos.classList.add("active");
    if (elSeccionHermanos) elSeccionHermanos.classList.remove("hidden");
  } else if (tab === "historial") {
    if (elTabBtnHistorial) elTabBtnHistorial.classList.add("active");
    if (elSeccionHistorial) elSeccionHistorial.classList.remove("hidden");
    actualizarMetricasPagos();
    renderizarTablaPagos();
  } else if (tab === "termometro") {
    if (elTabBtnTermometro) elTabBtnTermometro.classList.add("active");
    if (elSeccionTermometro) elSeccionTermometro.classList.remove("hidden");
    renderizarTermometro();
  }
}

/**
 * Renderiza el Termómetro de Avance con gráfico de dona, barra grande y estadísticas.
 * Se llama desde cambiarPestana("termometro") y desde actualizarMetricas() en segundo plano.
 */
function renderizarTermometro() {
  const totalPrometido = listaHermanos.reduce((acc, h) => acc + h.promesa, 0);
  const totalAportado  = listaHermanos.reduce((acc, h) => acc + h.aportado, 0);
  const totalSaldo     = Math.max(0, totalPrometido - totalAportado);
  const meses          = calcularMesesRestantes();
  const porcentaje     = totalPrometido > 0
    ? Math.min(100, Math.round((totalAportado / totalPrometido) * 100))
    : 0;

  // ── Chip de cuenta regresiva ──
  const termChip = document.getElementById("termChip");
  if (termChip) {
    termChip.textContent = meses === 1
      ? `⚡ ¡Último mes! Meta: Junio 2027`
      : `⏳ Faltan ${meses} meses para la meta · Junio 2027`;
  }

  // ── Dona SVG ──
  // Circunferencia = 2π·r = 2π·88 ≈ 553
  const circunferencia = 2 * Math.PI * 88;
  const offset = circunferencia - (porcentaje / 100) * circunferencia;
  const arco = document.getElementById("donaArco");
  if (arco) {
    arco.style.transition = "stroke-dashoffset 0.9s ease";
    arco.setAttribute("stroke-dasharray", `${circunferencia} ${circunferencia}`);
    arco.setAttribute("stroke-dashoffset", offset.toFixed(2));
  }
  const donaPct = document.getElementById("donaPorcentaje");
  if (donaPct) donaPct.textContent = `${porcentaje}%`;

  // ── Estadísticas ──
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("termTotalAportado",  formatearMoneda(totalAportado));
  set("termTotalMeta",      formatearMoneda(totalPrometido));
  set("termSaldoTotal",     formatearMoneda(totalSaldo));
  set("termTotalHermanos",  listaHermanos.length);

  // ── Barra grande ──
  const termBarra = document.getElementById("termBarra");
  if (termBarra) termBarra.style.width = `${porcentaje}%`;
  set("termBarraLabel", `${porcentaje}% alcanzado · Meta: Junio 2027`);
  set("termMetaLabel",  formatearMoneda(totalPrometido));

  // ── ACTUALIZACIÓN DE LA VISTA PÚBLICA (CONGREGACIONAL) ──
  if (elPubPorcentajeBadge) {
    elPubPorcentajeBadge.textContent = `${porcentaje}% Alcanzado`;
  }
  if (elPubTermometroFill) {
    elPubTermometroFill.style.width = `${porcentaje}%`;
  }
  if (elPubTermometroTooltip) {
    elPubTermometroTooltip.textContent = `${porcentaje}%`;
  }
  if (elPubTotalRecaudado) {
    elPubTotalRecaudado.textContent = formatearMoneda(totalAportado);
  }
  if (elPubTotalMeta) {
    elPubTotalMeta.textContent = formatearMoneda(totalPrometido);
  }
  if (elPubMetaLabelFinal) {
    elPubMetaLabelFinal.textContent = `Meta: ${formatearMoneda(totalPrometido)}`;
  }
  if (elPubMesesRestantesChip) {
    elPubMesesRestantesChip.textContent = meses === 1 
      ? `⚡ ¡Último mes para la meta!` 
      : `⏳ ${meses} meses restantes · Junio 2027`;
  }
}

/**
 * Carga el historial de pagos desde el almacenamiento local
 */
function cargarHistorialLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORIAL_KEY);
    if (raw !== null) {
      historialAportes = JSON.parse(raw);
    } else {
      historialAportes = [];
    }
  } catch (e) {
    console.error("Error al leer historial de localStorage:", e);
    historialAportes = [];
  }
}

/**
 * Guarda el historial de pagos en localStorage
 */
function guardarHistorialLocal() {
  try {
    localStorage.setItem(STORAGE_HISTORIAL_KEY, JSON.stringify(historialAportes));
  } catch (e) {
    console.error("Error al guardar historial en localStorage:", e);
  }
}

/**
 * Consulta el historial de cuotas registradas en Google Sheets
 */
async function cargarHistorialRemoto() {
  try {
    const resp = await fetch(`${API_URL}?accion=historial`);
    if (resp.ok) {
      const data = await resp.json();
      const items = Array.isArray(data) ? data : (data.aportes || data.historial || []);
      if (Array.isArray(items) && items.length > 0 && items[0].monto !== undefined) {
        fusionarAportesRemotos(items);
      }
    }
  } catch (err) {
    // Si la versión del script aún no responde historial, opera con el almacenamiento local
  }
}

/**
 * Unifica los aportes recibidos de Google Sheets con los almacenados localmente
 */
function fusionarAportesRemotos(remotos) {
  if (!Array.isArray(remotos) || remotos.length === 0) return;

  let cambios = false;
  remotos.forEach(r => {
    const monto = Number(r.monto);
    if (isNaN(monto) || monto <= 0) return;
    const nombre = (r.nombre || "").trim();
    if (!nombre) return;
    const fecha = r.fecha || new Date().toISOString().split("T")[0];

    const existe = historialAportes.some(loc => 
      loc.nombre.toLowerCase() === nombre.toLowerCase() &&
      Math.abs(Number(loc.monto) - monto) < 0.01 &&
      (loc.fecha === fecha || formatearFecha(loc.fecha) === formatearFecha(fecha))
    );

    if (!existe) {
      historialAportes.push({
        id: r.id || (Date.now() + Math.random()),
        fecha: fecha,
        nombre: nombre,
        monto: monto,
        metodo: r.metodo || "Efectivo",
        observacion: r.observacion || r.nota || ""
      });
      cambios = true;
    }
  });

  if (cambios) {
    historialAportes.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    guardarHistorialLocal();
    actualizarMetricasPagos();
    renderizarTablaPagos();
  }
}

/**
 * Actualiza las tarjetas resumen y contador de cuotas cobradas
 */
function actualizarMetricasPagos() {
  const totalCobrado = historialAportes.reduce((acc, p) => acc + (Number(p.monto) || 0), 0);
  const totalCantidad = historialAportes.length;

  if (elBadgeTotalPagos) {
    elBadgeTotalPagos.textContent = totalCantidad;
  }
  if (elPagosMetricTotal) {
    elPagosMetricTotal.textContent = formatearMoneda(totalCobrado);
  }
  if (elPagosMetricCount) {
    elPagosMetricCount.textContent = `${totalCantidad} ${totalCantidad === 1 ? 'cuota registrada' : 'cuotas registradas'}`;
  }

  if (elPagosMetricUltimoMonto && elPagosMetricUltimoDetalle) {
    if (totalCantidad > 0) {
      const ultimo = historialAportes[0];
      elPagosMetricUltimoMonto.textContent = formatearMoneda(ultimo.monto);
      elPagosMetricUltimoDetalle.textContent = `${ultimo.nombre} • ${formatearFecha(ultimo.fecha)}`;
    } else {
      elPagosMetricUltimoMonto.textContent = "S/ 0.00";
      elPagosMetricUltimoDetalle.textContent = "Sin pagos registrados aún";
    }
  }
}

/**
 * Renderiza la tabla completa del Historial de Pagos con filtros y búsqueda
 */
function renderizarTablaPagos() {
  if (!elTablaPagosCuerpo) return;

  const filtrados = historialAportes.filter(pago => {
    // Filtro por método de pago
    if (filtroMetodoPago !== "todos") {
      if ((pago.metodo || "").toLowerCase() !== filtroMetodoPago.toLowerCase()) {
        return false;
      }
    }

    // Filtro por término de búsqueda (nombre, método, nota, fecha)
    if (terminoBusquedaPagos) {
      const nom = (pago.nombre || "").toLowerCase();
      const met = (pago.metodo || "").toLowerCase();
      const obs = (pago.observacion || "").toLowerCase();
      const fec = formatearFecha(pago.fecha).toLowerCase();
      if (!nom.includes(terminoBusquedaPagos) && 
          !met.includes(terminoBusquedaPagos) && 
          !obs.includes(terminoBusquedaPagos) && 
          !fec.includes(terminoBusquedaPagos)) {
        return false;
      }
    }

    return true;
  });

  if (elContadorPagos) {
    elContadorPagos.textContent = `${filtrados.length} ${filtrados.length === 1 ? 'cuota' : 'cuotas'}`;
  }

  if (filtrados.length === 0) {
    elTablaPagosCuerpo.innerHTML = "";
    if (elPagosEmptyState) elPagosEmptyState.classList.remove("hidden");
    return;
  }

  if (elPagosEmptyState) elPagosEmptyState.classList.add("hidden");

  let html = "";
  filtrados.forEach(pago => {
    const metodo = pago.metodo || "Efectivo";
    const metodoClass = metodo === "Efectivo" ? "badge-metodo-efectivo" :
                        metodo.includes("Yape") ? "badge-metodo-yape" :
                        "badge-metodo-transferencia";

    html += `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:1rem;">📅</span>
            <strong>${escapeHtml(formatearFecha(pago.fecha))}</strong>
          </div>
        </td>
        <td>
          <span 
            class="member-name-clickable" 
            onclick="abrirModalHistorial('${escapeHtml(pago.nombre)}')"
            title="Ver historial de aportes de ${escapeHtml(pago.nombre)}"
          >
            👤 ${escapeHtml(pago.nombre)}
          </span>
        </td>
        <td class="text-right val-paid">
          <strong>${formatearMoneda(pago.monto)}</strong>
        </td>
        <td class="text-center">
          <span class="badge-metodo ${metodoClass}">
            ${escapeHtml(metodo)}
          </span>
        </td>
        <td>
          ${escapeHtml(pago.observacion || '-')}
        </td>
        <td class="text-center">
          <button 
            type="button" 
            class="btn-eliminar-pago" 
            onclick="solicitarEliminarPago('${escapeHtml(String(pago.id))}', '${escapeHtml(pago.nombre)}', ${pago.monto}, '${escapeHtml(String(pago.fecha))}')" 
            title="Eliminar este abono de ${escapeHtml(pago.nombre)}"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Eliminar
          </button>
        </td>
      </tr>
    `;
  });

  elTablaPagosCuerpo.innerHTML = html;
}


// ==========================================================================
// 5. MODAL DE HISTORIAL DE APORTES (CONSULTA A GOOGLE SHEETS)
// ==========================================================================
async function abrirModalHistorial(nombre) {
  hermanoHistorialActual = nombre;
  const hermano = listaHermanos.find(h => h.nombre.toLowerCase() === nombre.toLowerCase());

  // Rellenar cabecera del modal
  elHistorialTitulo.textContent = `Historial: ${nombre}`;
  elHistorialSubtitulo.textContent = "Detalle de abonos y cuotas registradas";

  if (hermano) {
    elHistorialPromesa.textContent = formatearMoneda(hermano.promesa);
    elHistorialAportado.textContent = formatearMoneda(hermano.aportado);
    elHistorialSaldo.textContent = formatearMoneda(hermano.saldo);
  } else {
    elHistorialPromesa.textContent = "S/ 0.00";
    elHistorialAportado.textContent = "S/ 0.00";
    elHistorialSaldo.textContent = "S/ 0.00";
  }

  // Filtrar aportes registrados en la app para este hermano
  const pagosLocales = historialAportes.filter(p => p.nombre.toLowerCase() === nombre.toLowerCase());

  if (pagosLocales.length > 0) {
    renderizarHistorial(pagosLocales, hermano);
    elHistorialLoading.classList.add("hidden");
  } else {
    elHistorialLoading.classList.remove("hidden");
    elTablaHistorial.classList.add("hidden");
    elHistorialVacio.classList.add("hidden");
    elHistorialCuerpo.innerHTML = "";
    elHistorialTotalSuma.textContent = "S/ 0.00";
  }

  elModalHistorialAportes.classList.remove("hidden");

  try {
    const url = `${API_URL}?accion=historial&nombre=${encodeURIComponent(nombre)}`;
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(`HTTP error: ${respuesta.status}`);
    }
    const data = await respuesta.json();
    const aportesRemotos = Array.isArray(data) ? data : (data.aportes || data.historial || []);

    if (Array.isArray(aportesRemotos) && aportesRemotos.length > 0 && aportesRemotos[0].monto !== undefined) {
      fusionarAportesRemotos(aportesRemotos);
      renderizarHistorial(aportesRemotos, hermano);
    } else if (pagosLocales.length > 0) {
      renderizarHistorial(pagosLocales, hermano);
    } else {
      renderizarHistorialFallback(hermano);
    }

  } catch (error) {
    console.warn("No se pudo cargar el historial desde Google Apps Script:", error);
    if (pagosLocales.length > 0) {
      renderizarHistorial(pagosLocales, hermano);
    } else {
      renderizarHistorialFallback(hermano);
    }
  } finally {
    elHistorialLoading.classList.add("hidden");
  }
}

function renderizarHistorial(aportes, hermano) {
  if (!aportes || aportes.length === 0) {
    // Si el hermano tiene saldo aportado > 0 en la hoja principal pero no hay desglose en Aportes
    if (hermano && hermano.aportado > 0) {
      renderizarHistorialFallback(hermano);
      return;
    }
    elTablaHistorial.classList.add("hidden");
    elHistorialVacio.classList.remove("hidden");
    return;
  }

  elHistorialVacio.classList.add("hidden");
  elTablaHistorial.classList.remove("hidden");

  let html = "";
  let sumaTotal = 0;

  aportes.forEach(a => {
    const monto = Number(a.monto) || 0;
    sumaTotal += monto;
    const fecha = formatearFecha(a.fecha);
    const metodo = a.metodo || "Efectivo";
    const nota = a.observacion || a.nota || "-";

    html += `
      <tr>
        <td><strong>${escapeHtml(fecha)}</strong></td>
        <td class="text-right val-paid"><strong>${formatearMoneda(monto)}</strong></td>
        <td><span class="badge" style="background:#eef2ff; color:#3730a3; border:1px solid #c7d2fe;">${escapeHtml(metodo)}</span></td>
        <td>${escapeHtml(nota)}</td>
        <td class="text-center">
          <button 
            type="button" 
            class="btn-eliminar-pago" 
            onclick="solicitarEliminarPago('${escapeHtml(String(a.id || ''))}', '${escapeHtml(hermano ? hermano.nombre : (a.nombre || ''))}', ${monto}, '${escapeHtml(String(a.fecha || ''))}')" 
            title="Eliminar este abono"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </td>
      </tr>
    `;
  });

  elHistorialCuerpo.innerHTML = html;
  elHistorialTotalSuma.textContent = formatearMoneda(sumaTotal);
}

function renderizarHistorialFallback(hermano) {
  if (hermano && hermano.aportado > 0) {
    elHistorialVacio.classList.add("hidden");
    elTablaHistorial.classList.remove("hidden");

    elHistorialCuerpo.innerHTML = `
      <tr>
        <td><strong>Acumulado</strong></td>
        <td class="text-right val-paid"><strong>${formatearMoneda(hermano.aportado)}</strong></td>
        <td><span class="badge" style="background:#eef2ff; color:#3730a3; border:1px solid #c7d2fe;">Registro General</span></td>
        <td>Total acumulado registrado en la hoja principal</td>
        <td class="text-center">
          <button 
            type="button" 
            class="btn-eliminar-pago" 
            onclick="solicitarEliminarPago('acumulado', '${escapeHtml(hermano.nombre)}', ${hermano.aportado}, 'Acumulado')" 
            title="Eliminar este abono acumulado"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Eliminar
          </button>
        </td>
      </tr>
    `;
    elHistorialTotalSuma.textContent = formatearMoneda(hermano.aportado);
  } else {
    elTablaHistorial.classList.add("hidden");
    elHistorialVacio.classList.remove("hidden");
  }
}

function cerrarModalHistorial() {
  if (elModalHistorialAportes) {
    elModalHistorialAportes.classList.add("hidden");
  }
  hermanoHistorialActual = null;
}


// ==========================================================================
// 6. GESTIÓN DE HERMANOS: AÑADIR NUEVO (POST A GOOGLE SHEETS)
// ==========================================================================
function abrirModalNuevoHermano() {
  if (!elModalNuevoHermano) return;
  elFormNuevoHermano.reset();
  if (elInputNuevoAportado) elInputNuevoAportado.value = "0";
  elModalNuevoHermano.classList.remove("hidden");
  setTimeout(() => {
    if (elInputNuevoNombre) elInputNuevoNombre.focus();
  }, 100);
}

function cerrarModalNuevoHermano() {
  if (!elModalNuevoHermano) return;
  elModalNuevoHermano.classList.add("hidden");
}

async function manejarSubmitNuevoHermano(e) {
  e.preventDefault();

  const nombre = elInputNuevoNombre.value.trim();
  const promesa = parseFloat(elInputNuevaPromesa.value);
  const aportado = parseFloat(elInputNuevoAportado.value) || 0;
  const detalle = elInputNuevoDetalle.value.trim();

  if (!nombre) {
    mostrarToast("⚠️ Por favor, ingresa el nombre del hermano o familia.", "toast-error");
    elInputNuevoNombre.focus();
    return;
  }

  const existe = listaHermanos.some(h => h.nombre.toLowerCase() === nombre.toLowerCase());
  if (existe) {
    mostrarToast("⚠️ Ya existe un hermano o familia registrado con ese nombre.", "toast-error");
    elInputNuevoNombre.focus();
    return;
  }

  if (isNaN(promesa) || promesa <= 0) {
    mostrarToast("⚠️ Ingresa una promesa o compromiso válido mayor a 0.", "toast-error");
    elInputNuevaPromesa.focus();
    return;
  }

  if (isNaN(aportado) || aportado < 0) {
    mostrarToast("⚠️ El aporte inicial no puede ser un número negativo.", "toast-error");
    elInputNuevoAportado.focus();
    return;
  }

  const datosNuevoHermano = {
    accion: "agregarHermano",
    nombre,
    promesa,
    aportado,
    detalle,
    timestamp: new Date().toISOString()
  };

  await guardarNuevoHermano(datosNuevoHermano);
}

async function guardarNuevoHermano(datos) {
  setBotonNuevoHermanoCargando(true);

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(datos)
    });

    mostrarToast(`🎉 Hermano "${datos.nombre}" enviado a Google Sheets`, "toast-success");
    cerrarModalNuevoHermano();

    const nuevo = {
      id: `h-${Date.now()}`,
      nombre: datos.nombre,
      promesa: datos.promesa,
      aportado: datos.aportado,
      saldo: Math.max(0, datos.promesa - datos.aportado),
      estado: (datos.promesa - datos.aportado) <= 0.05 ? "Completado" : "En progreso"
    };
    listaHermanos.push(nuevo);
    actualizarMetricas();
    poblarSelectorHermanos();
    renderizarTabla();

    setTimeout(() => {
      cargarDatos();
    }, 1800);

  } catch (error) {
    console.error("Error al guardar nuevo hermano en Google Apps Script:", error);
    mostrarToast("❌ Ocurrió un error al registrar el nuevo hermano.", "toast-error");
  } finally {
    setBotonNuevoHermanoCargando(false);
  }
}


// ==========================================================================
// 7. GESTIÓN DE HERMANOS: EDITAR / MODIFICAR (POST A GOOGLE SHEETS)
// ==========================================================================
function abrirModalEditarHermano(nombre) {
  const hermano = listaHermanos.find(h => h.nombre === nombre);
  if (!hermano) return;

  elInputEditarNombreOriginal.value = hermano.nombre;
  elInputEditarNombre.value = hermano.nombre;
  elInputEditarPromesa.value = hermano.promesa;
  elInfoEditarSaldo.textContent = `Aportado acumulado: ${formatearMoneda(hermano.aportado)} • El nuevo saldo se recalculará automáticamente.`;

  elModalEditarHermano.classList.remove("hidden");
  setTimeout(() => {
    elInputEditarPromesa.focus();
  }, 100);
}

function cerrarModalEditarHermano() {
  if (elModalEditarHermano) {
    elModalEditarHermano.classList.add("hidden");
  }
}

async function manejarSubmitEditarHermano(e) {
  e.preventDefault();

  const nombreOriginal = elInputEditarNombreOriginal.value;
  const nuevoNombre = elInputEditarNombre.value.trim();
  const nuevaPromesa = parseFloat(elInputEditarPromesa.value);

  if (!nuevoNombre) {
    mostrarToast("⚠️ El nombre no puede estar vacío.", "toast-error");
    return;
  }

  if (isNaN(nuevaPromesa) || nuevaPromesa <= 0) {
    mostrarToast("⚠️ Ingresa una promesa válida mayor a 0.", "toast-error");
    return;
  }

  const payload = {
    accion: "modificarHermano",
    nombreOriginal,
    nombre: nuevoNombre,
    promesa: nuevaPromesa,
    timestamp: new Date().toISOString()
  };

  await guardarEditarHermano(payload);
}

async function guardarEditarHermano(datos) {
  setBotonEditarHermanoCargando(true);

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(datos)
    });

    mostrarToast(`✏️ Hermano "${datos.nombre}" modificado en Google Sheets`, "toast-success");
    cerrarModalEditarHermano();

    const hermano = listaHermanos.find(h => h.nombre === datos.nombreOriginal);
    if (hermano) {
      hermano.nombre = datos.nombre;
      hermano.promesa = datos.promesa;
      hermano.saldo = Math.max(0, hermano.promesa - hermano.aportado);
      hermano.estado = hermano.saldo <= 0.05 ? "Completado" : "En progreso";
      actualizarMetricas();
      poblarSelectorHermanos();
      renderizarTabla();
    }

    setTimeout(() => {
      cargarDatos();
    }, 1800);

  } catch (error) {
    console.error("Error al modificar hermano:", error);
    mostrarToast("❌ Ocurrió un error al modificar los datos.", "toast-error");
  } finally {
    setBotonEditarHermanoCargando(false);
  }
}


// ==========================================================================
// 8. GESTIÓN DE HERMANOS: ELIMINAR (POST A GOOGLE SHEETS)
// ==========================================================================
function solicitarEliminarHermano(nombre) {
  hermanoAEliminar = nombre;
  if (elNombreHermanoEliminar) {
    elNombreHermanoEliminar.textContent = nombre;
  }
  if (elModalConfirmarEliminar) {
    elModalConfirmarEliminar.classList.remove("hidden");
  }
}

function cerrarModalEliminar() {
  if (elModalConfirmarEliminar) {
    elModalConfirmarEliminar.classList.add("hidden");
  }
  hermanoAEliminar = null;
}

async function ejecutarEliminarHermano() {
  if (!hermanoAEliminar) return;

  const nombre = hermanoAEliminar;
  setBotonEliminarCargando(true);

  const payload = {
    accion: "eliminarHermano",
    nombre,
    eliminarHistorial: true,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    mostrarToast(`🗑️ Hermano "${nombre}" y su historial de pagos eliminados`, "toast-success");
    cerrarModalEliminar();

    // Eliminar hermano de la lista activa
    listaHermanos = listaHermanos.filter(h => h.nombre.toLowerCase() !== nombre.toLowerCase());

    // ELIMINAR TODO EL HISTORIAL DE CUOTAS DE ESTE HERMANO
    historialAportes = historialAportes.filter(p => p.nombre.toLowerCase() !== nombre.toLowerCase());
    guardarHistorialLocal();

    actualizarMetricas();
    poblarSelectorHermanos();
    renderizarTabla();
    actualizarMetricasPagos();
    renderizarTablaPagos();

    setTimeout(() => {
      cargarDatos();
    }, 1800);

  } catch (error) {
    console.error("Error al eliminar hermano:", error);
    mostrarToast("❌ Ocurrió un error al eliminar el hermano.", "toast-error");
  } finally {
    setBotonEliminarCargando(false);
  }
}


// ==========================================================================
// 8.5 GESTIÓN DE APORTES: ELIMINAR REGISTRO DE PAGO INDIVIDUAL
// ==========================================================================
function solicitarEliminarPago(id, nombre = null, monto = null, fecha = null) {
  // 1. Buscar en el historial local por ID
  let pago = historialAportes.find(p => String(p.id) === String(id));

  // 2. Si no se encontró por ID pero tenemos nombre y monto
  if (!pago && nombre) {
    pago = historialAportes.find(p => 
      p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase() &&
      Math.abs(Number(p.monto) - Number(monto)) < 0.01
    );
  }

  // 3. Si no existe en historial (por ej. es un aporte acumulado de la hoja principal)
  if (!pago) {
    pago = {
      id: id || ('pago-' + Date.now()),
      nombre: nombre || (hermanoHistorialActual || "Hermano"),
      monto: Number(monto) || 0,
      fecha: fecha || new Date().toISOString().split("T")[0]
    };
  }

  pagoAEliminar = pago;

  const elPagoEliminarMonto = document.getElementById("pagoEliminarMonto");
  const elPagoEliminarHermano = document.getElementById("pagoEliminarHermano");
  const elModalConfirmarEliminarPago = document.getElementById("modalConfirmarEliminarPago");

  if (elPagoEliminarMonto) elPagoEliminarMonto.textContent = formatearMoneda(pago.monto);
  if (elPagoEliminarHermano) elPagoEliminarHermano.textContent = pago.nombre;

  if (elModalConfirmarEliminarPago) {
    elModalConfirmarEliminarPago.classList.remove("hidden");
  } else {
    // Fallback de seguridad directo
    if (confirm(`¿Estás seguro de que deseas eliminar este pago de ${formatearMoneda(pago.monto)} de ${pago.nombre}?`)) {
      ejecutarEliminarPago();
    }
  }
}

function cerrarModalEliminarPago() {
  const elModalConfirmarEliminarPago = document.getElementById("modalConfirmarEliminarPago");
  if (elModalConfirmarEliminarPago) {
    elModalConfirmarEliminarPago.classList.add("hidden");
  }
  pagoAEliminar = null;
}

async function ejecutarEliminarPago() {
  if (!pagoAEliminar) return;

  const pago = { ...pagoAEliminar };
  setBotonEliminarPagoCargando(true);

  // 1. Descontar del acumulado del hermano en listaHermanos
  let hermano = listaHermanos.find(h => h.nombre.trim().toLowerCase() === pago.nombre.trim().toLowerCase());
  if (!hermano) {
    hermano = listaHermanos.find(h => 
      h.nombre.toLowerCase().includes(pago.nombre.toLowerCase()) || 
      pago.nombre.toLowerCase().includes(h.nombre.toLowerCase())
    );
  }

  if (hermano) {
    hermano.aportado = Math.max(0, hermano.aportado - pago.monto);
    hermano.saldo = Math.max(0, hermano.promesa - hermano.aportado);
    hermano.estado = hermano.saldo <= 0.05 ? "Completado" : "En progreso";
    actualizarMetricas();
    poblarSelectorHermanos();
    renderizarTabla();
  }

  // 2. Eliminar de historialAportes
  historialAportes = historialAportes.filter(p => {
    if (String(p.id) === String(pago.id)) return false;
    if (p.nombre.trim().toLowerCase() === pago.nombre.trim().toLowerCase() &&
        Math.abs(Number(p.monto) - Number(pago.monto)) < 0.01) {
      return false;
    }
    return true;
  });

  guardarHistorialLocal();
  actualizarMetricasPagos();
  renderizarTablaPagos();

  // 3. Si el modal de historial individual del hermano está abierto, refrescarlo
  if (hermanoHistorialActual) {
    const pagosRestantes = historialAportes.filter(p => p.nombre.toLowerCase() === hermanoHistorialActual.toLowerCase());
    if (pagosRestantes.length > 0) {
      renderizarHistorial(pagosRestantes, hermano);
    } else {
      renderizarHistorialFallback(hermano);
    }
    if (hermano) {
      const elHistorialAportado = document.getElementById("historialAportado");
      const elHistorialSaldo = document.getElementById("historialSaldo");
      if (elHistorialAportado) elHistorialAportado.textContent = formatearMoneda(hermano.aportado);
      if (elHistorialSaldo) elHistorialSaldo.textContent = formatearMoneda(hermano.saldo);
    }
  }

  // 4. Enviar eliminación a Google Apps Script
  const payload = {
    accion: "eliminarAporte",
    id: pago.id,
    nombre: hermano ? hermano.nombre : pago.nombre,
    monto: pago.monto,
    fecha: pago.fecha,
    timestamp: new Date().toISOString()
  };

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    mostrarToast(`🗑️ Pago de ${formatearMoneda(pago.monto)} eliminado y descontado exitosamente`, "toast-success");
  } catch (error) {
    console.error("Error al eliminar pago en Google Apps Script:", error);
    mostrarToast("⚠️ El pago se eliminó en la app (sin conexión temporal a Google Sheets).", "toast-error");
  } finally {
    setBotonEliminarPagoCargando(false);
    cerrarModalEliminarPago();
  }
}


// ==========================================================================
// 9. MODAL Y REGISTRO DE APORTES (POST A GOOGLE SHEETS)
// ==========================================================================
function poblarSelectorHermanos() {
  elSelectHermano.innerHTML = '<option value="" disabled selected>-- Selecciona un hermano --</option>';

  const ordenados = [...listaHermanos].sort((a, b) => a.nombre.localeCompare(b.nombre));

  ordenados.forEach(h => {
    const opt = document.createElement("option");
    opt.value = h.nombre;
    opt.textContent = `${h.nombre} (Saldo: ${formatearMoneda(h.saldo)})`;
    elSelectHermano.appendChild(opt);
  });
}

function abrirModalAporte(nombreHermano = null) {
  elFormAporte.reset();

  const hoy = new Date().toISOString().split("T")[0];
  elInputFecha.value = hoy;

  if (nombreHermano) {
    elSelectHermano.value = nombreHermano;
  }
  actualizarInfoHermanoSeleccionado();

  elModalAporte.classList.remove("hidden");
  setTimeout(() => {
    if (nombreHermano) {
      elInputMonto.focus();
    } else {
      elSelectHermano.focus();
    }
  }, 100);
}

function cerrarModalAporte() {
  elModalAporte.classList.add("hidden");
  elInfoSaldoHermano.textContent = "";
}

function actualizarInfoHermanoSeleccionado() {
  const nombre = elSelectHermano.value;
  const hermano = listaHermanos.find(h => h.nombre === nombre);
  if (hermano) {
    elInfoSaldoHermano.textContent = `Saldo actual pendiente: ${formatearMoneda(hermano.saldo)} (Promesa total: ${formatearMoneda(hermano.promesa)})`;
  } else {
    elInfoSaldoHermano.textContent = "";
  }
}

async function manejarSubmitAporte(e) {
  e.preventDefault();

  const nombre = elSelectHermano.value;
  const monto = parseFloat(elInputMonto.value);
  const fecha = elInputFecha.value;
  const metodo = elSelectMetodo.value;
  const observacion = elInputObservacion.value.trim();

  if (!nombre) {
    mostrarToast("⚠️ Por favor, selecciona un hermano.", "toast-error");
    elSelectHermano.focus();
    return;
  }

  if (isNaN(monto) || monto <= 0) {
    mostrarToast("⚠️ Ingresa un monto de aporte válido mayor a 0.", "toast-error");
    elInputMonto.focus();
    return;
  }

  const datosAporte = {
    accion: "registrarAporte",
    nombre,
    monto,
    fecha,
    metodo,
    observacion,
    timestamp: new Date().toISOString()
  };

  await guardarAporte(datosAporte);
}

async function guardarAporte(datosAporte) {
  setBotonCargando(true);

  // Registrar de inmediato la cuota en el historial de pagos de la app
  const nuevoPago = {
    id: Date.now(),
    fecha: datosAporte.fecha || new Date().toISOString().split("T")[0],
    nombre: datosAporte.nombre,
    monto: Number(datosAporte.monto),
    metodo: datosAporte.metodo || "Efectivo",
    observacion: datosAporte.observacion || ""
  };

  historialAportes.unshift(nuevoPago);
  guardarHistorialLocal();
  actualizarMetricasPagos();
  renderizarTablaPagos();

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(datosAporte)
    });

    mostrarToast(`🎉 Aporte de ${formatearMoneda(datosAporte.monto)} registrado y guardado exitosamente`, "toast-success");
    cerrarModalAporte();

    const hermano = listaHermanos.find(h => h.nombre === datosAporte.nombre);
    if (hermano) {
      hermano.aportado += Number(datosAporte.monto);
      hermano.saldo = Math.max(0, hermano.promesa - hermano.aportado);
      hermano.estado = hermano.saldo <= 0.05 ? "Completado" : "En progreso";
      actualizarMetricas();
      renderizarTabla();
    }

    // Calcular saldo actualizado y mostrar recibo WhatsApp
    const saldoCalculado = hermano
      ? Math.max(0, hermano.promesa - hermano.aportado)
      : 0;
    mostrarReciboWhatsApp(
      datosAporte.nombre,
      datosAporte.monto,
      datosAporte.fecha,
      saldoCalculado,
      datosAporte.observacion
    );

    setTimeout(() => {
      cargarDatos();
    }, 1800);

  } catch (error) {
    console.error("Error al guardar aporte en Google Apps Script:", error);
    mostrarToast("❌ Ocurrió un error al registrar el aporte en Google Sheets.", "toast-error");
  } finally {
    setBotonCargando(false);
  }
}



// ==========================================================================
// 9. COMPROBANTE INSTANTÁNEO POR WHATSAPP
// ==========================================================================
/**
 * Muestra el modal de éxito con el resumen del aporte y el enlace listo
 * para compartir por WhatsApp con un mensaje predefinido.
 */
function mostrarReciboWhatsApp(nombreHermano, monto, fecha, nuevoSaldo, observacion) {
  const elModalExito = document.getElementById("modalExito");
  if (!elModalExito) return;

  // Rellenar campos del resumen
  const elReciboNombre = document.getElementById("reciboNombre");
  const elReciboMonto  = document.getElementById("reciboMonto");
  const elReciboSaldo  = document.getElementById("reciboSaldo");
  const elBtnWhatsapp  = document.getElementById("btnWhatsapp");

  if (elReciboNombre) elReciboNombre.textContent = nombreHermano;
  if (elReciboMonto)  elReciboMonto.textContent  = formatearMoneda(monto);
  if (elReciboSaldo)  elReciboSaldo.textContent  = formatearMoneda(nuevoSaldo);

  // Construir mensaje WhatsApp
  const fechaFormateada = formatearFecha(fecha);
  const notaLinea = observacion ? `\n📝 _Nota:_ ${observacion}` : "";
  const saldoLinea = Number(nuevoSaldo) <= 0.05
    ? `✅ *¡Compromiso completo! Gracias por cumplir tu promesa a Dios.*`
    : `💰 *Saldo pendiente:* ${formatearMoneda(nuevoSaldo)}`;

  const textoMensaje =
`🙏 *CONTROL DE BENDICIÓN: LA MANZANA*
_Un Encuentro con Jesús_
──────────────────────────
✅ *Aporte registrado exitosamente*

👤 *Hermano/a:* ${nombreHermano}
📅 *Fecha:* ${fechaFormateada}
💵 *Monto abonado:* ${formatearMoneda(monto)}${notaLinea}
${saldoLinea}
──────────────────────────
_"Dios ama al dador alegre."_
📖 2 Corintios 9:7

¡Que Dios multiplique tu ofrenda! 🌟`;

  if (elBtnWhatsapp) {
    elBtnWhatsapp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(textoMensaje)}`;
  }

  elModalExito.classList.remove("hidden");
}

/**
 * Cierra el modal de éxito / comprobante WhatsApp.
 */
function cerrarModalExito() {
  const elModalExito = document.getElementById("modalExito");
  if (elModalExito) elModalExito.classList.add("hidden");
}


// ==========================================================================
// 10. UTILIDADES Y HELPERS
// ==========================================================================
function formatearMoneda(monto) {
  const num = parseFloat(monto) || 0;
  return `S/ ${num.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return "-";
  try {
    // Si viene como YYYY-MM-DD
    const partes = fechaStr.toString().split("T")[0].split("-");
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    const d = new Date(fechaStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    return fechaStr.toString();
  } catch (e) {
    return fechaStr.toString();
  }
}

function obtenerIniciales(nombreCompleto) {
  if (!nombreCompleto) return "HM";
  const palabras = nombreCompleto.trim().split(/\s+/);
  if (palabras.length === 1) return palabras[0].substring(0, 2).toUpperCase();
  return (palabras[0][0] + palabras[1][0]).toUpperCase();
}

function escapeHtml(texto) {
  if (!texto) return "";
  return texto
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function mostrarCargando(estado) {
  if (estado) {
    elLoadingState.classList.remove("hidden");
    elEmptyState.classList.add("hidden");
  } else {
    elLoadingState.classList.add("hidden");
  }
}

function setBotonCargando(cargando) {
  const btnText = elBtnGuardarAporte.querySelector(".btn-text");
  const spinner = elBtnGuardarAporte.querySelector(".btn-spinner");

  if (cargando) {
    elBtnGuardarAporte.disabled = true;
    if (btnText) btnText.textContent = "Guardando...";
    if (spinner) spinner.classList.remove("hidden");
  } else {
    elBtnGuardarAporte.disabled = false;
    if (btnText) btnText.textContent = "Guardar Aporte";
    if (spinner) spinner.classList.add("hidden");
  }
}

function setBotonNuevoHermanoCargando(cargando) {
  if (!elBtnGuardarNuevoHermano) return;
  const btnText = elBtnGuardarNuevoHermano.querySelector(".btn-text");
  const spinner = elBtnGuardarNuevoHermano.querySelector(".btn-spinner");

  if (cargando) {
    elBtnGuardarNuevoHermano.disabled = true;
    if (btnText) btnText.textContent = "Registrando...";
    if (spinner) spinner.classList.remove("hidden");
  } else {
    elBtnGuardarNuevoHermano.disabled = false;
    if (btnText) btnText.textContent = "Registrar Hermano";
    if (spinner) spinner.classList.add("hidden");
  }
}

function setBotonEditarHermanoCargando(cargando) {
  if (!elBtnGuardarEditarHermano) return;
  const btnText = elBtnGuardarEditarHermano.querySelector(".btn-text");
  const spinner = elBtnGuardarEditarHermano.querySelector(".btn-spinner");

  if (cargando) {
    elBtnGuardarEditarHermano.disabled = true;
    if (btnText) btnText.textContent = "Guardando...";
    if (spinner) spinner.classList.remove("hidden");
  } else {
    elBtnGuardarEditarHermano.disabled = false;
    if (btnText) btnText.textContent = "Guardar Cambios";
    if (spinner) spinner.classList.add("hidden");
  }
}

function setBotonEliminarCargando(cargando) {
  if (!elBtnConfirmarEliminar) return;
  const btnText = elBtnConfirmarEliminar.querySelector(".btn-text");
  const spinner = elBtnConfirmarEliminar.querySelector(".btn-spinner");

  if (cargando) {
    elBtnConfirmarEliminar.disabled = true;
    if (btnText) btnText.textContent = "Eliminando...";
    if (spinner) spinner.classList.remove("hidden");
  } else {
    elBtnConfirmarEliminar.disabled = false;
    if (btnText) btnText.textContent = "Sí, Eliminar Todo";
    if (spinner) spinner.classList.add("hidden");
  }
}

function setBotonEliminarPagoCargando(cargando) {
  if (!elBtnConfirmarEliminarPago) return;
  const btnText = elBtnConfirmarEliminarPago.querySelector(".btn-text");
  const spinner = elBtnConfirmarEliminarPago.querySelector(".btn-spinner");

  if (cargando) {
    elBtnConfirmarEliminarPago.disabled = true;
    if (btnText) btnText.textContent = "Eliminando...";
    if (spinner) spinner.classList.remove("hidden");
  } else {
    elBtnConfirmarEliminarPago.disabled = false;
    if (btnText) btnText.textContent = "Sí, Eliminar Pago";
    if (spinner) spinner.classList.add("hidden");
  }
}

let toastTimeout;
function mostrarToast(mensaje, tipo = "toast-info") {
  if (!elToast) return;
  clearTimeout(toastTimeout);

  elToast.className = `toast ${tipo}`;
  elToast.textContent = mensaje;

  toastTimeout = setTimeout(() => {
    elToast.className = "toast hidden";
  }, 4000);
}
