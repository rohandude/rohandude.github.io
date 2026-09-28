(function() {
      const bar = document.getElementById('load-bar');
      const percent = document.getElementById('load-percent');
      const screen = document.getElementById('loading-screen');

      // Real progress: tracks actual <img> elements loading on the page
      const images = Array.from(document.images).filter(function(i){return i.loading !== 'lazy';});
      const total = images.length;
      let loaded = 0;
      let finished = false;

      function updateProgress() {
        const pct = total > 0 ? Math.round((loaded / total) * 100) : 100;
        bar.style.width = pct + '%';
        percent.textContent = pct + '%';
        if (pct >= 100) finish();
      }

      function markLoaded() {
        loaded++;
        updateProgress();
      }

      function finish() {
        if (finished) return;
        finished = true;
        setTimeout(function() {
          screen.classList.add('hidden');
          setTimeout(function() { screen.style.display = 'none'; }, 1200);
        }, 300);
      }

      if (total === 0) {
        updateProgress();
      } else {
        images.forEach(function(img) {
          if (img.complete) {
            markLoaded();
          } else {
            img.addEventListener('load', markLoaded);
            img.addEventListener('error', markLoaded);
          }
        });
      }

      // Safety net: never let the loader hang forever on a slow/broken connection
      setTimeout(finish, 6000);
    })();

    (function() {
      const canvas = document.getElementById('ember-canvas');
      const ctx = canvas.getContext('2d');
      let particles = [];
      let animationId;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      function createParticles() {
        particles = [];
        const count = Math.min(80, Math.floor(window.innerWidth / 15));
        const colors = ["#D61B1B", "#FF3B3B", "#8B0000", "#FF6B6B"];
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: -Math.random() * 0.5 - 0.2,
            opacity: Math.random() * 0.5 + 0.2,
            color: colors[Math.floor(Math.random() * colors.length)]
          });
        }
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function(p) {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        animationId = requestAnimationFrame(animate);
      }

      resize();
      createParticles();
      animate();
      window.addEventListener('resize', function() { resize(); createParticles(); });
    })();

    (function() {
      const navbar = document.getElementById('navbar');
      window.addEventListener('scroll', function() {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
      });
    })();

    function toggleMobileMenu() {
      document.getElementById('mobile-menu').classList.toggle('active');
    }

    // Enhanced Intersection Observer with stagger support
    (function() {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Also trigger stagger children if parent has stagger-children class
            if (entry.target.classList.contains('stagger-children')) {
              entry.target.classList.add('visible');
            }
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-blur, .reveal-flip, .img-reveal, .stagger-children').forEach(function(el) {
        observer.observe(el);
      });
    })();

    // Hero entrance animations with delay after loading
    setTimeout(function() {
      document.getElementById('hero-left').classList.add('visible');

      // Text scramble effect for hero name
      scrambleText('hero-name-1', 'ROHAN', 800);
      setTimeout(function() {
        scrambleText('hero-name-2', 'KRYTHOS', 800);
      }, 400);

      setTimeout(function() {
        document.getElementById('hero-right').classList.add('visible');
      }, 600);
    }, 2800);

    // Text scramble function
    function scrambleText(elementId, finalText, duration) {
      const el = document.getElementById(elementId);
      if (!el) return;
      el.classList.add('scrambling');
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      const steps = 12;
      const stepDuration = duration / steps;
      let step = 0;

      const interval = setInterval(function() {
        if (step >= steps) {
          el.textContent = finalText;
          el.classList.remove('scrambling');
          clearInterval(interval);
          return;
        }
        let scrambled = '';
        for (let i = 0; i < finalText.length; i++) {
          if (i < (step / steps) * finalText.length) {
            scrambled += finalText[i];
          } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        el.textContent = scrambled;
        step++;
      }, stepDuration);
    }

    // Tab Switching with enhanced animation
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        const panel = document.getElementById('tab-' + btn.dataset.tab);
        panel.classList.add('active');
        // Re-trigger reveal animations for new panel
        panel.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-blur').forEach(function(el) {
          el.classList.remove('visible');
          setTimeout(function() { el.classList.add('visible'); }, 100);
        });
      });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Parallax effect for hero background
    (function() {
      const heroBg = document.querySelector('.hero-bg');
      if (heroBg) {
        window.addEventListener('scroll', function() {
          const scrolled = window.pageYOffset;
          heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
        });
      }
    })();

    // Magnetic hover effect for buttons
    (function() {
      const magneticElements = document.querySelectorAll('.btn-primary, .btn-outline, .project-btn, .about-stat, .achieve-card');
      magneticElements.forEach(function(el) {
        el.addEventListener('mousemove', function(e) {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          el.style.transform = 'translate(' + (x * 0.1) + 'px, ' + (y * 0.1) + 'px)';
        });
        el.addEventListener('mouseleave', function() {
          el.style.transform = '';
        });
      });
    })();

    // Profile particles animation
    (function() {
      const container = document.getElementById('profile-particles');
      if (!container) return;

      const particleCount = 12;
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'profile-particle';
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.animationDelay = (i * 0.25) + 's';
        particle.style.animationDuration = (2.5 + Math.random() * 1.5) + 's';
        container.appendChild(particle);
      }
    })();

    // ========== HEADER ANIMATION: DESKTOP SCROLL-SCRUB / MOBILE AUTOPLAY ==========
    (function() {
      const section = document.getElementById('scroll-anim-section');
      const sticky = document.querySelector('.scroll-anim-sticky');
      const canvas = document.getElementById('scrollAnimCanvas');
      const loader = document.getElementById('scrollAnimLoader');
      const hint = document.getElementById('scrollAnimHint');
      const progressFill = document.getElementById('scrollAnimProgress');
      if (!section || !canvas) return;

      const ctx = canvas.getContext('2d');
      const TOTAL_FRAMES = 240;
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      section.classList.toggle('mobile-mode', isMobile);
      if (isMobile && hint) hint.style.display = 'none';

      // Frames 1-99 live in header-frame-A, 100-198 in header-frame-B, 199-240 in header-frame-C
      function framePath(n) {
        const padded = String(n).padStart(3, '0');
        let folder;
        if (n <= 99) folder = 'header-frame-A';
        else if (n <= 198) folder = 'header-frame-B';
        else folder = 'header-frame-C';
        return folder + '/ezgif-frame-' + padded + '.jpg';
      }

      const images = new Array(TOTAL_FRAMES + 1); // 1-indexed
      const loadedFlags = new Array(TOTAL_FRAMES + 1).fill(false);
      let currentFrame = 1;

      function markLoaded(n) {
        loadedFlags[n] = true;
        if (n === 1) {
          loader.classList.add('hidden');
          drawFrame(1, true);
          if (isMobile) startMobileAutoplay();
        }
      }

      // Kick off loading of all frames (browser queues/parallelizes automatically)
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.decoding = 'async';
        img.onload = function() { markLoaded(i); };
        img.onerror = function() { markLoaded(i); }; // don't block sequence on a bad frame
        img.src = framePath(i);
        images[i] = img;
      }

      function resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = sticky.getBoundingClientRect();
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        drawFrame(currentFrame, true);
      }

      function nearestAvailableFrame(target) {
        if (loadedFlags[target]) return target;
        for (let d = 1; d < TOTAL_FRAMES; d++) {
          if (target - d >= 1 && loadedFlags[target - d]) return target - d;
          if (target + d <= TOTAL_FRAMES && loadedFlags[target + d]) return target + d;
        }
        return 1;
      }

      // Desktop: hard "cover" crop (fills the wide sticky viewport, minor left/right crop only)
      function drawCover(img, cw, ch) {
        const iw = img.naturalWidth, ih = img.naturalHeight;
        const canvasRatio = cw / ch, imgRatio = iw / ih;
        let sx, sy, sw, sh;
        if (imgRatio > canvasRatio) {
          sh = ih; sw = ih * canvasRatio; sx = (iw - sw) / 2; sy = 0;
        } else {
          sw = iw; sh = iw / canvasRatio; sx = 0; sy = (ih - sh) / 2;
        }
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
      }

      // Mobile: blurred cover backdrop + sharp "contain" foreground so nothing important gets cropped
      // on tall portrait screens (a 16:9 frame would otherwise lose most of its width to a hard crop).
      function drawContainWithBackdrop(img, cw, ch) {
        const iw = img.naturalWidth, ih = img.naturalHeight;
        try {
          ctx.save();
          ctx.filter = 'blur(24px) brightness(0.55)';
          const bScale = Math.max(cw / iw, ch / ih) * 1.15;
          const bw = iw * bScale, bh = ih * bScale;
          ctx.drawImage(img, (cw - bw) / 2, (ch - bh) / 2, bw, bh);
          ctx.restore();
        } catch (e) { /* filter unsupported on very old browsers - skip backdrop */ }

        const fScale = Math.min(cw / iw, ch / ih);
        const fw = iw * fScale, fh = ih * fScale;
        ctx.drawImage(img, (cw - fw) / 2, (ch - fh) / 2, fw, fh);
      }

      function drawFrame(requested, force) {
        const frameToShow = nearestAvailableFrame(requested);
        if (!force && frameToShow === currentFrame) return;
        currentFrame = frameToShow;
        const img = images[frameToShow];
        if (!img || !img.complete || !img.naturalWidth) return;

        const cw = canvas.width, ch = canvas.height;
        ctx.clearRect(0, 0, cw, ch);
        if (isMobile) {
          drawContainWithBackdrop(img, cw, ch);
        } else {
          drawCover(img, cw, ch);
        }
      }

      // ---------- DESKTOP: scroll-scrubbing ----------
      function updateFromScroll() {
        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        let progress = scrollable > 0 ? (-rect.top) / scrollable : 0;
        progress = Math.max(0, Math.min(1, progress));

        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        section.classList.toggle('in-view', inView);
        section.classList.toggle('at-end', progress > 0.02);

        const frameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(progress * (TOTAL_FRAMES - 1)) + 1));
        drawFrame(frameIndex);
        if (progressFill) progressFill.style.width = (progress * 100) + '%';
      }

      let ticking = false;
      function onScroll() {
        if (!ticking) {
          window.requestAnimationFrame(function() { updateFromScroll(); ticking = false; });
          ticking = true;
        }
      }

      // ---------- MOBILE: one-time autoplay when the section enters view ----------
      let autoplayStarted = false;
      function startMobileAutoplay() {
        if (autoplayStarted) return;
        autoplayStarted = true;
        const DURATION = 4200; // ms for a full play-through
        const t0 = performance.now();
        function step(now) {
          const t = Math.min(1, (now - t0) / DURATION);
          const frameIndex = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(t * (TOTAL_FRAMES - 1)) + 1));
          drawFrame(frameIndex);
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }

      if (isMobile) {
        const io = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting && images[1] && images[1].complete) {
              startMobileAutoplay();
              io.disconnect();
            }
          });
        }, { threshold: 0.25 });
        io.observe(section);
      } else {
        window.addEventListener('scroll', onScroll, { passive: true });
      }

      window.addEventListener('resize', function() {
        resizeCanvas();
        if (!isMobile) updateFromScroll();
      });

      // Initial setup
      resizeCanvas();
      if (!isMobile) updateFromScroll();
    })();

    // Profile 3D tilt on mouse move
    (function() {
      const profileBox = document.getElementById('profile-box');
      const profileImg = document.getElementById('profile-img');
      if (!profileBox || !profileImg) return;

      profileBox.addEventListener('mousemove', function(e) {
        const rect = profileBox.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        profileImg.style.transform = 'scale(1.08) rotateY(' + (x * 15) + 'deg) rotateX(' + (-y * 15) + 'deg)';
        profileImg.style.animation = 'none';
      });

      profileBox.addEventListener('mouseleave', function() {
        profileImg.style.transform = '';
        profileImg.style.animation = 'profileFloat 4s ease-in-out infinite';
      });
    })();
