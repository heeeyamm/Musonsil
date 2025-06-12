document.addEventListener('DOMContentLoaded', () => {
  fetch('/product-template.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('product-container').innerHTML = html;

      // header.js 직접 로드
      const script = document.createElement("script");
      script.src = "/header.js"; // ❗ 여기 오타 있었음! (- 를 =로 수정)
      document.body.appendChild(script);

      if (typeof setProductContent === 'function') {
        setProductContent();
      }

      // 장바구니 버튼은 setProductContent 호출 이후에 재고 상태 보고 연결돼야 해!
      // 여긴 제거해도 OK (아니면 checkStock 함수에서 조건부로 다시 설정하는 방식 권장)
    });
});

function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// ✅ 재고 체크 + 버튼 표시/숨김 + 클릭 이벤트 통합 처리
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
        btn.onclick = null; // ✅ 클릭도 막아버림
      } else {
        btn.style.display = "block";
        soldOutText.style.display = "none";

        // ✅ 재고 있을 때만 클릭 이벤트 연결!
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

function buttoncart(name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ name, price, image, quantity: 1 }); // ✅ quantity 꼭 포함!
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // ✅ Toast 표시
  const toast = document.getElementById("toast");
  if (toast) {
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 2000);
  }
}
        };
      }
    })

}

