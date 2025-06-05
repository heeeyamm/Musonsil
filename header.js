fetch('/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;

    // 💥 header 삽입된 후에 실행해야 cart-count가 존재함
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const countElem = document.getElementById("cart-count");
    if (countElem) {
      countElem.textContent = `(${cartCount})`;
    }
  });