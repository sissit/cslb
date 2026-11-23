"""Draw the 1200x630 share images assets/og-{en,zh,es}.png."""
from PIL import Image, ImageDraw, ImageFont
CJK_B='/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'; CJK_R='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'
SER='/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc'
RED=(227,18,11); INK=(18,18,18); MUTE=(86,97,107); PANEL=(227,236,240)
T={
 'en':('CSLB Prep','California contractor license exam practice','Law & Business · General Building (B)',['English','中文','Español'],'Free · 300+ questions · mock exams · study notes'),
 'zh':('CSLB 备考','加州承包商执照考试 中英西三语题库','法律与商务 · B 类总包',['中文','English','Español'],'免费 · 300+ 题 · 模拟考试 · 知识点讲义'),
 'es':('CSLB Prep','Examen de licencia de contratista de California','Leyes y Negocios · Construcción General (B)',['Español','English','中文'],'Gratis · 300+ preguntas · exámenes de prueba · apuntes'),
}
for lang,(brand,h,sub,chips,foot) in T.items():
    im=Image.new('RGB',(1200,630),'white');d=ImageDraw.Draw(im)
    d.rectangle([0,0,1200,14],fill=RED)
    d.rectangle([80,92,104,116],fill=RED)
    d.text((124,80),brand,font=ImageFont.truetype(CJK_B,40),fill=INK)
    f=ImageFont.truetype(SER,64 if lang=='zh' else 58)
    # wrap headline
    words=list(h) if lang=='zh' else h.split(' ');lines=[];cur=''
    for w in words:
        t=(cur+('' if lang=='zh' else ' ')+w).strip() if cur else w
        if d.textlength(t,font=f)>1040:lines.append(cur);cur=w
        else:cur=t
    lines.append(cur);y=190
    for ln in lines:d.text((80,y),ln,font=f,fill=INK);y+=f.size+18
    d.text((80,y+14),sub,font=ImageFont.truetype(CJK_R,32),fill=MUTE)
    x=80;fc=ImageFont.truetype(CJK_B,28)
    for c in chips:
        w=d.textlength(c,font=fc)+40;d.rectangle([x,470,x+w,520],fill=PANEL);d.text((x+20,478),c,font=fc,fill=INK);x+=w+14
    d.text((80,560),foot,font=ImageFont.truetype(CJK_R,26),fill=MUTE)
    d.text((1120,560),'cslbexam.org',font=ImageFont.truetype(CJK_B,26),fill=RED,anchor='ra')
    im.save(f'assets/og-{lang}.png',optimize=True)
