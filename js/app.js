"use strict";

const CLE_STOCKAGE = "catalogue-livres-v1";
const ANNEE_MIN = 1450;
const ANNEE_COURANTE = new Date().getFullYear();

const dom = {
  recherche: document.getElementById("recherche"),
  categorie: document.getElementById("filtre-categorie"),
  disponibles: document.getElementById("filtre-disponibles"),
  tri: document.getElementById("tri"),
  compteur: document.getElementById("compteur"),
  vide: document.getElementById("message-vide"),
  liste: document.getElementById("liste-livres"),
  modele: document.getElementById("modele-carte"),
  reinit: document.getElementById("btn-reinitialiser"),
  form: document.getElementById("form-ajout"),
  confirmation: document.getElementById("message-ajout")
};

let livres = [];

/* ---------- Données et persistance ---------- */

function copierDepart() {
  return JSON.parse(JSON.stringify(LIVRES_DEPART));
}

function charger() {
  try {
    const liste = JSON.parse(localStorage.getItem(CLE_STOCKAGE));
    return Array.isArray(liste) ? liste : copierDepart();
  } catch (erreur) {
    return copierDepart(); // stockage indisponible ou contenu corrompu
  }
}

function sauvegarder() {
  try {
    localStorage.setItem(CLE_STOCKAGE, JSON.stringify(livres));
  } catch (erreur) {
    console.warn("Sauvegarde impossible :", erreur);
  }
}

/* ---------- Recherche, filtres, tri ---------- */

// Minuscules et sans accents : « Éloquent » et « eloquent » deviennent identiques
function normaliser(texte) {
  return texte.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function filtrer(liste) {
  const requete = normaliser(dom.recherche.value);
  const categorie = dom.categorie.value;
  const seulementDispo = dom.disponibles.checked;

  return liste.filter(livre =>
    (!requete || normaliser(livre.titre).includes(requete) || normaliser(livre.auteur).includes(requete)) &&
    (!categorie || livre.categorie === categorie) &&
    (!seulementDispo || livre.disponible)
  );
}

function trier(liste) {
  const [champ, sens] = dom.tri.value.split("-");
  const facteur = sens === "desc" ? -1 : 1;
  return [...liste].sort((a, b) =>
    champ === "annee"
      ? (a.annee - b.annee) * facteur
      : a.titre.localeCompare(b.titre, "fr", { sensitivity: "base" }) * facteur
  );
}

/* ---------- Affichage ---------- */

function creerCarte(livre) {
  const carte = dom.modele.content.firstElementChild.cloneNode(true);
  const etiquette = carte.querySelector(".etiquette");

  carte.querySelector(".carte__titre").textContent = livre.titre;
  carte.querySelector(".carte__auteur").textContent = livre.auteur;
  carte.querySelector(".carte__meta").textContent = `${livre.annee} · ${livre.categorie}`;

  etiquette.textContent = livre.disponible ? "Disponible" : "Emprunté";
  etiquette.classList.add(livre.disponible ? "etiquette--dispo" : "etiquette--emprunte");

  carte.querySelector('[data-action="emprunter"]').disabled = !livre.disponible;
  carte.querySelector('[data-action="rendre"]').disabled = livre.disponible;
  carte.querySelectorAll("button").forEach(bouton => { bouton.dataset.id = livre.id; });
  return carte;
}

function afficher() {
  const visibles = trier(filtrer(livres));
  dom.liste.replaceChildren(...visibles.map(creerCarte));
  dom.vide.hidden = visibles.length > 0;
  dom.compteur.textContent = visibles.length === 0
    ? "Aucun résultat"
    : `${visibles.length} livre${visibles.length > 1 ? "s" : ""} sur ${livres.length}`;
}

function mettreAJour() {
  sauvegarder();
  afficher();
}

/* ---------- Actions sur les livres ---------- */

function changerDisponibilite(id, disponible) {
  const livre = livres.find(l => l.id === id);
  if (livre) {
    livre.disponible = disponible;
    mettreAJour();
  }
}

function supprimer(id) {
  const livre = livres.find(l => l.id === id);
  if (livre && confirm(`Supprimer « ${livre.titre} » du catalogue ?`)) {
    livres = livres.filter(l => l.id !== id);
    mettreAJour();
  }
}

function reinitialiser() {
  if (confirm("Remettre les données de départ ? Vos ajouts et suppressions seront perdus.")) {
    livres = copierDepart();
    mettreAJour();
  }
}

// Un seul écouteur sur la liste pour tous les boutons des cartes (délégation d’événements)
function gererClicCarte(evenement) {
  const bouton = evenement.target.closest("button[data-action]");
  if (!bouton) return;
  const id = Number(bouton.dataset.id);
  const actions = {
    emprunter: () => changerDisponibilite(id, false),
    rendre: () => changerDisponibilite(id, true),
    supprimer: () => supprimer(id)
  };
  actions[bouton.dataset.action]();
}

/* ---------- Formulaire : validation et ajout ---------- */

const REGLES = {
  titre: v => v.trim().length >= 2 ? "" : "Saisissez un titre d’au moins 2 caractères.",
  auteur: v => v.trim().length >= 2 ? "" : "Saisissez un auteur d’au moins 2 caractères.",
  annee: v => {
    const n = Number(v);
    const valide = v !== "" && Number.isInteger(n) && n >= ANNEE_MIN && n <= ANNEE_COURANTE;
    return valide ? "" : `Saisissez une année entre ${ANNEE_MIN} et ${ANNEE_COURANTE}.`;
  },
  categorie: v => v ? "" : "Choisissez une catégorie."
};

// Affiche (ou efface) l’erreur sous le champ ; aria-describedby + aria-live la font annoncer
function validerChamp(nom) {
  const champ = dom.form.elements[nom];
  const message = REGLES[nom](champ.value);
  document.getElementById(`erreur-${nom}`).textContent = message;
  champ.setAttribute("aria-invalid", message ? "true" : "false");
  return message === "";
}

function effacerErreurs() {
  Object.keys(REGLES).forEach(nom => {
    document.getElementById(`erreur-${nom}`).textContent = "";
    dom.form.elements[nom].removeAttribute("aria-invalid");
  });
}

function prochainId() {
  return Math.max(0, ...livres.map(l => l.id)) + 1;
}

function ajouterLivre(evenement) {
  evenement.preventDefault();
  dom.confirmation.textContent = "";

  const resultats = Object.keys(REGLES).map(validerChamp); // valide tous les champs d’un coup
  if (resultats.includes(false)) {
    dom.form.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  const f = dom.form.elements;
  livres.push({
    id: prochainId(),
    titre: f.titre.value.trim(),
    auteur: f.auteur.value.trim(),
    annee: Number(f.annee.value),
    categorie: f.categorie.value,
    disponible: f.disponible.checked
  });
  mettreAJour();
  dom.form.reset();
  effacerErreurs();
  dom.confirmation.textContent = "Livre ajouté au catalogue.";
}

/* ---------- Démarrage ---------- */

function init() {
  dom.form.elements.annee.max = ANNEE_COURANTE;
  dom.form.elements.annee.min = ANNEE_MIN;
  livres = charger();

  [dom.recherche, dom.categorie, dom.disponibles, dom.tri]
    .forEach(element => element.addEventListener("input", afficher));
  dom.liste.addEventListener("click", gererClicCarte);
  dom.reinit.addEventListener("click", reinitialiser);
  dom.form.addEventListener("submit", ajouterLivre);
  Object.keys(REGLES).forEach(nom =>
    dom.form.elements[nom].addEventListener("blur", () => validerChamp(nom))
  );

  afficher();
}

init();