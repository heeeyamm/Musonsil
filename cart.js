document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");

  let total = 0;

  cart.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.className = "cart-thumb";

    const details = document.createElement("div");
    details.className = "cart-details";

    const name = document.createElement("div");
    name.className = "cart-name";
    name.textContent = item.name;

    const price = document.createElement("div");
    price.textContent = `$${item.price}`;

    const qtyBox = document.createElement("div");
    qtyBox.className = "cart-qty";

    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.className = "qty-btn";
    minus.onclick = () => {
      if (cart[index].quantity > 1) {
        cart[index].quantity--;
        localStorage.setItem("cart", JSON.stringify(cart));
        location.reload();
      }
    };

    const qty = document.createElement("span");
    qty.textContent = item.quantity || 1;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.className = "qty-btn";
    plus.onclick = () => {
      cart[index].quantity = (cart[index].quantity || 1) + 1;
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    };

    const remove = document.createElement("button");
    remove.textContent = "delete";
    remove.className = "delete-btn";
    remove.onclick = () => {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    };

    qtyBox.append(minus, qty, plus);
    details.append(name, price, qtyBox, remove);
    itemEl.append(img, details);
    container.appendChild(itemEl);

    total += item.price * (item.quantity || 1);
  });

  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;

  if (cart.length > 0) {
    paypal.Buttons({
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: total.toFixed(2)
            },
            description: "Order from Musonsil Studio"
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          alert(`${details.payer.name.given_name}, thank you for your order!`);
          localStorage.removeItem("cart");
          location.href = "/";
        });
      }
    }).render('#paypal-button-container');
  }
});

function buttoncart(name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 기존 항목 중 name이 같은 게 있는지 찾기
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    // 이미 장바구니에 있는 상품이면 수량만 증가
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    // 새로운 상품이면 새로 추가
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // 토스트 알림
  const toast = document.getElementById("toast");
  if (toast) {
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 2000);
  }
}