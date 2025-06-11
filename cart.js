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

    fetch(`https://script.google.com/macros/s/AKfycbx7I9vegp-PLKNXbFI0ZTQNPixArUtrObdh36-2MkpKzB3w0HKPZ8OTQEyYdMh47IS5/exec?name=${encodeURIComponent(item.name)}&qty=${qty}`)
    .then(res => res.text())
    .then(response => {
      console.log("Sheet update response:", response);
    });


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
      style: {
        layout: 'vertical',
        color: 'blue', // ✅ 여기 바뀐 부분!
        shape: 'rect',
        label: 'pay',
        height: 40
      },
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

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    cart.push({ name, price, image, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  const toast = document.getElementById("toast");
  if (toast) {
    toast.style.display = "block";
    setTimeout(() => toast.style.display = "none", 2000);
  }
}