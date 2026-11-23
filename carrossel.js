// Carrossel de fotografias: setas, pontos, teclado e passagem automática opcional
document.querySelectorAll('.carrossel').forEach(car => {
  const slides = [...car.querySelectorAll('.slide')];
  const pontos = car.querySelector('.pontos');
  let atual = 0, temporizador = null;

  slides.forEach((_, n) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Fotografia ' + (n + 1) + ' de ' + slides.length);
    b.addEventListener('click', () => { mostrar(n); reiniciar(); });
    pontos.appendChild(b);
  });

  function mostrar(n) {
    atual = (n + slides.length) % slides.length;
    slides.forEach((s, k) => {
      s.classList.toggle('ativo', k === atual);
      s.setAttribute('aria-hidden', k === atual ? 'false' : 'true');
      s.querySelectorAll('a').forEach(a => a.tabIndex = k === atual ? 0 : -1);
    });
    [...pontos.children].forEach((b, k) => b.setAttribute('aria-current', k === atual));
  }

  car.querySelector('.ant').addEventListener('click', () => { mostrar(atual - 1); reiniciar(); });
  car.querySelector('.seg').addEventListener('click', () => { mostrar(atual + 1); reiniciar(); });
  car.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { mostrar(atual - 1); reiniciar(); }
    if (e.key === 'ArrowRight') { mostrar(atual + 1); reiniciar(); }
  });

  // Passagem automática só quando pedida e se a pessoa não preferir menos movimento
  const auto = car.dataset.auto && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  function iniciar() { if (auto && !temporizador) temporizador = setInterval(() => mostrar(atual + 1), +car.dataset.auto); }
  function parar() { clearInterval(temporizador); temporizador = null; }
  function reiniciar() { parar(); iniciar(); }
  car.addEventListener('mouseenter', parar);
  car.addEventListener('mouseleave', iniciar);
  car.addEventListener('focusin', parar);
  car.addEventListener('focusout', iniciar);

  mostrar(0);
  iniciar();
});
