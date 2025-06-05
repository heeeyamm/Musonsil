document.addEventListener('DOMContentLoaded', function () {
  fetch('/product-template.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('product-container').innerHTML = html;

      if (typeof setProductContent === 'function') {
        setProductContent();
      }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("addToCartBtn");
  if (btn) {
    btn.onclick = () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const image = btn.dataset.image;

      buttoncart(name, price, image);
      showToast();
    };
  }
});

function showToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
