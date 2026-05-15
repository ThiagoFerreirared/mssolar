/* ══════════════════════════
   TEMA — Sempre light por padrão, só muda por clique ou localStorage
══════════════════════════ */
const html = document.documentElement;
const tIcon = document.getElementById('tIcon');
const tLabel = document.getElementById('tLabel');

// Só aplica dark se o usuário explicitamente salvou
const saved = localStorage.getItem('mssolar-theme');
if(saved === 'dark') applyTheme('dark');

function toggleTheme(){
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}
function applyTheme(t){
  html.setAttribute('data-theme', t);
  localStorage.setItem('mssolar-theme', t);
  tIcon.textContent = t === 'dark' ? '☀️' : '🌙';
  tLabel.textContent = t === 'dark' ? 'Claro' : 'Escuro';
}

/* ══════════════════════════
   MOBILE MENU
══════════════════════════ */
function toggleMenu(){
  const menu = document.getElementById('mobileMenu');
  const btn = document.getElementById('hamBtn');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

/* ══════════════════════════
   SCROLL REVEAL
══════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, {threshold:.12});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

/* ══════════════════════════
   COUNTER ANIMATION
══════════════════════════ */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const duration = 1800;
      const step = Math.ceil(target / (duration / 16));
      const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = start + suffix;
        if(start >= target) clearInterval(timer);
      }, 16);
      counterObs.unobserve(el);
    }
  });
},{threshold:.5});
document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObs.observe(el));

/* ══════════════════════════
   FAQ ACCORDION
══════════════════════════ */
function toggleFaq(el){
  const item = el.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if(!isOpen) item.classList.add('open');
}

/* ══════════════════════════
   CALCULADORA
══════════════════════════ */
function updateBill(val){
  document.getElementById('billVal').textContent = 'R$ ' + Number(val).toLocaleString('pt-BR');
}

function calcular(){
  const bill    = Number(document.getElementById('bill').value);
  const tarifa  = 0.85;
  const irr     = 5.2;
  const eff     = 0.80;
  const kwhMes  = bill / tarifa;
  const kwhDia  = kwhMes / 30;
  const potencia= kwhDia / (irr * eff);
  const custo   = potencia * 5500;
  const econMes = Math.round(bill * 0.90);
  const econAno = econMes * 12;
  const payback = (custo / econAno).toFixed(1);
  const econ25  = econAno * 25;
  const co2     = (kwhMes * 0.0817).toFixed(1);
  const paineis = Math.ceil((potencia * 1000) / 550);
  const cMin    = Math.round(custo * 0.85 / 100) * 100;
  const cMax    = Math.round(custo * 1.15 / 100) * 100;
  const msg     = `Olá! Simulei no site da MS Solar e minha conta média é de R$ ${bill.toLocaleString('pt-BR')}. Gostaria de um orçamento! 🌞`;

  document.getElementById('resultado').innerHTML = `
    <div class="r-main">
      <div class="r-kw">${potencia.toFixed(1)} kWp</div>
      <div class="r-kw-lbl">Potência estimada do sistema</div>
    </div>
    <div class="r-cards">
      <div class="r-card"><div class="n">R$ ${econMes.toLocaleString('pt-BR')}</div><div class="l">Economia / mês</div></div>
      <div class="r-card"><div class="n">${payback} anos</div><div class="l">Payback</div></div>
      <div class="r-card"><div class="n">R$ ${Math.round(econ25/1000)}k</div><div class="l">Economia 25 anos</div></div>
      <div class="r-card"><div class="n">${co2} t</div><div class="l">CO₂ evitado/ano</div></div>
    </div>
    <div class="r-invest">
      <div class="il">Investimento estimado</div>
      <div class="iv">R$ ${cMin.toLocaleString('pt-BR')} – R$ ${cMax.toLocaleString('pt-BR')}</div>
      <div class="is">~${paineis} painéis de 550W</div>
    </div>
    <a href="https://wa.me/5593981012535?text=${encodeURIComponent(msg)}" target="_blank" class="r-wpp">
      💬 Quero esse orçamento no WhatsApp
    </a>
    <div class="r-disc">* Estimativa baseada na tarifa CELPA e irradiação de Santarém-PA.<br/>Valores finais após visita técnica gratuita.</div>
  `;
}

/* ══════════════════════════════════════
   EFEITO PARALLAX DE MOUSE (HERO)
══════════════════════════════════════ */
document.addEventListener('mousemove', (e) => {
  const glow = document.querySelector('.hero-glow');
  const dots = document.querySelector('.hero-dots');
  
  if (glow && dots) {
    const x = (window.innerWidth / 2 - e.pageX) / 40;
    const y = (window.innerHeight / 2 - e.pageY) / 40;
    glow.style.transform = `translate(calc(-50% + ${x}px), ${y}px)`;
    dots.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  }
});

/* ══════════════════════════════════════
   EFEITO 3D TILT NOS CARTÕES DO SITE
══════════════════════════════════════ */
// Seleciona todos os elementos que vão ter o efeito 3D
const cards = document.querySelectorAll('.svc-card, .gal-item, .benefit, .testi-card, .ci-item, .r-card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calcula a inclinação com base na posição do mouse (máximo de 6 a 8 graus)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; 
    const rotateY = ((x - centerX) / centerX) * 6;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none'; // Tira a transição para seguir o mouse rápido
    card.style.zIndex = '10'; // Joga o cartão pra frente
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s ease'; // Volta suavemente pro lugar
    card.style.zIndex = '1';
  });
});

/* ══════════════════════════════════════
   PARALLAX DE SCROLL GLOBAL
══════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  // 1. Parallax de desaparecer no Hero (Topo)
  const heroInner = document.querySelector('.hero-inner');
  if (heroInner && scrollY < window.innerHeight) {
    heroInner.style.transform = `translateY(${scrollY * 0.35}px)`;
    heroInner.style.opacity = 1 - (scrollY / 500);
  }
  
  // 2. Parallax de profundidade nos Elementos (Títulos, Tags e Sol animado)
  // Utiliza requestAnimationFrame internamente via evento de scroll para não travar
  const parallaxElements = document.querySelectorAll('.sec-tag, .sun-anim');
  
  parallaxElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    // Só aplica o cálculo se o elemento estiver visível na tela
    if(rect.top < window.innerHeight && rect.bottom > 0) {
      // O sol se move mais rápido que os títulos para dar mais destaque
      const speed = el.classList.contains('sun-anim') ? 0.15 : 0.05;
      const yPos = (rect.top - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${yPos}px)`;
    }
  });
});