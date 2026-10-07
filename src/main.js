import confetti from 'canvas-confetti';
import Lenis from 'lenis';
import { HeroThreeScene } from './threeScene.js';
import { TerminalCLI } from './terminal.js';
import { sound } from './audio.js';

// Project Deep-Dive Specification Data
const PROJECT_SPECS = {
  helios: {
    title: 'HELIOS — Enterprise API Engineering Workbench',
    category: 'API AST Compiler • Local RAG • Compliance Governance',
    liveUrl: 'https://helios-web-eosin.vercel.app/',
    githubUrl: 'https://github.com/pranjal9091',
    description: `
      HELIOS was engineered to eliminate fragmentation across enterprise API development lifecycles. Instead of treating OpenAPI specifications as static, disconnected documentation files, HELIOS compiles OpenAPI 2.0, 3.0, and 3.1 definitions into a single, canonical in-memory Abstract Syntax Tree (AST).
    `,
    metrics: [
      { label: 'Canary Test Suite', value: 'verify:ai (0% Hallucination)' },
      { label: 'Monorepo Architecture', value: '10 Decoupled Turborepo Packages' },
      { label: 'Local LLM Inference', value: 'Ollama (qwen2.5:7b) 100% Offline' },
      { label: 'Compliance Standards', value: 'PCI-DSS 4.0, HIPAA, OWASP Top 10' }
    ],
    architecture: `
      1. Unified AST Parser: Compiles heterogeneous OpenAPI formats into a single strongly-typed tree.
      2. Multi-Language CodeGen: Produces TypeScript, Python, and Go SDKs directly from the verified AST.
      3. Governance Engine: Audits schemas against PCI-DSS and HIPAA rules, yielding 0-100 scores and YAML fix patches.
      4. Local RAG Copilot: Embeds API schemas locally with Ollama, guaranteed zero third-party cloud data leakage.
    `
  },
  rhythmnet: {
    title: 'RhythmNet — Clinical Arrhythmia Intelligence',
    category: 'ANSI/AAMI EC57 • 1D-CNN • Pan-Tompkins Streaming',
    liveUrl: 'https://appapppy-fjy6mg2n2xbnrjzyezklmz.streamlit.app/',
    githubUrl: 'https://github.com/pranjal9091',
    description: `
      RhythmNet is a medical-grade deep learning system for automated cardiac arrhythmia classification and continuous ambulatory ECG stream processing, built strictly according to ANSI/AAMI EC57 clinical standards.
    `,
    metrics: [
      { label: 'Inter-Patient Protocol', value: 'de Chazal DS1/DS2 Split (Zero Leakage)' },
      { label: 'Inference Quantization', value: 'Static INT8 ONNX (Sub-ms Edge)' },
      { label: 'Continuous Filtering', value: '0.5 - 40 Hz Butterworth Bandpass' },
      { label: 'Deployment Stack', value: 'FastAPI + Streamlit + Docker' }
    ],
    architecture: `
      1. Signal Conditioning: 0.5-40Hz Butterworth bandpass filter removes baseline wander and high-frequency powerline noise.
      2. QRS Peak Engine: Continuous real-time Pan-Tompkins detection extracting R-R intervals and morphology.
      3. Neural Classifier: 1D-CNN / ResNet trained with Focal Loss to counteract extreme class imbalance.
      4. INT8 ONNX Runtime: Optimized static quantization allowing real-time clinical monitoring on resource-constrained hardware.
    `
  },
  shellmind: {
    title: 'ShellMind — Local-First Natural Language CLI',
    category: 'Rust • Zsh Integration • Type-State Security • Spotlight',
    liveUrl: 'https://shellmind-landing.vercel.app/',
    githubUrl: 'https://github.com/pranjal9091',
    description: `
      ShellMind is a local-first natural language command execution layer built for macOS zsh in Rust. It translates human intent into verified POSIX-compliant shell commands without compromising developer control.
    `,
    metrics: [
      { label: 'Tier-1 Regex Speed', value: '<1ms Execution' },
      { label: 'Compile-Time Safety', value: '&ValidatedPlan Type-State Pattern' },
      { label: 'Context Engine', value: 'macOS Spotlight + Local SQLite' },
      { label: 'Test Suite', value: '90 Adversarial Safety Tests' }
    ],
    architecture: `
      1. Type-State Safety Boundary: Compile-time state machine (&ValidatedPlan) prevents unvalidated commands from synthesizing.
      2. Neutralization: Enforces POSIX single-quoting to eliminate command injection attacks.
      3. Zero-Trust Buffer Injection: Utilizes \`print -z\` to inject commands into the active zsh prompt for mandatory human-in-the-loop review.
      4. Multi-Tier Resolution: Tier-1 deterministic regex executes in <1ms; Tier-2 falls back to local Ollama (qwen2.5:3b).
    `
  },
  airstrings: {
    title: 'AirStrings — Touchless Gesture Musical Instrument',
    category: 'Computer Vision • Tone.js Web Audio • MediaPipe • VJ Visuals',
    liveUrl: 'https://air-strings.vercel.app/',
    githubUrl: 'https://github.com/pranjal9091',
    description: `
      AirStrings transforms your standard webcam into a real-time, touchless musical instrument and stage visual synthesizer. By combining GPU-accelerated hand tracking with low-latency Web Audio synthesis, performers play strings and percussion in thin air.
    `,
    metrics: [
      { label: 'Hand Tracking', value: '2 Hands • 21 3D Landmarks per Hand' },
      { label: 'Jitter Smoothing', value: 'Adaptive Exponential Moving Average (EMA)' },
      { label: 'Audio Engine', value: 'Tone.js PolySynth + Limiter (-1dB)' },
      { label: 'Performance Latency', value: 'In-Browser 60 FPS Video-Audio Sync' }
    ],
    architecture: `
      1. Vision Layer: GPU-accelerated MediaPipe Tasks Vision extracts 21 3D joint landmarks per hand.
      2. Adaptive EMA: Eliminates camera landmark jitter while preserving natural rapid hand velocity.
      3. Pluck & Velocity Detection: Detects string-crossing trajectories and computes lateral swipe velocity.
      4. VJ Stage Layer: Luminescent particle trails and shockwave bloom rings synced to audio amplitude.
    `
  },
  p2pdrop: {
    title: 'P2P Drop — Zero-Server Browser File Streaming',
    category: 'WebRTC DataChannels • SCTP Streaming • SHA-256 WebCrypto',
    liveUrl: 'https://p2-p-drop.vercel.app/',
    githubUrl: 'https://github.com/pranjal9091/P2P-Drop',
    description: `
      P2P Drop enables zero-server, memory-to-memory file streaming directly between browser heaps. By bypassing intermediate cloud buckets, payloads stream at line rate with absolute cryptographic privacy.
    `,
    metrics: [
      { label: 'Server Storage', value: '0 Bytes (Pure Peer-to-Peer)' },
      { label: 'Chunking Protocol', value: '64 KB SCTP Chunks' },
      { label: 'Backpressure Engine', value: '8 MB High / 1 MB Low Watermark' },
      { label: 'Integrity Checksum', value: 'Bit-Perfect SHA-256 WebCrypto' }
    ],
    architecture: `
      1. Signaling Broker: Relays lightweight SDP Offer/Answer and Trickle ICE candidates before disconnecting.
      2. Direct P2P Channel: Establishes a DTLS 1.2+ encrypted WebRTC DataChannel directly between devices.
      3. Dynamic Backpressure: Coordinates memory buffer watermarks via \`onbufferedamountlow\` to prevent browser tab heap crashes.
      4. In-Memory Pipelining: Pre-fetches 2 MB data blocks into memory heaps for continuous throughput.
    `
  },
  chronolock: {
    title: 'Chronolock — Cryptographic Timelock Vault',
    category: 'Verifiable Delay Functions • Pietrzak Proofs • AES-256-GCM',
    liveUrl: 'https://chronolock-eight.vercel.app/',
    githubUrl: 'https://github.com/pranjal9091/Chronolock',
    description: `
      Chronolock is a mathematical cryptographic time capsule powered by Verifiable Delay Functions (VDF). It mathematically guarantees that encrypted secrets cannot be unlocked before a defined future time, even against high-performance computing clusters.
    `,
    metrics: [
      { label: 'VDF Mathematical Primitive', value: 'Sequential Squaring (x^(2^T) mod N)' },
      { label: 'Proof Protocol', value: 'Pietrzak O(log T) Halving Protocol' },
      { label: 'Verification Latency', value: 'Sub-5ms Verifier Execution' },
      { label: 'Payload Encryption', value: 'AES-256-GCM (Web Crypto API)' }
    ],
    architecture: `
      1. Non-Parallelizable Core: Sequential modular squarings ensure multi-core parallelization cannot bypass elapsed time.
      2. Pietrzak Verification: Succinct halving protocol enables instant sub-5ms verification of correct evaluation without re-running the work.
      3. Web Worker Multithreading: Offloads intensive computation to background workers with real-time progress calibration.
      4. Digital Capsule Packaging: Serializes ciphertext, modulus, iterations, and proofs into custom \`.chronolock\` files.
    `
  }
};

class PortfolioApp {
  constructor() {
    this.initSmoothScroll();
    this.initHero3D();
    this.initTerminal();
    this.initMagneticCursor();
    this.initProjectModal();
    this.initCopyButtons();
    this.initScrollSpy();
  }

  initSmoothScroll() {
    try {
      this.lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
      });

      const raf = (time) => {
        this.lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis initialization skipped:', e);
    }
  }

  initHero3D() {
    new HeroThreeScene('canvas-3d-container');
  }



  initTerminal() {
    this.terminal = new TerminalCLI();
  }

  initMagneticCursor() {
    const dot = document.getElementById('cursor-dot');
    const outline = document.getElementById('cursor-outline');
    if (!dot || !outline) return;

    let mouseX = -100;
    let mouseY = -100;
    let outlineX = -100;
    let outlineY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    const loop = () => {
      outlineX += (mouseX - outlineX) * 0.18;
      outlineY += (mouseY - outlineY) * 0.18;
      outline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
      requestAnimationFrame(loop);
    };
    loop();

    const targets = document.querySelectorAll('a, button, .project-card, .contact-card, .hackathon-card, .arena-badge-card');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        sound.playHover();
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  initProjectModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const inspectBtns = document.querySelectorAll('.btn-project-link.inspect');

    if (!modal) return;

    const openModal = (projectId) => {
      const data = PROJECT_SPECS[projectId];
      if (!data) return;

      sound.playShockwave();

      document.getElementById('modal-category').textContent = data.category;
      document.getElementById('modal-title').textContent = data.title;
      document.getElementById('modal-desc').textContent = data.description.trim();

      const metricsContainer = document.getElementById('modal-metrics');
      metricsContainer.innerHTML = '';
      data.metrics.forEach((m) => {
        const div = document.createElement('div');
        div.className = 'modal-metric-card glass';
        div.innerHTML = `
          <div class="metric-card-label">${m.label}</div>
          <div class="metric-card-value">${m.value}</div>
        `;
        metricsContainer.appendChild(div);
      });

      document.getElementById('modal-architecture').textContent = data.architecture.trim();
      document.getElementById('modal-live-link').href = data.liveUrl;
      document.getElementById('modal-github-link').href = data.githubUrl;

      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
      sound.playKeyClick();
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    };

    inspectBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-project-id');
        openModal(id);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  initCopyButtons() {
    const copyPhoneBtn = document.getElementById('copy-phone-btn');
    if (copyPhoneBtn) {
      copyPhoneBtn.addEventListener('click', () => {
        sound.playChime();
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.8 } });
        const phone = '+91-8171207094';
        if (navigator.clipboard) {
          navigator.clipboard.writeText(phone).then(() => {
            this.showToast('✓ Phone copied: +91-81712 07094');
          }).catch(() => {
            this.showToast('Phone: +91-81712 07094');
          });
        }
      });
    }
  }

  initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
      let current = '';
      const scrollY = window.pageYOffset;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  showToast(message) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }
}

// Bootstrap Application
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
