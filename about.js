const cartKey = "mobilemart_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
  } catch {
    return [];
  }
}

const total = getCart().reduce((sum, item) => sum + item.qty, 0);
const badge = document.getElementById("cartCount");
if (badge) badge.textContent = String(total);


