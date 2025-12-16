// Store all user inputs
const quizAnswers = {};

// Save inputs from fields
function storeInput(key, value) {
  quizAnswers[key] = value; 
}

// Growth rate lookup (inches per week)
const growthValues = {
  "0.125": 0.125,    // Fast
  "0.0875": 0.0875,  // Average
  "0.05": 0.05       // Slow
};

// Round to nearest half
function roundToNearestHalf(num) {
  return Math.round(num * 2) / 2;
}

// MAIN SUBMIT FUNCTION
function submitQuiz() {

  // Read values from the HTML fields
  quizAnswers.growthRate = document.getElementById('growthRate').value;
  quizAnswers.desiredGrowth = parseFloat(document.getElementById('desiredGrowth').value) || 0;

  // Display the inputted information
  displayInputtedInfo();

  // Perform calculation
  calculateRecommendedWeeks();

  showResultsAndReflow();


}

// DISPLAY INPUTS BACK TO USER
function displayInputtedInfo() {
  const displayDiv = document.getElementById('displayInfo2');
  displayDiv.innerHTML = ""; 
  displayDiv.style.visibility = "visible";

  // Convert growth rate label for display
  let growthText = "Not selected";

  if (quizAnswers.growthRate === "0.125") growthText = "Fast (0.5 in/month)";
  else if (quizAnswers.growthRate === "0.0875") growthText = "Average (0.35 in/month)";
  else if (quizAnswers.growthRate === "0.05") growthText = "Slow (0.2 in/month)";
  else if (quizAnswers.growthRate === "unsure") growthText = "I'm not sure";

  displayDiv.innerHTML += `
    <h2>Inputted Information</h2>
    <p><strong>Growth Rate:</strong> ${growthText}</p>
    <p><strong>Desired New Growth:</strong> ${quizAnswers.desiredGrowth} inches</p>
  `;
}

// CALCULATION FUNCTION
function calculateRecommendedWeeks() {
  const desiredGrowth = quizAnswers.desiredGrowth;
  const selection = quizAnswers.growthRate;

  const resultDiv = document.getElementById('calculationResult2');
  resultDiv.innerHTML = "<h2>Results</h2>";
  resultDiv.style.visibility = "visible";

  // Validate desired growth
  if (desiredGrowth <= 0) {
    resultDiv.innerHTML += `<p style="color:red;">Please enter how much new growth you want.</p>`;
    return;
  }

  let weeks, minWeeks, maxWeeks;

  // USER SELECTED FAST / AVERAGE / SLOW
  if (selection !== "unsure" && selection !== "0") {
    const rate = parseFloat(selection);
    weeks = roundToNearestHalf(desiredGrowth / rate);

    resultDiv.innerHTML += `
      <p>Recommended Weeks to Keep the Style:</p>
      <p><strong>${weeks} weeks</strong></p>
      <p>Equivalent in Days: <strong>${Math.round(weeks * 7)} days</strong></p>
    `;
  } 
  // USER SELECTED “I'M NOT SURE”
  else if (selection === "unsure") {
    minWeeks = roundToNearestHalf(desiredGrowth / growthValues["0.125"]); // Fast rate
    maxWeeks = roundToNearestHalf(desiredGrowth / growthValues["0.05"]);  // Slow rate

    resultDiv.innerHTML += `
      <p>Estimated range: fast vs. slow growth</p>
      <p><strong>${minWeeks} – ${maxWeeks} weeks</strong></p>
      <p>or</p>
      <p><strong>${Math.round(minWeeks * 7)} – ${Math.round(maxWeeks * 7)} days</strong></p>
    `;
  }

  // Add funny comment for all cases
  const funnyComments = [
    "Hmm… something’s gotta give, sista that’s a long time!🤔",
    "Looks like you'll be rocking this for a minute!⏳",
    "I hope these are mini twists if you’re planning to have them this long 😅",
    "Remember, this is just a suggestion cause if your hair starts locking, please take it out 😭",
    "Girl… that’s a commitment. Are you ready for the long haul?",
    "OH, ok 😦",
    "Hopefully you don’t get tired of this style like you did your last man. But if you do, we’re here for you… to help you find a new style, of course 😉"
  ];

  let weeksToCheck;
  if (selection === "unsure") {
    weeksToCheck = maxWeeks;
  } else if (selection !== "0") {
    weeksToCheck = weeks;
  }

  if (weeksToCheck > 6.5) {
    const randomComment = funnyComments[Math.floor(Math.random() * funnyComments.length)];
    resultDiv.innerHTML += `
      <p style="margin-top:10px; text-align:center; font-style:italic; color:#6E9AC4; font-size:13px">
        ${randomComment}
      </p>
    `;
  }
}

function showResultsAndReflow() {
  const wrapper = document.querySelector('.calculator-wrapper') || document.body;
  wrapper.classList.add('results-open');

  const displayInfo = document.getElementById('displayInfo2');
  const calcResult = document.getElementById('calculationResult2');
  if (displayInfo) displayInfo.classList.add('show-results');
  if (calcResult) calcResult.classList.add('show-results');

  // show scroll callout
  const callout = document.getElementById('scrollCallout');
  if (callout) callout.style.display = 'block';

  // scroll to card
  const card = document.querySelector('.card, .card2, .maincard');
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


