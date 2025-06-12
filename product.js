// 페이지 로드 시 템플릿 불러오기
document.addEventListener('DOMContentLoaded', () => {
  fetch('/product-template.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('product-container').innerHTML = html;

      // header.js 직접 로드
      const script = document.createElement("script");
      script.src = "/header.js";
      document.body.appendChild(script);

      if (typeof setProductContent === 'function') {
        setProductContent();
      }
    });
});

// 토스트 알림 함수
function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// 장바구니 담기 함수
function buttoncart(name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // 토스트 표시
  showToast();
}

// 재고 확인 함수 + 버튼 표시 + 클릭 이벤트 연결
function checkStock(productName) {
  fetch(`https://script.google.com/macros/s/AKfycbzb8ukfcIHa4BTYnbeSzzgaWFsWn492l1jcxxsnVGnc_jJpuIA1eJygotLZRTIP64i-/exec?name=${encodeURIComponent(productName)}`)
    .then(res => res.json())
    .then(data => {
      const stock = Number(data.stock);
      const btn = document.getElementById("addToCartBtn");
      const soldOutText = document.getElementById("sold-out-text");

      if (!btn || !soldOutText) return;

      btn.dataset.stock = stock;

      if (stock <= 0) {
        btn.style.display = "none";
        soldOutText.style.display = "block";
        btn.onclick = null;
      } else {
        btn.style.display = "block";
        soldOutText.style.display = "none";

        btn.onclick = () => {
          const name = btn.dataset.name;
          const price = parseFloat(btn.dataset.price);
          const image = btn.dataset.image;

          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const existingItem = cart.find(item => item.name === name);
          const currentQty = existingItem ? existingItem.quantity : 0;

          if (currentQty >= stock) {
            alert("재고를 초과하여 담을 수 없습니다.");
            return;
          }

          buttoncart(name, price, image);
        };
      }
    })
    .catch(error => {
      console.error("재고 확인 실패:", error);
    });
}