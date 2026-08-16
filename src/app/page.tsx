'use client';

import React, { useEffect } from 'react';

const HOME_CSS = `
  :root{
    --bg: #09090b;
    --bg-soft: #0d0d10;
    --surface: #141417;
    --surface-2: #1a1a1e;
    --inset-bg: #0c0c0e;
    --plate-a: #1a1a1f;
    --plate-b: #101012;
    --border: rgba(255,255,255,0.08);
    --border-strong: rgba(255,255,255,0.14);
    --text: #f2f2f0;
    --text-muted: #93939c;
    --text-dim: #5c5c64;
    --amber: #ffb020;
    --amber-soft: rgba(255,176,32,0.12);
    --amber-text: #ffd28a;
    --violet: #7c6cf0;
    --violet-soft: rgba(124,108,240,0.14);
    --violet-text: #c9c1ff;
    --shadow: rgba(0,0,0,0.5);
    --card-shadow: rgba(0,0,0,0.35);
    --grid-line: rgba(255,255,255,0.06);
    --font-display: 'Space Grotesk', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
    --ease: cubic-bezier(.16,.8,.24,1);
    --ease-spring: cubic-bezier(.34,1.56,.64,1);
    color-scheme: dark;
  }

  html[data-theme="light"]{
    --bg: #faf9f6;
    --bg-soft: #f2f1ec;
    --surface: #ffffff;
    --surface-2: #f0efe9;
    --inset-bg: #eeede6;
    --plate-a: #ffffff;
    --plate-b: #eeede6;
    --border: rgba(20,20,22,0.09);
    --border-strong: rgba(20,20,22,0.16);
    --text: #17171a;
    --text-muted: #5c5c64;
    --text-dim: #92929a;
    --amber-soft: rgba(255,176,32,0.14);
    --amber-text: #a9660a;
    --violet-soft: rgba(124,108,240,0.12);
    --violet-text: #5940c9;
    --shadow: rgba(20,20,22,0.14);
    --card-shadow: rgba(20,20,22,0.10);
    --grid-line: rgba(20,20,22,0.05);
    color-scheme: light;
  }

  .home-root{--bg: #09090b;--bg-soft: #0d0d10;--surface: #141417;--surface-2: #1a1a1e;--inset-bg: #0c0c0e;--plate-a: #1a1a1f;--plate-b: #101012;--border: rgba(255,255,255,0.08);--border-strong: rgba(255,255,255,0.14);--text: #f2f2f0;--text-muted: #93939c;--text-dim: #5c5c64;--amber: #ffb020;--amber-soft: rgba(255,176,32,0.12);--amber-text: #ffd28a;--violet: #7c6cf0;--violet-soft: rgba(124,108,240,0.14);--violet-text: #c9c1ff;--shadow: rgba(0,0,0,0.5);--card-shadow: rgba(0,0,0,0.35);--grid-line: rgba(255,255,255,0.06);--font-display: 'Space Grotesk', sans-serif;--font-body: 'Inter', sans-serif;--font-mono: 'JetBrains Mono', monospace;--ease: cubic-bezier(.16,.8,.24,1);--ease-spring: cubic-bezier(.34,1.56,.64,1);color-scheme: dark;}

  .home-root{background:var(--bg);color:var(--text);font-family:var(--font-body);line-height:1.5;overflow-x:hidden;-webkit-font-smoothing:antialiased;}
  .home-root img{max-width:100%;display:block;}
  .home-root a{color:inherit;text-decoration:none;}
  .home-root button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;}
  .home-root ul{list-style:none;}
  .home-root .wrap{max-width:1180px;margin:0 auto;padding:0 32px;}
  .home-root section{position:relative;}
  .home-root ::selection{background:var(--amber);color:#0A0A0C;}
  .home-root a:focus-visible,.home-root button:focus-visible{outline:2px solid var(--amber);outline-offset:3px;border-radius:4px;}
  .home-root h1,.home-root h2,.home-root h3,.home-root h4{font-family:var(--font-display);font-weight:600;letter-spacing:-0.02em;color:var(--text);}
  .home-root .eyebrow{font-family:var(--font-mono);font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:var(--amber);display:flex;align-items:center;gap:10px;margin-bottom:18px;}
  .home-root .eyebrow::before{content:'';width:16px;height:1px;background:var(--amber);}
  .home-root .eyebrow.violet{color:var(--violet);}
  .home-root .eyebrow.violet::before{background:var(--violet);}
  .home-root .section-head{max-width:640px;margin-bottom:56px;}
  .home-root .section-head h2{font-size:clamp(28px,4vw,42px);line-height:1.12;margin-bottom:16px;}
  .home-root .section-head p{font-size:17px;color:var(--text-muted);line-height:1.6;}
  .home-root .reveal{opacity:0;transform:translateY(24px);transition:opacity .8s var(--ease),transform .8s var(--ease);}
  .home-root .reveal.in{opacity:1;transform:translateY(0);}
  .home-root .reveal-delay-1{transition-delay:.08s;}
  .home-root .reveal-delay-2{transition-delay:.16s;}
  .home-root .reveal-delay-3{transition-delay:.24s;}
  .home-root .stagger.in > *{opacity:1;transform:none;}
  .home-root .stagger > *{opacity:0;transform:translateY(18px) scale(.98);transition:opacity .6s var(--ease),transform .6s var(--ease);}
  .home-root .stagger > *:nth-child(1){transition-delay:.02s;}
  .home-root .stagger > *:nth-child(2){transition-delay:.08s;}
  .home-root .stagger > *:nth-child(3){transition-delay:.14s;}
  .home-root .stagger > *:nth-child(4){transition-delay:.2s;}
  .home-root .stagger > *:nth-child(5){transition-delay:.26s;}
  .home-root .stagger > *:nth-child(6){transition-delay:.32s;}
  .home-root .stagger > *:nth-child(7){transition-delay:.38s;}
  .home-root .stagger > *:nth-child(8){transition-delay:.44s;}
  .home-root .stagger > *:nth-child(9){transition-delay:.5s;}
  .home-root .stagger > *:nth-child(10){transition-delay:.56s;}
  .home-root header{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 0;transition:background .3s var(--ease),border-color .3s var(--ease),padding .3s var(--ease);border-bottom:1px solid transparent;}
  .home-root header.scrolled{background:color-mix(in srgb, var(--bg) 82%, transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom:1px solid var(--border);padding:14px 0;}
  .home-root nav{display:flex;align-items:center;justify-content:space-between;}
  .home-root .logo{font-family:var(--font-display);font-size:19px;font-weight:700;letter-spacing:-0.01em;display:flex;align-items:center;gap:8px;}
  .home-root .logo .dot{width:7px;height:7px;border-radius:50%;background:var(--amber);box-shadow:0 0 12px var(--amber);}
  .home-root .nav-links{display:flex;align-items:center;gap:30px;}
  .home-root .nav-links a:not(.nav-cta){font-size:14px;color:var(--text-muted);transition:color .2s;position:relative;}
  .home-root .nav-links a:not(.nav-cta)::after{content:'';position:absolute;left:0;bottom:-4px;width:0;height:1px;background:var(--amber);transition:width .25s var(--ease);}
  .home-root .nav-links a:not(.nav-cta):hover{color:var(--text);}
  .home-root .nav-links a:not(.nav-cta):hover::after{width:100%;}
  .home-root .nav-cta{font-size:14px;font-weight:600;background:var(--text);color:var(--bg);padding:10px 20px;border-radius:8px;transition:transform .2s var(--ease),box-shadow .2s var(--ease);white-space:nowrap;}
  .home-root .nav-cta:hover{transform:translateY(-1px);box-shadow:0 8px 24px var(--shadow);}
  .home-root .theme-toggle{width:38px;height:38px;border-radius:9px;border:1px solid var(--border-strong);display:flex;align-items:center;justify-content:center;color:var(--text-muted);transition:border-color .2s,color .2s,transform .3s var(--ease-spring),background .2s;flex-shrink:0;}
  .home-root .theme-toggle:hover{color:var(--text);border-color:var(--amber);transform:rotate(-14deg);}
  .home-root .theme-toggle svg{width:17px;height:17px;}
  .home-root .theme-toggle .moon{display:none;}
  .home-root .mobile-toggle{display:none;flex-direction:column;gap:5px;width:24px;}
  .home-root .mobile-toggle span{height:1.5px;background:var(--text);border-radius:2px;transition:all .3s var(--ease);}
  .home-root .mobile-menu{display:none;position:fixed;inset:0;background:var(--bg);z-index:99;padding:100px 32px 40px;flex-direction:column;gap:8px;}
  .home-root .mobile-menu.open{display:flex;}
  .home-root .mobile-menu a:not(.nav-cta){font-size:22px;font-family:var(--font-display);padding:14px 0;border-bottom:1px solid var(--border);}
  .home-root .mobile-menu .nav-cta{margin-top:20px;text-align:center;}
  .home-root .mobile-menu .mm-row{display:flex;align-items:center;justify-content:space-between;margin-top:14px;}
  .home-root .mobile-menu .mm-row span{font-family:var(--font-mono);font-size:12px;color:var(--text-dim);text-transform:uppercase;letter-spacing:0.08em;}
  .home-root .hero{padding:180px 0 100px;position:relative;background:radial-gradient(ellipse 700px 400px at 15% 0%, rgba(255,176,32,0.09), transparent 60%),radial-gradient(ellipse 600px 500px at 85% 10%, rgba(124,108,240,0.10), transparent 60%);}
  .home-root .hero-grid{display:grid;grid-template-columns:1fr;gap:56px;align-items:center;}
  .home-root .hero-copy h1{font-size:clamp(38px,6vw,66px);line-height:1.05;max-width:780px;margin-bottom:22px;}
  .home-root .hero-copy h1 .accent{color:var(--amber);}
  .home-root .hero-copy .lede{font-size:18px;color:var(--text-muted);max-width:560px;margin-bottom:14px;line-height:1.65;}
  .home-root .hero-tagline{font-family:var(--font-mono);font-size:13px;color:var(--text-dim);letter-spacing:0.04em;margin-bottom:36px;}
  .home-root .hero-tagline span{color:var(--text-muted);}
  .home-root .cta-row{display:flex;gap:14px;flex-wrap:wrap;align-items:center;}
  .home-root .btn-primary{background:var(--amber);color:#171100;font-weight:600;font-size:15px;padding:14px 26px;border-radius:10px;display:inline-flex;align-items:center;gap:8px;position:relative;overflow:hidden;isolation:isolate;transition:transform .25s var(--ease),box-shadow .25s var(--ease);}
  .home-root .btn-primary::before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(120deg,transparent,rgba(255,255,255,0.35),transparent);transform:translateX(-120%);}
  .home-root .btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(255,176,32,0.32);}
  .home-root .btn-primary:hover::before{transform:translateX(120%);transition:transform .7s var(--ease);}
  .home-root .btn-secondary{border:1px solid var(--border-strong);color:var(--text);font-weight:500;font-size:15px;padding:14px 24px;border-radius:10px;transition:border-color .2s,background .2s,transform .2s var(--ease);}
  .home-root .btn-secondary:hover{border-color:var(--amber);background:var(--amber-soft);transform:translateY(-1px);}
  .home-root .hero-visual{position:relative;border-radius:16px;border:1px solid var(--border);background:linear-gradient(180deg,var(--surface),var(--bg-soft));padding:22px;overflow:hidden;transition:border-color .3s,background .4s;}
  .home-root .hero-visual::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 50% 0%, rgba(255,176,32,0.08), transparent 60%);pointer-events:none;}
  .home-root .stage-bar{display:flex;align-items:center;gap:8px;margin-bottom:18px;}
  .home-root .stage-bar .pip{width:8px;height:8px;border-radius:50%;background:var(--surface-2);border:1px solid var(--border-strong);}
  .home-root .stage-label{font-family:var(--font-mono);font-size:11px;color:var(--text-dim);margin-left:auto;letter-spacing:0.06em;transition:color .3s;}
  .home-root .layer-stack{position:relative;height:340px;border-radius:10px;background:var(--inset-bg);border:1px solid var(--border);overflow:hidden;transition:background .4s;}
  .home-root .layer-plate{position:absolute;border-radius:8px;border:1px solid var(--border-strong);display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;letter-spacing:0.05em;color:var(--text-muted);background:var(--surface);transition:transform 1.1s var(--ease),opacity 1.1s var(--ease),box-shadow .6s,background .4s;}
  .home-root .layer-plate.background{inset:14px;background:linear-gradient(135deg,var(--plate-a),var(--plate-b));}
  .home-root .layer-plate.image{top:34px;left:34px;width:190px;height:150px;background:linear-gradient(135deg,var(--plate-a),var(--plate-b));}
  .home-root .layer-plate.shape{top:60px;right:40px;width:80px;height:80px;border-radius:50%;background:var(--violet-soft);border-color:rgba(124,108,240,0.4);color:var(--violet-text);}
  .home-root .layer-plate.text{bottom:44px;left:34px;width:220px;height:44px;background:var(--amber-soft);border-color:rgba(255,176,32,0.45);color:var(--amber-text);}
  .home-root .layer-stack.exploded .layer-plate.background{transform:translate(-14px,-10px);box-shadow:0 20px 40px var(--shadow);}
  .home-root .layer-stack.exploded .layer-plate.image{transform:translate(-8px,-30px);box-shadow:0 24px 40px var(--shadow);}
  .home-root .layer-stack.exploded .layer-plate.shape{transform:translate(10px,-46px);box-shadow:0 24px 40px var(--shadow);}
  .home-root .layer-stack.exploded .layer-plate.text{transform:translate(6px,26px);box-shadow:0 24px 40px var(--shadow);}
  .home-root .problem{padding:120px 0 100px;border-top:1px solid var(--border);}
  .home-root .problem-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
  .home-root .problem-statement{font-family:var(--font-display);font-size:clamp(26px,3.4vw,38px);line-height:1.25;color:var(--text-muted);}
  .home-root .problem-statement strong{color:var(--text);font-weight:600;}
  .home-root .problem-visual{border:1px solid var(--border);border-radius:14px;padding:28px;background:var(--surface);transition:border-color .3s,transform .35s var(--ease),box-shadow .35s var(--ease);}
  .home-root .problem-visual:hover{border-color:var(--border-strong);transform:translateY(-4px);box-shadow:0 20px 44px var(--card-shadow);}
  .home-root .file-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border);font-family:var(--font-mono);font-size:13px;}
  .home-root .file-row:last-child{border-bottom:none;}
  .home-root .file-row .tag{font-size:11px;padding:3px 9px;border-radius:20px;border:1px solid var(--border-strong);color:var(--text-dim);}
  .home-root .file-row .tag.locked{color:#ff8a8a;border-color:rgba(255,138,138,0.35);}
  .home-root .file-row .tag.open{color:#4fbf7c;border-color:rgba(79,191,124,0.35);}
  .home-root .resolve-line{margin-top:22px;padding-top:22px;border-top:1px dashed var(--border-strong);font-size:15px;color:var(--text);font-weight:500;}
  .home-root .unlock{padding:130px 0 140px;border-top:1px solid var(--border);background:radial-gradient(ellipse 900px 500px at 50% 0%, rgba(255,176,32,0.07), transparent 65%);}
  .home-root .unlock-head{text-align:center;max-width:720px;margin:0 auto 70px;}
  .home-root .unlock-head h2{font-size:clamp(30px,4.6vw,50px);line-height:1.12;margin-bottom:18px;}
  .home-root .unlock-head p{color:var(--text-muted);font-size:17px;line-height:1.7;}
  .home-root .unlock-pipeline{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;align-items:center;gap:0;margin-bottom:60px;}
  .home-root .pipeline-stage{border:1px solid var(--border);border-radius:14px;background:var(--surface);padding:26px 22px;text-align:center;transition:transform .4s var(--ease),box-shadow .4s var(--ease),border-color .3s;}
  .home-root .pipeline-stage:hover{transform:translateY(-6px);box-shadow:0 22px 44px var(--card-shadow);}
  .home-root .pipeline-stage .stage-tag{font-family:var(--font-mono);font-size:11px;letter-spacing:0.1em;color:var(--text-dim);text-transform:uppercase;margin-bottom:14px;display:block;}
  .home-root .pipeline-stage h4{font-size:17px;margin-bottom:8px;}
  .home-root .pipeline-stage p{font-size:13px;color:var(--text-muted);line-height:1.5;}
  .home-root .pipeline-arrow{width:44px;height:1px;background:linear-gradient(90deg,transparent,var(--amber),transparent);margin:0 auto;position:relative;}
  .home-root .pipeline-arrow::after{content:'→';color:var(--amber);position:absolute;top:50%;left:50%;transform:translate(-50%,-52%);font-size:14px;}
  .home-root .pipeline-stage.analyze{border-color:rgba(124,108,240,0.35);box-shadow:0 0 40px rgba(124,108,240,0.08) inset;}
  .home-root .pipeline-stage.analyze:hover{box-shadow:0 0 40px rgba(124,108,240,0.1) inset,0 22px 44px var(--card-shadow);}
  .home-root .pipeline-stage.after{border-color:rgba(255,176,32,0.4);box-shadow:0 0 40px rgba(255,176,32,0.08) inset;}
  .home-root .pipeline-stage.after:hover{box-shadow:0 0 40px rgba(255,176,32,0.1) inset,0 22px 44px var(--card-shadow);}
  .home-root .element-tags{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;}
  .home-root .element-tags .tag-chip{font-family:var(--font-mono);font-size:12px;padding:7px 14px;border-radius:20px;border:1px solid var(--border-strong);color:var(--text-muted);background:var(--surface);transition:border-color .2s,color .2s,transform .2s;}
  .home-root .element-tags .tag-chip:hover{border-color:var(--amber);color:var(--amber-text);transform:translateY(-2px);}
  .home-root .editor-sec{padding:120px 0;border-top:1px solid var(--border);}
  .home-root .editor-panel{display:grid;grid-template-columns:220px 1fr;border:1px solid var(--border);border-radius:14px;overflow:hidden;background:var(--surface);transition:box-shadow .4s var(--ease);}
  .home-root .editor-panel:hover{box-shadow:0 24px 50px var(--card-shadow);}
  .home-root .editor-panel .tool-list{border-right:1px solid var(--border);padding:20px 0;}
  .home-root .tool-item{display:flex;align-items:center;gap:12px;padding:11px 20px;font-size:13.5px;color:var(--text-muted);border-left:2px solid transparent;transition:background .2s,color .2s,border-color .2s;cursor:default;}
  .home-root .tool-item .ico{width:16px;height:16px;border-radius:4px;background:var(--surface-2);border:1px solid var(--border-strong);flex-shrink:0;transition:background .2s,border-color .2s;}
  .home-root .tool-item.active{color:var(--text);background:var(--amber-soft);border-left-color:var(--amber);}
  .home-root .tool-item.active .ico{background:var(--amber);border-color:var(--amber);}
  .home-root .tool-item:hover:not(.active){color:var(--text);background:rgba(128,128,128,0.06);}
  .home-root .editor-canvas{padding:36px;display:flex;align-items:center;justify-content:center;min-height:340px;background:linear-gradient(var(--grid-line) 1px,transparent 1px) 0 0/24px 24px,linear-gradient(90deg,var(--grid-line) 1px,transparent 1px) 0 0/24px 24px,var(--inset-bg);transition:background .4s;}
  .home-root .canvas-frame{width:100%;max-width:360px;aspect-ratio:4/3;border-radius:10px;border:1px solid var(--border-strong);background:linear-gradient(135deg,var(--plate-a),var(--plate-b));display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:12px;color:var(--text-dim);position:relative;transition:transform .4s var(--ease);}
  .home-root .canvas-frame:hover{transform:scale(1.02);}
  .home-root .canvas-frame::before,.home-root .canvas-frame::after{content:'';position:absolute;width:10px;height:10px;border:1.5px solid var(--amber);}
  .home-root .canvas-frame::before{top:-1px;left:-1px;border-right:none;border-bottom:none;}
  .home-root .canvas-frame::after{bottom:-1px;right:-1px;border-left:none;border-top:none;}
  .home-root .ai-sec{padding:120px 0;border-top:1px solid var(--border);background:var(--bg-soft);}
  .home-root .ai-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1px;background:var(--border);border:1px solid var(--border);border-radius:14px;overflow:hidden;}
  .home-root .ai-card{background:var(--surface);padding:26px 24px;transition:background .3s,transform .3s var(--ease);position:relative;overflow:hidden;}
  .home-root .ai-card::before{content:'';position:absolute;inset:0;background:radial-gradient(180px circle at var(--mx,50%) var(--my,50%), rgba(124,108,240,0.10), transparent 70%);opacity:0;transition:opacity .3s;pointer-events:none;}
  .home-root .ai-card:hover{background:var(--surface-2);transform:translateY(-3px);}
  .home-root .ai-card:hover::before{opacity:1;}
  .home-root .ai-card .mark{width:34px;height:34px;border-radius:9px;background:var(--violet-soft);border:1px solid rgba(124,108,240,0.35);margin-bottom:16px;display:flex;align-items:center;justify-content:center;font-family:var(--font-mono);font-size:11px;color:var(--violet-text);transition:transform .3s var(--ease-spring);}
  .home-root .ai-card:hover .mark{transform:scale(1.1) rotate(-6deg);}
  .home-root .ai-card h4{font-size:15px;margin-bottom:6px;}
  .home-root .ai-card p{font-size:13px;color:var(--text-muted);line-height:1.5;}
  .home-root .reframe-sec{padding:120px 0;border-top:1px solid var(--border);}
  .home-root .reframe-visual{display:flex;gap:16px;align-items:flex-end;overflow-x:auto;padding:20px 4px 10px;}
  .home-root .format-card{flex-shrink:0;border:1px solid var(--border-strong);border-radius:12px;background:var(--surface);padding:12px;display:flex;flex-direction:column;gap:10px;align-items:center;transition:transform .35s var(--ease),border-color .3s,box-shadow .35s;}
  .home-root .format-card:hover{transform:translateY(-6px) scale(1.03);border-color:var(--amber);box-shadow:0 18px 36px var(--card-shadow);}
  .home-root .format-card .plate{background:linear-gradient(135deg,var(--plate-a),var(--plate-b));border-radius:6px;border:1px solid var(--border);width:100%;}
  .home-root .format-card .fmt-label{font-family:var(--font-mono);font-size:10.5px;color:var(--text-dim);letter-spacing:0.04em;}
  .home-root .format-card.post{width:110px;}
  .home-root .format-card.post .plate{aspect-ratio:1/1;}
  .home-root .format-card.story{width:90px;}
  .home-root .format-card.story .plate{aspect-ratio:9/16;}
  .home-root .format-card.thumb{width:160px;}
  .home-root .format-card.thumb .plate{aspect-ratio:16/9;}
  .home-root .format-card.linkedin{width:150px;}
  .home-root .format-card.linkedin .plate{aspect-ratio:1.91/1;}
  .home-root .format-card.custom{width:110px;border-style:dashed;}
  .home-root .format-card.custom .plate{aspect-ratio:3/2;}
  .home-root .memory-sec{padding:120px 0;border-top:1px solid var(--border);background:var(--bg-soft);}
  .home-root .memory-grid{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;}
  .home-root .token-list{display:flex;flex-direction:column;gap:1px;background:var(--border);border:1px solid var(--border);border-radius:12px;overflow:hidden;}
  .home-root .token-row{display:flex;align-items:center;justify-content:space-between;padding:15px 20px;background:var(--surface);font-size:13.5px;transition:background .2s,padding-left .25s var(--ease);}
  .home-root .token-row:hover{background:var(--surface-2);padding-left:26px;}
  .home-root .token-row .swatch{width:16px;height:16px;border-radius:4px;flex-shrink:0;}
  .home-root .token-row .name{display:flex;align-items:center;gap:12px;color:var(--text-muted);}
  .home-root .token-row .val{font-family:var(--font-mono);font-size:12px;color:var(--text-dim);}
  .home-root .memory-note{margin-top:18px;font-size:13px;color:var(--text-dim);font-family:var(--font-mono);}
  .home-root .workflow-sec{padding:120px 0;border-top:1px solid var(--border);}
  .home-root .workflow-list{display:flex;flex-direction:column;}
  .home-root .workflow-item{display:grid;grid-template-columns:60px 1fr;gap:28px;padding:30px 0;border-bottom:1px solid var(--border);transition:padding-left .3s var(--ease),background .3s;border-radius:8px;}
  .home-root .workflow-item:hover{padding-left:12px;background:rgba(128,128,128,0.03);}
  .home-root .workflow-item:first-child{padding-top:0;}
  .home-root .workflow-item:first-child:hover{padding-top:0;}
  .home-root .workflow-item .idx{font-family:var(--font-mono);font-size:13px;color:var(--amber);padding-top:4px;}
  .home-root .workflow-item h4{font-size:18px;margin-bottom:8px;}
  .home-root .workflow-item p{font-size:14.5px;color:var(--text-muted);line-height:1.6;}
  .home-root .workflow-item .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;}
  .home-root .workflow-item .chips span{font-family:var(--font-mono);font-size:11.5px;color:var(--text-muted);border:1px solid var(--border-strong);border-radius:16px;padding:5px 11px;transition:border-color .2s,color .2s;}
  .home-root .workflow-item .chips span:hover{border-color:var(--amber);color:var(--amber-text);}
  .home-root .diff-sec{padding:120px 0;border-top:1px solid var(--border);background:var(--bg-soft);}
  .home-root .diff-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid var(--border);border-radius:14px;overflow:hidden;}
  .home-root .diff-col{padding:38px 34px;transition:background .3s;}
  .home-root .diff-col.a{background:var(--surface);border-right:1px solid var(--border);}
  .home-root .diff-col.b{background:linear-gradient(180deg,rgba(255,176,32,0.06),transparent);}
  .home-root .diff-col .diff-label{font-family:var(--font-mono);font-size:11px;color:var(--text-dim);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:20px;}
  .home-root .diff-col.b .diff-label{color:var(--amber);}
  .home-root .diff-flow{display:flex;flex-direction:column;gap:10px;font-size:14.5px;color:var(--text-muted);}
  .home-root .diff-flow .step{display:flex;align-items:center;gap:10px;transition:transform .25s var(--ease);}
  .home-root .diff-flow .step:hover{transform:translateX(4px);}
  .home-root .diff-flow .step::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--text-dim);flex-shrink:0;}
  .home-root .diff-col.b .step::before{background:var(--amber);}
  .home-root .diff-flow .step.final{color:var(--text);font-weight:500;}
  .home-root .how-sec{padding:120px 0;border-top:1px solid var(--border);}
  .home-root .how-track{display:flex;align-items:stretch;gap:0;overflow-x:auto;padding-bottom:8px;}
  .home-root .how-step{flex:1;min-width:160px;padding:24px 20px;border-right:1px solid var(--border);position:relative;transition:background .3s;}
  .home-root .how-step:hover{background:rgba(128,128,128,0.03);}
  .home-root .how-step:last-child{border-right:none;}
  .home-root .how-step .num{font-family:var(--font-mono);font-size:11px;color:var(--text-dim);margin-bottom:14px;display:block;}
  .home-root .how-step h4{font-size:15.5px;margin-bottom:8px;}
  .home-root .how-step p{font-size:13px;color:var(--text-muted);line-height:1.55;}
  .home-root .how-step::after{content:'';position:absolute;bottom:0;left:0;height:2px;width:0;background:var(--amber);transition:width .8s var(--ease);}
  .home-root .how-step.in::after{width:100%;}
  .home-root .tech-sec{padding:80px 0;border-top:1px solid var(--border);}
  .home-root .tech-row{display:flex;flex-wrap:wrap;gap:14px;align-items:center;justify-content:space-between;}
  .home-root .tech-row .tech-caption{font-size:13.5px;color:var(--text-dim);max-width:340px;}
  .home-root .tech-pills{display:flex;flex-wrap:wrap;gap:10px;}
  .home-root .tech-pills span{font-family:var(--font-mono);font-size:12px;color:var(--text-muted);border:1px solid var(--border);border-radius:20px;padding:7px 14px;transition:border-color .2s,color .2s,transform .2s;}
  .home-root .tech-pills span:hover{border-color:var(--violet);color:var(--violet-text);transform:translateY(-2px);}
  .home-root .final-cta{padding:160px 0 150px;text-align:center;position:relative;border-top:1px solid var(--border);background:radial-gradient(ellipse 900px 500px at 50% 100%, rgba(255,176,32,0.10), transparent 70%);overflow:hidden;}
  .home-root .final-cta::before{content:'';position:absolute;top:0;left:50%;width:1px;height:100%;background:linear-gradient(180deg,transparent,var(--border-strong),transparent);}
  .home-root .final-cta h2{font-size:clamp(32px,6vw,58px);line-height:1.1;max-width:760px;margin:0 auto 40px;}
  .home-root .final-cta .btn-primary{font-size:17px;padding:17px 34px;}
  .home-root footer{border-top:1px solid var(--border);padding:64px 0 40px;}
  .home-root .footer-grid{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:40px;margin-bottom:56px;}
  .home-root .footer-brand .logo{margin-bottom:14px;}
  .home-root .footer-brand p{font-size:13.5px;color:var(--text-dim);max-width:260px;line-height:1.6;}
  .home-root .footer-col h5{font-family:var(--font-mono);font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:var(--text-dim);margin-bottom:16px;}
  .home-root .footer-col ul{display:flex;flex-direction:column;gap:11px;}
  .home-root .footer-col a{font-size:13.5px;color:var(--text-muted);transition:color .2s;}
  .home-root .footer-col a:hover{color:var(--amber-text);}
  .home-root .footer-bottom{display:flex;justify-content:space-between;align-items:center;padding-top:28px;border-top:1px solid var(--border);font-size:12.5px;color:var(--text-dim);flex-wrap:wrap;gap:14px;}
  @media (max-width:760px){
    .home-root .footer-grid{grid-template-columns:1fr 1fr;}
    .home-root .hero-copy .lede{font-size:16px;}
    .home-root .problem-grid{grid-template-columns:1fr;}
    .home-root .memory-grid{grid-template-columns:1fr;}
    .home-root .how-track{flex-direction:column;}
    .home-root .how-step{border-right:none;border-bottom:1px solid var(--border);}
    .home-root .unlock-pipeline{grid-template-columns:1fr;gap:16px;}
    .home-root .pipeline-arrow{transform:rotate(90deg);margin:4px auto;}
    .home-root .editor-panel{grid-template-columns:1fr;}
    .home-root .editor-panel .tool-list{display:flex;overflow-x:auto;border-right:none;border-bottom:1px solid var(--border);padding:14px;}
    .home-root .tool-item{white-space:nowrap;border-left:none;border-bottom:2px solid transparent;}
    .home-root .tool-item.active{border-bottom-color:var(--amber);}
    .home-root .diff-grid{grid-template-columns:1fr;}
    .home-root .diff-col.a{border-right:none;border-bottom:1px solid var(--border);}
  }
  @media (max-width:860px){
    .home-root .nav-links{display:none;}
    .home-root .mobile-toggle{display:flex;}
    .home-root header nav{gap:12px;}
  }
  @media (prefers-reduced-motion: reduce){
    .home-root *{animation-duration:0.001ms !important;animation-iteration-count:1 !important;transition-duration:0.001ms !important;scroll-behavior:auto !important;}
  }
`;

function SunIcon() {
  return (
    <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5a8.5 8.5 0 1 1-9.5-11 7 7 0 0 0 9.5 11z" />
    </svg>
  );
}

export default function HomePage() {
  useEffect(() => {
    const root = document.documentElement;
    const cleanup: (() => void)[] = [];

    // Theme init
    let savedTheme: string | null = null;
    try { savedTheme = localStorage.getItem('editive-theme'); } catch {}
    if (savedTheme === 'light' || savedTheme === 'dark') {
      root.setAttribute('data-theme', savedTheme);
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      root.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
    }
    const applyTheme = (t: string) => root.setAttribute('data-theme', t);
    const setTheme = (t: string) => { applyTheme(t); try { localStorage.setItem('editive-theme', t); } catch {} };
    const toggleTheme = () => setTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light');

    const themeBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.home-root .theme-toggle'));
    themeBtns.forEach((b) => {
      b.addEventListener('click', toggleTheme);
      cleanup.push(() => b.removeEventListener('click', toggleTheme));
    });

    // Header scroll state
    const header = document.getElementById('siteHeader');
    const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanup.push(() => window.removeEventListener('scroll', onScroll));

    // Mobile menu
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('mobileMenu');
    const onMenuClick = () => {
      const open = menu?.classList.toggle('open') ?? false;
      toggle?.setAttribute('aria-expanded', String(open));
    };
    toggle?.addEventListener('click', onMenuClick);
    cleanup.push(() => toggle?.removeEventListener('click', onMenuClick));
    menu?.querySelectorAll('a').forEach((a) => {
      const close = () => { menu.classList.remove('open'); toggle?.setAttribute('aria-expanded', 'false'); };
      a.addEventListener('click', close);
      cleanup.push(() => a.removeEventListener('click', close));
    });

    // Scroll reveal
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('.home-root .reveal, .home-root .how-step, .home-root .stagger'));
    if (prefersReduced) {
      revealEls.forEach((el) => el.classList.add('in'));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16 }
      );
      revealEls.forEach((el) => io.observe(el));
      cleanup.push(() => io.disconnect());
    }

    // AI card cursor-follow glow
    const cards = Array.from(document.querySelectorAll<HTMLElement>('.home-root .ai-card'));
    cards.forEach((card) => {
      const move = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', e.clientX - r.left + 'px');
        card.style.setProperty('--my', e.clientY - r.top + 'px');
      };
      card.addEventListener('mousemove', move);
      cleanup.push(() => card.removeEventListener('mousemove', move));
    });

    // Hero layer-stack idle explode/collapse loop
    const layerStack = document.getElementById('layerStack');
    const stageLabel = document.getElementById('stageLabel');
    let interval: ReturnType<typeof setInterval> | null = null;
    if (!prefersReduced && layerStack && stageLabel) {
      let exploded = false;
      interval = setInterval(() => {
        exploded = !exploded;
        layerStack.classList.toggle('exploded', exploded);
        stageLabel.textContent = exploded ? 'unlocked · 4 layers' : 'flattened.png';
      }, 2600);
    } else if (stageLabel) {
      stageLabel.textContent = 'unlocked · 4 layers';
      layerStack?.classList.add('exploded');
    }

    return () => {
      root.removeAttribute('data-theme');
      cleanup.forEach((fn) => fn());
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="home-root">
      <style>{HOME_CSS}</style>

      <header id="siteHeader">
        <div className="wrap">
          <nav>
            <a href="#top" className="logo"><span className="dot"></span>EDITIVE</a>
            <div className="nav-links">
              <a href="#editor-section">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#ai-studio">AI Studio</a>
              <a href="#unlock-design">Unlock Design</a>
              <button className="theme-toggle" aria-label="Toggle light and dark mode">
                <SunIcon />
                <MoonIcon />
              </button>
              <a href="/editor" className="nav-cta">Open Editor</a>
            </div>
            <button className="mobile-toggle" id="mobileToggle" aria-label="Open menu" aria-expanded="false">
              <span></span><span></span><span></span>
            </button>
          </nav>
        </div>
        <div className="mobile-menu" id="mobileMenu">
          <a href="#editor-section">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#ai-studio">AI Studio</a>
          <a href="#unlock-design">Unlock Design</a>
          <div className="mm-row">
            <span>Appearance</span>
            <button className="theme-toggle" aria-label="Toggle light and dark mode">
              <SunIcon />
              <MoonIcon />
            </button>
          </div>
          <a href="/editor" className="nav-cta">Open Editor</a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy reveal in">
              <h1>Your Image. <span className="accent">Make It Editable.</span></h1>
              <p className="lede">EDITIVE combines a full image editor with AI workflows that can turn a flattened JPG or PNG back into something you can actually work with — text, shapes, and layers included.</p>
              <p className="hero-tagline">Create. Edit. <span>Unlock.</span> Reframe.</p>
              <div className="cta-row">
                <a href="/editor" className="btn-primary">Open Editor →</a>
                <a href="#how-it-works" className="btn-secondary">See How It Works</a>
              </div>
            </div>

            <div className="hero-visual reveal in reveal-delay-1">
              <div className="stage-bar">
                <div className="pip"></div><div className="pip"></div><div className="pip"></div>
                <span className="stage-label" id="stageLabel">flattened.png</span>
              </div>
              <div className="layer-stack" id="layerStack">
                <div className="layer-plate background">background</div>
                <div className="layer-plate image">image</div>
                <div className="layer-plate shape">shape</div>
                <div className="layer-plate text">text</div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="problem">
          <div className="wrap problem-grid">
            <div className="reveal">
              <p className="problem-statement">You have <strong>the design.</strong><br />You just don&apos;t have <strong>the file.</strong></p>
            </div>
            <div className="problem-visual reveal reveal-delay-1">
              <div className="file-row"><span>final-poster.jpg</span><span className="tag locked">flattened</span></div>
              <div className="file-row"><span>original.psd</span><span className="tag locked">missing</span></div>
              <div className="file-row"><span>unlocked-design.editive</span><span className="tag open">editable</span></div>
              <p className="resolve-line">Bring the image. EDITIVE gives you back the controls.</p>
            </div>
          </div>
        </section>

        {/* UNLOCK DESIGN */}
        <section className="unlock" id="unlock-design">
          <div className="wrap">
            <div className="unlock-head reveal">
              <div className="eyebrow" style={{ justifyContent: 'center' }}>Signature workflow</div>
              <h2>What if a flattened image wasn&apos;t really finished?</h2>
              <p>Upload a JPG or PNG. EDITIVE analyzes the composition and attempts to recover supported editable elements — so you can keep designing instead of starting over.</p>
            </div>

            <div className="unlock-pipeline stagger">
              <div className="pipeline-stage before">
                <span className="stage-tag">Before</span>
                <h4>Flattened image</h4>
                <p>One merged JPG or PNG. No layers, no structure, no way back in.</p>
              </div>
              <div className="pipeline-arrow"></div>
              <div className="pipeline-stage analyze">
                <span className="stage-tag">Analyze</span>
                <h4>AI-assisted recovery</h4>
                <p>EDITIVE reads the composition and identifies supported visual regions.</p>
              </div>
              <div className="pipeline-arrow"></div>
              <div className="pipeline-stage after">
                <span className="stage-tag">After</span>
                <h4>Editable structure</h4>
                <p>Recovered elements you can select, move, restyle, and export again.</p>
              </div>
            </div>

            <div className="element-tags reveal">
              <span className="tag-chip">text</span>
              <span className="tag-chip">image</span>
              <span className="tag-chip">shape</span>
              <span className="tag-chip">background</span>
              <span className="tag-chip">visual regions</span>
            </div>
          </div>
        </section>

        {/* CORE EDITOR */}
        <section className="editor-sec" id="editor-section">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">Core editor</div>
              <h2>Everything you need to shape the design.</h2>
              <p>Unlock Design gets you back in — the core editor is where you finish the job. A full creative workspace, not just an AI trick.</p>
            </div>
            <div className="editor-panel reveal reveal-delay-1">
              <div className="tool-list">
                <div className="tool-item active"><span className="ico"></span>Canvas</div>
                <div className="tool-item"><span className="ico"></span>Layers</div>
                <div className="tool-item"><span className="ico"></span>Text</div>
                <div className="tool-item"><span className="ico"></span>Shapes</div>
                <div className="tool-item"><span className="ico"></span>Drawing</div>
                <div className="tool-item"><span className="ico"></span>Crop</div>
                <div className="tool-item"><span className="ico"></span>Adjust</div>
                <div className="tool-item"><span className="ico"></span>Effects</div>
                <div className="tool-item"><span className="ico"></span>Align &amp; Arrange</div>
                <div className="tool-item"><span className="ico"></span>Structure</div>
              </div>
              <div className="editor-canvas">
                <div className="canvas-frame">1080 × 1080</div>
              </div>
            </div>
          </div>
        </section>

        {/* AI STUDIO */}
        <section className="ai-sec" id="ai-studio">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow violet">AI Studio</div>
              <h2>AI tools that remove the tedious parts.</h2>
              <p>Integrated into the same canvas — not a separate chatbot bolted onto the side.</p>
            </div>
            <div className="ai-grid stagger" id="aiGrid">
              <div className="ai-card"><div className="mark">01</div><h4>Remove Background</h4><p>Isolate the subject in one pass.</p></div>
              <div className="ai-card"><div className="mark">02</div><h4>Blur Background</h4><p>Push focus onto the subject.</p></div>
              <div className="ai-card"><div className="mark">03</div><h4>Remove Object</h4><p>Erase distractions cleanly.</p></div>
              <div className="ai-card"><div className="mark">04</div><h4>Replace Object</h4><p>Swap elements without redoing the shot.</p></div>
              <div className="ai-card"><div className="mark">05</div><h4>Smart Enhance</h4><p>Lift clarity, color, and detail.</p></div>
              <div className="ai-card"><div className="mark">06</div><h4>AI Upscale 2×</h4><p>Larger output, preserved detail.</p></div>
              <div className="ai-card"><div className="mark">07</div><h4>AI Expand</h4><p>Extend the canvas beyond the original frame.</p></div>
              <div className="ai-card"><div className="mark">08</div><h4>OCR / Extract Text</h4><p>Pull text out of an image as text.</p></div>
              <div className="ai-card"><div className="mark">09</div><h4>Smart Object Select</h4><p>Select what matters, automatically.</p></div>
              <div className="ai-card"><div className="mark">10</div><h4>Smart Crop</h4><p>Recompose around the subject.</p></div>
            </div>
          </div>
        </section>

        {/* SMART REFRAME */}
        <section className="reframe-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">Smart Reframe</div>
              <h2>One design. Every format.</h2>
              <p>Adapt a finished design across formats with intelligent composition — not just a stretched resize.</p>
            </div>
            <div className="reframe-visual stagger">
              <div className="format-card post"><div className="plate"></div><span className="fmt-label">Instagram Post</span></div>
              <div className="format-card story"><div className="plate"></div><span className="fmt-label">Story / Reel</span></div>
              <div className="format-card thumb"><div className="plate"></div><span className="fmt-label">YouTube Thumb</span></div>
              <div className="format-card linkedin"><div className="plate"></div><span className="fmt-label">LinkedIn Post</span></div>
              <div className="format-card custom"><div className="plate"></div><span className="fmt-label">Custom Size</span></div>
            </div>
          </div>
        </section>

        {/* DESIGN MEMORY */}
        <section className="memory-sec">
          <div className="wrap memory-grid">
            <div className="reveal">
              <div className="eyebrow">Design Memory</div>
              <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', lineHeight: 1.15, marginBottom: 16 }}>Make good design repeatable.</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.65 }}>Save the styling that makes a design work, then apply it to the next one — instead of rebuilding it from memory.</p>
            </div>
            <div className="reveal reveal-delay-1">
              <div className="token-list">
                <div className="token-row"><span className="name"><span className="swatch" style={{ background: 'linear-gradient(135deg,#ffb020,#ff7a3d)' }}></span>Typography</span><span className="val">Space Grotesk / 600</span></div>
                <div className="token-row"><span className="name"><span className="swatch" style={{ background: '#7c6cf0' }}></span>Colors</span><span className="val">#FFB020 · #7C6CF0</span></div>
                <div className="token-row"><span className="name"><span className="swatch" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-strong)' }}></span>Spacing</span><span className="val">8px grid</span></div>
                <div className="token-row"><span className="name"><span className="swatch" style={{ background: 'var(--inset-bg)', border: '1px solid var(--border-strong)' }}></span>Shadows</span><span className="val">soft / 24px</span></div>
                <div className="token-row"><span className="name"><span className="swatch" style={{ background: 'transparent', border: '1.5px solid var(--text-muted)' }}></span>Borders</span><span className="val">1px hairline</span></div>
                <div className="token-row"><span className="name"><span className="swatch" style={{ background: 'var(--amber)' }}></span>CTA Styling</span><span className="val">pill / bold</span></div>
              </div>
              <p className="memory-note">saved-style: &quot;product-launch-kit&quot;</p>
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section className="workflow-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">Workflow</div>
              <h2>From upload to export, in one place.</h2>
              <p>A real sequence — each stage picks up exactly where the last one left off.</p>
            </div>
            <div className="workflow-list">
              <div className="workflow-item reveal">
                <span className="idx">01</span>
                <div>
                  <h4>Start</h4>
                  <p>Begin from a blank canvas, an existing project, an uploaded image, a PSD, or a design you want to unlock.</p>
                  <div className="chips"><span>Blank Canvas</span><span>Open Project</span><span>Upload Image</span><span>Import PSD</span><span>Unlock Design</span></div>
                </div>
              </div>
              <div className="workflow-item reveal">
                <span className="idx">02</span>
                <div><h4>Create</h4><p>Shape the design with the core canvas, text, shape, and drawing tools.</p></div>
              </div>
              <div className="workflow-item reveal">
                <span className="idx">03</span>
                <div><h4>Enhance</h4><p>Hand the tedious parts to AI Studio — backgrounds, objects, upscaling, cleanup.</p></div>
              </div>
              <div className="workflow-item reveal">
                <span className="idx">04</span>
                <div><h4>Reframe</h4><p>Adapt the finished design to the formats it actually needs to live in.</p></div>
              </div>
              <div className="workflow-item reveal">
                <span className="idx">05</span>
                <div><h4>Remember</h4><p>Save the visual styling worth reusing with Design Memory.</p></div>
              </div>
              <div className="workflow-item reveal">
                <span className="idx">06</span>
                <div>
                  <h4>Export</h4>
                  <p>Take it out in the format the job calls for.</p>
                  <div className="chips"><span>PNG</span><span>JPG</span><span>WebP</span><span>Transparent PNG</span><span>PSD (supported)</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DIFFERENTIATION */}
        <section className="diff-sec">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">Why it&apos;s different</div>
              <h2>Most editors need the file. EDITIVE can start with the image.</h2>
            </div>
            <div className="diff-grid reveal reveal-delay-1">
              <div className="diff-col a">
                <p className="diff-label">Traditional editors</p>
                <div className="diff-flow">
                  <div className="step">Start with editable files</div>
                  <div className="step">Design</div>
                  <div className="step">Export</div>
                  <div className="step final">Flatten — and that&apos;s the end of the line</div>
                </div>
              </div>
              <div className="diff-col b">
                <p className="diff-label">EDITIVE</p>
                <div className="diff-flow">
                  <div className="step">Start with the finished image</div>
                  <div className="step">Analyze</div>
                  <div className="step">Recover supported editable elements</div>
                  <div className="step final">Continue editing</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="how-sec" id="how-it-works">
          <div className="wrap">
            <div className="section-head reveal">
              <div className="eyebrow">How it works</div>
              <h2>Five steps, one canvas.</h2>
            </div>
            <div className="how-track">
              <div className="how-step reveal"><span className="num">01</span><h4>Upload</h4><p>Bring in a flattened JPG or PNG.</p></div>
              <div className="how-step reveal"><span className="num">02</span><h4>Understand</h4><p>EDITIVE analyzes the composition.</p></div>
              <div className="how-step reveal"><span className="num">03</span><h4>Edit</h4><p>Work with the recovered elements.</p></div>
              <div className="how-step reveal"><span className="num">04</span><h4>Reframe</h4><p>Adapt it to the formats you need.</p></div>
              <div className="how-step reveal"><span className="num">05</span><h4>Export</h4><p>Ship it in the format the job calls for.</p></div>
            </div>
          </div>
        </section>

        {/* TECH CREDIBILITY */}
        <section className="tech-sec">
          <div className="wrap tech-row reveal">
            <p className="tech-caption">Built on Next.js and React, with a canvas-based editor engine and AI APIs handling recovery and enhancement. Deployed on Vercel.</p>
            <div className="tech-pills">
              <span>Next.js</span><span>React</span><span>Canvas Engine</span><span>AI APIs</span><span>Vercel</span><span>GitHub</span>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta">
          <div className="wrap">
            <h2 className="reveal">Your next design might already exist.</h2>
            <a href="/editor" className="btn-primary reveal reveal-delay-1">Open EDITIVE →</a>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#top" className="logo"><span className="dot"></span>EDITIVE</a>
              <p>An AI-powered image editor built to take a finished image back to something editable.</p>
            </div>
            <div className="footer-col">
              <h5>Product</h5>
              <ul>
                <li><a href="#unlock-design">Unlock Design</a></li>
                <li><a href="#editor-section">Core Editor</a></li>
                <li><a href="#ai-studio">AI Studio</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Formats</h5>
              <ul>
                <li><a href="#">PNG</a></li>
                <li><a href="#">JPG</a></li>
                <li><a href="#">WebP</a></li>
                <li><a href="#">PSD (supported)</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>Get started</h5>
              <ul>
                <li><a href="/editor">Open Editor</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>EDITIVE — Create. Edit. Unlock. Reframe.</span>
            <span>Built with Next.js · React · Vercel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
