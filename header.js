document.addEventListener("DOMContentLoaded", function () {
  const headerHTML = `
    <div class="logo">
      <a href="index.html"><img src="logo.png" alt="Musonsil Logo" style="width: 300px;"></a>
    </div>

    <div class="nav">
      <a href="index.html" class="nav-link">Shop</a>
      <a href="/archive.html" class="nav-link">Archive</a>
      <a href="/about.html" class="nav-link">About</a>
      <a href="/cart.html" class="nav-link">🛒 Cart (<span id="cart-count">0</span>)</a>
    </div>
  `;
  document.getElementById("common-header").innerHTML = headerHTML;
});

fetch('/header.html')
 .then(res => res.text())
 .then(date => {
    document.getElementById('header-container').innerHTML = DataTransfer;
 })