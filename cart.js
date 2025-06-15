document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>장바구니가 비어 있습니다.</p>";
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbxpBiy_DoqY1THQmBGzJMxaSKvrjfJgZUMh8VuumCwrtWcqJcpCu2ITSdAm15SIgRAV/exec")
    .then(res => res.json())
    .then(stockData => {
        if (!Array.isArray(stockData)) {
            console.error("stockData is not array:", stockData);
            return;
        }
      cart.forEach((item, index) => {
        const stockInfo = stockData.find(p => p.name === item.name);
        const stock = stockInfo ? Number(stockInfo.stock) : 0;
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
          if (quantity < stock) {
            cart[index].quantity = quantity + 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload();
          } else {
            alert("재고를 초과하여 담을 수 없습니다.");
          }
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

        if (quantity > stock) {
          const warning = document.createElement("p");
          warning.textContent = `※ 재고 초과: 현재 재고 ${stock}개`;
          warning.style.color = "red";
          details.appendChild(warning);
        }

        itemEl.append(img, details);
        container.appendChild(itemEl);

        total += item.price * Math.min(quantity, stock);
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
              alert(`${details.payer.name.given_name}, thank you for your order!`);
              localStorage.removeItem("cart");
              location.href = "/";
            });
          }
        }).render('#paypal-button-container');
      }
    });
});