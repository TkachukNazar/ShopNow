let cartCont;
let modalBodyBasket = "";

function setCartData(o) {
  localStorage.setItem("cart", JSON.stringify(o));
}

function getCartData() {
  return JSON.parse(localStorage.getItem("cart"));
}

function setModalWindow(str) {
  modalBodyBasket += str;
  document.querySelector("#modalBodyBasket").innerHTML = modalBodyBasket;
}
function addToCart(e) {
  let button = e.target;
  let cartData = getCartData() || {};
  let itemId = button.getAttribute("data-id");
  let parentBox = button.parentNode;
  let itemTitle = parentBox.querySelector(".item-title").innerHTML;
  let itemPrice = parentBox
    .querySelector(".item-price")
    .innerHTML.split("<span>")[0];
  let itemImg = parentBox.parentNode.querySelector("img").src;

  if (cartData.hasOwnProperty(itemId)) {
    cartData[itemId][3] += 1;
  } else {
    cartData[itemId] = [itemImg, itemTitle, itemPrice, 1];
  }
  setCartData(cartData);
  button.innerHTML = "✅ Додано";
  setTimeout(() => {
    button.innerHTML = "До кошика";
  }, 700);
}
function loadGoods() {
  $.ajax({
    url: "products.json",
    type: "GET",
    dataType: "json",
    success: function (data) {
      for (let item in data) {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4 fade-in";
        col.innerHTML = `
              <div class="card product-card h-100">
                <img src="${data[item].img}" class="card-img-top" alt="${data[item].title}">
                <div class="card-body">
                  <h5 class="item-title">${data[item].title}</h5>
                  <p class="item-text">${data[item].desc}</p>
                  <p class="fw-bold item-price">${data[item].price}<span> грн</span></p>
                  <button data-id="${item}" class="btn btn-outline-primary add-to-cart w-100">До кошика</button>
                </div>
              </div>`;
        document.querySelector("#row1").appendChild(col);
        requestAnimationFrame(() => col.classList.add("show"));
      }
      document
        .querySelectorAll(".add-to-cart")
        .forEach((btn) => btn.addEventListener("click", addToCart));
    },
  });
}

function openCart() {
  cartCont = document.getElementById("cart_content");
  if (cartCont) cartCont.remove();
  modalBodyBasket = "";
  let cartData = getCartData();
  if (!cartData) {
    modalBodyBasket = "<p>Кошик порожній.</p>";
    document.querySelector("#modalBodyBasket").innerHTML = modalBodyBasket;
    return;
  }

  let sumAll = 0;
  let table =
    "<table class='table table-striped'><thead><tr><th>Фото</th><th>Назва</th><th>Ціна</th><th>К-сть</th><th>Разом</th><th>+/-</th></tr></thead><tbody>";
  for (let item in cartData) {
    let [img, title, price, qty] = cartData[item];
    let cost = parseInt(price) * qty;
    sumAll += cost;
    table += `<tr>
  <td><img src="${img}" class="miniature rounded" /></td>
  <td>${title}</td>
  <td>${price}</td>
  <td>${qty}</td>
  <td>${cost}</td>
  <td>
    <button
      class="btn btn-sm btn-success"
      onclick="addItem(this)"
      data-id="${item}"
    >
      +
    </button>
    <button
      class="btn btn-sm btn-danger"
      onclick="removeItem(this)"
      data-id="${item}"
    >
      -
    </button>
  </td>
</tr>
`;
  }
  table += "</tbody></table>";
  modalBodyBasket =
    table +
    `<p class="text-end fw-bold">Загалом: ${sumAll} грн</p>
    <button class="btn btn-danger" onclick="clearCart()">Очистити</button>
    <button class="btn btn-success ms-2" data-bs-toggle="modal" data-bs-target="#ModalCheckout">Оформити</button>`;
  document.querySelector("#modalBodyBasket").innerHTML = modalBodyBasket;
}

function clearCart() {
  localStorage.removeItem("cart");
  openCart();
}

function removeItem(btn) {
  let cartData = getCartData();
  let item = btn.getAttribute("data-id");
  if (cartData[item][3] > 1) cartData[item][3]--;
  else delete cartData[item];
  setCartData(cartData);
  openCart();
}

function addItem(btn) {
  let cartData = getCartData();
  let item = btn.getAttribute("data-id");
  cartData[item][3]++;
  setCartData(cartData);
  openCart();
}

function checkout() {
  let modalCheckoutBody = `<form id="checkoutForm" class="form-container mt-4 needs-validation" novalidate>
  <h4 class="mb-3">Checkout</h4>

  <div class="mb-3">
    <label for="fullName" class="form-label">Full Name</label>
    <input
      type="text"
      class="form-control bg-dark text-light"
      id="fullName"
      name="fullName"
      pattern="^[A-Za-z\s]{2,}$"
      required
    />
    <div class="invalid-feedback">
      Enter a valid name (letters only, at least 2 characters).
    </div>
  </div>

  <div class="mb-3">
    <label for="email" class="form-label">Email address</label>
    <input
      type="email"
      class="form-control bg-dark text-light"
      id="email"
      name="email"
      pattern="^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$"
      required
    />
    <div class="invalid-feedback">Please enter a valid email.</div>
  </div>

  <div class="mb-3">
    <label for="address" class="form-label">Shipping Address</label>
    <input
      type="text"
      class="form-control bg-dark text-light"
      id="address"
      name="address"
      pattern=".{5,}"
      required
    />
    <div class="invalid-feedback">
      Address must be at least 5 characters long.
    </div>
  </div>

  <div class="mb-3">
    <label for="cardNumber" class="form-label">Card Number</label>
    <input
      type="text"
      class="form-control bg-dark text-light"
      id="cardNumber"
      name="cardNumber"
      pattern="^(\\d{4}\\s){3}\\d{4}$"
      maxlength="19"
      inputmode="numeric"
      required
    />
    <div class="invalid-feedback">
      Enter a valid 16-digit card number (e.g. 1234 5678 9012 3456).
    </div>
  </div>

  <button type="submit" class="btn btn-success w-100">Place Order</button>
</form>
`;

  const modalElement = document.getElementById("ModalCheckout");
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
  modalElement.querySelector("#modalBodyCheckout").innerHTML =
    modalCheckoutBody;

  //////////////////////////
  modalElement.addEventListener("shown.bs.modal", () => {
    const cardInput = document.getElementById("cardNumber");
    const form = document.getElementById("checkoutForm");

    cardInput.addEventListener("input", () => {
      let value = cardInput.value.replace(/\D/g, "").substring(0, 16);
      cardInput.value = value.replace(/(.{4})/g, "$1 ").trim();
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      let isValid = form.checkValidity();

      const rawCard = cardInput.value.replace(/\s+/g, "");
      if (!/^\d{16}$/.test(rawCard)) {
        cardInput.classList.add("is-invalid");
        isValid = false;
      } else {
        cardInput.classList.remove("is-invalid");
      }

      if (isValid) {
        localStorage.removeItem("cart");
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
        document.body.classList.remove("modal-open");
        document.querySelector(".modal-backdrop")?.remove();

        document.querySelector("#goodsContainer")?.remove();
        const thankYou = document.createElement("div");
        thankYou.id = "thankYouMessage";
        thankYou.className =
          "d-flex justify-content-center flex-column mt-4 fs-2";
        thankYou.innerHTML = "Дякуємо за покупку!";
        document.body.appendChild(thankYou);

        requestAnimationFrame(() => thankYou.classList.add("visible"));
        thankYou.innerHTML += `
                    <a class="btn btn-outline-dark" role="button" href="./products.html" >
                    Продовжити покупки
                    </a>
                  `;
        requestAnimationFrame(() =>
          document.querySelector("#thankYouMessage a").classList.add("visible")
        );
        document.body.appendChild(thankYou);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      form.classList.add("was-validated");
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadGoods();
  checkout();
  document.getElementById("open_cart").style.display = "block";
});