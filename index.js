const cartKey = "mobilemart_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch {
    return [];
  }
}

function updateBadge() {
  const total = getCart().reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cartCount");
  if (badge) badge.textContent = String(total);
}

const offersBtn = document.getElementById("offersBtn");
if (offersBtn) {
  offersBtn.addEventListener("click", () => {
    alert("Special offers are live on Products page!");
  });
}

updateBadge();


