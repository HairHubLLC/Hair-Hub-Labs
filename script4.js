/* ===============================
   GLOBAL STATE
================================ */
const quizAnswers = {};
const PRICE_PER_PACK = 5.99;

/* ===============================
   HELPERS
================================ */
// Format values for display
function formatLabel(value) {
  if (!value) return "";
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Store inputs
function storeInput(key, value) {
  quizAnswers[key] = value;
}

// Round to nearest 0.5
function roundToNearestHalf(num) {
  return Math.round(num * 2) / 2;
}

// Create +/- range
function calculateRange(value, variance = 0.15) {
  return {
    min: roundToNearestHalf(value * (1 - variance)),
    max: roundToNearestHalf(value * (1 + variance))
  };
}

/* ===============================
   MAIN SUBMIT HANDLER
================================ */
function submitQuiz() {
  quizAnswers.braidSize = document.getElementById("braidSize")?.value;
  quizAnswers.braidLength = document.getElementById("braidLength")?.value;
  quizAnswers.hairLength = document.getElementById("hairLength")?.value;
  quizAnswers.skillLevel = document.getElementById("skillLevel")?.value;
  quizAnswers.bohoKnotless = document.getElementById("bohoKnotless")?.value || "no";

  if (
    !quizAnswers.braidSize ||
    !quizAnswers.braidLength ||
    !quizAnswers.hairLength ||
    !quizAnswers.skillLevel
  ) {
    alert("Please answer all required questions before estimating.");
    return;
  }

  displayInputtedInfo();
  calculateBraidEstimate();
  showResultsAndReflow();
}

/* ===============================
   DISPLAY USER INPUTS
================================ */
function displayInputtedInfo() {
  const displayDiv = document.getElementById("displayInfo");
  if (!displayDiv) return;

  displayDiv.innerHTML = `
    <h2>Your Selections</h2>
    <p><strong>Braid Size:</strong> ${formatLabel(quizAnswers.braidSize)}</p>
    <p><strong>Desired Braid Length:</strong> ${formatLabel(quizAnswers.braidLength)}</p>
    <p><strong>Natural Hair Length:</strong> ${formatLabel(quizAnswers.hairLength)}</p>
    <p><strong>Installer Skill Level:</strong> ${formatLabel(quizAnswers.skillLevel)}</p>
    ${
      quizAnswers.bohoKnotless === "yes"
        ? `<p><strong>Style Type:</strong> Boho</p>`
        : ""
    }
  `;

  displayDiv.style.visibility = "visible";
}

/* ===============================
   CORE CALCULATION
================================ */
function calculateBraidEstimate() {
  const baseTimeBySize = {
    micro: 12,
    small: 8,
    medium: 6,
    large: 3.5,
    jumbo: 2
  };

  const lengthMultiplier = {
    shoulder: 0.7,
    midback: 1.0,
    waist: 1.25,
    butt: 1.5,
    knee: 1.75
  };

  const naturalHairMultiplier = {
    twa: 0.9,
    shoulder: 1.0,
    armpit: 1.1,
    brastrap: 1.2,
    midbackplus: 1.3
  };

  const skillMultiplier = {
    professional: 1.0,
    intermediate: 1.3,
    beginner: 1.6
  };

  const bohoMultiplier = quizAnswers.bohoKnotless === "yes" ? 1.25 : 1.0;

  const basePacksBySize = {
    micro: 8,
    small: 6.5,
    medium: 5.5,
    large: 4,
    jumbo: 3
  };

  const packLengthMultiplier = {
    shoulder: 0.8,
    midback: 1.0,
    waist: 1.2,
    butt: 1.4,
    knee: 1.6
  };

  const naturalHairPackAdjustment = {
    twa: -1,
    shoulder: 0,
    armpit: 1,
    brastrap: 1,
    midbackplus: 2
  };

  /* ---------- TIME ---------- */
  const baseInstallTime =
    baseTimeBySize[quizAnswers.braidSize] *
    lengthMultiplier[quizAnswers.braidLength] *
    naturalHairMultiplier[quizAnswers.hairLength] *
    skillMultiplier[quizAnswers.skillLevel] *
    bohoMultiplier;

  const timeRange = calculateRange(baseInstallTime);

  /* ---------- PACKS ---------- */
  const basePacksNeeded =
    basePacksBySize[quizAnswers.braidSize] *
      packLengthMultiplier[quizAnswers.braidLength] +
    naturalHairPackAdjustment[quizAnswers.hairLength];

  const packRange = {
    min: Math.max(1, Math.floor(basePacksNeeded)),
    max: Math.max(1, Math.ceil(basePacksNeeded + 1))
  };

  /* ---------- COST ---------- */
  const hairCostRange = {
    min: (packRange.min * PRICE_PER_PACK).toFixed(2),
    max: (packRange.max * PRICE_PER_PACK).toFixed(2)
  };

  /* ---------- SESSION TIP ---------- */
  let sessionTip = "";
  if (quizAnswers.skillLevel !== "professional" && timeRange.max > 8) {
    sessionTip = `
      <p style="margin-top:12px; font-style:italic; color:#6E9AC4; text-align:center;">
        💡 DIY installs over 8 hours are best done across two braiding sessions. Plan to put on a good show 
        to binge!
      </p>
    `;
  }

  /* ---------- DISPLAY RESULTS ---------- */
  const resultDiv = document.getElementById("calculationResult");
  if (!resultDiv) return;

  resultDiv.innerHTML = `
    <h2>Results</h2>
    <p> <strong>Estimated Install Time:</strong> ${timeRange.min}–${timeRange.max} hours</p>
    <p> <strong>Recommended Hair Packs:</strong> ${packRange.min}–${packRange.max} packs</p>
    <p> <strong>Estimated Hair Cost:</strong> $${hairCostRange.min}–$${hairCostRange.max}</p>
    ${sessionTip}
  `;

  resultDiv.style.visibility = "visible";
}

/* ===============================
   UI FLOW
================================ */
function showResultsAndReflow() {
  const wrapper = document.querySelector(".calculator-wrapper") || document.body;
  wrapper.classList.add("results-open");

  document.getElementById("displayInfo")?.classList.add("show-results");
  document.getElementById("calculationResult")?.classList.add("show-results");

  const callout = document.getElementById("scrollCallout");
  if (callout) callout.style.display = "block";

  document
    .querySelector(".card, .card2, .maincard")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
