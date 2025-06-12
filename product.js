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
