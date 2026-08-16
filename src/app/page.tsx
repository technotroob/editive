'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/Button';
import {
  ArrowRight,
  Sparkles,
  LayoutTemplate,
  Wand2,
  Layers,
  Crop,
  Palette,
  Share2,
  Download,
  Zap,
  Shield,
  Check,
} from 'lucide-react';

type IconSet = React.ComponentType<{ size?: number; color?: string }>;

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'Editor', href: '/editor' },
];

const AI_TOOLS = [
  { title: 'Background Remover', desc: 'Isolate subjects with pixel-accurate transparency.' },
  { title: 'Smart Enhance', desc: 'Recover detail and color from low light or compression.' },
  { title: 'AI Upscale', desc: 'Intelligently enlarge up to 2× with no quality loss.' },
  { title: 'Object Removal', desc: 'Clean up anything unwanted with a brush and a single click.' },
  { title: 'Text Extract (OCR)', desc: 'Lift live text out of any flattened image.' },
];

const WHY_ITEMS = [
  { icon: Shield, title: 'Your keys stay yours', desc: 'AI processing is optional. No secrets ship to the client.' },
  { icon: Wand2, title: 'Built for your visuals', desc: 'No stock-photo templates. Edit the images you actually own.' },
  { icon: LayoutTemplate, title: 'Precision, not presets', desc: 'Direct control over layers, transforms, and effects.' },
  { icon: Download, title: 'Export, your way', desc: 'PNG, JPEG, or WebP at 1×–4× with full color fidelity.' },
];

function Nav() {
  const router = useRouter();
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 72,
        padding: '0 var(--space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-glass)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Logo />
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '17px',
            letterSpacing: '0.5px',
            color: 'var(--text-primary)',
          }}
        >
          EDITIVE
        </span>
      </div>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              transition: 'color var(--t-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button
          variant="ghost"
          size="md"
          onClick={() => router.push('/workspace')}
          style={{ fontSize: '13px', fontWeight: 600 }}
        >
          Create a design
        </Button>
        <Button
          variant="special"
          size="md"
          icon={<ArrowRight size={15} />}
          iconPosition="right"
          onClick={() => router.push('/editor')}
          style={{ fontSize: '13px', fontWeight: 700 }}
        >
          Open the editor
        </Button>
      </div>
    </header>
  );
}

function Logo({ size = 26 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 'var(--radius-sm)',
        background: 'var(--grad-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 900,
        fontSize: '13px',
        color: '#FFFFFF',
        fontFamily: 'var(--font-display)',
        letterSpacing: '-0.5px',
        boxShadow: '0 6px 18px rgba(79, 142, 247, 0.4)',
        flexShrink: 0,
      }}
    >
      E
    </div>
  );
}

function AiBrain({ size = 32 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path
        d="M34 15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
        fill="url(#ab)"
        stroke="#4F8EF7"
        strokeWidth="1.5"
      />
      <path
        d="M14 33a10 10 0 0 1 20 0v4a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2v-4Z"
        fill="#1C2230"
        stroke="#30363D"
        strokeWidth="1.5"
      />
      <path
        d="M19.5 21.5c0 2.5-1.5 4.5-3.5 5.5-2 .99-4.4.88-5.9-1.2A6.007 6.007 0 0 1 7 17a6 6 0 0 1 5.5-5.97 7.003 7.003 0 0 1 7 6.47Z"
        fill="#A78BFA"
        stroke="#A78BFA"
        strokeWidth="0.8"
      />
      <path
        d="M28.5 21.5c0 2.5 1.5 4.5 3.5 5.5 2 .99 4.4.88 5.9-1.2A6.007 6.007 0 0 1 41 17a6 6 0 0 1-5.5-5.97 7.003 7.003 0 0 1-7 6.47Z"
        fill="#A78BFA"
        stroke="#A78BFA"
        strokeWidth="0.8"
      />
      <defs>
        <linearGradient id="ab" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#4F8EF7" />
          <stop offset="1" stop-color="#A78BFA" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function DeviceFrames() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={120} height={140} viewBox="0 0 120 140" fill="none">
      <rect x="30" y="10" width="60" height="116" rx="10" fill="#0D1117" stroke="#21262D" strokeWidth="1" />
      <rect x="40" y="22" width="40" height="18" rx="3" fill="#1C2230" stroke="#30363D" />
      <rect x="42" y="44" width="36" height="78" rx="4" fill="#0F172A"/>
      <circle cx="60" cy="108" r="2.5" fill="#8B949E" />
      <rect x="50" y="114" width="20" height="2" rx="1" fill="#8B949E" />
      {/* phone */}
      <rect x="5" y="50" width="22" height="44" rx="6" fill="#0F172A" stroke="#21262D" strokeWidth="1" />
      <rect x="11" y="60" width="10" height="6" rx="1.5" fill="#8B949E" opacity="0.5" />
      <rect x="7" y="72" width="14" height="26" rx="2" fill="#161B22" />
    </svg>
  );
}

function PaletteSwatch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={64} height={64} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="26" fill="#1C2230" stroke="#30363D" />
      <circle cx="22" cy="26" r="6" fill="#4F8EF7" />
      <circle cx="42" cy="24" r="6" fill="#A78BFA" />
      <circle cx="30" cy="44" r="6" fill="#FBBF24" />
      <circle cx="18" cy="46" r="5" fill="#34D397" />
      <circle cx="44" cy="46" r="6" fill="#FACC15" />
    </svg>
  );
}

function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={className}
      style={{
        width: '100%',
        maxWidth: '1180px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-8)',
      }}
    >
      {children}
    </section>
  );
}

function Headline({
  children,
  center = true,
  size = 'lg',
}: {
  children: React.ReactNode;
  center?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeMap = {
    sm: { fontSize: '24px', lineHeight: 1.25 },
    md: { fontSize: '32px', lineHeight: 1.2 },
    lg: { fontSize: '40px', lineHeight: 1.13 },
  }[size];
  return (
    <h2
          style={{
            ...sizeMap,
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: 'var(--text-primary)',
            textAlign: center ? 'center' : 'left',
            letterSpacing: '-0.4px',
            marginBottom: 'var(--space-4)',
          }}
    >
      {children}
    </h2>
  );
}

function BodyText({
  children,
  center = true,
  style,
}: {
  children: React.ReactNode;
  center?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <p
      style={{
        fontSize: '17px',
        lineHeight: 1.62,
        color: 'var(--text-secondary)',
        maxWidth: '620px',
        margin: center ? '0 auto' : undefined,
        textAlign: center ? 'center' : 'left',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function HeroVisual() {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-canvas)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-panel)',
        flexShrink: 0,
      }}
    >
      <img
        src="/hero-editor.svg"
        alt="EDITIVE editor: toolbar, canvas, layers, and inspector"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          maxWidth: 720,
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-workspace)',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* === NAV === */}
      <Nav />

      {/* === HERO === */}
      <Section id="product">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-6)',
            paddingTop: 'var(--space-8)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-ai-subtle)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Sparkles size={14} color="var(--accent-ai)" />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--accent-ai)',
                letterSpacing: '0.05em',
              }}
            >
              Creative intelligence for designers
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(34px, 6.4vw, 56px)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: '#FFFFFF',
              letterSpacing: '-0.6px',
              lineHeight: 1.08,
              textAlign: 'center',
            }}
          >
            A modern image editor that gives you control over the visuals you already have.
          </h1>

          <BodyText center style={{ maxWidth: '680px' }}>
            Reconstruct flat designs into editable layers. Repurpose any visual for any format. Edit with the
            precision of a pro and the focus of a creator.
          </BodyText>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: 'var(--space-4)',
            }}
          >
            <Button
              variant="special"
              size="lg"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              onClick={() => router.push('/editor')}
            >
              Open the editor
            </Button>
            <Button
              variant="ghost"
              size="lg"
              icon={<LayoutTemplate size={16} />}
              onClick={() => router.push('/workspace')}
            >
              Create a design
            </Button>
          </div>

          <HeroVisual />
        </div>
      </Section>

      {/* === PROBLEM === */}
      <Section>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1, minWidth: 300 }}>
            <Headline size="md" center={false}>
              Every visual is a starting point. But once it is flattened, you are stuck.
            </Headline>
            <BodyText center={false}>
              Logos come as PNGs. Social assets arrive flattened. Mockups are locked to a frame. The tools that
              exist either treat your image as a black box or force you into generic templates.
            </BodyText>
            <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <ProblemItem icon={<Layers size={18} color="var(--accent)" />} text="Turn flat images back into editable layers." />
              <ProblemItem icon={<Crop size={18} color="var(--accent)" />} text="Adapt any visual to any format without starting over." />
              <ProblemItem icon={<Palette size={18} color="var(--accent)" />} text="Apply your own style system, not someone else's template." />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--grad-card)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <img
                src="/hero-editor.svg"
                alt="Editor interface showing layers panel and canvas"
                style={{ width: 360, height: 'auto', borderRadius: 'var(--radius-lg)' }}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* === CORE EDITOR === */}
      <Section>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1, minWidth: 300 }}>
            <Headline center={false}>Built like an editor, not a toy.</Headline>
            <BodyText center={false}>
              Real layers. Real transforms. Real effects. The editor you already know how to drive, rebuilt for the
              visuals you actually create with.
            </BodyText>
            <ul
              style={{
                marginTop: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                color: 'var(--text-secondary)',
                fontSize: '15px',
              }}
            >
              <FeatureItem icon={<Layers size={16} color="var(--accent)" />} text="Non-destructive layer stack with blend modes" />
              <FeatureItem icon={<Crop size={16} color="var(--accent)" />} text="Precise move, scale, rotate, and corner-radius controls" />
              <FeatureItem icon={<Palette size={16} color="var(--accent)" />} text="Per-layer adjustments and effects (shadow, glow, border)" />
              <FeatureItem icon={<Zap size={16} color="var(--accent)" />} text="Vector shapes, freehand draw, and live text" />
            </ul>
          </div>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' }}>
            <HeroVisual />
          </div>
        </div>
      </Section>

      {/* === UNLOCK DESIGN === */}
      <Section>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1, minWidth: 300 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-subtle)',
                border: '1px solid var(--border-subtle)',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Wand2 size={14} color="var(--accent)" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.05em' }}>
                Flagship workflow
              </span>
            </div>
            <Headline center={false}>Unlock Design.</Headline>
            <BodyText center={false}>
              Feed a flattened PNG, JPEG, or PSD into the editor and watch it reconstruct the original layers — text,
              shapes, and imagery — as fully editable objects. Edit them in place, no redrawing required.
            </BodyText>
            <div style={{ marginTop: 'var(--space-5)' }}>
              <Button
                variant="primary"
                size="md"
                icon={<Wand2 size={16} />}
                onClick={() => router.push('/workspace')}
              >
                Try Unlock Design
              </Button>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--grad-unlock)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <AiBrain size={56} />
            </div>
          </div>
        </div>
      </Section>

      {/* === AI STUDIO === */}
      <Section id="features">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
          <Headline>AI Studio, on your side.</Headline>
          <BodyText>
            Background removal, smart enhance, object removal, upscaling, and OCR — all callable from the AI ToolBox.
            Processing stays on our servers; your source images never leave without your say.
          </BodyText>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {AI_TOOLS.map((tool) => (
            <ToolCard key={tool.title} title={tool.title} desc={tool.desc} icon={<Sparkles size={18} color="var(--accent-ai)" />} />
          ))}
        </div>
      </Section>

      {/* === SMART REFRAME === */}
      <Section>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: 1, minWidth: 280, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-panel)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              <DeviceFrames />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 300 }}>
            <Headline center={false}>Smart Reframe keeps your design intact.</Headline>
            <BodyText center={false}>
              Switch a design from a poster to a story, a banner to a square post, without re-laying anything out. The
              editor reflows content intelligently to preserve hierarchy across formats.
            </BodyText>
            <div
              style={{
                marginTop: 'var(--space-5)',
                display: 'flex',
                gap: 'var(--space-3)',
                alignItems: 'center',
              }}
            >
              <Button variant="secondary" size="md" icon={<Share2 size={16} />} onClick={() => router.push('/editor')}>
                Open the editor
              </Button>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Instagram · YouTube · LinkedIn · Print</span>
            </div>
          </div>
        </div>
      </Section>

      {/* === DESIGN MEMORY === */}
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
          <Headline>Design Memory.</Headline>
          <BodyText>
            Save your color palettes, gradients, typography, and effects once. Apply the same visual language across
            every layer and every project, so your work stays on brand by default.
          </BodyText>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PaletteSwatch />
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              color: 'var(--text-secondary)',
              fontSize: '15px',
            }}
          >
            <FeatureItem icon={<Check size={16} color="var(--accent-ai)" />} text="Named style sets" />
            <FeatureItem icon={<Check size={16} color="var(--accent-ai)" />} text="One-click application to layers" />
            <FeatureItem icon={<Check size={16} color="var(--accent-ai)" />} text="Synced across projects" />
          </ul>
        </div>
      </Section>

      {/* === WORKFLOW === */}
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
          <Headline>From anything to anything.</Headline>
          <BodyText>
            A straight line from the asset you have to the design you need.
          </BodyText>
        </div>
        <WorkflowSteps />
      </Section>

      {/* === WHY EDITIVE === */}
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
          <Headline>Why EDITIVE.</Headline>
          <BodyText>The difference is in what you control.</BodyText>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-5)',
          }}
        >
          {WHY_ITEMS.map((item) => (
            <WhyCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
          ))}
        </div>
      </Section>

      {/* === PRODUCT PHILOSOPHY === */}
      <Section>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-5)',
            textAlign: 'center',
            padding: 'var(--space-8) var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 6a2 2 0 0 1 2 2v10.59l6.76-4.06a2 2 0 0 1 2.48 2.04V38a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V20.03a2 2 0 0 1 2.48-1.52L22 26.59V8a2 2 0 0 1 2-2Z"
              fill="url(#ph)"
              stroke="none"
            />
            <defs>
              <linearGradient id="ph" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stop-color="#4F8EF7" />
                <stop offset="1" stop-color="#A78BFA" />
              </linearGradient>
            </defs>
          </svg>
          <Headline size="sm">Product philosophy</Headline>
          <BodyText>
            We believe a creative tool should amplify the work that is unmistakably yours — not replace it with
            averages. EDITIVE starts from your visual, keeps your intent in control, and only reaches for AI when it
            would genuinely save you time.
          </BodyText>
        </div>
      </Section>

      {/* === FULL SHOWCASE === */}
      <Section>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-7)' }}>
          <Headline>Designed for depth.</Headline>
          <BodyText>Everything you need, in one place.</BodyText>
        </div>
      </Section>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <HeroVisual />
      </div>

      {/* === FINAL CTA === */}
      <Section>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-6)',
            padding: 'var(--space-10) var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--grad-hero)',
            boxShadow: '0 24px 60px rgba(79, 142, 247, 0.35)',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              fontSize: 'clamp(22px, 4vw, 32px)',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              color: '#FFFFFF',
              letterSpacing: '-0.4px',
            }}
          >
            Create. Edit. Unlock. Reframe. Remember.
          </h3>
          <BodyText style={{ color: 'rgba(230, 237, 243, 0.82)', maxWidth: '560px' }}>
            The editor that respects your visuals and your time.
          </BodyText>
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            onClick={() => router.push('/editor')}
          >
            Open the editor
          </Button>
        </div>
      </Section>

      {/* === FOOTER === */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-panel)',
          padding: 'var(--space-8) var(--space-8)',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1180px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-8)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size={22} />
            <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              EDITIVE
            </span>
          </div>
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            <Column
              title="Product"
              items={[
                { label: 'Editor', href: '/editor' },
                { label: 'Unlock Design', href: '/workspace' },
                { label: 'AI Studio', href: '#features' },
              ]}
            />
            <Column
              title="Resources"
              items={[
                { label: 'Documentation', href: '#' },
                { label: 'Changelog', href: '#' },
                { label: 'Status', href: '#' },
              ]}
            />
            <Column
              title="Company"
              items={[
                { label: 'About', href: '#' },
                { label: 'Careers', href: '#' },
                { label: 'Contact', href: '#' },
              ]}
            />
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} EDITIVE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProblemItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <span style={{ marginTop: '2px' }}>{icon}</span>
      <span style={{ lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', listStyle: 'none' }}>
      {icon}
      <span>{text}</span>
    </li>
  );
}

function ToolCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div
      style={{
        padding: 'var(--space-5)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        transition: 'all var(--t-fast)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--accent-ai)';
        e.currentTarget.style.boxShadow = 'var(--shadow-glow-purple)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{desc}</span>
      </div>
    </div>
  );
}

function WhyCard({
  icon,
  title,
  desc,
}: {
  icon: IconSet;
  title: string;
  desc: string;
}) {
  const Icon = icon;
  return (
    <div
      style={{
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-panel-elevated)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
        }}
      >
        <Icon size={22} />
      </div>
      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
      <BodyText center style={{ fontSize: '13px', maxWidth: '220px' }}>
        {desc}
      </BodyText>
    </div>
  );
}

function WorkflowSteps() {
  const steps = [
    { n: '01', title: 'Start', desc: 'Upload an image or open a project.' },
    { n: '02', title: 'Unlock', desc: 'Reconstruct it into editable layers.' },
    { n: '03', title: 'Edit', desc: 'Adjust, reframe, restyle with full control.' },
    { n: '04', title: 'Export', desc: 'Download PNG/JPEG/WebP at any resolution.' },
  ];
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--space-6)',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--radius-full)',
                background: 'var(--grad-hero)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '15px',
                color: '#fff',
                fontFamily: 'var(--font-display)',
              }}
            >
              {s.n}
            </div>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginTop: 'var(--space-3)' }}>
              {s.title}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'center', maxWidth: 110 }}>
              {s.desc}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 24,
                height: 2,
                background: 'var(--border-subtle)',
                alignSelf: 'center',
                marginTop: 22,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Column({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
        {title}
      </span>
      {items.map((it) => (
        <a
          key={it.label}
          href={it.href}
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            transition: 'color var(--t-fast)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          {it.label}
        </a>
      ))}
    </div>
  );
}
