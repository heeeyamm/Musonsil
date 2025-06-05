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