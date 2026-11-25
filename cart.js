const cartKey = "mobilemart_cart";
const products = [
  { id: 1, name: "iPhone 15", brand: "Apple", price: 899 },
  { id: 2, name: "iPhone 14", brand: "Apple", price: 749 },
  { id: 3, name: "Galaxy S24", brand: "Samsung", price: 829 },
  { id: 4, name: "Galaxy A55", brand: "Samsung", price: 429 },
  { id: 5, name: "Xiaomi 14", brand: "Xiaomi", price: 649 },
  { id: 6, name: "Redmi Note 13 Pro", brand: "Xiaomi", price: 329 },
  { id: 7, name: "OnePlus 12", brand: "OnePlus", price: 699 },
  { id: 8, name: "OnePlus Nord 3", brand: "OnePlus", price: 399 }
];

const itemsEl = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const badgeEl = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

function getCart() {
  try { return JSON.parse(localStorage.getItem(cartKey)) || []; }
  catch { return []; }
}

function setCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function cartTotalQty(cart) {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal(cart) {
  return cart.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}

function render() {
  const cart = getCart();
  badgeEl.textContent = String(cartTotalQty(cart));

  if (!cart.length) {
    itemsEl.innerHTML = "<p class='meta'>Your cart is empty.</p>";
    subtotalEl.textContent = "$0";
    return;
  }

  itemsEl.innerHTML = cart.map((item) => {
    const p = products.find((x) => x.id === item.id);
    if (!p) return "";
    return `
      <div class="item">
        <h3>${p.name}</h3>
        <p class="meta">${p.brand} - $${p.price}</p>
        <div class="controls">
          <button data-minus="${p.id}">-</button>
          <strong>${item.qty}</strong>
          <button data-plus="${p.id}">+</button>
          <button data-remove="${p.id}">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  subtotalEl.textContent = `$${cartSubtotal(cart)}`;
}

itemsEl.addEventListener("click", (e) => {
  const plus = e.target.closest("[data-plus]");
  const minus = e.target.closest("[data-minus]");
  const remove = e.target.closest("[data-remove]");
  let cart = getCart();

  if (plus) {
    const id = Number(plus.dataset.plus);
    const found = cart.find((x) => x.id === id);
    if (found) found.qty += 1;
  }

  if (minus) {
    const id = Number(minus.dataset.minus);
    const found = cart.find((x) => x.id === id);
    if (found) {
      found.qty -= 1;
      if (found.qty <= 0) cart = cart.filter((x) => x.id !== id);
    }
  }

  if (remove) {
    const id = Number(remove.dataset.remove);
    cart = cart.filter((x) => x.id !== id);
  }

  setCart(cart);
  render();
});

checkoutBtn.addEventListener("click", () => {
  alert("Checkout coming soon");
});

render();


