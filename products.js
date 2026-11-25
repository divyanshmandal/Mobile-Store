const products = [
  { id: 1, name: "iPhone 15", brand: "Apple", price: 899, rating: 4.8, tag: "New" },
  { id: 2, name: "iPhone 14", brand: "Apple", price: 749, rating: 4.6, tag: "Hot" },
  { id: 3, name: "Galaxy S24", brand: "Samsung", price: 829, rating: 4.7, tag: "New" },
  { id: 4, name: "Galaxy A55", brand: "Samsung", price: 429, rating: 4.3, tag: "Hot" },
  { id: 5, name: "Xiaomi 14", brand: "Xiaomi", price: 649, rating: 4.5, tag: "New" },
  { id: 6, name: "Redmi Note 13 Pro", brand: "Xiaomi", price: 329, rating: 4.2, tag: "Hot" },
  { id: 7, name: "OnePlus 12", brand: "OnePlus", price: 699, rating: 4.6, tag: "New" },
  { id: 8, name: "OnePlus Nord 3", brand: "OnePlus", price: 399, rating: 4.1, tag: "Hot" }
];

const cartKey = "mobilemart_cart";
let activeBrand = "All";
let activeSort = "default";
let term = "";
let quickId = null;

const grid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.getElementById("filterButtons");
const sortSelect = document.getElementById("sortSelect");
const modal = document.getElementById("quickModal");
const qTag = document.getElementById("qTag");
const qName = document.getElementById("qName");
const qBrand = document.getElementById("qBrand");
const qRating = document.getElementById("qRating");
const qPrice = document.getElementById("qPrice");
const qAdd = document.getElementById("qAdd");

function getCart() {
  try { return JSON.parse(localStorage.getItem(cartKey)) || []; }
  catch { return []; }
}

function setCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function updateBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.getElementById("cartCount").textContent = String(total);
}

function stars(rating) {
  const full = Math.round(rating);
  return `${"★".repeat(full)}${"☆".repeat(5 - full)}`;
}

function getVisibleProducts() {
  const filtered = products.filter((p) => {
    const byBrand = activeBrand === "All" || p.brand === activeBrand;
    const byTerm = p.name.toLowerCase().includes(term) || p.brand.toLowerCase().includes(term);
    return byBrand && byTerm;
  });
  if (activeSort === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (activeSort === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (activeSort === "rating-desc") filtered.sort((a, b) => b.rating - a.rating);
  return filtered;
}

function renderProducts() {
  const items = getVisibleProducts();
  if (!items.length) {
    grid.innerHTML = "<p>No products found.</p>";
    return;
  }
  grid.innerHTML = items.map((p) => `
    <article class="card">
      <span class="tag">${p.tag}</span>
      <h3>${p.name}</h3>
      <p class="meta">${p.brand}</p>
      <p class="stars">${stars(p.rating)} (${p.rating.toFixed(1)})</p>
      <p class="price">$${p.price}</p>
      <div class="actions">
        <button class="btn btn-primary" data-add="${p.id}">Add to Cart</button>
        <button class="btn btn-outline" data-quick="${p.id}">Quick View</button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const cart = getCart();
  const found = cart.find((i) => i.id === id);
  if (found) found.qty += 1;
  else cart.push({ id, qty: 1 });
  setCart(cart);
  updateBadge();
  alert("Added to cart");
}

function openQuick(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  quickId = id;
  qTag.textContent = p.tag;
  qName.textContent = p.name;
  qBrand.textContent = `Brand: ${p.brand}`;
  qRating.textContent = `Rating: ${stars(p.rating)} (${p.rating.toFixed(1)})`;
  qPrice.textContent = `$${p.price}`;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeQuick() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  quickId = null;
}

searchInput.addEventListener("input", () => {
  term = searchInput.value.trim().toLowerCase();
  renderProducts();
});

filterButtons.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-brand]");
  if (!btn) return;
  activeBrand = btn.dataset.brand;
  [...filterButtons.querySelectorAll("button")].forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderProducts();
});

sortSelect.addEventListener("change", () => {
  activeSort = sortSelect.value;
  renderProducts();
});

grid.addEventListener("click", (e) => {
  const addBtn = e.target.closest("[data-add]");
  const quickBtn = e.target.closest("[data-quick]");
  if (addBtn) addToCart(Number(addBtn.dataset.add));
  if (quickBtn) openQuick(Number(quickBtn.dataset.quick));
});

modal.addEventListener("click", (e) => {
  if (e.target.dataset.close === "1") closeQuick();
});

qAdd.addEventListener("click", () => {
  if (quickId) addToCart(quickId);
  closeQuick();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeQuick();
});

updateBadge();
renderProducts();


