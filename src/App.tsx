import React, { useEffect, useRef, useState } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

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

const campaignPlans = [
  {
    id: 'learn',
    name: 'Learn',
    subtitle: 'Build your foundation.',
    description: 'Core preparation with essential AI-powered learning.',
    originalPrice: '₹1,499/month',
    discount: '50% OFF',
    price: '₹749',
    period: '/month',
    badge: 'Foundation',
    isPopular: false,
    perk: 'Pre-launch registrants get an extra 10% OFF their first month.',
    features: [
      '3 years of PYQs',
      'Limited AI Tutor',
      'Core study material',
      'Limited mock tests',
      'Basic study plan',
      'Basic analytics',
      'Exam Predictor',
    ],
  },
  {
    id: 'achieve',
    name: 'Achieve',
    subtitle: 'Go deeper. Prepare smarter.',
    description: 'Advanced AI-powered preparation with deeper content, analysis, and personalization.',
    originalPrice: '₹2,999/month',
    discount: '50% OFF',
    price: '₹1,499',
    period: '/month',
    badge: 'Most Popular',
    isPopular: true,
    popularRibbon: 'Best for serious aspirants',
    perk: 'Pre-launch registrants get an extra 10% OFF their first month.',
    features: [
      '10 years of PYQs',
      '10× AI Tutor interactions/day',
      'In-depth study material',
      'Full mock test library',
      'Adaptive study plan',
      'Advanced analytics',
      'Rank Prediction',
      'Exam Predictor',
      'Predicted Questions for Your Next Exam',
      'Advanced personalized recommendations',
    ],
  },
  {
    id: 'focus',
    name: 'Focus',
    subtitle: 'Deep preparation for your target exam.',
    description: 'A complete, exam-focused preparation experience.',
    originalPrice: null,
    discount: null,
    price: '₹4,999',
    period: '/exam',
    badge: 'Full Exam Pass',
    isPopular: false,
    popularRibbon: null,
    perk: 'One-time fee • Complete exam cycle access until final results.',
    features: [
      '5 years of PYQs',
      '5× AI Tutor interactions/day',
      'Complete exam-focused study material',
      'Full mock test library',
      'Exam-specific study plan',
      'Advanced analytics',
      'Rank Prediction',
      'Exam Predictor',
      'Predicted Questions for Your Next Exam',
      'Exam-specific recommendations',
    ],
  },
];

const TARGET_LAUNCH_DATE = new Date('2026-10-15T10:00:00+05:30').getTime();

const calculateTimeLeft = () => {
  const diff = TARGET_LAUNCH_DATE - Date.now();
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
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());
  const [highlightForm, setHighlightForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    examStream: 'UPSC Civil Services (CSE)',
    targetYear: '2026',
    selectedPlan: 'achieve',
  });
  const [isSubmitted, setIsSubmitted] = useState(() => {
    try {
      return localStorage.getItem('smartrank_early_access_submitted') === 'true';
    } catch {
      return false;
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectPlan = (planId: string) => {
    setFormData((prev) => ({ ...prev, selectedPlan: planId }));
    const formEl = document.getElementById('early-access');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
      setHighlightForm(true);
      setTimeout(() => setHighlightForm(false), 2000);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    setIsSubmitting(true);

    try {
      await fetch('/api/early-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch {
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        localStorage.setItem('smartrank_early_access_submitted', 'true');
        localStorage.setItem('smartrank_early_access_data', JSON.stringify(formData));
      } catch {
      }
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      examStream: 'UPSC Civil Services (CSE)',
      targetYear: '2026',
      selectedPlan: 'achieve',
    });
    setIsSubmitted(false);
    try {
      localStorage.removeItem('smartrank_early_access_submitted');
      localStorage.removeItem('smartrank_early_access_data');
    } catch {
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      setTimeLeft(calculateTimeLeft());
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
    <Analytics/>
    <SpeedInsights/>
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="grid-overlay"></div>
      <canvas id="particleCanvas" ref={canvasRef}></canvas>

      <div className="top-announcement-bar">
        <div className="announcement-inner">
          <div className="announcement-left">
            <span className="announcement-badge">
              <span className="pulse-dot-small"></span>
              Launching 15 Oct 2026
            </span>
            <span className="announcement-text">
              <strong>50% OFF</strong> on Learn &amp; Achieve tiers + extra 10% pre-launch bonus!
            </span>
          </div>
          <a href="#campaign-banner" className="announcement-link">
            <span>Explore Plans &amp; Pricing</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>

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
              className="nav-btn nav-btn-outline"
              title="Explore on Hunarmind"
              aria-label="Explore on Hunarmind"
            >
              <span className="btn-text-full">Explore on Hunarmind</span>
              <span className="btn-text-short">Hunarmind</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </a>
            <a href="#early-access" className="nav-btn nav-btn-primary">
              <span className="btn-text-full">Request Early Access</span>
              <span className="btn-text-short">Early Access</span>
            </a>
          </div>
        </header>

        <main>
          <div className="status-badge">
            <span className="pulse-dot"></span>
            <span>Launching 15 October 2026 &bull; Competitive Exam Intelligence</span>
          </div>

          <h1 className="hero-title">
            The Future of Exam Intelligence is <span className="gradient-text">Almost Here.</span>
          </h1>

          <p className="hero-subtitle">
            Authentic exam-condition mock environments, adaptive syllabus diagnostics, and calibrated rank analytics across 400+ national and state competitive examinations.
          </p>

          <div className="motto-banner">
            <span>Plan</span>
            <span className="motto-dot">&bull;</span>
            <span>Practice</span>
            <span className="motto-dot">&bull;</span>
            <span>Progress</span>
          </div>

          <div className="countdown-wrapper">
            <div className="countdown-target-label">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Platform Go-Live: <strong>15 October 2026</strong></span>
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
          </div>

          <div className="hero-cta-wrapper">
            <a href="#campaign-banner" className="hero-cta-btn">
              <span>Explore Launch Plans (50% OFF)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </a>
          </div>

          {/* CAMPAIGN BANNER SECTION */}
          <section id="campaign-banner" className="campaign-banner-section">
            <div className="campaign-header-row">
              <div className="campaign-badge">
                <span className="campaign-fire-icon">🔥</span>
                <span>Official Launch: 15 October 2026 &bull; Early Bird Registration Open</span>
              </div>
            </div>

            <div className="campaign-showcase-card">
              <div className="campaign-showcase-grid">
                <div className="campaign-showcase-content">
                  <div className="campaign-brand-header">
                    <img src="/smartrank-logo.svg" alt="SmartRank" className="campaign-brand-logo" />
                  </div>

                  <h2 className="campaign-main-title">
                    Same Goal.<br />
                    <span className="gradient-text">Smarter Preparation.</span>
                  </h2>

                  <p className="campaign-main-subtitle">
                    AI-powered study plans, mock tests, PYQs, exam prediction and more &mdash; for every aspirant.
                  </p>

                  <div className="campaign-tags-group">
                    <div className="campaign-exams-label">Target Examinations:</div>
                    <div className="campaign-exam-chips">
                      {['SSC', 'UPSC', 'NEET', 'JEE', 'Banking', 'GATE', 'State PSCs'].map((exam) => (
                        <span key={exam} className="exam-chip">{exam}</span>
                      ))}
                      <span className="exam-chip exam-chip-accent">&amp; more...</span>
                    </div>
                  </div>

                  <div className="campaign-perk-callout">
                    <div className="perk-gift-badge">🎁</div>
                    <div className="perk-callout-text">
                      <strong>Pre-launch registrants get an extra 10% OFF their first month</strong>
                      <span>Applicable across both Learn and Achieve tiers when early access cohorts open.</span>
                    </div>
                  </div>

                  <div className="campaign-actions-row">
                    <a href="#campaign-pricing" className="campaign-primary-btn">
                      <span>Explore Tiered Plans</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                      </svg>
                    </a>
                    <button
                      type="button"
                      className="campaign-secondary-btn"
                      onClick={() => handleSelectPlan('achieve')}
                    >
                      <span>Lock in 50% Early Bird</span>
                    </button>
                  </div>
                </div>

                <div className="campaign-showcase-visual">
                  <div className="visual-polaroid-frame">
                    <div className="visual-img-wrap">
                      <img
                        src="/aspirant-hero.jpg"
                        alt="SmartRank Aspirant studying with motivation"
                        className="aspirant-photo"
                      />
                      <div className="visual-overlay-pill tag-future">
                        <span>Same Goal, Brighter Future! ↗</span>
                      </div>
                      <div className="visual-overlay-pill tag-mug">
                        <span>☕ Plan Today, Score Tomorrow</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div id="campaign-pricing" className="pricing-tiers-header">
              <span className="section-eyebrow">Launch Pricing &bull; Early Bird Window</span>
              <h3 className="pricing-section-title">Designed for Aspirants at Every Stage</h3>
              <p className="pricing-section-subtitle">
                Select your preferred tier below. 50% launch discount and extra 10% bonus apply to Learn and Achieve monthly tiers.
              </p>
            </div>

            <div className="pricing-tiers-grid">
              {campaignPlans.map((plan) => {
                const isSelected = formData.selectedPlan === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`pricing-card ${plan.isPopular ? 'is-popular' : ''} ${isSelected ? 'is-selected' : ''}`}
                  >
                    {plan.popularRibbon && (
                      <div className="popular-ribbon">
                        <span>★ {plan.popularRibbon}</span>
                      </div>
                    )}

                    <div className="pricing-card-top">
                      <div className={`pricing-icon-box icon-${plan.id}`}>
                        {plan.id === 'learn' && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                          </svg>
                        )}
                        {plan.id === 'achieve' && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
                          </svg>
                        )}
                        {plan.id === 'focus' && (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="6"></circle>
                            <circle cx="12" cy="12" r="2"></circle>
                          </svg>
                        )}
                      </div>

                      <div className="pricing-title-group">
                        <h4 className="plan-name">{plan.name}</h4>
                        <p className="plan-subtitle">{plan.subtitle}</p>
                      </div>
                    </div>

                    <p className="plan-description">{plan.description}</p>

                    <div className="pricing-amount-block">
                      {plan.originalPrice ? (
                        <div className="strikethrough-row">
                          <span className="strikethrough-price">{plan.originalPrice}</span>
                          {plan.discount && <span className="discount-pill">{plan.discount}</span>}
                        </div>
                      ) : (
                        <div className="strikethrough-row">
                          <span className="exam-pass-badge">Standard Exam Pass &bull; No Recurring Fees</span>
                        </div>
                      )}
                      <div className="price-main-display">
                        <span className="currency-num">{plan.price}</span>
                        <span className="price-period">{plan.period}</span>
                      </div>
                    </div>

                    <div className={`plan-perk-callout ${plan.id === 'focus' ? 'pass-callout' : ''}`}>
                      <span className="gift-emoji">{plan.id === 'focus' ? '🎯' : '🎁'}</span>
                      <span className="perk-note">{plan.perk}</span>
                    </div>

                    <div className="plan-divider"></div>

                    <div className="plan-features-block">
                      <div className="features-label">Included Capabilities:</div>
                      <ul className="plan-features-list">
                        {plan.features.map((feat) => (
                          <li key={feat} className="plan-feature-item">
                            <div className="feature-check-icon">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      className={`plan-select-btn ${plan.isPopular ? 'popular-btn' : ''} ${isSelected ? 'selected-btn' : ''}`}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      <span>{isSelected ? '✓ Plan Selected' : `Select ${plan.name} Plan`}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Platform 5 Pillars Strip */}
            <div className="campaign-pillars-strip">
              <div className="pillars-grid">
                <div className="pillar-item">
                  <div className="pillar-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04z"></path>
                      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.04z"></path>
                    </svg>
                  </div>
                  <div className="pillar-info">
                    <div className="pillar-title">AI-powered learning</div>
                    <div className="pillar-sub">Diagnostics &amp; adaptive tutoring</div>
                  </div>
                </div>

                <div className="pillar-divider"></div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <div className="pillar-info">
                    <div className="pillar-title">PYQs &amp; mock tests</div>
                    <div className="pillar-sub">10+ years categorized papers</div>
                  </div>
                </div>

                <div className="pillar-divider"></div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                  </div>
                  <div className="pillar-info">
                    <div className="pillar-title">Exam prediction &amp; analytics</div>
                    <div className="pillar-sub">Cutoff rank benchmarks</div>
                  </div>
                </div>

                <div className="pillar-divider"></div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18h6"></path>
                      <path d="M10 22h4"></path>
                      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                    </svg>
                  </div>
                  <div className="pillar-info">
                    <div className="pillar-title">Personalized study plans</div>
                    <div className="pillar-sub">Milestone roadmap pacing</div>
                  </div>
                </div>

                <div className="pillar-divider"></div>

                <div className="pillar-item">
                  <div className="pillar-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                  <div className="pillar-info">
                    <div className="pillar-title">Multiple languages</div>
                    <div className="pillar-sub">English &amp; Hindi mediums</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

          <section id="early-access" className="early-access-section">
            <span className="section-eyebrow">Priority Waitlist</span>
            <h2 className="section-title">Request Early Access</h2>
            <p className="section-desc">
              Get reserved access to our calibrated mock engine, adaptive diagnostic roadmaps, and authentic PYQ solutions ahead of our official launch on 15 October 2026.
            </p>

            <div className={`early-access-card ${highlightForm ? 'highlight-glow' : ''}`}>
              {isSubmitted ? (
                <div className="early-access-success">
                  <div className="success-icon-badge">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3>You&apos;re on the Priority Waitlist!</h3>
                  <p className="success-message">
                    {formData.selectedPlan === 'focus' ? (
                      <>
                        Thank you, <span className="highlight-text">{formData.name || 'Candidate'}</span>. Your early access reservation for <span className="highlight-text">{formData.examStream} ({formData.targetYear})</span> under the <span className="highlight-text">Focus Plan (₹4,999/exam)</span> has been received! We will send your private invite and onboarding link to <span className="highlight-text">{formData.email}</span> when candidate batches open.
                      </>
                    ) : (
                      <>
                        Thank you, <span className="highlight-text">{formData.name || 'Candidate'}</span>. Your early access reservation for <span className="highlight-text">{formData.examStream} ({formData.targetYear})</span> under the <span className="highlight-text">{formData.selectedPlan.toUpperCase()} Plan</span> has been received! We will send your private invite, 50% launch discount code, and 10% early-bird voucher to <span className="highlight-text">{formData.email}</span> when candidate batches open.
                      </>
                    )}
                  </p>
                  <button type="button" onClick={handleResetForm} className="reset-btn">
                    Register Another Candidate
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="early-access-form">
                  {formData.selectedPlan === 'focus' ? (
                    <div className="selected-plan-badge-callout focus-callout">
                      <div className="badge-callout-icon">🎯</div>
                      <div className="badge-callout-text">
                        <strong>Selected: Focus Plan (₹4,999/exam)</strong>
                        <span>Complete target exam preparation pass &mdash; one-time fee with full cycle access until final results.</span>
                      </div>
                      <a href="#campaign-pricing" className="switch-plan-link">Change</a>
                    </div>
                  ) : formData.selectedPlan && formData.selectedPlan !== 'undecided' ? (
                    <div className="selected-plan-badge-callout">
                      <div className="badge-callout-icon">✨</div>
                      <div className="badge-callout-text">
                        <strong>
                          Locking in: {formData.selectedPlan === 'learn' ? 'Learn Plan (₹749/mo - 50% OFF)' : 'Achieve Plan (₹1,499/mo - 50% OFF)'}
                        </strong>
                        <span>Your 50% launch discount and extra 10% pre-launch bonus will be automatically tied to your email.</span>
                      </div>
                      <a href="#campaign-pricing" className="switch-plan-link">Change</a>
                    </div>
                  ) : null}

                  <div className="form-group">
                    <label htmlFor="candidate-name" className="form-label">
                      Candidate Name
                    </label>
                    <input
                      id="candidate-name"
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Abhishek Sharma"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="candidate-email" className="form-label">
                      Email Address
                    </label>
                    <input
                      id="candidate-email"
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. candidate@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="target-exam" className="form-label">
                      Target Examination
                    </label>
                    <select
                      id="target-exam"
                      name="examStream"
                      value={formData.examStream}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="UPSC Civil Services (CSE)">UPSC Civil Services (CSE)</option>
                      <option value="SSC CGL / CHSL">SSC CGL / CHSL</option>
                      <option value="Banking (IBPS PO, SBI PO, RBI)">Banking (IBPS PO, SBI PO, RBI)</option>
                      <option value="Railways & Defense (RRB, NDA, CDS)">Railways &amp; Defense (RRB, NDA, CDS)</option>
                      <option value="State PSC (UPPSC, BPSC, MPSC, etc.)">State PSC (UPPSC, BPSC, MPSC, etc.)</option>
                      <option value="GATE / Engineering Services">GATE / Engineering Services</option>
                      <option value="Other Competitive Examination">Other Competitive Examination</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="target-year" className="form-label">
                      Target Exam Cycle
                    </label>
                    <select
                      id="target-year"
                      name="targetYear"
                      value={formData.targetYear}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="2026">2026 Exam Cycle</option>
                      <option value="2027">2027 Exam Cycle</option>
                      <option value="2028+">2028 or Later</option>
                    </select>
                  </div>

                  <div className="form-group form-group-full">
                    <label htmlFor="selected-plan" className="form-label">
                      Preferred Launch Plan &amp; Early Bird Discount
                    </label>
                    <select
                      id="selected-plan"
                      name="selectedPlan"
                      value={formData.selectedPlan}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="achieve">Achieve Plan &mdash; ₹1,499/mo (50% OFF + Extra 10% Bonus) [Recommended]</option>
                      <option value="learn">Learn Plan &mdash; ₹749/mo (50% OFF + Extra 10% Bonus)</option>
                      <option value="focus">Focus Plan &mdash; ₹4,999/exam (Complete Target Exam Pass)</option>
                      <option value="undecided">Undecided / Exploring Platform First</option>
                    </select>
                  </div>

                  <div className="form-submit-group">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="early-access-submit-btn"
                    >
                      {isSubmitting ? (
                        <span>Reserving Your Spot...</span>
                      ) : (
                        <>
                          <span>Lock In Early Bird Pricing</span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              <div className="early-access-perks">
                <div className="perk-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>50% Launch Discount + 10% Bonus</span>
                </div>
                <div className="perk-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Priority Diagnostic Baseline</span>
                </div>
                <div className="perk-item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Zero Cost During Beta Cohort</span>
                </div>
              </div>
            </div>
          </section>
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
            <a href="#campaign-banner" className="footer-link">
              Launch Plans
            </a>
            <a href="#early-access" className="footer-link">
              Request Early Access
            </a>
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
