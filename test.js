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

  // 제목, 이미지, 가격
  document.getElementById("product-title").textContent = name;
  document.getElementById("product-price").textContent = `USD ${price}`;
  document.getElementById("mainImage").src = image;

  // 설명 삽입
  const descContainer = document.getElementById("product-description");
  descriptions.forEach(text => {
    const p = document.createElement("p");
    p.className = "desc";
    p.textContent = text;
    descContainer.appendChild(p);
  });

  // 썸네일 삽입
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

  // ✅ 재고 확인
  const btn = document.getElementById("addToCartBtn"); // 🔥 여기가 fetch보다 먼저 와야 함

  // ✅ 버튼 정보 세팅 (무조건 먼저)
  btn.dataset.name = name;
  btn.dataset.price = price;
  btn.dataset.image = image;

  // ✅ 재고 확인 후 버튼 보이기/숨기기
  fetch(`https://script.google.com/macros/s/AKfycbzGCLc2AATyGkcuEp_iVZVDxdyOaNG2gBt87JDNo6-jpC0mJq96f6IElKiaoelFR_6n/exec?name=${encodeURIComponent(name)}`)
    .then(res => res.json())
    .then(data => {
      if (data.stock <= 0) {
        btn.style.display = "none";
        document.getElementById("sold-out-text").style.display = "block";
      } else {
        btn.style.display = "block";
        document.getElementById("sold-out-text").style.display = "none";
      }
    });

  // ✅ PayPal 버튼
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