function setProductContent() {
  const name = "Dancing Bossa Nova 1";
  const price = 75;
  const image = "bossabowl.png";
  const thumbnails = ["bossabowl.png", "bossagreensub1.jpg", "bossagreensub2.jpg"];
  const descriptions = [
    "Stoneware",
    "Hand-built and painted",
    "approx 7x8x10 (cm)",
    "holds 10oz",
    "lead-free glaze, food safe, microwave safe and dishwasher safe (hand-wash recommended)"
  ];

  // DOM 주입
  document.getElementById("product-title").textContent = name;
  document.getElementById("product-price").textContent = `USD ${price}`;
  document.getElementById("mainImage").src = image;

  const descContainer = document.getElementById("product-description");
  descriptions.forEach(text => {
    const p = document.createElement("p");
    p.className = "desc";
    p.textContent = text;
    descContainer.appendChild(p);
  });

  const thumbRow = document.getElementById("thumbnailRow");
  thumbnails.forEach(src => {
    const img = document.createElement("img");
    img.className = "thumb";
    img.src = src;
    img.onclick = () => {
      document.getElementById("mainImage").src = src;
    };
    thumbRow.appendChild(img);
  });

  // ✅ 재고 확인 & 버튼 동작 설정
  fetch(`https://script.google.com/macros/s/AKfycbzGCLc2AATyGkcuEp_iVZVDxdyOaNG2gBt87JDNo6-jpC0mJq96f6IElKiaoelFR_6n/exec`)
    .then(res => res.json())
    .then(data => {
      const btn = document.getElementById("addToCartBtn");
      if (data.stock <= 0) {
        btn.style.display = "none";
        document.getElementById("sold-out-text").style.display = "block";
      } else {
        btn.dataset.name = name;
        btn.dataset.price = price;
        btn.dataset.image = image;
        btn.style.display = "block";
        document.getElementById("sold-out-text").style.display = "none";
      }
    });

  // ✅ 페이팔 버튼 생성
  paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'blue',
      shape: 'rect',
      label: 'pay',
      height: 40,
      tagline: false
    },
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          amount: { value: price.toFixed(2) },
          description: name
        }]
      });
    },
    onApprove: (data, actions) => {
      return actions.order.capture().then(details => {
        alert(`${details.payer.name.given_name}, thank you for your order!`);
      });
    }
  }).render("#paypal-button-container");
}