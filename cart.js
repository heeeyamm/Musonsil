document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");

  if (!container || !totalDisplay) return;

  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach((item, index) => {
    const quantity = item.quantity || 1;

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

    const qty = document.createElement("span");
    qty.textContent = quantity;

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

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.className = "qty-btn";
    plus.onclick = () => {
      cart[index].quantity = quantity + 1;
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

    total += item.price * quantity;
  });

  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;

  if (total > 0) {
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'rect',
        label: 'pay',
        height: 40
      },
      createOrder: function(data, actions) {
        return actions.order.create({
          purchase_units: [{
            amount: { value: total.toFixed(2) },
            description: "Order from Musonsil Studio"
          }]
        });
      },
      onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
          console.log("paypal 결제 승인됨");
          alert(`${details.payer.name.given_name}, thank you for your order!`);

          const scriptURL = "https://script.google.com/macros/s/AKfycbxpBiy_DoqY1THQmBGzJMxaSKvrjfJgZUMh8VuumCwrtWcqJcpCu2ITSdAm15SIgRAV/exec";
                             
          cart.forEach(item => {
            fetch(scriptURL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                name: item.name,
                quantity: item.quantity || 1
              })
            })
            .then(res => res.json())
            .then(data => {
              console.log("재고 차감 결과:", data);
            })
            .catch(err => {
              console.error("재고 차감 실패:", err);
            });
          });

          localStorage.removeItem("cart");
          location.href = "/";
        });
      }
    }).render('#paypal-button-container');
  }

  // 🔧 [디버그용] 결제 없이 fetch 재고 차감 테스트용 버튼
  // 나중에 개발 완료 후 이 블록 전체 삭제해도 됩니다 👇👇
const debugButton = document.getElementById("debug-button");
const scriptURL = "https://script.google.com/macros/s/AKfycbyVxKBy8T_ZNM5TNHaqOz9GSgkXb-RyAZKHBu4MD0FsCyCpozyj6Q-kn8ZKUgfVnb06/exec";

if (debugButton) {
  debugButton.addEventListener("click", () => {
    if (cart.length === 0) {
      console.log("🛒 장바구니가 비었습니다.");
      return;
    }

    cart.forEach(item => {
      console.log("🔁 디버그 테스트 중:", item);

      fetch(scriptURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: item.name,
          quantity: item.quantity || 1
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log("✅ 디버그 재고 차감 결과:", data);
      })
      .catch(err => {
        console.error("❌ 디버그 재고 차감 실패:", err);
      });
    });
  });
}

  // 🔧 [디버그용 끝]
});