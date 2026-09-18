const mapa = Object.fromEntries(
  (import.meta.env.VITE_VIDEOS ?? "")
    .split(",")
    .map((par) => par.split(":"))
    .filter((par) => par.length === 2 && par[0].trim() && par[1].trim())
    .map((par) => [par[0].trim(), par[1].trim()])
);

export function videoDaAula(lessonId) {
  return mapa[lessonId] ?? "";
}
