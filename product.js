// ✅ 1. 장바구니에 담기
function buttoncart(name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
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

// ✅ 3. 재고 확인 및 버튼 처리
function checkStock(productName) {
  fetch(`https://script.google.com/macros/s/AKfycbxpBiy_DoqY1THQmBGzJMxaSKvrjfJgZUMh8VuumCwrtWcqJcpCu2ITSdAm15SIgRAV/exec?name=${encodeURIComponent(productName)}`)
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
    .catch(err => {
      console.error("재고 확인 오류:", err);
    });
}

// ✅ 4. 템플릿 로드 후 상품 설정 + 재고 확인
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
    });
});

// ✅ 5. 상품 개별 정보 설정 (페이지별로 수정하는 부분!)
function setProductContent() {
  document.getElementById("mainImage").src = "bossabowl.png";
  document.getElementById("product-title").textContent = "Dancing Bossa Nova 1";
  document.getElementById("product-price").textContent = "$38";

  const descriptionLines = [
    "리듬이 흔들리는 듯한 자유로운 곡선",
    "브라질 음악의 즉흥성과 서정성을 담은 형태",
    "소량만 제작된 1점"
  ];
  const descContainer = document.getElementById("product-description");
  descContainer.innerHTML = descriptionLines.map(line => `<p>${line}</p>`).join("");

  const btn = document.getElementById("addToCartBtn");
  if (btn) {
    btn.dataset.name = "Dancing Bossa Nova 1";
    btn.dataset.price = "38";
    btn.dataset.image = "bossabowl.png";
  }

  // ✅ 재고 확인 호출!
  checkStock("Dancing Bossa Nova 1");
}