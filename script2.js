// ---------------- STORE USER INPUTS ----------------
const quizAnswers = {};
let trackedStyles = JSON.parse(localStorage.getItem("trackedStyles")) || [];

function storeInput(key, value) {
  quizAnswers[key] = value;
}


// ---------------- TRACKER HELPERS ----------------
let activeStyle = {
  installDate: null,
  keepWeeks: null,
  takedownDate: null,
  actualTakedownDate: null
};

const growthValues = {
  "0.125": 0.125,
  "0.0875": 0.0875,
  "0.05": 0.05
};

function roundToNearestHalf(num) {
  return Math.round(num * 2) / 2;
}

// ---------------- CALCULATOR ----------------
function submitQuiz() {
  const growthRateInput = document.getElementById('growthRate').value;
  const desiredGrowthInput = parseFloat(document.getElementById('desiredGrowth').value);

  // Validate inputs
  if (!growthRateInput || growthRateInput === "0") {
    alert("Please select a hair growth rate.");
    return;
  }

  // Check for BLANK input first
if (document.getElementById('desiredGrowth').value.trim() === "") {
  alert("Please enter your desired growth in inches to continue.");
  return;
}

// Then check for INVALID input
if (isNaN(desiredGrowthInput) || desiredGrowthInput <= 0) {
  alert("Please enter a valid number greater than 0 for desired growth.");
  return;
}

  // Store answers
  quizAnswers.growthRate = growthRateInput;
  quizAnswers.desiredGrowth = desiredGrowthInput;

  // Show input info
  displayInputtedInfo2();

  // Show calculation
  calculateRecommendedWeeks2();

  showResultsAndReflow();

  if (isNaN(desiredGrowthInput) || desiredGrowthInput <= 0) {
  alert(
    `"${document.getElementById('desiredGrowth').value}" is not a valid input. ` +
    `Please enter a positive number for desired growth in inches.`
  );
  return;
}
}

// Display input info
function displayInputtedInfo2() {
  const displayDiv = document.getElementById('displayInfo2');
  let growthText = "Not selected";
  if (quizAnswers.growthRate === "0.125") growthText = "Fast (0.5 in/month)";
  else if (quizAnswers.growthRate === "0.0875") growthText = "Average (0.35 in/month)";
  else if (quizAnswers.growthRate === "0.05") growthText = "Slow (0.2 in/month)";
  else if (quizAnswers.growthRate === "unsure") growthText = "I'm not sure";

  displayDiv.innerHTML = `
  <span class="close-results" onclick="closeResults()">×</span>
  <h2>Inputted Information</h2>
  <p><strong>Growth Rate:</strong> ${growthText}</p>
  <p><strong>Desired New Growth:</strong> ${quizAnswers.desiredGrowth} inches</p>
  `;

  displayDiv.style.display = "block";
  displayDiv.classList.add("show-results");
}

// Calculate recommended weeks
function calculateRecommendedWeeks2() {
  const selection = quizAnswers.growthRate;
  const desiredGrowth = quizAnswers.desiredGrowth;
  const resultDiv = document.getElementById('calculationResult2');

  let output = `
  <span class="close-results" onclick="closeResults()">×</span>
  <h2>Results</h2>
  `;

  if (selection !== "unsure" && selection !== "0") {
    const rate = parseFloat(selection);
    const weeks = roundToNearestHalf(desiredGrowth / rate);
    output += `
      <p>Recommended Weeks to Keep the Style:</p>
      <p><strong>${weeks} weeks</strong></p>
      <p>Equivalent in Days: <strong>${Math.round(weeks * 7)} days</strong></p>
    `;

    if (weeks > 6.5) {
      const funnyComments = [
        "Hmm… something’s gotta give, sista that’s a long time!🤔",
        "Looks like you'll be rocking this for a minute!⏳",
        "I hope these are mini twists if you’re planning to have them this long 😅",
        "Remember, this is just a suggestion cause if your hair starts locking, please take it out 😭",
        "Girl… that’s a commitment. Are you ready for the long haul?",
        "OH, ok 😦",
        "Hopefully you don’t get tired of this style like you did your last man. But if you do, we’re here for you… to help you find a new style, of course 😉"
      ];
      const randomComment = funnyComments[Math.floor(Math.random() * funnyComments.length)];
      output += `<p style="margin-top:10px; text-align:center; font-style:italic; color:#6E9AC4; font-size:13px">${randomComment}</p>`;
    }

 } else if (selection === "unsure") {

  // Step 1: Use AVERAGE growth rate (0.0875 inches/week)
  const avgRate = 0.0875;

  // Step 2: Calculate average weeks
  const avgWeeks = desiredGrowth / avgRate;

  // Step 3: Apply ±1 week range
  const minWeeks = Math.max(1, Math.round(avgWeeks - 1));
  const maxWeeks = Math.round(avgWeeks + 1);

  output += `
  <p>We got you 😉 Here’s a realistic estimate:</p>
  <p><strong>${minWeeks} – ${maxWeeks} weeks</strong></p>
  <p>or</p>
  <p><strong>${Math.round(minWeeks * 7)} – ${Math.round(maxWeeks * 7)} days</strong></p>
  `;
}

  output += `<button class="focus-button" style="margin-top:15px;" onclick="openTracker(true)">Track This Style</button>`;

  resultDiv.innerHTML = output;
  resultDiv.style.display = "block";
  resultDiv.classList.add("show-results");
}

function showResultsAndReflow() {
  const wrapper = document.querySelector('.calculator-wrapper') || document.body;
  wrapper.classList.add('results-open');

  const displayInfo = document.getElementById('displayInfo2');
  const calcResult = document.getElementById('calculationResult2');

  if (displayInfo) displayInfo.classList.add('show-results');
  if (calcResult) calcResult.classList.add('show-results');

  // Show scroll callout
  const callout = document.getElementById('scrollCallout');
  if (callout) callout.style.display = 'block';

  // Scroll to top of card
  const card = document.querySelector('.card');
  if (card) {
    setTimeout(() => {
  window.scrollBy({ top: 150, behavior: 'smooth' });
}, 300);
  }
}

// Position results above tracker
function showResultsAboveTracker() {
  const displayContainer = document.getElementById('displayInfo2');
  const resultContainer = document.getElementById('calculationResult2');

  displayContainer.style.position = "relative";
  resultContainer.style.position = "relative";
}

// ---------------- TRACKER ----------------
function openTracker(fromCalculator) {
  const trackerModal = document.getElementById('trackerModal');
  trackerModal.style.display = 'block';
  document.getElementById('trackerOutput').innerHTML = "";

  if (!fromCalculator) trackerModal.dataset.editingId = "";

  if (fromCalculator === true) {
    let suggestedWeeks;
    if (quizAnswers.growthRate !== "unsure" && quizAnswers.growthRate !== "0" && quizAnswers.desiredGrowth > 0) {
      suggestedWeeks = roundToNearestHalf(quizAnswers.desiredGrowth / parseFloat(quizAnswers.growthRate));
    }
    document.getElementById('keepWeeks').value = suggestedWeeks || "";
  } else {
    document.getElementById('keepWeeks').value = "";
  }
}

function closeTrackerCard() {
  const trackerModal = document.getElementById("trackerModal");
  trackerModal.style.display = "none";
  trackerModal.dataset.editingId = "";
  document.getElementById("installDate").value = "";
  document.getElementById("keepWeeks").value = "";
  document.getElementById("styleDescription").value = "";
  document.getElementById("styleImage").value = "";
  document.getElementById("trackerOutput").innerHTML = "";
}

// ---------------- SAVE & RENDER ----------------
function saveTrackedStyles() {
  localStorage.setItem("trackedStyles", JSON.stringify(trackedStyles));
}

function saveStyleToTracker() {
  const trackerModal = document.getElementById("trackerModal");
  const editId = trackerModal.dataset.editingId;

  const installDateValue = document.getElementById("installDate").value;
  const keepWeeks = parseFloat(document.getElementById("keepWeeks").value);
  const description = document.getElementById("styleDescription").value.trim();
  const growthRateInput = parseFloat(document.getElementById("growthRate")?.value);
  let growthRate = !isNaN(growthRateInput) && growthRateInput > 0 ? growthRateInput : 0.5;

  if (!installDateValue || !keepWeeks || keepWeeks <= 0) {
    alert("Please enter install date and number of weeks.");
    return;
  }

  const installDateISO = new Date(installDateValue).toISOString();
  const takedownDate = new Date(installDateValue);
  takedownDate.setDate(takedownDate.getDate() + Math.round(keepWeeks * 7));

  const styleObj = {
    id: editId || Date.now().toString(),
    installDate: installDateISO,
    plannedWeeks: keepWeeks,
    takedownDate: takedownDate.toISOString(),
    actualTakedownDate: null,
    actualDays: null,
    actualWeeks: null,
    actualGrowth: null,
    growthRate: growthRate,
    description: description,
    image: null,

    createdAt: Date.now(),        // NEW → for current styles ordering
    completedAt: null             // NEW → for history ordering
  };

  const file = document.getElementById("styleImage").files?.[0];

  const finalizeSave = (imageBase64 = null) => {
    styleObj.image = imageBase64;
    if (editId) {
      const index = trackedStyles.findIndex(s => s.id === editId);
      if (index !== -1) trackedStyles[index] = styleObj;
    } else {
      trackedStyles.unshift(styleObj);
    }

    saveTrackedStyles();
    renderTrackedStyles();
    trackerModal.dataset.editingId = "";
    closeTrackerCard();
  };

  if (file) {
    resizeImage(file, 300, 300, (resized) => finalizeSave(resized));
  } else {
    finalizeSave();
  }
}

function getProgressColor(completion) {
  if (completion < 25) return "#EF5B9C";      // pink (just getting started)
  if (completion < 50) return "#FFE865";      // yellow
  if (completion < 75) return "#6E9AC4";      // green
  return "#67B271";                           // darker blue (almost done)
}

function renderTrackedStyles() {
  const currentList = document.getElementById("trackedStylesList");
  const historyList = document.getElementById("styleHistoryList");
  if (!currentList || !historyList) return;

  currentList.innerHTML = "";
  historyList.innerHTML = "";

  if (trackedStyles.length === 0) {
    currentList.innerHTML = "<p>No styles tracked yet.</p>";
    return;
  }

  trackedStyles.forEach(style => {
    const installDate = new Date(style.installDate);
    const takedownDate = new Date(style.takedownDate);
    const today = new Date();
    const totalDays = Math.max(1, Math.round(style.plannedWeeks * 7));
    const endDate = style.actualTakedownDate ? new Date(style.actualTakedownDate) : today;
    const daysWorn = Math.max(0, Math.floor((endDate - installDate) / (1000 * 60 * 60 * 24)));
    const completion = Math.min(100, Math.round((daysWorn / totalDays) * 100));
    const minGrowth = (daysWorn / 30) * 0.25;
    const maxGrowth = (daysWorn / 30) * 0.5;

    const actualWeeksDisplay = style.actualWeeks != null ? style.actualWeeks.toFixed(1) : "N/A";
    const actualGrowthDisplay = style.actualGrowth != null ? style.actualGrowth.toFixed(2) : "N/A";
    const imageHTML = style.image ? `<img src="${style.image}" class="style-thumb" onclick="expandImage('${style.image}')">` : "";

    // Determine progress bar color
    let progressColor;
    if (completion < 25) progressColor = "#EF5B9C";      // pink
    else if (completion < 50) progressColor = "#F1CEFF"; // lavender
    else if (completion < 75) progressColor = "#94BFF0"; // blue
    else progressColor = "#67B271";                      // green

    // CURRENT STYLES


    if (!style.actualTakedownDate) {
      currentList.innerHTML += `
        <div class="tracked-style">
         <p class="style-title"> ${style.description || "N/A"}</p>
        ${imageHTML}
          <p><strong>Install Date:</strong> ${installDate.toDateString()}</p>
          <p><strong>Planned Takedown:</strong> ${takedownDate.toDateString()}</p>
          <p><strong>Days Worn:</strong> ${daysWorn} / ${totalDays}</p>
          <div class="progress-container">
            <div class="progress-bar" style="width:${completion}%; background-color:${progressColor};"></div>
          </div>
          <p class="progress-text"><strong>${completion}% Complete</strong></p>
          <p><strong>Estimated Growth:</strong> ${minGrowth.toFixed(2)}–${maxGrowth.toFixed(2)} inches</p>
          <div class="tracker-actions">
            <a class="tracker-link" onclick="editTrackedStyle('${style.id}')">Edit</a>
            <a class="tracker-link" onclick="openTakedownModal('${style.id}')">Takedown</a>
             <a class="tracker-link" onclick="deleteTrackedStyle('${style.id}')">Delete</a>
            <input 
              type="date" 
              id="takedown-${style.id}" 
              style="display:none; margin-top:5px;" 
              onchange="confirmTakedown('${style.id}', this.value)"
            />
          </div>
        </div>
      `;
    } 
    // HISTORY STYLES
    else {
      historyList.innerHTML += `
        <div class="tracked-style history-style">
           <p class="style-title">${style.description || "N/A"}</p>
        ${imageHTML}
          <p><strong>Taken Down:</strong> ${new Date(style.actualTakedownDate).toDateString()}</p>
          <div class="progress-container">
            <div class="progress-bar" style="width:${completion}%; background-color:${progressColor};"></div>
          </div>
          <p class="progress-text"><strong>${completion}% Completion</strong></p>
          <p><strong>Actual Wear:</strong> ${style.actualDays ?? "N/A"} days (${actualWeeksDisplay} weeks)</p>
          <p><strong>Estimated Growth:</strong> ${actualGrowthDisplay} inches</p>
          <div class="tracker-actions">
            <a class="tracker-link" onclick="reopenTrackedStyle('${style.id}')">Reopen</a>
            <a class="tracker-link" onclick="deleteTrackedStyle('${style.id}')">Delete</a>
          </div>
        </div>
      `;
    }
  });
}


function showTakedownInput(styleId) {
  const input = document.getElementById(`takedown-${styleId}`);
  if (!input) return;

  // Toggle visibility
  input.style.display = "block";

  // Optional: auto-open calendar (works in most browsers)
  input.focus();
}

// ---------------- OTHER TRACKER FUNCTIONS ----------------

function confirmTakedownFromModal() {
  try {
    const style = trackedStyles.find(s => s.id === currentTakedownStyleId);
    if (!style) {
      closeTakedownModal();
      return;
    }

    const selectedDate = document.getElementById("takedownDateInput").value;

    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    const takedownDate = new Date(selectedDate);
    const installDate = new Date(style.installDate);

    if (takedownDate < installDate) {
      alert("Takedown date cannot be before install date.");
      return;
    }

    const daysWorn = Math.max(0, Math.floor((takedownDate - installDate) / (1000 * 60 * 60 * 24)));
    const weeksWorn = daysWorn / 7;
    const growth = (daysWorn / 30) * style.growthRate;

    style.actualTakedownDate = takedownDate.toISOString();
    style.completedAt = takedownDate.getTime();
    style.actualDays = daysWorn;
    style.actualWeeks = weeksWorn;
    style.actualGrowth = growth;

    saveTrackedStyles();
    renderTrackedStyles();

    // ✅ ALWAYS close modal
    closeTakedownModal();

  } catch (err) {
    console.error("Takedown error:", err);
    closeTakedownModal(); // fallback close
  }
}

function closeTakedownModal() {
  const modal = document.getElementById("takedownModal");
  modal.style.display = "none";
  currentTakedownStyleId = null;
}

let currentTakedownStyleId = null;

      function openTakedownModal(styleId) {
        currentTakedownStyleId = styleId;

        const modal = document.getElementById("takedownModal");
        const input = document.getElementById("takedownDateInput");

        modal.style.display = "block";

        // Default to today
        const today = new Date().toISOString().split("T")[0];
        input.value = today;
      }



window.addEventListener("click", function(event) {
  const modal = document.getElementById("takedownModal");
  if (event.target === modal) {
    closeTakedownModal();
  }
});

function deleteTrackedStyle(styleId) {
  if (!confirm("Delete this style?")) return;
  trackedStyles = trackedStyles.filter(style => style.id !== styleId);
  saveTrackedStyles();
  renderTrackedStyles();
}

function editTrackedStyle(styleId) {
  const style = trackedStyles.find(s => s.id === styleId);
  if (!style) return;

  document.getElementById("installDate").value = style.installDate.split("T")[0];
  document.getElementById("keepWeeks").value = style.plannedWeeks;
  document.getElementById("styleDescription").value = style.description || "";

  const trackerModal = document.getElementById("trackerModal");
  trackerModal.style.display = "block";
  trackerModal.dataset.editingId = styleId;
}

function reopenTrackedStyle(styleId) {
  const index = trackedStyles.findIndex(s => s.id === styleId);
  if (index === -1) return;

  const style = trackedStyles.splice(index, 1)[0]; // Remove style from array
  style.actualTakedownDate = null;                // Mark as current
  trackedStyles.unshift(style);                   // Add it to the **front** of the array

  saveTrackedStyles();
  renderTrackedStyles();
  switchTrackerTab("current");
}

function markStyleTakenDown(styleId) {
  const style = trackedStyles.find(s => s.id === styleId);
  if (!style) return;

  // Ask user for date
  const selectedDate = prompt("Enter takedown date (YYYY-MM-DD):");

  if (!selectedDate) return;

  const takedownDate = new Date(selectedDate);

  // Validate date
  if (isNaN(takedownDate.getTime())) {
    alert("Invalid date format. Please use YYYY-MM-DD.");
    return;
  }

  const installDate = new Date(style.installDate);

  // Prevent impossible timelines
  if (takedownDate < installDate) {
    alert("Takedown date cannot be before install date.");
    return;
  }

  // CALCULATIONS (same logic, just using selected date)
  const daysWorn = Math.max(0, Math.floor((takedownDate - installDate) / (1000 * 60 * 60 * 24)));
  const weeksWorn = daysWorn / 7;
  const growth = (daysWorn / 30) * style.growthRate;

  // SAVE VALUES
  style.actualTakedownDate = takedownDate.toISOString();
  style.completedAt = takedownDate.getTime(); // important for sorting
  style.actualDays = daysWorn;
  style.actualWeeks = weeksWorn;
  style.actualGrowth = growth;

  saveTrackedStyles();
  renderTrackedStyles();
}

function switchTrackerTab(tab) {
  const currentContainer = document.getElementById("currentStylesContainer");
  const historyContainer = document.getElementById("historyStylesContainer");
  const currentBtn = document.getElementById("currentTabBtn");
  const historyBtn = document.getElementById("historyTabBtn");

  if (tab === "current") {
    currentContainer.style.display = "block";
    historyContainer.style.display = "none";
    currentBtn.classList.add("active");
    historyBtn.classList.remove("active");
  } else {
    currentContainer.style.display = "none";
    historyContainer.style.display = "block";
    historyBtn.classList.add("active");
    currentBtn.classList.remove("active");
  }
}

// ---------------- IMAGE HELPERS ----------------
function expandImage(src) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.8)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "2000";

  const img = document.createElement("img");
  img.src = src;
  img.style.maxWidth = "90%";
  img.style.maxHeight = "90%";
  img.style.borderRadius = "10px";
  overlay.appendChild(img);
  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}

function resizeImage(file, maxWidth, maxHeight, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      let width = img.width;
      let height = img.height;
      const size = Math.min(width, height);
      const sx = (width - size) / 2;
      const sy = (height - size) / 2;
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, maxWidth, maxHeight);
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
      callback(compressedBase64);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ---------------- PAGE LOAD ----------------
document.addEventListener("DOMContentLoaded", () => {
  renderTrackedStyles();
});


function closeResults() {
  const displayInfo = document.getElementById('displayInfo2');
  const calcResult = document.getElementById('calculationResult2');
  const wrapper = document.querySelector('.calculator-wrapper');
  const callout = document.getElementById('scrollCallout');

  // Hide results
  if (displayInfo) {
    displayInfo.classList.remove('show-results');
    displayInfo.style.display = "none";
  }

  if (calcResult) {
    calcResult.classList.remove('show-results');
    calcResult.style.display = "none";
  }

  // Reset layout
  if (wrapper) {
    wrapper.classList.remove('results-open');
  }

  // Hide scroll callout again
  if (callout) {
    callout.style.display = "none";
  }
}


// ---------------- TOGGLE MEMORY & TAB ----------------
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleTrackedCard");
    const trackedCard = document.getElementById("trackedStylesSection");
    const currentContainer = trackedCard.querySelector("#currentStylesContainer");
    const historyContainer = trackedCard.querySelector("#historyStylesContainer");

    // 1️⃣ Restore last toggle state
    const lastState = localStorage.getItem("trackedCardExpanded");
    let isExpanded = lastState === null ? false : lastState === "true";

    if (isExpanded) {
        trackedCard.classList.remove("tracked-collapsed");
        toggleBtn.innerHTML = "&#9650;"; // arrow up
        // Show active tab
        const activeTab = trackedCard.querySelector(".tracker-tabs button.active");
        if (activeTab?.id === "currentTabBtn") {
            currentContainer.style.display = "block";
            historyContainer.style.display = "none";
        } else {
            currentContainer.style.display = "none";
            historyContainer.style.display = "block";
        }
    } else {
        trackedCard.classList.add("tracked-collapsed");
        toggleBtn.innerHTML = "&#9660;"; // arrow down
        currentContainer.style.display = "none";
        historyContainer.style.display = "none";
    }

    // 2️⃣ Toggle button click
    toggleBtn.addEventListener("click", () => {
        trackedCard.classList.toggle("tracked-collapsed");
        isExpanded = !trackedCard.classList.contains("tracked-collapsed");
        localStorage.setItem("trackedCardExpanded", isExpanded);

        // Update arrow
        toggleBtn.innerHTML = isExpanded ? "&#9650;" : "&#9660;";

        // Show/hide tabs based on state
        if (isExpanded) {
            const activeTab = trackedCard.querySelector(".tracker-tabs button.active");
            if (activeTab?.id === "currentTabBtn") {
                currentContainer.style.display = "block";
                historyContainer.style.display = "none";
            } else {
                currentContainer.style.display = "none";
                historyContainer.style.display = "block";
            }
        } else {
            currentContainer.style.display = "none";
            historyContainer.style.display = "none";
        }
    });
});