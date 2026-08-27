/* ==========================================================================
   VIDRIO Y ALUMINIO — Interacciones de la landing
   Loader · Navbar · Menú móvil · Marquee · Reveal · Contadores ·
   Formulario a WhatsApp · Partículas del hero
   ========================================================================== */
(function () {
  'use strict';

  /* Número de WhatsApp del negocio.
     Formato: 52 (país) + 10 dígitos, sin espacios ni signos.
     ↓↓↓  REEMPLAZAR POR EL NÚMERO REAL DE VIDRIO Y ALUMINIO  ↓↓↓ */
  var WHATSAPP_NUMBER = '520000000000';

  /* ---------- Ocultar el loader al terminar de cargar ---------- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(function () {
      loader.classList.add('hidden');
      setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 600);
    }, 450);
  });

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Disparo de las animaciones de entrada del hero ----------
       Se activa en DOMContentLoaded (con respaldo por si 'load' tarda). */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add('loaded'); });
    });

    /* ---------- Año dinámico en el footer ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---------- Estado "scrolled" del navbar ---------- */
    var navbar = document.getElementById('navbar');
    if (navbar) {
      var onScroll = function () {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* ---------- Menú móvil ---------- */
    var hamburger = document.getElementById('hamburger');
    var mobMenu = document.getElementById('mob-menu');
    if (hamburger && mobMenu) {
      var setMenu = function (open) {
        var isOpen = (open === undefined) ? !mobMenu.classList.contains('open') : open;
        mobMenu.classList.toggle('open', isOpen);
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        document.body.classList.toggle('menu-open', isOpen);
      };
      hamburger.addEventListener('click', function () { setMenu(); });
      Array.prototype.forEach.call(mobMenu.querySelectorAll('a'), function (a) {
        a.addEventListener('click', function () { setMenu(false); });
      });
    }

    /* ---------- Marquee de productos ---------- */
    var marquee = document.getElementById('marquee');
    if (marquee) {
      var items = [
        'Ventanas', 'Puertas', 'Canceles de baño', 'Mosquiteros',
        'Cerramientos corredizos', 'Aluminio y vidrio', 'Fabricación a la medida',
        'Residencial', 'Comercial'
      ];
      var track = items.map(function (t) {
        return '<span class="marquee-item">' + t +
               '</span><span class="marquee-sep" aria-hidden="true">✦</span>';
      }).join('');
      marquee.innerHTML = track + track; /* duplicado para loop continuo */
    }

    /* ---------- Reveal al hacer scroll ---------- */
    var reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            revealObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      Array.prototype.forEach.call(reveals, function (el) { revealObs.observe(el); });
      /* Respaldo: si algo impidiera que el observer dispare, revela todo. */
      setTimeout(function () {
        Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
      }, 4000);
    } else {
      Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
    }

    /* ---------- Contadores de la sección de estadísticas ---------- */
    var counters = document.querySelectorAll('.stat-num');
    var animateCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1600;
      var startTime = null;
      var tick = function (now) {
        if (!startTime) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('es-MX') + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      var countObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      Array.prototype.forEach.call(counters, function (el) { countObs.observe(el); });
    } else {
      Array.prototype.forEach.call(counters, function (el) { animateCount(el); });
    }

    /* ---------- Formulario → WhatsApp ---------- */
    var form = document.getElementById('wa-form');
    if (form) {
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var name = (document.getElementById('f-name').value || '').trim();
        var interest = document.getElementById('f-interest').value || 'Cotización general';
        var msg = (document.getElementById('f-msg').value || '').trim();

        if (!name || !msg) {
          form.classList.add('shake');
          setTimeout(function () { form.classList.remove('shake'); }, 480);
          return;
        }
        var text =
          'Hola, soy ' + name + '.\n' +
          'Me interesa: ' + interest + '.\n' +
          'Detalle del proyecto: ' + msg;
        var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
        window.open(url, '_blank', 'noopener');
      });
    }

    /* ---------- Partículas del hero (orbes de "polvo de cristal") ---------- */
    var canvas = document.getElementById('hero-canvas');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (canvas && canvas.getContext && !reduceMotion) {
      var ctx = canvas.getContext('2d');
      var hero = document.getElementById('hero');
      var W = 0, H = 0, particles = [], raf = null;

      var resize = function () {
        W = canvas.width = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
      };
      var seed = function () {
        particles = [];
        var count = Math.min(64, Math.max(24, Math.floor(W / 26)));
        for (var i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.8 + 0.4,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            a: Math.random() * 0.5 + 0.12
          });
        }
      };
      var frame = function () {
        ctx.clearRect(0, 0, W, H);
        var i, p;
        for (i = 0; i < particles.length; i++) {
          p = particles[i];
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(127,220,238,' + p.a + ')';
          ctx.fill();
        }
        for (var a = 0; a < particles.length; a++) {
          for (var b = a + 1; b < particles.length; b++) {
            var dx = particles[a].x - particles[b].x;
            var dy = particles[a].y - particles[b].y;
            var dist = dx * dx + dy * dy;
            if (dist < 9000) {
              ctx.beginPath();
              ctx.moveTo(particles[a].x, particles[a].y);
              ctx.lineTo(particles[b].x, particles[b].y);
              ctx.strokeStyle = 'rgba(127,220,238,' + (0.12 * (1 - dist / 9000)) + ')';
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
        raf = requestAnimationFrame(frame);
      };

      resize(); seed(); frame();
      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          if (raf) cancelAnimationFrame(raf);
          resize(); seed(); frame();
        }, 200);
      });
    }

  });
})();
