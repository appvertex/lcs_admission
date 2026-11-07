import React, { useState } from 'react';

const navigation = [
  ['identity', 'School & hero'], ['home', 'Home sections'], ['facilities', 'Facilities'],
  ['activities', 'Activities'], ['gallery', 'Gallery'], ['admissions', 'Admissions'],
  ['promotion', 'Promotion poster'], ['footer', 'Navigation & footer']
];

export default function AdminContentEditor({ content, setContent, onSave, saving, saveMessage }) {
  const [active, setActive] = useState('identity');
  function update(path, value) {
    setContent(current => {
      const next = structuredClone(current);
      let target = next;
      for (const key of path.slice(0, -1)) target = target[key];
      target[path[path.length - 1]] = value;
      return next;
    });
  }
  function add(path, value) { update(path, [...path.reduce((object, key) => object[key], content), value]); }
  function remove(path, index) { update(path, path.reduce((object, key) => object[key], content).filter((_, itemIndex) => itemIndex !== index)); }
  const val = path => path.reduce((object, key) => object?.[key], content) ?? '';
  const field = (label, path, multiline = false, hint = '') => <label className="cms-field">{label}{multiline ? <textarea rows="4" value={val(path)} onChange={event => update(path, event.target.value)}/> : <input value={val(path)} onChange={event => update(path, event.target.value)}/>}{hint&&<small>{hint}</small>}</label>;
  const image = (label, path) => <>{field(label, path, false, 'Paste an image URL. Leave blank to remove the image.')}</>;
  const toggle = (label, path) => <label className="cms-toggle"><input type="checkbox" checked={Boolean(val(path))} onChange={event => update(path, event.target.checked)}/><span>{label}</span></label>;
  const repeat = (title, path, initial, renderItem) => {
    const items = val(path) || [];
    return <section className="cms-repeat"><div className="cms-repeat-head"><h3>{title}</h3><button type="button" className="cms-add" onClick={() => add(path, initial)}>＋ Add {title.replace(/s$/, '').toLowerCase()}</button></div>{items.length ? items.map((item, index) => <article className="cms-item" key={index}><div className="cms-item-title"><b>{title.slice(0, -1)} {index + 1}</b><button type="button" className="cms-delete" onClick={() => remove(path, index)}>Delete</button></div>{renderItem(item, index)}</article>) : <p className="cms-empty">No {title.toLowerCase()} yet. Use “Add” to create one.</p>}</section>;
  };
  const textItem = (path, index, label) => <label className="cms-field">{label}<input value={val([...path, index])} onChange={event => update([...path, index], event.target.value)}/></label>;
  const objectItem = (path, index, fields) => <div className="cms-grid">{fields.map(([key, label, multiline]) => field(label, [...path, index, key], multiline))}</div>;

  let body;
  if (active === 'identity') body = <><div className="cms-grid">{field('School name', ['schoolName'])}{field('School tagline', ['tagline'])}{image('Logo image URL', ['logoUrl'])}</div><div className="cms-divider"/><h3>Home page hero</h3><div className="cms-grid">{field('Small heading', ['hero','badge'])}{field('Main heading', ['hero','title'])}{field('Highlighted heading', ['hero','highlight'])}{field('Short introduction', ['hero','body'], true)}{field('Motto', ['hero','motto'])}{image('Campus photo URL', ['hero','imageUrl'])}{field('Photo description', ['hero','imageAlt'])}{field('Photo caption', ['hero','imageCaption'])}</div></>;
  if (active === 'home') body = <><div className="cms-toggles">{Object.keys(content.sections).map(section => toggle(`Show ${section === 'admissionsCta' ? 'admissions call to action' : section} section`, ['sections', section]))}</div><div className="cms-divider"/><h3>About the school</h3><div className="cms-grid">{field('Section label', ['about','badge'])}{field('Heading', ['about','title'])}{field('Highlighted heading', ['about','highlight'])}{field('Description', ['about','body'], true)}</div><div className="cms-divider"/><h3>Home page facts</h3>{repeat('Facts', ['facts'], {title:'',label:''}, (_,i)=>objectItem(['facts'],i,[['title','Fact / number'],['label','Description']]))}<div className="cms-divider"/><h3>Admissions call to action</h3><div className="cms-grid">{field('Section label', ['admissionsCta','badge'])}{field('Heading', ['admissionsCta','title'])}{field('Highlighted heading', ['admissionsCta','highlight'])}{field('Description', ['admissionsCta','body'], true)}</div></>;
  if (active === 'facilities') body = <><div className="cms-grid">{field('Section label', ['facilitiesSection','badge'])}{field('Heading', ['facilitiesSection','title'])}{field('Highlighted heading', ['facilitiesSection','highlight'])}{field('Short introduction', ['facilitiesSection','description'], true)}{field('Curriculum label', ['facilitiesSection','curriculumTitle'])}{field('Curriculum and syllabus details', ['curriculumNote'], true)}</div><div className="cms-divider"/>{repeat('Facilities', ['facilities'], {title:'',body:''}, (_,i)=>objectItem(['facilities'],i,[['title','Facility name'],['body','Description',true]]))}</>;
  if (active === 'activities') body = <><div className="cms-grid">{field('Section label', ['life','badge'])}{field('Heading', ['life','title'])}{field('Highlighted heading', ['life','highlight'])}{field('Description', ['life','body'], true)}{image('School life photo URL', ['life','imageUrl'])}{field('Image description', ['life','imageAlt'])}{field('Image caption', ['life','imageCaption'])}</div><div className="cms-divider"/>{repeat('Activities', ['life','activities'], '', (_,i)=>textItem(['life','activities'],i,'Activity name'))}</>;
  if (active === 'gallery') body = <><div className="cms-grid">{field('Section label', ['gallery','badge'])}{field('Gallery heading', ['gallery','title'])}{field('Short description', ['gallery','description'], true)}</div><div className="cms-divider"/>{repeat('Gallery images', ['gallery','images'], {url:'',alt:''}, (_,i)=>objectItem(['gallery','images'],i,[['url','Image URL'],['alt','Image description']]))}</>;
  if (active === 'admissions') body = <><div className="cms-grid">{field('Page label', ['overview','badge'])}{field('Page heading', ['overview','title'])}{field('Highlighted heading', ['overview','highlight'])}{field('Introduction', ['overview','intro'], true)}{field('Process section label', ['overview','sectionBadge'])}{field('Process heading', ['overview','sectionTitle'])}{field('Highlighted heading', ['overview','sectionHighlight'])}</div><div className="cms-divider"/>{repeat('Admission steps', ['overview','steps'], {title:'',body:''}, (_,i)=>objectItem(['overview','steps'],i,[['title','Step title'],['body','Details',true]]))}<div className="cms-divider"/><div className="cms-grid">{field('Rules section label', ['overview','policyBadge'])}{field('Rules heading', ['overview','policyTitle'])}{field('Highlighted heading', ['overview','policyHighlight'])}{field('Admission rules', ['overview','policyText'], true)}</div></>;
  if (active === 'promotion') body = <><div className="cms-toggles">{toggle('Show promotional poster on home page', ['promo','enabled'])}</div><div className="cms-grid">{field('Poster headline', ['promo','headline'])}{field('Poster message', ['promo','body'], true)}{image('Poster image URL', ['promo','imageUrl'])}{field('Image caption', ['promo','imageCaption'])}{field('Button note', ['promo','note'])}</div></>;
  if (active === 'footer') body = <><div className="cms-grid">{field('Top bar message', ['topbarText'])}{field('Footer admissions label', ['footer','admissionsText'])}{field('Footer copyright', ['footer','copyright'])}</div><div className="cms-divider"/><h3>Website navigation labels</h3><div className="cms-grid">{Object.keys(content.navigation).map(key => field(`${key[0].toUpperCase()}${key.slice(1)} link label`, ['navigation', key]))}</div></>;

  return <div className="cms-layout"><nav className="cms-nav" aria-label="Website content sections">{navigation.map(([key,label])=><button type="button" key={key} className={active===key?'active':''} onClick={()=>setActive(key)}>{label}<span>›</span></button>)}</nav><form className="cms-panel" onSubmit={onSave}><header className="cms-panel-heading"><div><span className="eyebrow">WEBSITE CONTENT</span><h2>{navigation.find(([key])=>key===active)?.[1]}</h2><p>Edit the content shown to families. Delete individual items or hide a whole section.</p></div></header><div className="cms-panel-body">{body}</div><footer className="cms-savebar">{saveMessage&&<span className="save-message">{saveMessage}</span>}<button className="button button-dark" disabled={saving}>{saving?'Saving…':'Save changes'} <span>↗</span></button></footer></form></div>;
}
