const form = document.querySelector("#login-form");
const message = document.querySelector("#form-message");
const submitButton = document.querySelector("#submit-button");

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitButton.classList.toggle("is-loading", isLoading);
  submitButton.setAttribute("aria-busy", String(isLoading));
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  message.className = "form-message";

  const formData = new FormData(form);
  const username = formData.get("username")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!username || !password) {
    message.textContent = "请输入用户名和密码";
    message.classList.add("is-error");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "登录失败，请重试");
    }

    message.textContent = "登录成功，正在跳转…";
    message.classList.add("is-success");
    window.location.assign(result.redirectTo || "/welcome/");
  } catch (error) {
    message.textContent = error.message || "网络异常，请稍后重试";
    message.classList.add("is-error");
    setLoading(false);
  }
});
