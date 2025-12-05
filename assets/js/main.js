
/* --------------------------
  1) Scrollspy-like behaviour:
     - highlights nav link for the section in view
     - uses IntersectionObserver
---------------------------*/
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('#mainNav .nav-link');

const obsOptions = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 };
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    const id = entry.target.id;
    const link = document.querySelector(`#mainNav .nav-link[href="#${id}"]`);
    if(entry.isIntersecting){
      navLinks.forEach(n=>n.classList.remove('active'));
      if(link) link.classList.add('active');
    }
  });
}, obsOptions);
sections.forEach(s=>observer.observe(s));

/* --------------------------
  2) Reveal on scroll animations
---------------------------*/
const animEls = document.querySelectorAll('.animate');
const animObs = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      animObs.unobserve(e.target);
    }
  });
},{threshold:.12});
animEls.forEach(el=>animObs.observe(el));

/* --------------------------
  3) Language switcher (uses translations object below)
     - preserves your existing data-i18n approach
---------------------------*/
const translations = {
  pt:{
    home:"Home", sobre:"Sobre", areas:"Áreas", servicos:"Serviços", produtos:"Produtos", parceiros:"Parceiros", equipe:"Equipe", contato:"Contato",
    heroTitle:"Transformando Frutas em Oportunidade",
    heroText:"Soluções agroindustriais sustentáveis que fortalecem agricultores, agregam valor e impulsionam o desenvolvimento rural.",
    heroButton:"Conheça a LDC",
    sobreTitle:"Sobre a LDC",
    sobreText1:document.querySelector('[data-i18n="sobreText1"]') ? document.querySelector('[data-i18n="sobreText1"]').innerHTML : "",
    sobreText2:document.querySelector('[data-i18n="sobreText2"]') ? document.querySelector('[data-i18n="sobreText2"]').innerHTML : "",
    servicosTitle:"Nossos Serviços",
    produtosTitle:"Os Nossos Produtos",
    contatoTitle:"Entre em Contato"
  },
  en:{
    home:"Home", sobre:"About", areas:"Areas", servicos:"Services", produtos:"Products", parceiros:"Partners", equipe:"Team", contato:"Contact",
    heroTitle:"Transforming Fruits into Opportunity",
    heroText:"Sustainable agro-industrial solutions that empower farmers, add value and drive rural development.",
    heroButton:"Meet LDC",
    sobreTitle:"About LDC",
    sobreText1:"LDC Business & Consultants is a Mozambican company founded in 2021, based in Nampula, focused on sustainable agro-processing. We transform tropical fruits into juices, pulps, jams, dried fruits and biofertilizers.",
    sobreText2:"We work with local farmers promoting income, nutrition and social impact with environmental and technological innovation.",
    servicosTitle:"Our Services",
    produtosTitle:"Our Products",
    contatoTitle:"Contact Us"
  }
};

function changeLanguage(lang){
  document.getElementById('htmlLang').lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(translations[lang] && translations[lang][key]){
      el.innerHTML = translations[lang][key];
    }
  });
  // update idioma button
  document.querySelectorAll('[data-lang]').forEach(b=>{
    b.addEventListener('click', (ev)=>{
      ev.preventDefault();
      const l = b.getAttribute('data-lang');
      changeLanguage(l);
      document.querySelector('.idioma-btn img').src = l === 'pt' ? 'https://flagcdn.com/w20/pt.png' : 'https://flagcdn.com/w20/gb.png';
      document.querySelector('.idioma-btn span').textContent = l.toUpperCase();
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  // init language (saved or default pt)
  const saved = localStorage.getItem('preferredLanguage') || 'pt';
  changeLanguage(saved);
  document.querySelector('.idioma-btn img').src = saved === 'pt' ? 'https://flagcdn.com/w20/pt.png' : 'https://flagcdn.com/w20/gb.png';
  document.querySelector('.idioma-btn span').textContent = saved.toUpperCase();

  // language dropdown options
  document.querySelectorAll('[data-lang]').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const lang = btn.getAttribute('data-lang');
      localStorage.setItem('preferredLanguage', lang);
      changeLanguage(lang);
    });
  });
});

/* --------------------------
  4) Contact form send (Formspree)
     Replace YOUR_FORMSPREE_ENDPOINT with your Formspree endpoint:
     Example endpoint: https://formspree.io/f/mnqlkzya
     If not set, it will fallback to mailto.
---------------------------*/
const contactForm = document.getElementById('contact-form');
const feedbackEl = document.getElementById('contact-feedback');
const FORMSPREE_ENDPOINT = 'YOUR_FORMSPREE_ENDPOINT'; // <-- replace this

contactForm.addEventListener('submit', async (e)=>{
  e.preventDefault();
  feedbackEl.style.display = 'none';
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if(!name || !email || !message){
    feedbackEl.className = 'alert alert-danger mt-2';
    feedbackEl.textContent = 'Preencha os campos obrigatórios.';
    feedbackEl.style.display = 'block';
    return;
  }

  // If FORMSPREE_ENDPOINT not configured, fallback to mailto
  if(!FORMSPREE_ENDPOINT || FORMSPREE_ENDPOINT.includes('YOUR_FORMSPREE_ENDPOINT')){
    // fallback: open mailto
    const mailto = `mailto:comercial@ldcbusiness.co.mz?subject=${encodeURIComponent(subject||'Contacto LDC')}&body=${encodeURIComponent('Nome: '+name+'%0AEmail: '+email+'%0A%0A'+message)}`;
    window.location.href = mailto;
    return;
  }

  // Send to Formspree
  try{
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({name,email,subject,message})
    });
    if(res.ok){
      feedbackEl.className = 'alert alert-success';
      feedbackEl.textContent = 'Obrigado! Recebemos a sua mensagem. Entraremos em contacto em breve.';
      feedbackEl.style.display = 'block';
      contactForm.reset();
    } else {
      throw new Error('Erro envio');
    }
  }catch(err){
    console.error(err);
    feedbackEl.className = 'alert alert-danger';
    feedbackEl.textContent = 'Ocorreu um erro ao enviar. Por favor tente novamente.';
    feedbackEl.style.display = 'block';
  }
