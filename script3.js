
    let goals = [];
    let history = [];

    function save() {
      localStorage.setItem("goals", JSON.stringify(goals));
      localStorage.setItem("history", JSON.stringify(history));
    }

    window.onload = () => {
      goals = JSON.parse(localStorage.getItem("goals")) || [];
      history = JSON.parse(localStorage.getItem("history")) || [];
      renderGoals();
      renderHistory();
    };

function addGoal() {
  const title = document.getElementById("goalTitle").value.trim();
  const date = document.getElementById("goalDate").value;
  if (!title) return;

  goals.push({  // push adds to the end
    id: Date.now(),
    title,
    targetDate: date || "",
    entries: []
  });

  save();
  renderGoals();

  document.getElementById("goalTitle").value = "";
  document.getElementById("goalDate").value = "";
}

function addEntry(goalId) {
  goalId = Number(goalId); // ensure it's a number

  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "white";
  popup.style.padding = "20px";
  popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  popup.style.zIndex = "1000";

  // Title
  const title = document.createElement("p");
  title.textContent = "Add progress note:";
  popup.appendChild(title);

  // Textarea
  const textarea = document.createElement("textarea");
  textarea.rows = 4;
  textarea.style.width = "100%";
  popup.appendChild(textarea);
  popup.appendChild(document.createElement("br"));

  // File input
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*"; // ← REQUIRED for camera roll

  const imageNote = document.createElement("small");
  imageNote.textContent = "For best results, upload a file or photo already saved on your phone (not live camera).";
  imageNote.style.display = "block";
  imageNote.style.marginBottom = "6px";
  imageNote.style.color = "#6E9AC4";

popup.appendChild(imageNote);


  popup.appendChild(fileInput);
  popup.appendChild(document.createElement("br"));
  popup.appendChild(document.createElement("br"));

  //

 fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  // Warn ONLY if camera metadata is detected (rare but safe)
  if (file.type === "" || !file.type.startsWith("image/")) {
    alert("Tip: For best results, upload a file or photo already saved on your phone.");
    fileInput.value = "";
  }
});




  // Save button
  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  popup.appendChild(saveBtn);

  // Cancel button
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.style.marginLeft = "10px";
  popup.appendChild(cancelBtn);

  document.body.appendChild(popup);

 saveBtn.onclick = () => {
  const note = textarea.value.trim();
  const file = fileInput.files?.[0] || null;

  if (file && !["image/jpeg", "image/png"].includes(file.type)) {
  alert("Only JPEG or PNG images are allowed.");
  return;
}


  if (!note && !file) {
    alert("Please add a note or select an image.");
    return;
  }

  const goal = goals.find(g => g.id === goalId);
  if (!goal) {
    alert("Goal not found!");
    return;
  }

  const entry = { text: note || "", date: new Date().toLocaleString() };

  if (file) {
    resizeImage(file, 300, 300, (resizedBase64) => {
      entry.image = resizedBase64;

      try {
        goal.entries.push(entry);
        save();                 // ✅ safeguarded
        renderGoals();
        document.body.removeChild(popup);
      } catch (e) {
        alert("Image too large to save. Please try a smaller photo.");
        console.error(e);
      }
    });

  } else {
    try {
      goal.entries.push(entry);
      save();                 // ✅ safeguarded
      renderGoals();
      document.body.removeChild(popup);
    } catch (e) {
      alert("Unable to save entry.");
      console.error(e);
    }
  }
};

  cancelBtn.onclick = () => {
    document.body.removeChild(popup);
  };
}





    function deleteEntry(goalId, index) {
      const goal = goals.find(g => g.id === goalId);
      goal.entries.splice(index, 1);
      save();
      renderGoals();
    }


    function editGoal(goalId) {
  const goal = goals.find(g => g.id === goalId);
  const goalCard = [...document.querySelectorAll(".goal-card")]
    .find(card => card.innerHTML.includes(`editGoal(${goalId})`));
  if (!goalCard) return;

  // Replace card content with editable form
  goalCard.innerHTML = `
    <input type="text" id="editTitle${goalId}" value="${goal.title}" style="width: 70%; font-size: 14px; margin-bottom: 8px;" />
    <input type="date" id="editDate${goalId}" value="${goal.targetDate}" style="font-size: 14px; margin-left: 5px;" /><br>
    <button onclick="saveEditGoal(${goalId})" style="margin-top: 10px;">Save</button>
    <button onclick="renderGoals()" style="margin-top: 10px; margin-left: 5px;">Cancel</button>
  `;
}


  

  function closeGoal(goalId) {
  const goal = goals.find(g => g.id === goalId);
  history.push(goal);
  goals = goals.filter(g => g.id !== goalId);
  save();
  renderGoals();
  renderHistory();

  // Show random congratulatory popup
  const randomMessage = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
  showCongratsPopup(randomMessage);
}


    function deleteGoal(goalId) {
      goals = goals.filter(g => g.id !== goalId);
      save();
      renderGoals();
    }

    function reopenGoal(goalId) {
      const goal = history.find(g => g.id === goalId);
      if (!goal) return;
      goals.unshift(goal);
      history = history.filter(g => g.id !== goalId);
      save();
      renderGoals();
      renderHistory();
    }

   // Helper function to format date
    function formatDate(dateStr) {
    if (!dateStr) return "Not set";
    const options = { year: "numeric", month: "short", day: "numeric" };
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", options); // e.g., Sep 15, 2027
    }

// Render current goals
   function renderGoals() {
  const container = document.getElementById("goalList");
  container.innerHTML = "";

  goals.forEach((goal, index) => {
    const div = document.createElement("div");
    div.className = "goal-card";
    div.innerHTML = `
      <div class="goal-title">Goal #${index + 1}: ${goal.title}</div>
      <small onclick="editTargetDate(${goal.id})" style="cursor: pointer; color: #6E9AC4;">
  Target Date: ${formatDate(goal.targetDate)}
</small><br>
      <span class="action-link" onclick="addEntry(${goal.id})">Add Progress Entry</span>
      <span class="action-link" onclick="closeGoal(${goal.id})">Close Goal</span>
      <span class="action-link" onclick="editGoal(${goal.id})">Edit Goal</span>
      <span class="action-link" onclick="deleteGoal(${goal.id})">Delete Goal</span>
      <div>
        ${goal.entries.map((e, i) => `
          <div class="entry">
          <div class="entry-left">
            ${e.image ? `<img src="${e.image}" class="entry-thumb" onclick="expandImage('${e.image}')" />` : ""}
          </div>
          <div class="entry-right">
            <div class="entry-text">${e.text}</div>
            <small>${e.date}</small><br>
            <span class="action-link" onclick="editEntry(${goal.id}, ${i})">Edit Entry</span>
            <span class="action-link" onclick="deleteEntry(${goal.id}, ${i})">Delete Entry</span>
          </div>
</div>

</div>

</div>

        `).join("")}
      </div>
    `;
    container.appendChild(div);
  });
}



// Render goal history
function renderHistory() {
  const container = document.getElementById("historyList");
  container.innerHTML = "";

  history.forEach(goal => {
    const div = document.createElement("div");
    div.className = "history-goal-card";
    div.style.marginBottom = "10px"; // <-- add spacing between cards
    div.innerHTML = `
      <div class="goal-title">${goal.title}</div>
      <small class="target-date">Target Date: ${formatDate(goal.targetDate)}</small><br>
      <div>
        ${goal.entries.map(e => `
          <div class="entry">
            <div class="entry-text">${e.text}</div>
            <small>${e.date}</small>
          </div>
        `).join("")}
      </div>
      <span class="action-link" onclick="reopenGoal(${goal.id})">Reopen Goal</span>
    `;

    container.appendChild(div);
  });
}



function editEntry(goalId, entryIndex) {
  const goal = goals.find(g => g.id === goalId);
  const entry = goal.entries[entryIndex];
  const newText = prompt("Edit progress note:", entry.text);
  if (newText) {
    entry.text = newText;
    entry.date = new Date().toLocaleString(); // optional: update timestamp
    save();
    renderGoals();
  }
}

function saveEditGoal(goalId) {
  const goal = goals.find(g => g.id === goalId);
  const newTitle = document.getElementById(`editTitle${goalId}`).value.trim();
  const newDate = document.getElementById(`editDate${goalId}`).value;

  if (newTitle) goal.title = newTitle;
  goal.targetDate = newDate;

  save();
  renderGoals();
}


const congratsMessages = [
  "Yesss! You crushed that goal! 🎉💖",
  "Another goal down — look at you glowing! ✨",
  "You did THAT! Proud of you! 🌟",
  "Goal completed — your hair journey is on fire! 🔥",
  "Snatched, successful, unstoppable! 💅🏾",
  "You're checking goals off like a pro! ✔️✨",
  "Your future self is cheering for you right now! 🙌",
  "Well done, queen! Keep going! 👑✨"
];

function showCongratsPopup(message) {
  // Create popup container
  const popup = document.createElement("div");
  popup.className = "congrats-popup";
  popup.innerHTML = `
      <div class="congrats-box">
        <p>${message}</p>
        <button onclick="this.parentElement.parentElement.remove()">OK</button>
      </div>
  `;

  document.body.appendChild(popup);

  // Auto-close after 3.5 seconds
  setTimeout(() => {
    if (popup.parentElement) popup.remove();
  }, 3500);
}
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");

      // Update active button
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update content
      tabContents.forEach((content) => {
        content.classList.remove("active");

        if (content.id === target) {
          // force reflow so animation restarts
          void content.offsetWidth;
          content.classList.add("active");
        }
      });
    });
  });
});





    document.getElementById("currentTab").onclick = () => {
      document.getElementById("currentGoals").classList.remove("hidden");
      document.getElementById("goalHistory").classList.add("hidden");
      document.getElementById("currentTab").classList.add("active");
      document.getElementById("historyTab").classList.remove("active");
    };

    document.getElementById("historyTab").onclick = () => {
      document.getElementById("goalHistory").classList.remove("hidden");
      document.getElementById("currentGoals").classList.add("hidden");
      document.getElementById("historyTab").classList.add("active");
      document.getElementById("currentTab").classList.remove("active");
    };

function expandImage(src) {
  // Create overlay
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

  // Large image
  const img = document.createElement("img");
  img.src = src;
  img.style.maxWidth = "90%";
  img.style.maxHeight = "90%";
  img.style.borderRadius = "10px";
  overlay.appendChild(img);

  // Click anywhere to close
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

      // Keep square crop
      const size = Math.min(width, height);
      const sx = (width - size) / 2;
      const sy = (height - size) / 2;

      canvas.width = maxWidth;
      canvas.height = maxHeight;

      ctx.drawImage(
        img,
        sx, sy, size, size,
        0, 0, maxWidth, maxHeight
      );

      // Compress to JPEG
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
      callback(compressedBase64);
    };

    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}
