// 🛒 상품을 장바구니에 추가하는 함수
function buttoncart(productName, price) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name: productName, price: price });
  localStorage.setItem('cart', JSON.stringify(cart));

  // 장바구니 담김 알림 UI 보여주기
  const notice = document.getElementById('cart-notice');
  if (notice) {
    notice.style.display = 'block';
  }

  // 장바구니 수량 업데이트 함수가 있으면 호출
  if (typeof updateCartCount === 'function') {
    updateCartCount();
  }
}

// 🧮 장바구니 수량 표시용 함수 (선택 기능)
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const countElem = document.getElementById('cart-count');
  if (countElem) {
    countElem.textContent = cart.length;
  }
}