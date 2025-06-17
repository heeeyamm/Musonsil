// ✅ 1. 장바구니에 담기
function buttoncart(name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast();
}

// ✅ 2. 토스트 표시 함수
function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

// ✅ 3. 재고 확인만 (이제 버튼 이벤트는 여기서 설정 ❌)
// ✅ POST 방식 재고 확인 함수
function checkStock(productName) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbyVxKBy8T_ZNM5TNHaqOz9GSgkXb-RyAZKHBu4MD0FsCyCpozyj6Q-kn8ZKUgfVnb06/exec";

  fetch(scriptURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name: productName })
  })
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
      } else {
        btn.style.display = "block";
        soldOutText.style.display = "none";
      }
    })
    .catch(err => {
      console.error("❌ 재고 확인 실패:", err);
    });
}

// ✅ 4. 템플릿 로드 후 상품 설정 + 버튼 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
  fetch("/product-template.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("product-container").innerHTML = html;

      const script = document.createElement("script");
      script.src = "/header.js";
      document.body.appendChild(script);

      if (typeof setProductContent === "function") {
        setProductContent(); // 상품 세팅 후
      }

      // ✅ 버튼 이벤트는 항상 바로 등록!
      const btn = document.getElementById("addToCartBtn");
      if (btn) {
        btn.addEventListener("click", () => {
          const name = btn.dataset.name;
          const price = parseFloat(btn.dataset.price);
          const image = btn.dataset.image;
          const stockValue = btn.dataset.stock;

          if (!stockValue) {
            alert("Checking stock stuatus... Just a moment!");
            return;
          }

          const stock = parseInt(stockValue);
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          const existingItem = cart.find(item => item.name === name);
          const currentQty = existingItem ? existingItem.quantity : 0;

          if (currentQty >= stock) {
            alert("Not enough stock available.");
            return;
          }

          buttoncart(name, price, image);
        });
      }
    });
});