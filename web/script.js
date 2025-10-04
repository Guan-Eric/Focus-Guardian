const form = document.getElementById("waitlist-form");
const successMsg = document.getElementById("success-msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      form.reset();
      successMsg.classList.remove("hidden");
      successMsg.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Oops! Something went wrong. Try again.");
    }
  } catch (error) {
    alert("Oops! Something went wrong. Try again.");
  }
});
