import { useState, useEffect, useRef, useCallback } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import img0 from '../imports/image.png';
import img1 from '../imports/image-1.png';
import img2 from '../imports/image-2.png';
import img3 from '../imports/image-3.png';
import img4 from '../imports/image-4.png';
import img5 from '../imports/image-5.png';
import img6 from '../imports/image-6.png';
import img7 from '../imports/image-7.png';
import img8 from '../imports/image-8.png';

// ─── STYLES ──────────────────────────────────────────────────────────────────
const STYLES = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --pri:#C9906A;--sec:#2C2A24;--acc:#8A9E7A;
  --bg:#F7F0E6;--surf:#EDE3D4;--slate:#5A6672;
  --text:#2C2A24;--muted:#5C4F42;--parch:#FAF5ED;
}
body{background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;overflow-x:hidden}
h1,h2,h3,h4,h5{font-family:Georgia,'Times New Roman',serif}
button{font-family:inherit;cursor:pointer}
input,select,textarea{font-family:inherit}

/* ── Loading Screen */
.lc-loader{position:fixed;inset:0;z-index:9999;background:#2C2A24;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:1;visibility:visible;transition:opacity 0.6s ease,visibility 0.6s ease}
.lc-loader.done{opacity:0;visibility:hidden}
.lc-loader-content{text-align:center}
.lc-loader-title{font-family:Georgia,serif;font-size:1.6rem;color:#F7F0E6;margin-bottom:6px;letter-spacing:0.08em}
.lc-loader-title em{color:#C9906A;font-style:normal}
.lc-loader-bar{width:160px;height:2px;background:rgba(201,144,106,0.15);margin:24px auto;border-radius:1px;overflow:hidden;position:relative}
.lc-loader-shimmer{position:absolute;inset:0;background:linear-gradient(to right,transparent,#C9906A,transparent);animation:shimmer 1.2s infinite}
@keyframes shimmer{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
.lc-loader-text{font-size:0.68rem;color:rgba(201,144,106,0.4);text-transform:uppercase;letter-spacing:0.16em;margin-top:20px}

/* ── Navbar */
.lc-nav{position:fixed;top:0;left:0;right:0;z-index:300;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:64px;background:rgba(44,42,36,0.94);backdrop-filter:blur(16px);border-bottom:1px solid rgba(201,144,106,0.15)}
.lc-logo{font-family:Georgia,serif;color:#F7F0E6;font-size:1.2rem;letter-spacing:0.04em;background:none;border:none;padding:0;display:flex;align-items:center;gap:9px}
.lc-logo em{color:var(--pri);font-style:normal}
.lc-logo svg{flex-shrink:0;opacity:0.9}
.lc-navlinks{display:flex;gap:32px;list-style:none;align-items:center}
.lc-navlinks button{background:none;border:none;color:#C8B89A;font-size:0.78rem;letter-spacing:0.12em;text-transform:uppercase;padding:6px 0;position:relative;transition:color 0.25s}
.lc-navlinks button::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--pri);transition:width 0.3s}
.lc-navlinks button:hover,.lc-navlinks button.active{color:var(--pri)}
.lc-navlinks button:hover::after,.lc-navlinks button.active::after{width:100%}

/* ── Mobile Hamburger */
.lc-ham{display:none;background:none;border:none;color:#F7F0E6;width:32px;height:32px;padding:0;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;transition:color 0.25s}
.lc-ham:hover{color:var(--pri)}
.lc-ham svg{width:20px;height:20px}
@media(max-width:640px){.lc-ham{display:flex;order:3;margin-left:auto}}
.lc-mob-menu{position:fixed;top:64px;left:0;right:0;bottom:0;z-index:290;background:rgba(44,42,36,0.97);backdrop-filter:blur(20px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;opacity:0;translate:0 -100%;pointer-events:none;transition:opacity 0.35s,translate 0.35s cubic-bezier(0.16,1,0.3,1)}
.lc-mob-menu.open{opacity:1;translate:0;pointer-events:auto}
.lc-mob-menu button{background:none;border:none;color:#C8B89A;font-size:1rem;letter-spacing:0.16em;text-transform:uppercase;transition:color 0.25s;padding:0;cursor:pointer}
.lc-mob-menu button:hover{color:var(--pri)}
@media(max-width:640px){.lc-navlinks{display:none}}

/* ── Page */
.lc-page{opacity:1}
@media(prefers-reduced-motion:no-preference){.lc-page{animation:lcFade 0.45s ease forwards}}
@keyframes lcFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes imgReveal{from{opacity:0;filter:blur(12px)}to{opacity:1;filter:blur(0)}}
.lc-opt-img{opacity:0;transition:none}
.lc-opt-img.loaded{animation:imgReveal 0.5s ease forwards}
.lc-fi{opacity:0;transform:translateY(32px);transition:opacity 0.7s ease,transform 0.7s ease}
.lc-fi.vis{opacity:1;transform:translateY(0)}
@media(prefers-reduced-motion:reduce){.lc-fi{opacity:1;transform:none}}

/* ── Hero */
.lc-hero{position:relative;height:100vh;min-height:600px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#C9906A}
.lc-hero-bg{position:absolute;inset:0;z-index:0;background:linear-gradient(135deg,#4A2810 0%,#7A3E20 35%,#C9906A 70%,#E8D5B7 100%)}
.lc-hero-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;z-index:1}
@media(prefers-reduced-motion:no-preference){.lc-hero-img{animation:heroFadeIn 0.65s ease 0.1s forwards}}
@media(prefers-reduced-motion:reduce){.lc-hero-img{opacity:0.32}}
@keyframes heroFadeIn{from{opacity:0}to{opacity:0.32}}
.lc-hero-ov{position:absolute;inset:0;z-index:2;background:linear-gradient(165deg,rgba(30,22,14,0.3) 0%,rgba(20,14,8,0.78) 100%)}
.lc-canvas{position:absolute;inset:0;z-index:3;pointer-events:none;width:100%;height:100%}
.lc-hero-content{position:relative;z-index:5;text-align:center;padding:0 24px;max-width:900px}
.lc-hero-pill{display:inline-block;color:var(--pri);font-size:0.7rem;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:24px;border:1px solid rgba(201,144,106,0.4);padding:6px 18px;border-radius:24px;background:rgba(201,144,106,0.08)}
.lc-headline{color:#F7F0E6;line-height:1.06;margin-bottom:20px}
.lc-hrow{display:flex;flex-wrap:wrap;justify-content:center;gap:0 16px}
.lc-word{display:inline-block;opacity:0;transform:translateY(44px)}
@media(prefers-reduced-motion:no-preference){.lc-word.go{animation:wUp 0.75s cubic-bezier(0.16,1,0.3,1) forwards}}
@keyframes wUp{to{opacity:1;transform:translateY(0)}}
.lc-sub{color:rgba(228,210,182,0.82);margin-bottom:48px;opacity:0;transform:translateY(14px);transition:opacity 0.7s 0.9s,transform 0.7s 0.9s}
.lc-sub.go{opacity:1;transform:translateY(0)}
.lc-cta{background:var(--pri);color:#F7F0E6;border:none;padding:16px 42px;border-radius:24px;font-family:Georgia,serif;font-size:0.95rem;letter-spacing:0.06em;box-shadow:0 8px 32px rgba(201,144,106,0.4);opacity:0;transform:translateY(18px);transition:background 0.3s,box-shadow 0.3s,opacity 0.6s 1.2s,transform 0.6s 1.2s}
.lc-cta.go{opacity:1;transform:translateY(0)}
@media(prefers-reduced-motion:no-preference){.lc-cta.go{animation:floatY 3.2s ease-in-out 1.8s infinite}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.lc-cta:hover{background:#D4A07A;box-shadow:0 14px 42px rgba(201,144,106,0.55)}
.lc-cta-secondary{border:1.5px solid var(--pri);background:rgba(201,144,106,0.15);color:var(--pri);padding:16px 42px;border-radius:24px;font-family:Georgia,serif;font-size:0.95rem;letter-spacing:0.06em;transition:all 0.3s;cursor:pointer;font-size:0.95rem}
.lc-cta-secondary:hover{background:rgba(201,144,106,0.25);box-shadow:0 8px 24px rgba(201,144,106,0.2)}
.lc-cta-secondary.go{opacity:1;transform:translateY(0)}
.lc-scroll-hint{position:absolute;bottom:28px;left:50%;transform:translateX(-50%);z-index:5;display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(228,210,182,0.45);font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase}
.lc-scroll-line{width:1px;height:44px;background:linear-gradient(to bottom,rgba(201,144,106,0.7),transparent)}
@media(prefers-reduced-motion:no-preference){.lc-scroll-line{animation:sLine 2.2s ease-in-out infinite}}
@keyframes sLine{0%{transform:scaleY(0);transform-origin:top}45%{transform:scaleY(1);transform-origin:top}55%{transform:scaleY(1);transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}

/* ── Sections */
.lc-sec{padding:96px 64px}
.lc-sec-inner{max-width:1200px;margin:0 auto}
.lc-eyebrow{color:var(--pri);font-size:0.7rem;letter-spacing:0.22em;text-transform:uppercase;margin-bottom:12px}
.lc-sec-title{color:var(--sec);margin-bottom:44px}

/* ── Feature Cards (light/shadow micro-interaction) */
.lc-kota{position:relative;background:var(--surf);border-radius:8px;padding:40px 32px;border:1px solid rgba(201,144,106,0.14);overflow:hidden;transition:transform 0.3s,box-shadow 0.3s;--mx:50%;--my:50%}
.lc-kota::before{content:'';position:absolute;inset:0;background:radial-gradient(200px at var(--mx) var(--my),rgba(255,228,160,0.18) 0%,transparent 70%);opacity:0;transition:opacity 0.4s;pointer-events:none;z-index:1}
.lc-kota::after{content:'';position:absolute;inset:0;background-size:cover;background-position:center;background-repeat:no-repeat;opacity:0.1;transition:opacity 0.4s;z-index:0;pointer-events:none}
.lc-kota.has-bg::after{opacity:0.14}
.lc-kota:hover{transform:translateY(-4px);box-shadow:0 20px 52px rgba(44,42,36,0.12)}
.lc-kota:hover::before{opacity:1}
.lc-kota:hover.has-bg::after{opacity:0.22}
.lc-kota>*{position:relative;z-index:2}
.lc-kota-icon{width:48px;height:48px;background:var(--pri);border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:22px;color:#F7F0E6}
.lc-kota-title{color:var(--sec);margin-bottom:8px;font-size:1.05rem}
.lc-kota-desc{color:var(--muted);line-height:1.75;font-size:0.88rem}
.lc-feats{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}

/* Hide first and third feature cards on mobile, keep only Chhattisgarhi Kitchen */
@media(max-width:640px){.lc-feats .lc-kota:nth-child(1),.lc-feats .lc-kota:nth-child(3){display:none}.lc-feats{grid-template-columns:1fr}}

/* ── Food Carousel */
.lc-touch-sec{background:var(--sec);padding:80px 0;overflow:hidden}
.lc-touch-head{padding:0 64px;margin-bottom:40px}
.lc-food-track{display:flex;gap:20px;padding:8px 64px 8px;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;cursor:grab;touch-action:auto}
.lc-food-track:active{cursor:grabbing}
.lc-food-track::-webkit-scrollbar{display:none}
.lc-tex-card{flex-shrink:0;width:320px;height:460px;border-radius:12px;overflow:hidden;position:relative;scroll-snap-align:center;transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.4s}
.lc-tex-card:hover{transform:translateY(-6px)}
.lc-tex-img{width:100%;height:100%;object-fit:cover;transition:transform 0.7s ease}
.lc-tex-card:hover .lc-tex-img{transform:scale(1.04)}
.lc-tex-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(20,12,6,0.92) 0%,rgba(20,12,6,0.18) 55%,transparent 100%)}
.lc-tex-body{position:absolute;bottom:0;left:0;right:0;padding:28px 28px 24px}
.lc-tex-tag{display:inline-block;border:1px solid rgba(201,144,106,0.55);color:var(--pri);padding:3px 12px;border-radius:24px;font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:8px}
.lc-tex-title{color:#F7F0E6;margin-bottom:6px;font-size:1.15rem}
.lc-tex-desc{color:rgba(228,210,182,0.72);font-size:0.82rem;line-height:1.65;margin-bottom:0}
.lc-food-dots{display:flex;justify-content:center;gap:8px;padding:24px 64px 0}
.lc-food-dot{width:6px;height:6px;border-radius:50%;background:rgba(201,144,106,0.25);border:none;padding:0;transition:all 0.35s cubic-bezier(0.16,1,0.3,1);cursor:pointer}
.lc-food-dot.active{background:var(--pri);width:24px;border-radius:3px}
.lc-tex-card.premium{width:360px;border:1px solid rgba(201,144,106,0.3);box-shadow:0 0 40px rgba(201,144,106,0.12)}
.lc-tex-card.premium .lc-tex-tag{background:var(--pri);color:#F7F0E6;border-color:var(--pri)}
.lc-tex-card.premium .lc-tex-body{padding:28px 28px 28px}
.lc-tex-card.premium .lc-tex-title{font-size:1.3rem}
.lc-tex-premium-badge{display:flex;align-items:center;gap:6px;margin-top:10px;color:var(--pri);font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase}
.lc-tex-premium-badge svg{opacity:0.85}
@media(max-width:640px){.lc-tex-card{width:280px;height:400px}.lc-tex-card.premium{width:300px}.lc-food-track{padding:8px 20px 8px;gap:14px}.lc-touch-head{padding:0 20px}.lc-food-dots{padding:20px 20px 0}}

/* ── Zoom Modal */
.lc-zoom-ov{position:fixed;inset:0;z-index:500;background:rgba(10,7,4,0.96);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.35s}
.lc-zoom-ov.open{opacity:1;pointer-events:auto}
.lc-zoom-inner{position:relative;max-width:90vw;max-height:88vh;overflow:hidden;border-radius:12px}
.lc-zoom-img{width:auto;height:auto;max-width:90vw;max-height:84vh;object-fit:contain;display:block;transition:transform 0.1s}
.lc-zoom-close{position:absolute;top:14px;right:14px;background:rgba(44,42,36,0.85);border:1px solid rgba(201,144,106,0.3);color:#F7F0E6;width:36px;height:36px;border-radius:50%;font-size:1.1rem;display:flex;align-items:center;justify-content:center}
.lc-zoom-info{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(20,12,6,0.95),transparent);padding:28px 24px 20px}
.lc-zoom-title{color:#F7F0E6;margin-bottom:4px;font-size:1.1rem}
.lc-zoom-sub{color:rgba(228,210,182,0.7);font-size:0.82rem}
.lc-zoom-hint{font-size:0.7rem;color:rgba(201,144,106,0.7);margin-top:10px;letter-spacing:0.06em}

/* ── Pull Quote */
.lc-quote{padding:96px 64px;text-align:center;position:relative;overflow:hidden;background:var(--sec)}
.lc-quote-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.5}
.lc-quote-ov{position:absolute;inset:0;background:linear-gradient(165deg,rgba(20,14,8,0.5) 0%,rgba(44,42,36,0.55) 100%)}
.lc-quote::before{content:'"';position:absolute;top:-60px;left:50%;transform:translateX(-50%);font-size:22rem;color:rgba(201,144,106,0.07);font-family:Georgia,serif;line-height:1;pointer-events:none;user-select:none;z-index:2}
.lc-quote-text{color:#F7F0E6;max-width:700px;margin:0 auto 22px;line-height:1.22;position:relative;z-index:3}
.lc-quote-attr{color:var(--pri);letter-spacing:0.14em;font-size:0.76rem;text-transform:uppercase;position:relative;z-index:3}

/* ── Tilt Cards (3D Marquee) */
.lc-tilt-marq-outer{overflow:hidden;padding:56px 0;background:var(--surf);position:relative}
.lc-tilt-marq-outer::before,.lc-tilt-marq-outer::after{content:'';position:absolute;top:0;bottom:0;width:120px;z-index:2;pointer-events:none}
.lc-tilt-marq-outer::before{left:0;background:linear-gradient(to right,var(--surf),transparent)}
.lc-tilt-marq-outer::after{right:0;background:linear-gradient(to left,var(--surf),transparent)}
.lc-tilt-marq-track{display:flex;gap:24px;width:max-content}
@media(prefers-reduced-motion:no-preference){.lc-tilt-marq-track{animation:tiltMarq 30s linear infinite}}
.lc-tilt-marq-outer:hover .lc-tilt-marq-track{animation-play-state:paused}
@media(max-width:768px){.lc-tilt-marq-outer{padding:40px 0;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.lc-tilt-marq-outer::-webkit-scrollbar{display:none}
.lc-tilt-marq-outer::before,.lc-tilt-marq-outer::after{display:none}
.lc-tilt-marq-track{animation:none!important;width:100%;gap:16px;padding:0 16px}}
@media(max-width:640px){.lc-tilt-marq-outer{padding:32px 0}
.lc-tilt-marq-track{gap:12px;padding:0 12px}}
@keyframes tiltMarq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.lc-tilt{border-radius:10px;overflow:hidden;position:relative;width:400px;height:320px;flex-shrink:0;transform-style:preserve-3d;transition:transform 0.18s ease,box-shadow 0.3s;scroll-snap-align:center;scroll-snap-stop:always}
.lc-tilt:hover{box-shadow:0 24px 64px rgba(44,42,36,0.24)}
@media(max-width:768px){.lc-tilt{width:280px;height:240px;border-radius:12px;box-shadow:0 8px 24px rgba(44,42,36,0.12)}}
@media(max-width:640px){.lc-tilt{width:240px;height:200px;border-radius:10px;box-shadow:0 4px 16px rgba(44,42,36,0.1)}}
.lc-tilt-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lc-tilt-tint{position:absolute;inset:0}
.lc-tilt-grad{position:absolute;inset:0;background:linear-gradient(to top,rgba(28,18,10,0.88) 0%,rgba(28,18,10,0.18) 55%,transparent 100%)}
.lc-tilt-body{position:absolute;bottom:0;left:0;right:0;padding:28px;z-index:2}
.lc-tilt-tag{display:inline-block;background:var(--pri);color:#F7F0E6;padding:3px 12px;border-radius:24px;font-size:0.66rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:8px}
.lc-tilt-title{color:#F7F0E6;margin-bottom:6px;font-size:1.15rem}
.lc-tilt-desc{color:rgba(228,210,182,0.78);font-size:0.85rem;line-height:1.65}
@media(max-width:640px){.lc-tilt-marq-outer{padding:32px 0}}

/* ── Interior Bento Gallery */
.lc-bento{background:var(--bg);padding:96px 64px}
.lc-bento-inner{max-width:1200px;margin:0 auto}
.lc-bento-grid{display:grid;grid-template-columns:1.15fr 0.85fr;grid-template-rows:auto auto;gap:16px;margin-top:48px}
.lc-bento-main{grid-row:1/3;border-radius:10px;overflow:hidden;position:relative;min-height:520px}
.lc-bento-main img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s ease}
.lc-bento-main:hover img{transform:scale(1.03)}
.lc-bento-side{display:grid;grid-template-columns:1fr;grid-template-rows:1fr auto;gap:16px}
.lc-bento-img{border-radius:10px;overflow:hidden;position:relative}
.lc-bento-img img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.6s ease}
.lc-bento-img:hover img{transform:scale(1.03)}
.lc-bento-quote{background:var(--surf);border-radius:10px;padding:32px;display:flex;flex-direction:column;justify-content:center;border:1px solid rgba(201,144,106,0.12)}
.lc-bento-quote-mark{color:var(--pri);font-family:Georgia,serif;font-size:0.7rem;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:10px}
.lc-bento-quote-text{color:var(--sec);font-family:Georgia,serif;line-height:1.5;font-size:1.15rem}
.lc-bento-row2{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:16px}
.lc-bento-row2 .lc-bento-img{height:240px}
.lc-bento-credit{background:var(--surf);border-radius:10px;padding:28px;display:flex;flex-direction:column;justify-content:flex-end;border:1px solid rgba(201,144,106,0.12)}
.lc-bento-credit-eye{color:var(--pri);font-size:0.65rem;letter-spacing:0.16em;text-transform:uppercase;margin-bottom:auto}
.lc-bento-credit-name{color:var(--sec);font-family:Georgia,serif;font-size:1.1rem;margin-bottom:4px}
.lc-bento-credit-sub{color:var(--muted);font-size:0.82rem}

/* ── Come Find Us */
.lc-find{background:var(--bg);padding:96px 64px}
.lc-find-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1.1fr;gap:64px;align-items:start}
.lc-find-info{padding-top:8px}
.lc-find-heading{color:var(--sec);margin-bottom:20px;font-size:clamp(1.75rem,3.2vw,2.5rem)}
.lc-find-sub{color:var(--muted);font-size:0.93rem;line-height:1.8;margin-bottom:36px}
.lc-find-detail{display:flex;flex-direction:column;gap:20px;margin-bottom:36px}
.lc-find-row{display:flex;align-items:flex-start;gap:14px}
.lc-find-ico{width:38px;height:38px;border-radius:50%;background:rgba(201,144,106,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--pri);margin-top:1px}
.lc-find-label{color:var(--muted);font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:3px}
.lc-find-val{color:var(--sec);font-size:0.92rem;line-height:1.6}
.lc-find-btn{display:inline-flex;align-items:center;gap:9px;background:var(--sec);color:#F7F0E6;border:none;padding:13px 26px;border-radius:8px;font-size:0.85rem;letter-spacing:0.06em;transition:background 0.3s,transform 0.2s}
.lc-find-btn:hover{background:#3D3930;transform:translateY(-1px)}
.lc-find-btn svg{flex-shrink:0}
.lc-find-map-wrap{border-radius:12px;overflow:hidden;border:1px solid rgba(201,144,106,0.2);box-shadow:0 8px 40px rgba(44,42,36,0.1)}
.lc-find-accent{display:block;height:3px;background:linear-gradient(to right,var(--pri),transparent);border-radius:2px;margin-bottom:36px}
.lc-map{width:100%;height:400px;border-radius:12px;z-index:1}
@media(max-width:640px){.lc-map{height:280px}}

/* ── Leaflet overrides */
.leaflet-container{font-family:system-ui,-apple-system,sans-serif}
.leaflet-popup-content-wrapper{border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.35);border:1px solid rgba(201,144,106,0.3);background:#2C2A24!important;color:#F7F0E6}
.leaflet-popup-tip{background:#2C2A24!important}
.leaflet-popup-close-button{color:#F7F0E6!important}
.leaflet-control-attribution{font-size:0.65rem;background:rgba(247,240,230,0.85)!important}

/* ── Menu Hero */
.lc-menu-hero{background:var(--sec);padding:144px 64px 64px;text-align:center;position:relative;overflow:hidden}
.lc-menu-hero::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:linear-gradient(to right,transparent,var(--pri),transparent);z-index:3}
.lc-mh-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.5}
.lc-mh-ov{position:absolute;inset:0;background:linear-gradient(165deg,rgba(20,14,8,0.45) 0%,rgba(44,42,36,0.5) 100%)}
.lc-mh-eye{color:var(--pri);font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:14px;position:relative;z-index:2}
.lc-mh-title{color:#F7F0E6;margin-bottom:12px;position:relative;z-index:2}
.lc-mh-sub{color:rgba(212,184,150,0.65);font-size:0.92rem;letter-spacing:0.04em;position:relative;z-index:2}

/* ── Time Filter */
.lc-time-filter{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:36px}
.lc-tf-btn{background:var(--surf);border:1px solid rgba(201,144,106,0.2);color:var(--muted);padding:9px 20px;border-radius:24px;font-size:0.78rem;letter-spacing:0.06em;transition:all 0.25s}
.lc-tf-btn:hover{border-color:rgba(201,144,106,0.5);color:var(--sec)}
.lc-tf-btn.active{background:var(--pri);border-color:var(--pri);color:#F7F0E6}
.lc-tf-btn.golden-hour{border-color:rgba(218,165,32,0.5);color:#B8860B}
.lc-tf-btn.golden-hour.active{background:linear-gradient(135deg,#C9906A,#D4A017);border-color:transparent;color:#F7F0E6}

/* ── Menu Accordion */
.lc-menu-body{padding:64px 64px 80px;max-width:980px;margin:0 auto}
.lc-menu-cat{margin-bottom:10px;border:1px solid rgba(201,144,106,0.18);border-radius:8px;overflow:hidden;transition:box-shadow 0.3s,transform 0.3s}
.lc-menu-cat:hover{box-shadow:0 4px 16px rgba(201,144,106,0.15);transform:translateY(-2px)}
.lc-cat-hdr{display:flex;align-items:center;justify-content:space-between;padding:22px 32px;background:var(--surf);border:none;width:100%;text-align:left;transition:background 0.25s;position:relative;overflow:hidden}
.lc-cat-hdr:hover{background:#E4D8C8}
.lc-cat-hdr::after{content:'';position:absolute;bottom:0;left:0;width:0;height:2px;background:var(--pri);transition:width 0.4s ease}
.lc-menu-cat.open .lc-cat-hdr::after{width:100%}
.lc-cat-name{font-family:Georgia,serif;color:var(--sec);display:flex;align-items:center;gap:10px;font-size:1.05rem}
.lc-cat-ico{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;background:rgba(201,144,106,0.12);color:var(--pri);flex-shrink:0}
.lc-cat-tog{color:var(--pri);font-size:1.4rem;line-height:1;transition:transform 0.35s cubic-bezier(0.16,1,0.3,1)}
.lc-menu-cat.open .lc-cat-tog{transform:rotate(45deg)}
.lc-items-wrap{max-height:0;overflow:hidden;transition:max-height 0.55s cubic-bezier(0.16,1,0.3,1);background:var(--parch)}
.lc-menu-cat.open .lc-items-wrap{max-height:1400px}
.lc-item{display:flex;align-items:flex-start;justify-content:space-between;padding:20px 32px;border-top:1px solid rgba(201,144,106,0.1);opacity:0;transform:translateY(12px);transition:opacity 0.4s,transform 0.4s,border-left-color 0.25s,background 0.25s;border-left:3px solid transparent;position:relative;background:var(--parch)}
.lc-item:hover{background:rgba(201,144,106,0.04)}
.lc-item::before{content:'';position:absolute;left:35px;right:32px;bottom:0;height:1px;background:linear-gradient(to right,transparent,rgba(201,144,106,0.08),transparent)}
.lc-menu-cat.open .lc-item{opacity:1;transform:translateY(0)}
.lc-menu-cat.open .lc-item:nth-child(1){transition-delay:0.05s}
.lc-menu-cat.open .lc-item:nth-child(2){transition-delay:0.1s}
.lc-menu-cat.open .lc-item:nth-child(3){transition-delay:0.15s}
.lc-menu-cat.open .lc-item:nth-child(4){transition-delay:0.2s}
.lc-menu-cat.open .lc-item:nth-child(5){transition-delay:0.25s}
.lc-menu-cat.open .lc-item:nth-child(6){transition-delay:0.3s}
.lc-menu-cat.open .lc-item:nth-child(7){transition-delay:0.35s}
.lc-menu-cat.open .lc-item:nth-child(8){transition-delay:0.4s}
.lc-item:hover{border-left-color:var(--pri)}
.lc-item-left{flex:1;padding-right:20px}
.lc-item-name{font-family:Georgia,serif;color:var(--sec);margin-bottom:3px;font-size:1rem;transition:color 0.25s}
.lc-item:hover .lc-item-name{color:var(--pri)}
.lc-item-desc{color:var(--muted);font-size:0.84rem;line-height:1.65}
.lc-item-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0}
.lc-price{color:var(--pri);font-family:Georgia,serif;font-size:1rem;white-space:nowrap}
.lc-ar-btn{display:inline-flex;align-items:center;gap:5px;background:rgba(138,158,122,0.12);border:1px solid rgba(138,158,122,0.4);color:var(--acc);padding:5px 12px;border-radius:24px;font-size:0.68rem;letter-spacing:0.06em;transition:background 0.25s,color 0.25s;white-space:nowrap}
.lc-ar-btn:hover{background:var(--acc);color:#F7F0E6}
.lc-item-dimmed{opacity:0.35}

/* ── AR Modal */
.lc-ar-ov{position:fixed;inset:0;z-index:500;background:rgba(4,8,6,0.95);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity 0.3s}
.lc-ar-ov.open{opacity:1;pointer-events:auto}
.lc-ar-inner{background:#0D1A12;border:1px solid rgba(138,158,122,0.25);border-radius:16px;padding:40px;max-width:440px;width:90%;text-align:center}
.lc-ar-viewfinder{width:200px;height:200px;margin:0 auto 28px;position:relative;border-radius:12px;overflow:hidden;background:#060F09}
.lc-ar-corner{position:absolute;width:24px;height:24px;border-color:var(--acc);border-style:solid}
.lc-ar-corner.tl{top:10px;left:10px;border-width:2px 0 0 2px}
.lc-ar-corner.tr{top:10px;right:10px;border-width:2px 2px 0 0}
.lc-ar-corner.bl{bottom:10px;left:10px;border-width:0 0 2px 2px}
.lc-ar-corner.br{bottom:10px;right:10px;border-width:0 2px 2px 0}
.lc-ar-scan{position:absolute;left:0;right:0;height:2px;background:linear-gradient(to right,transparent,var(--acc),transparent);top:0}
@media(prefers-reduced-motion:no-preference){.lc-ar-scan{animation:arScan 2s ease-in-out infinite}}
@keyframes arScan{0%,100%{top:10px}50%{top:calc(100% - 12px)}}
.lc-ar-img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.8s}
.lc-ar-img.show{opacity:0.7}
.lc-ar-overlay{position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(138,158,122,0.15) 0%,transparent 70%)}
.lc-ar-title{color:#F7F0E6;font-family:Georgia,serif;margin-bottom:8px;font-size:1.15rem}
.lc-ar-status{color:var(--acc);font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:20px}
.lc-ar-tip{color:rgba(140,122,104,0.7);font-size:0.8rem;line-height:1.65;margin-bottom:24px}
.lc-ar-close{background:var(--acc);color:#F7F0E6;border:none;padding:11px 28px;border-radius:24px;font-size:0.85rem;transition:background 0.25s}
.lc-ar-close:hover{background:#7A8E6A}

/* ── Reserve Modal (FAB) - Enhanced Mobile UX */
.lc-res-ov{position:fixed;inset:0;z-index:500;background:rgba(10,7,4,0.6);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;pointer-events:none;transition:opacity 0.35s;display:flex;align-items:flex-end;justify-content:center;padding:0}
.lc-res-ov.open{opacity:1;pointer-events:auto}
.lc-res-panel{display:flex;width:100%;max-width:880px;max-height:92vh;border-radius:20px;overflow:hidden;background:#F7F0E6;transform:scale(0.92) translateY(24px);opacity:0;transition:transform 0.5s cubic-bezier(0.16,1,0.3,1),opacity 0.4s;box-shadow:0 32px 80px rgba(20,14,8,0.4),0 0 0 1px rgba(201,144,106,0.1)}
.lc-res-ov.open .lc-res-panel{transform:scale(1) translateY(0);opacity:1}
.lc-res-visual{position:relative;width:44%;min-height:560px;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end}
.lc-res-visual img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.lc-res-visual::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(20,14,8,0.88) 0%,rgba(20,14,8,0.2) 50%,transparent 100%)}
.lc-res-visual-body{position:relative;z-index:2;padding:32px 28px}
.lc-res-visual-tag{display:inline-block;border:1px solid rgba(201,144,106,0.5);color:var(--pri);padding:4px 14px;border-radius:24px;font-size:0.65rem;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:14px}
.lc-res-visual-title{color:#F7F0E6;font-family:Georgia,serif;font-size:1.5rem;line-height:1.2;margin-bottom:8px}
.lc-res-visual-sub{color:rgba(228,210,182,0.65);font-size:0.82rem;line-height:1.6}
.lc-res-form-side{flex:1;padding:36px 36px 32px;overflow-y:auto;position:relative}
.lc-res-bar{display:none;height:4px;width:40px;background:rgba(201,144,106,0.3);border-radius:2px;margin:0 auto 16px}
.lc-res-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px}
.lc-res-title{font-family:Georgia,serif;color:var(--sec);font-size:1.35rem;line-height:1.2}
.lc-res-x{background:rgba(44,42,36,0.06);border:none;color:var(--muted);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background 0.25s,color 0.25s;flex-shrink:0;cursor:pointer}
.lc-res-x:hover{background:rgba(44,42,36,0.12);color:var(--sec)}
.lc-res-x:active{transform:scale(0.95)}
.lc-res-subtitle{color:var(--muted);font-size:0.82rem;margin-bottom:28px;line-height:1.5}
.lc-res-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:0}
.lc-res-field{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.lc-res-field label{color:var(--muted);font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;font-weight:500}
.lc-res-input{background:rgba(44,42,36,0.04);border:1.5px solid rgba(201,144,106,0.18);border-radius:10px;padding:11px 14px;color:var(--sec);font-size:0.88rem;transition:border-color 0.3s,box-shadow 0.3s,background 0.3s;outline:none;width:100%}
.lc-res-input:focus{border-color:var(--pri);box-shadow:0 0 0 3px rgba(201,144,106,0.1);background:#fff}
.lc-res-input::placeholder{color:rgba(92,79,66,0.35)}
.lc-nooks{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
.lc-nook{background:rgba(44,42,36,0.03);border:1.5px solid rgba(201,144,106,0.15);border-radius:12px;padding:14px 12px;text-align:left;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);cursor:pointer}
.lc-nook:hover{background:rgba(201,144,106,0.06);border-color:rgba(201,144,106,0.35)}
.lc-nook.sel{border-color:var(--pri);background:rgba(201,144,106,0.08);box-shadow:0 0 0 3px rgba(201,144,106,0.1)}
.lc-nook:active{transform:scale(0.98)}
.lc-nook-ico{width:34px;height:34px;border-radius:10px;background:rgba(201,144,106,0.1);display:flex;align-items:center;justify-content:center;margin-bottom:8px;color:var(--pri);transition:background 0.3s,color 0.3s}
.lc-nook.sel .lc-nook-ico{background:var(--pri);color:#F7F0E6}
.lc-nook-name{color:var(--sec);font-size:0.84rem;margin-bottom:2px;font-weight:500}
.lc-nook-cap{color:var(--muted);font-size:0.7rem}
.lc-res-submit{width:100%;background:var(--sec);color:#F7F0E6;border:none;padding:14px;border-radius:12px;font-family:Georgia,serif;font-size:0.95rem;letter-spacing:0.04em;transition:all 0.3s;position:relative;overflow:hidden;cursor:pointer;font-weight:600}
.lc-res-submit:hover{background:#3D3930;box-shadow:0 8px 24px rgba(44,42,36,0.25);transform:translateY(-1px)}
.lc-res-submit:active{transform:translateY(0)}
.lc-res-confirm{text-align:center;padding:40px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:320px}
.lc-res-conf-title{color:var(--sec);font-family:Georgia,serif;margin-bottom:10px;font-size:1.2rem;margin-top:18px;font-weight:600}
.lc-res-conf-sub{color:var(--muted);font-size:0.88rem;line-height:1.7;max-width:380px}
@media(max-width:768px){.lc-res-visual{width:100%;min-height:200px;display:flex}.lc-res-panel{max-width:100%;border-radius:20px;flex-direction:column;max-height:95vh}.lc-res-form-side{padding:28px 24px 24px}}
@media(max-width:640px){.lc-res-visual{display:none;width:0;min-height:0}.lc-res-panel{border-radius:24px 24px 0 0;flex-direction:column;width:100%;max-height:90vh;position:absolute;bottom:0;left:0;right:0;transform:translateY(100%);opacity:0}.lc-res-ov.open .lc-res-panel{transform:translateY(0);opacity:1}.lc-res-form-side{padding:24px 20px 32px;max-height:calc(90vh - 80px);overflow-y:auto;-webkit-overflow-scrolling:touch}.lc-res-bar{display:flex;justify-content:center;margin-bottom:12px;height:5px;width:48px;background:rgba(201,144,106,0.25);border-radius:3px}.lc-res-head{margin-bottom:16px}.lc-res-title{font-size:1.2rem}.lc-res-subtitle{margin-bottom:20px;font-size:0.8rem}.lc-res-row{grid-template-columns:1fr;gap:12px}.lc-res-field{margin-bottom:12px}.lc-res-field label{font-size:0.68rem}.lc-res-input{padding:10px 12px;font-size:0.85rem;border-radius:8px}.lc-nooks{grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px}.lc-nook{padding:12px 10px;border-radius:10px}.lc-nook-ico{width:30px;height:30px;font-size:0.9rem}.lc-nook-name{font-size:0.8rem}.lc-nook-cap{font-size:0.65rem}.lc-res-submit{padding:12px;font-size:0.9rem;margin-bottom:12px}.lc-res-x{width:28px;height:28px}}

/* ── FAB */
.lc-fab{position:fixed;bottom:28px;right:28px;z-index:250;display:flex;flex-direction:column;align-items:flex-end;gap:10px}
.lc-fab-btn{background:var(--sec);color:#F7F0E6;border:none;border-radius:24px;padding:14px 22px;display:flex;align-items:center;gap:8px;font-size:0.82rem;letter-spacing:0.06em;box-shadow:0 8px 28px rgba(44,42,36,0.35);transition:background 0.3s,transform 0.3s,box-shadow 0.3s}
.lc-fab-btn:hover{background:#3D3930;transform:translateY(-2px);box-shadow:0 12px 36px rgba(44,42,36,0.45)}

/* ── Footer */
.lc-footer{background:var(--sec);padding:64px 64px 32px}
.lc-footer-grid{display:grid;grid-template-columns:1fr 1.2fr 1fr;gap:48px;margin-bottom:40px}
.lc-fh{color:#F7F0E6;margin-bottom:12px;font-size:0.95rem}
.lc-ft{color:#7A6858;line-height:1.85;font-size:0.85rem}
.lc-ft a{color:var(--pri);text-decoration:none}
.lc-hours-pill{display:inline-block;background:rgba(138,158,122,0.15);color:var(--acc);padding:3px 12px;border-radius:24px;font-size:0.73rem;letter-spacing:0.06em;margin-top:8px}
.lc-eco-line{display:flex;align-items:center;gap:7px;margin-top:14px;color:rgba(138,158,122,0.75);font-size:0.78rem;letter-spacing:0.04em}
.lc-insta{display:inline-flex;align-items:center;gap:8px;color:var(--pri);text-decoration:none;border:1px solid rgba(201,144,106,0.4);padding:8px 16px;border-radius:24px;font-size:0.78rem;letter-spacing:0.06em;margin-top:12px;transition:background 0.3s,color 0.3s}
.lc-insta:hover{background:var(--pri);color:#F7F0E6}
.lc-footer-bar{border-top:1px solid rgba(201,144,106,0.12);padding-top:20px;display:flex;justify-content:space-between;align-items:center;color:rgba(122,104,88,0.5);font-size:0.73rem;letter-spacing:0.04em}
.lc-footer-logo{font-family:Georgia,serif;color:rgba(122,104,88,0.65);font-size:0.95rem}
.lc-footer-logo em{color:rgba(201,144,106,0.65);font-style:normal}
.lc-divider{height:1px;background:linear-gradient(to right,transparent,rgba(201,144,106,0.3),transparent)}

/* ── Responsive */
@media(max-width:1024px){
  .lc-bento-grid{grid-template-columns:1fr}
  .lc-bento-main{min-height:340px}
  .lc-bento-row2{grid-template-columns:1fr 1fr}
  .lc-find-inner{grid-template-columns:1fr;gap:40px}
}
@media(max-width:900px){
  .lc-feats{grid-template-columns:1fr 1fr}
  .lc-footer-grid{grid-template-columns:1fr 1fr;gap:32px}
}
@media(max-width:640px){
  .lc-nav{padding:0 18px}
  .lc-sec{padding:56px 18px}
  .lc-hero-content{padding:0 20px}
  .lc-scroll-hint{bottom:18px}
  .lc-kota{padding:28px 22px}
  .lc-kota-title{font-size:0.95rem}
  .lc-quote-text{font-size:clamp(1.2rem,5vw,1.6rem)}
  .lc-fab{bottom:20px;right:16px}
  .lc-fab-btn{padding:12px 18px;font-size:0.78rem;border-radius:20px}
  .lc-feats{grid-template-columns:1fr}
  .lc-menu-hero{padding:100px 20px 48px}
  .lc-menu-body{padding:32px 16px 60px}
  .lc-quote{padding:72px 24px}
  .lc-menu-cat{margin-bottom:12px;border-radius:12px;box-shadow:0 2px 8px rgba(201,144,106,0.08)}
  .lc-cat-hdr{padding:18px 18px;background:linear-gradient(135deg,var(--surf),#EFE5D8)}
  .lc-cat-name{font-size:0.96rem}
  .lc-item{padding:16px 18px;flex-wrap:wrap;gap:12px;border-left-width:4px}
  .lc-item-name{font-size:0.98rem;font-weight:500}
  .lc-item-desc{font-size:0.8rem}
  .lc-price{font-size:0.92rem}
  .lc-footer{padding:48px 20px 24px}
  .lc-footer-grid{grid-template-columns:1fr;gap:28px}
  .lc-footer-bar{flex-direction:column;text-align:center;gap:12px}
  .lc-touch-head{padding:0 20px}
  .lc-touch-scroll{padding:8px 20px 28px}
  .lc-bento{padding:64px 20px}
  .lc-bento-grid{grid-template-columns:1fr}
  .lc-bento-main{min-height:240px}
  .lc-bento-row2{grid-template-columns:1fr;gap:12px}
  .lc-bento-row2 .lc-bento-img{height:200px}
  .lc-bento-quote-text{font-size:1rem;line-height:1.4}
  .lc-res-panel{padding:28px 22px 32px;max-width:480px;border-radius:20px}
  .lc-res-bar{display:flex;justify-content:center;margin-bottom:16px}
  .lc-res-row{grid-template-columns:1fr}
  .lc-nooks{grid-template-columns:1fr 1fr}
}
@media(max-width:480px){
  .lc-res-ov{padding:0}
  .lc-res-panel{max-width:100%;border-radius:20px 20px 0 0;position:absolute;bottom:0;max-height:95vh;flex-direction:column}
  .lc-res-form-side{padding:20px 18px 28px;max-height:calc(95vh - 100px);overflow-y:auto}
  .lc-res-bar{margin-bottom:12px}
  .lc-res-head{margin-bottom:14px}
  .lc-res-title{font-size:1.1rem}
  .lc-res-input{padding:10px 12px;font-size:0.85rem}
  .lc-res-field{margin-bottom:12px}
  .lc-nook{padding:12px 10px}
  .lc-nook-ico{width:30px;height:30px}
  .lc-res-submit{padding:12px;font-size:0.9rem}
  .lc-find{padding:64px 20px}
  .lc-find-inner{grid-template-columns:1fr;gap:40px}
  .lc-find-heading{text-align:center;font-size:clamp(1.5rem,4vw,2rem)}
  .lc-find-sub{text-align:center}
  .lc-find-detail{margin-bottom:20px}
  .lc-find-btn{display:flex;justify-content:center;width:100%;padding:10px 16px;font-size:0.75rem}
  .lc-tilt{width:280px;height:240px}
  .lc-tilt-marq-outer{padding:32px 0}
  .lc-tilt-marq-track{animation:tiltMarq 45s linear infinite}
  .lc-tex-card{width:280px;height:400px}
  .lc-tex-card.premium{width:300px}
  .lc-food-track{padding:8px 20px 8px;gap:14px}
  .lc-time-filter{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;padding-bottom:4px}
  .lc-time-filter::-webkit-scrollbar{display:none}
  .lc-tf-btn{flex-shrink:0}
  .lc-res-form-side{padding:28px 24px 24px}
  .lc-res-visual{display:none}
  .lc-hero{min-height:92vh}
  .lc-cta{border-radius:16px;width:100%;max-width:100%}
}
`;

// ─── IMAGE OPTIMIZATION ───────────────────────────────────────────────────────
// Unsplash CDN: switch to WebP, reduce quality, resize per use-case
const uspl = (url: string, w = 480) => url.replace(/fm=jpg/,'fm=webp').replace(/q=80/,'q=70').replace(/w=1080/,`w=${w}`);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const FOOD_IMG_CHAI = uspl('https://images.unsplash.com/photo-1759782177037-ea0b0879fb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYXNhbGElMjBjaGFpJTIwc3BpY2VkJTIwdGVhfGVufDF8fHx8MTc3NjcwMTkxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_IMG_THALI = uspl('https://images.unsplash.com/photo-1546833999-b9f581a1996d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB0aGFsaSUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc3NjcwMTkxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 640);
const FOOD_IMG_TIKKA = uspl('https://images.unsplash.com/photo-1775717427684-75b886ebbfc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYW5lZXIlMjB0aWtrYSUyMGluZGlhbiUyMGFwcGV0aXplcnxlbnwxfHx8fDE3NzY3MDE5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_IMG_SAMOSA = uspl('https://images.unsplash.com/photo-1732519970445-8f2d6998961f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW1vc2ElMjBjaGFhdCUyMGluZGlhbiUyMHN0cmVldCUyMGZvb2R8ZW58MXx8fHwxNzc2NzAxOTE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_IMG_LASSI = uspl('https://images.unsplash.com/photo-1619898804188-e7bad4bd2127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nbyUyMGxhc3NpJTIwaW5kaWFuJTIwZHJpbmt8ZW58MXx8fHwxNzc2NzAxOTE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_IMG_PLATING = uspl('https://images.unsplash.com/photo-1723744910096-4d797bb52cae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjYWZlJTIwZm9vZCUyMHBsYXRpbmclMjBydXN0aWN8ZW58MXx8fHwxNzc2NzAxOTE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_IMG_DESSERT = uspl('https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBkZXNzZXJ0JTIwZ3VsYWIlMjBqYW11biUyMHN3ZWV0fGVufDF8fHx8MTc3NjcwMjQ2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_IMG_ROSE = uspl('https://images.unsplash.com/photo-1707449317252-98ea29c484f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3NlJTIwbGVtb25hZGUlMjByZWZyZXNoaW5nJTIwc3VtbWVyJTIwZHJpbmt8ZW58MXx8fHwxNzc2NzAyNDY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_IMG_CAFE_INT = uspl('https://images.unsplash.com/photo-1751956066306-c5684cbcf385?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjYWZlJTIwaW50ZXJpb3IlMjB3YXJtJTIwbGlnaHRpbmclMjBjb3p5fGVufDF8fHx8MTc3NjcwMjQ2M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 640);

type MenuItem = { name:string; desc:string; price:string; times:string[]; ar?:boolean };
const MENU: { id:string; label:string; items:MenuItem[] }[] = [
  { id:'hot', label:'Hot Beverages', items:[
    { name:'Masala Chai',        desc:'Slow-simmered spiced tea with ginger, cardamom, tulsi and whole milk',      price:'₹80',  times:['all','morning','afternoon','evening'] },
    { name:'Filter Coffee',      desc:'South Indian drip brew poured in a traditional brass tumbler',              price:'₹90',  times:['all','morning','afternoon'] },
    { name:'Kahwa',              desc:'Kashmiri green tea with saffron, crushed almonds and whole spices',          price:'₹120', times:['all','morning','golden','evening'] },
    { name:'Turmeric Latte',     desc:'Golden milk with ashwagandha, black pepper and raw honey',                  price:'₹110', times:['all','morning','golden'] },
    { name:'Bombay Cutting Chai',desc:'Strong, sweet half-cup chai — the way street vendors serve it',             price:'₹60',  times:['all','morning','afternoon','evening'] },
  ]},
  { id:'cold', label:'Cold Beverages', items:[
    { name:'Kokum Cooler',    desc:'Tangy kokum shrub with sparkling water, kala namak and a twist of lime',   price:'₹110', times:['all','afternoon','golden'] },
    { name:'Rose Nimbu Paani',desc:'Fresh lemonade with house-made rose syrup, sabja seeds and dried petals', price:'₹100', times:['all','morning','afternoon'] },
    { name:'Mango Lassi',     desc:'Thick-blended Alphonso mango with hung curd and a cardamom whisper',      price:'₹140', times:['all','afternoon','golden','evening'] },
    { name:'Aam Panna Slush', desc:'Raw mango slush with cumin, mint and a roasted black salt rim',           price:'₹120', times:['all','afternoon'] },
  ]},
  { id:'snacks', label:'Snacks & Bites', items:[
    { name:'Samosa Chaat',       desc:'Crispy potato samosa with tamarind chutney, whipped yogurt and sev',    price:'₹120', times:['all','afternoon','evening'] },
    { name:'Paneer Tikka Toast', desc:'Grilled spiced paneer, chilli-garlic mayo on charred sourdough',      price:'₹160', times:['all','morning','afternoon'] },
    { name:'Bhel Puri Bowl',     desc:'Puffed rice, raw mango, pomegranate and tamarind drizzle',              price:'₹110', times:['all','afternoon','golden'] },
    { name:'Dahi Wala Sandwich', desc:'Cucumber, green chutney and spiced hung curd on multigrain bread',      price:'₹140', times:['all','morning','afternoon'] },
    { name:'Poha Croquettes',    desc:'Crisp pressed-rice patties with potato-herb filling and chutney dip',   price:'₹130', times:['all','morning','golden'] },
  ]},
  { id:'sig', label:'Signature Dishes', items:[
    { name:'Raipur Heritage Thali',   desc:'Dal bafla, checheli ki sabzi, rice, chaas and pickle assortment',        price:'₹280', times:['all','afternoon','evening'], ar:true },
    { name:'Laal Maas Wrap',          desc:'Slow-cooked Rajasthani lamb, pickled onions and mint raita in laccha paratha', price:'₹220', times:['all','golden','evening'], ar:true },
    { name:'Wild Mushroom Toast',     desc:'Foraged mushrooms in garlic-herb butter on charred village bread',         price:'₹190', times:['all','morning','golden'] },
    { name:'Stuffed Bell Pepper',     desc:'Roasted pepper with quinoa, paneer, sundried tomato and chimichurri',        price:'₹175', times:['all','afternoon','golden'], ar:true },
    { name:'Chhattisgarhi Poha Platter',desc:'Flattened rice with mustard, curry leaf, peanuts and seasonal sides',   price:'₹150', times:['all','morning','afternoon'] },
  ]},
];

// ─── Lazy Image with blur-up ──────────────────────────────────────────────────
function OptImg({ src, alt, className = '', ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.complete && el.naturalWidth) { el.classList.add('loaded'); return; }
    const onLoad = () => el.classList.add('loaded');
    el.addEventListener('load', onLoad);
    return () => el.removeEventListener('load', onLoad);
  }, []);
  return <img ref={ref} src={src} alt={alt || ''} className={`lc-opt-img ${className}`} loading="lazy" decoding="async" {...rest} />;
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IconCoffee = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
  </svg>
);
const IconGlass = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 2h8l-1 7H9L8 2z"/><path d="M9 9c0 5 6 5 6 10v2H9v-2c0-5 6-5 6-10"/>
  </svg>
);
const IconPlate = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>
    <path d="M9 3.6C7 5 5 7.5 5 10"/><path d="M3.6 9A9 9 0 003 12"/>
  </svg>
);
const IconStar = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconMapPin = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconClock = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconPhone = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01.07 1.18 2 2 0 012.07 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
  </svg>
);
const IconNavigation = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);
const IconLeaf = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 20A7 7 0 014 13c0-7 7-11 7-11s7 4 7 11a7 7 0 01-7 7z"/><path d="M11 20V9"/>
  </svg>
);

const CAT_ICONS: Record<string, React.ReactNode> = {
  hot: <IconCoffee size={16} />,
  cold: <IconGlass size={16} />,
  snacks: <IconPlate size={16} />,
  sig: <IconStar size={16} />,
};

// ─── CANVAS ───────────────────────────────────────────────────────────────────
function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let raf: number; let last = 0;
    const interval = 1000 / 60;
    const resize = () => { canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    const bgImg = new Image(); bgImg.src = img4; let imgLoaded = false;
    bgImg.onload = () => { imgLoaded = true; };
    type P = { x:number; y:number; r:number; vx:number; vy:number; o:number; od:number };
    const pts: P[] = Array.from({ length: 55 }, () => ({
      x: Math.random() * 1200, y: Math.random() * 800,
      r: Math.random() * 2.2 + 0.5,
      vx: (Math.random() - 0.5) * 0.32, vy: -(Math.random() * 0.45 + 0.15),
      o: Math.random() * 0.4 + 0.08, od: Math.random() > 0.5 ? 1 : -1,
    }));
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden) return;
      const d = t - last; if (d < interval) return;
      last = t - (d % interval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (imgLoaded) {
        const s = Math.max(canvas.width / bgImg.naturalWidth, canvas.height / bgImg.naturalHeight);
        const sw = bgImg.naturalWidth * s, sh = bgImg.naturalHeight * s;
        ctx.globalAlpha = 0.5;
        ctx.drawImage(bgImg, (canvas.width - sw) / 2, (canvas.height - sh) / 2, sw, sh);
        ctx.globalAlpha = 1;
      }
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.o += p.od * 0.0022;
        if (p.o > 0.52) p.od = -1; if (p.o < 0.06) p.od = 1;
        if (p.y < -8) { p.y = canvas.height + 8; p.x = Math.random() * canvas.width; }
        if (p.x < -8) p.x = canvas.width + 8; if (p.x > canvas.width + 8) p.x = -8;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.8);
        g.addColorStop(0, `rgba(255,225,160,${p.o})`);
        g.addColorStop(1, 'rgba(255,225,160,0)');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      });
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'absolute',inset:0,zIndex:3,pointerEvents:'none',width:'100%',height:'100%' }} />;
}

// ─── ANIMATED HEADLINE ───────────────────────────────────────────────────────
function AnimHead({ line1, line2 }: { line1: string; line2: string }) {
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), 280); return () => clearTimeout(t); }, []);
  let wi = 0;
  return (
    <h1 className="lc-headline" style={{ fontSize: 'clamp(2.1rem,5.5vw,4.4rem)' }}>
      {[line1, line2].map((line, li) => (
        <div key={li} className="lc-hrow" style={{ marginBottom: li === 0 ? '4px' : 0 }}>
          {line.split(' ').map(w => {
            const i = wi++;
            return <span key={i} className={`lc-word${go ? ' go' : ''}`} style={{ animationDelay: `${i * 0.13}s` }}>{w}</span>;
          })}
        </div>
      ))}
    </h1>
  );
}

// ─── FEATURE CARD (Kota micro-interaction) ───────────────────────────────────
function KotaCard({ icon, title, desc, delay, bgImg }: { icon: React.ReactNode; title:string; desc:string; delay:number; bgImg?:string | any }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  const bgUrl = bgImg ? (typeof bgImg === 'string' ? bgImg : bgImg) : undefined;
  return (
    <div ref={ref} className={`lc-kota lc-fi${bgImg ? ' has-bg' : ''}`} style={{ transitionDelay: `${delay}s`, ...(bgUrl ? { '--bg-img': `url(${bgUrl})` } as React.CSSProperties : {}) }} onMouseMove={onMove}>
      <style>{`
        .lc-kota[style*="--bg-img"]::after {
          background-image: var(--bg-img);
        }
      `}</style>
      <div className="lc-kota-icon" aria-hidden="true">{icon}</div>
      <h3 className="lc-kota-title">{title}</h3>
      <p className="lc-kota-desc">{desc}</p>
    </div>
  );
}

// ─── FROM OUR KITCHEN ─────────────────────────────────────────────────────────
const FOOD_IMG_COFFEE = uspl('https://images.unsplash.com/photo-1758387941825-a6ecaec9c14d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWx0ZXIlMjBjb2ZmZWUlMjBicmFzcyUyMHR1bWJsZXIlMjBpbmRpYW4lMjBjYWZlfGVufDF8fHx8MTc3NjcwMzQ1NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_IMG_TURMERIC = uspl('https://images.unsplash.com/photo-1721738777979-74656018fd1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMGxhdHRlJTIwZ29sZGVuJTIwbWlsayUyMGNhZmV8ZW58MXx8fHwxNzc2NzAzNDU1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_IMG_COOLER = uspl('https://images.unsplash.com/photo-1764403713680-9dc25c63a292?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VkJTIwbGVtb24lMjBzb2RhJTIwcmVmcmVzaGluZyUyMGRyaW5rJTIwbWludHxlbnwxfHx8fDE3NzY3MDM0NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral');
const FOOD_CARDS: { img: string; tag: string; title: string; desc: string; premium?: boolean }[] = [
  { img: FOOD_IMG_CHAI, tag:'Signature', title:'Masala Chai', desc:'Slow-simmered with ginger, cardamom and tulsi — the soul of Lambreta in every cup.' },
  { img: FOOD_IMG_COFFEE, tag:'Brewed', title:'Filter Coffee', desc:'South Indian drip brew poured in a traditional brass tumbler — bold, aromatic, no shortcuts.' },
  { img: FOOD_IMG_DESSERT, tag:'Sweet', title:'Gulab Jamun', desc:'Golden-fried milk dumplings soaked in rose-cardamom syrup — served warm, melts on your tongue.' },
  { img: FOOD_IMG_TIKKA, tag:'Grilled', title:'Paneer Tikka Toast', desc:'Charred sourdough topped with spiced paneer and chilli-garlic mayo — smoky, bold, unforgettable.' },
  { img: FOOD_IMG_TURMERIC, tag:'Wellness', title:'Turmeric Latte', desc:'Golden milk with ashwagandha, black pepper and raw honey — warmth in every sip.' },
  { img: FOOD_IMG_ROSE, tag:'Refreshing', title:'Rose Nimbu Paani', desc:'Fresh lemon, rose syrup and a pinch of kala namak — our Raipur twist on the classic cooler.' },
  { img: FOOD_IMG_SAMOSA, tag:'Street', title:'Samosa Chaat', desc:'Crispy samosa crumbled over yogurt, tamarind chutney and pomegranate — street food, elevated.' },
  { img: FOOD_IMG_LASSI, tag:'Cool', title:'Mango Lassi', desc:'Thick-blended Alphonso mango with hung curd and a whisper of cardamom — summer in a glass.' },
  { img: FOOD_IMG_COOLER, tag:'Chilled', title:'Kokum Cooler', desc:'Tangy kokum shrub with sparkling water, kala namak and a twist of lime — pure refreshment.' },
  { img: FOOD_IMG_PLATING, tag:'Crafted', title:'Wild Mushroom Toast', desc:'Foraged mushrooms in garlic-herb butter on charred village bread — earthy and satisfying.' },
  { img: FOOD_IMG_THALI, tag:'Heritage', title:'Raipur Heritage Thali', desc:'Dal bafla, checheli ki sabzi, rice, chaas and pickles — a full Chhattisgarhi meal on one plate.', premium: true },
];

function FromOurKitchen({ onExplore }: { onExplore: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDrag = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);

  // Compute card width + gap dynamically
  const getCardWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || !track.children[0]) return 340;
    const card = track.children[0] as HTMLElement;
    return card.offsetWidth + 20; // card width + gap
  }, []);

  const scrollToIdx = useCallback((idx: number, smooth = true) => {
    const track = trackRef.current;
    if (!track) return;
    const cw = getCardWidth();
    const targetScroll = idx * cw;
    track.scrollTo({ left: targetScroll, behavior: smooth ? 'smooth' : 'auto' });
  }, [getCardWidth]);

  // Auto-scroll
  useEffect(() => {
    const start = () => {
      autoRef.current = setInterval(() => {
        setActiveIdx(prev => {
          const next = (prev + 1) % FOOD_CARDS.length;
          scrollToIdx(next);
          return next;
        });
      }, 3500);
    };
    start();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [scrollToIdx]);

  const pauseAuto = useCallback(() => {
    if (autoRef.current) { clearInterval(autoRef.current); autoRef.current = null; }
  }, []);

  const resumeAuto = useCallback(() => {
    pauseAuto();
    autoRef.current = setInterval(() => {
      setActiveIdx(prev => {
        const next = (prev + 1) % FOOD_CARDS.length;
        scrollToIdx(next);
        return next;
      });
    }, 3500);
  }, [pauseAuto, scrollToIdx]);

  // Track scroll position to update dots
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const cw = getCardWidth();
        const idx = Math.round(track.scrollLeft / cw);
        setActiveIdx(Math.min(idx, FOOD_CARDS.length - 1));
        ticking = false;
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => track.removeEventListener('scroll', onScroll);
  }, [getCardWidth]);

  // Mouse drag for desktop
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDrag.current = true;
    startX.current = e.clientX;
    scrollStart.current = trackRef.current?.scrollLeft || 0;
    pauseAuto();
  }, [pauseAuto]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrag.current || !trackRef.current) return;
    e.preventDefault();
    const dx = e.clientX - startX.current;
    trackRef.current.scrollLeft = scrollStart.current - dx;
  }, []);

  const onMouseUp = useCallback(() => {
    if (!isDrag.current) return;
    isDrag.current = false;
    // Snap to nearest
    const track = trackRef.current;
    if (track) {
      const cw = getCardWidth();
      const idx = Math.round(track.scrollLeft / cw);
      scrollToIdx(idx);
    }
    setTimeout(resumeAuto, 2000);
  }, [getCardWidth, scrollToIdx, resumeAuto]);

  // Touch pause/resume
  const onTouchStart = useCallback(() => pauseAuto(), [pauseAuto]);
  const onTouchEnd = useCallback(() => { setTimeout(resumeAuto, 2000); }, [resumeAuto]);

  const goToDot = useCallback((idx: number) => {
    setActiveIdx(idx);
    scrollToIdx(idx);
    pauseAuto();
    setTimeout(resumeAuto, 3000);
  }, [scrollToIdx, pauseAuto, resumeAuto]);

  return (
    <section className="lc-touch-sec">
      <div className="lc-touch-head">
        <p className="lc-eyebrow" style={{ color: 'rgba(201,144,106,0.8)' }}>From Our Kitchen</p>
        <h2 style={{ color: '#F7F0E6', fontSize: 'clamp(1.75rem,3.2vw,2.5rem)', maxWidth: '520px' }}>What we're known for</h2>
      </div>
      <div
        ref={trackRef}
        className="lc-food-track"
        role="list"
        aria-label="Signature dishes from Lambreta Café"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {FOOD_CARDS.map((t, i) => (
          <div key={t.title} className={`lc-tex-card${t.premium ? ' premium' : ''}`} role="listitem" style={{ userSelect: 'none' }}>
            <OptImg src={t.img} alt={t.title} className="lc-tex-img" loading={i < 3 ? 'eager' : 'lazy'} draggable={false} />
            <div className="lc-tex-grad" />
            <div className="lc-tex-body">
              <span className="lc-tex-tag">{t.tag}</span>
              <h3 className="lc-tex-title">{t.title}</h3>
              <p className="lc-tex-desc">{t.desc}</p>
              {t.premium && (
                <div className="lc-tex-premium-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  Chef's Pride
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="lc-food-dots" role="tablist" aria-label="Carousel navigation">
        {FOOD_CARDS.map((_, i) => (
          <button
            key={i}
            className={`lc-food-dot${activeIdx === i ? ' active' : ''}`}
            onClick={() => goToDot(i)}
            aria-label={`Go to dish ${i + 1}`}
            aria-selected={activeIdx === i}
            role="tab"
          />
        ))}
      </div>
      <div style={{ textAlign: 'center', paddingTop: '32px' }}>
        <button
          onClick={onExplore}
          style={{
            background: 'var(--pri)',
            color: '#F7F0E6',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '20px',
            fontFamily: 'Georgia,serif',
            fontSize: '0.9rem',
            letterSpacing: '0.04em',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 6px 20px rgba(201,144,106,0.25)',
            fontWeight: '600'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#D4A07A';
            e.currentTarget.style.boxShadow = '0 10px 28px rgba(201,144,106,0.4)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--pri)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(201,144,106,0.25)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          aria-label="View all menu items"
        >
          View All Items
        </button>
      </div>
    </section>
  );
}

// ─── MENU CTA SECTION ─────────────────────────────────────────────────────────

const TILT_DATA = [
  { tag: 'Ambience', title: 'Earthy Ambience', desc: 'A space that breathes and calms — built to make you slow down.', image: img1, tint: '#5C2E10' },
  { tag: 'Character', title: 'Rooted in Raipur', desc: 'Crafted from the land beneath our feet. Every surface has a story.', image: img2, tint: '#2A3A28' },
  { tag: 'Comfort', title: 'Handcrafted Comfort', desc: 'Every chair tells a story — woven by Bastar artisans by hand.', image: img3, tint: '#3E2A14' },
];

function TiltCard({ tag, title, desc, image, tint }: { tag:string; title:string; desc:string; image:string; tint:string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = 'transform 0.08s ease,box-shadow 0.3s';
    el.style.transform = `perspective(700px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) translateZ(12px)`;
  }, []);
  const onLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transition = 'transform 0.55s cubic-bezier(0.16,1,0.3,1),box-shadow 0.3s';
    el.style.transform = '';
  }, []);
  return (
    <div ref={ref} className="lc-tilt" onMouseMove={onMove} onMouseLeave={onLeave}>
      <OptImg src={image} alt={title} className="lc-tilt-bg" />
      <div className="lc-tilt-tint" style={{ background: tint, mixBlendMode: 'multiply', opacity: 0.3 }} />
      <div className="lc-tilt-grad" />
      <div className="lc-tilt-body">
        <span className="lc-tilt-tag">{tag}</span>
        <h3 className="lc-tilt-title">{title}</h3>
        <p className="lc-tilt-desc">{desc}</p>
      </div>
    </div>
  );
}

function TiltMarquee() {
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    if (!isMobile || !trackRef.current) return;
    
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const track = trackRef.current;
        if (!track) return;
        const itemWidth = track.children[0]?.getBoundingClientRect().width || 0;
        const gap = 16;
        const idx = Math.round((track.scrollLeft + itemWidth / 2) / (itemWidth + gap));
        setActiveIdx(Math.min(idx, TILT_DATA.length - 1));
        ticking = false;
      });
    };

    trackRef.current.addEventListener('scroll', onScroll, { passive: true });
    return () => trackRef.current?.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  const doubled = isMobile ? TILT_DATA : [...TILT_DATA, ...TILT_DATA, ...TILT_DATA, ...TILT_DATA];
  
  return (
    <>
      <div className="lc-tilt-marq-outer" ref={trackRef} role="region" aria-label="Rooted in Raipur showcase">
        <div className="lc-tilt-marq-track">
          {doubled.map((c, i) => <TiltCard key={i} {...c} />)}
        </div>
      </div>
      {isMobile && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', paddingTop: '16px', background: 'var(--surf)' }}>
          {TILT_DATA.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (trackRef.current && trackRef.current.children[i]) {
                  trackRef.current.children[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }
              }}
              style={{
                width: activeIdx === i ? '24px' : '8px',
                height: '8px',
                background: activeIdx === i ? 'var(--pri)' : 'rgba(201,144,106,0.25)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                padding: 0
              }}
              aria-label={`View card ${i + 1}`}
              aria-pressed={activeIdx === i}
            />
          ))}
        </div>
      )}
    </>
  );
}


// ─── LEAFLET MAP ──────────────────────────────────────────────────────────────
function CafeMap() {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapObjRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapDivRef.current || mapObjRef.current) return;

    // Custom terracotta pin SVG
    const pin = L.divIcon({
      className: '',
      html: `<svg width="36" height="50" viewBox="0 0 36 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 0C8.06 0 0 8.06 0 18c0 12.73 18 32 18 32S36 30.73 36 18C36 8.06 27.94 0 18 0z" fill="#C9906A"/>
        <circle cx="18" cy="18" r="9" fill="#F7F0E6"/>
        <circle cx="18" cy="18" r="5" fill="#C9906A"/>
      </svg>`,
      iconSize: [36, 50],
      iconAnchor: [18, 50],
      popupAnchor: [0, -54],
    });

    const map = L.map(mapDivRef.current, {
      center: [21.2514, 81.6296],
      zoom: 15,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    L.marker([21.2514, 81.6296], { icon: pin })
      .addTo(map)
      .bindPopup(
        `<div style="font-family:Georgia,serif;padding:6px 4px 2px;min-width:160px">
          <strong style="font-size:0.95rem;color:#F7F0E6">Lambreta Caf\u00e9</strong><br>
          <span style="color:rgba(228,210,182,0.8);font-size:0.8rem;font-family:system-ui,sans-serif">Civil Lines, Raipur, CG</span>
        </div>`
      )
      .openPopup();

    mapObjRef.current = map;

    return () => {
      if (mapObjRef.current) {
        mapObjRef.current.remove();
        mapObjRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapDivRef}
      style={{ width: '100%', height: '400px', borderRadius: '12px', zIndex: 1 }}
      className="lc-map"
      role="application"
      aria-label="Interactive map showing Lambreta Café location in Civil Lines, Raipur"
    />
  );
}

// ─── COME FIND US SECTION ─────────────────────────────────────────────────────
function FindUsSection({ goMenu, onContact }: { goMenu: () => void; onContact: () => void }) {
  return (
    <section className="lc-find">
      <div className="lc-find-inner">
        <div className="lc-find-info lc-fi">
          <p className="lc-eyebrow">We're easy to find</p>
          <h2 className="lc-find-heading">Come find us</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '20px' }}>Walk in for a masala chai, stay for the heritage thali. No reservations needed — but if you want your favourite nook, send us a booking request.</p>
          <span className="lc-find-accent" />
          <div className="lc-find-detail">
            <div className="lc-find-row">
              <div className="lc-find-ico" aria-hidden="true"><IconMapPin /></div>
              <div>
                <p className="lc-find-label">Address</p>
                <p className="lc-find-val">Civil Lines, Raipur<br />Chhattisgarh — 492 001, India</p>
              </div>
            </div>
            <div className="lc-find-row">
              <div className="lc-find-ico" aria-hidden="true"><IconClock /></div>
              <div>
                <p className="lc-find-label">Hours</p>
                <p className="lc-find-val">Monday – Sunday<br />9:00 AM – 10:00 PM</p>
              </div>
            </div>
            <div className="lc-find-row">
              <div className="lc-find-ico" aria-hidden="true"><IconPhone /></div>
              <div>
                <p className="lc-find-label">Phone</p>
                <p className="lc-find-val">+91 XXXXX XXXXX</p>
              </div>
            </div>
          </div>
          <a
            href="https://www.google.com/maps/search/Civil+Lines+Raipur+Cafe/@21.2514,81.6296,15z"
            target="_blank"
            rel="noopener noreferrer"
            className="lc-find-btn"
            aria-label="Get directions to Lambreta Café on Google Maps"
          >
            <IconNavigation />
            Get Directions
          </a>
          <button onClick={onContact} className="lc-find-btn" style={{ background: 'var(--pri)', color: '#F7F0E6', marginTop: '20px', marginLeft: '0' }} aria-label="Contact us and request a booking">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            Contact Us
          </button>
        </div>
        <div className="lc-fi" style={{ transitionDelay: '0.15s' }}>
          <div className="lc-find-map-wrap">
            <CafeMap />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AR MODAL ────────────────────────────────────────────────────────────────
function ARModal({ item, img: arImg, onClose }: { item: string; img: string; onClose: () => void }) {
  const [phase, setPhase] = useState<'scan' | 'ready'>('scan');
  useEffect(() => {
    if (!item) return;
    setPhase('scan');
    const t = setTimeout(() => setPhase('ready'), 1800);
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    return () => { clearTimeout(t); document.removeEventListener('keydown', k); };
  }, [item, onClose]);
  return (
    <div className={`lc-ar-ov${item ? ' open' : ''}`} onClick={onClose} role="dialog" aria-modal="true" aria-label="AR preview">
      <div className="lc-ar-inner" onClick={e => e.stopPropagation()}>
        <div className="lc-ar-viewfinder" aria-hidden="true">
          <img src={arImg} alt="" className={`lc-ar-img${phase === 'ready' ? ' show' : ''}`} decoding="async" />
          <div className="lc-ar-overlay" />
          <div className="lc-ar-corner tl" /><div className="lc-ar-corner tr" />
          <div className="lc-ar-corner bl" /><div className="lc-ar-corner br" />
          <div className="lc-ar-scan" />
        </div>
        <h3 className="lc-ar-title">{item}</h3>
        <p className="lc-ar-status">
          {phase === 'scan' ? (
            <span style={{ display:'inline-flex',alignItems:'center',gap:6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
              Scanning surface…
            </span>
          ) : (
            <span style={{ display:'inline-flex',alignItems:'center',gap:6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              AR Preview Ready
            </span>
          )}
        </p>
        <p className="lc-ar-tip">
          {phase === 'scan'
            ? 'Point your camera at a flat table surface to see this dish appear in your space.'
            : 'In the Lambreta app, this dish would appear life-size on your table. Download the app for full AR experience.'}
        </p>
        <button className="lc-ar-close" onClick={onClose}>Close Preview</button>
      </div>
    </div>
  );
}

// ─── RESERVE MODAL ───────────────────────────────────────────────────────────
const NookIcon = ({ type }: { type: string }) => {
  const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (type === 'win') return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="12" y1="3" x2="12" y2="21"/></svg>;
  if (type === 'gar') return <svg {...props}><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><path d="M12 8v8"/><path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4"/></svg>;
  if (type === 'lib') return <svg {...props}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
  return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v3"/></svg>;
};
const NOOKS = [
  { id:'win', name:'The Window', cap:'Warm light · 2 seats' },
  { id:'gar', name:'Garden Corner', cap:'Natural shade · 2–4 seats' },
  { id:'lib', name:'Library Nook', cap:'Quiet · 1–2 seats' },
  { id:'lng', name:'Long Table', cap:'Communal · 4–8 seats' },
];
function ReserveModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [nook, setNook] = useState('win');
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', time: '10:00', size: '2', phone: '' });
  const handle = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); setDone(true); };
  useEffect(() => { if (!open) { setTimeout(() => setDone(false), 500); } }, [open]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [onClose]);
  const times = Array.from({ length: 26 }, (_, i) => {
    const h = Math.floor(i / 2) + 9; const m = i % 2 === 0 ? '00' : '30';
    if (h >= 22) return null;
    return `${String(h).padStart(2, '0')}:${m}`;
  }).filter(Boolean);
  return (
    <div className={`lc-res-ov${open ? ' open' : ''}`} onClick={onClose} role="dialog" aria-modal="true" aria-label="Request for Booking">
      <div className="lc-res-panel" onClick={e => e.stopPropagation()}>
        <div className="lc-res-visual">
          <OptImg src={img8} alt="Lambreta Caf\u00e9 interior" />
          <div className="lc-res-visual-body">
            <span className="lc-res-visual-tag">Civil Lines, Raipur</span>
            <h3 className="lc-res-visual-title">Your table awaits at Lambreta</h3>
            <p className="lc-res-visual-sub">Pick your favourite nook, choose a time, and we'll have everything ready when you arrive.</p>
          </div>
        </div>
        <div className="lc-res-form-side">
          <div className="lc-res-bar" />
          <div className="lc-res-head">
            <h2 className="lc-res-title">Request for Booking</h2>
            <button className="lc-res-x" onClick={onClose} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p className="lc-res-subtitle">Fill in the details and our team will confirm your booking shortly.</p>
          {done ? (
            <div className="lc-res-confirm">
              <div style={{ width:56,height:56,borderRadius:'50%',background:'rgba(138,158,122,0.12)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8A9E7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h3 className="lc-res-conf-title">Booking Request Received</h3>
              <p className="lc-res-conf-sub">Thank you, <strong style={{ color: 'var(--sec)' }}>{form.name || 'friend'}</strong>. We've received your request for {NOOKS.find(n => n.id === nook)?.name}. Our team will reach out to you shortly to confirm.<br /><span style={{ color: 'var(--pri)', fontSize: '0.82rem', marginTop: '10px', display: 'inline-block' }}>See you at Lambreta!</span></p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="lc-res-row">
                <div className="lc-res-field">
                  <label htmlFor="res-name">Your Name</label>
                  <input id="res-name" className="lc-res-input" type="text" placeholder="Arjun Sharma" value={form.name} onChange={e => handle('name', e.target.value)} required />
                </div>
                <div className="lc-res-field">
                  <label htmlFor="res-size">Party Size</label>
                  <select id="res-size" className="lc-res-input" value={form.size} onChange={e => handle('size', e.target.value)}>
                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                  </select>
                </div>
              </div>
              <div className="lc-res-row">
                <div className="lc-res-field">
                  <label htmlFor="res-date">Date</label>
                  <input id="res-date" className="lc-res-input" type="date" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={e => handle('date', e.target.value)} required />
                </div>
                <div className="lc-res-field">
                  <label htmlFor="res-time">Time</label>
                  <select id="res-time" className="lc-res-input" value={form.time} onChange={e => handle('time', e.target.value)}>
                    {times.map(t => <option key={t!} value={t!}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="lc-res-field">
                <label htmlFor="res-phone" style={{ paddingLeft: 2 }}>Phone / WhatsApp</label>
                <input id="res-phone" className="lc-res-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => handle('phone', e.target.value)} required />
              </div>
              <div className="lc-res-field">
                <label>Preferred Nook</label>
                <div className="lc-nooks" role="radiogroup" aria-label="Choose your nook">
                  {NOOKS.map(n => (
                    <button type="button" key={n.id} className={`lc-nook${nook === n.id ? ' sel' : ''}`} onClick={() => setNook(n.id)} aria-pressed={nook === n.id}>
                      <div className="lc-nook-ico"><NookIcon type={n.id} /></div>
                      <p className="lc-nook-name">{n.name}</p>
                      <p className="lc-nook-cap">{n.cap}</p>
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="lc-res-submit">Send Booking Request</button>
              <p style={{ color: 'var(--muted)', fontSize: '0.72rem', textAlign: 'center', marginTop: '12px', lineHeight: 1.6, letterSpacing: '0.02em' }}>This is a request — we'll reach out to confirm within a few hours.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── FAB ──────────────────────────────────────────────────────────────────────
function FAB({ onReserve }: { onReserve: () => void }) {
  return (
    <div className="lc-fab">
      <button className="lc-fab-btn" onClick={onReserve} aria-label="Request a booking at Lambreta Café">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Request Booking
      </button>
    </div>
  );
}

// ─── MENU CATEGORY ───────────────────────────────────────────────────────────
function MenuCat({ cat, open, onToggle, filter, onAR }: {
  cat: typeof MENU[0]; open: boolean; onToggle: () => void;
  filter: string; onAR: (name: string, img: string) => void;
}) {
  const arImgs: Record<string, string> = { 'sig': img0, 'hot': img1, 'cold': img2, 'snacks': img3 };
  const dimmedIds = new Set(cat.items.filter(i => !i.times.includes(filter)).map(i => i.name));
  return (
    <div className={`lc-menu-cat${open ? ' open' : ''}`}>
      <button className="lc-cat-hdr" onClick={onToggle} aria-expanded={open}>
        <span className="lc-cat-name">
          <span className="lc-cat-ico" aria-hidden="true">{CAT_ICONS[cat.id]}</span>
          {cat.label}
        </span>
        <span className="lc-cat-tog" aria-hidden="true">+</span>
      </button>
      <div className="lc-items-wrap" aria-hidden={!open}>
        {cat.items.map(item => (
          <div key={item.name} className={`lc-item${dimmedIds.has(item.name) ? ' lc-item-dimmed' : ''}`}>
            <div className="lc-item-left">
              <p className="lc-item-name">{item.name}</p>
              <p className="lc-item-desc">{item.desc}</p>
            </div>
            <div className="lc-item-right">
              <span className="lc-price">{item.price}</span>
              {item.ar && <button className="lc-ar-btn" onClick={() => onAR(item.name, arImgs[cat.id] || img0)} aria-label={`View ${item.name} in AR`}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M2 12l10-10 10 10M5 9v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V9"/></svg>
                View in Space
              </button>}
            </div>
          </div>
        ))}
        {cat.items.filter(i => i.times.includes(filter)).length === 0 && filter !== 'all' && (
          <div style={{ padding: '20px 32px', color: 'var(--muted)', fontSize: '0.85rem' }}>No items for this time window</div>
        )}
      </div>
    </div>
  );
}

// ─── SCROLL ANIM HOOK ─────────────────────────────────────────────────────────
function useScrollAnim(deps: unknown[] = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.lc-fi:not(.vis)');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ─── SHARED FOOTER ────────────────────────────────────────────────────────────
function SiteFooter() {
  return (
    <footer className="lc-footer">
      <div className="lc-footer-grid">
        <div>
          <h4 className="lc-fh">Lambreta Café</h4>
          <p className="lc-ft">A beloved café in Civil Lines, Raipur —<br />for good food, honest drinks, and slow mornings.</p>
          <div className="lc-eco-line" aria-label="Sustainability note">
            <IconLeaf size={14} />
            <span>Naturally cooled using traditional mud and lime plaster.</span>
          </div>
        </div>
        <div>
          <h4 className="lc-fh">Find Us</h4>
          <p className="lc-ft">Civil Lines, Raipur<br />Chhattisgarh — 492 001<br />India</p>
          <span className="lc-hours-pill">Mon – Sun · 9:00 AM – 10:00 PM</span>
        </div>
        <div>
          <h4 className="lc-fh">Follow Along</h4>
          <p className="lc-ft">Seasonal updates, craft stories and weekend specials.</p>
          <a href="#" className="lc-insta" aria-label="Follow Lambreta Café on Instagram">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            @lambretacafe
          </a>
        </div>
      </div>
      <div className="lc-footer-bar">
        <span className="lc-footer-logo">Lambreta<em>Café</em></span>
        <span>© 2025 Lambreta Café · Civil Lines, Raipur</span>
      </div>
    </footer>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ goMenu, onContact }: { goMenu: () => void; onContact: () => void }) {
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 120); return () => clearTimeout(t); }, []);
  useScrollAnim([]);

  return (
    <>
      {/* ── Hero ── */}
      <section className="lc-hero">
        <div className="lc-hero-bg" />
        <img
          src={img0}
          alt="Lambreta Café interior — warm light, cane chairs and earthy walls"
          className="lc-hero-img"
          loading="eager"
        />
        <div className="lc-hero-ov" />
        <HeroCanvas />
        <div className="lc-hero-content">
          <div className={`lc-hero-pill${ready ? ' lc-fi vis' : ' lc-fi'}`}>Civil Lines, Raipur · Chhattisgarh</div>
          <AnimHead line1="Raipur's Most" line2="Soulful Café" />
          <p className={`lc-sub${ready ? ' go' : ''}`} style={{ fontSize: 'clamp(0.95rem,2vw,1.15rem)' }}>
            Handcrafted drinks, honest food, and a space that feels like home.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className={`lc-cta${ready ? ' go' : ''}`} onClick={goMenu} style={{ margin: 0 }}>Explore Our Menu</button>
            <button className={`lc-cta-secondary${ready ? ' go' : ''}`} onClick={goMenu} style={{ background: 'rgba(201,144,106,0.15)', color: 'var(--pri)', border: '1.5px solid var(--pri)', margin: 0, cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,144,106,0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(201,144,106,0.15)'; }}>Browse Our Specials</button>
          </div>
        </div>
        <div className="lc-scroll-hint" aria-hidden="true"><div className="lc-scroll-line" /><span>Scroll</span></div>
      </section>

      {/* ── About ── */}
      <section className="lc-sec" style={{ background: 'var(--bg)' }}>
        <div className="lc-sec-inner">
          <p className="lc-eyebrow lc-fi">Food first. Always.</p>
          <h2 className="lc-sec-title lc-fi" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.6rem)', maxWidth: '560px' }}>
            A little corner that feeds the soul
          </h2>
          <p className="lc-fi" style={{ color: 'var(--muted)', lineHeight: 1.8, maxWidth: '580px', fontSize: '0.93rem', marginBottom: '0' }}>
            Lambreta Café is where Chhattisgarhi heritage meets modern comfort food. Every dish on our menu is made from scratch — from the masala chai simmered with whole spices to our Raipur Heritage Thali that takes you back to your grandmother's kitchen.
          </p>
          <div className="lc-feats">
            <KotaCard
              icon={<IconCoffee size={22} />}
              title="Brewed Fresh, Every Cup"
              desc="Masala chai with whole spices, filter coffee in brass tumblers, golden turmeric lattes — every drink is crafted to order, never from a machine."
              delay={0}
            />
            <KotaCard
              icon={<IconPlate size={22} />}
              title="Chhattisgarhi Kitchen"
              desc="Dal bafla, poha platters, heritage thalis — we cook Raipur's soul food with recipes passed down through generations."
              delay={0.12}
              bgImg={img0}
            />
            <KotaCard
              icon={<IconLeaf size={22} />}
              title="Farm-Fresh Ingredients"
              desc="We source from nearby farms and prepare everything in-house. Seasonal menus, honest portions, zero shortcuts."
              delay={0.24}
            />
          </div>
        </div>
      </section>

      <div className="lc-divider" />

      <FromOurKitchen onExplore={goMenu} />

      {/* ── Pull Quote ── */}
      <section className="lc-quote">
        <OptImg src={img8} alt="" className="lc-quote-bg" aria-hidden="true" />
        <div className="lc-quote-ov" />
        <p className="lc-quote-text lc-fi" style={{ fontSize: 'clamp(1.65rem,4vw,3rem)' }}>"The chai alone is worth the drive. The thali makes you stay."</p>
        <span className="lc-quote-attr lc-fi">— A Raipur regular</span>
      </section>

      {/* ── Tilt Card Marquee ── */}
      <section style={{ background: 'var(--surf)', paddingTop: '32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingLeft: 'clamp(20px,5vw,64px)', paddingRight: 'clamp(20px,5vw,64px)', marginBottom: '28px' }}>
          <p style={{ color: 'var(--pri)', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '12px' }}>Experience</p>
          <h2 style={{ color: 'var(--sec)', marginBottom: '12px', fontSize: 'clamp(1.75rem,3.2vw,2.4rem)', fontFamily: 'Georgia,serif' }}>What makes us special</h2>
          <p style={{ color: 'var(--muted)', fontSize: 'clamp(0.85rem,2vw,0.9rem)', maxWidth: '600px', lineHeight: '1.6' }}>From our earthy ambiance to handcrafted comfort, discover the details that define Lambreta Café.</p>
        </div>
        <TiltMarquee />
      </section>

      <FindUsSection goMenu={goMenu} onContact={onContact} />

      <SiteFooter />
    </>
  );
}

// ─── MENU PAGE ────────────────────────────────────────────────────────────────
function MenuPage() {
  const [open, setOpen] = useState<string>('hot');
  const [arItem, setArItem] = useState<{ name: string; img: string } | null>(null);

  const h = new Date().getHours();
  const defaultFilter = h >= 20 ? 'evening' : h >= 17 ? 'golden' : h >= 12 ? 'afternoon' : 'morning';
  const [filter, setFilter] = useState(defaultFilter);
  const isGolden = h >= 17 && h < 20;

  useScrollAnim([]);

  const FILTERS = [
    { id: 'all', label: 'All Day' },
    { id: 'morning', label: 'Morning (9–12)' },
    { id: 'afternoon', label: 'Afternoon (12–5)' },
    { id: 'golden', label: 'Golden Hour (5–8)', golden: true },
    { id: 'evening', label: 'Evening (8–10)' },
  ];

  return (
    <>
      <div className="lc-menu-hero">
        <OptImg src={img0} alt="" className="lc-mh-bg" aria-hidden="true" />
        <div className="lc-mh-ov" />
        <p className="lc-mh-eye">Lambreta Café · Civil Lines, Raipur</p>
        <h1 className="lc-mh-title" style={{ fontSize: 'clamp(2.2rem,5vw,4rem)' }}>What's cooking today</h1>
        <p className="lc-mh-sub">Fresh, honest, made with care</p>
        {isGolden && (
          <p style={{ display:'inline-flex',alignItems:'center',gap:6,color:'#D4A017',fontSize:'0.78rem',marginTop:'16px',letterSpacing:'0.1em',textTransform:'uppercase',position:'relative',zIndex:2 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Golden Hour active — special selections available
          </p>
        )}
      </div>

      <div className="lc-menu-body">
        <p className="lc-fi" style={{ color: 'var(--muted)', fontSize: '0.84rem', marginBottom: '24px', lineHeight: 1.75 }}>
          Prices in Indian Rupees. Items vary by availability. We source ingredients from local farms wherever possible. Items marked with <span style={{ color: 'var(--acc)' }}>View in Space</span> support AR preview.
        </p>
        <div className="lc-time-filter lc-fi" role="group" aria-label="Filter menu by time of day">
          {FILTERS.map(f => (
            <button key={f.id} className={`lc-tf-btn${filter === f.id ? ' active' : ''}${f.golden ? ' golden-hour' : ''}`} onClick={() => setFilter(f.id)} aria-pressed={filter === f.id}>
              {f.label}
            </button>
          ))}
        </div>
        {MENU.map(cat => (
          <MenuCat key={cat.id} cat={cat} open={open === cat.id}
            onToggle={() => setOpen(o => o === cat.id ? '' : cat.id)}
            filter={filter}
            onAR={(name, img) => setArItem({ name, img })} />
        ))}
      </div>

      <ARModal item={arItem?.name || ''} img={arItem?.img || img0} onClose={() => setArItem(null)} />
      <SiteFooter />
    </>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<'home' | 'menu'>('home');
  const [reserveOpen, setReserveOpen] = useState(false);
  const [mobMenu, setMobMenu] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = document.createElement('style');
    el.id = 'lc-styles';
    el.textContent = STYLES;
    document.head.appendChild(el);
    return () => { document.getElementById('lc-styles')?.remove(); };
  }, []);

  // Loading screen: wait for readyState, plus 600ms buffer, with 3.5s max fallback
  useEffect(() => {
    const maxTimer = setTimeout(() => setLoaded(true), 3500);
    if (document.readyState === 'complete') {
      const t = setTimeout(() => setLoaded(true), 600);
      return () => { clearTimeout(t); clearTimeout(maxTimer); };
    }
    const onLoad = () => {
      const t = setTimeout(() => setLoaded(true), 600);
      return () => clearTimeout(t);
    };
    window.addEventListener('load', onLoad);
    return () => { window.removeEventListener('load', onLoad); clearTimeout(maxTimer); };
  }, []);

  const go = useCallback((p: 'home' | 'menu') => {
    setPage(p); setMobMenu(false); window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Loading Screen */}
      <div className={`lc-loader${loaded ? ' done' : ''}`}>
        <div className="lc-loader-content">
          <div className="lc-loader-title">Lambreta<em>Café</em></div>
          <div className="lc-loader-bar"><div className="lc-loader-shimmer" /></div>
          <div className="lc-loader-text">Brewing your experience</div>
        </div>
      </div>

      <nav className="lc-nav" role="navigation" aria-label="Main navigation">
        <button className="lc-logo" onClick={() => go('home')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9906A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/>
            <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
          </svg>
          Lambreta<em>Café</em>
        </button>
        <ul className="lc-navlinks">
          <li><button onClick={() => go('home')} className={page === 'home' ? 'active' : ''}>Home</button></li>
          <li><button onClick={() => go('menu')} className={page === 'menu' ? 'active' : ''}>Menu</button></li>
        </ul>
        <button className="lc-ham" onClick={() => setMobMenu(!mobMenu)} aria-label={mobMenu ? 'Close menu' : 'Open menu'} aria-expanded={mobMenu}>
          {mobMenu ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`lc-mob-menu${mobMenu ? ' open' : ''}`}>
        <button onClick={() => go('home')}>Home</button>
        <button onClick={() => go('menu')}>Menu</button>
        <button onClick={() => { setReserveOpen(true); setMobMenu(false); }}>Reserve</button>
      </div>

      <main key={page} className="lc-page">
        {page === 'home' ? <LandingPage goMenu={() => go('menu')} onContact={() => setReserveOpen(true)} /> : <MenuPage />}
      </main>
      <FAB onReserve={() => setReserveOpen(true)} />
      <ReserveModal open={reserveOpen} onClose={() => setReserveOpen(false)} />
    </div>
  );
}
