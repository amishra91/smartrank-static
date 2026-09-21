import React, { useEffect, useRef, useState } from 'react';

const features = [
  {
    tag: 'Evaluation',
    title: 'Adaptive Diagnostics',
    description: 'Calibrated baseline assessments that evaluate proficiency across syllabus sections against historical cutoff marks.',
    bullets: [
      'Topic-level strength mapping',
      'Personalized milestone schedule',
      'Target-date study roadmap',
    ],
  },
  {
    tag: 'Study Surface',
    title: 'Distraction-Free Reading Room',
    description: 'A dedicated reading environment separated from testing anxiety. Structured notes, syllabus breakdowns, and zero advertising.',
    bullets: [
      'Topic-by-topic breakdowns',
      'Quick-revision summaries',
      'Typography optimized for long sessions',
    ],
  },
  {
    tag: 'Testing Fidelity',
    title: 'Exam-Condition Mock Engine',
    description: 'Sectional drills and full-length practice tests matching official exam interfaces, actual timing, and negative marking rules.',
    bullets: [
      'Official interface fidelity',
      'Actual sectional timers',
      'Question-level pacing metrics',
    ],
  },
  {
    tag: 'Official Questions',
    title: 'Historical PYQ Archive',
    description: 'Over a decade of Previous Year Questions categorized by syllabus section with verified step-by-step rationales.',
    bullets: [
      '10+ years of verified PYQs',
      'Categorized by topic and year',
      'Step-by-step problem breakdowns',
    ],
  },
  {
    tag: 'Tutoring',
    title: 'Conceptual Clarification',
    description: 'On-demand conceptual explanations that unpack complex questions and diagnose recurring error patterns.',
    bullets: [
      'Misconception pattern tracking',
      'Foundational concept reinforcement',
      'Alternative solution methods',
    ],
  },
  {
    tag: 'Performance',
    title: 'Calibrated Rank Analytics',
    description: 'Data-driven performance benchmarks comparing your mock scores to qualifying cutoffs, highlighting speed bottlenecks.',
    bullets: [
      'Benchmark rank projections',
      'Speed vs. accuracy analysis',
      'Consistent practice tracking',
    ],
  },
];

const examStreams = [
  { title: 'UPSC', sub: '12+ Exams' },
  { title: 'SSC', sub: '12+ Exams' },
  { title: 'Banking', sub: '14+ Exams' },
  { title: 'Railways & Defense', sub: '28+ Exams' },
  { title: 'State PSCs', sub: '38+ Exams' },
  { title: 'Many more' },
];

const getTargetLaunchTime = () => {
  const key = 'smartrank_target_launch';
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > Date.now()) {
        return parsed;
      }
    }
    const target = Date.now() + (24 * 86400 + 18 * 3600 + 45 * 60) * 1000;
    localStorage.setItem(key, target.toString());
    return target;
  } catch {
    return Date.now() + (24 * 86400 + 18 * 3600 + 45 * 60) * 1000;
  }
};

const calculateTimeLeft = (targetTime: number) => {
  const diff = targetTime - Date.now();
  if (diff <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days: d < 10 ? `0${d}` : `${d}`,
    hours: h < 10 ? `0${h}` : `${h}`,
    minutes: m < 10 ? `0${m}` : `${m}`,
    seconds: s < 10 ? `0${s}` : `${s}`,
  };
};

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetTimeRef = useRef<number>(getTargetLaunchTime());
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetTimeRef.current));

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft(targetTimeRef.current));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: null as number | null, y: null as number | null, radius: 130 };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseOut = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      alpha: number;
      hue: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.6 + 0.8;
        this.baseAlpha = Math.random() * 0.28 + 0.12;
        this.alpha = this.baseAlpha;
        this.hue = Math.random() > 0.3 ? 265 : 225;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        else if (this.x > width) this.x = 0;

        if (this.y < 0) this.y = height;
        else if (this.y > height) this.y = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = 1 - dist / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
            this.alpha = Math.min(this.baseAlpha + force * 0.4, 0.7);
          } else {
            this.alpha = this.baseAlpha;
          }
        } else {
          this.alpha = this.baseAlpha;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 75%, 60%, ${this.alpha})`;
        ctx.fill();
      }
    }

    const particleCount = Math.min(Math.floor((width * height) / 15000), 65);
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const opacity = (1 - dist / 110) * 0.14;
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y * 0.04}deg) rotateY(${x * 0.04}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  };

  return (
    <>
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="grid-overlay"></div>
      <canvas id="particleCanvas" ref={canvasRef}></canvas>

      <div className="layout-wrapper">
        <header>
          <div className="brand-group">
            <a href="#" className="smartrank-pill" title="SmartRank">
              <img src="/smartrank-logo.svg" alt="SmartRank" />
            </a>
          </div>

          <div className="header-actions">
            <a
              href="https://hunarmind.com/smartrank"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn nav-btn-primary"
            >
              <span>Explore on Hunarmind</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </div>
        </header>

        <main>
          <div className="status-badge">
            <span className="pulse-dot"></span>
            <span>Launching Soon &bull; Competitive Exam Intelligence</span>
          </div>

          <h1 className="hero-title">
            The Future of Exam Intelligence is <span className="gradient-text">Almost Here.</span>
          </h1>

          <p className="hero-subtitle">
            Authentic exam-condition mock environments, adaptive syllabus diagnostics, and calibrated rank analytics across 100+ national and state competitive examinations.
          </p>

          <div className="motto-banner">
            <span>Plan</span>
            <span className="motto-dot">&bull;</span>
            <span>Practice</span>
            <span className="motto-dot">&bull;</span>
            <span>Progress</span>
          </div>

          <div className="countdown-grid">
            <div className="countdown-card">
              <div className="countdown-num">{timeLeft.days}</div>
              <div className="countdown-label">Days</div>
            </div>
            <div className="countdown-card">
              <div className="countdown-num">{timeLeft.hours}</div>
              <div className="countdown-label">Hours</div>
            </div>
            <div className="countdown-card">
              <div className="countdown-num">{timeLeft.minutes}</div>
              <div className="countdown-label">Minutes</div>
            </div>
            <div className="countdown-card">
              <div className="countdown-num">{timeLeft.seconds}</div>
              <div className="countdown-label">Seconds</div>
            </div>
          </div>

          <div className="hunarmind-banner">
            <div className="banner-left">
              <div className="hunarmind-logo-icon">
                <img src="/logo.svg" alt="Hunarmind" />
              </div>
              <div className="banner-content">
                <h3>Explore SmartRank Architecture on Hunarmind</h3>
                <p>Learn about our adaptive diagnostic engine, exam stream coverage, and design standards.</p>
              </div>
            </div>
            <a
              href="https://hunarmind.com/smartrank"
              target="_blank"
              rel="noopener noreferrer"
              className="banner-btn"
            >
              <span>hunarmind.com/smartrank</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
          </div>

          <div className="features-section">
            <span className="section-eyebrow">Platform Capabilities</span>
            <h2 className="section-title">Engineered for Genuine Exam Mastery</h2>
            <p className="section-desc">Designed with focus over gimmicks, zero ad tracking, and deterministic test fidelity.</p>

            <div className="features-grid">
              {features.map((feat) => (
                <div
                  key={feat.title}
                  className="feature-card"
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                >
                  <span className="feature-tag">{feat.tag}</span>
                  <h4>{feat.title}</h4>
                  <p>{feat.description}</p>
                  <ul className="feature-bullets">
                    {feat.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="streams-marquee">
            <div className="streams-header">Covering 100+ Competitive Examinations Across India</div>
            <div className="streams-grid">
              {examStreams.map((stream) => (
                <div key={stream.title} className="stream-box">
                  <div className="stream-box-title">{stream.title}</div>
                  {stream.sub && <div className="stream-box-sub">{stream.sub}</div>}
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer>
          <div className="footer-left">
            <a href="#" className="smartrank-pill" style={{ padding: '4px 12px' }}>
              <img src="/smartrank-logo.svg" alt="SmartRank" style={{ height: '20px' }} />
            </a>
            <span className="footer-text">
              An applied AI initiative by{' '}
              <a href="https://hunarmind.com" target="_blank" rel="noopener noreferrer">
                Hunarmind Technologies
              </a>.
            </span>
          </div>

          <div className="footer-links">
            <a href="https://hunarmind.com/smartrank" target="_blank" rel="noopener noreferrer" className="footer-link">
              SmartRank on Hunarmind
            </a>
            <a href="https://hunarmind.com" target="_blank" rel="noopener noreferrer" className="footer-link">
              Hunarmind Home
            </a>
            <a href="mailto:hello@hunarmind.com" className="footer-link">
              Contact
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
