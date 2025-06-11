fetch('/header.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;

    // 💥 header 삽입된 후에 실행해야 cart-count가 존재함
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // ✅ 전체 수량 합계로 계산
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const countElem = document.getElementById("cart-count");
    if (countElem) {
      countElem.textContent = `(${totalCount})`;  // 👉 (6) 같은 형식으로 출력됨
    }
  });