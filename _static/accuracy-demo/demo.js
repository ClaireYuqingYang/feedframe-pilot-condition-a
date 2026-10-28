(() => {
const $ = id => document.getElementById(id);
const integratedDICE = Boolean($('accuracy-ui'));
// Presentation mode keeps the existing feed interactive without submitting to oTree.
if (integratedDICE) {
  $('accuracy-ui').closest('form')?.addEventListener('submit', event => event.preventDefault());
  document.querySelectorAll('.x-bookmark').forEach(button => {
    button.onclick=()=>{
      const selected=button.getAttribute('aria-pressed')!=='true';
      button.setAttribute('aria-pressed',String(selected));
      button.setAttribute('aria-label',selected?'Remove bookmark':'Bookmark post');
      button.querySelector('span').className=selected?'bi bi-bookmark-fill':'bi bi-bookmark';
    };
  });
  // Existing demo sessions retain the old avatar path in their feed snapshots.
  document.querySelectorAll('#tweet_table img[src="/static/img/avatars/nypost.ico"]').forEach(img => {
    img.src='/static/img/avatars/nypost.png';
  });
  document.querySelectorAll('#tweet_table img[src="/static/img/avatars/huffpost.svg"]').forEach(img => {
    img.src='/static/img/avatars/huffpost.png';
  });
}
// Wording and short forms follow the October main-study QSF.
const accuracy = [
  ["I'm someone who shares things that are true", "I share what's true"],
  ["I'm someone who thinks before passing things along", "I think before I share"],
  ["I'm someone who shares things people can trust", "I share what people can trust"],
  ["I'm someone who gets the facts straight in what I post", "I get the facts straight"],
  ["I'm someone who doesn't get fooled into spreading false stories", "I don't get fooled into spreading false stories"]
];
const goals = [
  ['I share things that make people laugh','I make people laugh','funny'],
  ['I share things I enjoy','I share what I enjoy','enjoyable'],
  ['I share things to connect with friends','I connect with friends','worth sending to friends'],
  ['I share things that get a reaction','I get a reaction','likely to get a reaction'],
  ['I share things that surprise people','I surprise people','surprising'],
  ['I share things people will talk about','I spark conversation','worth talking about'],
  ['I share things that say something about me','I express myself','meaningful to me'],
  ['I share things that keep people in the know','I keep people in the know','new and newsworthy'],
  ['Other (please describe):','','interesting']
];
const importance = ['not at all important','slightly important','moderately important','very important','extremely important'];
const plans = [
  ["ask myself if I'd bet it's true","ask if I'd bet it's true"],
  ["ask myself whether it's too good (or too weird) to be true","ask if it's too good to be true"],
  ["think about whether my friends would believe it","ask if friends would believe it"],
  ["ask if I'd be embarrassed if it turned out to be false","ask if I'd be embarrassed if it's false"],
  ["make sure it's true, not just PHRASE","make sure it's true, not just PHRASE"],
  ['pause and ask myself, "Is this accurate?"','pause and ask, "Is this accurate?"'],
  ['Write my own:','']
];
// Sample headlines from the supplied October QSF; interaction state is in memory only.
const posts = [
  ['BBC','bbc.com','Stranded baby elephant rescued from lake'],
  ['BBC','bbc.com','Plane with the largest wingspan in the world takes flight'],
  ['The Economist','economist.com','Pet-ownership is booming across the world'],
  ['New York Post','nypost.com','TSA finds missile launcher in passenger’s checked bag'],
  ['New York Post','nypost.com','Uncle Sam offering $1K to people who adopt untrained wild horse or burro']
];
let state = {version:'goals',accuracy:null,goal:null,plan:null,importance:null,customGoal:'',customPlan:''};
let draft, step, toastTimer, replyTarget;
const text = (tag, value, className) => {const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;};
const phrase = s => goals[s.goal ?? 0][2];
const goalText = s => s.goal===8 ? s.customGoal : goals[s.goal][1];
const planText = s => s.plan===6 ? s.customPlan : plans[s.plan][1].replace('PHRASE',phrase(s));
function notify(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',2200);}
function renderBanner(){
  if (integratedDICE) {
    $('accuracy-ui').hidden=state.version==='control';
    $('edit').hidden=state.version==='control';
  }
  const banner=$('banner');banner.replaceChildren();banner.classList.toggle('importance',state.version==='importance');
  if(state.version==='control') return;
  const ready=state.version==='importance'?state.importance!==null:state.accuracy!==null&&state.goal!==null;
  let summary='Choose what matters to you.';
  if(!ready){banner.append(text('p','Reminder','eyebrow'),text('p',state.version==='importance'?'How important is accuracy to you?':'What kind of sharer do you want to be?','goal-line'));}
  else if(state.version==='importance'){
    banner.append(text('p','Reminder','eyebrow'));
    const p=text('p','You said it is ','goal-line');p.append(text('strong',importance[state.importance]),document.createTextNode(' to you that the news articles you share are accurate.'));banner.append(p);summary=p.textContent;
  }else{
    banner.append(text('p','My sharing goals','eyebrow'));
    const p=text('p',accuracy[state.accuracy][1],'goal-line');p.append(text('span','+','plus'),document.createTextNode(goalText(state)));banner.append(p);summary=p.textContent;
    if(state.version==='plan'&&state.plan!==null){
      const line=text('p','','plan-line');
      line.append(text('i','My plan:'),document.createTextNode(` Before sharing something ${phrase(state)}, ${planText(state)}`));
      banner.append(line);
    }
  }
  if (!integratedDICE || !ready) {
    const edit=text('button',ready?'Edit my goal':'Set my sharing goal','quiet');edit.type='button';edit.onclick=()=>openSetup();banner.append(edit);
  }
  if ($('side-summary')) $('side-summary').textContent=summary;
  if ($('edit')) $('edit').textContent=ready?'Edit my sharing goal':'Set my sharing goal';
  if ($('side-edit')) $('side-edit').textContent=ready?'Edit my goal ↗':'Choose my goal ↗';
}
function openSetup(){draft={...state};step=draft.version==='importance'?3:0;renderStep();$('setup').showModal();}
function renderStep(){
  const isPlan=step===2;const title=step===0?'Which of these accuracy goals fits you best as a sharer?':step===1?'Which of these goals also fits you as a sharer?':isPlan?'Make a plan that puts both goals into practice.':'How important is accuracy to you?';
  $('step-label').textContent=step===3?'ACCURACY IMPORTANCE':`STEP ${step+1} OF ${draft.version==='plan'?3:2}`;
  $('setup-title').textContent=title;
  $('setup-intro').textContent=step===0?"You may want to share posts that are accurate, but you may also share for other reasons at the same time. With our new feature, you set 2 goals: an accuracy goal and one other goal of your choice. Your goals will appear at the top of your feed as a reminder while you scroll.":step===1?"Several may fit, so pick the one you'd most like in your reminder.":isPlan?`When something ${phrase(draft)} catches my eye, I'll ______ before I share it.`:'How important is it to you that you only share news articles on social media if they are accurate?';
  const values=step===0?accuracy.map(x=>x[0]):step===1?goals.map(x=>x[0]):isPlan?plans.map(x=>x[0].replace('PHRASE',phrase(draft))):importance;
  const key=['accuracy','goal','plan','importance'][step];
  $('choices').replaceChildren(text('legend','Choose one option','sr-only'));
  values.forEach((value,i)=>{const label=text('label','','option');const radio=document.createElement('input');radio.type='radio';radio.name='choice';radio.value=i;radio.checked=draft[key]===i;radio.onchange=()=>{draft[key]=i;showCustom();$('error').textContent='';};label.append(radio,text('span',value));$('choices').append(label);});
  $('custom').value=step===1?draft.customGoal:draft.customPlan;
  showCustom();$('error').textContent='';$('back').hidden=step===0||step===3;
  $('next').textContent=step===3||step===(draft.version==='plan'?2:1)?'Start browsing →':'Continue →';
}
function showCustom(){$('custom-wrap').hidden=!(step===1&&draft.goal===8||step===2&&draft.plan===6);}
function advanceSetup(event){
  event.preventDefault();const key=['accuracy','goal','plan','importance'][step];
  if(draft[key]===null){$('error').textContent='Please choose one option.';return;}
  if(!$('custom-wrap').hidden){if(!$('custom').value.trim()){$('error').textContent='Please add your own words.';$('custom').focus();return;}draft[step===1?'customGoal':'customPlan']=$('custom').value.trim();}
  if(step===3||step===(draft.version==='plan'?2:1)){state={...draft};$('setup').close();renderBanner();return;}
  step++;renderStep();$('setup').scrollTop=0;$('choices').querySelector('input').focus();
}
if (integratedDICE) {
  $('next').onclick=advanceSetup;
  $('setup-form').addEventListener('keydown', event => {
    if (event.key==='Enter' && event.target.tagName==='INPUT') advanceSetup(event);
  });
} else $('setup-form').onsubmit=advanceSetup;
$('back').onclick=()=>{step--;renderStep();};$('close').onclick=()=>$('setup').close();
$('version').onchange=()=>{
  state.version=$('version').value;renderBanner();
  if (state.version!=='control') openSetup();
};
if (integratedDICE) {
  $('hide-controls').onclick=()=>{ $('demo-controls').hidden=true; };
  document.addEventListener('keydown',event=>{
    if(event.key.toLowerCase()!=='h'||event.ctrlKey||event.metaKey||event.altKey||
       event.target.closest('input,textarea,select,[contenteditable]')||document.querySelector('dialog[open]'))return;
    $('demo-controls').hidden=!$('demo-controls').hidden;
  });
}
['edit','side-edit'].forEach(id=>{if($(id))$(id).onclick=()=>openSetup();});
function renderPosts(){
  $('posts').replaceChildren();
  posts.forEach(([source,handle,headline],i)=>{
    const article=text('article','','post');const author=text('div','','author');const meta=text('div','');meta.append(text('strong',source),text('div',handle,'handle'));author.append(text('span',source==='The Economist'?'E':source==='New York Post'?'NYP':'BBC','avatar'),meta);
    article.append(author,text('h3',headline,'headline'));const actions=text('div','','actions');const replies=text('div','','replies');
    [['♡','Like'],['↻','Repost'],['↗','Share'],['○','Reply']].forEach(([icon,name])=>{const button=text('button',`${icon} ${name}`);button.type='button';button.setAttribute('aria-label',`${name}: ${headline}`);if(name!=='Reply')button.setAttribute('aria-pressed','false');button.onclick=()=>{if(name==='Reply'){replyTarget=replies;$('reply-text').value='';$('reply').showModal();return;}const selected=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(selected));button.textContent=`${icon} ${selected?{Like:'Liked',Repost:'Reposted',Share:'Shared'}[name]:name}`;if(selected&&name==='Share')notify('Shared in this demo');};actions.append(button);});
    article.append(actions,replies);$('posts').append(article);
  });
}
if (!integratedDICE) {
  $('reply-form').onsubmit=event=>{event.preventDefault();const value=$('reply-text').value.trim();if(!value)return;replyTarget.append(text('p',value));$('reply').close();};
  $('cancel-reply').onclick=()=>$('reply').close();$('back-top').onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
}
$('restart').onclick=()=>{
  if (integratedDICE) { window.location.reload(); return; }
  state={version:'goals',accuracy:null,goal:null,plan:null,importance:null,customGoal:'',customPlan:''};$('version').value='goals';renderPosts();renderBanner();window.scrollTo(0,0);openSetup();
};
if (!integratedDICE) renderPosts();
renderBanner();
})();
