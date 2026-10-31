import {readFile,writeFile,cp,mkdir,rm,readdir} from 'node:fs/promises';
const json=async p=>JSON.parse(await readFile(p,'utf8'));
const collection=async name=>{const files=(await readdir(`content/${name}`)).filter(f=>f.endsWith('.json'));const rows=await Promise.all(files.map(f=>json(`content/${name}/${f}`)));return rows.sort((a,b)=>(a.order??100)-(b.order??100)||a.id.localeCompare(b.id));};
const allPlaces=await collection('places'),allCategories=await collection('categories'),allPages=await collection('pages');
const settings=await json('content/settings.json');
for(const [name,rows] of Object.entries({places:allPlaces,categories:allCategories,pages:allPages})){
 const ids=new Set();for(const row of rows){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.id)||ids.has(row.id))throw Error(`${name}: invalid or duplicate id ${row.id}`);ids.add(row.id);if(row.published===false)continue;for(const l of ['en','de'])if(!row[l]?.[name==='places'?'specialty':'title'])throw Error(`${name}/${row.id}: missing ${l} text`);}
}
const reserved=['all','en','de','pages','places','assets'];for(const c of allCategories)if(reserved.includes(c.id))throw Error(`Reserved category id: ${c.id}`);
const known=new Set(allCategories.map(c=>c.id));for(const p of allPlaces){for(const c of p.categories)if(!known.has(c))throw Error(`Unknown category ${c} in ${p.id}`);if(p.rating!=null&&(!Number.isFinite(p.rating)||p.rating<0||p.rating>5))throw Error(`Invalid rating in ${p.id}`);}
const places=allPlaces.filter(p=>p.published!==false),categories=allCategories.filter(p=>p.published!==false),pages=allPages.filter(p=>p.published!==false);
await rm('dist',{recursive:true,force:true});await cp('site','dist',{recursive:true});
await writeFile('dist/data.js',`window.PLACES=${JSON.stringify(places)};\nwindow.CATEGORIES=${JSON.stringify(categories)};\nwindow.PAGES=${JSON.stringify(pages)};\nwindow.SETTINGS=${JSON.stringify(settings)};`);
const html=await readFile('site/index.html','utf8');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
for(const lang of ['en','de'])for(const item of [{path:'',title:'Freiburg for Marlene'},...categories.map(c=>({path:c.id,title:c[lang].title+' · Freiburg for Marlene'})),...pages.map(p=>({path:'pages/'+p.id,title:p[lang].title+' · Freiburg for Marlene'}))]){const dir=`dist/${lang}/${item.path}`;await mkdir(dir,{recursive:true});await writeFile(dir+'/index.html',html.replace('<html lang="en">',`<html lang="${lang}">`).replace('<title>Freiburg for Marlene</title>',`<title>${escape(item.title)}</title>`));}
await writeFile('dist/404.html','<!doctype html><html lang="en"><meta charset="utf-8"><title>Page not found</title><body><h1>Page not found</h1><a href="/en/">Back to Freiburg for Marlene</a></body></html>');
console.log(`Built ${places.length} places, ${categories.length} categories, ${pages.length} pages in EN and DE.`);
