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


function showToast() {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
}
