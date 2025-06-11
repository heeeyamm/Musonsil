fetch('/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;

    // ⚡ header가 삽입된 후 실행!
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const countElem = document.getElementById("cart-count");

    if (countElem) {
      countElem.textContent = totalCount > 0 ? `(${totalCount})` : "";
    }
  });