import assert from "node:assert/strict";
import test from "node:test";

import { handleRequest } from "../src/index.js";

const env = {
  ASSETS: {
    fetch: () => new Response("asset response"),
  },
};

function login(body, headers = { "Content-Type": "application/json" }) {
  return handleRequest(
    new Request("https://example.com/api/login", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }),
    env,
  );
}

test("valid credentials return the welcome redirect", async () => {
  const response = await login({ username: "admin", password: "123123" });
  const result = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(result, {
    success: true,
    message: "登录成功",
    redirectTo: "/welcome/",
  });
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("invalid credentials are rejected", async () => {
  const response = await login({ username: "admin", password: "wrong" });
  const result = await response.json();

  assert.equal(response.status, 401);
  assert.equal(result.success, false);
  assert.equal(result.message, "用户名或密码错误");
});

test("non-JSON login requests are rejected", async () => {
  const response = await login(
    { username: "admin", password: "123123" },
    { "Content-Type": "text/plain" },
  );

  assert.equal(response.status, 415);
});

test("unsupported methods return 405", async () => {
  const response = await handleRequest(
    new Request("https://example.com/api/login"),
    env,
  );

  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
});

test("non-API requests are delegated to static assets", async () => {
  const response = await handleRequest(
    new Request("https://example.com/welcome/"),
    env,
  );

  assert.equal(await response.text(), "asset response");
});
