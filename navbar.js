const navbarHtml = `
  <!-- navbar.html -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="index.html">ShopNow</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div
      class="collapse navbar-collapse justify-content-between"
      id="navbarNav"
    >
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" href="index.html">Головна</a>
        </li>
        <li class="nav-item">
          <a class="nav-link active" href="products.html">Товари</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="game/game.html">Гра</a>
        </li>
      </ul>
      <button
        id="open_cart"
        class="btn btn-outline-light"
        data-bs-toggle="modal"
        data-bs-target="#ModalBasket"
        style="display:none"
      >
        🛒 Кошик
      </button>
      <div class="d-flex align-items-center gap-2">
        <button
          type="button"
          class="btn btn-primary loginB"
          data-bs-toggle="modal"
          data-bs-target="#LoginModal"
        >
          Login
        </button>
        <div id="loginAs" style="display: none">
          <p class="mb-0 text-white">Logined as: <b></b></p>
          <button type="button" class="btn btn-sm btn-warning logOut">
            Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>
<!--Modal Login-->
    <div
      class="modal fade"
      id="LoginModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="LoginModalTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <div class="d-flex justify-content-center w-100">
              <h5 class="modal-title" id="LoginModalTitle">
                Login/Sign up form
              </h5>
            </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-outline mb-4">
                <label class="form-label" for="loginField">Login</label>
                <input id="loginField" class="form-control" />
              </div>
              <div class="form-outline mb-4">
                <label class="form-label" for="passwordField">Password</label>
                <input
                  type="password"
                  id="passwordField"
                  class="form-control"
                />
                <div id="message" style="display: none">
                  <h6 class="mt-2">Password must contain the following:</h6>
                  <p id="letter" class="invalid">A <b>lowercase</b> letter</p>
                  <p id="capital" class="invalid">A <b>capital letter</b></p>
                  <p id="number" class="invalid">A <b>number</b></p>
                  <p id="length" class="invalid">Minimum <b>8 characters</b></p>
                </div>
              </div>
              <div class="d-flex justify-content-center">
                <button id="loginButton" type="button" class="btn btn-primary">
                  Sign in
                </button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--top/up arrow-->
    <div id="top" style="display: none"></div>

<a href="#top" id="up">
  ⬆
</a>

<div id="chatbot" class="chatbot">
  <div class="chat-header">🤖 Чат-бот</div>
  <div class="chat-body" id="chatBody"></div>
  <div class="chat-input">
    <input type="text" id="chatInput" placeholder="Напишіть щось..." />
    <button id="sendChat">➡️</button>
  </div>
</div>
<button id="chatToggle" title="Відкрити чат">💬</button>
`;
function highlightActiveNavLink() {
  let currentPage = window.location.pathname.split("/").pop();
  if (!currentPage || currentPage === "") {
    currentPage = "index.html";
  }
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const hrefPage = href.split("/").pop();
    if (currentPage === hrefPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}
function lazyLoad() {
  const lazyImages = document.querySelectorAll("img.lazy-img");

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  lazyImages.forEach((img) => {
    if (isInViewport(img)) {
      img.src = img.dataset.src;
      img.classList.add("show");
    } else {
      window.addEventListener("scroll", function handler() {
        if (isInViewport(img)) {
          img.src = img.dataset.src;
          img.classList.add("show");
          window.removeEventListener("scroll", handler);
        }
      });
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("navbar-placeholder");
  if (placeholder) {
    //navbar
    placeholder.innerHTML = navbarHtml;
    highlightActiveNavLink();
    //login
    const loginScript = document.createElement("script");
    loginScript.src = "/ShopNow/login.js";

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = "/ShopNow/navbarstyle.css";

    document.head.appendChild(styleLink);
    document.body.appendChild(loginScript);
    loginScript.onload = () => {
      if (
        document.querySelector(".loginB") &&
        document.getElementById("loginAs") &&
        document.getElementById("loginField") &&
        document.getElementById("passwordField") &&
        document.getElementById("message")
      ) {
        checkIfLogin();
        initLoginListeners();

        const loginBtn = document.querySelector(".loginB");
        if (loginBtn) {
          loginBtn.addEventListener("click", () => {
            const modal = new bootstrap.Modal(
              document.getElementById("LoginModal")
            );
            modal.show();
          });
        }
      }
    };

    document.body.appendChild(loginScript);

    const openCartBtn = document.getElementById("open_cart");
    if (typeof openCart === "function" && openCartBtn) {
      openCartBtn.addEventListener("click", openCart);
    }
  }
  lazyLoad();
  $(document).ready(function () {
    const $up = $("#up");

    $(window).on("scroll", function () {
      if ($(this).scrollTop() > 200) {
        if (!$up.is(":visible")) {
          $up.fadeIn(300);
        }
      } else {
        if ($up.is(":visible")) {
          $up.fadeOut(300);
        }
      }
    });

    $up.on("click", function (e) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, 500);
    });
    const phrases = [
      "Цікаве питання!",
      "Я ще вчуся",
      "Спробуйте переформулювати.",
      "Можливо, варто перевірити товари на сторінці",
      "Звучить цікаво!",
      "На жаль, я поки не маю точної відповіді.",
      "Можливо, вам варто зв’язатися з нашою підтримкою.",
    ];
    function containsAny(str, keywords) {
      return keywords.some((word) => str.includes(word));
    }
    function botReply(msg) {
      const lc = msg.toLowerCase().trim();

      if (
        containsAny(lc, [
          "привіт",
          "доброго дня",
          "добрий день",
          "доброго вечора",
          "добрий вечір",
          "доброго ранку",
          "добрий ранок",
          "вітаю",
        ])
      )
        return "Вітаю! Чим можу допомогти?";

      if (containsAny(lc, ["до побачення", "бувай"]))
        return "До зустрічі! Гарного дня!";
      if (containsAny(lc, ["iphone", "айфон"]))
        return "iPhone — це преміальні смартфони від Apple. У нас завжди є актуальні моделі!";
      if (lc.includes("samsung"))
        return "Samsung пропонує широкий вибір смартфонів на Android — перегляньте наш каталог.";
      if (lc.includes("xiaomi") || lc.includes("редмі") || lc.includes("redmi"))
        return "Xiaomi та Redmi — це чудове поєднання якості та ціни! Подивіться наші пропозиції.";
      if (lc.includes("ціна") || lc.includes("скільки"))
        return "Ціни вказані біля кожного товару. Ви можете переглянути їх у каталозі.";
      if (lc.includes("доставка"))
        return "Ми доставляємо по всій Україні! Швидко та зручно.";
      if (lc.includes("інтернет"))
        return "Наш магазин працює 24/7 — ви завжди можете зробити замовлення онлайн.";
      return phrases[Math.floor(Math.random() * phrases.length)];
    }

    function appendMessage(sender, text) {
      const div = $("<div>").addClass(sender).text(text);
      $("#chatBody").append(div);
      $("#chatBody").scrollTop($("#chatBody")[0].scrollHeight);
    }

    $("#chatToggle").click(() => {
      $("#chatbot").fadeToggle();
    });

    $("#sendChat").click(() => {
      const msg = $("#chatInput").val().trim();
      if (!msg) return;
      appendMessage("user", msg);
      const reply = botReply(msg);
      setTimeout(() => appendMessage("bot", reply), 400);
      $("#chatInput").val("");
    });

    $("#chatInput").keypress((e) => {
      if (e.key === "Enter") $("#sendChat").click();
    });
  });
});