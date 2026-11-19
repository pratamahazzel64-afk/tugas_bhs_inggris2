/**
 * ZELPORTFOLIO - HAZZEL PRATAMA COMPLETE INTERACTION & MUSIC ENGINE
 * Default Soundtrack: Vicetone - Nevada (Instrumental)
 * Features:
 * - Vicetone - Nevada Instrumental Audio Engine & Real-Time Procedural Synthesizer
 * - Local WAV Background Audio & Custom User MP3 Upload Player
 * - Dancing Soundwave Equalizer & Rotating Vinyl Disc Visualization
 * - Dynamic Theme Accent Switcher (Violet, Cyan, Emerald, Magenta)
 * - Interactive Custom Glow Cursor with Magnetic Hover State
 * - Click & Tap Burst Sparkle Particles
 * - 3D Card Perspective Tilt with Cursor-Tracking Spotlight
 * - Live Interactive Terminal with Simulated Code Runner
 * - Number Counter Animation for Stats Banner
 * - Circular Scroll Progress Back-to-Top Button
 * - Dynamic Project Showcase Category Filter
 * - Canvas Constellation Particle Network
 * - Dynamic Typing Effect for Hero Subtitle
 * - Project Detail Modal Controller
 * - Instant WhatsApp Form Auto-Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Music Player & Soundscape Engine (Default: Vicetone - Nevada)
  initMusicPlayer();

  // 2. Interactive Custom Cursor
  initCustomCursor();

  // 3. Click Sparkle Particles
  initClickSparkles();

  // 4. 3D Tilt & Cursor Spotlight on Cards
  initCardTiltAndSpotlight();

  // 5. Live Developer Terminal
  initTerminalTabs();

  // 6. Canvas Particle Constellation
  initCanvasParticles();

  // 7. Dynamic Typing Effect
  initTypingEffect();

  // 8. Scroll Animations & Counter
  initScrollAnimations();
  initNumberCounters();

  // 9. Mobile Navigation
  initMobileNav();

  // 10. Skills & Projects Category Filters
  initSkillsFilter();
  initProjectsFilter();

  // 11. Navbar Scroll Sticky Effect & Back to Top Ring
  initScrollProgressAndNavbar();
});

/* ==========================================================================
   1. REAL BACKGROUND MUSIC & SOUND ENGINE (VICETONE - NEVADA)
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let currentTrack = 'nevada'; // Default: 'nevada', 'lofi', 'synthwave', 'ambient', 'custom'
let musicVolume = 0.75;
let masterGain = null;
let synthStepInterval = null;
let customAudioUrl = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(musicVolume, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Master Play / Pause Toggle
function togglePlayMusic() {
  const ctx = getAudioContext();
  const bgmAudio = document.getElementById('bgm-audio');

  if (isMusicPlaying) {
    // STOP / PAUSE MUSIC
    pauseAllAudio();
    isMusicPlaying = false;
    updateMusicUI(false);
  } else {
    // START / PLAY MUSIC
    isMusicPlaying = true;
    startCurrentTrack();
    updateMusicUI(true);
  }
}

function startCurrentTrack() {
  pauseAllAudio();
  const bgmAudio = document.getElementById('bgm-audio');

  if (currentTrack === 'nevada') {
    // Play Nevada WAV Audio
    if (bgmAudio) {
      bgmAudio.src = 'nevada.wav';
      bgmAudio.volume = musicVolume;
      const playPromise = bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to real-time Web Audio Nevada Synthesizer if native file blocked
          startSynthTrack('nevada');
        });
      }
    } else {
      startSynthTrack('nevada');
    }
  } else if (currentTrack === 'custom') {
    if (bgmAudio && customAudioUrl) {
      bgmAudio.src = customAudioUrl;
      bgmAudio.volume = musicVolume;
      bgmAudio.play().catch(e => console.log('Custom audio play error:', e));
    }
  } else {
    // Web Audio Synthesizer Soundtrack
    startSynthTrack(currentTrack);
  }
}

function pauseAllAudio() {
  const bgmAudio = document.getElementById('bgm-audio');
  if (bgmAudio) {
    bgmAudio.pause();
  }
  if (synthStepInterval) {
    clearInterval(synthStepInterval);
    synthStepInterval = null;
  }
}

// Switch Soundtrack
function switchTrack(trackName) {
  currentTrack = trackName;

  const trackBtns = document.querySelectorAll('.track-btn');
  trackBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-track') === trackName);
  });

  const titles = {
    nevada: 'Vicetone - Nevada (Instrumental)',
    lofi: '🎧 Cyber Lo-Fi Chill',
    synthwave: '🌌 Neon Synthwave 80s',
    ambient: '🌧️ Deep Focus Ambient',
    custom: '🎵 Custom Track (Your Audio)'
  };

  const titleEl = document.getElementById('music-title-mini');
  const drawerTitleEl = document.getElementById('m-drawer-music-title');
  if (titleEl) titleEl.textContent = titles[trackName] || 'Vicetone - Nevada';
  if (drawerTitleEl) drawerTitleEl.textContent = titles[trackName] || 'Vicetone - Nevada';

  if (isMusicPlaying) {
    startCurrentTrack();
  }
}

// Set Music Volume
function setMusicVolume(val) {
  musicVolume = parseFloat(val);
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(musicVolume, audioCtx.currentTime);
  }
  const bgmAudio = document.getElementById('bgm-audio');
  if (bgmAudio) {
    bgmAudio.volume = musicVolume;
  }
}

// Load Custom MP3 / Audio File
function loadCustomAudio(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (customAudioUrl) {
    URL.revokeObjectURL(customAudioUrl);
  }
  customAudioUrl = URL.createObjectURL(file);
  currentTrack = 'custom';

  const titleEl = document.getElementById('music-title-mini');
  const drawerTitleEl = document.getElementById('m-drawer-music-title');
  const cleanName = file.name.replace(/\.[^/.]+$/, "");
  if (titleEl) titleEl.textContent = `🎵 ${cleanName}`;
  if (drawerTitleEl) drawerTitleEl.textContent = `🎵 ${cleanName}`;

  document.querySelectorAll('.track-btn').forEach(btn => btn.classList.remove('active'));

  if (!isMusicPlaying) {
    togglePlayMusic();
  } else {
    startCurrentTrack();
  }
}

// Toggle Expanded Music Panel Drawer
function toggleMusicPlayerExpanded() {
  const widget = document.getElementById('music-player-widget');
  if (widget) {
    widget.classList.toggle('expanded');
    playSound(380, 'sine', 0.05);
  }
}

// Update Music UI Elements across the page
function updateMusicUI(playing) {
  const vinyl = document.getElementById('vinyl-disc');
  const eq = document.getElementById('equalizer-bars');
  const circleIcon = document.getElementById('music-circle-icon');
  const soundIcon = document.getElementById('sound-icon');
  const soundBtn = document.getElementById('sound-btn');
  const heroMusicLabel = document.getElementById('hero-music-label');
  const statusMini = document.getElementById('music-status-mini');
  const drawerStatus = document.getElementById('m-drawer-music-status');
  const drawerPlayText = document.getElementById('m-drawer-play-text');
  const mBarMusic = document.querySelector('.m-bar-music');

  if (vinyl) vinyl.classList.toggle('playing', playing);
  if (eq) eq.classList.toggle('playing', playing);
  if (mBarMusic) mBarMusic.classList.toggle('playing', playing);

  if (playing) {
    if (circleIcon) circleIcon.setAttribute('data-lucide', 'pause');
    if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-2');
    if (soundBtn) soundBtn.classList.add('sound-on');
    if (heroMusicLabel) heroMusicLabel.textContent = 'Pause Nevada ⏸️';
    if (statusMini) statusMini.textContent = 'Playing: Vicetone - Nevada 🔥';
    if (drawerStatus) drawerStatus.textContent = 'Playing: Vicetone - Nevada 🔥';
    if (drawerPlayText) drawerPlayText.textContent = 'Pause Nevada';
  } else {
    if (circleIcon) circleIcon.setAttribute('data-lucide', 'play');
    if (soundIcon) soundIcon.setAttribute('data-lucide', 'volume-x');
    if (soundBtn) soundBtn.classList.remove('sound-on');
    if (heroMusicLabel) heroMusicLabel.textContent = 'Play Nevada 🎵';
    if (statusMini) statusMini.textContent = 'Click to Play Nevada 🎵';
    if (drawerStatus) drawerStatus.textContent = 'Tap to Play Nevada';
    if (drawerPlayText) drawerPlayText.textContent = 'Play Nevada';
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

function initMusicPlayer() {
  const bgmAudio = document.getElementById('bgm-audio');
  if (bgmAudio) {
    bgmAudio.addEventListener('ended', () => {
      if (isMusicPlaying) {
        bgmAudio.currentTime = 0;
        bgmAudio.play();
      }
    });
  }
}

/* ==========================================================================
   PROCEDURAL WEB AUDIO SYNTHESIZER TRACKS (VICETONE - NEVADA)
   ========================================================================== */
function startSynthTrack(type) {
  const ctx = getAudioContext();
  let step = 0;

  if (type === 'nevada') {
    // 124 BPM Vicetone - Nevada Chords (Cm - Ab - Eb - Bb)
    const chords = [
      [130.81, 155.56, 196.00, 261.63], // Cm
      [103.83, 130.81, 155.56, 207.65], // Ab
      [155.56, 196.00, 233.08, 311.13], // Eb
      [116.54, 146.83, 174.61, 233.08]  // Bb
    ];
    const bassNotes = [65.41, 51.91, 77.78, 58.27];
    const melody = [
      392.00, 523.25, 622.25, 587.33,
      523.25, 466.16, 392.00, 466.16,
      392.00, 523.25, 587.33, 622.25,
      698.46, 587.33, 466.16, 523.25
    ];

    synthStepInterval = setInterval(() => {
      const barIdx = Math.floor(step / 4) % 4;
      const beatInBar = step % 4;

      // Pumping Sidechain Chord on every beat
      playNevadaChord(chords[barIdx]);

      // Rolling Bass (8th notes)
      playNevadaBass(bassNotes[barIdx]);

      // Nevada Lead Melody Hook
      const note = melody[step % melody.length];
      playNevadaLead(note);

      step++;
    }, 483); // 124 BPM quarter note

  } else if (type === 'lofi') {
    const chords = [
      [146.83, 174.61, 220.00, 261.63, 329.63],
      [98.00,  174.61, 246.94, 329.63],
      [130.81, 164.81, 196.00, 246.94, 293.66],
      [110.00, 164.81, 220.00, 261.63, 329.63]
    ];
    const bassNotes = [73.42, 49.00, 65.41, 55.00];
    const melodyScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

    synthStepInterval = setInterval(() => {
      const chordIdx = Math.floor(step / 4) % 4;
      if (step % 4 === 0) playLoFiChord(chords[chordIdx], bassNotes[chordIdx]);
      if (Math.random() > 0.25) {
        const randNote = melodyScale[Math.floor(Math.random() * melodyScale.length)];
        playPluck(randNote, 0.4);
      }
      step++;
    }, 600);

  } else if (type === 'synthwave') {
    const arpNotes = [146.83, 220.00, 293.66, 349.23, 116.54, 174.61, 233.08, 293.66, 130.81, 196.00, 261.63, 329.63, 110.00, 164.81, 220.00, 277.18];
    const bassNotes = [73.42, 58.27, 65.41, 55.00];

    synthStepInterval = setInterval(() => {
      const note = arpNotes[step % arpNotes.length];
      const bass = bassNotes[Math.floor((step % 16) / 4)];
      playSynthwaveArp(note, 0.12);
      if (step % 2 === 0) playSynthwaveBass(bass, 0.22);
      step++;
    }, 150);

  } else if (type === 'ambient') {
    const pads = [
      [130.81, 196.00, 246.94, 329.63],
      [110.00, 164.81, 220.00, 261.63],
      [87.31,  130.81, 174.61, 220.00],
      [98.00,  146.83, 196.00, 246.94]
    ];
    playAmbientDrone(pads[0]);
    synthStepInterval = setInterval(() => {
      step++;
      playAmbientDrone(pads[step % pads.length]);
    }, 4500);
  }
}

// Synthesizer Nevada Voices
function playNevadaChord(notes) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, now);
  filter.connect(masterGain);

  notes.forEach((freq) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    // EDM Sidechain Pumping Envelope
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.44);

    osc.connect(gain);
    gain.connect(filter);

    osc.start(now);
    osc.stop(now + 0.45);
  });
}

function playNevadaBass(freq) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.14, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, now);

  osc.connect(gain);
  gain.connect(filter);
  filter.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.23);
}

function playNevadaLead(freq) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, now);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2400, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + 0.38);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.42);
}

function playLoFiChord(notes, bass) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);
  filter.connect(masterGain);

  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    osc.connect(gain);
    gain.connect(filter);

    osc.start(now);
    osc.stop(now + 2.3);
  });
}

function playPluck(freq, dur) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.09, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + dur);
}

function playSynthwaveArp(freq, dur) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const filter = audioCtx.createBiquadFilter();
  const gain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(freq, now);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, now);
  filter.frequency.exponentialRampToValueAtTime(400, now + dur);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + dur);
}

function playSynthwaveBass(freq, dur) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + dur);
}

function playAmbientDrone(notes) {
  if (!audioCtx || !masterGain) return;
  const now = audioCtx.currentTime;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, now);
  filter.frequency.linearRampToValueAtTime(950, now + 2.0);
  filter.frequency.linearRampToValueAtTime(600, now + 4.5);
  filter.connect(masterGain);

  notes.forEach((freq) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 4.4);

    osc.connect(gain);
    gain.connect(filter);

    osc.start(now);
    osc.stop(now + 4.5);
  });
}

function playSound(freq, type = 'sine', duration = 0.08) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('Audio play failed', err);
  }
}

/* ==========================================================================
   2. THEME ACCENT SWITCHER
   ========================================================================== */
function setThemeAccent(theme) {
  document.body.className = `theme-${theme}`;

  const dots = document.querySelectorAll('.theme-dot');
  dots.forEach((dot) => {
    dot.classList.toggle('active', dot.classList.contains(`dot-${theme}`));
  });

  playSound(520, 'sine', 0.08);
}

/* ==========================================================================
   3. CUSTOM GLOW CURSOR (DESKTOP)
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');
  if (!dot || !glow || window.innerWidth <= 900) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    glowX += (mouseX - glowX) * 0.18;
    glowY += (mouseY - glowY) * 0.18;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  const interactiveEls = document.querySelectorAll('a, button, .tilt-card, .skill-card, .project-card, .t-tab, .filter-btn, .music-mini-bar');
  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });
}

/* ==========================================================================
   4. CLICK SPARKLE PARTICLES
   ========================================================================== */
function initClickSparkles() {
  document.addEventListener('click', (e) => {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'click-sparkle';
      sparkle.style.left = `${e.clientX}px`;
      sparkle.style.top = `${e.clientY}px`;

      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const distance = Math.random() * 40 + 20;
      const dx = `${Math.cos(angle) * distance}px`;
      const dy = `${Math.sin(angle) * distance}px`;

      sparkle.style.setProperty('--dx', dx);
      sparkle.style.setProperty('--dy', dy);

      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 600);
    }
  });
}

/* ==========================================================================
   5. 3D CARD TILT & SPOTLIGHT MOUSE TRACKING
   ========================================================================== */
function initCardTiltAndSpotlight() {
  const cards = document.querySelectorAll('.tilt-card, .skill-card, .project-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (window.innerWidth > 768) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -6;
        const tiltY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      card.style.transition = 'transform 0.4s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
}

/* ==========================================================================
   6. LIVE TERMINAL SIMULATOR
   ========================================================================== */
function initTerminalTabs() {
  const tabs = document.querySelectorAll('.t-tab');
  const views = document.querySelectorAll('.code-view');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      views.forEach((v) => v.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      const targetView = document.getElementById(`view-${target}`);
      if (targetView) targetView.classList.add('active');

      playSound(400, 'square', 0.04);
    });
  });
}

function runTerminalSimulation() {
  const consoleEl = document.getElementById('terminal-console');
  if (!consoleEl) return;

  playSound(650, 'triangle', 0.12);

  const logs = [
    { text: 'Compiling Zelportfolio core modules...', delay: 200 },
    { text: '[1/4] Soundscape: Vicetone - Nevada (Instrumental) [ACTIVE]', delay: 600 },
    { text: '[2/4] Testing PHP & MySQL Backend Engine... [CONNECTED]', delay: 1100 },
    { text: '[3/4] Rendering Figma UI/UX Components... [VERIFIED]', delay: 1600 },
    { text: '[4/4] Hazzel Pratama Status: 100% ACTIVE & READY FOR HIRE 🚀', delay: 2100 }
  ];

  consoleEl.innerHTML = '<div class="console-line"><span class="console-prompt">></span> Executing terminal simulation...</div>';

  logs.forEach((log) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'console-line';
      line.innerHTML = `<span class="console-prompt">></span> ${log.text}`;
      consoleEl.appendChild(line);
      consoleEl.scrollTop = consoleEl.scrollHeight;
      playSound(500 + Math.random() * 200, 'sine', 0.05);
    }, log.delay);
  });
}

/* ==========================================================================
   7. CANVAS PARTICLES NETWORK
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const particles = [];
  const maxDistance = window.innerWidth < 768 ? 100 : 130;

  const mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? 'rgba(139, 92, 246, ' : 'rgba(6, 182, 212, ';
      this.baseAlpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2;
          this.y -= (dy / dist) * force * 2;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.baseAlpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   8. TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const roles = [
    'Software Engineering Student',
    'Web Developer (HTML5 & CSS3)',
    'PHP & MySQL Programmer',
    'Figma UI/UX Specialist',
    'SMKN 12 Jakarta Candidate',
    'Problem Solver & Collaborator'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 85;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typedTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1900;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 350;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   9. NUMBER COUNTER ANIMATION
   ========================================================================== */
function initNumberCounters() {
  const counters = document.querySelectorAll('.count-up');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach((counter) => {
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1500;
          const stepTime = 30;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counter.textContent = `${target}${suffix}`;
              clearInterval(timer);
            } else {
              counter.textContent = `${count}${suffix}`;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.querySelector('.hero-metrics');
  if (metricsSection) observer.observe(metricsSection);
}

/* ==========================================================================
   10. SCROLL REVEAL & SKILL PROGRESS FILL
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');

        const progressBars = entry.target.querySelectorAll('.progress-fill');
        progressBars.forEach((bar) => {
          const targetWidth = bar.style.getPropertyValue('--target-width');
          if (targetWidth) {
            bar.style.width = targetWidth;
          }
        });
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   11. MOBILE NAVIGATION (HAMBURGER & BOTTOM DOCK)
   ========================================================================== */
function initMobileNav() {
  const menuToggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuToggle && drawer) {
    menuToggle.addEventListener('click', () => {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      playSound(350, 'triangle', 0.05);
    });

    const closeDrawer = () => {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
      playSound(280, 'triangle', 0.05);
    };

    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    drawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));

    document.addEventListener('click', (e) => {
      if (
        drawer.classList.contains('active') &&
        !drawer.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeDrawer();
      }
    });
  }

  // Synchronize Active Nav Links
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.nav-link');
  const bottomBarLinks = document.querySelectorAll('.m-bar-item');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        desktopLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
        bottomBarLinks.forEach((bar) => {
          if (bar.getAttribute('href') === `#${sectionId}`) {
            bar.classList.add('active');
          } else if (bar.getAttribute('href')?.startsWith('#')) {
            bar.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
}

/* ==========================================================================
   12. SKILLS FILTER & PROJECTS FILTER
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      playSound(420, 'sine', 0.04);

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

function initProjectsFilter() {
  const pBtns = document.querySelectorAll('.p-filter-btn');
  const pCards = document.querySelectorAll('.project-card');

  pBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      pBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-pfilter');
      playSound(460, 'sine', 0.04);

      pCards.forEach((card) => {
        const category = card.getAttribute('data-pcategory');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   13. SCROLL PROGRESS RING & NAVBAR SCROLL
   ========================================================================== */
function initScrollProgressAndNavbar() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');
  const circle = document.getElementById('scroll-progress-circle');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 40);
    }

    if (backToTop && circle) {
      if (scrollY > 300) {
        backToTop.classList.add('visible');
        const scrollPct = (scrollY / docHeight) * 100;
        const offset = 120 - (120 * scrollPct) / 100;
        circle.style.strokeDashoffset = offset;
      } else {
        backToTop.classList.remove('visible');
      }
    }
  });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  playSound(580, 'sine', 0.08);
}

/* ==========================================================================
   14. PROJECT DETAIL MODAL DATA & CONTROLLER
   ========================================================================== */
const projectData = {
  portal: {
    title: 'Responsive Web Portal & School Catalog',
    category: 'Front-End Development & Mobile UI',
    tech: ['HTML5 Semantic', 'CSS3 Flex & Grid', 'JavaScript', 'Mobile Optimization'],
    description:
      'A modern web portal built to present school information, program catalogs, and interactive announcements with clarity. Emphasizes semantic HTML5, pure CSS styling without heavy dependencies, and fluid responsiveness from Android smartphones to 4K desktop screens.',
    features: [
      'Automatic adaptive layouts tailored for mobile Android screens.',
      'Smooth responsive hamburger drawer navigation designed for touch.',
      'Ultra-fast page loading speeds enabled by clean, modular CSS.',
      'Modern typography scale with clear visual hierarchy and high readability.'
    ],
    role: 'Lead Front-End Designer & Coder'
  },
  crud: {
    title: 'Dynamic Database & Management System',
    category: 'Back-End & Relational Database Engineering',
    tech: ['PHP Native/OOP', 'MySQL Relational Database', 'SQL Querying', 'phpMyAdmin'],
    description:
      'A dynamic web application designed to handle structured data workflows. Implements a complete CRUD (Create, Read, Update, Delete) cycle with server-side validation to ensure data consistency, security, and smooth user sessions.',
    features: [
      'Relational database architecture with structured foreign key schemas.',
      'Dynamic input forms with PHP sanitization and error prevention.',
      'Fast search, multi-field filtering, and record management.',
      'Responsive tables designed for clear viewing on smartphones.'
    ],
    role: 'Back-End Developer & Database Architect'
  },
  figma: {
    title: 'Modern Mobile App UI & Dashboard Layout',
    category: 'UI/UX Design, Wireframing & Prototyping',
    tech: ['Figma', 'UI/UX Wireframing', 'Interactive Prototyping', 'Design Systems'],
    description:
      'High-fidelity digital user interfaces blending aesthetic polish, usability, and consistent visual component systems. Created interactive prototypes with natural user flows prior to production code implementation.',
    features: [
      'From low-fidelity wireframing to high-fidelity interactive mobile prototypes.',
      'Harmonious color palettes and standardized typography scale.',
      'Administrative dashboard UI featuring clean analytics cards.',
      'User-tested navigation flows focused on effortless mobile usability.'
    ],
    role: 'UI/UX Designer & Prototyper'
  }
};

function openProjectModal(key) {
  const modal = document.getElementById('project-modal');
  const inner = document.getElementById('modal-content-inner');
  const data = projectData[key];

  if (!modal || !inner || !data) return;

  playSound(500, 'sine', 0.08);

  const techBadges = data.tech
    .map((t) => `<span class="badge-tag">${t}</span>`)
    .join(' ');

  const featureItems = data.features
    .map((f) => `<li><i data-lucide="check" style="width:16px;height:16px;color:#06b6d4;flex-shrink:0;"></i> <span>${f}</span></li>`)
    .join('');

  inner.innerHTML = `
    <div style="margin-bottom: 16px;">
      <span class="badge-year" style="display:inline-block; margin-bottom: 8px;">${data.category}</span>
      <h3 style="font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 8px;">${data.title}</h3>
      <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
        ${techBadges}
      </div>
    </div>

    <div style="color: #94a3b8; font-size: 0.95rem; line-height: 1.7; margin-bottom: 20px;">
      <p style="margin-bottom: 14px;">${data.description}</p>
      
      <h4 style="color: #fff; font-size: 1.05rem; font-weight: 700; margin-bottom: 10px;">Key Features & Implementation:</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
        ${featureItems}
      </ul>

      <div style="background: rgba(139, 92, 246, 0.1); border-left: 3px solid #8b5cf6; padding: 10px 14px; border-radius: 4px; color: #e2e8f0; font-size: 0.88rem;">
        <strong>Hazzel's Role:</strong> ${data.role}
      </div>
    </div>

    <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: flex-end;">
      <a href="https://wa.me/6285282787130?text=Hello%20Hazzel,%20I%20would%20like%20to%20discuss%20a%20project%20similar%20to%20${encodeURIComponent(data.title)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
        <i data-lucide="message-circle" style="width:16px;height:16px;"></i> Discuss Similar Project
      </a>
      <button class="btn btn-glass btn-sm" onclick="closeProjectModal()">Close</button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeProjectModal(e) {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    playSound(300, 'sine', 0.05);
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

/* ==========================================================================
   15. DIRECT WHATSAPP FORM SUBMISSION
   ========================================================================== */
function handleFormSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('sender-name');
  const topicInput = document.getElementById('sender-topic');
  const messageInput = document.getElementById('sender-message');

  const name = nameInput ? nameInput.value.trim() : '';
  const topic = topicInput ? topicInput.value : '';
  const message = messageInput ? messageInput.value.trim() : '';

  if (!name || !message) {
    alert('Please complete your name and message before sending.');
    return;
  }

  const waText = 
`Hello Hazzel Pratama!

Name: ${name}
Purpose: ${topic}
Message:
${message}

(Sent via official Zelportfolio website - Playing Vicetone Nevada)`;

  const waUrl = `https://wa.me/6285282787130?text=${encodeURIComponent(waText)}`;

  playSound(700, 'triangle', 0.15);
  window.open(waUrl, '_blank');
  event.target.reset();
}
