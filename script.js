// User Data Storage
let userData = {
  fullName: "",
  phoneNumber: "",
  skinType: "",
  answers: [],
};

// Language state
let currentLanguage = "ar"; // Default language

// General Quiz Questions (bilingual)
const generalQuestions = [
  {
    ar: "هل يظهر اللمعان على بشرتك بعد ساعات قليلة من الغسل؟",
    en: "Does your skin shine a few hours after washing?",
    skinTypes: { yes: "دهنية", no: null },
  },
  {
    ar: "هل تشعر بشد في البشرة بعد الغسل؟",
    en: "Do you feel tightness in your skin after washing?",
    skinTypes: { yes: "جافة", no: null },
  },
  {
    ar: "هل تعاني من اتساع المسام؟",
    en: "Do you suffer from enlarged pores?",
    skinTypes: { yes: "دهنية", no: null },
  },
  {
    ar: "هل تحتاج إلى ترطيب متكرر خلال اليوم؟",
    en: "Do you need frequent moisturizing during the day?",
    skinTypes: { yes: "جافة", no: null },
  },
  {
    ar: "هل تختلف حالة بشرتك بين منطقة الجبهة والأنف مقارنة بباقي الوجه؟",
    en: "Does your skin condition differ between the forehead and nose compared to the rest of your face?",
    skinTypes: { yes: "مختلطة", no: null },
  },
  {
    ar: "هل تظهر الحبوب بسهولة على بشرتك؟",
    en: "Do pimples appear easily on your skin?",
    skinTypes: { yes: "دهنية", no: null },
  },
  {
    ar: "هل تعاني من التقشّر أحيانًا؟",
    en: "Do you sometimes suffer from peeling?",
    skinTypes: { yes: "جافة", no: null },
  },
];

// Skin type translations
const skinTypeTranslations = {
  دهنية: { ar: "دهنية", en: "Oily" },
  جافة: { ar: "جافة", en: "Dry" },
  مختلطة: { ar: "مختلطة", en: "Combination" },
  عادية: { ar: "عادية", en: "Normal" },
};

// Alert messages
const messages = {
  fillName: {
    ar: "الرجاء تعبئة الاسم الكامل",
    en: "Please fill in your full name",
  },
  fillPhone: {
    ar: "الرجاء تعبئة رقم الجوال",
    en: "Please fill in your phone number",
  },
  fillEmail: {
    ar: "الرجاء تعبئة البريد الإلكتروني",
    en: "Please fill in your email",
  },
  fillAge: {
    ar: "الرجاء تعبئة العمر",
    en: "Please fill in your age",
  },
  fillGender: {
    ar: "الرجاء اختيار الجنس",
    en: "Please select your gender",
  },
  giveConsent: {
    ar: "يرجى الموافقة على التواصل معك",
    en: "Please agree to be contacted",
  },
  registering: {
    ar: "جاري التسجيل...",
    en: "Registering...",
  },
};

let currentQuestionIndex = 0;
let skinTypeScores = {
  دهنية: 0,
  جافة: 0,
  مختلطة: 0,
};

// Language Toggle Function
function toggleLanguage() {
  const html = document.documentElement;

  if (currentLanguage === "ar") {
    // Switch to English
    currentLanguage = "en";
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");
    document.getElementById("langText").textContent = "العربية";

    // Update all text elements
    document.querySelectorAll("[data-en]").forEach((element) => {
      if (element.tagName === "INPUT") {
        element.placeholder = element.getAttribute("data-placeholder-en");
      } else if (element.tagName === "OPTION") {
        element.textContent = element.getAttribute("data-en");
      } else if (
        element.tagName === "LABEL" &&
        !element.classList.contains("checkbox-label")
      ) {
        // Don't update checkbox label content here, it has special handling
        element.textContent = element.getAttribute("data-en");
      } else if (
        element.tagName === "SPAN" &&
        element.parentElement.classList.contains("checkbox-label")
      ) {
        // Update checkbox label span
        element.textContent = element.getAttribute("data-en");
      } else {
        element.innerHTML = element.getAttribute("data-en");
      }
    });

    // Update arrow icons direction
    document
      .querySelectorAll(".btn-primary i.fa-arrow-left")
      .forEach((icon) => {
        icon.classList.remove("fa-arrow-left");
        icon.classList.add("fa-arrow-right");
      });
  } else {
    // Switch to Arabic
    currentLanguage = "ar";
    html.setAttribute("lang", "ar");
    html.setAttribute("dir", "rtl");
    document.getElementById("langText").textContent = "English";

    // Update all text elements
    document.querySelectorAll("[data-ar]").forEach((element) => {
      if (element.tagName === "INPUT") {
        element.placeholder = element.getAttribute("data-placeholder-ar");
      } else if (element.tagName === "OPTION") {
        element.textContent = element.getAttribute("data-ar");
      } else if (
        element.tagName === "LABEL" &&
        !element.classList.contains("checkbox-label")
      ) {
        // Don't update checkbox label content here, it has special handling
        element.textContent = element.getAttribute("data-ar");
      } else if (
        element.tagName === "SPAN" &&
        element.parentElement.classList.contains("checkbox-label")
      ) {
        // Update checkbox label span
        element.textContent = element.getAttribute("data-ar");
      } else {
        element.innerHTML = element.getAttribute("data-ar");
      }
    });

    // Update arrow icons direction
    document
      .querySelectorAll(".btn-primary i.fa-arrow-right")
      .forEach((icon) => {
        icon.classList.remove("fa-arrow-right");
        icon.classList.add("fa-arrow-left");
      });
  }

  // Update questions if on quiz screen
  if (document.getElementById("screen3").classList.contains("active")) {
    updateQuestionText();
  }

  // Update result text if on result screen
  if (document.getElementById("screen4").classList.contains("active")) {
    updateResultText();
  }
}

// Helper function to update question text based on current language
function updateQuestionText() {
  const questionElement = document.getElementById("questionText");
  if (questionElement && currentQuestionIndex < generalQuestions.length) {
    const question = generalQuestions[currentQuestionIndex];
    questionElement.textContent =
      currentLanguage === "en" ? question.en : question.ar;
  }
}

// Helper function to update result text based on current language
function updateResultText() {
  const resultElement = document.getElementById("resultSkinType");
  if (resultElement && userData.skinType) {
    const translation = skinTypeTranslations[userData.skinType];
    if (translation) {
      resultElement.textContent =
        currentLanguage === "en" ? translation.en : translation.ar;
    }
  }
}

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
  const email = document.getElementById("email").value.trim();
  const age = document.getElementById("age").value.trim();
  const gender = document.getElementById("gender").value;
  const consent = document.getElementById("consent").checked;

  // Validation
  if (!fullName) {
    alert(messages.fillName[currentLanguage]);
    document.getElementById("fullName").focus();
    return false;
  }

  if (!phoneNumber) {
    alert(messages.fillPhone[currentLanguage]);
    document.getElementById("phoneNumber").focus();
    return false;
  }

  if (!email) {
    alert(messages.fillEmail[currentLanguage]);
    document.getElementById("email").focus();
    return false;
  }

  if (!age) {
    alert(messages.fillAge[currentLanguage]);
    document.getElementById("age").focus();
    return false;
  }

  if (!gender) {
    alert(messages.fillGender[currentLanguage]);
    document.getElementById("gender").focus();
    return false;
  }

  if (!consent) {
    alert(messages.giveConsent[currentLanguage]);
    return false;
  }

  // Store user data
  userData.fullName = fullName;
  userData.phoneNumber = phoneNumber;
  userData.email = email;
  userData.age = age;
  userData.gender = gender;

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
      const question = generalQuestions[currentQuestionIndex];
      questionText.textContent =
        currentLanguage === "en" ? question.en : question.ar;

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
  const answerText = answer
    ? currentLanguage === "en"
      ? "Yes"
      : "نعم"
    : currentLanguage === "en"
      ? "No"
      : "لا";

  userData.answers.push(answerText);

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
  const resultElement = document.getElementById("resultSkinType");
  const translation = skinTypeTranslations[userData.skinType];

  // Set both data attributes for language switching
  resultElement.setAttribute("data-ar", translation.ar);
  resultElement.setAttribute("data-en", translation.en);

  // Display in current language
  resultElement.textContent =
    currentLanguage === "en" ? translation.en : translation.ar;

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
  const btnSpan = btn.querySelector("span");
  const originalText = btn.innerHTML;

  const loadingHTML =
    currentLanguage === "en"
      ? '<span class="loading"></span> Registering...'
      : '<span class="loading"></span> جاري التسجيل...';

  btn.innerHTML = loadingHTML;
  btn.disabled = true;

  // Prepare answers string
  const answersString = generalQuestions
    .map((q, i) => {
      const questionText = currentLanguage === "en" ? q.en : q.ar;
      return `${questionText}: ${userData.answers[i]}`;
    })
    .join(" | ");

  // Get skin type in both languages for Google Sheets
  const skinTypeText = `${skinTypeTranslations[userData.skinType].ar} / ${skinTypeTranslations[userData.skinType].en}`;

  // Post to Google Sheets
  $.ajax({
    url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfuScGbnSmXtNe4Q578TQBhmicwiGxCEr_1ncp1irAskli7cA/formResponse",
    data: {
      "entry.858750066": userData.fullName,
      "entry.785700683": userData.phoneNumber,
      "entry.1231278323": skinTypeText,
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
