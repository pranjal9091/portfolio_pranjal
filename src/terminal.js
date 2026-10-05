import confetti from 'canvas-confetti';
import { sound } from './audio.js';
import { PRANJAL_ASCII_PORTRAIT } from './asciiPortrait.js';

// Music Easter Egg Configuration (Blinding Lights — The Weeknd)
const YOUTUBE_TRACK_IDS = ['fHI8X4OXluQ', '4NRXx6U8ABQ'];
const EQ_CHARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

/**
 * Interactive Hacker CLI Terminal Emulator
 * Commands: help, about, experience, projects, project <name>, skills, photo, contact, cv, play, pause, resume, stop, vol, now, sudo play, clear, matrix, open <target>
 */
export class TerminalCLI {
  constructor() {
    this.modal = document.getElementById('terminal-modal');
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.outputContainer = document.getElementById('terminal-output-container');
    this.closeBtn = document.getElementById('term-close-btn');

    this.history = [];
    this.historyIndex = -1;
    this.isMatrixRunning = false;

    // Cyberpunk Decryptor Mini-Game State
    this.gameSecretCode = Math.floor(1000 + Math.random() * 9000).toString();
    this.gameAttemptsLeft = 6;
    this.isGameActive = false;

    // Music Easter Egg State (YouTube IFrame API)
    this.ytPlayer = null;
    this.ytCurrentTrackIndex = 0;
    this.ytIsApiLoaded = false;
    this.ytIsApiLoading = false;
    this.ytIsPlaying = false;
    this.ytVolume = 80;
    this.ytVizInterval = null;
    this.ytVizElement = null;

    this.commands = {
      // Who / About aliases
      who: this.cmdWho.bind(this),
      w: this.cmdWho.bind(this),
      about: this.cmdWho.bind(this),
      whoami: this.cmdWho.bind(this),

      // Skills aliases
      skills: this.cmdSkills.bind(this),
      s: this.cmdSkills.bind(this),

      // Projects aliases
      projects: this.cmdProjects.bind(this),
      pj: this.cmdProjects.bind(this),
      project: this.cmdProjectDetail.bind(this),

      // Experience aliases
      experience: this.cmdExperience.bind(this),
      exp: this.cmdExperience.bind(this),

      // Interactive Terminal Game
      games: this.cmdGames.bind(this),
      g: this.cmdGames.bind(this),
      guess: (args) => this.cmdGuess(args),

      // Resume / CV
      resume: (args) => this.cmdCv(args),
      cv: this.cmdCv.bind(this),

      // Direct Contact Channels
      contact: this.cmdContact.bind(this),
      email: this.cmdEmail.bind(this),
      mail: this.cmdEmail.bind(this),
      linkedin: this.cmdLinkedIn.bind(this),
      li: this.cmdLinkedIn.bind(this),
      github: this.cmdGitHub.bind(this),
      gh: this.cmdGitHub.bind(this),
      phone: this.cmdPhone.bind(this),

      // Music Easter Egg
      play: (args) => this.cmdPlay(args),
      pause: (args) => this.cmdPause(args),
      stop: (args) => this.cmdStop(args),
      vol: (args) => this.cmdVolume(args),
      now: (args) => this.cmdNow(args),

      // System Utilities
      clear: this.cmdClear.bind(this),
      cls: this.cmdClear.bind(this),
      matrix: this.cmdMatrix.bind(this),
      open: this.cmdOpen.bind(this),
      date: () => [new Date().toUTCString()],
      repo: () => ['GitHub: https://github.com/pranjal9091'],
      sudo: (args) => this.cmdSudo(args),
      photo: this.cmdPhoto.bind(this),
      help: this.cmdHelp.bind(this),
    };

    this.bindEvents();
    this.printWelcome();
  }

  bindEvents() {
    // Open/Close triggers
    const triggerBtn = document.getElementById('terminal-trigger-btn');
    const heroBtn = document.getElementById('hero-terminal-btn');

    if (triggerBtn) triggerBtn.addEventListener('click', () => this.open());
    if (heroBtn) heroBtn.addEventListener('click', () => this.open());
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.close());

    // Close on backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Keyboard Shortcuts (Backtick ` or Escape)
    window.addEventListener('keydown', (e) => {
      if (e.key === '`' && !this.isInputFieldFocused()) {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });

    // Terminal Input events
    if (this.input) {
      this.input.addEventListener('keydown', (e) => this.handleInputKey(e));
      this.input.addEventListener('input', () => sound.playKeyClick());
    }

    // Quick toolbar buttons
    const toolBtns = document.querySelectorAll('.tb-cmd');
    toolBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) this.execute(cmd);
      });
    });

    // Click delegation on interactive bracketed commands inside terminal output
    if (this.output) {
      this.output.addEventListener('click', (e) => {
        const target = e.target.closest('[data-cmd]');
        if (target) {
          const cmd = target.getAttribute('data-cmd');
          if (cmd) {
            sound.playKeyClick();
            this.execute(cmd);
          }
        }
      });
    }
  }

  isInputFieldFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') && active !== this.input;
  }

  isOpen() {
    return this.modal && !this.modal.classList.contains('hidden');
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.remove('hidden');
    sound.playHover();
    setTimeout(() => {
      if (this.input) this.input.focus();
    }, 100);
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    sound.playKeyClick();
  }

  toggle() {
    if (this.isOpen()) this.close();
    else this.open();
  }

  printWelcome() {
    const banner = `
.########..########.....###....##....##.....##....###....##.......
.##.....##.##.....##...##.##...###...##.....##...##.##...##.......
.##.....##.##.....##..##...##..####..##.....##..##...##..##.......
.########..########..##.....##.##.##.##.....##.##.....##.##.......
.##........##...##...#########.##..####.##..##.#########.##.......
.##........##....##..##.....##.##...###.##..##.##.....##.##.......
.##........##.....##.##.....##.##....##..####..##.....##.########.

..######...####..######...##....##.##.....##
.##....##...##..##....##...###...##.##.....##
.##.........##..##.........####..##.##.....##
..######....##..##...####..##.##.##.#########
.......##...##..##....##...##..####.##.....##
.##....##...##..##....##...##...###.##.....##
..######...####..######....##....##.##.....##
    `.trim();

    this.printLine(`<pre class="term-banner" style="color: #34D399; font-size: 0.62rem; line-height: 1.15; margin-bottom: 0.85rem;">${banner}</pre>`);
    this.printLine('<div>Welcome to my personal portfolio! (Version 2.4.0)</div>');
    this.printLine('<div>Type <span class="term-highlight">\'help\'</span> to see the list of available commands.</div>');
    this.printLine('<div style="margin: 0.65rem 0;"><span style="color: #FB7185; font-weight: 700;">NEW</span> try <span class="term-interactive-cmd" data-cmd="project helios">HELIOS</span> & <span class="term-interactive-cmd" data-cmd="project rhythmnet">RhythmNet</span></div>');
    this.printLine('<div class="term-highlight" style="margin-top: 0.85rem; font-weight: 700;">Available Commands:</div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="who">[who]</span> or <span class="term-bracket-cmd" data-cmd="w">[w]</span></div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="skills">[skills]</span> or <span class="term-bracket-cmd" data-cmd="s">[s]</span></div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="projects">[projects]</span> or <span class="term-bracket-cmd" data-cmd="pj">[pj]</span></div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="experience">[experience]</span> or <span class="term-bracket-cmd" data-cmd="exp">[exp]</span></div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="games">[games]</span> or <span class="term-bracket-cmd" data-cmd="g">[g]</span></div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="resume">[resume]</span> or <span class="term-bracket-cmd" data-cmd="cv">[cv]</span></div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="clear">[clear]</span></div>');
    this.printLine('<div class="term-highlight" style="margin-top: 0.85rem; font-weight: 700;">Contact Me:</div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="email">[email]</span></div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="linkedin">[linkedin]</span></div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="github">[github]</span></div>');
    this.printLine('<div><span class="term-bracket-cmd" data-cmd="phone">[phone]</span></div>');
    this.printLine('<div class="term-dim" style="margin-top: 0.65rem;">------------------------------------------------------------------------</div>');
  }

  handleInputKey(e) {
    if (e.key === 'Enter') {
      const val = this.input.value.trim();
      if (val) {
        this.history.push(val);
        this.historyIndex = this.history.length;
        this.execute(val);
        this.input.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0 && this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.handleAutocomplete();
    }
  }

  handleAutocomplete() {
    const val = this.input.value.trim().toLowerCase();
    if (!val) return;

    const available = Object.keys(this.commands);
    const matches = available.filter((c) => c.startsWith(val));
    if (matches.length === 1) {
      this.input.value = matches[0];
      sound.playKeyClick();
    }
  }

  execute(commandStr) {
    const trimmed = commandStr.trim();
    if (!trimmed) return;

    // Echo user input
    this.printLine(`<div><span class="terminal-prompt"><span class="user">pranjal</span><span class="at">@</span><span class="host">quantum</span>:<span class="path">~</span><span class="dollar">$</span></span> <span class="term-cmd-echo">${trimmed}</span></div>`);

    const lower = trimmed.toLowerCase();

    // Natural phrases handling
    if (lower === 'who is pranjal' || lower === 'who is' || lower === 'whois' || lower === 'who is kuber') {
      const result = this.cmdWho();
      if (Array.isArray(result)) {
        result.forEach((line) => this.printLine(line));
      }
      this.scrollToBottom();
      return;
    }

    if (lower === 'sudo play') {
      const result = this.cmdSudo(['play']);
      if (Array.isArray(result)) {
        result.forEach((line) => this.printLine(line));
      }
      this.scrollToBottom();
      return;
    }

    if (lower === 'contact me') {
      const result = this.cmdContact();
      if (Array.isArray(result)) {
        result.forEach((line) => this.printLine(line));
      }
      this.scrollToBottom();
      return;
    }

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (this.commands[cmd]) {
      const result = this.commands[cmd](args);
      if (Array.isArray(result)) {
        result.forEach((line) => this.printLine(line));
      }
    } else {
      this.printLine(`<div class="term-error">zsh: command not found: ${cmd}. Type <span class="term-highlight">help</span> or <span class="term-bracket-cmd" data-cmd="who">[who]</span> for available commands.</div>`);
    }

    this.scrollToBottom();
  }

  printLine(htmlContent) {
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = htmlContent;
    this.output.appendChild(line);
  }

  scrollToBottom() {
    if (this.outputContainer) {
      this.outputContainer.scrollTop = this.outputContainer.scrollHeight;
    }
  }

  // COMMAND HANDLERS
  cmdHelp() {
    sound.playHover();
    return [
      '<div class="term-highlight">AVAILABLE COMMANDS:</div>',
      '  <span class="term-success">[who] or [w]</span>        - Bio with ASCII Matrix portrait (or "who is pranjal")',
      '  <span class="term-success">[skills] or [s]</span>     - Categorized engineering competencies & stack',
      '  <span class="term-success">[projects] or [pj]</span>   - 6 flagship production & research architectures',
      '  <span class="term-success">project &lt;id&gt;</span>        - Architecture deep dive (e.g. "project helios")',
      '  <span class="term-success">[experience] or [exp]</span> - Stealthera Innovations & Arovia Startup timeline',
      '  <span class="term-success">[games] or [g]</span>      - Playable Cyberpunk Quantum Decryptor mini-game',
      '  <span class="term-success">[resume] or [cv]</span>     - Open / download curriculum vitae (PDF)',
      '  <span class="term-success">[email]</span>             - Copy email & trigger client',
      '  <span class="term-success">[linkedin]</span>          - Launch LinkedIn profile in new tab',
      '  <span class="term-success">[github]</span>            - Launch GitHub profile in new tab',
      '  <span class="term-success">[phone]</span>             - Copy telephone contact to clipboard',
      '  <span class="term-success">clear</span>              - Clear terminal screen buffer',
      '',
      '<div class="term-highlight">🎵 MUSIC PLAYER (EASTER EGG):</div>',
      '  <span class="term-success">play</span>               - Start "Blinding Lights" — The Weeknd',
      '  <span class="term-success">pause</span>              - Pause music playback',
      '  <span class="term-success">resume</span>             - Continue playback',
      '  <span class="term-success">stop</span>               - Stop music and reset to 0:00',
      '  <span class="term-success">vol &lt;0-100&gt;</span>        - Set volume level (e.g. "vol 80")',
      '  <span class="term-success">now</span>                - Show track, artist, elapsed / total duration',
      '  <span class="term-success">sudo play</span>          - Superuser playback override 😎',
    ];
  }

  cmdWho() {
    sound.playHover();
    const asciiHtml = `<div class="term-matrix-ascii">${PRANJAL_ASCII_PORTRAIT}</div>`;
    const bioHtml = `
      <div class="term-bio-col">
        <p class="term-bio-p">
          Hi! I'm <strong>Pranjal Singh</strong> (<strong>@pranjal9091</strong>), an AI & Systems Engineer from <strong>IIIT Ranchi</strong>.
        </p>
        <p class="term-bio-p">
          Chances are, you've come here after seeing one of my projects. Most of them start as an obsessive engineering deep-dive and turn into high-performance systems — run <span class="term-interactive-cmd" data-cmd="projects">projects</span> to inspect my favorite architectures.
        </p>
        <p class="term-bio-p">
          I'm studying Electronics & Communication Engineering at <strong class="term-highlight">IIIT Ranchi</strong> (CGPA: <strong>8.27</strong>).
          Currently, I'm an AI Engineer Intern at <strong class="term-highlight">Stealthera Innovations</strong>, building production speech recognition & real-time voice intelligence pipelines with Faster-Whisper.
        </p>
        <p class="term-bio-p">
          In my first year, I founded <strong class="term-highlight">Arovia</strong>, architecting 24/7 continuous wearable biometric monitoring and doctor-grade preventative cardiac anomaly detection.
        </p>
        <p class="term-bio-p">
          Alongside voice and clinical ML, I engineer local-first natural language CLI layers in Rust (<span class="term-interactive-cmd" data-cmd="project shellmind">ShellMind</span>), zero-server browser streaming (<span class="term-interactive-cmd" data-cmd="project p2pdrop">P2P Drop</span>), and non-parallelizable cryptographic timelock vaults (<span class="term-interactive-cmd" data-cmd="project chronolock">Chronolock</span>).
        </p>
        <p class="term-bio-p">
          <strong>Quick stats:</strong> SIH National Qualifier, 200+ DSA problems solved, CodeChef Peak <strong>1553</strong>. At my core, I love building low-latency, zero-cloud-leakage systems that feel like magic.
        </p>
      </div>
    `;

    return [
      `<div class="term-card">
        <div class="term-portrait-col">${asciiHtml}</div>
        ${bioHtml}
      </div>`
    ];
  }

  cmdAbout() {
    sound.playHover();
    return [
      '<div class="term-highlight">// PRANJAL SINGH — SYSTEMS & AI ENGINEER</div>',
      'Undergrad in <span class="term-success">Electronics & Communication Engineering</span> @ <span class="term-highlight">IIIT Ranchi</span> (2024 - 2028).',
      'Cumulative Grade Point Average: <span class="term-highlight">8.27 / 10.0</span>',
      'Current Position: <span class="term-success">AI Engineer Intern @ Stealthera Innovations Pvt. Ltd.</span>',
      '',
      '<div class="term-dim">Philosophy:</div>',
      'Bridging low-level signal processing intuition (sampling, Fourier transforms, bandwidth bottlenecks) with high-level AI systems and zero-server distributed compute.',
      'Key Highlights: SIH National Qualifier, CodeChef Peak 1553, 200+ DSA Problems Solved.',
    ];
  }

  cmdExperience() {
    sound.playHover();
    return [
      '<div class="term-highlight">// WORK EXPERIENCE & TRACK RECORD</div>',
      '',
      '1. <span class="term-success">AI Engineer Intern</span> — <span class="term-highlight">Stealthera Innovations Pvt. Ltd.</span> [Jun 2026 - Present | Remote]',
      '   • Engineered production speech recognition pipelines using Faster-Whisper and ASR architectures.',
      '   • Audio signal preprocessing: segmentation, dynamic range normalization, and anomaly detection.',
      '   • Fine-tuned models and optimized inference latency for streaming voice solutions.',
      '   • Multi-model comparative benchmarks across WER, latency, and memory footprint.',
      '',
      '2. <span class="term-success">Founder & Lead Architect</span> — <span class="term-highlight">Arovia</span> [2024 - 2025 | Healthtech & Wearables]',
      '   • Architected 24/7 real-time biometric telemetry engine streaming continuous wearable sensor vitals.',
      '   • Built anomaly detection pipelines flagging cardiac rhythm irregularities, spikes & stress markers.',
      '   • Converted noisy biometric data streams into actionable doctor-grade preventative health summaries.',
    ];
  }

  cmdProjects() {
    sound.playHover();
    return [
      '<div class="term-highlight">// 6 VERIFIED FLAGSHIP PRODUCTION ARCHITECTURES</div>',
      '',
      '1. <span class="term-highlight">HELIOS</span> — Enterprise API Workbench & Local RAG Copilot',
      '   Stack: Next.js 14, Turborepo, Ollama, OpenAPI AST Compiler, PCI-DSS / HIPAA',
      '   URL: <a class="term-link" href="https://helios-web-eosin.vercel.app/" target="_blank">https://helios-web-eosin.vercel.app/</a>',
      '',
      '2. <span class="term-highlight">RhythmNet</span> — Clinical Inter-Patient ECG Arrhythmia Intelligence',
      '   Stack: PyTorch 1D-CNN, ANSI/AAMI EC57, Pan-Tompkins Engine, Static INT8 ONNX, FastAPI',
      '   URL: <a class="term-link" href="https://appapppy-fjy6mg2n2xbnrjzyezklmz.streamlit.app/" target="_blank">https://appapppy-fjy6mg2n2xbnrjzyezklmz.streamlit.app/</a>',
      '',
      '3. <span class="term-highlight">ShellMind</span> — Local-First Natural Language AI Shell for macOS',
      '   Stack: Rust, Zsh, Type-State Safety (&ValidatedPlan), Spotlight API, SQLite',
      '   URL: <a class="term-link" href="https://shellmind-landing.vercel.app/" target="_blank">https://shellmind-landing.vercel.app/</a>',
      '',
      '4. <span class="term-highlight">AirStrings</span> — Gesture-Controlled Virtual Musical Instrument',
      '   Stack: MediaPipe Vision (21 3D Landmarks), Tone.js PolySynth, Web Audio DSP',
      '   URL: <a class="term-link" href="https://air-strings.vercel.app/" target="_blank">https://air-strings.vercel.app/</a>',
      '',
      '5. <span class="term-highlight">P2P Drop</span> — Zero-Server Browser-to-Browser File Streaming',
      '   Stack: WebRTC DataChannels, STUN/ICE (RFC 8445), 64KB SCTP, SHA-256 Checksums',
      '   URL: <a class="term-link" href="https://p2-p-drop.vercel.app/" target="_blank">https://p2-p-drop.vercel.app/</a>',
      '',
      '6. <span class="term-highlight">Chronolock</span> — Cryptographic Timelock Encryption Vault',
      '   Stack: Verifiable Delay Functions (VDF x^(2^T) mod N), Pietrzak O(log T), AES-256-GCM',
      '   URL: <a class="term-link" href="https://chronolock-eight.vercel.app/" target="_blank">https://chronolock-eight.vercel.app/</a>',
    ];
  }

  cmdProjectDetail(args) {
    if (!args || args.length === 0) {
      return ['Usage: <span class="term-highlight">project &lt;helios | rhythmnet | shellmind | airstrings | p2pdrop | chronolock&gt;</span>'];
    }
    const id = args[0].toLowerCase();
    sound.playHover();

    switch (id) {
      case 'helios':
        return [
          '<div class="term-highlight">[SPECS] HELIOS — ENTERPRISE API WORKBENCH</div>',
          '• AST Compiler: Parses OpenAPI 2.0/3.0/3.1 specs into one canonical in-memory AST.',
          '• Local Copilot: Ollama (qwen2.5:7b) with canary test suite (`verify:ai`) ensuring 0% hallucination.',
          '• Compliance: Automatic PCI-DSS 4.0, HIPAA, and OWASP Top 10 auditing with YAML auto-remediation.',
          '• Monorepo: Turborepo with 10 decoupled packages sharing single AST representation.',
          '• Live URL: <a class="term-link" href="https://helios-web-eosin.vercel.app/" target="_blank">https://helios-web-eosin.vercel.app/</a>'
        ];
      case 'rhythmnet':
        return [
          '<div class="term-highlight">[SPECS] RhythmNet — CLINICAL ARRHYTHMIA CLASSIFICATION</div>',
          '• Rigor: ANSI/AAMI EC57 compliant; strict de Chazal DS1/DS2 inter-patient train/test split.',
          '• Diagnostics: Categorizes N (Normal), SVEB, VEB, F (Fusion), and Q (Paced/Unknown) arrhythmias.',
          '• Streaming: Continuous Pan-Tompkins QRS peak detection with 0.5-40Hz Butterworth filtering.',
          '• Quantization: Static INT8 ONNX graph quantization providing sub-millisecond edge CPU inference.',
          '• Live URL: <a class="term-link" href="https://appapppy-fjy6mg2n2xbnrjzyezklmz.streamlit.app/" target="_blank">https://appapppy-fjy6mg2n2xbnrjzyezklmz.streamlit.app/</a>'
        ];
      case 'shellmind':
        return [
          '<div class="term-highlight">[SPECS] ShellMind — LOCAL-FIRST RUST CLI FOR MACOS</div>',
          '• Safety: Type-State pattern (&ValidatedPlan) enforces compile-time denial of unvalidated commands.',
          '• Blocked Roots: Syntactically guarantees rm, sudo, and system root modifications cannot compile.',
          '• Buffer Injection: Uses `print -z` for mandatory human-in-the-loop inspection before execution.',
          '• Performance: <1ms Tier-1 deterministic regex matching; local Ollama fallback for natural language.',
          '• Live URL: <a class="term-link" href="https://shellmind-landing.vercel.app/" target="_blank">https://shellmind-landing.vercel.app/</a>'
        ];
      case 'airstrings':
        return [
          '<div class="term-highlight">[SPECS] AirStrings — TOUCHLESS GESTURE INSTRUMENT</div>',
          '• Computer Vision: GPU-accelerated MediaPipe tracking 2 hands (21 3D landmarks per hand).',
          '• Jitter Elimination: Custom adaptive Exponential Moving Average (EMA) landmark filtering.',
          '• Audio DSP: Tone.js PolySynth with output limiter (-1dB) preventing digital audio clipping.',
          '• Modes: String mode (Pentatonic, Dorian, InSen, Chromatic) + 8-pad Percussion mode.',
          '• Live URL: <a class="term-link" href="https://air-strings.vercel.app/" target="_blank">https://air-strings.vercel.app/</a>'
        ];
      case 'p2pdrop':
      case 'p2p':
        return [
          '<div class="term-highlight">[SPECS] P2P Drop — ZERO-SERVER MEMORY-TO-MEMORY FILE STREAMING</div>',
          '• Data Path: Zero intermediate server storage; direct browser memory heap streaming via WebRTC.',
          '• Chunking: 64 KB SCTP chunks with 2 MB memory block pre-fetching.',
          '• Backpressure Engine: 8 MB high watermark, 1 MB low watermark using `onbufferedamountlow`.',
          '• Verification: Bit-perfect SHA-256 WebCrypto checksum verification on receiver node.',
          '• Live URL: <a class="term-link" href="https://p2-p-drop.vercel.app/" target="_blank">https://p2-p-drop.vercel.app/</a>'
        ];
      case 'chronolock':
        return [
          '<div class="term-highlight">[SPECS] Chronolock — CRYPTOGRAPHIC TIMELOCK VAULT</div>',
          '• Primitive: Verifiable Delay Functions (VDF) using sequential modular squarings (x^(2^T) mod N).',
          '• Non-Parallelizable: Mathematical guarantee that supercomputers cannot solve faster than wall-clock time.',
          '• Verification: Pietrzak O(log T) halving protocol verifiable in sub-5ms with zero third parties.',
          '• Payload: AES-256-GCM encryption packaged into custom `.chronolock` digital capsules.',
          '• Live URL: <a class="term-link" href="https://chronolock-eight.vercel.app/" target="_blank">https://chronolock-eight.vercel.app/</a>'
        ];
      default:
        return [`<span class="term-error">Unknown project: ${id}</span>. Options: helios, rhythmnet, shellmind, airstrings, p2pdrop, chronolock.`];
    }
  }

  cmdSkills() {
    sound.playHover();
    return [
      '<div class="term-highlight">// TECHNICAL COMPETENCIES</div>',
      '• <span class="term-success">Languages:</span> Python, Rust, C++, TypeScript, JavaScript, SQL, Zsh Shell',
      '• <span class="term-success">AI & Speech:</span> Whisper, Faster-Whisper, PyTorch, Ollama, ONNX INT8, LangChain',
      '• <span class="term-success">Web & Distributed:</span> WebRTC DataChannels, Web Audio API, Web Crypto API, MediaPipe, Next.js 14, FastAPI',
      '• <span class="term-success">Cryptography & Systems:</span> Verifiable Delay Functions, AES-256-GCM, Pietrzak Proofs, Turborepo, Docker',
    ];
  }

  cmdPhoto() {
    sound.playChime();
    return [
      '<div class="term-highlight">// RENDERING PRANJAL SINGH PORTRAIT:</div>',
      '<img src="./assets/pranjal.jpg" alt="Pranjal Singh" class="term-photo-preview" />',
      '<div class="term-dim">Pranjal Singh — Systems & AI Engineer (IIIT Ranchi ECE \'28)</div>'
    ];
  }

  cmdContact() {
    sound.playHover();
    return [
      '<div class="term-highlight">// CONTACT CHANNELS</div>',
      '• Email:    <a class="term-link" href="mailto:pranjalsingh9091@gmail.com">pranjalsingh9091@gmail.com</a>',
      '• Phone:    <span class="term-success">+91-81712 07094</span>',
      '• GitHub:   <a class="term-link" href="https://github.com/pranjal9091" target="_blank">github.com/pranjal9091</a>',
      '• LinkedIn: <a class="term-link" href="https://linkedin.com/in/pranjal-singh" target="_blank">linkedin.com/in/pranjal-singh</a>',
    ];
  }

  cmdCv() {
    sound.playChime();
    window.open('/resume.pdf', '_blank');
    return ['[INITIATED] Opening curriculum vitae in external tab...'];
  }

  cmdGames() {
    sound.playShockwave();
    this.gameSecretCode = Math.floor(1000 + Math.random() * 9000).toString();
    this.gameAttemptsLeft = 6;
    this.isGameActive = true;
    return [
      '<div class="term-highlight">// CYBERPUNK 2077 // QUANTUM CIPHER DECRYPTOR</div>',
      '<div class="term-dim">Mission: A 4-digit cryptographic lock is sealing the root mainframe.</div>',
      'Rules: Type <span class="term-highlight">guess &lt;4-digit-code&gt;</span> (e.g. <span class="term-interactive-cmd" data-cmd="guess 4729">guess 4729</span>).',
      'Feedback: <span class="term-success">● Exact match</span> (correct digit & position) | <span style="color:#FBBF24;">▲ Partial</span> (correct digit, wrong position).',
      `You have <span class="term-highlight">${this.gameAttemptsLeft}</span> decryption attempts remaining.`,
      '<div class="term-success">[SECURITY SYSTEM ACTIVE] Enter your first guess:</div>'
    ];
  }

  cmdGuess(args) {
    if (!this.isGameActive) {
      return [
        '<div class="term-error">No active decryption session.</div>',
        'Type <span class="term-bracket-cmd" data-cmd="games">[games]</span> or <span class="term-bracket-cmd" data-cmd="g">[g]</span> to initialize a new cipher lock.'
      ];
    }
    if (!args || args.length === 0 || !/^\d{4}$/.test(args[0])) {
      sound.playKeyClick();
      return ['<div class="term-error">Invalid input. Usage: guess &lt;4-digit-number&gt; (e.g. "guess 5821")</div>'];
    }

    const guess = args[0];
    const secret = this.gameSecretCode;

    if (guess === secret) {
      sound.playChime();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      this.isGameActive = false;
      return [
        `<div class="term-success" style="font-weight: 700; font-size: 1.05rem;">ACCESS GRANTED! ROOT MAINFRAME DECRYPTED. 🎉</div>`,
        `<div class="term-highlight">Cipher [${secret}] cracked with ${this.gameAttemptsLeft} attempts remaining!</div>`,
        '<div class="term-dim">You earned Level 99 Cyberpunk Clearance. Type <span class="term-bracket-cmd" data-cmd="games">[games]</span> to play again or <span class="term-bracket-cmd" data-cmd="play">[play]</span> to celebrate with music!</div>'
      ];
    }

    this.gameAttemptsLeft--;
    let exact = 0;
    let partial = 0;
    const secretArr = secret.split('');
    const guessArr = guess.split('');
    const usedSecret = [false, false, false, false];
    const usedGuess = [false, false, false, false];

    // Find exact matches
    for (let i = 0; i < 4; i++) {
      if (guessArr[i] === secretArr[i]) {
        exact++;
        usedSecret[i] = true;
        usedGuess[i] = true;
      }
    }

    // Find partial matches
    for (let i = 0; i < 4; i++) {
      if (!usedGuess[i]) {
        for (let j = 0; j < 4; j++) {
          if (!usedSecret[j] && guessArr[i] === secretArr[j]) {
            partial++;
            usedSecret[j] = true;
            break;
          }
        }
      }
    }

    const numGuess = parseInt(guess, 10);
    const numSecret = parseInt(secret, 10);
    const rangeHint = numGuess < numSecret ? 'Higher ↑' : 'Lower ↓';

    if (this.gameAttemptsLeft <= 0) {
      sound.playKeyClick();
      this.isGameActive = false;
      return [
        `<div class="term-error">DECRYPTION FAILED! QUANTUM LOCKOUT INITIATED.</div>`,
        `The secret cipher was: <span class="term-highlight">${secret}</span>`,
        'Type <span class="term-bracket-cmd" data-cmd="games">[games]</span> to retry with a new code.'
      ];
    }

    sound.playHover();
    return [
      `Attempt result for [${guess}]: <span class="term-success">${exact} Exact</span>, <span style="color:#FBBF24;">${partial} Partial</span> | Hint: <span class="term-highlight">${rangeHint}</span>`,
      `Attempts left: <span class="term-highlight">${this.gameAttemptsLeft}</span>. Type <span class="term-interactive-cmd" data-cmd="guess ">guess &lt;code&gt;</span>`
    ];
  }

  cmdEmail() {
    sound.playChime();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    const email = 'pranjalsingh9091@gmail.com';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).catch(() => {});
    }
    window.location.href = `mailto:${email}`;
    return [
      `<div class="term-success">✓ Copied to clipboard & opened mail client:</div>`,
      `<a class="term-link" href="mailto:${email}">${email}</a>`
    ];
  }

  cmdLinkedIn() {
    sound.playChime();
    const url = 'https://linkedin.com/in/pranjal-singh';
    window.open(url, '_blank');
    return [
      `<div class="term-success">✓ Launching LinkedIn profile in new tab:</div>`,
      `<a class="term-link" href="${url}" target="_blank">${url}</a>`
    ];
  }

  cmdGitHub() {
    sound.playChime();
    const url = 'https://github.com/pranjal9091';
    window.open(url, '_blank');
    return [
      `<div class="term-success">✓ Launching GitHub profile in new tab:</div>`,
      `<a class="term-link" href="${url}" target="_blank">${url}</a>`
    ];
  }

  cmdPhone() {
    sound.playChime();
    const phone = '+91-8171207094';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone).catch(() => {});
    }
    return [
      `<div class="term-success">✓ Telephone number copied to clipboard:</div>`,
      `<span class="term-highlight">${phone}</span> (Pranjal Singh)`
    ];
  }

  // --- MUSIC EASTER EGG IMPLEMENTATION ---

  getOrCreatePlayerContainer() {
    let container = document.getElementById('yt-player-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-player-container';
      container.setAttribute('aria-hidden', 'true');
      // Hidden: 1px, off-screen, NOT display:none
      container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0.01;pointer-events:none;z-index:-1000;overflow:hidden;';
      const inner = document.createElement('div');
      inner.id = 'yt-player-iframe';
      container.appendChild(inner);
      document.body.appendChild(container);
    }
    return container;
  }

  loadYouTubeApi(callback) {
    if (window.YT && window.YT.Player) {
      callback();
      return;
    }
    if (this.ytIsApiLoading) {
      const check = setInterval(() => {
        if (window.YT && window.YT.Player) {
          clearInterval(check);
          callback();
        }
      }, 50);
      return;
    }

    this.ytIsApiLoading = true;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevOnReady === 'function') prevOnReady();
      this.ytIsApiLoaded = true;
      this.ytIsApiLoading = false;
      callback();
    };
  }

  initYouTubePlayer(onReady) {
    this.getOrCreatePlayerContainer();
    const videoId = YOUTUBE_TRACK_IDS[this.ytCurrentTrackIndex];

    this.ytPlayer = new window.YT.Player('yt-player-iframe', {
      height: '1',
      width: '1',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        playsinline: 1,
        enablejsapi: 1,
        rel: 0,
      },
      events: {
        onReady: (event) => {
          try {
            event.target.setVolume(this.ytVolume);
            event.target.playVideo();
          } catch (e) {
            console.error('YT playVideo error:', e);
          }
          this.ytIsPlaying = true;
          this.startVisualizer();
          if (typeof onReady === 'function') onReady();
        },
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            this.ytIsPlaying = true;
            this.startVisualizer();
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            this.ytIsPlaying = false;
            this.stopVisualizer(false);
          } else if (event.data === window.YT.PlayerState.ENDED) {
            this.ytIsPlaying = false;
            this.stopVisualizer(true);
            this.printLine('<div class="term-dim">⏹ track ended: Blinding Lights — The Weeknd</div>');
            this.scrollToBottom();
          }
        },
        onError: (event) => {
          const errorCode = event.data;
          console.warn('YouTube Player error code:', errorCode, 'on ID:', YOUTUBE_TRACK_IDS[this.ytCurrentTrackIndex]);
          
          // Codes: 2 (invalid param), 5 (HTML5 player error), 100 (video not found/removed), 101 / 150 (not allowed in embedded players)
          if (this.ytCurrentTrackIndex + 1 < YOUTUBE_TRACK_IDS.length) {
            this.ytCurrentTrackIndex++;
            console.log('Switching to fallback YouTube ID:', YOUTUBE_TRACK_IDS[this.ytCurrentTrackIndex]);
            if (this.ytPlayer && typeof this.ytPlayer.loadVideoById === 'function') {
              this.ytPlayer.loadVideoById(YOUTUBE_TRACK_IDS[this.ytCurrentTrackIndex]);
            }
          } else {
            this.ytIsPlaying = false;
            this.stopVisualizer(true);
            this.printLine('<div class="term-error">audio unavailable, try again later</div>');
            this.scrollToBottom();
          }
        },
      },
    });
  }

  startVisualizer() {
    this.stopVisualizer(false);

    // Create a dedicated line for visualizer
    const vizDiv = document.createElement('div');
    vizDiv.className = 'term-line term-music-viz';
    this.ytVizElement = vizDiv;
    this.output.appendChild(vizDiv);
    this.scrollToBottom();

    const barCount = 18;
    const currentBars = new Array(barCount).fill(1);
    const targetBars = new Array(barCount).fill(4);

    // ~10 fps = 100ms interval
    this.ytVizInterval = setInterval(() => {
      for (let i = 0; i < barCount; i++) {
        if (Math.abs(currentBars[i] - targetBars[i]) <= 1) {
          targetBars[i] = Math.floor(Math.random() * EQ_CHARS.length);
        }
        if (currentBars[i] < targetBars[i]) currentBars[i]++;
        else if (currentBars[i] > targetBars[i]) currentBars[i]--;
      }

      const barString = currentBars.map((h) => EQ_CHARS[h]).join('');
      if (this.ytVizElement) {
        this.ytVizElement.innerHTML = `<span style="color: var(--text-accent); font-weight:700;">[EQ]</span> <span style="color: var(--text-mint); letter-spacing: 2px;">${barString}</span> <span style="color: var(--text-secondary); font-size: 0.75rem;">♪ Blinding Lights — The Weeknd</span>`;
      }
    }, 100);
  }

  stopVisualizer(remove = false) {
    if (this.ytVizInterval) {
      clearInterval(this.ytVizInterval);
      this.ytVizInterval = null;
    }
    if (this.ytVizElement) {
      if (remove) {
        this.ytVizElement = null;
      } else {
        this.ytVizElement.innerHTML = `<span style="color: var(--text-muted); font-weight:700;">[EQ]</span> <span style="color: var(--text-muted); letter-spacing: 2px;">▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂▂</span> <span style="color: var(--text-muted); font-size: 0.75rem;">⏸ paused</span>`;
      }
    }
  }

  cmdPlay() {
    sound.playHover();
    if (this.ytPlayer) {
      try {
        if (typeof this.ytPlayer.playVideo === 'function') {
          this.ytPlayer.playVideo();
        }
      } catch (e) {
        console.error('Error invoking playVideo:', e);
      }
      this.ytIsPlaying = true;
      this.startVisualizer();
    } else {
      // Lazy load YouTube API on first play
      this.loadYouTubeApi(() => {
        this.initYouTubePlayer();
      });
    }

    return ['<div class="term-success">▶ now playing: Blinding Lights — The Weeknd</div>'];
  }

  cmdPause() {
    sound.playKeyClick();
    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch (e) {
        console.error('Error pausing video:', e);
      }
    }
    this.ytIsPlaying = false;
    this.stopVisualizer(false);
    return ['<div class="term-dim">⏸ paused</div>'];
  }

  cmdResume(args) {
    // If user intended CV and music was never touched, open CV
    if (!this.ytPlayer && !this.ytIsPlaying) {
      // Start playback as requested by prompt
      return this.cmdPlay();
    }

    sound.playHover();
    if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
      } catch (e) {
        console.error('Error resuming video:', e);
      }
      this.ytIsPlaying = true;
      this.startVisualizer();
      return ['<div class="term-success">▶ now playing: Blinding Lights — The Weeknd</div>'];
    }

    return this.cmdPlay();
  }

  cmdStop() {
    sound.playKeyClick();
    if (this.ytPlayer) {
      try {
        if (typeof this.ytPlayer.stopVideo === 'function') {
          this.ytPlayer.stopVideo();
        }
        if (typeof this.ytPlayer.seekTo === 'function') {
          this.ytPlayer.seekTo(0, true);
        }
      } catch (e) {
        console.error('Error stopping video:', e);
      }
    }
    this.ytIsPlaying = false;
    this.stopVisualizer(true);
    return ['<div class="term-dim">⏹ stopped</div>'];
  }

  cmdVolume(args) {
    sound.playHover();
    if (!args || args.length === 0) {
      return [
        `<span class="term-error">Usage: vol &lt;0-100&gt; (e.g. "vol 80"). Current volume: ${this.ytVolume}%</span>`
      ];
    }

    const val = Number(args[0]);
    if (isNaN(val) || val < 0 || val > 100 || !Number.isInteger(val)) {
      return [
        `<span class="term-error">Invalid volume: "${args[0]}". Please enter a whole number between 0 and 100.</span>`
      ];
    }

    this.ytVolume = val;
    if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(this.ytVolume);
      } catch (e) {
        console.error('Error setting volume:', e);
      }
    }
    return [`<span class="term-success">🔊 volume set to ${this.ytVolume}%</span>`];
  }

  cmdNow() {
    sound.playHover();
    let current = 0;
    let total = 200; // ~3:20 typical track length

    if (this.ytPlayer) {
      try {
        if (typeof this.ytPlayer.getCurrentTime === 'function') {
          current = Math.floor(this.ytPlayer.getCurrentTime() || 0);
        }
        if (typeof this.ytPlayer.getDuration === 'function') {
          const dur = Math.floor(this.ytPlayer.getDuration() || 0);
          if (dur > 0) total = dur;
        }
      } catch (e) {
        console.error('Error retrieving now playing stats:', e);
      }
    }

    const formatTime = (secs) => {
      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const statusIcon = this.ytIsPlaying ? '▶' : '⏸';
    return [
      `<div class="term-highlight">${statusIcon} Blinding Lights — The Weeknd</div>`,
      `<div class="term-dim">Time: [${formatTime(current)} / ${formatTime(total)}] • Volume: ${this.ytVolume}%</div>`
    ];
  }

  cmdSudo(args) {
    if (args && args.length > 0 && args[0].toLowerCase() === 'play') {
      sound.playChime();
      this.printLine('<div class="term-highlight">[sudo] password for guest: ******** ... access granted 😎</div>');
      return this.cmdPlay();
    }
    return ['[ACCESS DENIED] User is not in the sudoers file. This incident will be reported to Pranjal.'];
  }

  cmdOpen(args) {
    if (!args || args.length === 0) {
      return ['Usage: <span class="term-highlight">open &lt;helios | rhythmnet | shellmind | airstrings | p2pdrop | chronolock | github | linkedin&gt;</span>'];
    }
    const target = args[0].toLowerCase();
    const urls = {
      helios: 'https://helios-web-eosin.vercel.app/',
      rhythmnet: 'https://appapppy-fjy6mg2n2xbnrjzyezklmz.streamlit.app/',
      shellmind: 'https://shellmind-landing.vercel.app/',
      airstrings: 'https://air-strings.vercel.app/',
      p2pdrop: 'https://p2-p-drop.vercel.app/',
      p2p: 'https://p2-p-drop.vercel.app/',
      chronolock: 'https://chronolock-eight.vercel.app/',
      github: 'https://github.com/pranjal9091',
      linkedin: 'https://linkedin.com/in/pranjal-singh',
    };

    if (urls[target]) {
      sound.playChime();
      window.open(urls[target], '_blank');
      return [`[LAUNCHED] Navigating to: <span class="term-success">${urls[target]}</span>`];
    } else {
      return [`<span class="term-error">Target not found: ${target}</span>`];
    }
  }

  cmdClear() {
    this.output.innerHTML = '';
    return [];
  }

  cmdMatrix() {
    sound.playShockwave();
    this.printLine('<div class="term-success">[MATRIX MODE ENGAGED]</div>');
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    let iterations = 0;
    const interval = setInterval(() => {
      let line = '';
      for (let i = 0; i < 40; i++) {
        line += chars[Math.floor(Math.random() * chars.length)] + ' ';
      }
      this.printLine(`<div style="color: #34D399; font-family: monospace; font-size: 0.72rem;">${line}</div>`);
      this.scrollToBottom();
      iterations++;

      if (iterations > 15) {
        clearInterval(interval);
        this.printLine('<div class="term-highlight">[MATRIX SIMULATION CONCLUDED]</div>');
        this.scrollToBottom();
      }
    }, 80);

    return [];
  }
}
