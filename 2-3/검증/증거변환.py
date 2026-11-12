"""실제 브라우저 녹화 두 개를 나란히 놓고 GIF와 PDF 미리보기를 만든다.

사용법: python3 2-3/검증/증거변환.py /tmp/codyssey-2-3-evidence
Python 표준 라이브러리, ffmpeg, ImageMagick, Poppler를 사용한다.
"""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys

out = Path(sys.argv[1]).resolve()
raw = out / 'raw'
report = json.loads((out / '실행결과.json').read_text())
if report.get('failure'):
    raise SystemExit(report['failure'])
font = os.environ.get('EVIDENCE_FONT', '/System/Library/Fonts/AppleSDGothicNeo.ttc')

def run(args):
    subprocess.run([str(x) for x in args], check=True)

pairs = [
    ('transition', '수정1_페이지전환.gif', 'v1', 'v2',
     '오른쪽 방향키로 다음 대목 이동, 왼쪽 방향키로 복귀 | 0.5배속', 2),
    ('copy', '수정2_요청문복사.gif', 'v2', 'v3',
     '왼쪽: 원문을 드래그해 선택하고 복사 | 오른쪽: Prompt 1 복사 버튼', 1),
    ('reading', '수정3_자료읽기.gif', 'v3', 'v4',
     '왼쪽: 발표 화면에서 읽기 | 오른쪽: 자료 읽기 선택 후 위치와 영상 정지 유지', 1)
]
clips = {c['name']: c for c in report['clips']}
for name, dest, before, after, caption, slowdown in ([] if '--previews-only' in sys.argv else pairs):
    header = raw / (name + '-header.png')
    run(['magick', '-size', '1600x100', 'xc:white', '-font', font,
         '-pointsize', '28', '-fill', '#152d50',
         '-annotate', '+28+36', f'수정 전 {before}',
         '-annotate', '+828+36', f'수정 후 {after}',
         '-pointsize', '21', '-fill', '#333333', '-annotate', '+28+76', caption, header])
    a, b = [clips[name + '-' + side] for side in ['전', '후']]
    duration = max(a['duration'], b['duration']) * slowdown
    filters = []
    for idx, clip in enumerate([a, b]):
        filters.append(
            f'[{idx}:v]trim=start={clip["start"]:.4f}:duration={clip["duration"]:.4f},'
            f'setpts=(PTS-STARTPTS)*{slowdown},scale=800:608:flags=lanczos,fps=15,'
            f'tpad=stop_mode=clone:stop_duration={duration:.4f}[v{idx}]')
    filters.extend([
        '[v0][v1]hstack=inputs=2:shortest=1[body]',
        '[2:v]fps=15,format=rgb24[head]',
        '[head][body]vstack=inputs=2:shortest=1,split[p0][p1]',
        '[p0]palettegen=max_colors=192:stats_mode=diff[palette]',
        '[p1][palette]paletteuse=dither=bayer:bayer_scale=3[gif]'
    ])
    run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
         '-i', out/a['file'], '-i', out/b['file'], '-loop', '1', '-i', header,
         '-filter_complex', ';'.join(filters), '-map', '[gif]', '-t', f'{duration:.3f}',
         '-loop', '0', out/dest])
    report['artifacts'].append({'file':dest, 'kind':'실제 녹화 좌우 비교 GIF',
        'before':before, 'after':after, 'playbackSpeed':1/slowdown,
        'description':'준비 구간을 잘라 시작을 맞추고, 먼저 끝난 녹화의 마지막 프레임을 유지한다. 상단은 판본과 조작을 적은 캡션이다.'})

for side in ['전', '후']:
    prefix = raw / ('print-' + side)
    pdf = out / ('수정3_인쇄_' + side + '.pdf')
    if '--previews-only' not in sys.argv:
        run(['pdftoppm', '-scale-to', '1100', '-png', pdf, prefix])
    pages = sorted(raw.glob('print-' + side + '-*.png'))
    thumbs = []
    for number, page in enumerate(pages, 1):
        thumb = raw / f'thumb-{side}-{number:02d}.png'
        run(['magick', page, '-resize', '380x540', '-background', 'white',
             '-gravity', 'center', '-extent', '380x540', '+repage',
             '-background', '#e8edf2', '-gravity', 'south', '-splice', '0x35',
             '-font', font, '-pointsize', '18', '-fill', '#152d50',
             '-annotate', '+0+6', f'{number}쪽', '+set', 'label', '-depth', '8', thumb])
        thumbs.append(thumb)
    preview = out / ('수정3_인쇄_' + side + '_전체페이지.png')
    run(['magick', 'montage', '-font', font, *thumbs, '-geometry', '+8+12', '-tile', '4x',
         '-background', '#e8edf2', '-depth', '8', preview])
    report['artifacts'].append({'file':pdf.name, 'pages':len(pages), 'preview':preview.name})

before_page = sorted(raw.glob('print-전-*.png'))[2]
after_page = sorted(raw.glob('print-후-*.png'))[2]
run(['magick', 'montage', '-font', font, '-pointsize', '26',
     '-label', '수정 전 v3, PDF 3쪽', before_page,
     '-label', '수정 후 v4, PDF 3쪽', after_page,
     '-geometry', '775x1100+12+18', '-tile', '2x1', '-background', '#e8edf2',
     '-depth', '8', out/'수정3_인쇄비교.png'])

report['artifacts'] = list({item['file']: item for item in report['artifacts']}.values())
report['artifactHashes'] = {
    p.name: {'bytes':p.stat().st_size, 'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}
    for p in sorted(out.iterdir()) if p.is_file() and p.suffix in ['.png', '.gif', '.pdf', '.log']
}
(out/'실행결과.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(report['artifactHashes'], ensure_ascii=False, indent=2))
