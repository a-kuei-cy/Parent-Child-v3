// Details use only records already returned by the public dashboard.
function safeFeedPhoto(value){
  try { const url=new URL(String(value||'')); return ['https:','http:'].includes(url.protocol)?url.href:''; }
  catch { return ''; }
}
function formatFeedDate(value){
  if(!value)return '';
  const date=new Date(value);
  return Number.isNaN(date.getTime())?String(value):new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
}
const readingDialog=document.createElement('dialog');
readingDialog.className='reading-dialog';
readingDialog.setAttribute('aria-labelledby','readingTitle');
readingDialog.innerHTML=`
  <div class="reading-head"><b>📖 共讀時光</b><button type="button" class="btn btn-soft" data-close autofocus>關閉 ✕</button></div>
  <div class="reading-body" id="readingBody"></div>
  <div class="reading-foot"><button type="button" class="btn btn-soft" data-prev>← 上一則</button><span class="meta" id="readingPosition" aria-live="polite"></span><button type="button" class="btn btn-soft" data-next>下一則 →</button></div>`;
document.body.append(readingDialog);
let readingRecords=[],readingIndex=0,readingTrigger=null,readingOverflow='';
function renderReadingDetail(){
  const r=readingRecords[readingIndex];
  if(!r)return;
  const photo=safeFeedPhoto(r.photoUrl);
  const details=[formatFeedDate(r.readDate),r.companion?`陪讀者：${r.companion}`:'',r.minutes?`${r.minutes} 分鐘`:''].filter(Boolean);
  const bookInfo=[r.author?`作者：${r.author}`:'',r.publisher?`出版社：${r.publisher}`:''].filter(Boolean);
  document.getElementById('readingBody').innerHTML=`
    <h2 id="readingTitle">《${esc(r.bookTitle||'共讀分享')}》</h2>
    <p>${esc([r.className,r.studentName].filter(Boolean).join(' '))}</p>
    <p class="meta">${esc(details.join(' · '))}</p>
    ${bookInfo.length?`<p class="meta">${esc(bookInfo.join(' · '))}</p>`:''}
    <figure class="reading-photo">${photo?`<img src="${esc(driveThumb(photo,1600))}" data-original="${esc(photo)}" alt="${esc('《'+(r.bookTitle||'共讀分享')+'》共讀照片')}"><div class="feed-ph" style="display:none">照片暫時無法顯示，可點下方連結查看。</div><a href="${esc(photo)}" target="_blank" rel="noopener noreferrer">開啟原始照片 ↗</a>`:'<div class="feed-ph">📖 這則分享尚未附上照片</div>'}</figure>
    <h3>我們的共讀心得</h3><p class="reading-reflection">${esc(r.reflection||'這則分享尚未填寫心得。')}</p>`;
  const img=readingDialog.querySelector('img');
  if(img)img.onerror=()=>imgFallback(img,img.dataset.original);
  readingDialog.querySelector('[data-prev]').disabled=readingIndex===0;
  readingDialog.querySelector('[data-next]').disabled=readingIndex===readingRecords.length-1;
  document.getElementById('readingPosition').textContent=`第 ${readingIndex+1} 則，共 ${readingRecords.length} 則`;
  readingDialog.scrollTop=0;
}
document.getElementById('latestFeed').addEventListener('click',event=>{
  const trigger=event.target.closest('[data-feed-index]');
  if(!trigger)return;
  readingRecords=(data.publicDashboard?.latest||[]).slice();
  readingIndex=Number(trigger.dataset.feedIndex);
  if(!readingRecords[readingIndex])return;
  readingTrigger=trigger;
  renderReadingDetail();
  readingOverflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  readingDialog.showModal();
});
readingDialog.querySelector('[data-close]').addEventListener('click',()=>readingDialog.close());
for(const [selector,step] of [['[data-prev]',-1],['[data-next]',1]]){
  readingDialog.querySelector(selector).addEventListener('click',()=>{
    const next=readingIndex+step;
    if(next<0||next>=readingRecords.length)return;
    readingIndex=next;
    renderReadingDetail();
    if(readingDialog.querySelector(selector).disabled)readingDialog.querySelector('[data-close]').focus();
  });
}
let readingBackdropDown=false;
readingDialog.addEventListener('pointerdown',event=>{readingBackdropDown=event.target===readingDialog;});
readingDialog.addEventListener('click',event=>{
  if(event.target!==readingDialog||!readingBackdropDown)return;
  const rect=readingDialog.getBoundingClientRect();
  if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)readingDialog.close();
});
readingDialog.addEventListener('close',()=>{
  document.body.style.overflow=readingOverflow;
  if(readingTrigger?.isConnected)readingTrigger.focus();
});
