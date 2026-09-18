import { useEffect, useRef } from "react";

const ESPACO = 26;
const TAMANHO = 1.7;
const RAIO = 230;
const EMPURRAO = 0.55;
const MOLA = 0.08;
const ATRITO = 0.87;
const ALPHA_REPOUSO = 0.18;
const ALPHA_ATIVO = 0.44;
const PARADO = 0.05;

export function GraoDoPapel() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const corGrao = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-ink")
      .trim();

    let graos = [];
    let largura = 0;
    let altura = 0;
    let maoX = null;
    let maoY = null;
    let quadro = null;

    function semear() {
      const dpr = window.devicePixelRatio || 1;
      largura = window.innerWidth;
      altura = window.innerHeight;
      canvas.width = largura * dpr;
      canvas.height = altura * dpr;
      canvas.style.width = `${largura}px`;
      canvas.style.height = `${altura}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      graos = [];
      for (let x = 0; x < largura + ESPACO; x += ESPACO) {
        for (let y = 0; y < altura + ESPACO; y += ESPACO) {
          graos.push({

            rx: x + (Math.random() - 0.5) * ESPACO,
            ry: y + (Math.random() - 0.5) * ESPACO,
            dx: 0,
            dy: 0,
            vx: 0,
            vy: 0,
          });
        }
      }
      desenhar();
    }

    function desenhar() {
      ctx.clearRect(0, 0, largura, altura);
      ctx.fillStyle = corGrao;

      const ativos = [];
      ctx.globalAlpha = ALPHA_REPOUSO;
      for (const grao of graos) {
        const energia = Math.hypot(grao.dx, grao.dy) / RAIO;
        if (energia > PARADO) ativos.push([grao, energia]);
        else ctx.fillRect(grao.rx + grao.dx, grao.ry + grao.dy, TAMANHO, TAMANHO);
      }

      for (const [grao, energia] of ativos) {
        const forca = Math.min(1, energia * 3);
        ctx.globalAlpha = ALPHA_REPOUSO + (ALPHA_ATIVO - ALPHA_REPOUSO) * forca;
        const lado = TAMANHO + forca * 1.1;
        ctx.fillRect(grao.rx + grao.dx, grao.ry + grao.dy, lado, lado);
      }
      ctx.globalAlpha = 1;
    }

    function passo() {
      let inquieto = false;

      for (const grao of graos) {
        if (maoX !== null) {
          const px = grao.rx + grao.dx - maoX;
          const py = grao.ry + grao.dy - maoY;
          const distancia = Math.hypot(px, py);
          if (distancia < RAIO && distancia > 0) {
            const queda = 1 - distancia / RAIO;
            const impulso = queda * queda * EMPURRAO * RAIO;
            grao.vx += (px / distancia) * impulso * 0.1;
            grao.vy += (py / distancia) * impulso * 0.1;
          }
        }

        grao.vx = (grao.vx - grao.dx * MOLA) * ATRITO;
        grao.vy = (grao.vy - grao.dy * MOLA) * ATRITO;
        grao.dx += grao.vx;
        grao.dy += grao.vy;

        if (Math.abs(grao.dx) > 0.15 || Math.abs(grao.dy) > 0.15) inquieto = true;
      }

      desenhar();

      quadro = inquieto || maoX !== null ? window.requestAnimationFrame(passo) : null;
    }

    function acordar() {
      if (quadro === null) quadro = window.requestAnimationFrame(passo);
    }

    function aoMover(evento) {
      maoX = evento.clientX;
      maoY = evento.clientY;
      acordar();
    }

    function aoSair() {
      maoX = null;
      maoY = null;
      acordar();
    }

    semear();
    window.addEventListener("resize", semear);

    const comCursor = window.matchMedia("(hover: hover)").matches;
    const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reagir = comCursor && !movimentoReduzido;
    if (reagir) {
      window.addEventListener("pointermove", aoMover);
      document.addEventListener("pointerleave", aoSair);
    }

    return () => {
      window.removeEventListener("resize", semear);
      if (reagir) {
        window.removeEventListener("pointermove", aoMover);
        document.removeEventListener("pointerleave", aoSair);
      }
      if (quadro !== null) window.cancelAnimationFrame(quadro);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0" />;
}
