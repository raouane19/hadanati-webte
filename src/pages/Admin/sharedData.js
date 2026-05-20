export const INIT = {};

export const initials = (n = "") =>
  n
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const avatarColor = (s = "") => {
  const h = [...s].reduce((a, c) => a + c.charCodeAt(0), 0);

  return ["avatar-blue", "avatar-red", "avatar-green"][h % 3];
};