const cartKey = "mobilemart_cart";
const badge = document.getElementById("cartCount");
try {
  const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  badge.textContent = String(total);
} catch {
  badge.textContent = "0";
}

const form = document.getElementById("contactForm");
const errorEl = document.getElementById("formError");
const toast = document.getElementById("toast");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const topic = document.getElementById("topic").value;
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    errorEl.textContent = "Please fill in all fields.";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorEl.textContent = "Please enter a valid email address.";
    return;
  }

  if (phone && !/^[0-9+\-\s()]{7,}$/.test(phone)) {
    errorEl.textContent = "Please enter a valid phone number.";
    return;
  }

  errorEl.textContent = "";
  form.reset();
  showToast(`Message sent for ${topic}. We will contact you soon.`);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}


