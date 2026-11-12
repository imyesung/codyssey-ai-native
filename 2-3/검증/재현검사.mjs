// 저장된 HTML 판본을 실제 Chrome에서 실행해 전후 영상, 화면, 로그와 PDF를 만든다.
// 실행 환경과 명령은 재현안내.md에 기록한다.
import {createRequire} from 'node:module';
import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {dirname, resolve, join, basename} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const repo = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const out = resolve(process.argv[2] || '/tmp/codyssey-2-3-evidence');
const raw = join(out, 'raw');
await mkdir(raw, {recursive:true});
const sha = data => createHash('sha256').update(data).digest('hex');
const refs = {
  v1:'d5826d0:2-2/missionthon-ai-tips-yesunglim.html',
  v2:'437772d:2-3/미션AI활용법_최종.html',
  v3:'7d03fc4:2-3/미션AI활용법_최종.html',
  v4:'f64367c:2-3/미션AI활용법_최종.html'
};
const report = {
  capturedAt:new Date().toISOString(), timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,
  viewport:{width:1000,height:760}, mode:'실제 Chrome, file://, 자동 조작',
  sources:{}, checks:[], sessions:[], clips:[], artifacts:[]
};
for (const [version, ref] of Object.entries(refs)) {
  const data = execFileSync('git',['show',ref],{cwd:repo,maxBuffer:20*1024*1024});
  const path = join(raw, version+'.html');
  await writeFile(path,data);
  report.sources[version] = {git:ref,sha256:sha(data),bytes:data.length};
}
assert.equal(sha(await readFile(join(repo,'2-3/미션AI활용법_최종.html'))), report.sources.v4.sha256);
const browser = await chromium.launch({channel:'chrome'});
report.browser = browser.version();
const now = () => new Date().toISOString();
const sleep = (page,ms) => page.waitForTimeout(ms);
const state = page => page.evaluate(() => ({
  y:Math.round(scrollY), route:document.body.dataset.tour,
  selected:document.querySelector('[role=tab][aria-selected=true]')?.textContent,
  frame:document.querySelector('.case:not([hidden])')?.dataset.frame,
  reading:document.body.classList.contains('reading')
}));
async function open(version, name, video=true) {
  const ctx = await browser.newContext({viewport:report.viewport,
    permissions:['clipboard-read','clipboard-write'],
    ...(video ? {recordVideo:{dir:raw,size:report.viewport}} : {})});
  const session = {name,version,openedAt:now(),console:[],pageErrors:[],requestFailures:[],actions:[]};
  report.sessions.push(session);
  const page = await ctx.newPage();
  const started = performance.now();
  page.on('console',m=>session.console.push({at:now(),type:m.type(),text:m.text()}));
  page.on('pageerror',e=>session.pageErrors.push({at:now(),message:e.message}));
  page.on('requestfailed',r=>session.requestFailures.push({at:now(),url:r.url(),error:r.failure()?.errorText}));
  const action = (text,details={}) => session.actions.push({at:now(),elapsedMs:Math.round(performance.now()-started),text,...details});
  await page.goto(pathToFileURL(join(raw,version+'.html')).href);
  await page.locator('#cover-next').waitFor();
  await writeFile(join(raw,name+'-opening.yml'),await page.locator('body').ariaSnapshot());
  action('표지의 다음과 소개의 다음 선택');
  await page.locator('#cover-next').click();
  await page.locator('#introduction-next').click();
  await page.waitForFunction(()=>document.querySelector('.case:not([hidden])')?.dataset.frame);
  await writeFile(join(raw,name+'-body.yml'),await page.locator('body').ariaSnapshot());
  return {page,ctx,session,action,started};
}
async function finish(run, clipStart, stem) {
  const {page,ctx,session,started} = run;
  const clipEnd = (performance.now()-started)/1000;
  session.closedAt = now();
  const video = page.video();
  await ctx.close();
  if(video) {
    const source = await video.path();
    const target = join(raw,stem+'.webm');
    await copyFile(source,target);
    const duration = Number(execFileSync('ffprobe',['-v','quiet','-show_entries','format=duration','-of','csv=p=0',target],{encoding:'utf8'}).trim());
    report.clips.push({name:stem,file:'raw/'+stem+'.webm',start:clipStart,duration:clipEnd-clipStart,
      rawDuration:duration,timeline:'페이지 생성 완료 뒤 측정한 경과 시간. 종료 시 인코더가 덧붙인 마지막 정지 구간은 잘라낸다.'});
  }
}
async function captureTransition(version, side) {
  const run = await open(version,'전환-'+side); const {page,action,started}=run;
  await page.locator('#play').click();
  for(let i=0;i<3;i++){await page.keyboard.press('ArrowRight');await sleep(page,450);}
  await page.locator('h2').filter({hasText:'GIF 애니메이션'}).first().click();
  const start=(performance.now()-started)/1000;
  await page.screenshot({path:join(out,'수정1_'+side+'.png')});
  await sleep(page,850);
  const initial=await state(page);
  await page.evaluate(()=>{
    window.__evidence=[]; const t=performance.now();
    const sample=()=>{window.__evidence.push({ms:Math.round(performance.now()-t),y:Math.round(scrollY)});if(performance.now()-t<550)requestAnimationFrame(sample);};sample();
  });
  action('2배 확대에서 오른쪽 방향키: 같은 손동작으로 이동');
  await page.keyboard.press('ArrowRight');
  await sleep(page,700);
  const end=await state(page);
  const samples=await page.evaluate(()=>window.__evidence);
  const middle=samples.filter(s=>s.y>initial.y+2&&s.y<end.y-2);
  assert(end.y>initial.y);
  if(version==='v2')assert(middle.length>0,'부드러운 전환의 중간 위치');
  report.checks.push({name:'페이지 전환',version,initial,end,samples,intermediateFrames:middle.length});
  await sleep(page,650);
  action('왼쪽 방향키: 2배 확대로 복귀');await page.keyboard.press('ArrowLeft');
  await sleep(page,1150);
  await finish(run,start,'transition-'+side);
}
async function captureCopy(version, side) {
  const run=await open(version,'복사-'+side);const {page,action,started}=run;
  await page.locator('#play').click();
  const quote=page.locator('.quote-unit blockquote').first();
  await quote.evaluate(el=>el.scrollIntoView({block:'center'}));
  await sleep(page,300);
  const expected=await quote.textContent();
  await page.evaluate(()=>navigator.clipboard.writeText(''));
  const start=(performance.now()-started)/1000;
  await sleep(page,850);
  if(version==='v2') {
    const points=await quote.evaluate(el=>{
      const nodes=[];const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);while(w.nextNode())if(w.currentNode.textContent.trim())nodes.push(w.currentNode);
      const first=nodes[0],last=nodes.at(-1),a=document.createRange(),b=document.createRange();
      a.setStart(first,0);a.setEnd(first,1);b.setStart(last,last.length-1);b.setEnd(last,last.length);
      const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();
      return {start:{x:x.left,y:x.top+x.height/2},end:{x:y.right+1,y:y.top+y.height/2}};
    });
    action('첫 요청문을 마우스로 처음부터 끝까지 선택하고 복사');
    await page.mouse.move(points.start.x,points.start.y);await page.mouse.down();
    await page.mouse.move(points.end.x,points.end.y,{steps:20});await page.mouse.up();
    await page.keyboard.press(process.platform==='darwin'?'Meta+c':'Control+c');
  } else {
    action('Prompt 1 복사 버튼 선택');
    await page.locator('[data-copy-prompt="1"]').click();
  }
  await sleep(page,200);
  const copied=await page.evaluate(()=>navigator.clipboard.readText());
  const result={name:'요청문 복사',version,method:version==='v2'?'마우스 선택 후 단축키':'버튼 한 번',
    buttons:await page.locator('[data-copy-prompt]').count(),expectedLength:expected.length,actualLength:copied.length,matches:copied===expected};
  report.checks.push(result);assert.equal(copied,expected);
  await page.screenshot({path:join(out,'수정2_'+side+'.png')});
  await sleep(page,1800);
  await finish(run,start,'copy-'+side);
}
async function captureReading(version, side) {
  const run=await open(version,'읽기-'+side);const {page,action,started}=run;
  await page.mouse.move(700,400);await page.mouse.wheel(0,140);await sleep(page,400);
  const start=(performance.now()-started)/1000;await sleep(page,850);
  const before=await state(page);const count=await page.locator('#read-toggle').count();
  if(count){action('현재 위치에서 자료 읽기 선택');await page.locator('#read-toggle').click();}
  else action('동일한 위치에서 자료 읽기 조작 확인: 전환 버튼 0개');
  const samples=[];
  for(let i=0;i<4;i++){await sleep(page,300);samples.push(await state(page));}
  if(version==='v4'){assert(samples.every(x=>x.reading));assert(samples.every(x=>x.y===before.y));assert.equal(new Set(samples.map(x=>x.frame)).size,1);}
  else assert(new Set(samples.map(x=>x.frame)).size>1);
  report.checks.push({name:'자료 읽기',version,readButtonCount:count,before,samples});
  await page.screenshot({path:join(out,'수정3_'+side+'.png')});
  await sleep(page,1200);
  await finish(run,start,'reading-'+side);
}
async function fallback() {
  const run=await open('v3','복사-권한거부',false);const {page,action}=run;
  action('시험 조건: clipboard.writeText에서 NotAllowedError 반환');
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new DOMException('Denied','NotAllowedError');}}}));
  await page.locator('[data-copy-prompt="1"]').click();
  const selected=await page.locator('#copy-dialog textarea').evaluate(t=>({length:t.value.length,selected:t.selectionEnd-t.selectionStart}));
  assert.equal(selected.length,205);assert.equal(selected.selected,205);
  await page.screenshot({path:join(out,'수정2_복사권한거부.png')});
  await page.keyboard.press('Escape');
  const focusReturned=await page.locator('[data-copy-prompt="1"]').evaluate(b=>b===document.activeElement);
  assert(focusReturned);report.checks.push({name:'복사 권한 거부',version:'v3',injection:'clipboard.writeText NotAllowedError',...selected,focusReturned});
  await finish(run,0,'fallback');
}
async function capturePrint(version,side) {
  const run=await open(version,'인쇄-'+side,false);const {page,action}=run;
  await page.locator('#play').click();action('저장 위치 탭에서 영상을 멈춘 뒤 A4 인쇄');
  await page.emulateMedia({media:'print'});
  await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
  const print=await page.evaluate(()=>({
    visibleCases:[...document.querySelectorAll('.case')].filter(x=>x.getBoundingClientRect().height>0).map(x=>x.id),
    stills:[...document.querySelectorAll('.print-still')].filter(x=>x.naturalWidth>0&&x.getBoundingClientRect().width>0).length,
    references:[...document.querySelectorAll('.ref-slide img')].filter(x=>x.naturalWidth>0&&x.getBoundingClientRect().width>0).length,
    prompts:[...document.querySelectorAll('.quote-unit blockquote')].filter(x=>x.getBoundingClientRect().height>0).length
  }));
  const pdf='수정3_인쇄_'+side+'.pdf';
  await page.pdf({path:join(out,pdf),format:'A4',printBackground:true});
  report.checks.push({name:'인쇄',version,...print,pdf});
  if(version==='v4'){assert.equal(print.stills,8);assert.equal(print.references,7);assert.equal(print.prompts,6);}
  await finish(run,0,'print-'+side);
}
try {
  for(const [v,side] of [['v1','전'],['v2','후']])await captureTransition(v,side);
  for(const [v,side] of [['v2','전'],['v3','후']])await captureCopy(v,side);
  for(const [v,side] of [['v3','전'],['v4','후']])await captureReading(v,side);
  await fallback();
  for(const [v,side] of [['v3','전'],['v4','후']])await capturePrint(v,side);
} catch(error) {report.failure=error.stack;process.exitCode=1;}
await browser.close();
report.finishedAt=now();
await writeFile(join(out,'실행결과.json'),JSON.stringify(report,null,2)+'\n');
const lines=[`Browser: Chrome ${report.browser}`,`Captured: ${report.capturedAt}`,`Viewport: ${report.viewport.width}x${report.viewport.height}`];
for(const s of report.sessions){
  lines.push(`\n[SESSION ${s.name} / ${s.version}] ${s.openedAt}`);
  for(const a of s.actions)lines.push(`[ACTION ${a.at}] ${a.text}`);
  for(const e of s.console)lines.push(`[BROWSER CONSOLE ${e.at} ${e.type}] ${e.text}`);
  for(const e of s.pageErrors)lines.push(`[PAGE ERROR ${e.at}] ${e.message}`);
  for(const e of s.requestFailures)lines.push(`[REQUEST FAILED ${e.at}] ${e.error} ${e.url}`);
  lines.push(`[COUNTS] console=${s.console.length} pageerror=${s.pageErrors.length} requestfailed=${s.requestFailures.length}`);
}
await writeFile(join(out,'브라우저콘솔.log'),lines.join('\n')+'\n');
console.log(JSON.stringify({out,browser:report.browser,checks:report.checks,clips:report.clips,failure:report.failure},null,2));
