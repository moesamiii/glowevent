// Language Toggle Function
let currentLanguage = "ar"; // Default language

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
  if (
    questionElement &&
    typeof questions !== "undefined" &&
    typeof currentQuestionIndex !== "undefined"
  ) {
    const question = questions[currentQuestionIndex];
    if (currentLanguage === "en" && question.en) {
      questionElement.textContent = question.en;
    } else if (question.ar) {
      questionElement.textContent = question.ar;
    }
  }
}

// Helper function to update result text based on current language
function updateResultText() {
  const resultElement = document.getElementById("resultSkinType");
  if (resultElement && resultElement.hasAttribute("data-en")) {
    if (currentLanguage === "en") {
      resultElement.textContent = resultElement.getAttribute("data-en");
    } else {
      resultElement.textContent = resultElement.getAttribute("data-ar");
    }
  }
}
