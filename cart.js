document.addEventListener("DOMContentLoaded", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("cart-total");
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>장바구니가 비어 있습니다.</p>";
    return;
  }

  // 재고 전체 불러오기
  fetch("https://script.google.com/macros/s/AKfycby9M8xfIOgREdW2O5OEqbY5bpL85-hbiKXlYngmc9ggR-IscwFnvBR_MQ6ySM93c4aT/exec")
    .then(res => res.json())
    .then(stockData => {
      cart.forEach((item, index) => {
        const stockInfo = stockData.find(p => p.name === item.name);
        const stock = stockInfo ? Number(stockInfo.stock) : 0;

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
        qty.textContent = item.quantity || 1;

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
          if ((item.quantity || 1) < stock) {
            cart[index].quantity = (cart[index].quantity || 1) + 1;
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

        if (item.quantity > stock) {
          const warning = document.createElement("p");
          warning.textContent = `※ 재고 초과: 현재 재고 ${stock}개`;
          warning.style.color = "red";
          details.appendChild(warning);
        }

        itemEl.append(img, details);
        container.appendChild(itemEl);

        total += item.price * Math.min(item.quantity || 1, stock);
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