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