// HTML이 다 로드된 뒤에 실행되도록 설정
document.addEventListener("DOMContentLoaded", function () {
  
  // 🛒 장바구니에 상품 추가하는 함수
  window.buttoncart = function(productName, price) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: productName, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));

    // 메시지 UI 보여주기
    const notice = document.getElementById('cart-notice');
    if (notice) {
      notice.style.display = 'block';
    }

    // 선택사항: 장바구니 수량 업데이트
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    }
  }

  // 🧮 장바구니 수량 표시 (선택)
  window.updateCartCount = function () {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countElem = document.getElementById('cart-count');
    if (countElem) {
      countElem.textContent = cart.length;
    }
  }
});