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

  // 버튼 정보 세팅
  const btn = document.getElementById("addToCartBtn");
  btn.dataset.name = name;
  btn.dataset.price = price;
  btn.dataset.image = image;

  // ✅ 재고 확인 호출만 간단히 (이부분 해당 상품 구글시트내의 상품명과 정확히 일치해야함 name을 지우고 넣기)
  checkStock("Dancing Bossa Nova 1");

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