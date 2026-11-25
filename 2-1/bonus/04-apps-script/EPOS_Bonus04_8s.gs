const EPOS04_8S = Object.freeze({
  endpoint: 'https://copa.codyssey.kr/api/v1/videos',
  model: 'gemini-omni-1.2-flash',
  durationSeconds: 8,
  resolution: '720p',
  aspectRatio: '16:9',
  tokenCap: 192000,
  session: 'epos-bonus04-new-cast-8s',
  prompt: "8초, 16:9. 고대 그리스 에게해의 석회암 해안에서 가상의 성인 여성을 눈높이 정면 클로즈업으로 한 번에 찍는다. 짙은 갈색 머리는 양쪽 귀 뒤로 넘겨 눈과 입이 드러난다. 얼굴은 턱으로 갈수록 부드럽게 좁아지고, 광대가 또렷하다. 회청색 눈, 피부의 자연스러운 결, 망치로 두드린 자국이 있는 금빛 물방울 귀걸이. 화면 왼쪽에서 들어온 늦은 오후 햇빛이 뺨과 귀걸이를 밝히고, 뒤쪽 바다에서 빛이 잔잔하게 반짝인다. 두 눈 사이를 화면의 가로 중앙에 두고, 9:16으로 잘라도 두 눈과 입, 턱 끝이 남게 잡는다. 카메라와 초점은 고정한다.\n\n여성은 렌즈 바로 너머의 한 사람을 바라본다. 처음 2초쯤 조용히 숨을 고른 뒤, 상대에게 여행의 이름을 알려 주듯 그리스어 «Έπος»를 딱 한 번 말한다. 낮고 단단한 평소 목소리로 또렷하게 말한다. 노래하거나 속삭이거나 음절을 끌지 않는다. 발화에 맞춰 입술, 턱과 볼이 함께 움직인다. ‘π’에서 입술이 잠깐 자연스럽게 닫힌다. 말이 끝나면 편하게 입을 다물고 상대의 반응을 기다리듯 같은 시선을 2초 이상 유지한다. 소리는 화면 속 여성의 목소리와 멀리서 들리는 파도뿐이다. 음악, 다른 대사, 컷 전환, 자막, 로고는 없다.",
});
const EPOS04_8S_ATTEMPT = 'EPOS04_GEMINI_OMNI_8S_NEWCAST_ATTEMPT';
const EPOS04_8S_JOB = 'EPOS04_GEMINI_OMNI_8S_NEWCAST_JOB';
const EPOS04_8S_DOWNLOAD = 'EPOS04_GEMINI_OMNI_8S_NEWCAST_DOWNLOAD';
function epos04Preview8s() {
  console.log(JSON.stringify({event:'preview', model:EPOS04_8S.model, durationSeconds:8,
    resolution:'720p', aspectRatio:'16:9', maxPosts:1, tokenCap:192000, session:EPOS04_8S.session}));
}
function epos04Request_(route, method, props, payload) {
  const key=(props.getProperty('COPA_API_KEY')||'').trim();
  if(!key || /\s/.test(key) || key.startsWith('<')) throw new Error('Set COPA_API_KEY privately in Script Properties.');
  const o={method, headers:{Authorization:'Bearer '+key,'X-Codyssey-Session-Id':EPOS04_8S.session},
    followRedirects:false, muteHttpExceptions:true};
  if(payload) {o.contentType='application/json'; o.payload=JSON.stringify(payload);}
  return UrlFetchApp.fetch(EPOS04_8S.endpoint+route,o);
}
function epos04Read_(r) {
  let p={};
  try {const x=JSON.parse(r.getContentText()); if(x && typeof x==='object') p=x;} catch (_) {}
  const x=p.result||p.data||p;
  const valid=v=>typeof v==='string' && /^[a-zA-Z0-9_.-]{1,120}$/.test(v)?v:'';
  return {http:r.getResponseCode(), job:valid(x.jobId)||valid(x.id),
    request:valid(x.requestId), status:valid(x.status), error:valid(p.error?.code)||valid(p.code)};
}
function epos04Log_(event, b={}) {
  const mask=v=>v?v.slice(0,6)+'…'+v.slice(-4):undefined;
  console.log(JSON.stringify({at:new Date().toISOString(),event,session:EPOS04_8S.session,
    http:b.http, status:b.status||undefined, jobId:mask(b.job), requestId:mask(b.request),
    errorCode:b.error||undefined, bytes:b.bytes, sha256:b.sha256, driveFileId:b.fileId}));
}
function epos04Submit8sOnce() {
  const p=PropertiesService.getScriptProperties(), l=LockService.getScriptLock();
  if(!l.tryLock(1500)) throw new Error('Another execution has the lock.');
  try {
    if(p.getProperty(EPOS04_8S_ATTEMPT)) throw new Error('POST attempt already recorded. Do not repeat.');
    if(!p.getProperty('COPA_API_KEY')) throw new Error('Set COPA_API_KEY privately in Script Properties.');
    const {model,prompt,durationSeconds,resolution,aspectRatio}=EPOS04_8S;
    p.setProperty(EPOS04_8S_ATTEMPT,new Date().toISOString());
    let r;
    try {r=epos04Request_('','post',p,{model,prompt,durationSeconds,resolution,aspectRatio});}
    catch (_) {epos04Log_('post_transport_uncertain_do_not_retry'); return;}
    const b=epos04Read_(r);
    if(b.http>=200 && b.http<300 && b.job) p.setProperty(EPOS04_8S_JOB,b.job);
    epos04Log_('post_response',b);
  } finally {l.releaseLock();}
}
function epos04Job_(p) {
  const id=p.getProperty(EPOS04_8S_JOB)||'';
  if(!/^[a-zA-Z0-9_.-]{1,120}$/.test(id)) throw new Error('No accepted job was saved.');
  return '/'+encodeURIComponent(id);
}
function epos04Check8s() {
  const p=PropertiesService.getScriptProperties();
  const b=epos04Read_(epos04Request_(epos04Job_(p),'get',p));
  epos04Log_('job_status',b);
}
function epos04Download8s() {
  const p=PropertiesService.getScriptProperties(), l=LockService.getScriptLock();
  if(!l.tryLock(1500)) throw new Error('Another execution has the lock.');
  try {
    const old=p.getProperty(EPOS04_8S_DOWNLOAD);
    if(old) {epos04Log_('already_saved',{fileId:old});return;}
    const id=p.getProperty('EPOS04_PRIVATE_OUTPUT_FOLDER_ID')||'';
    if(!/^[a-zA-Z0-9_-]{10,160}$/.test(id)) throw new Error('Set the ID of your chosen private Drive output folder.');
    const folder=DriveApp.getFolderById(id);
    if(folder.getSharingAccess()!==DriveApp.Access.PRIVATE) throw new Error('Choose a private output folder.');
    const route=epos04Job_(p);
    const status=epos04Read_(epos04Request_(route,'get',p));
    epos04Log_('job_status_before_download',status);
    if(status.http!==200 || status.status.toLowerCase()!=='completed') throw new Error('Download requires completed status.');
    const r=epos04Request_(route+'/download','get',p);
    if(r.getResponseCode()!==200) {epos04Log_('download_http_error',{http:r.getResponseCode()});return;}
    const b=r.getBlob(), bytes=b.getBytes();
    if(bytes.length<32 || String.fromCharCode(...bytes.slice(4,8))!=='ftyp') throw new Error('Response is not MP4.');
    const sha=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,bytes)
      .map(x=>('0'+(x&255).toString(16)).slice(-2)).join('');
    const f=folder.createFile(b.setName('EPOS_BONUS04_8S_NEW_CAST.mp4'));
    p.setProperty(EPOS04_8S_DOWNLOAD,f.getId());
    epos04Log_('download_saved',{http:200, status:'completed', bytes:bytes.length, sha256:sha, fileId:f.getId()});
  } finally {l.releaseLock();}
}
