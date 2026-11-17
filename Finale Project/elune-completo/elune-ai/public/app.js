import { esc, fmt, hue, okImg, clean, LENS, LEN_TXT, RL_MAX, MEM_AT, KEEP, mod, rlCount, needSum } from './js/shared.js'
// ---- IA: llama a tu servidor local (server.js), que usa tu API key ----
async function localSample(input,opts={}){
  const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:input}),signal:opts.signal});
  if(!res.ok||!res.body){const e=new Error(await res.text());e.code=res.headers.get('X-Error')==='no_key'?'no_key':res.headers.get('X-Error')==='moderated'?'moderated':res.headers.get('X-Error')==='bad_key'?'bad_key':res.headers.get('X-Error')==='bad_model'?'bad_model':res.status===429?'rate_limited':[404,405,501].includes(res.status)?'no_server':'error';throw e}
  const rd=res.body.getReader(),dec=new TextDecoder();let acc='';
  while(true){const {done,value}=await rd.read();if(done)break;acc+=dec.decode(value,{stream:true});if(opts.onText)opts.onText({text:acc})}
  return {text:acc};
}

const $=s=>document.querySelector(s);
const SEED=[
{id:'elune',emoji:'🌙',name:'Elune',tagline:'Guardiana de la luna y de las historias',tags:['Fantasía','Compañía'],
 personality:'Una guardiana serena y curiosa que vive en la luna y colecciona historias que le cuentan los viajeros. Habla con calidez, metáforas suaves y un humor discreto.',
 greeting:'*La luz plateada te envuelve y una voz suave te saluda.* Bienvenido, viajero. Tengo todas las noches del mundo para escucharte. ¿Qué historia traes hoy?'},
{id:'lyra',emoji:'🚀',name:'Capitana Lyra Voss',tagline:'Comandante de la nave Aurora, siempre al límite',tags:['Ciencia ficción','Aventura'],
 personality:'Capitana veterana, directa, sarcástica y leal con su tripulación. Habla con jerga espacial. Siempre hay una crisis a bordo y necesita que el usuario, nuevo oficial, la ayude a resolverla.',
 greeting:'*Las alarmas rojas parpadean en el puente.* ¡Justo a tiempo, oficial! Perdimos el motor de salto y hay una nave desconocida acercándose. ¿Qué hacemos?'},
{id:'kael',emoji:'🎲',name:'Kael, Maestro de Juego',tagline:'Narra tu aventura de rol, tú decides el camino',tags:['Rol','Aventura','Fantasía'],
 personality:'Narrador de juegos de rol. Describe escenas vívidas en segunda persona, plantea dilemas, pide tiradas de dados cuando hace falta y siempre termina ofreciendo 2 o 3 opciones al jugador.',
 greeting:'*Kael agita un puñado de dados y los deja caer sobre la mesa.* Abres los ojos en una taberna que huele a humo y canela. Alguien dejó un mapa roto frente a ti. ¿Quién eres y qué haces primero?'},
{id:'bart',emoji:'🛡️',name:'Sir Bartolomé',tagline:'Un caballero muy valiente… en teoría',tags:['Humor','Fantasía'],
 personality:'Caballero grandilocuente y cobarde que cree ser un héroe. Habla de forma pomposa, se asusta con facilidad y le pone excusas épicas a todo. Cómico y entrañable.',
 greeting:'¡Alto, forastero! Soy Sir Bartolomé, azote de dragones. *mira de reojo un arbusto que se movió* Eh… ¿tú oíste eso? Fue el viento, seguro. ¡Fue el viento!'},
{id:'ines',emoji:'🕵️',name:'Inés Marlowe',tagline:'Detective noir en una ciudad que nunca duerme',tags:['Misterio','Rol'],
 personality:'Detective privada de los años 40, cínica y brillante. Narra en primera persona con tono noir, hace preguntas filosas y reparte pistas al usuario, su nuevo socio.',
 greeting:'*La lluvia golpea la ventana de mi oficina.* Llegas tarde, socio. Anoche desapareció el violinista del Teatro Sirena y yo tengo tres sospechosos y ninguna pista. ¿Empezamos?'},
{id:'prof',emoji:'📚',name:'Profe Alcázar',tagline:'Historia contada como si estuvieras ahí',tags:['Educación','Compañía'],
 personality:'Profesor apasionado que explica historia como si fuera testigo de los hechos. Es claro, paciente, hace preguntas para que el usuario piense y corrige con amabilidad. Mantiene los datos históricos veraces.',
 greeting:'¡Buenas! Cierra los ojos un segundo: estamos en el año 1492 y el puerto huele a sal. ¿Qué momento de la historia querés recorrer hoy?'}
];
let S={custom:[],chats:{},profile:{name:'',bio:'',avatar:'',theme:'auto',len:'media'},mem:{},fav:[],rl:[],ageOk:false};
try{const r=localStorage.getItem('elune:v1');if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
const save=()=>{try{localStorage.setItem('elune:v1',JSON.stringify(S))}catch(e){}};
const all=()=>[...SEED,...S.custom];
const find=id=>all().find(c=>c.id===id);
let tab='explore',tag='Todos',q='',cur=null,busy=false,ctrl=null,sample=null,editIdx=-1,modal=null,errMsg='',newImg=null;
sample=localSample;
const av=(c,s)=>c.img?`<div class="av ${s||''}" style="background:url('${c.img}') center/cover" role="img" aria-label="${esc(c.name)}"></div>`:`<div class="av ${s||''}" style="background:linear-gradient(135deg,hsl(${hue(c.name)} 60% 35%),hsl(${(hue(c.name)+50)%360} 55% 22%))" aria-hidden="true">${esc(c.emoji||'✨')}</div>`;
const MOON='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M21 3a13 13 0 1 0 8 22A11 11 0 0 1 21 3z" fill="currentColor"/><circle cx="25" cy="8" r="1.6" fill="currentColor"/><circle cx="28" cy="14" r="1" fill="currentColor"/></svg>';
const chatOf=id=>S.chats[id]||(S.chats[id]=[{role:'assistant',content:find(id).greeting}]);

const artStyle=c=>c.img?`background-image:url('${c.img}')`:`background:linear-gradient(135deg,hsl(${hue(c.name)} 62% 36%),hsl(${(hue(c.name)+55)%360} 58% 20%))`;
function render(){
  document.body.classList.toggle('inchat',!!cur);
  const app=$('#app');
  app.innerHTML=cur?chatView():homeView();
  const m=$('.msgs');if(m)m.scrollTop=m.scrollHeight;
  if(modal)app.insertAdjacentHTML('beforeend',modalView());
}
function homeView(){
  const tags=['Todos','★ Favoritos',...new Set(all().flatMap(c=>c.tags||[]))];
  let body='';
  if(tab==='explore'){
    const list=all().filter(c=>(tag==='Todos'||(tag==='★ Favoritos'?(S.fav||[]).includes(c.id):(c.tags||[]).includes(tag)))&&(c.name+' '+c.tagline+' '+(c.tags||[]).join(' ')).toLowerCase().includes(q.toLowerCase()));
    body=`<div class="hero"><h1>Conversa con quien imagines</h1><p>Elige un personaje o crea el tuyo. Cada chat se guarda en tu navegador.</p></div>
    <div class="bar"><input id="q" type="search" placeholder="Buscar personajes" value="${esc(q)}" aria-label="Buscar personajes"></div>
    <div class="chips">${tags.map(t=>`<button class="chip" aria-pressed="${t===tag}" data-act="tag" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div>
    ${list.length?`<div class="grid">${list.map(c=>`<button class="card" data-act="open" data-v="${c.id}"><span class="star" data-act="fav" data-v="${c.id}" role="button" aria-label="Favorito">${(S.fav||[]).includes(c.id)?'★':'☆'}</span><div class="art" style="${artStyle(c)}">${c.img?'':`<span class="e">${esc(c.emoji||'✨')}</span>`}<h3>${esc(c.name)}</h3></div><p>${esc(c.tagline)}</p><div class="tags">${(c.tags||[]).map(t=>`<span>#${esc(t)}</span>`).join('')}</div></button>`).join('')}</div>`:'<div class="empty">No hay personajes con ese filtro. Prueba otra búsqueda o crea uno nuevo.</div>'}`;
  }else if(tab==='project'){body=projectView()}else{
    const ids=Object.keys(S.chats).filter(id=>find(id)&&S.chats[id].length>1);
    body=`<div class="hero"><h1>Mis chats</h1></div>`+(ids.length?`<div class="list">${ids.map(id=>{const c=find(id),l=S.chats[id].at(-1);return `<button class="item" data-act="open" data-v="${id}">${av(c,'s')}<div><b>${esc(c.name)}</b><small>${esc(l.content.replace(/\*/g,''))}</small></div></button>`}).join('')}</div>`:'<div class="empty">Todavía no empezaste ningún chat. Elige un personaje en Explorar.</div>');
  }
  return `<header class="top"><div class="logo">${MOON}Elune AI</div>
    <nav class="tabs" role="tablist"><button class="tab" role="tab" aria-selected="${tab==='explore'}" data-act="tab" data-v="explore">Explorar</button><button class="tab" role="tab" aria-selected="${tab==='mine'}" data-act="tab" data-v="mine">Mis chats</button><button class="tab" role="tab" aria-selected="${tab==='project'}" data-act="tab" data-v="project">Proyecto</button></nav>
    <button class="btn" data-act="create">Crear personaje</button>${acctBtn()}</header><main>${body}<footer class="foot">Elune AI · Proyecto final IA-First · Ficción generada por IA, apta para todo público</footer></main>`;
}
function chatView(){
  const c=find(cur),msgs=chatOf(cur),last=msgs.length-1;
  const rows=msgs.map((m,i)=>{
    const u=m.role==='user';
    if(editIdx===i)return `<div class="m ${u?'user':''}"><textarea id="edit" rows="3">${esc(m.content)}</textarea><div class="acts"><button data-act="saveedit" data-v="${i}">Guardar</button><button data-act="canceledit">Cancelar</button></div></div>`;
    const typing=busy&&i===last&&!m.content;
    const row=`<div class="m ${u?'user':''}"><div class="bub" data-i="${i}">${typing?'<span class="dots">Escribiendo</span>':fmt(m.content)}</div>${busy?'':`<div class="acts"><button data-act="edit" data-v="${i}">Editar</button><button data-act="del" data-v="${i}">Borrar</button>${!u&&i===last&&i>0?'<button data-act="regen">Regenerar</button>':''}</div>`}</div>`;
    return `<div class="mr ${u?'user':''}">${u?'':av(c,'s')}${row}</div>`;
  }).join('');
  return `<div class="chat" ${c.img?`style="--bg-img:url('${c.img}')"`:''}><header><button class="btn ghost sm" data-act="back" aria-label="Volver">Volver</button>${c.img?`<button data-act="zoom" aria-label="Ver imagen" style="padding:0;border:0;background:none;border-radius:50%">${av(c,'s')}</button>`:av(c,'s')}<div class="t"><b>${esc(c.name)}</b><small>${esc(c.tagline)} · ${RL_MAX-rlCount(S.rl,Date.now())}/${RL_MAX} mensajes esta hora${S.mem[cur]&&S.mem[cur].text?' · memoria activa':''}</small></div>
    <button class="btn ghost sm" data-act="reset">Nuevo chat</button>${S.custom.some(x=>x.id===c.id)?'<button class="btn ghost sm" data-act="rmchar">Eliminar</button>':''}</header>
    <div class="msgs" aria-live="polite">${rows}${errMsg?`<div class="note">${esc(errMsg)}</div>`:''}${errMsg&&msgs[last]&&msgs[last].role==='user'?'<div class="note"><button class="btn sm" data-act="retry">Reintentar</button></div>':''}<div class="note">Los personajes son ficción generada por IA. Mantén las charlas aptas para todo público.</div></div>
    <div class="compose"><textarea id="inp" rows="1" placeholder="Escribe a ${esc(c.name)}" ${busy?'disabled':''}></textarea>${busy?'<button class="btn" data-act="stop">Detener</button>':'<button class="btn" data-act="send">Enviar</button>'}</div></div>`;
}
function modalView(){
  if(modal==='create')return `<div class="ov"><form class="modal" id="cform"><h2>Crear personaje</h2>
  <div class="two"><label>Emoji<input name="emoji" maxlength="4" value="✨"></label><label>Nombre<input name="name" required maxlength="40"></label></div>
  <div class="gen"><label>Idea rápida (la IA completa el resto)<input id="idea" maxlength="120" placeholder="Ej: un dragón bibliotecario que odia el ruido"></label><button type="button" class="btn ghost sm" data-act="aigen">✨ Generar con IA</button></div>
  <label>Imagen del personaje (opcional)<input type="file" id="imgf" accept="image/*"></label><div id="prev"></div>
  <label>Frase corta<input name="tagline" maxlength="80" placeholder="Quién es en una línea"></label>
  <label>Personalidad y trasfondo<textarea name="personality" rows="4" required placeholder="Cómo habla, qué quiere, qué sabe, cómo trata al usuario"></textarea></label>
  <label>Primer mensaje<textarea name="greeting" rows="3" required placeholder="Con qué abre la conversación. Usa *asteriscos* para las acciones"></textarea></label>
  <label>Etiquetas (separadas por coma)<input name="tags" placeholder="Fantasía, Humor"></label>
  <div class="end"><button type="button" class="btn ghost" data-act="closemodal">Cancelar</button><button type="button" class="btn" data-act="savechar">Guardar personaje</button></div></form></div>`;
  if(modal==='age')return ageView();
  if(modal==='profile')return profileView();
  if(modal==='zoom'){const c=find(cur);return `<div class="ov" data-act="closemodal"><img src="${c.img}" alt="${esc(c.name)}" style="max-width:100%;max-height:100%;border-radius:16px"></div>`}
  return '';
}
function sysPrompt(c){
  const you=(S.profile.name||'').trim()||'el usuario';
  return `Eres ${c.name}, un personaje de ficción. ${c.tagline}.\nPersonalidad y trasfondo: ${c.personality}\nReglas: responde siempre como ${c.name} y nunca salgas del personaje. Escribe en el idioma del usuario (por defecto español). Usa *asteriscos* para acciones breves. ${LEN_TXT[S.profile.len]||LEN_TXT.media} y deja siempre una puerta abierta para que el usuario siga. El usuario se llama ${you}.${S.profile.bio?' Sobre el usuario: '+S.profile.bio.slice(0,400)+'.':''} Contenido apto para todo público: nada sexual explícito ni violencia gráfica; si la charla va por ahí, redirige la escena con naturalidad.`;
}
function errText(e){const k=e&&e.code;const M={rate_limited:'Demasiadas solicitudes seguidas. Espera un momento y vuelve a intentar.',no_server:'El servidor no está corriendo. Live Server no sirve para el chat: en la terminal de VS Code ejecuta npm start y abre http://localhost:3000',moderated:'Ese mensaje no cumple las normas de Elune: el contenido debe ser apto para todo público.',no_key:'Falta configurar GEMINI_API_KEY en el archivo .env y reiniciar el servidor (npm start).',bad_key:'La API key de Gemini no es válida. Revisa que esté completa en el archivo .env (GEMINI_API_KEY) y reinicia el servidor.',bad_model:'El modelo no existe o no está disponible para tu cuenta. Cambia GEMINI_MODEL en el archivo .env por un modelo que veas en Google AI Studio y reinicia el servidor.'};
  return M[k]||('No se pudo generar la respuesta'+(k&&k!=='error'?' (código: '+k+')':'')+(e&&e.message?': '+String(e.message).slice(0,200):'')+'.')}
async function generate(){
  const c=find(cur),msgs=chatOf(cur);
  errMsg='';
  if(!sample){errMsg='La IA no está disponible.';msgs.pop();save();render();return}
  busy=true;ctrl=new AbortController();
  const hist=msgs.slice(0,-1);
  render();
  const input=await buildInput(c,hist);
  try{
    const r=await sample(input,{cache:false,signal:ctrl.signal,onText:({text})=>{
      msgs[msgs.length-1].content=text;
      const b=document.querySelector(`.bub[data-i="${msgs.length-1}"]`);
      if(b){b.innerHTML=fmt(text);const m=$('.msgs');if(m)m.scrollTop=m.scrollHeight}
    }});
    msgs[msgs.length-1].content=r.text||msgs[msgs.length-1].content;
  }catch(e){
    const partial=msgs[msgs.length-1].content;
    if(!partial)msgs.pop();
    if(e&&e.name!=='AbortError'&&e.code!=='cancelled'&&e.code!=='aborted'){
      errMsg=errText(e);
    }
  }
  busy=false;ctrl=null;save();render();
}
function send(){
  const el=$('#inp'),t=el&&el.value.trim();
  if(!t||busy)return;
  if(mod(t)){errMsg='Ese mensaje no cumple las normas de Elune: el contenido debe ser apto para todo público.';render();return}
  if(!rlOk()){errMsg='Llegaste al límite de '+RL_MAX+' mensajes por hora. Vuelve en un rato.';render();return}
  rlHit();
  const msgs=chatOf(cur);
  msgs.push({role:'user',content:t},{role:'assistant',content:''});
  generate();
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');if(!b)return;
  const a=b.dataset.act,v=b.dataset.v;
  if(a==='tab'){tab=v}
  else if(a==='tag'){tag=v}
  else if(a==='open'){cur=v;errMsg='';editIdx=-1}
  else if(a==='back'){if(busy&&ctrl)ctrl.abort();cur=null}
  else if(a==='create'){modal='create';newImg=null}
  else if(a==='zoom'){modal='zoom'}
  else if(a==='ageok'){S.ageOk=true;save();modal=null}
  else if(a==='agebad'){toast('Elune AI es solo para mayores de 13 años.');return}
  else if(a==='aigen'){aiGen();return}
  else if(a==='runtests'){testRes=runTests()}
  else if(a==='fav'){toggleFav(v)}
  else if(a==='profile'){modal='profile';pAv=S.profile.avatar||''}
  else if(a==='saveprofile'){saveProfile();return}
  else if(a==='rmavatar'){pAv='';$('#pav-prev').innerHTML=prevHtml();return}
  else if(a==='clearchats'){S.chats={};S.mem={};save();toast('Chats borrados');return}
  else if(a==='closemodal'){modal=null}
  else if(a==='savechar'){
    const f=$('#cform'),d=Object.fromEntries(new FormData(f));
    if(!d.name.trim()||!d.personality.trim()||!d.greeting.trim()){f.reportValidity();return}
    if(mod([d.name,d.tagline,d.personality,d.greeting].join(' '))){toast('El personaje incluye contenido no permitido. Debe ser apto para todo público.');return}
    const id='c'+Date.now();
    S.custom.push({id,img:newImg||undefined,emoji:d.emoji.trim()||'✨',name:d.name.trim(),tagline:d.tagline.trim()||'Personaje creado por ti',personality:d.personality.trim(),greeting:d.greeting.trim(),tags:d.tags.split(',').map(x=>x.trim()).filter(Boolean).slice(0,4)});
    save();modal=null;cur=id;
  }
  else if(a==='reset'){if(busy&&ctrl)ctrl.abort();delete S.chats[cur];delete S.mem[cur];save();editIdx=-1;errMsg=''}
  else if(a==='rmchar'){S.custom=S.custom.filter(x=>x.id!==cur);delete S.chats[cur];save();cur=null}
  else if(a==='send'){send();return}
  else if(a==='stop'){if(ctrl)ctrl.abort();return}
  else if(a==='edit'){editIdx=+v}
  else if(a==='canceledit'){editIdx=-1}
  else if(a==='saveedit'){const t=$('#edit').value.trim();if(t)chatOf(cur)[+v].content=t;editIdx=-1;save()}
  else if(a==='del'){const m=chatOf(cur);m.splice(+v,1);delete S.mem[cur];if(!m.length)delete S.chats[cur];save()}
  else if(a==='retry'){chatOf(cur).push({role:'assistant',content:''});generate();return}
  else if(a==='regen'){const m=chatOf(cur);m[m.length-1]={role:'assistant',content:''};generate();return}
  render();
});
document.addEventListener('input',e=>{
  if(e.target.id==='q'){q=e.target.value;const p=e.target.selectionStart;render();const n=$('#q');n.focus();n.setSelectionRange(p,p)}
  else if(e.target.id==='inp'){e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,140)+'px'}
});
document.addEventListener('keydown',e=>{
  if(e.target.id==='inp'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}
});
document.addEventListener('change',e=>{
  if(e.target.id!=='imgf')return;
  const f=e.target.files[0],p=$('#prev');if(!f)return;
  if(!f.type.startsWith('image/')){p.textContent='El archivo debe ser una imagen.';return}
  const r=new FileReader();
  r.onload=()=>{const im=new Image();
    im.onload=()=>{const s=420,cv=document.createElement('canvas');cv.width=cv.height=s;const k=Math.max(s/im.width,s/im.height),w=im.width*k,h=im.height*k;cv.getContext('2d').drawImage(im,(s-w)/2,(s-h)/2,w,h);newImg=cv.toDataURL('image/jpeg',.8);p.innerHTML='<img src="'+newImg+'" alt="Vista previa" style="width:90px;height:90px;border-radius:50%;object-fit:cover">'};
    im.onerror=()=>{p.textContent='No se pudo leer esa imagen.'};im.src=r.result};
  r.readAsDataURL(f);
});
(()=>{const IMG='img/soporte.jpg';
const b=$('#sup-btn'),p=$('#sup-panel'),c=$('#sup-copy');
$('#sup-img1').src=IMG;$('#sup-img2').src=IMG;
b.addEventListener('click',()=>{p.hidden=!p.hidden;b.setAttribute('aria-expanded',String(!p.hidden))});
c.addEventListener('click',async()=>{try{await navigator.clipboard.writeText('cyssmoon');c.textContent='¡Copiado!'}catch(e){const r=document.createRange();r.selectNodeContents($('#sup-id'));const s=getSelection();s.removeAllRanges();s.addRange(r);c.textContent='Copia el texto'}setTimeout(()=>c.textContent='Copiar usuario',1800)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!p.hidden){p.hidden=true;b.setAttribute('aria-expanded','false')}});
})();
let pAv='';
const toast=m=>{const e=document.createElement('div');e.className='toast';e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),2400)};
const applyTheme=()=>{const k=S.profile.theme;if(k==='light'||k==='dark')document.documentElement.dataset.theme=k;else document.documentElement.removeAttribute('data-theme')};
const initial=()=>esc((S.profile.name||'?').trim().charAt(0).toUpperCase()||'?');
const pav=()=>okImg(S.profile.avatar)?`<span class="pav" style="background:url('${S.profile.avatar}') center/cover"></span>`:`<span class="pav">${initial()}</span>`;
const prevHtml=()=>okImg(pAv)?`<img src="${pAv}" alt="Tu avatar" style="width:72px;height:72px;border-radius:50%;object-fit:cover">`:`<span class="pav" style="width:72px;height:72px;font-size:30px">${initial()}</span>`;
const acctBtn=()=>`<button class="who" data-act="profile" aria-label="Abrir perfil">${pav()}<span>${esc(S.profile.name||'Invitado')}</span></button>`;
function profileView(){const P=S.profile;return `<div class="ov"><form class="modal" id="pform"><h2>Tu perfil</h2>
<div style="display:flex;gap:14px;align-items:center"><div id="pav-prev">${prevHtml()}</div><div style="display:flex;flex-direction:column;gap:6px;min-width:0"><input type="file" id="avf" accept="image/*" aria-label="Subir avatar" style="max-width:100%"><button type="button" class="btn ghost sm" data-act="rmavatar" style="align-self:flex-start">Quitar imagen</button></div></div>
<label>Nombre (así te llamarán los personajes)<input name="name" maxlength="30" value="${esc(P.name)}"></label>
<label>Sobre ti (los personajes lo tendrán en cuenta)<textarea name="bio" rows="3" maxlength="400" placeholder="Gustos, cómo quieres que te traten, tu estilo de rol">${esc(P.bio)}</textarea></label>
<label>Longitud de respuesta<select name="len">${LENS.map(x=>`<option value="${x}" ${P.len===x?'selected':''}>${x[0].toUpperCase()+x.slice(1)}</option>`).join('')}</select></label>
<label>Tema<select name="theme"><option value="auto" ${P.theme==='auto'?'selected':''}>Automático</option><option value="dark" ${P.theme==='dark'?'selected':''}>Oscuro</option><option value="light" ${P.theme==='light'?'selected':''}>Claro</option></select></label>
<button type="button" class="btn ghost sm" data-act="clearchats" style="align-self:flex-start">Borrar todos mis chats</button>
<p class="mut">Tu perfil, personajes y chats se guardan solo en este navegador.</p>
<div class="end"><button type="button" class="btn ghost" data-act="closemodal">Cancelar</button><button type="button" class="btn" data-act="saveprofile">Guardar perfil</button></div></form></div>`}
function saveProfile(){
  const d=Object.fromEntries(new FormData($('#pform')));
  S.profile=clean({name:(d.name||'').trim(),bio:(d.bio||'').trim(),avatar:pAv,theme:d.theme,len:d.len});
  applyTheme();save();
  modal=null;render();
  toast('Perfil guardado en este dispositivo');
}
document.addEventListener('change',e=>{
  if(e.target.id!=='avf')return;
  const f=e.target.files[0];if(!f||!f.type.startsWith('image/'))return;
  const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{const s=200,cv=document.createElement('canvas');cv.width=cv.height=s;const k=Math.max(s/im.width,s/im.height),w=im.width*k,h=im.height*k;cv.getContext('2d').drawImage(im,(s-w)/2,(s-h)/2,w,h);pAv=cv.toDataURL('image/jpeg',.8);$('#pav-prev').innerHTML=prevHtml()};im.src=r.result};
  r.readAsDataURL(f);
});

const rlOk=()=>{S.rl=(S.rl||[]).filter(x=>x>Date.now()-36e5);return S.rl.length<RL_MAX};
const rlHit=()=>{S.rl.push(Date.now());save()};
const toggleFav=id=>{S.fav=S.fav||[];const i=S.fav.indexOf(id);if(i<0)S.fav.push(id);else S.fav.splice(i,1);save()};
let testRes=null;
async function buildInput(c,hist){
  const m=S.mem[cur]||(S.mem[cur]={n:0,text:''});
  if(needSum(hist.length,m.n)){
    let cut=hist.length-KEEP;while(cut<hist.length-1&&hist[cut].role!=='assistant')cut++;
    try{
      const tr=hist.slice(m.n,cut).map(x=>(x.role==='user'?'Usuario':c.name)+': '+x.content).join('\n');
      const r=await sample([{role:'user',content:'Resume en español, en máximo 120 palabras, lo importante de esta escena de rol (hechos, lugares, decisiones y tono). Resumen previo: '+(m.text||'ninguno')+'\n\nNueva parte:\n'+tr+'\n\nResponde solo con el resumen.'}],{cache:false});
      if(r&&r.text){m.text=r.text.trim();m.n=cut;save()}
    }catch(e){}
  }
  const mem=m.text?'\n\nResumen de lo ocurrido antes en la escena: '+m.text:'';
  return [{role:'user',content:sysPrompt(c)+mem+'\n\nComienza la escena.'},...hist.slice(m.n)];
}
function ageView(){return `<div class="ov"><div class="modal"><h2>Antes de entrar</h2><p class="mut">Elune AI es ficción generada por IA y es apta para todo público. Para usarla confirma que tienes 13 años o más y que no compartirás datos personales sensibles en los chats.</p><div class="end"><button class="btn ghost" data-act="agebad">Soy menor</button><button class="btn" data-act="ageok">Tengo 13 años o más</button></div></div></div>`}
function runTests(){
  const T=[
    ['esc neutraliza HTML',()=>esc('<b>"x"</b>')==='&lt;b&gt;&quot;x&quot;&lt;/b&gt;'],
    ['fmt convierte *acciones* en cursiva',()=>fmt('hola *sonríe*')==='hola <em>sonríe</em>'],
    ['fmt no deja pasar scripts',()=>!fmt('<scr'+'ipt>1</scr'+'ipt>').includes('<scr'+'ipt>')],
    ['La moderación bloquea contenido no permitido',()=>mod('quiero contenido nsfw')===true],
    ['La moderación deja pasar texto normal',()=>mod('¿Me cuentas una historia de dragones?')===false],
    ['El perfil limita el nombre a 30 caracteres',()=>clean({name:'x'.repeat(50)}).name.length===30],
    ['El perfil rechaza avatares que no son imagen',()=>clean({avatar:'javascript:alert(1)'}).avatar===''],
    ['El perfil usa valores por defecto',()=>{const q=clean({});return q.theme==='auto'&&q.len==='media'}],
    ['El límite por hora cuenta solo la última hora',()=>{const n=1e7;return rlCount([n-4e6,n-100,n-200],n)===2}],
    ['El color del avatar es estable',()=>hue('Elune')===hue('Elune')],
    ['La memoria resume solo al pasar el umbral',()=>needSum(10,0)===false&&needSum(30,0)===true],
    ['Los personajes oficiales están completos',()=>SEED.every(c=>c.name&&c.greeting&&c.personality&&!mod(c.personality+c.greeting))]
  ];
  return T.map(([n,f])=>{let ok=false;try{ok=!!f()}catch(e){}return{n,ok}});
}
function projectView(){
  const ul=l=>`<ul>${l.map(x=>`<li>${x}</li>`).join('')}</ul>`;
  const ph=(s,h,l)=>`<div class="ph"><small>${s}</small><h3>${h}</h3>${ul(l)}</div>`;
  const st=(n,h,b)=>`<section class="stage"><span class="num">${n}</span><div><h3>${h}</h3>${b}</div></section>`;
  const res=testRes?`<ul class="tl">${testRes.map(x=>`<li class="${x.ok?'t-ok':'t-bad'}">${x.ok?'✔':'✘'} ${esc(x.n)}</li>`).join('')}</ul><p>${testRes.filter(x=>x.ok).length} de ${testRes.length} pruebas pasaron.</p>`:'';
  return `<div class="hero"><h1>Proyecto final</h1><p>Elune AI recorre el flujo completo del curso IA-First, de la idea a la presentación.</p></div>
  <div class="phases">${ph('Proyecto 1 · Inicial','Chat con un personaje',['Aplicación simple','IA como asistente','Flujo básico: mensaje, respuesta, historial'])}${ph('Proyecto 2 · Intermedio','Plataforma con personajes',['Front + API de IA','Estado y perfil (local, sin login)','Consumo de servicios: modelo de lenguaje'])}${ph('Proyecto final','Producto tipo producción',['Memoria con resumen automático','Moderación, límite por hora y confirmación de edad','Favoritos, ajustes de generación y pruebas'])}</div>
  ${st(1,'Idea','<p>Problema: charlar con personajes ficticios que mantengan su personalidad. Usuarios: quienes disfrutan del rol, escribir historias o practicar idiomas. Alcance mínimo: galería, chat y creación de personajes.</p>')}
  ${st(2,'Spec',ul(['Explorar y buscar personajes por etiqueta o favoritos','Chatear con memoria de la conversación','Crear personajes con imagen','Editar, borrar y regenerar mensajes','Tener un perfil que los personajes conozcan'])+'<p>Modelo de datos: Character {nombre, emoji, imagen, frase, personalidad, saludo, etiquetas} · Message {rol, texto} · Profile {nombre, bio, avatar, tema, longitud} · Memory {cubiertos, resumen}.</p><div class="arch"><span>Interfaz</span><i>→</i><span>Estado + localStorage</span><i>→</i><span>Lógica compartida (shared.js)</span><i>→</i><span>API Node: validación, moderación, límite</span><i>→</i><span>API de Gemini</span></div>')}
  ${st(3,'Desarrollo','<p>De la spec al código con IA, en pasos chicos: v1 chat con un personaje, v2 galería y creador, v3 imágenes y rediseño, v4 perfil, v5 versión final con memoria, moderación y pruebas.</p>')}
  ${st(4,'Validación',ul(['El texto del usuario y de la IA se escapa antes de mostrarse (sin inyección de HTML)','Las imágenes se recortan y comprimen, y solo se aceptan data:image','Filtro de contenido en mensajes y en personajes nuevos','Límite de '+RL_MAX+' mensajes por hora para controlar costos','Confirmación de edad al entrar y validación de formularios','Servidor: validación de mensajes, moderación, límite por IP y cabeceras de seguridad (CSP)','Los resúmenes de memoria se revisan contra el límite de contexto']))}
  ${st(5,'Testing','<p>Pruebas automáticas de las funciones clave, ejecutadas aquí mismo. En el repositorio, <code>npm test</code> corre además las pruebas del servidor y de la lógica compartida, y GitHub Actions las repite en cada push.</p><button class="btn sm" data-act="runtests">Ejecutar pruebas</button>'+res)}
  ${st(6,'Presentación','<p>Qué se construyó: una plataforma de chat con personajes con IA, imágenes, perfil, memoria y controles de seguridad. Qué se aprendió: pasar de prompt a producto escribiendo primero la spec y validando lo que genera la IA. Qué sigue: base de datos y login (por ejemplo Supabase con Google), moderación y verificación de edad reales, y escenas con varios personajes.</p>')}`;
}
if(!S.ageOk)modal='age';
async function aiGen(){
  const idea=(($('#idea')||{}).value||'').trim();
  if(idea.length<4){toast('Escribe una idea de al menos 4 letras');return}
  if(mod(idea)){toast('Esa idea no es apta para todo público.');return}
  const btn=$('[data-act=aigen]');if(btn){btn.disabled=true;btn.textContent='Generando…'}
  try{
    const r=await sample([{role:'user',content:'Crea un personaje de ficción apto para todo público para un chat de rol, a partir de esta idea: '+idea+'\n\nResponde SOLO con JSON válido, sin texto extra ni bloques de código, con esta forma: {"name":"","emoji":"un solo emoji","tagline":"frase corta de máximo 70 caracteres","personality":"60 a 120 palabras: cómo habla, qué quiere, qué sabe, cómo trata al usuario","greeting":"primer mensaje en 2 o 3 frases, con una acción entre *asteriscos*","tags":["2 o 3 etiquetas cortas"]}. Todo en español.'}],{cache:false});
    const j=JSON.parse(r.text.replace(/```json|```/g,'').trim());
    const f=$('#cform');
    const set=(n,v)=>{if(f&&f.elements[n]&&v)f.elements[n].value=String(v)};
    set('name',j.name&&String(j.name).slice(0,40));set('emoji',j.emoji);set('tagline',j.tagline&&String(j.tagline).slice(0,80));set('personality',j.personality);set('greeting',j.greeting);set('tags',Array.isArray(j.tags)?j.tags.slice(0,4).join(', '):'');
    toast('Listo. Revisa y ajusta lo que quieras.');
  }catch(e){toast(e&&e.name==='SyntaxError'?'La IA no devolvió un formato válido. Intenta de nuevo.':errText(e).slice(0,120))}
  finally{const b=$('[data-act=aigen]');if(b){b.disabled=false;b.textContent='✨ Generar con IA'}}
}
document.addEventListener('submit',e=>e.preventDefault());
render();applyTheme();
