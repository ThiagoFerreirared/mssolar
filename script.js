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
  const msg     = `Olá! Simulei no site da MS Solar e a minha conta média é de R$ ${bill.toLocaleString('pt-BR')}. Gostaria de um orçamento! 🌞`;

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
      💬 Quero este orçamento no WhatsApp
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
const cards = document.querySelectorAll('.svc-card, .gal-item, .benefit, .testi-card, .r-card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6; 
    const rotateY = ((x - centerX) / centerX) * 6;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'none'; 
    card.style.zIndex = '10'; 
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s ease'; 
    card.style.zIndex = '1';
  });
});

/* ══════════════════════════════════════
   ANIMAÇÕES PRO MAX COM GSAP
══════════════════════════════════════ */
// Registra o ScrollTrigger para criar animações baseadas na rolagem
gsap.registerPlugin(ScrollTrigger);

// 1. ANIMAÇÃO DE ENTRADA DO HERO
const heroTl = gsap.timeline();
heroTl.from(".badge", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.2 })
      .from(".hero-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
      .from(".hero-sub", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
      .from(".hero-btns", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .from(".stats-bar", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");

// 2. PARALLAX DE FUNDO AVANÇADO (Luz amarela)
gsap.to(".hero-glow", {
  yPercent: 40,
  ease: "none",
  scrollTrigger: {
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    scrub: true
  }
});

// 3. ANIMAÇÃO DE REVELAÇÃO DOS TEXTOS E CARDS
gsap.utils.toArray('.sec-tag, .sec-title, .sec-desc').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: "top 85%" },
    y: 30, opacity: 0, duration: 0.8, ease: "power3.out"
  });
});

gsap.utils.toArray('.svc-card, .gal-item, .benefit, .testi-card').forEach(card => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: "top 90%" },
    y: 40, opacity: 0, duration: 0.6, ease: "power2.out"
  });
});

// 4. A MAGIA DO PROCESSO (SEM LINHAS, SÓ O BOUNCE!)
const processTimeline = gsap.timeline({
  scrollTrigger: { trigger: ".process-grid", start: "top 75%" }
});

processTimeline.from(".process-step", {
  y: 40, scale: 0.8, opacity: 0,
  duration: 0.9, stagger: 0.35, 
  ease: "back.out(1.5)"
});

// 5. ANIMADOR DE NÚMEROS (CONTADORES)
gsap.utils.toArray('.stat-num[data-target]').forEach(el => {
  const target = parseInt(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () => {
      gsap.to(el, {
        innerHTML: target,
        duration: 2.5,
        snap: { innerHTML: 1 }, 
        ease: "power2.out",
        onUpdate: function() {
          el.innerHTML = Math.round(el.innerHTML) + suffix;
        }
      });
    }
  });
});