function setCookie(cname, cvalue, exdays = 1) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

function checkIfLogin() {
  const login = getCookie("login");
  const loginBtn = document.querySelector(".loginB");
  const loginAs = document.getElementById("loginAs");
  const loginName = loginAs?.querySelector("b");

  if (!loginBtn || !loginAs || !loginName) return;

  if (login) {
    loginBtn.style.display = "none";
    loginAs.style.display = "flex";
    loginName.innerText = login;
  } else {
    loginBtn.style.display = "inline-block";
    loginAs.style.display = "none";
  }
}

function validate() {
  const loginField = document.getElementById("loginField");
  const passwordField = document.getElementById("passwordField");

  const login = loginField.value.trim();
  const password = passwordField.value.trim();

  const reg = /\W/g;
  if (login.length === 0 || login.includes(" ") || login.match(reg)) return;

  const valid = document.querySelectorAll("#message .valid").length;
  if (valid < 4) return;

  setCookie("login", login);
  setCookie("password", password);
  bootstrap.Modal.getInstance(document.getElementById("LoginModal"))?.hide();
  document.body.classList.remove("modal-open");
  document.querySelector(".modal-backdrop")?.remove();
  checkIfLogin();
}

function logOut() {
  setCookie("login", "", -1);
  setCookie("password", "", -1);
  checkIfLogin();
}

function initLoginListeners() {
  const loginField = document.getElementById("loginField");
  const passwordField = document.getElementById("passwordField");
  const loginButton = document.querySelector("#loginButton");
  const logoutButton = document.querySelector(".logOut");

  const letter = document.getElementById("letter");
  const capital = document.getElementById("capital");
  const number = document.getElementById("number");
  const length = document.getElementById("length");

  if (loginButton) loginButton.addEventListener("click", validate);
  if (logoutButton) logoutButton.addEventListener("click", logOut);

  if (!passwordField) return;

  passwordField.addEventListener("focus", () => {
    document.getElementById("message")?.style.setProperty("display","block");
  });

  passwordField.addEventListener("blur", () => {
    document.getElementById("message")?.style.setProperty("display","none");
  });

  passwordField.addEventListener("keyup", () => {
    const val = passwordField.value;

    letter?.classList.toggle("valid", /[a-z]/.test(val));
    letter?.classList.toggle("invalid", !/[a-z]/.test(val));
    capital?.classList.toggle("valid", /[A-Z]/.test(val));
    capital?.classList.toggle("invalid", !/[A-Z]/.test(val));
    number?.classList.toggle("valid", /\d/.test(val));
    number?.classList.toggle("invalid", !/\d/.test(val));
    length?.classList.toggle("valid", val.length >= 8);
    length?.classList.toggle("invalid", val.length < 8);
  });
}

initLoginListeners(); 