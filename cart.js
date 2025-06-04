// 장바구니에 상품 추가
function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name, price });
  localStorage.setItem('cart', JSON.stringify(cart));

  const notice = document.getElementById('cart-notice');
  if (notice) notice.style.display = 'block';

  if (typeof updateCartCount === 'function') updateCartCount();
}

// 장바구니 아이템 수 업데이트 (선택)
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const countElem = document.getElementById('cart-count');
  if (countElem) countElem.textContent = cart.length;
}