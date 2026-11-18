/* Les voitures sont chargées depuis data/voitures.json */
let CARS=[];
const COL={Gris:"#8A949C",Bleu:"#2F5DA8",Blanc:"#E8EAEA",Noir:"#2A3036",Rouge:"#B3262E",Vert:"#3E7A5A"};
const EQ=["Climatisation","Bluetooth","Régulateur de vitesse","Aide au stationnement","Caméra de recul","GPS intégré","Sièges chauffants","Apple CarPlay / Android Auto","Feux LED","Jantes alliage"];
const PER=6;

/* ============ OUTILS ============ */
const $=(s,r=document)=>r.querySelector(s);
const eur=n=>n.toLocaleString("fr-FR")+" €";
const km=n=>n.toLocaleString("fr-FR")+" km";
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let favs=store.get("av_favs",[]),cmp=store.get("av_cmp",[]);
let F={marque:"",carb:"",boite:"",q:"",prixMax:"",kmMax:"",anneeMin:"",tri:"prix-asc",page:1};
const uniq=k=>[...new Set(CARS.map(c=>c[k]))].sort();
const opts=(arr,sel)=>`<option value="">Tous</option>`+arr.map(v=>`<option${v==sel?" selected":""}>${v}</option>`).join("");

function img(c,i=0){
  if(c.images&&c.images[i])return c.images[i]; // vraie photo si renseignée, sinon visuel de substitution
  // visuel de substitution : remplacez par vos photos (img/voiture-1.jpg…)
  const col=COL[c.couleur]||"#888",bgs=["#DCE3EE","#EADFCB","#D5E5DB","#E3D8E8"],bg=bgs[(c.id+i)%4];
  const flip=i%2?"translate(400 0) scale(-1 1)":"";
  const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="${bg}"/><rect y="190" width="400" height="60" fill="#0002"/><g transform="${flip}"><path d="M50 172L80 124Q92 104 120 104H250Q282 108 302 136L340 150Q356 155 356 172Z" fill="${col}"/><path d="M108 112H246Q270 114 284 136H96Z" fill="#fff" opacity=".6"/><circle cx="115" cy="174" r="25" fill="#101820"/><circle cx="295" cy="174" r="25" fill="#101820"/><circle cx="115" cy="174" r="9" fill="#ccc"/><circle cx="295" cy="174" r="9" fill="#ccc"/></g></svg>`;
  return "data:image/svg+xml,"+encodeURIComponent(s);
}
const alt=c=>`${c.marque} ${c.modele} ${c.couleur.toLowerCase()}, ${c.annee}`;
function equip(c){if(c.equipements&&c.equipements.length)return c.equipements;const n=4+c.id%4;return EQ.slice(0,2).concat(EQ.slice(2+c.id%3,2+c.id%3+n-2))}
function desc(c){if(c.description)return c.description;return `${c.marque} ${c.modele} de ${c.annee}, ${km(c.km)} au compteur, moteur ${c.carb.toLowerCase()} de ${c.ch} ch avec boîte ${c.boite.toLowerCase()}. Véhicule révisé et contrôlé en 120 points, carnet d’entretien à jour, deux clés. Essai possible sur rendez-vous.`}
function mensu(P,mois,taux){const r=taux/1200;return r===0?P/mois:P*r/(1-Math.pow(1+r,-mois))}

function card(c){
  const f=favs.includes(c.id),k=cmp.includes(c.id);
  return `<article class="card">${c.badge?`<span class="badge">${c.badge}</span>`:""}
  <button class="fav" data-fav="${c.id}" aria-pressed="${f}" aria-label="${f?"Retirer des":"Ajouter aux"} favoris : ${c.marque} ${c.modele}">${f?"♥":"♡"}</button>
  <a class="ph" href="#/voiture/${c.id}"><img loading="lazy" src="${img(c)}" data-id="${c.id}" data-i="0" alt="${alt(c)}" width="400" height="250"></a>
  <div class="bd"><h3><a href="#/voiture/${c.id}" style="text-decoration:none">${c.marque} ${c.modele}</a></h3>
  <div class="meta"><span>${c.annee}</span><span>${km(c.km)}</span><span>${c.carb}</span><span>${c.boite}</span></div>
  <div class="price">${eur(c.prix)}</div>
  <label class="cmp"><input type="checkbox" data-cmp="${c.id}"${k?" checked":""}> Comparer</label></div></article>`;
}

/* ============ VUES ============ */
function vHome(){
  const une=CARS.filter(c=>c.badge).slice(0,3);
  return `<div class="hero"><div class="wrap">
  <h1>Des occasions contrôlées,<br>garanties 12 mois.</h1>
  <p>Chaque voiture passe 120 points de contrôle avant d’être en ligne. Cherchez, comparez, simulez votre mensualité, puis venez l’essayer.</p>
  <div class="plate"><form id="qs" aria-label="Recherche rapide">
  <label>Marque<select name="marque">${opts(uniq("marque"))}</select></label>
  <label>Modèle<input name="q" placeholder="Ex. Clio"></label>
  <label>Budget max (€)<input name="prixMax" type="number" min="0" step="500" placeholder="20000"></label>
  <button class="btn y" type="submit">Voir les offres</button></form></div></div></div>
  <section><div class="wrap"><h2>À la une</h2><div class="grid">${une.map(card).join("")}</div>
  <p><a class="btn o" href="#/catalogue">Tout le catalogue (${CARS.length} voitures)</a></p></div></section>
  <section style="background:#fff"><div class="wrap"><h2>Pourquoi acheter chez Patiko</h2><div class="trust">
  <div><h3>Garantie 12 mois</h3><p>Pièces et main-d’œuvre, avec assistance incluse.</p></div>
  <div><h3>Contrôle en 120 points</h3><p>Rapport remis avec la voiture, historique d’entretien vérifié.</p></div>
  <div><h3>Financement simple</h3><p>Simulez votre mensualité sur chaque fiche, sans engagement.</p></div>
  <div><h3>Reprise de votre voiture</h3><p>Estimation gratuite pendant votre essai.</p></div></div></div></section>`;
}
function filtered(){
  let l=CARS.filter(c=>(!F.marque||c.marque===F.marque)&&(!F.carb||c.carb===F.carb)&&(!F.boite||c.boite===F.boite)
   &&(!F.q||(c.modele+" "+c.marque).toLowerCase().includes(F.q.toLowerCase()))
   &&(!F.prixMax||c.prix<=+F.prixMax)&&(!F.kmMax||c.km<=+F.kmMax)&&(!F.anneeMin||c.annee>=+F.anneeMin));
  const [k,d]=F.tri.split("-");
  return l.sort((a,b)=>(a[k]-b[k])*(d==="asc"?1:-1));
}
function vList(){
  const l=filtered(),pages=Math.max(1,Math.ceil(l.length/PER));F.page=Math.min(F.page,pages);
  const s=l.slice((F.page-1)*PER,F.page*PER);
  const pg=pages>1?`<nav class="pag" aria-label="Pagination">${Array.from({length:pages},(_,i)=>`<button data-p="${i+1}"${i+1===F.page?' aria-current="page"':""}>${i+1}</button>`).join("")}</nav>`:"";
  return `<div class="bar"><strong>${l.length} voiture${l.length>1?"s":""}</strong></div>`+
   (s.length?`<div class="grid">${s.map(card).join("")}</div>${pg}`:`<p>Aucune voiture ne correspond. Élargissez le budget ou retirez un filtre.</p><button class="btn o" id="reset">Réinitialiser les filtres</button>`);
}
function vCat(){
  return `<section><div class="wrap"><h1 style="font-size:2.4rem">Catalogue</h1>
  <form class="filters" id="ff" aria-label="Filtres">
  <label>Marque<select name="marque">${opts(uniq("marque"),F.marque)}</select></label>
  <label>Modèle<input name="q" value="${F.q}" placeholder="Ex. 208"></label>
  <label>Carburant<select name="carb">${opts(uniq("carb"),F.carb)}</select></label>
  <label>Boîte<select name="boite">${opts(uniq("boite"),F.boite)}</select></label>
  <label>Prix max (€)<input name="prixMax" type="number" min="0" step="500" value="${F.prixMax}"></label>
  <label>Km max<input name="kmMax" type="number" min="0" step="5000" value="${F.kmMax}"></label>
  <label>Année min<input name="anneeMin" type="number" min="2000" max="2026" value="${F.anneeMin}"></label>
  <label>Trier par<select name="tri">${[["prix-asc","Prix croissant"],["prix-desc","Prix décroissant"],["annee-desc","Plus récentes"],["km-asc","Kilométrage croissant"]].map(o=>`<option value="${o[0]}"${F.tri===o[0]?" selected":""}>${o[1]}</option>`).join("")}</select></label>
  </form><div id="list" aria-live="polite">${vList()}</div></div></section>`;
}
function vCar(id){
  const c=CARS.find(x=>x.id==id);if(!c)return `<section><div class="wrap"><h1>Voiture introuvable</h1><a class="btn" href="#/catalogue">Retour au catalogue</a></div></section>`;
  const sim=CARS.filter(x=>x.id!==c.id&&(x.carb===c.carb||Math.abs(x.prix-c.prix)<c.prix*.25)).slice(0,3);
  const rows=[["Année",c.annee],["Kilométrage",km(c.km)],["Carburant",c.carb],["Boîte",c.boite],["Puissance",c.ch+" ch"],["Couleur",c.couleur]];
  const ld={"@context":"https://schema.org","@type":"Car",name:`${c.marque} ${c.modele}`,brand:{"@type":"Brand",name:c.marque},model:c.modele,vehicleModelDate:String(c.annee),mileageFromOdometer:{"@type":"QuantitativeValue",value:c.km,unitCode:"KMT"},fuelType:c.carb,vehicleTransmission:c.boite,color:c.couleur,offers:{"@type":"Offer",price:c.prix,priceCurrency:"EUR",availability:"https://schema.org/InStock"}};
  setTimeout(()=>{let s=$("#ld");if(!s){s=document.createElement("script");s.id="ld";s.type="application/ld+json";document.head.append(s)}s.textContent=JSON.stringify(ld)});
  return `<section><div class="wrap"><p><a href="#/catalogue">‹ Retour au catalogue</a></p>
  <div class="detail"><div class="gal"><img id="main" src="${img(c,0)}" data-id="${c.id}" data-i="0" alt="${alt(c)}">
  <div class="thumbs">${Array.from({length:(c.images&&c.images.length)||4},(_,i)=>i).map(i=>`<button data-th="${i}" aria-label="Photo ${i+1}"${i===0?' aria-current="true"':""}><img loading="lazy" src="${img(c,i)}" data-id="${c.id}" data-i="${i}" alt=""></button>`).join("")}</div>
  <h2 style="margin-top:28px">Description</h2><p>${desc(c)}</p>
  <h2>Équipements</h2><ul class="chips">${equip(c).map(e=>`<li>${e}</li>`).join("")}</ul></div>
  <aside><div class="panel"><h1 style="font-size:2rem">${c.marque} ${c.modele}</h1>
  <div class="big">${eur(c.prix)}</div>
  <div class="tbl"><table>${rows.map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</table></div>
  <p style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn y" href="#/contact?v=${c.id}">Demander un essai</a>
  <button class="btn o" data-fav="${c.id}" aria-pressed="${favs.includes(c.id)}">${favs.includes(c.id)?"♥ En favoris":"♡ Favori"}</button></p></div>
  <div class="panel" style="margin-top:16px"><h3>Simuler un financement</h3>
  <div class="sim" id="sim" data-p="${c.prix}">
  <label>Apport : <b id="va">${eur(Math.round(c.prix*.1/100)*100)}</b><input type="range" id="ap" min="0" max="${c.prix}" step="100" value="${Math.round(c.prix*.1/100)*100}" style="width:100%"></label>
  <label>Durée : <b id="vd">48 mois</b><input type="range" id="du" min="12" max="84" step="6" value="48" style="width:100%"></label>
  <label>Taux annuel : <b id="vt">6,0 %</b><input type="range" id="ta" min="0" max="12" step="0.1" value="6" style="width:100%"></label>
  <div>Mensualité estimée<br><output id="mo"></output></div>
  <small style="color:var(--mute)">Simulation indicative, hors assurance. Un crédit vous engage et doit être remboursé.</small></div></div></aside></div>
  <h2 style="margin-top:40px">Annonces similaires</h2><div class="grid">${sim.map(card).join("")}</div></div></section>`;
}
function vFavs(){
  const l=CARS.filter(c=>favs.includes(c.id));
  return `<section><div class="wrap"><h1 style="font-size:2.4rem">Mes favoris</h1>${l.length?`<div class="grid">${l.map(card).join("")}</div>`:`<p>Aucun favori pour l’instant. Touchez le cœur sur une annonce pour la retrouver ici.</p><a class="btn" href="#/catalogue">Voir le catalogue</a>`}</div></section>`;
}
function vCmp(){
  const l=cmp.map(i=>CARS.find(c=>c.id===i)).filter(Boolean);
  if(l.length<2)return `<section><div class="wrap"><h1>Comparateur</h1><p>Cochez « Comparer » sur 2 ou 3 voitures du catalogue.</p><a class="btn" href="#/catalogue">Choisir des voitures</a></div></section>`;
  const R=[["Prix",c=>eur(c.prix)],["Année",c=>c.annee],["Kilométrage",c=>km(c.km)],["Carburant",c=>c.carb],["Boîte",c=>c.boite],["Puissance",c=>c.ch+" ch"],["Couleur",c=>c.couleur]];
  return `<section><div class="wrap"><h1 style="font-size:2.4rem">Comparateur</h1><div class="tbl panel"><table>
  <tr><th></th>${l.map(c=>`<td><img src="${img(c)}" data-id="${c.id}" data-i="0" alt="${alt(c)}" style="width:100%;max-width:200px;border-radius:8px"><br><a href="#/voiture/${c.id}"><b>${c.marque} ${c.modele}</b></a></td>`).join("")}</tr>
  ${R.map(r=>`<tr><th>${r[0]}</th>${l.map(c=>`<td>${r[1](c)}</td>`).join("")}</tr>`).join("")}</table></div></div></section>`;
}
function vContact(q){
  const v=CARS.find(c=>c.id==new URLSearchParams(q).get("v"));
  return `<section><div class="wrap"><h1 style="font-size:2.4rem">Contact</h1>
  <div style="display:grid;gap:32px;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
  <form class="c" id="cf"><label>Nom<input name="nom" required autocomplete="name"></label>
  <label>Email<input name="email" type="email" required autocomplete="email"></label>
  <label>Téléphone<input name="tel" type="tel" autocomplete="tel"></label>
  <label>Message<textarea name="message" rows="5" required>${v?`Bonjour, je souhaite essayer la ${v.marque} ${v.modele} (${v.annee}).`:""}</textarea></label>
  <label style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" required style="margin-top:5px"><span>J’accepte que mes données soient utilisées pour répondre à ma demande (<a href="#/mentions">en savoir plus</a>).</span></label>
  <button class="btn" type="submit">Envoyer ma demande</button><div id="res" role="status"></div></form>
  <div><h3>Notre showroom</h3><p>12 rue de l’Exemple, 75000 Paris<br>01 23 45 67 89<br>contact@patiko.io</p>
  <p>Lundi au vendredi : 9h–19h<br>Samedi : 9h–18h<br>Dimanche : fermé</p>
  <iframe title="Carte du showroom" loading="lazy" style="width:100%;height:240px;border:0;border-radius:12px" src="https://www.openstreetmap.org/export/embed.html?bbox=2.30%2C48.84%2C2.38%2C48.88&layer=mapnik"></iframe></div></div></div></section>`;
}
const page=(t,b)=>`<section><div class="wrap legal"><h1 style="font-size:2.4rem">${t}</h1>${b}</div></section>`;
const vAbout=()=>page("À propos",`<p>Patiko est un concessionnaire indépendant spécialisé dans les voitures d’occasion récentes. Notre méthode : n’acheter que des véhicules dont l’historique est vérifié, les contrôler en 120 points, puis les vendre à un prix affiché clairement, garantie incluse.</p><p>Notre équipe vous accueille au showroom pour un essai, une reprise ou une étude de financement.</p><a class="btn y" href="#/contact">Prendre rendez-vous</a>`);
const vMent=()=>page("Mentions légales et RGPD",`<p class="msg err">Modèle à compléter avec vos informations réelles et à faire valider avant la mise en ligne.</p>
<h3>Éditeur</h3><p>[Raison sociale], [forme juridique] au capital de [montant] €, SIREN [numéro], siège : [adresse]. Directeur de la publication : [nom]. Contact : [email].</p>
<h3>Hébergeur</h3><p>[Nom et adresse de l’hébergeur].</p>
<h3>Données personnelles</h3><p>Les données saisies dans le formulaire de contact (nom, email, téléphone, message) servent uniquement à répondre à votre demande. Elles sont conservées [durée] puis supprimées. Vous disposez d’un droit d’accès, de rectification, d’effacement, d’opposition et de portabilité : écrivez à [email]. Vous pouvez saisir la CNIL (cnil.fr).</p>
<h3>Stockage local</h3><p>Vos favoris et comparaisons sont enregistrés dans votre navigateur. Ils ne sont pas transmis. Ce site n’utilise pas de cookie publicitaire.</p>`);
const vCgv=()=>page("Conditions générales de vente",`<p class="msg err">Modèle à compléter et à faire valider avant la mise en ligne.</p>
<h3>Prix</h3><p>Les prix sont affichés en euros TTC. Une offre reste valable dans la limite du stock disponible.</p>
<h3>Garantie</h3><p>Garantie légale de conformité (articles L217-3 et suivants du Code de la consommation) et garantie commerciale de [durée] : [conditions].</p>
<h3>Rétractation</h3><p>Pour une vente conclue au showroom, il n’existe pas de droit de rétractation légal. Pour une vente à distance, le délai de 14 jours s’applique : [conditions].</p>
<h3>Financement</h3><p>Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. [Mentions de l’organisme prêteur].</p>
<h3>Litiges</h3><p>Médiateur de la consommation : [nom et coordonnées].</p>`);

/* ============ ROUTEUR ============ */
function route(){
  const h=location.hash.replace(/^#\/?/,""),[p,q]=h.split("?"),[a,b]=p.split("/");
  const V={"":vHome,catalogue:vCat,favoris:vFavs,comparer:vCmp,apropos:vAbout,mentions:vMent,cgv:vCgv};
  $("#app").innerHTML=a==="voiture"?vCar(b):a==="contact"?vContact(q):(V[a]||vHome)();
  document.querySelectorAll("nav a").forEach(x=>x.toggleAttribute("aria-current",x.dataset.n===a));
  const t={"":"Voitures d’occasion contrôlées et garanties",catalogue:"Catalogue",favoris:"Favoris",comparer:"Comparateur",contact:"Contact",apropos:"À propos",mentions:"Mentions légales",cgv:"CGV"}[a];
  const c=a==="voiture"&&CARS.find(x=>x.id==b);
  document.title=(c?`${c.marque} ${c.modele} ${c.annee}`:t||"Patiko")+" – Patiko";
  if(a!=="voiture"){const s=$("#ld");if(s)s.remove()}
  if(a==="voiture")sim();
  window.scrollTo(0,0);chrome();
}
function chrome(){
  $("#nf").textContent=favs.length?`(${favs.length})`:"";
  const bar=$("#cbar");bar.classList.toggle("on",cmp.length>0);
  bar.innerHTML=cmp.length?`<span>${cmp.length} à comparer</span><a class="btn y" href="#/comparer">Comparer</a><button class="btn o" id="clr" style="color:#fff;border-color:#fff">Vider</button>`:"";
}
function sim(){
  const el=$("#sim");if(!el)return;const P=+el.dataset.p;
  const up=()=>{const a=+$("#ap").value,d=+$("#du").value,t=+$("#ta").value;
  $("#va").textContent=eur(a);$("#vd").textContent=d+" mois";$("#vt").textContent=t.toLocaleString("fr-FR",{minimumFractionDigits:1})+" %";
  $("#mo").textContent=eur(Math.round(mensu(P-a,d,t)))+" / mois"};
  el.addEventListener("input",up);up();
}

/* ============ ÉVÉNEMENTS ============ */
document.addEventListener("click",e=>{
  const f=e.target.closest("[data-fav]");
  if(f){const id=+f.dataset.fav;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];store.set("av_favs",favs);
    const y=scrollY;if(location.hash.startsWith("#/catalogue")){$("#list").innerHTML=vList()}else route();scrollTo(0,y);chrome();return}
  const p=e.target.closest("[data-p]");if(p){F.page=+p.dataset.p;$("#list").innerHTML=vList();$("#ff").scrollIntoView({behavior:"smooth"});return}
  const th=e.target.closest("[data-th]");if(th){$("#main").src=th.querySelector("img").src;document.querySelectorAll("[data-th]").forEach(x=>x.removeAttribute("aria-current"));th.setAttribute("aria-current","true");return}
  if(e.target.id==="clr"){cmp=[];store.set("av_cmp",cmp);chrome();document.querySelectorAll("[data-cmp]").forEach(x=>x.checked=false)}
  if(e.target.id==="reset"){F={...F,marque:"",carb:"",boite:"",q:"",prixMax:"",kmMax:"",anneeMin:"",page:1};route()}
});
document.addEventListener("change",e=>{
  const c=e.target.closest("[data-cmp]");
  if(c){const id=+c.dataset.cmp;
    if(c.checked&&cmp.length>=3){c.checked=false;alert("Vous pouvez comparer 3 voitures au maximum.");return}
    cmp=c.checked?[...cmp,id]:cmp.filter(x=>x!==id);store.set("av_cmp",cmp);chrome()}
});
document.addEventListener("input",e=>{
  const ff=e.target.closest("#ff");if(!ff)return;
  Object.assign(F,Object.fromEntries(new FormData(ff)),{page:1});$("#list").innerHTML=vList();
});
document.addEventListener("submit",async e=>{
  if(e.target.id==="qs"){e.preventDefault();Object.assign(F,Object.fromEntries(new FormData(e.target)),{page:1});location.hash="#/catalogue"}
  if(e.target.id==="cf"){e.preventDefault();const r=$("#res"),d=new FormData(e.target);
    /* Remplacez VOTRE_ID par l’identifiant de votre formulaire sur formspree.io */
    try{const x=await fetch("https://formspree.io/f/VOTRE_ID",{method:"POST",body:d,headers:{Accept:"application/json"}});
      if(!x.ok)throw 0;r.className="msg";r.textContent="Message envoyé. Nous vous répondons sous 24 h ouvrées.";e.target.reset()}
    catch(_){r.className="msg err";r.textContent="Envoi impossible. Vérifiez votre connexion ou écrivez-nous à contact@patiko.io."}}
});
/* Photo manquante : on affiche le visuel de substitution */
document.addEventListener("error",e=>{const t=e.target;if(t.tagName==="IMG"&&t.dataset.id&&!t.dataset.fb){t.dataset.fb=1;const c=CARS.find(x=>x.id==t.dataset.id);if(c){const s=Object.assign({},c,{images:null});t.src=img(s,+t.dataset.i)}}},true);
addEventListener("hashchange",route);
fetch("data/voitures.json").then(r=>{if(!r.ok)throw 0;return r.json()})
 .then(d=>{CARS=d.map(c=>({...c,carb:c.carburant,ch:c.puissance,badge:c.badge||""}));route()})
 .catch(()=>{$("#app").innerHTML='<section><div class="wrap"><h1>Catalogue indisponible</h1><p>Le fichier data/voitures.json est introuvable ou illisible. Ouvrez le site via un hébergement ou un serveur local (<code>python -m http.server</code>), pas en double-cliquant sur index.html.</p></div></section>'});
