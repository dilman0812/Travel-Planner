const btn = document.querySelector(".btn-button");
const feedback = document.querySelector(".feedback-container");

btn.addEventListener("click", () => {
    feedback.innerHTML = `<h1>Thank you for your feedback</h1>`;
});

