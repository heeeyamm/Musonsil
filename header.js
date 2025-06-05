fetch('/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;
  });

  document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  document.getElementById("cart-count").textContent = cartCount;
});

document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const countElem = document.getElementById("cart-count");

  if (countElem) {
    countElem.textContent = `(${cartCount})`;
  }
});