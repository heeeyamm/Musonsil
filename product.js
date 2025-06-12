document.addEventListener('DOMContentLoaded', () => {
  fetch('/product-template.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('product-container').innerHTML = html;


      //header.js 직접 로드
      const script = document.createElement("script");
      script.src - "/header.js";
      document.body.appendChild(script);

      if (typeof setProductContent === 'function') {
        setProductContent();
      }

      // 버튼에 이벤트 연결은 여기 안에서 처리!
      const btn = document.getElementById("addToCartBtn");
      if (btn) {
        btn.onclick = () => {
          const name = btn.dataset.name;
          const price = parseFloat(btn.dataset.price);
          const image = btn.dataset.image;

          console.log("담기 전 확인", name, price, image);

          buttoncart(name, price, image); //이 함수가 카트에 넣음
          showToast();
        };
      }
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

// 기존 코드 그대로 두고 아래 함수만 맨 아래에 추가! (재고 품절시 품절뜨게)

function checkStock(productName) {
  fetch("https://script.google.com/macros/s/AKfycby9M8xfIOgREdW2O5OEqbY5bpL85-hbiKXlYngmc9ggR-IscwFnvBR_MQ6ySM93c4aT/exec?name=Dancing%20Bossa%20Nova%201")
    .then(res => res.json())
    .then(data => {
      const stock = Number(data.stock);
      const btn = document.getElementById("addToCartBtn");
      const soldOutText = document.getElementById("sold-out-text");

      if (!btn || !soldOutText) return;

      if (stock <= 0) {
        btn.style.display = "none";
        soldOutText.style.display = "block";
      } else {
        btn.style.display = "block";
        soldOutText.style.display = "none";
      }
    })
    .catch(error => {
      console.error("재고 확인 실패:", error);
    });
}