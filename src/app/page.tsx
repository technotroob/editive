'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/Button';
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  Wand2,
  Layers,
  Crop,
  Palette,
  Download,
  Zap,
  Shield,
  Check,
  Image as ImageIcon,
  Type,
  PenTool,
  Star,
  ArrowUpRight,
  Cpu,
  MousePointer2,
  Eye,
  ScanLine,
  Box,
  Upload,
  FileText,
  Lock,
  Unlock,
  RefreshCw,
  LayoutTemplate,
  Smartphone,
  Video,
  Move,
  Blend,
  Grid3x3,
  Square,
  Brush,
  SlidersHorizontal,
  Rocket,
  Globe,
  FileCode2,
  Layers3,
  FolderOpen,
} from 'lucide-react';

/* ── Reveal-on-scroll hook ─────────────────────────────── */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function Reveal({ className = '', children, style }: { className?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`rv ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ── Small primitives ──────────────────────────────────── */
function Eyebrow({ children, color = 'var(--accent)' }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(79,142,247,0.08)', border: '1px solid var(--border-subtle)' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{children}</span>
    </div>
  );
}

function Headline({ children, center = true }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 style={{ fontSize: 'clamp(28px, 4.2vw, 46px)', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', textAlign: center ? 'center' : 'left', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 'var(--space-4)' }}>
      {children}
    </h2>
  );
}

function Body({ children, center = true, style }: { children: React.ReactNode; center?: boolean; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: 16, lineHeight: 1.68, color: 'var(--text-secondary)', maxWidth: 640, margin: center ? '0 auto' : undefined, textAlign: center ? 'center' : 'left', ...style }}>
      {children}
    </p>
  );
}

function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section id={id} style={{ position: 'relative', width: '100%', maxWidth: 1180, margin: '0 auto', padding: '84px var(--space-8)', ...style }}>
      {children}
    </section>
  );
}

function Chip({ children, color = 'var(--text-secondary)', bg = 'var(--bg-panel-elevated)' }: { children: React.ReactNode; color?: string; bg?: string }) {
  return (
    <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 12px', borderRadius: 'var(--radius-full)', background: bg, border: '1px solid var(--border-subtle)', color }}>
      {children}
    </span>
  );
}

/* ============================================================
   NAV
   ============================================================ */
function Nav() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Product', href: '#product' },
    { label: 'AI Studio', href: '#ai-studio' },
    { label: 'Unlock Design', href: '#unlock' },
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#workflow' },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: scrolled ? 58 : 68,
        padding: '0 var(--space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(13,17,23,0.82)' : 'rgba(13,17,23,0.4)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        transition: 'height var(--t-smooth), background var(--t-smooth)',
      }}
    >
      <a href="#product" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none' }}>
        <Logo size={scrolled ? 26 : 30} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '0.5px', color: 'var(--text-primary)' }}>EDITIVE</span>
      </a>

      <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        {links.map((l) => (
          <a key={l.href} href={l.href} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--t-fast)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Button variant="ghost" size="sm" onClick={() => router.push('/workspace')} style={{ fontSize: 13, fontWeight: 600 }}>Create a design</Button>
        <Button variant="special" size="sm" icon={<ArrowRight size={14} />} iconPosition="right" onClick={() => router.push('/editor')} style={{ fontSize: 13, fontWeight: 700 }}>
          Open Editor
        </Button>
      </div>
    </header>
  );
}

function Logo({ size = 28 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 'var(--radius-sm)', background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px', boxShadow: '0 6px 18px rgba(79,142,247,0.4)', flexShrink: 0 }}>
      E
    </div>
  );
}

/* ============================================================
   SECTION 01 — HERO
   ============================================================ */
function Hero() {
  const router = useRouter();
  return (
    <div style={{ position: 'relative', overflow: 'hidden', paddingTop: 110 }}>
      {/* ambient glow + grid */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div className="hm-grid" style={{ position: 'absolute', inset: 0, maskImage: 'radial-gradient(circle at 50% 30%, #000 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle at 50% 30%, #000 0%, transparent 70%)' }} />
        <div className="hm-glow" style={{ position: 'absolute', inset: -100, background: 'radial-gradient(720px 380px at 50% 0%, rgba(79,142,247,0.22), transparent 70%), radial-gradient(560px 300px at 78% 22%, rgba(167,139,250,0.14), transparent 70%)' }} />
      </div>

      <Section id="product" style={{ paddingTop: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, position: 'relative' }}>
          <Reveal>
            <Eyebrow color="var(--accent-ai)"><Sparkles size={12} /> Hackathon build · Real editor · Real AI</Eyebrow>
          </Reveal>

          <Reveal className="rv-d1">
            <h1 style={{ fontSize: 'clamp(40px, 7.4vw, 76px)', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fff', textAlign: 'center', letterSpacing: '-0.8px', lineHeight: 1.02 }}>
              Your Image.
              <br />
              Make It <span className="hm-shimmer">Editable.</span>
            </h1>
          </Reveal>

          <Reveal className="rv-d2">
            <Body center style={{ maxWidth: 620, fontSize: 17 }}>
              EDITIVE turns everyday visual assets into editable, AI-powered designs. Bring a finished image — get back the controls to change it.
            </Body>
          </Reveal>

          <Reveal className="rv-d3">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 6 }}>
              <Button variant="special" size="lg" icon={<ArrowRight size={16} />} iconPosition="right" onClick={() => router.push('/editor')}>
                Open Editor
              </Button>
              <Button variant="ghost" size="lg" icon={<ArrowDown size={16} />} onClick={() => document.getElementById('problem')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </div>
          </Reveal>

          {/* Transformation composition: FLAT → UNLOCK → LAYERS */}
          <Reveal className="rv-d4" style={{ width: '100%', maxWidth: 980, marginTop: 30 }}>
            <HeroTransformation />
          </Reveal>
        </div>
      </Section>
    </div>
  );
}

/* A flattened poster → unlock → editable layer stack */
function HeroTransformation() {
  const layers = [
    { name: 'Background', color: '#1C2230', w: 92 },
    { name: 'Logo', color: '#4F8EF7', w: 60 },
    { name: 'Headline', color: '#E6EDF3', w: 82 },
    { name: 'Product image', color: '#A78BFA', w: 66 },
    { name: 'Shape', color: '#FBBF24', w: 48 },
    { name: 'CTA button', color: '#34D397', w: 54 },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24, alignItems: 'center', padding: 26, borderRadius: 'var(--radius-xl)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
      {/* FLATTENED */}
      <div>
        <Label text="What you have · Flat JPG / PNG" />
        <div className="hm-layer" style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: 'var(--radius-lg)', background: '#0F172A', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FlattenedPoster />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(255,255,255,0.05), transparent 40%)', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* ARROW */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--accent)', textTransform: 'uppercase' }}>Unlock</div>
        <div className="hm-pulse" style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px rgba(79,142,247,0.4)' }}>
          <Wand2 size={18} color="#fff" />
        </div>
        <div style={{ width: 1, height: 46, background: 'linear-gradient(var(--accent), transparent)' }} />
      </div>

      {/* LAYERS */}
      <div>
        <Label text="What you get · Editable layers" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {layers.map((ly, i) => (
            <div key={ly.name} className="hm-layer hm-float-slow" style={{ animationDelay: `${i * 0.18}s`, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-panel-elevated)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ width: 26, height: 26, borderRadius: 7, background: ly.color, opacity: 0.9 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{ly.name}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{ly.w}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Label({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} />
      {text}
    </div>
  );
}

function FlattenedPoster() {
  return (
    <div style={{ width: '82%', height: '82%', borderRadius: 10, background: '#0F172A', border: '1px solid var(--border-subtle)', padding: '12% 8%', display: 'flex', flexDirection: 'column', gap: '9%', position: 'relative' }}>
      <div style={{ width: '34%', height: '7%', background: '#4F8EF7', borderRadius: 3 }} />
      <div style={{ width: '80%', height: '12%', background: 'linear-gradient(90deg,#fff,#8B949E)', borderRadius: 3, opacity: 0.95 }} />
      <div style={{ width: '62%', height: '6%', background: 'rgba(255,255,255,0.4)', borderRadius: 3 }} />
      <div style={{ width: '100%', height: '22%', background: 'linear-gradient(135deg,#A78BFA,#4F8EF7)', borderRadius: 6 }} />
      <div style={{ width: '46%', height: '8%', background: '#34D397', borderRadius: 4 }} />
      {/* embossed lock overlay */}
      <div style={{ position: 'absolute', right: 8, top: 8, width: 22, height: 22, borderRadius: 6, background: 'rgba(13,17,23,0.8)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <Lock size={11} />
      </div>
    </div>
  );
}

/* ============================================================
   SECTION 02 — PROBLEM
   ============================================================ */
function Problem() {
  return (
    <Section id="problem">
      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
        <Reveal>
          <Eyebrow>The problem</Eyebrow>
          <Headline center={false}>
            Ever had the final image…
            <br />
            but not the design file?
          </Headline>
          <Body center={false}>
            You finish the poster, export the JPG, and the original PSD never arrives. Then you need to change one headline.
          </Body>

          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <PainRow icon={<FileText size={16} color="var(--status-warning)" />} text="Original PSD? Not available." />
            <PainRow icon={<RefreshCw size={16} color="var(--status-warning)" />} text="Rebuild the layout from scratch" />
            <PainRow icon={<Type size={16} color="var(--status-warning)" />} text="Recreate the text by hand" />
            <PainRow icon={<ImageIcon size={16} color="var(--status-warning)" />} text="Extract images one by one" />
          </div>
        </Reveal>

        <Reveal className="rv-d2">
          <div style={{ position: 'relative', padding: 26, borderRadius: 'var(--radius-xl)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
            {/* narrative card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-panel-elevated)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>poster_final.jpg</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>1.2 MB</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowDown size={16} color="var(--text-muted)" />
              </div>
              <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'var(--bg-panel-elevated)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>“Need to change one thing…”</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>the headline</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowDown size={16} color="var(--text-muted)" />
              </div>
              <div style={{ padding: '14px 16px', borderRadius: 'var(--radius-md)', background: 'rgba(248,81,73,0.08)', border: '1px solid rgba(248,81,73,0.3)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--status-error)' }}>Original design file</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Not available. Hours of rework begin.</div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: -14, left: '50%', transform: 'translateX(-50%)', padding: '8px 18px', borderRadius: 'var(--radius-full)', background: 'var(--bg-panel-elevated)', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-sm)', fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              The image exists. The editable design doesn’t.
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function PainRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)' }}>
      {icon}
      <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{text}</span>
    </div>
  );
}

/* ============================================================
   SECTION 03 — BIG IDEA (What if the image wasn't flat?)
   ============================================================ */
function BigIdea() {
  return (
    <div style={{ position: 'relative', width: '100%', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
          <Reveal>
            <Eyebrow color="var(--accent)">The big idea</Eyebrow>
            <Headline center={false}>
              What if the image
              <br />
              wasn’t really flat?
            </Headline>
            <Body center={false}>
              EDITIVE looks at a flattened visual the way a designer would — and separates what is actually there: the headline, the image, the shape, the logo, the CTA, the background.
            </Body>
          </Reveal>

          <Reveal className="rv-d2">
            <BreakApart />
          </Reveal>
        </div>
      </Section>
    </div>
  );
}

function BreakApart() {
  const frags = [
    { name: 'Background', top: '4%', left: '6%', w: '88%', h: '92%', color: 'rgba(28,34,48,0.9)' },
    { name: 'Logo', top: '8%', left: '8%', w: '22%', h: '10%', color: 'rgba(79,142,247,0.9)' },
    { name: 'Headline', top: '28%', left: '8%', w: '66%', h: '14%', color: 'rgba(230,237,243,0.95)' },
    { name: 'Product image', top: '48%', left: '8%', w: '52%', h: '26%', color: 'rgba(167,139,250,0.9)' },
    { name: 'Shape', top: '48%', left: '64%', w: '28%', h: '18%', color: 'rgba(251,191,36,0.9)' },
    { name: 'CTA', top: '80%', left: '8%', w: '34%', h: '9%', color: 'rgba(52,211,153,0.95)' },
  ];
  return (
    <div style={{ position: 'relative', height: 340, borderRadius: 'var(--radius-xl)', background: 'radial-gradient(300px 200px at 30% 30%, rgba(79,142,247,0.14), transparent 70%), var(--bg-workspace)', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
      <div className="hm-grid" style={{ position: 'absolute', inset: 0, opacity: 0.6 }} />
      {frags.map((f, i) => (
        <div
          key={f.name}
          className="hm-layer hm-float"
          style={{
            position: 'absolute', top: f.top, left: f.left, width: f.w, height: f.h,
            borderRadius: 10, background: f.color, border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 26px rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'center', paddingLeft: 12,
            fontSize: 11, fontWeight: 700, color: '#0D1117',
            animationDelay: `${i * 0.22}s`, animationDuration: `${6 + i * 0.5}s`,
            transform: `translate(${(i - 2) * 3}px, ${i % 2 === 0 ? -6 : 6}px) rotate(${(i % 3) * 0.6 - 0.6}deg)`,
          }}
        >
          {f.name}
        </div>
      ))}
      <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', padding: '7px 16px', borderRadius: 'var(--radius-full)', background: 'var(--bg-glass)', border: '1px solid var(--border-medium)', backdropFilter: 'blur(6px)', fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        ONE IMAGE → TEXT · IMAGE · SHAPE · LOGO · CTA · BACKGROUND
      </div>
    </div>
  );
}

/* ============================================================
   SECTION 04 — UNLOCK DESIGN (hero feature)
   ============================================================ */
function UnlockDesign() {
  const router = useRouter();
  const steps = [
    { n: '01', title: 'Analyze', desc: 'The engine scans the flattened visual.' },
    { n: '02', title: 'Detect', desc: 'It separates supported visual elements.' },
    { n: '03', title: 'Review', desc: 'You check each reconstructed layer.' },
    { n: '04', title: 'Edit', desc: 'Change text, colors, and layout freely.' },
  ];
  return (
    <Section id="unlock">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <Reveal>
          <Eyebrow color="var(--accent)"><Wand2 size={12} /> Flagship feature</Eyebrow>
          <Headline>Unlock the design hiding inside your image.</Headline>
          <Body>EDITIVE analyzes a flattened visual and attempts to reconstruct its editable structure — AI-assisted reconstruction, honest about what it finds.</Body>
        </Reveal>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {/* BEFORE */}
        <Reveal>
          <div style={{ padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', height: '100%' }}>
            <Label text="Before · Flat image" />
            <div style={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
              <FlattenedPoster />
            </div>
          </div>
        </Reveal>
        {/* AFTER — layer stack */}
        <Reveal className="rv-d2">
          <div style={{ padding: 20, borderRadius: 'var(--radius-lg)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', height: '100%' }}>
            <Label text="After · Reconstructed layers" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { name: 'Background', tag: 'detected', color: '#1C2230' },
                { name: 'Logo', tag: 'detected', color: '#4F8EF7' },
                { name: 'Headline', tag: 'editable', color: '#E6EDF3' },
                { name: 'Product image', tag: 'editable', color: '#A78BFA' },
                { name: 'Shape', tag: 'detected', color: '#FBBF24' },
                { name: 'CTA button', tag: 'editable', color: '#34D397' },
              ].map((ly, i) => (
                <div key={ly.name} className="hm-float-slow" style={{ animationDelay: `${i * 0.14}s`, display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-panel-elevated)', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: ly.color }} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{ly.name}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 'var(--radius-full)', background: ly.tag === 'editable' ? 'var(--accent-subtle)' : 'var(--accent-ai-subtle)', color: ly.tag === 'editable' ? 'var(--accent)' : 'var(--accent-ai)' }}>{ly.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {/* how it works */}
      <Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ padding: 18, borderRadius: 'var(--radius-md)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{s.n}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginTop: 6 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-7)' }}>
        <Button variant="primary" size="lg" icon={<Wand2 size={16} />} onClick={() => router.push('/workspace')}>
          Try Unlock Design
        </Button>
      </Reveal>
    </Section>
  );
}

/* ============================================================
   SECTION 05 — THE EDITOR (real preview)
   ============================================================ */
function Editor() {
  const router = useRouter();
  const callouts = [
    { top: 40, left: 40, text: 'Select · Move' },
    { top: 40, left: 200, text: 'Text tool' },
    { top: 40, left: 330, text: 'Layers panel' },
    { top: 130, left: 360, text: 'Canvas' },
  ];
  return (
    <Section>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <Reveal>
          <Eyebrow>The editor</Eyebrow>
          <Headline>Everything you need to edit. Nothing you need to learn first.</Headline>
          <Body>This isn’t just an AI wrapper. It’s a real image editor — canvas, layers, transforms, text, shapes, draw, adjustments, effects, and export.</Body>
        </Reveal>
      </div>

      <Reveal className="rv-d2">
        <div style={{ position: 'relative', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-canvas)', border: '1px solid var(--border-subtle)' }}>
          <img src="/hero-editor.svg" alt="The real EDITIVE editor interface" style={{ display: 'block', width: '100%', height: 'auto' }} loading="lazy" />
          {callouts.map((c) => (
            <div key={c.text} style={{ position: 'absolute', top: c.top, left: c.left, padding: '6px 12px', borderRadius: 'var(--radius-full)', background: 'var(--bg-glass)', border: '1px solid var(--border-medium)', backdropFilter: 'blur(6px)', fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' }}>
              {c.text}
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-7)' }}>
        <Button variant="secondary" size="lg" icon={<ArrowUpRight size={16} />} onClick={() => router.push('/editor')}>
          Open the real editor
        </Button>
      </Reveal>
    </Section>
  );
}

/* ============================================================
   SECTION 06 — CORE EDITING (interactive tool showcase)
   ============================================================ */
function CoreEditing() {
  const [cat, setCat] = useState('Create');
  const cats = ['Create', 'Edit', 'Organize', 'Style'];
  const tools: Record<string, { icon: React.ReactNode; label: string; desc: string }[]> = {
    Create: [
      { icon: <Type size={18} color="var(--status-warning)" />, label: 'Text', desc: 'Headings, subheadings, body' },
      { icon: <Square size={18} color="var(--accent)" />, label: 'Shapes', desc: 'Rect, rounded, line, arrow' },
      { icon: <Brush size={18} color="var(--accent-pink)" />, label: 'Draw', desc: 'Freehand brush strokes' },
    ],
    Edit: [
      { icon: <MousePointer2 size={18} color="var(--accent)" />, label: 'Select', desc: 'Click to pick any layer' },
      { icon: <Crop size={18} color="var(--status-info)" />, label: 'Crop', desc: 'Crop to any region' },
      { icon: <Move size={18} color="var(--status-success)" />, label: 'Transform', desc: 'Move, scale, rotate, flip' },
      { icon: <SlidersHorizontal size={18} color="var(--status-warning)" />, label: 'Adjustments', desc: 'Brightness, contrast, hue' },
    ],
    Organize: [
      { icon: <Layers3 size={18} color="var(--accent)" />, label: 'Layers', desc: 'Reorder the stack' },
      { icon: <FolderOpen size={18} color="var(--accent-ai)" />, label: 'Groups', desc: 'Group related layers' },
      { icon: <Lock size={18} color="var(--status-warning)" />, label: 'Lock', desc: 'Protect a layer' },
      { icon: <Eye size={18} color="var(--status-success)" />, label: 'Visibility', desc: 'Show or hide layers' },
    ],
    Style: [
      { icon: <Sparkles size={18} color="var(--accent-ai)" />, label: 'Effects', desc: 'Shadow, glow, border' },
      { icon: <Palette size={18} color="var(--accent)" />, label: 'Gradients', desc: 'Color transitions' },
      { icon: <Blend size={18} color="var(--status-info)" />, label: 'Blend modes', desc: 'Multiply, overlay, screen' },
    ],
  };
  return (
    <div style={{ position: 'relative', width: '100%', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <Section id="features">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <Reveal>
            <Eyebrow>Core editing</Eyebrow>
            <Headline>One editor. Every tool. No clutter.</Headline>
            <Body>Tools are grouped the way designers think — create, edit, organize, style. Nothing buried, nothing overwhelming.</Body>
          </Reveal>
        </div>

        <Reveal className="rv-d2">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
            {/* interactive selector */}
            <div style={{ borderRadius: 'var(--radius-lg)', background: 'var(--bg-workspace)', border: '1px solid var(--border-subtle)', padding: 22, minHeight: 360 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                {cats.map((c) => (
                  <button key={c} onClick={() => setCat(c)} style={{ padding: '7px 14px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-medium)', background: cat === c ? 'var(--accent-subtle)' : 'var(--bg-panel-elevated)', color: cat === c ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all var(--t-fast)' }}>
                    {c}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
                {tools[cat].map((t) => (
                  <div key={t.label} style={{ padding: '16px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', transition: 'all var(--t-fast)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {t.icon}
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginTop: 8 }}>{t.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.45 }}>{t.desc}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text-muted)' }}>↑ interactive — try the categories</div>
            </div>

            {/* live mini-canvas preview */}
            <div style={{ borderRadius: 'var(--radius-lg)', background: 'var(--bg-workspace)', border: '1px solid var(--border-subtle)', padding: 20, minHeight: 360 }}>
              <Label text={`Live preview · ${cat}`} />
              <MiniCanvas category={cat} />
            </div>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}

function MiniCanvas({ category }: { category: string }) {
  const stroke = { stroke: '#8B949E', strokeWidth: 1 };
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1.2/1', borderRadius: 'var(--radius-md)', background: '#0F172A', overflow: 'hidden' }}>
      {/* background */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(200px 140px at 30% 30%, rgba(79,142,247,0.16), transparent 70%)' }} />
      {/* headline */}
      <div style={{ position: 'absolute', top: '12%', left: '10%', width: '62%', height: '9%', background: category === 'Style' ? 'linear-gradient(90deg,var(--accent),var(--accent-ai))' : '#E6EDF3', borderRadius: 3 }} />
      {/* sub */}
      <div style={{ position: 'absolute', top: '26%', left: '10%', width: '44%', height: '4%', background: 'rgba(230,237,243,0.45)', borderRadius: 3 }} />
      {/* image block */}
      <div style={{ position: 'absolute', top: '38%', left: '10%', width: '46%', height: '34%', background: 'linear-gradient(135deg,#A78BFA,#4F8EF7)', borderRadius: 8, opacity: 0.85 }} />
      {/* shape */}
      <div style={{ position: 'absolute', top: '38%', left: '62%', width: '26%', height: '22%', background: 'rgba(251,191,36,0.8)', borderRadius: category === 'Create' ? 50 : 8 }} />
      {/* cta */}
      <div style={{ position: 'absolute', bottom: '12%', left: '10%', width: '30%', height: '8%', background: '#34D397', borderRadius: 4 }} />
      {/* grid overlay for organize */}
      {category === 'Organize' && (
        <div className="hm-grid" style={{ position: 'absolute', inset: 0, opacity: 0.7 }} />
      )}
      {/* selection box for edit */}
      {category === 'Edit' && (
        <div style={{ position: 'absolute', top: '36%', left: '8%', width: '50%', height: '38%', border: '1px dashed var(--accent)', borderRadius: 6, boxShadow: '0 0 0 1px rgba(79,142,247,0.2)' }}>
          {[[0, 0], [100, 0], [0, 100], [100, 100]].map(([x, y], i) => (
            <span key={i} style={{ position: 'absolute', top: `${y}%`, left: `${x}%`, width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', transform: 'translate(-50%,-50%)', border: '1px solid #fff' }} />
          ))}
        </div>
      )}
      {/* fx glow for style */}
      {category === 'Style' && (
        <div style={{ position: 'absolute', top: '38%', left: '10%', width: '46%', height: '34%', borderRadius: 8, boxShadow: '0 0 34px rgba(167,139,250,0.7)', border: '1px solid rgba(255,255,255,0.2)' }} />
      )}
      {/* draw strokes */}
      {category === 'Create' && (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 60" preserveAspectRatio="none">
          <path d="M10 50 C 30 20, 45 55, 60 30 S 85 15, 92 28" fill="none" stroke="var(--accent-pink)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      {/* empty stroke reference */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 60" preserveAspectRatio="none">
        <rect x="9.5" y="11.5" width="62" height="9" rx="2" fill="none" {...stroke} opacity={0.25} />
        <rect x="9.5" y="25" width="44" height="4" rx="2" fill="none" {...stroke} opacity={0.2} />
        <rect x="9.5" y="37" width="46" height="34" rx="6" fill="none" {...stroke} opacity={0.25} />
        <rect x="61.5" y="37" width="26" height="22" rx="6" fill="none" {...stroke} opacity={0.25} />
        <rect x="9.5" y="54" width="30" height="8" rx="3" fill="none" {...stroke} opacity={0.25} />
      </svg>
    </div>
  );
}

/* ============================================================
   SECTION 07 — AI STUDIO
   ============================================================ */
function AIStudio() {
  const groups = [
    { title: 'Background', items: ['Remove Background', 'Blur Background'] },
    { title: 'Objects', items: ['Remove Object', 'Replace Object'] },
    { title: 'Quality', items: ['Smart Enhance', 'AI Upscale 2×'] },
    { title: 'Text', items: ['OCR · Extract Text'] },
    { title: 'Canvas', items: ['AI Expand'] },
    { title: 'Selection', items: ['Smart Object Select'] },
    { title: 'Crop', items: ['Smart Crop'] },
  ];
  const pipeline = ['Original', 'Remove BG', 'Enhance', 'Upscale', 'OCR', 'Final'];
  return (
    <Section id="ai-studio">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <Reveal>
          <Eyebrow color="var(--accent-ai)"><Cpu size={12} /> AI Studio</Eyebrow>
          <Headline>AI tools. Inside the editor.</Headline>
          <Body>Not a chatbot — real visual transformations, applied directly to your layers.</Body>
        </Reveal>
      </div>

      {/* pipeline */}
      <Reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 'var(--space-8)' }}>
          {pipeline.map((p, i) => (
            <React.Fragment key={p}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: i === pipeline.length - 1 ? 'var(--grad-hero)' : 'var(--bg-panel-elevated)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: i === pipeline.length - 1 ? '0 8px 22px rgba(79,142,247,0.4)' : 'none' }}>
                  {i === pipeline.length - 1 ? <Star size={18} color="#fff" /> : <ImageIcon size={18} color="var(--text-secondary)" />}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: i === pipeline.length - 1 ? 'var(--accent)' : 'var(--text-muted)', letterSpacing: '0.04em' }}>{p}</span>
              </div>
              {i < pipeline.length - 1 && <ArrowRight size={15} color="var(--border-strong)" />}
            </React.Fragment>
          ))}
        </div>
      </Reveal>

      <Reveal className="rv-d2">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {groups.map((g) => (
            <div key={g.title} style={{ padding: 18, borderRadius: 'var(--radius-md)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', transition: 'all var(--t-fast)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-ai)'; e.currentTarget.style.boxShadow = 'var(--shadow-glow-purple)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-ai)', marginBottom: 10 }}>{g.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {g.items.map((it) => (
                  <div key={it} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-ai)' }} />
                    {it}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ============================================================
   SECTION 08 — SMART REFRAME
   ============================================================ */
function Reframe() {
  const formats = [
    { name: 'Instagram Post', size: '1080 × 1080', icon: <LayoutTemplate size={16} />, color: '#EC4899' },
    { name: 'Instagram Story', size: '1080 × 1920', icon: <Smartphone size={16} />, color: '#8B5CF6' },
    { name: 'YouTube Thumbnail', size: '1280 × 720', icon: <Video size={16} />, color: '#EF4444' },
    { name: 'LinkedIn Post', size: '1200 × 627', icon: <LayoutTemplate size={16} />, color: '#3B82F6' },
  ];
  return (
    <div style={{ position: 'relative', width: '100%', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <Reveal>
            <Eyebrow color="var(--status-info)"><ScanLine size={12} /> Smart Reframe</Eyebrow>
            <Headline>One design. Every format.</Headline>
            <Body>Smart Reframe helps preserve visual hierarchy while adapting the same composition to any canvas size.</Body>
          </Reveal>
        </div>

        <Reveal className="rv-d2">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'center', gap: 'var(--space-5)' }}>
            {formats.map((f, i) => (
              <div key={f.name} className="hm-float-slow" style={{ animationDelay: `${i * 0.16}s`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 92, height: i === 1 ? 150 : i === 2 ? 62 : 88, borderRadius: 8, background: '#0F172A', border: '1px solid var(--border-subtle)', padding: 8, display: 'flex', flexDirection: 'column', gap: 5, boxShadow: 'var(--shadow-md)' }}>
                  <div style={{ width: '60%', height: '9%', background: '#E6EDF3', borderRadius: 2 }} />
                  <div style={{ width: '80%', height: '34%', background: 'linear-gradient(135deg,#A78BFA,#4F8EF7)', borderRadius: 3 }} />
                  <div style={{ width: '46%', height: '12%', background: '#34D397', borderRadius: 2 }} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{f.size}</div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>
    </div>
  );
}

/* ============================================================
   SECTION 09 — DESIGN MEMORY
   ============================================================ */
function Memory() {
  const tokens = ['Typography', 'Colors', 'Spacing', 'Shadows', 'Borders', 'CTA treatment'];
  const colors = ['#4F8EF7', '#A78BFA', '#FBBF24', '#34D397', '#FACC15', '#F78166', '#58A6FF', '#EC4899'];
  return (
    <Section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
        <Reveal>
          <Eyebrow color="var(--accent-emerald)"><Palette size={12} /> Design Memory</Eyebrow>
          <Headline center={false}>Remember the style. Not just the file.</Headline>
          <Body center={false}>
            Save how a design looks — its type, color, spacing, and effects — and reapply that language to anything else.
          </Body>
          <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {tokens.map((t) => (
              <Chip key={t} color="var(--text-secondary)">{t}</Chip>
            ))}
          </div>
        </Reveal>

        <Reveal className="rv-d2">
          <div style={{ padding: 26, borderRadius: 'var(--radius-xl)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
            {/* design A → memory → design B */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 14, alignItems: 'center' }}>
              <div>
                <Label text="Design A" />
                <div style={{ borderRadius: 10, background: '#0F172A', border: '1px solid var(--border-subtle)', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ width: '70%', height: 8, background: '#E6EDF3', borderRadius: 2 }} />
                  <div style={{ width: '90%', height: 26, background: 'linear-gradient(135deg,#A78BFA,#4F8EF7)', borderRadius: 4 }} />
                  <div style={{ width: '50%', height: 6, background: '#34D397', borderRadius: 2 }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--accent-emerald-subtle)', border: '1px solid rgba(63,185,80,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Palette size={17} color="var(--status-success)" />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--status-success)', letterSpacing: '0.08em' }}>SAVE STYLE</span>
              </div>
              <div>
                <Label text="Design B" />
                <div style={{ borderRadius: 10, background: '#0F172A', border: '1px solid var(--border-subtle)', padding: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ width: '80%', height: 8, background: '#E6EDF3', borderRadius: 2 }} />
                  <div style={{ width: '90%', height: 26, background: 'linear-gradient(135deg,#A78BFA,#4F8EF7)', borderRadius: 4 }} />
                  <div style={{ width: '40%', height: 6, background: '#34D397', borderRadius: 2 }} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 18 }}>
              {colors.map((c) => (
                <span key={c} style={{ width: 22, height: 22, borderRadius: 6, background: c, border: '1px solid rgba(255,255,255,0.15)' }} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ============================================================
   SECTION 10 — WORKFLOW (image → final design)
   ============================================================ */
function Workflow() {
  const steps = [
    { icon: <Upload size={20} color="#fff" />, title: 'Upload', desc: 'Bring the image you have.' },
    { icon: <Wand2 size={20} color="#fff" />, title: 'Unlock', desc: 'Reconstruct editable layers.' },
    { icon: <PenTool size={20} color="#fff" />, title: 'Edit', desc: 'Change text, layout, colors.' },
    { icon: <Sparkles size={20} color="#fff" />, title: 'Enhance', desc: 'AI clean-up and upscaling.' },
    { icon: <ScanLine size={20} color="#fff" />, title: 'Reframe', desc: 'Adapt to any format.' },
    { icon: <Download size={20} color="#fff" />, title: 'Export', desc: 'PNG, JPG, WebP.' },
  ];
  return (
    <Section id="workflow">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <Reveal>
          <Eyebrow>Workflow</Eyebrow>
          <Headline>One workflow. From image to finished design.</Headline>
          <Body>The entire product pipeline — no other tool needed.</Body>
        </Reveal>
      </div>

      <Reveal className="rv-d2">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
          {steps.map((s, i) => (
            <div key={s.title} className="hm-float-slow" style={{ animationDelay: `${i * 0.14}s`, position: 'relative', padding: 20, borderRadius: 'var(--radius-md)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', alignSelf: 'flex-start' }}>0{i + 1}</div>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: 'var(--grad-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(79,142,247,0.35)' }}>
                {s.icon}
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.45 }}>{s.desc}</div>
              {i < steps.length - 1 && (
                <div style={{ position: 'absolute', right: -11, top: '50%', transform: 'translateY(-50%)', zIndex: 2, background: 'var(--bg-workspace)', borderRadius: '50%', padding: 2, color: 'var(--border-strong)' }}>
                  <ArrowRight size={13} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ============================================================
   SECTION 11 — BEGINNER FRIENDLY
   ============================================================ */
function Beginner() {
  return (
    <div style={{ position: 'relative', width: '100%', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <Section>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
          <Reveal>
            <Eyebrow>Approachable by design</Eyebrow>
            <Headline center={false}>Professional power. Without the professional learning curve.</Headline>
            <Body center={false}>
              EDITIVE is built around <strong style={{ color: 'var(--text-primary)' }}>progressive disclosure</strong> — simple tools first, advanced controls revealed only when you need them.
            </Body>
          </Reveal>

          <Reveal className="rv-d2">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 14, alignItems: 'stretch' }}>
              {/* traditional */}
              <div style={{ borderRadius: 'var(--radius-md)', background: 'var(--bg-workspace)', border: '1px solid var(--border-subtle)', padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>Complex editors</div>
                {['Too many panels', 'Hidden tools', 'Steep learning curve'].map((t) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    <span style={{ fontSize: 12, color: 'var(--status-error)' }}>✕</span>{t}
                  </div>
                ))}
              </div>
              {/* arrow */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 22, color: 'var(--border-strong)' }}>→</div>
              </div>
              {/* editive */}
              <div style={{ borderRadius: 'var(--radius-md)', background: 'var(--bg-workspace)', border: '1px solid rgba(79,142,247,0.4)', padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 10 }}>EDITIVE</div>
                {['Clear tools', 'Contextual controls', 'Visible features'].map((t) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', fontSize: 12.5, color: 'var(--text-secondary)' }}>
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={9} color="var(--accent)" />
                    </span>{t}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   SECTION 12 — START WITH WHAT YOU HAVE
   ============================================================ */
function StartOptions() {
  const router = useRouter();
  const options = [
    { icon: <Grid3x3 size={20} color="var(--accent)" />, title: 'Blank Canvas', desc: 'Start from zero, any size.', action: () => router.push('/workspace') },
    { icon: <FolderOpen size={20} color="var(--status-info)" />, title: 'Open Project', desc: 'Continue where you left off.', action: () => router.push('/workspace') },
    { icon: <ImageIcon size={20} color="var(--status-success)" />, title: 'Import Image', desc: 'JPG, PNG — start editing.', action: () => router.push('/workspace') },
    { icon: <FileText size={20} color="var(--status-warning)" />, title: 'Import PSD', desc: 'Photoshop files, where supported.', action: () => router.push('/workspace') },
  ];
  return (
    <Section>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <Reveal>
          <Eyebrow>Get started</Eyebrow>
          <Headline>Start with whatever you have.</Headline>
          <Body>EDITIVE starts from your content — never a fake template.</Body>
        </Reveal>
      </div>
      <Reveal className="rv-d2">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {options.map((o) => (
            <button key={o.title} onClick={o.action} style={{ padding: 24, borderRadius: 'var(--radius-lg)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, textAlign: 'left', transition: 'all var(--t-fast)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bg-panel-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{o.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{o.title}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{o.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginTop: 'auto' }}>
                Start <ArrowRight size={13} />
              </div>
            </button>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ============================================================
   SECTION 13 — EXPORT
   ============================================================ */
function Export() {
  const formats = [
    { name: 'PNG', desc: 'Lossless, transparent' },
    { name: 'JPG', desc: 'Compact, camera-ready' },
    { name: 'WebP', desc: 'Modern, efficient' },
    { name: 'PSD', desc: 'Photoshop round-trip*' },
  ];
  return (
    <Section>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
        <Reveal>
          <Eyebrow color="var(--status-success)"><Download size={12} /> Export</Eyebrow>
          <Headline center={false}>Create here. Take it anywhere.</Headline>
          <Body center={false}>
            Export at any size with full fidelity. Transparent PNG, sharp JPG, or efficient WebP — plus a PSD workflow where supported.
          </Body>
          <div style={{ marginTop: 'var(--space-5)', fontSize: 11, color: 'var(--text-muted)' }}>* where supported by the installed toolchain.</div>
        </Reveal>
        <Reveal className="rv-d2">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {formats.map((f, i) => (
              <div key={f.name} className="hm-float-slow" style={{ animationDelay: `${i * 0.12}s`, padding: 20, borderRadius: 'var(--radius-md)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{f.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 4 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ============================================================
   SECTION 14 — TECHNICAL CREDIBILITY
   ============================================================ */
function Tech() {
  const stack = [
    { icon: <Rocket size={18} color="var(--accent)" />, name: 'Next.js', role: 'App shell & routing' },
    { icon: <Box size={18} color="var(--accent-ai)" />, name: 'React', role: 'Component UI' },
    { icon: <Cpu size={18} color="var(--status-info)" />, name: 'Canvas engine', role: 'Rendering & transforms' },
    { icon: <Sparkles size={18} color="var(--accent-emerald)" />, name: 'AI services', role: 'Unlock, Studio, Reframe' },
    { icon: <Globe size={18} color="var(--status-warning)" />, name: 'Vercel', role: 'Deployment' },
    { icon: <FileCode2 size={18} color="var(--text-secondary)" />, name: 'GitHub', role: 'Version control' },
  ];
  const arch = ['User', 'EDITIVE UI', 'Editor Engine', 'AI Services', 'Image Processing', 'Final Design'];
  return (
    <div style={{ position: 'relative', width: '100%', background: 'var(--bg-panel)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <Reveal>
            <Eyebrow>Under the hood</Eyebrow>
            <Headline>Built for the web. Powered by modern tools.</Headline>
            <Body>Every claim on this page runs in this codebase — a real browser-based editor with a real canvas engine.</Body>
          </Reveal>
        </div>

        <Reveal className="rv-d2">
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-8)', alignItems: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>
              {stack.map((s) => (
                <div key={s.name} style={{ padding: 16, borderRadius: 'var(--radius-md)', background: 'var(--bg-workspace)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg-panel-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{s.role}</div>
                </div>
              ))}
            </div>

            {/* architecture flow */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center' }}>
              {arch.map((a, i) => (
                <React.Fragment key={a}>
                  <div style={{ padding: '10px 22px', borderRadius: 'var(--radius-full)', background: i === 0 ? 'var(--grad-hero)' : 'var(--bg-workspace)', border: '1px solid var(--border-medium)', fontSize: 12.5, fontWeight: 700, color: i === 0 ? '#fff' : 'var(--text-primary)', boxShadow: i === 0 ? '0 6px 18px rgba(79,142,247,0.35)' : 'none' }}>{a}</div>
                  {i < arch.length - 1 && <div style={{ width: 1, height: 22, background: 'var(--border-strong)' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}

/* ============================================================
   SECTION 15 — WHY EDITIVE (comparison)
   ============================================================ */
function Why() {
  const traditional = ['Find the source file', 'Open complex software', 'Rebuild missing elements', 'Switch between AI tools', 'Reformat manually', 'Export'];
  const editive = ['Bring your image', 'Unlock', 'Edit', 'AI assist', 'Smart Reframe', 'Export'];
  return (
    <Section>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <Reveal>
          <Eyebrow>Why EDITIVE</Eyebrow>
          <Headline>Less rebuilding. More creating.</Headline>
        </Reveal>
      </div>

      <Reveal className="rv-d2">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'stretch' }}>
          {/* traditional */}
          <div style={{ borderRadius: 'var(--radius-lg)', background: 'var(--bg-panel)', border: '1px solid var(--border-subtle)', padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 16 }}>Traditional workflow</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {traditional.map((t, i) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          {/* editive */}
          <div className="hm-gradient-border" style={{ borderRadius: 'var(--radius-lg)', background: 'var(--bg-panel)', padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>EDITIVE workflow</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {editive.map((t, i) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>
                  <span style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 600 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ============================================================
   SECTION 16 — FINAL CTA
   ============================================================ */
function FinalCTA() {
  const router = useRouter();
  return (
    <Section style={{ paddingBottom: 96 }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-xl)', padding: '72px var(--space-6)', textAlign: 'center', background: 'radial-gradient(520px 260px at 50% 0%, rgba(79,142,247,0.25), transparent 70%), var(--bg-panel)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="hm-grid" style={{ position: 'absolute', inset: 0, opacity: 0.5 }} />
        {/* floating layers */}
        <div className="hm-float" style={{ position: 'absolute', top: 30, left: '8%', width: 42, height: 30, borderRadius: 8, background: 'rgba(79,142,247,0.9)', boxShadow: '0 10px 24px rgba(0,0,0,0.4)' }} />
        <div className="hm-float-slow" style={{ position: 'absolute', top: 50, right: '10%', width: 46, height: 26, borderRadius: 8, background: 'rgba(167,139,250,0.9)', boxShadow: '0 10px 24px rgba(0,0,0,0.4)' }} />
        <div className="hm-float" style={{ position: 'absolute', bottom: 40, left: '18%', width: 34, height: 26, borderRadius: 8, background: 'rgba(52,211,153,0.9)', boxShadow: '0 10px 24px rgba(0,0,0,0.4)' }} />
        <div className="hm-float-slow" style={{ position: 'absolute', bottom: 30, right: '20%', width: 38, height: 22, borderRadius: 8, background: 'rgba(251,191,36,0.9)', boxShadow: '0 10px 24px rgba(0,0,0,0.4)' }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-6)' }}>
          <Reveal>
            <h3 style={{ fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#fff', letterSpacing: '-0.6px', lineHeight: 1.05 }}>
              Your next design
              <br />
              might already exist.
            </h3>
          </Reveal>
          <Reveal className="rv-d2">
            <Body center style={{ color: 'var(--text-secondary)' }}>
              Bring the image. EDITIVE gives you back the controls.
            </Body>
          </Reveal>
          <Reveal className="rv-d3">
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button variant="special" size="lg" icon={<ArrowRight size={16} />} iconPosition="right" onClick={() => router.push('/editor')}>
                Open EDITIVE
              </Button>
              <Button variant="ghost" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore the Features
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* ============================================================
   FOOTER
   ============================================================ */
function Footer() {
  const router = useRouter();
  const cols = [
    { title: 'Product', links: ['Product', 'AI Studio', 'Unlock Design', 'Features', 'Editor'] },
  ];
  const hrefMap: Record<string, string> = {
    Product: '#product',
    'AI Studio': '#ai-studio',
    'Unlock Design': '#unlock',
    Features: '#features',
    Editor: '/editor',
  };
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-workspace)', padding: '56px var(--space-8)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-8)', justifyContent: 'space-between' }}>
        <div style={{ maxWidth: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
            <Logo size={26} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, letterSpacing: '0.5px', color: 'var(--text-primary)' }}>EDITIVE</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Create. Edit. Unlock. Reframe.
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
            A hackathon project · Built with Next.js, React & a custom canvas engine.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          {cols.map((c) => (
            <div key={c.title} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{c.title}</div>
              {c.links.map((l) => (
                <a key={l} href={hrefMap[l]} style={{ fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color var(--t-fast)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ maxWidth: 1180, margin: '40px auto 0', borderTop: '1px solid var(--border-subtle)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
        <span>© {new Date().getFullYear()} EDITIVE · Hackathon demo</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={12} /> Keys stay server-side · Your visuals stay yours</span>
      </div>
    </footer>
  );
}

/* ============================================================
   PAGE
   ============================================================ */
export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-workspace)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', display: 'flex', flexDirection: 'column' }}>
      <Nav />
      <main style={{ flex: 1 }}>
        <Hero />
        <Problem />
        <BigIdea />
        <UnlockDesign />
        <Editor />
        <CoreEditing />
        <AIStudio />
        <Reframe />
        <Memory />
        <Workflow />
        <Beginner />
        <StartOptions />
        <Export />
        <Tech />
        <Why />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}