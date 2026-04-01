// --- GENERATOR LOGIC ---
const display = document.getElementById('password-display');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const generateBtn = document.getElementById('generate-btn');

const charset = {
    lower: "abcdefghijklmnopqrstuvwxyz",
    upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?"
};

function generate() {
    let pool = charset.lower;
    if (document.getElementById('upper').checked) pool += charset.upper;
    if (document.getElementById('numbers').checked) pool += charset.numbers;
    if (document.getElementById('symbols').checked) pool += charset.symbols;
    if (document.getElementById('avoid-similar').checked) pool = pool.replace(/[lI1O0o]/g, '');

    let res = "";
    const len = parseInt(lengthSlider.value);
    for (let i = 0; i < len; i++) {
        res += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    display.value = res; // Visible Password (machi njimat)
}

// Entropy Level Update
lengthSlider.addEventListener('input', () => {
    lengthVal.innerText = lengthSlider.value;
});

// --- AUDITOR LOGIC (Fix Circle + Eye) ---
const userInput = document.getElementById('user-input');
const auditCircle = document.getElementById('audit-circle');
const auditScoreText = document.getElementById('audit-score');
const auditStatus = document.getElementById('audit-status');
const auditAdvice = document.getElementById('audit-advice');
const eyeToggle = document.getElementById('eye-toggle');

userInput.addEventListener('input', (e) => {
    const pwd = e.target.value;
    if (!pwd) { updateUI(0, []); return; }

    let score = 0;
    let tips = [];

    // Scoring logic
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 15;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 20;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;

    // Tips
    if (pwd.length < 12) tips.push("Needs 12+ chars");
    if (!/[A-Z]/.test(pwd)) tips.push("Add Uppercase");
    if (!/[^A-Za-z0-9]/.test(pwd)) tips.push("Add Symbols");

    updateUI(score, tips);
});

function updateUI(score, tips) {
    // Circle Fix: 440 is circumference (2 * PI * 70)
    const offset = 440 - (score / 100) * 440;
    auditCircle.style.strokeDashoffset = offset;
    auditScoreText.innerText = score + "%";

    let color = "#ef4444";
    if (score >= 40) color = "#f59e0b";
    if (score >= 70) color = "#10b981";
    if (score >= 90) color = "#00f2ff";

    auditCircle.style.stroke = color;
    auditStatus.innerText = score === 0 ? "WAITING FOR INPUT..." : "ANALYSIS COMPLETE";
    auditStatus.style.color = color;
    auditAdvice.innerHTML = tips.length ? "• " + tips.join("<br>• ") : "✓ Neural key optimized.";
}

// Eye Toggle Fix
eyeToggle.onclick = () => {
    const isPass = userInput.type === 'password';
    userInput.type = isPass ? 'text' : 'password';
    document.getElementById('eye-icon').style.color = isPass ? '#bc13fe' : '#64748b';
};

// Controls
generateBtn.onclick = generate;
document.getElementById('copy-btn').onclick = () => {
    if(!display.value) return;
    navigator.clipboard.writeText(display.value);
    alert("Copied!");
};

// Initial Call
generate();