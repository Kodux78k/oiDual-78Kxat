/* ==========================================================
   DUAL INFODOSE — MONÓLITO JS
   Núcleo simbiótico funcional
========================================================== */

/* =========================
   GLOBAL STATE
========================= */
window.conversation = [];
window.FIELD_STATE = {
  open: false,
  crystallized: false
};

/* =========================
   ELEMENT REFERENCES
========================= */
const body              = document.body;
const chat              = document.getElementById("chat-container");
const userInput         = document.getElementById("userInput");
const btnSend            = document.getElementById("btnSend");
const btnCrystal         = document.getElementById("btnCrystal");
const logoContainer      = document.getElementById("logoContainer");
const footerHandle       = document.getElementById("field-toggle-handle");
const footerText         = document.getElementById("footerText");
const particlesContainer = document.getElementById("particles-js");
const settingsDrawer     = document.getElementById("settingsDrawer");
const toggleParticles    = document.getElementById("toggleParticles");
const blurRange          = document.getElementById("blurRange");

/* =========================
   FOOTER TEXT MATRIX
========================= */
const FOOTER_TEXTS = {
  closed: [
    "tocar o campo é consentir",
    "há pulso em latência",
    "o campo escuta"
  ],
  open: [
    "campo ativo",
    "registro em curso",
    "pulso sustentado"
  ],
  crystal: [
    "campo cristalizado",
    "estado selado",
    "pulso congelado"
  ]
};

function getRandomFooter(type){
  const list = FOOTER_TEXTS[type] || FOOTER_TEXTS.closed;
  return list[Math.floor(Math.random() * list.length)];
}

/* =========================
   FIELD OPEN / CLOSE
========================= */
function setField(open){
  FIELD_STATE.open = open;

  chat.classList.toggle("collapsed", !open);
  body.classList.toggle("field-closed", !open);

  footerText.textContent = getRandomFooter(open ? "open" : "closed");

  setParticlesMood(open ? "active" : "idle");
}

/* =========================
   PARTICLES MOOD
========================= */
function setParticlesMood(mode){
  if(!particlesContainer) return;

  switch(mode){
    case "idle":
      particlesContainer.style.opacity = "0.15";
      break;
    case "active":
      particlesContainer.style.opacity = "0.6";
      break;
    case "crystal":
      particlesContainer.style.opacity = "0.85";
      particlesContainer.style.filter  = "blur(1px)";
      break;
  }
}

/* =========================
   ADD MESSAGE (MARKDOWN)
========================= */
function addMessage(role, content){
  const msg = document.createElement("div");
  msg.className = `msg-block ${role}`;

  if(role === "system"){
    msg.innerHTML = content;
  } else {
    msg.innerHTML = marked.parse(content);
  }

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

/* =========================
   SEND MESSAGE
========================= */
function sendMessage(){
  if(!userInput.value) return;
  if(FIELD_STATE.crystallized) return;

  const text = userInput.value.trim();
  if(!text) return;

  userInput.value = "";

  addMessage("user", text);
  window.conversation.push(text);

  setField(true);
  updateFieldDensity();
  updateCrystalState();

  // SIMULA resposta IA (placeholder)
  setTimeout(()=>{
    addMessage("ai", "**Pulso recebido.**\n\nO campo respondeu.");
  }, 600);
}

/* =========================
   FIELD DENSITY (BLUR)
========================= */
function updateFieldDensity(){
  const depth = window.conversation.length;
  const blur  = Math.min(24, 10 + depth);
  body.style.setProperty("--blur", blur + "px");
}

/* =========================
   CRYSTAL STATE
========================= */
function updateCrystalState(){
  if(window.conversation.length >= 2){
    btnCrystal.classList.add("ready");
  } else {
    btnCrystal.classList.remove("ready");
  }
}

/* =========================
   CRYSTAL TOGGLE
========================= */
function toggleCrystal(){
  if(window.conversation.length < 2) return;

  FIELD_STATE.crystallized = !FIELD_STATE.crystallized;

  body.classList.toggle(
    "field-crystallizing",
    FIELD_STATE.crystallized
  );

  userInput.disabled = FIELD_STATE.crystallized;

  footerText.textContent = getRandomFooter(
    FIELD_STATE.crystallized ? "crystal" : "open"
  );

  setParticlesMood(
    FIELD_STATE.crystallized ? "crystal" : "active"
  );
}

/* =========================
   SETTINGS TOGGLE (ORB)
========================= */
function toggleSettings(){
  settingsDrawer.classList.toggle("open");
}

/* =========================
   SETTINGS HANDLERS
========================= */
if(toggleParticles){
  toggleParticles.onchange = e => {
    particlesContainer.style.display =
      e.target.checked ? "block" : "none";
  };
}

if(blurRange){
  blurRange.oninput = e => {
    body.style.setProperty("--blur", e.target.value + "px");
  };
}

/* =========================
   EVENTS
========================= */
btnSend?.addEventListener("click", sendMessage);

userInput?.addEventListener("keydown", e => {
  if(e.key === "Enter") sendMessage();
});

footerHandle?.addEventListener("click", () => {
  setField(!FIELD_STATE.open);
});

btnCrystal?.addEventListener("click", toggleCrystal);

logoContainer?.addEventListener("click", toggleSettings);

/* =========================
   PARTICLES INIT
========================= */
if(window.particlesJS){
  particlesJS("particles-js",{
    particles:{
      number:{value:32},
      size:{value:2},
      move:{speed:.6},
      line_linked:{enable:false},
      color:{value:"#00f5ff"}
    }
  });
}

/* =========================
   SERVICE WORKER
========================= */
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./sw.js");
}

/* =========================
   BOOT SEQUENCE
========================= */
addMessage(
  "system",
  "⟁ **Registro Vivo Iniciado** ⟁<br>O campo aguarda presença."
);

setParticlesMood("idle");
