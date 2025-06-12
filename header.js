function insertHeaderWhenReady() {
  const container = document.getElementById("header-container");

  if (!container) {
    // DOM에 아직 안 생겼으면 50ms 후 재시도
    return setTimeout(insertHeaderWhenReady, 50);
  }

  // 헤더 HTML 불러오기
  fetch('/header.html')
    .then(res => res.text())
    .then(data => {
      container.innerHTML = data;

      // ✅ 장바구니 숫자 세팅
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const countElem = document.getElementById("cart-count");

      if (countElem) {
        countElem.textContent = totalCount > 0 ? `(${totalCount})` : "";
      }
    });
}

// 페이지 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", insertHeaderWhenReady);