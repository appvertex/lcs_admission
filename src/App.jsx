import React, { useEffect, useState } from 'react';
import { SignIn, useAuth, useUser } from '@clerk/react';
import { defaultContent, mergeContent } from './content.js';
import AdminContentEditor from './AdminContentEditor.jsx';

const facilityIcons = ['⌂', '◷', '✳', '♡'];

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span>; }
function Header({ page, go, signedIn, onSignOut, content }) {
  const [menuOpen,setMenuOpen]=useState(false);
  function navigate(target){go(target);setMenuOpen(false)}
  function section(id){setMenuOpen(false);if(page!=='home')go('home');setTimeout(()=>document.getElementById(id)?.scrollIntoView({behavior:'smooth'}),60)}
  const ui=content.ui;
  return <><div className="school-topbar"><div>{content.topbarText&&<span>{content.topbarText}</span>}{content.topbarText&&content.tagline&&<i/>}{content.tagline&&<span>{content.tagline}</span>}</div><span className="topbar-note">{ui.welcomePrefix} {content.schoolName}</span></div><header className="header"><a className="brand" href="#home" onClick={e=>{e.preventDefault();navigate('home')}}>{content.logoUrl&&<img className="brand-logo" src={content.logoUrl} alt={`${content.schoolName} logo`}/>}<span><b>{content.schoolName}</b><small>{content.tagline}</small></span></a><nav className={menuOpen?'nav-open':''} aria-label={ui.mainNavigation}>{content.navigation.home&&<a className={page==='home'?'active':''} href="#home" onClick={e=>{e.preventDefault();navigate('home')}}>{content.navigation.home}</a>}{content.navigation.about&&<a href="#school-about" onClick={e=>{e.preventDefault();section('school-about')}}>{content.navigation.about}</a>}{content.navigation.facilities&&<a href="#school-facilities" onClick={e=>{e.preventDefault();section('school-facilities')}}>{content.navigation.facilities}</a>}{content.navigation.activities&&<a href="#school-life" onClick={e=>{e.preventDefault();section('school-life')}}>{content.navigation.activities}</a>}{content.navigation.gallery&&<a href="#school-gallery" onClick={e=>{e.preventDefault();section('school-gallery')}}>{content.navigation.gallery}</a>}{content.navigation.admissions&&<a className={page==='overview'?'active':''} href="#admission-overview" onClick={e=>{e.preventDefault();navigate('overview')}}>{content.navigation.admissions}</a>}</nav><div className="header-actions">{signedIn?<><button className="nav-enquire" onClick={()=>navigate('apply')}>{ui.myEnquiry} <span>↗</span></button><button className="avatar" title={ui.signOut} onClick={onSignOut}>↗</button></>:content.navigation.apply&&<button className="nav-enquire" onClick={()=>navigate('apply')}>{content.navigation.apply} <span>↗</span></button>}<button className="menu" aria-label={menuOpen?ui.closeMenu:ui.openMenu} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'×':'☰'}</button></div></header></>;
}

function Promo({ onClose, onApply, content }) { const promo=content.promo,ui=content.ui;return <div className="shade" role="dialog" aria-modal="true" aria-label={promo.headline||ui.promoDialogLabel}><div className="promo"><button className="close" onClick={onClose} aria-label={ui.closePoster}>×</button><div className="promo-photo">{promo.imageUrl?<img className="promo-poster-image" src={promo.imageUrl} alt={ui.promoAlt}/>:<><div className="sun"></div><div className="hill hill1"></div><div className="hill hill2"></div><div className="promo-stamp">{ui.promoArtwork.map((line,i)=><React.Fragment key={line}>{i>0&&<br/>}{line}</React.Fragment>)}</div></>}<div className="photo-caption">{promo.imageCaption}</div></div><div className="promo-copy"><span className="eyebrow">{content.schoolName}</span><h2>{promo.headline}</h2><p>{promo.body}</p><button className="button button-dark" onClick={onApply}>{content.navigation.apply} <span>↗</span></button><span className="promo-note">{promo.note}</span></div></div></div>; }

function Home({ go, content }) {
  const {hero,about,life,gallery,admissionsCta}=content;
  const ui=content.ui;
  return <>
    {content.sections.hero&&<section className="school-hero"><div className="school-hero-copy"><span className="school-kicker"><i/> {hero.badge}</span><h1>{hero.title}<br/><em>{hero.highlight}</em></h1><p>{hero.body}</p><div className="school-hero-actions"><button className="button school-gold-button" onClick={()=>go('apply')}>{content.navigation.apply} <span>↗</span></button>{content.navigation.admissions&&<button className="school-outline-button" onClick={()=>go('overview')}>{ui.exploreAdmissions} <span>→</span></button>}</div><span className="school-motto">{hero.motto}</span></div><div className="school-hero-photo">{hero.imageUrl&&<img src={hero.imageUrl} alt={hero.imageAlt||''}/>}<div className="photo-caption"><span>{content.schoolName}</span><b>{hero.imageCaption}</b></div></div></section>}
    {content.sections.facts&&content.facts.length>0&&<section className="school-facts">{content.facts.map((fact,i)=><React.Fragment key={`${fact.title}-${i}`}>{i>0&&<i/>}<div><strong>{fact.title}</strong><span>{fact.label}</span></div></React.Fragment>)}</section>}
    {content.sections.about&&<section className="school-about" id="school-about"><div className="school-about-label"><span className="school-kicker">{about.badge}</span><span className="school-number">{ui.homeSectionNumber}</span></div><div className="school-about-main"><h2>{about.title}<br/><em>{about.highlight}</em></h2><div><p>{about.body}</p><button className="school-text-link" onClick={()=>go('overview')}>{ui.discoverPrefix} {content.schoolName} <span>→</span></button></div></div></section>}
    {content.sections.facilities&&<section className="school-facilities" id="school-facilities"><div className="school-section-heading"><div><span className="school-kicker">{content.facilitiesSection.badge}</span><h2>{content.facilitiesSection.title}<br/><em>{content.facilitiesSection.highlight}</em></h2></div><p>{content.facilitiesSection.description}</p></div>{content.facilities.length>0&&<div className="school-facility-grid">{content.facilities.map((item,i)=><article key={`${item.title}-${i}`}><span className="school-facility-icon">{facilityIcons[i%facilityIcons.length]}</span><span className="school-facility-number">{String(i+1).padStart(2,'0')}</span><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>}{content.curriculumNote&&<div className="school-curriculum"><b>{content.facilitiesSection.curriculumTitle}</b><p>{content.curriculumNote}</p></div>}</section>}
    {content.sections.life&&<section className="school-life" id="school-life"><div className="school-life-copy"><span className="school-kicker">{life.badge}</span><h2>{life.title}<br/><em>{life.highlight}</em></h2><p>{life.body}</p>{life.activities.length>0&&<div className="school-activity-list">{life.activities.map((activity,i)=><div key={`${activity}-${i}`}><span>{String(i+1).padStart(2,'0')}</span><b>{activity}</b><i>↗</i></div>)}</div>}</div><div className="school-life-image">{life.imageUrl&&<img src={life.imageUrl} alt={life.imageAlt||''}/>}<div>{life.imageCaption}</div></div></section>}
    {content.sections.gallery&&gallery.images.length>0&&<section className="school-gallery" id="school-gallery"><div className="school-gallery-heading"><div><span className="school-kicker">{gallery.badge}</span><h2>{gallery.title}</h2></div><span className="school-gallery-subtitle">{gallery.description}</span></div><div className="school-gallery-grid">{gallery.images.map((image,i)=><figure key={`${image.url}-${i}`}>{image.url&&<img src={image.url} alt={image.alt||''} loading="lazy"/>}<figcaption>{content.schoolName}</figcaption></figure>)}</div></section>}
    {content.sections.admissionsCta&&<section className="school-admissions-cta"><div><span className="school-kicker">{admissionsCta.badge}</span><h2>{admissionsCta.title}<br/><em>{admissionsCta.highlight}</em></h2><p>{admissionsCta.body}</p></div><button className="button school-gold-button" onClick={()=>go('apply')}>{content.navigation.apply} <span>↗</span></button></section>}
  </>;
}

function Overview({ go, content }) { const page=content.overview;return <><section className="page-hero"><span className="eyebrow"><i></i> {page.badge}</span><h1>{page.title}<br/><em>{page.highlight}</em></h1><p>{page.intro}</p><button className="button button-dark" onClick={()=>go('apply')}>{content.navigation.apply} <span>↗</span></button></section><section className="overview-content section-pad"><div className="section-label">{page.sectionBadge}</div><h2>{page.sectionTitle}<br/><em>{page.sectionHighlight}</em></h2>{page.steps.length>0&&<div className="steps">{page.steps.map((step,i)=><article key={`${step.title}-${i}`}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{step.title}</h3><p>{step.body}</p></div><b>↗</b></article>)}</div>}<div className="rules"><div><span className="eyebrow">{page.policyBadge}</span><h3>{page.policyTitle}<br/><em>{page.policyHighlight}</em></h3></div><div className="rules-copy">{page.policyText.split("\n\n").filter(Boolean).map((paragraph,i)=><p key={i}>{paragraph}</p>)}<button className="text-button" onClick={()=>go('apply')}>{content.ui.askQuestion} <span>→</span></button></div></div></section></>; }

function SignInGate({ go, content, redirectTo }) {
  const copy=content.auth;
  const configured=Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY&&!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.includes('replace_me'));
  return <section className="auth-page"><div className="auth-aside"><span className="eyebrow">{copy.schoolEyebrow}</span><h1>{copy.heroTitle}<br/><em>{copy.heroHighlight}</em></h1><p>{copy.heroBody}</p><button className="text-button on-dark" onClick={()=>go('home')}>{copy.backHome}</button><div className="auth-decoration">L</div></div><div className="auth-box"><div className="section-label">{copy.formEyebrow}</div><h2>{copy.title}</h2><p>{copy.body}</p>{configured?<SignIn routing="hash" oauthFlow="redirect" signUpForceRedirectUrl={redirectTo} forceRedirectUrl={redirectTo} appearance={{elements:{rootBox:'clerk-root',card:'clerk-card'}}}/>:<div className="setup-note"><b>{copy.setupTitle}</b><p>{copy.setupBody}</p></div>}<small className="privacy-note">{copy.privacy}</small></div></section>;
}

function EnquiryForm({ go, api, user, content }) {
  const copy=content.application;
  const [values,setValues]=useState({student_name:'',parent_name:'',parent_phone:'',class_applied:'',entry_type:'new',previous_school:'',aadhaar_number:'',address:'',religion:'',message:''});
  const [busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false);
  const update=e=>setValues({...values,[e.target.name]:e.target.value});
  async function submit(e){e.preventDefault();setBusy(true);setError('');try{await api('/api/enquiries',{method:'POST',body:JSON.stringify(values)});setDone(true)}catch(e){setError(e.message||content.ui.genericError)}finally{setBusy(false)}}
  if(done)return <section className="success"><span className="success-icon">✓</span><span className="eyebrow">{copy.successEyebrow}</span><h1>{copy.successTitle}<br/><em>{values.student_name.split(' ')[0]}.</em></h1><p>{copy.successBody.replace('{parent}',values.parent_name||'your family')}</p><div className="success-card"><span>{copy.applicationClass}</span><b>{values.class_applied}</b><small>{copy.enquiryLinked} {user?.primaryEmailAddress?.emailAddress}</small></div><button className="button button-dark" onClick={()=>go('home')}>{copy.backButton} <span>→</span></button></section>;
  return <section className="form-page"><div className="form-heading"><span className="eyebrow"><i></i> {copy.eyebrow}</span><h1>{copy.title}<br/><em>{copy.highlight}</em></h1><p>{copy.intro}</p><div className="signed-in"><span>✓</span> {content.ui.signedInAs} <b>{user?.primaryEmailAddress?.emailAddress||content.ui.googleAccount}</b></div></div><form className="enquiry-form" onSubmit={submit}>
    <div className="form-section-title"><span>01</span><div><b>{copy.childSection}</b><small>{copy.childHint}</small></div></div>
    <div className="field-grid"><label>{copy.studentLabel}<input required name="student_name" value={values.student_name} onChange={update} placeholder={copy.studentPlaceholder}/></label><label>{copy.classLabel}<select required name="class_applied" value={values.class_applied} onChange={update}><option value="">{copy.classPlaceholder}</option>{copy.classes.map(c=><option key={c}>{c}</option>)}</select></label></div>
    <div className="entry-select"><span>{copy.entryLabel}</span><label><input type="radio" name="entry_type" value="new" checked={values.entry_type==='new'} onChange={update}/><span><b>{copy.newLabel}</b><small>{copy.newHint}</small></span></label><label><input type="radio" name="entry_type" value="transfer" checked={values.entry_type==='transfer'} onChange={update}/><span><b>{copy.transferLabel}</b><small>{copy.transferHint}</small></span></label></div>
    {values.entry_type==='transfer'&&<label className="full-field">{copy.previousLabel}<input required name="previous_school" value={values.previous_school} onChange={update} placeholder={copy.previousPlaceholder}/></label>}
    <div className="form-section-title section-gap"><span>02</span><div><b>{copy.parentSection}</b><small>{copy.parentHint}</small></div></div>
    <div className="field-grid"><label>{copy.parentLabel}<input required name="parent_name" value={values.parent_name} onChange={update} placeholder={copy.parentPlaceholder}/></label><label>{copy.phoneLabel}<input required type="tel" name="parent_phone" value={values.parent_phone} onChange={update} placeholder={copy.phonePlaceholder} pattern="[+0-9() -]{8,18}"/></label></div>
    <label className="full-field">{copy.addressLabel}<textarea required name="address" value={values.address} onChange={update} placeholder={copy.addressPlaceholder} rows="3"/></label>
    <div className="field-grid"><label>{copy.religionLabel}<select required name="religion" value={values.religion} onChange={update}><option value="">{copy.religionPlaceholder}</option>{copy.religions.map(x=><option key={x}>{x}</option>)}</select></label><label>{copy.aadhaarLabel} <span className="optional">{copy.optional}</span><input inputMode="numeric" maxLength="12" pattern="[0-9]{12}" name="aadhaar_number" value={values.aadhaar_number} onChange={update} placeholder={copy.aadhaarPlaceholder}/><small className="field-help">{copy.aadhaarHint}</small></label></div>
    <label className="full-field">{copy.messageLabel}<textarea name="message" value={values.message} onChange={update} placeholder={copy.messagePlaceholder} rows="3"/></label><label className="consent"><input required type="checkbox"/><span>{copy.consent}</span></label>{error&&<div className="error-box">{error}</div>}<button className="button button-dark submit-button" disabled={busy}>{busy?copy.submitting:copy.submit} <span>↗</span></button><small className="form-privacy">{copy.privacy}</small>
  </form></section>;
}

function Admin({ api, go, user, content, setContent }) {
  const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[msg,setMsg]=useState(''),[panel,setPanel]=useState('enquiries'),[saving,setSaving]=useState(false),[saveMessage,setSaveMessage]=useState('');
  async function refresh(){try{const data=await api('/api/admin/enquiries');setItems(data.enquiries||[]);setMsg('')}catch(e){setMsg(e.message)}finally{setLoading(false)}}
  useEffect(()=>{refresh()},[]);
  async function change(id,status){try{await api(`/api/admin/enquiries/${id}`,{method:'PATCH',body:JSON.stringify({status})});setItems(rows=>rows.map(x=>x.id===id?{...x,status}:x))}catch(error){setMsg(error.message)}}
  async function saveContent(event){event.preventDefault();setSaving(true);setSaveMessage('');try{const result=await api('/api/admin/content',{method:'PUT',body:JSON.stringify(content)});if(result.content)setContent(mergeContent(result.content));setSaveMessage('Website content saved.')}catch(error){setSaveMessage(error.message)}finally{setSaving(false)}}
  const count=items.filter(x=>x.status==='New').length;
  const copy=content.ui.admin;
  return <section className="admin-page">
    <div className="admin-heading"><div><span className="eyebrow"><i></i> {copy.eyebrow}</span><h1>{copy.heading}</h1><p>{user?.primaryEmailAddress?.emailAddress}</p></div><button className="button button-dark" onClick={refresh}>{copy.refresh}</button></div>
    <nav className="admin-tabs" aria-label={copy.navigation}><button className={panel==='enquiries'?'selected':''} onClick={()=>setPanel('enquiries')}>{copy.enquiries} <span>{count}</span></button><button className={panel==='content'?'selected':''} onClick={()=>setPanel('content')}>{copy.websiteContent}</button><button onClick={()=>go('home')}>{copy.viewWebsite}</button></nav>
    {panel==='content'?<AdminContentEditor content={content} setContent={setContent} onSave={saveContent} saving={saving} saveMessage={saveMessage}/>:<>
      <div className="admin-stats"><div><span>{copy.total}</span><b>{items.length}</b><small>{copy.allTime}</small></div><div><span>{copy.needsResponse}</span><b>{count}</b><small>{copy.newEnquiries}</small></div><div><span>{copy.inProgress}</span><b>{items.filter(x=>['Contacted','Visit scheduled'].includes(x.status)).length}</b><small>{copy.progressDetail}</small></div></div>
      <div className="table-title"><div><h2>{copy.recent}</h2><p>{copy.followup}</p></div><span>{items.length} {copy.records}</span></div>{msg&&<div className="error-box">{msg}</div>}
      {loading?<p className="empty">{copy.loading}</p>:items.length===0?<div className="empty"><span>✳</span><h3>{copy.emptyTitle}</h3><p>{copy.emptyBody}</p></div>:<div className="table-wrap"><table><thead><tr><th>{copy.studentParent}</th><th>{copy.classColumn}</th><th>{copy.contactColumn}</th><th>{copy.receivedColumn}</th><th>{copy.statusColumn}</th></tr></thead><tbody>{items.map(x=><tr key={x.id}><td><b>{x.student_name}</b><small>{x.parent_name}</small></td><td>{x.class_applied}</td><td><a href={`tel:${x.parent_phone}`}>{x.parent_phone}</a><small>{x.parent_email}</small></td><td>{new Date(x.created_at+'Z').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td><td><select className={`status status-${x.status.toLowerCase().replaceAll(' ','-')}`} value={x.status} onChange={e=>change(x.id,e.target.value)}>{Object.entries(copy.statuses).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></td></tr>)}</tbody></table></div>}
    </>}
  </section>;
}

function AppCore(){
  const [page,setPage]=useState(location.pathname==='/admin'?'admin':location.pathname==='/admission-overview'?'overview':location.pathname==='/apply'?'apply':'home');
  const [promo,setPromo]=useState(false);
  const demoMode=import.meta.env.DEV&&import.meta.env.VITE_DEMO_AUTH==='true';
  const [siteContent,setSiteContent]=useState(defaultContent);
  const [contentReady,setContentReady]=useState(false);
  let auth={},userState={};
  try{auth=useAuth()}catch{}
  try{userState=useUser()}catch{}
  const demoUser={primaryEmailAddress:{emailAddress:'local-demo@loretto.test'}};
  const user=demoMode?demoUser:userState.user;
  const signedIn=demoMode||Boolean(auth.isSignedIn);
  const [token,setToken]=useState(null);
  useEffect(()=>{if(auth.getToken)auth.getToken().then(setToken).catch(()=>{})},[auth.isSignedIn]);
  useEffect(()=>{
    let active=true;
    async function loadContent(){
      if(demoMode){try{const stored=localStorage.getItem('loretto-demo-content');if(stored&&active)setSiteContent(mergeContent(JSON.parse(stored)))}catch{}finally{if(active)setContentReady(true)}return}
      try{const response=await fetch('/api/content');const data=response.ok?await response.json():null;if(active&&data?.content)setSiteContent(mergeContent(data.content))}catch{}finally{if(active)setContentReady(true)}
    }
    loadContent();return()=>{active=false};
  },[]);
  useEffect(()=>{const dismissed=sessionStorage.getItem('promo-dismissed');if(page==='home'&&siteContent.promo.enabled&&!dismissed&&!location.hash)setPromo(true);else setPromo(false)},[page,siteContent.promo.enabled]);
  function go(next){setPage(next);const path=next==='home'?'/':next==='overview'?'/admission-overview':`/${next}`;history.pushState({},'',path);window.scrollTo(0,0)}
  useEffect(()=>{const pop=()=>setPage(location.pathname==='/admin'?'admin':location.pathname==='/admission-overview'?'overview':location.pathname==='/apply'?'apply':'home');window.addEventListener('popstate',pop);return()=>window.removeEventListener('popstate',pop)},[]);
  async function api(path,opts={}){
    if(demoMode){
      const method=(opts.method||'GET').toUpperCase();
      const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
      const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
      if(path==='/api/content'&&method==='GET')return {content:read('loretto-demo-content',null)};
      if(path==='/api/admin/content'&&method==='PUT'){const data=JSON.parse(opts.body||'{}');write('loretto-demo-content',data);return {ok:true,content:data};}
      if(path==='/api/enquiries'&&method==='POST'){
        const data=JSON.parse(opts.body||'{}');const rows=read('loretto-demo-enquiries',[]);
        rows.unshift({id:crypto.randomUUID(),created_at:new Date().toISOString().slice(0,19).replace('T',' '),updated_at:new Date().toISOString().slice(0,19).replace('T',' '),parent_email:demoUser.primaryEmailAddress.emailAddress,...data,status:'New'});
        write('loretto-demo-enquiries',rows);return {ok:true,id:rows[0].id};
      }
      if(path==='/api/admin/enquiries'&&method==='GET')return {enquiries:read('loretto-demo-enquiries',[])};
      const statusMatch=path.match(/^\/api\/admin\/enquiries\/([0-9a-f-]+)$/i);
      if(statusMatch&&method==='PATCH'){const {status}=JSON.parse(opts.body||'{}');const rows=read('loretto-demo-enquiries',[]).map(row=>row.id===statusMatch[1]?{...row,status}:row);write('loretto-demo-enquiries',rows);return {ok:true};}
    }
    const headers={'Content-Type':'application/json',...(opts.headers||{})};
    const t=token||(await auth.getToken?.());if(t)headers.Authorization=`Bearer ${t}`;
    const res=await fetch(path,{...opts,headers});const data=await res.json().catch(()=>({}));
    if(!res.ok)throw new Error(data.error||'Request could not be completed.');return data;
  }
  function dismiss(){sessionStorage.setItem('promo-dismissed','1');setPromo(false)}
  async function signOut(){await auth.signOut?.();setToken(null);go('home')}
  let content;
  if(page==='overview')content=<Overview go={go} content={siteContent}/>;
  else if(page==='apply')content=signedIn?<EnquiryForm go={go} api={api} user={user} content={siteContent}/>:<SignInGate go={go} content={siteContent} redirectTo="/apply"/>;
  else if(page==='admin')content=signedIn?<Admin api={api} go={go} user={user} content={siteContent} setContent={setSiteContent}/>:<SignInGate go={go} content={siteContent} redirectTo="/admin"/>;
  else content=<Home go={go} content={siteContent}/>;
  if(!contentReady)return <div className="content-loading" aria-busy="true" aria-label="Loading school website"/>;
  return <>{demoMode&&<div className="demo-banner">{siteContent.ui.demoBanner}</div>}<Header page={page} go={go} signedIn={signedIn&&!demoMode} onSignOut={signOut} content={siteContent}/><main>{content}</main><footer className="footer"><a className="brand brand-light" href="#home" onClick={e=>{e.preventDefault();go('home')}}>{siteContent.logoUrl&&<img className="brand-logo" src={siteContent.logoUrl} alt={`${siteContent.schoolName} logo`}/>}<span><b>{siteContent.schoolName}</b><small>{siteContent.tagline}</small></span></a><div>{siteContent.footer.admissionsText&&<span>{siteContent.footer.admissionsText}</span>}<a href="#admin" onClick={e=>{e.preventDefault();go('admin')}}>{siteContent.ui.staffSignIn}</a><small>{siteContent.footer.copyright}</small></div></footer>{promo&&siteContent.promo.enabled&&<Promo onClose={dismiss} onApply={()=>{dismiss();go('apply')}} content={siteContent}/>}</>;
}

export default function App(){return <AppCore/>}
