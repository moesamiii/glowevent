// User Data Storage
let userData = {
  fullName: "",
  phoneNumber: "",
  skinType: "",
  answers: [],
};

// General Quiz Questions (asked to everyone)
const generalQuestions = [
  {
    question: "هل يظهر اللمعان على بشرتك بعد ساعات قليلة من الغسل؟",
    skinTypes: { yes: "دهنية", no: null },
  },
  {
    question: "هل تشعر بشد في البشرة بعد الغسل؟",
    skinTypes: { yes: "جافة", no: null },
  },
  {
    question: "هل تعاني من اتساع المسام؟",
    skinTypes: { yes: "دهنية", no: null },
  },
  {
    question: "هل تحتاج إلى ترطيب متكرر خلال اليوم؟",
    skinTypes: { yes: "جافة", no: null },
  },
  {
    question: "هل تختلف حالة بشرتك بين منطقة الجبهة والأنف مقارنة بباقي الوجه؟",
    skinTypes: { yes: "مختلطة", no: null },
  },
  {
    question: "هل تظهر الحبوب بسهولة على بشرتك؟",
    skinTypes: { yes: "دهنية", no: null },
  },
  {
    question: "هل تعاني من التقشّر أحيانًا؟",
    skinTypes: { yes: "جافة", no: null },
  },
];

let currentQuestionIndex = 0;
let skinTypeScores = {
  دهنية: 0,
  جافة: 0,
  مختلطة: 0,
};

// Screen Navigation
function nextScreen(screenNumber) {
  const currentActive = document.querySelector(".screen.active");

  if (currentActive) {
    currentActive.classList.add("exit-left");
    setTimeout(() => {
      currentActive.classList.remove("active", "exit-left");
    }, 400);
  }

  setTimeout(() => {
    document.getElementById(`screen${screenNumber}`).classList.add("active");
  }, 400);
}

// Form Submission
function submitForm() {
  const fullName = document.getElementById("fullName").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const consent = document.getElementById("consent").checked;

  // Validation
  if (!fullName) {
    alert("الرجاء تعبئة الاسم الكامل");
    document.getElementById("fullName").focus();
    return false;
  }

  if (!phoneNumber) {
    alert("الرجاء تعبئة رقم الجوال");
    document.getElementById("phoneNumber").focus();
    return false;
  }

  if (!consent) {
    alert("يرجى الموافقة على التواصل معك");
    return false;
  }

  // Store user data
  userData.fullName = fullName;
  userData.phoneNumber = phoneNumber;

  // Initialize quiz
  currentQuestionIndex = 0;
  userData.answers = [];
  skinTypeScores = {
    دهنية: 0,
    جافة: 0,
    مختلطة: 0,
  };

  // Show quiz screen
  nextScreen(3);
  loadQuestion();
}

// Load Question
function loadQuestion() {
  if (currentQuestionIndex < generalQuestions.length) {
    const questionContainer = document.querySelector(".question-container");
    const questionText = document.getElementById("questionText");

    // Fade out and update
    questionContainer.style.opacity = "0";
    questionContainer.style.transform = "scale(0.95)";

    setTimeout(() => {
      questionText.textContent =
        generalQuestions[currentQuestionIndex].question;
      document.getElementById("currentQuestion").textContent =
        currentQuestionIndex + 1;
      document.getElementById("totalQuestions").textContent =
        generalQuestions.length;
      updateProgress();

      // Fade in
      questionContainer.style.opacity = "1";
      questionContainer.style.transform = "scale(1)";
    }, 300);
  } else {
    // All questions answered, calculate and show result
    calculateSkinType();
    showResult();
  }
}

// Answer Question
function answerQuestion(answer) {
  const currentQuestion = generalQuestions[currentQuestionIndex];
  userData.answers.push(answer ? "نعم" : "لا");

  // Update skin type scores based on answer
  if (answer && currentQuestion.skinTypes.yes) {
    skinTypeScores[currentQuestion.skinTypes.yes]++;
  } else if (!answer && currentQuestion.skinTypes.no) {
    skinTypeScores[currentQuestion.skinTypes.no]++;
  }

  currentQuestionIndex++;

  if (currentQuestionIndex < generalQuestions.length) {
    loadQuestion();
  } else {
    calculateSkinType();
    showResult();
  }
}

// Calculate Skin Type based on answers
function calculateSkinType() {
  // Find the skin type with highest score
  let maxScore = 0;
  let determinedSkinType = "مختلطة"; // Default if no clear winner

  for (let skinType in skinTypeScores) {
    if (skinTypeScores[skinType] > maxScore) {
      maxScore = skinTypeScores[skinType];
      determinedSkinType = skinType;
    }
  }

  // If no clear winner (all scores are low or equal), default to مختلطة
  if (maxScore === 0) {
    determinedSkinType = "مختلطة";
  }

  userData.skinType = determinedSkinType;
}

// Update Progress Bar
function updateProgress() {
  const progress = ((currentQuestionIndex + 1) / generalQuestions.length) * 100;
  document.getElementById("progressBar").style.width = progress + "%";
}

// Show Result
function showResult() {
  document.getElementById("resultSkinType").textContent = userData.skinType;
  nextScreen(4);
}

// Create Confetti Effect
function createConfetti() {
  const screen = document.getElementById("screen5");
  const colors = ["#667eea", "#764ba2", "#FFD700", "#4CAF50"];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 3 + "s";
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
    screen.appendChild(confetti);

    setTimeout(() => confetti.remove(), 5000);
  }
}

// Complete Registration and Post to Google Sheets
function completeRegistration() {
  // Show loading state
  const btn = event.target;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span> جاري التسجيل...';
  btn.disabled = true;

  // Prepare answers string
  const answersString = generalQuestions
    .map((q, i) => {
      return `${q.question}: ${userData.answers[i]}`;
    })
    .join(" | ");

  // Post to Google Sheets
  $.ajax({
    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfuScGbnSmXtNe4Q578TQBhmicwiGxCEr_1ncp1irAskli7cA/formResponse",
    data: {
      "entry.858750066": userData.fullName,
      "entry.785700683": userData.phoneNumber,
      "entry.1231278323": userData.skinType,
      "entry.993362107": answersString,
    },
    type: "POST",
    dataType: "xml",
    success: function (d) {
      nextScreen(5);
      setTimeout(createConfetti, 500);
      btn.innerHTML = originalText;
      btn.disabled = false;
    },
    error: function (x, y, z) {
      // Google Forms always returns error, but data is submitted
      nextScreen(5);
      setTimeout(createConfetti, 500);
      btn.innerHTML = originalText;
      btn.disabled = false;
    },
  });
}

// Reset Experience
function resetExperience() {
  // Clear form
  document.getElementById("participantForm").reset();

  // Reset user data
  userData = {
    fullName: "",
    phoneNumber: "",
    skinType: "",
    answers: [],
  };

  currentQuestionIndex = 0;
  skinTypeScores = {
    دهنية: 0,
    جافة: 0,
    مختلطة: 0,
  };

  // Go back to start
  nextScreen(1);
}

// Auto-reset after 30 seconds on confirmation screen
let autoResetTimer;

function startAutoReset() {
  clearTimeout(autoResetTimer);
  autoResetTimer = setTimeout(() => {
    if (document.getElementById("screen5").classList.contains("active")) {
      resetExperience();
    }
  }, 30000); // 30 seconds
}

// Monitor screen 5 (confirmation screen)
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (
      mutation.target.id === "screen5" &&
      mutation.target.classList.contains("active")
    ) {
      startAutoReset();
    }
  });
});

// Start observing when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const screen5 = document.getElementById("screen5");
  if (screen5) {
    observer.observe(screen5, { attributes: true, attributeFilter: ["class"] });
  }
});
