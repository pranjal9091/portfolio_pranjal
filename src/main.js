import confetti from 'canvas-confetti';
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
      HELIOS was engineered to resolve the fragmentation in enterprise API lifecycles. Instead of treating OpenAPI specifications as static documentation files, HELIOS parses OpenAPI 2.0, 3.0, and 3.1 definitions into a single, canonical in-memory Abstract Syntax Tree (AST).
    `,
    metrics: [
      { label: 'Canary Test Suite', value: 'verify:ai (0% Hallucination)' },
      { label: 'Monorepo Architecture', value: '10 Decoupled Turborepo Packages' },
      { label: 'Local LLM Inference', value: 'Ollama (qwen2.5:7b) 100% Offline' },
      { label: 'Compliance Standards', value: 'PCI-DSS 4.0, HIPAA, OWASP Top 10' }
    ],
    architecture: `
      1. Unified AST Parser: Compiles heterogeneous OpenAPI formats into a single strongly-typed tree.
      2. Multi-Language CodeGen: Produces TypeScript, Python, and Go SDKs from the verified AST.
      3. Governance Engine: Audits schemas against PCI-DSS and HIPAA rules, yielding 0-100 scores and YAML fix patches.
      4. Local RAG Copilot: Embeds API schemas locally with Ollama, guaranteed zero third-party cloud leakage.
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
      3. Pluck & Velocity Detection: Detects string-crossing trajectories and computes lateral swipe velocity ($v_x = \\Delta x / \\Delta t$).
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
    this.initHero3D();
    this.initTerminal();
    this.initSoundToggle();
    this.initMagneticCursor();
    this.initCardTilt();
    this.initProjectFilters();
    this.initProjectModal();
    this.initCopyButtons();
    this.initScrollHeader();
  }

  initHero3D() {
    new HeroThreeScene('canvas-3d-container');
  }

  initTerminal() {
    this.terminal = new TerminalCLI();
  }

  initSoundToggle() {
    const toggleBtn = document.getElementById('sound-toggle-btn');
    const iconOn = document.getElementById('sound-icon-on');
    const iconOff = document.getElementById('sound-icon-off');

    const updateIcons = () => {
      if (sound.enabled) {
        iconOn.classList.remove('hidden');
        iconOff.classList.add('hidden');
      } else {
        iconOn.classList.add('hidden');
        iconOff.classList.remove('hidden');
      }
    };

    updateIcons();

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const state = sound.toggle();
        updateIcons();
        this.showToast(state ? 'Mechanical Sound FX: Enabled' : 'Mechanical Sound FX: Muted');
      });
    }
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

    // Hover effect on interactive elements
    const targets = document.querySelectorAll('a, button, .project-card, .contact-channel-card, .filter-btn');
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

  initCardTilt() {
    const cards = document.querySelectorAll('.magnetic-tilt');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        sound.playKeyClick();
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        projectCards.forEach((card) => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.96)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('modal-dynamic-content');
    const closeBtn = document.getElementById('modal-close-btn');
    const inspectBtns = document.querySelectorAll('.inspect-btn');

    inspectBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-modal');
        const data = PROJECT_SPECS[projectId];
        if (!data) return;

        sound.playHover();

        modalContent.innerHTML = `
          <div class="modal-spec-header">
            <span class="project-category-tag">${data.category}</span>
            <h2 class="project-title" style="margin-top: 0.5rem; font-size: 1.85rem;">${data.title}</h2>
          </div>

          <p class="project-description" style="font-size: 1rem; margin-top: 1rem;">
            ${data.description}
          </p>

          <div style="margin: 1.5rem 0;">
            <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.85rem;">Key Performance Metrics</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
              ${data.metrics.map(m => `
                <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); padding: 0.75rem 1rem; border-radius: 8px;">
                  <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">${m.label}</div>
                  <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-accent); font-weight: 600; margin-top: 2px;">${m.value}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="margin: 1.5rem 0;">
            <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.85rem;">Architectural Breakdown</h4>
            <pre style="background: #0A0A0E; border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: 8px; font-family: var(--font-mono); font-size: 0.82rem; color: #D1D0C9; line-height: 1.6; white-space: pre-wrap;">${data.architecture.trim()}</pre>
          </div>

          <div style="display: flex; gap: 0.85rem; margin-top: 2rem;">
            <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
              <span>LAUNCH LIVE DEMO ↗</span>
            </a>
            <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
              <span>VIEW SOURCE REPO ↗</span>
            </a>
          </div>
        `;

        modal.classList.remove('hidden');
      });
    });

    const closeModal = () => {
      modal.classList.add('hidden');
      sound.playKeyClick();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }
  }

  initCopyButtons() {
    // Copy Email
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
      copyEmailBtn.addEventListener('click', () => {
        const email = copyEmailBtn.getAttribute('data-email');
        navigator.clipboard.writeText(email).then(() => {
          sound.playChime();
          this.triggerConfetti();
          this.showToast(`Email copied: ${email}`);
        });
      });
    }

    // Copy Phone
    const phoneCard = document.getElementById('phone-copy-card');
    if (phoneCard) {
      phoneCard.addEventListener('click', () => {
        const phone = phoneCard.getAttribute('data-phone');
        navigator.clipboard.writeText(phone).then(() => {
          sound.playChime();
          this.triggerConfetti();
          this.showToast(`Phone copied: ${phone}`);
        });
      });
    }
  }

  triggerConfetti() {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#E8D5B5', '#38BDF8', '#34D399']
    });
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2800);
  }

  initScrollHeader() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
