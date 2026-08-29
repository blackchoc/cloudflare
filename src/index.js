const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "123123";

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function jsonResponse(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function safeEqual(value, expected) {
  if (typeof value !== "string") return false;

  const maxLength = Math.max(value.length, expected.length);
  let difference = value.length ^ expected.length;

  for (let index = 0; index < maxLength; index += 1) {
    difference |= (value.charCodeAt(index) || 0) ^ (expected.charCodeAt(index) || 0);
  }

  return difference === 0;
}

export async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (url.pathname === "/api/login") {
    if (request.method !== "POST") {
      return jsonResponse(
        { success: false, message: "Method not allowed" },
        405,
        { Allow: "POST" },
      );
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return jsonResponse(
        { success: false, message: "请求格式不正确" },
        415,
      );
    }

    let credentials;
    try {
      credentials = await request.json();
    } catch {
      return jsonResponse(
        { success: false, message: "请求内容不是有效的 JSON" },
        400,
      );
    }

    const usernameMatches = safeEqual(credentials?.username, DEMO_USERNAME);
    const passwordMatches = safeEqual(credentials?.password, DEMO_PASSWORD);

    if (!usernameMatches || !passwordMatches) {
      return jsonResponse(
        { success: false, message: "用户名或密码错误" },
        401,
      );
    }

    return jsonResponse({
      success: true,
      message: "登录成功",
      redirectTo: "/welcome/",
    });
  }

  if (url.pathname.startsWith("/api/")) {
    return jsonResponse({ success: false, message: "接口不存在" }, 404);
  }

  return env.ASSETS.fetch(request);
}

export default {
  fetch: handleRequest,
};
