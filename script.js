// --- 1. ENCODER SIMULATION (4-to-2) ---
const encoderButtons = document.querySelectorAll('#encoderInputs .logic-btn');
const encA1 = document.getElementById('encA1');
const encA0 = document.getElementById('encA0');
const encSelected = document.getElementById('encSelected');
const encDecimal = document.getElementById('encDecimal');
const encTableRows = document.querySelectorAll('#encoderPanel tbody tr');

function setEncoder(index) {
  // Update input buttons state
  encoderButtons.forEach((btn, i) => {
    const isActive = i === index;
    btn.classList.toggle('selected', isActive);
    btn.querySelector('.btn-state').textContent = isActive ? '1' : '0';
  });

  // Calculate 2-bit binary output
  const binary = index.toString(2).padStart(2, '0');
  encA1.textContent = binary[0];
  encA0.textContent = binary[1];
  encSelected.textContent = `I${index}`;
  encDecimal.textContent = index;

  // Highlight corresponding row in truth table
  encTableRows.forEach((row, i) => {
    row.classList.toggle('highlight', i === index);
  });
}

// Click listener for encoder input buttons
encoderButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    setEncoder(Number(btn.dataset.index));
  });
});

// Click listener for encoder truth table rows (interactive testing)
encTableRows.forEach(row => {
  row.addEventListener('click', () => {
    setEncoder(Number(row.dataset.index));
  });
});


// --- 2. DECODER SIMULATION (2-to-4) ---
let decoderBits = [0, 0]; // [A1, A0]
const bitButtons = [
  document.getElementById('decA1'),
  document.getElementById('decA0')
];
const decValue = document.getElementById('decValue');
const decActive = document.getElementById('decActive');
const decLeds = document.querySelectorAll('#decoderOutputs .led-card');
const decTableRows = document.querySelectorAll('#decoderPanel tbody tr');

function updateDecoder() {
  const value = decoderBits[0] * 2 + decoderBits[1]; // Convert bits to decimal (0-3)

  // Update input text display
  decValue.textContent = decoderBits.join('');
  decActive.textContent = `Y${value}`;

  // Update button visual states
  bitButtons.forEach((btn, i) => {
    btn.textContent = decoderBits[i];
    btn.classList.toggle('on', decoderBits[i] === 1);
  });

  // Update output lines (LEDs)
  decLeds.forEach((led, i) => {
    const isActive = i === value;
    led.classList.toggle('active', isActive);
    led.querySelector('.led-state').textContent = isActive ? '1' : '0';
  });

  // Highlight corresponding row in truth table
  decTableRows.forEach((row, i) => {
    row.classList.toggle('highlight', i === value);
  });
}

// Click listener for decoder bit switches
bitButtons.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    decoderBits[i] = decoderBits[i] === 1 ? 0 : 1;
    updateDecoder();
  });
});

// Click listener for decoder truth table rows
decTableRows.forEach(row => {
  row.addEventListener('click', () => {
    const bits = row.dataset.bits.split(',').map(Number);
    decoderBits = bits;
    updateDecoder();
  });
});


// --- 3. TAB NAVIGATION ---
const tabButtons = document.querySelectorAll('.tab-btn');
const simCards = document.querySelectorAll('.card[role="tabpanel"]');

tabButtons.forEach(tab => {
  tab.addEventListener('click', () => {
    tabButtons.forEach(t => {
      const isCurrent = t === tab;
      t.classList.toggle('active', isCurrent);
      t.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    const targetPanelId = tab.dataset.panel;
    simCards.forEach(panel => {
      panel.classList.toggle('hidden', panel.id !== targetPanelId);
    });
  });
});


// --- 4. LIGHT / DARK THEME TOGGLE WITH LOCALSTORAGE ---
const themeToggle = document.getElementById('themeToggle');

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('logic_sim_theme', isDark ? 'dark' : 'light');
}

// Load saved preference
const savedTheme = localStorage.getItem('logic_sim_theme');
if (savedTheme === 'dark') {
  applyTheme(true);
}

themeToggle.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark');
  applyTheme(isDark);
});


// --- INITIALIZE SIMULATORS ---
setEncoder(0);
updateDecoder();
