// Object to store the user's answers
const quizAnswers = {};

// Store numerical inputs
function storeInput(key, value) {
  quizAnswers[key] = parseFloat(value) || 0;
}

// Main submit handler
function submitQuiz() {
  // Collect answers
  quizAnswers['dollarsspent'] = parseFloat(document.getElementById('dollarsspent').value) || 0;
  quizAnswers['timespent'] = parseFloat(document.getElementById('timespent').value) || 0;
  quizAnswers['timevalue'] = parseFloat(document.getElementById('timevalue').value) || 0;
  quizAnswers['budget'] = parseFloat(document.getElementById('budget').value) || 0;

  displayInputtedInfo();
  calculateRecommendedDays();  // <-- recalculates every submit
  showResultsAndReflow();

}

// Display inputs
function displayInputtedInfo() {
  const displayDiv = document.getElementById('displayInfo');
  
  displayDiv.innerHTML = `
    <h2>Inputted Information</h2>
    <p><strong>Total Spent on Hairstyle:</strong> $${quizAnswers.dollarsspent}</p>
    <p><strong>Time Spent on Hairstyle:</strong> ${quizAnswers.timespent} hours</p>
    <p><strong>Value of Your Time:</strong> $${quizAnswers.timevalue}/hour</p>
    <p><strong> Monthly Budget:</strong> $${quizAnswers.budget}</p>
  `;

  displayDiv.style.visibility = "visible";
}

// Rounds to nearest 0.5
function roundToNearestHalf(num) {
  return Math.round(num * 2) / 2;
}

// Perform calculation + show result
function calculateRecommendedDays() {
  const Q1 = quizAnswers.dollarsspent;
  const Q2 = quizAnswers.timespent;
  const Q3 = quizAnswers.timevalue;
  const Q4 = quizAnswers.budget;

  const recommendedDays = ((Q1 + (Q2 * Q3)) / Q4) * 30;
  const recommendedWeeks = roundToNearestHalf(recommendedDays / 7);

  const resultDiv = document.getElementById('calculationResult');

  // ALWAYS fully replace prior results
  resultDiv.innerHTML = `
    <h2>Results</h2>
    <p>Recommended Days to Keep in the Style: <strong>${Math.round(recommendedDays)}</strong></p>
    <p>Recommended Weeks to Keep in the Style: <strong>${recommendedWeeks}</strong></p>
  `;

  // Add funny comment if needed
  if (recommendedWeeks > 6.5) {
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

    resultDiv.innerHTML += `
      <p style="margin-top:10px; text-align:center; font-style:italic; color:#6E9AC4; font-size:13px">
        ${randomComment}
      </p>
    `;
  }

  resultDiv.style.visibility = "visible";
}


function showResultsAndReflow() {
  const wrapper = document.querySelector('.calculator-wrapper') || document.body;
  wrapper.classList.add('results-open');

  const displayInfo = document.getElementById('displayInfo');
  const calcResult = document.getElementById('calculationResult');
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

