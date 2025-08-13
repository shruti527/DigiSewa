// src/lib/auth.ts
export function getToken() {
  return localStorage.getItem("token");
}
export function isLoggedIn() {
  return Boolean(getToken());
}
