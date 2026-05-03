/* ── View switching ── */
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  document.getElementById('nav-' + name).classList.add('active');
  window.scrollTo(0, 0);
}

/* ── Fade-in slides on scroll ── */
const slides = document.querySelectorAll('.slide');
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05 });
slides.forEach(s => fadeObs.observe(s));

/* ── Scroll-to-top ── */
const scrollBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('show', window.scrollY > 500);
}, { passive: true });

/* ══════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════ */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCounter = document.getElementById('lightbox-counter');
const lbClose = document.getElementById('lightbox-close');
const lbPrev = document.getElementById('lightbox-prev');
const lbNext = document.getElementById('lightbox-next');

const slideList = Array.from(slides);
let currentSlide = 0;

function openLightbox(index) {
  currentSlide = index;
  updateLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  lbImg.src = slideList[currentSlide].src;
  lbCounter.textContent = (currentSlide + 1) + ' / ' + slideList.length;
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slideList.length) % slideList.length;
  updateLightbox();
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slideList.length;
  updateLightbox();
}

slideList.forEach((slide, i) => {
  slide.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevSlide);
lbNext.addEventListener('click', nextSlide);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
    return;
  }
  if (e.key === 'Escape' && typeof panel !== 'undefined' && panel && panel.classList.contains('open')) closePanel();
});

// Swipe for mobile
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 50) { diff > 0 ? prevSlide() : nextSlide(); }
}, { passive: true });

/* ══════════════════════════════════════════
   SIDE PANEL (Supplementary PDFs — view only)
══════════════════════════════════════════ */
const panel = document.getElementById('side-panel');
const panelTitle = document.getElementById('side-panel-title');
const panelPdf = document.getElementById('side-panel-pdf');

function openPanel(title, pdfUrl) {
  if (window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    window.open(pdfUrl, '_blank');
    return;
  }
  panelTitle.textContent = title;
  panelPdf.src = pdfUrl + '#toolbar=0&navpanes=0';
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePanel() {
  panel.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { panelPdf.src = ''; }, 350);
}

// Prevent right-click on slides
document.querySelectorAll('.slide').forEach(img => {
  img.addEventListener('contextmenu', e => e.preventDefault());
});
