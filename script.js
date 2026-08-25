/**
 * Milan Rathod — Premium Python Developer Portfolio
 * script.js — Complete Animation & Interaction System
 */

(function () {
    'use strict';
    // ──────────────────────────────────────────────
    // 0. Theme Toggle
    // ──────────────────────────────────────────────
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }

    // ──────────────────────────────────────────────
    // 1. Custom Cursor
    // ──────────────────────────────────────────────
    (function initCursor() {
        const dot  = document.getElementById('cursorDot');
        const ring = document.getElementById('cursorRing');
        if (!dot || !ring) return;

        let mouseX = 0, mouseY = 0;
        let ringX  = 0, ringY  = 0;
        let animId;

        function animateRing() {
            ringX += (mouseX - ringX) * 0.12;
            ringY += (mouseY - ringY) * 0.12;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';
            animId = requestAnimationFrame(animateRing);
        }
        animateRing();

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = e.clientX + 'px';
            dot.style.top  = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .project-card, .cert-card, .skill-node').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
        });
    })();

    // ──────────────────────────────────────────────
    // 2. Mouse Glow
    // ──────────────────────────────────────────────
    (function initMouseGlow() {
        const glow = document.getElementById('mouseGlow');
        const navLinks = document.querySelectorAll('.nav-link');
        const projectCards = document.querySelectorAll('.project-card');
        
        document.addEventListener('mousemove', (e) => {
            if (glow) {
                glow.style.left = e.clientX + 'px';
                glow.style.top  = e.clientY + 'px';
            }
            
            navLinks.forEach(link => {
                const rect = link.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                link.style.setProperty('--lx', `${x}px`);
                link.style.setProperty('--ly', `${y}px`);
            });

            projectCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--card-mouse-x', `${x}px`);
                card.style.setProperty('--card-mouse-y', `${y}px`);
            });
        });
    })();

    // ──────────────────────────────────────────────
    // 3. Navbar — Scroll Behavior & Active ScrollSpy
    // ──────────────────────────────────────────────
    (function initNavbar() {
        const header     = document.getElementById('navHeader');
        const hamburger  = document.getElementById('navHamburger');
        const drawer     = document.getElementById('mobileDrawer');
        const drawerClose= document.getElementById('mobileDrawerClose');
        const progressBar= document.getElementById('scrollProgressBar');
        const backToTop  = document.getElementById('backToTop');
        const navLinks   = document.querySelectorAll('.nav-link');
        const sections   = document.querySelectorAll('section[id]');
        const mobileLinks= document.querySelectorAll('.mobile-nav-link');

        // Scroll progress + back-to-top + spy
        window.addEventListener('scroll', () => {
            const scrollTop  = window.scrollY;
            const docHeight  = document.documentElement.scrollHeight - window.innerHeight;

            // Scroll progress bar
            if (progressBar && docHeight > 0) {
                progressBar.style.width = (scrollTop / docHeight * 100) + '%';
            }

            // Header style
            if (header) {
                header.classList.toggle('scrolled', scrollTop > 40);
            }

            // Back-to-top
            if (backToTop) {
                backToTop.classList.toggle('visible', scrollTop > 350);
            }

            // ScrollSpy
            let current = '';
            sections.forEach(section => {
                if (scrollTop >= section.offsetTop - 100) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.section === current);
            });
            mobileLinks.forEach(link => {
                const href = link.getAttribute('href');
                link.classList.toggle('active', href === '#' + current);
            });
        }, { passive: true });

        // Hamburger
        function openDrawer() {
            drawer.classList.add('open');
            drawer.removeAttribute('aria-hidden');
            hamburger.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }
        function closeDrawer() {
            drawer.classList.remove('open');
            drawer.setAttribute('aria-hidden', 'true');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        if (hamburger) hamburger.addEventListener('click', openDrawer);
        if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

        mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

        document.addEventListener('click', (e) => {
            if (drawer && drawer.classList.contains('open') && !drawer.contains(e.target) && !hamburger.contains(e.target)) {
                closeDrawer();
            }
        });
    })();

    // ──────────────────────────────────────────────
    // 4. Reveal on Scroll (IntersectionObserver)
    // ──────────────────────────────────────────────
    (function initReveal() {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('.reveal-up, .reveal-fade, .section').forEach(el => {
                el.classList.add('revealed');
                if (el.classList.contains('section')) el.classList.add('in-view');
            });
            return;
        }
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    if (entry.target.classList.contains('section')) {
                        entry.target.classList.add('in-view');
                    } else {
                        observer.unobserve(entry.target);
                    }
                } else if (entry.target.classList.contains('section')) {
                    // Optional: remove in-view if we want it to trigger again
                    // entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal-up, .reveal-fade, .section').forEach(el => observer.observe(el));
    })();

    // ──────────────────────────────────────────────
    // 5. Animated Stat Counters
    // ──────────────────────────────────────────────
    (function initCounters() {
        const stats = document.querySelectorAll('.stat-num');
        if (!stats.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        stats.forEach(el => observer.observe(el));

        function animateCount(el) {
            const target   = parseFloat(el.dataset.count || 0);
            const isDecimal= el.dataset.decimal === 'true';
            const duration = 1400;
            const start    = performance.now();

            function step(now) {
                const pct  = Math.min((now - start) / duration, 1);
                const eased= 1 - Math.pow(1 - pct, 3);
                el.textContent = isDecimal
                    ? (target * eased).toFixed(2)
                    : Math.floor(target * eased);
                if (pct < 1) requestAnimationFrame(step);
                else el.textContent = isDecimal ? target.toFixed(2) : target;
            }
            requestAnimationFrame(step);
        }
    })();

    // ──────────────────────────────────────────────
    // 6. CGPA Ring Animation
    // ──────────────────────────────────────────────
    (function initCgpaRing() {
        const ring = document.querySelector('.cgpa-ring-fill');
        if (!ring) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ring.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(ring);
    })();

    // ──────────────────────────────────────────────
    // 7. Semester Bars Animation
    // ──────────────────────────────────────────────
    (function initSemBars() {
        const bars = document.querySelectorAll('.sem-fill');
        if (!bars.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        bars.forEach(bar => observer.observe(bar));
    })();

    // ──────────────────────────────────────────────
    // 8. GitHub Language Bars Animation
    // ──────────────────────────────────────────────
    (function initGlbBars() {
        const bars = document.querySelectorAll('.glb-fill');
        if (!bars.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        bars.forEach(bar => observer.observe(bar));
    })();

    // ──────────────────────────────────────────────
    // 9. Project 3D Tilt Effect
    // ──────────────────────────────────────────────
    (function initTilt() {
        if (window.matchMedia('(hover: none)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect  = card.getBoundingClientRect();
                const cx    = rect.left + rect.width  / 2;
                const cy    = rect.top  + rect.height / 2;
                const dx    = (e.clientX - cx) / (rect.width  / 2);
                const dy    = (e.clientY - cy) / (rect.height / 2);
                const rotX  = -dy * 6;
                const rotY  =  dx * 6;
                card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    })();

    // ──────────────────────────────────────────────
    // 10. Project Filter
    // ──────────────────────────────────────────────
    (function initProjectFilter() {
        const filterBtns = document.querySelectorAll('[data-filter]');
        const cards      = document.querySelectorAll('.project-card');
        if (!filterBtns.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                cards.forEach(card => {
                    const tags = (card.dataset.tags || '');
                    if (filter === 'all' || tags.includes(filter)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    })();

    // ──────────────────────────────────────────────
    // 11. Certificate Filter
    // ──────────────────────────────────────────────
    (function initCertFilter() {
        const filterBtns = document.querySelectorAll('[data-cert-filter]');
        const cards      = document.querySelectorAll('.cert-card');
        if (!filterBtns.length) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.certFilter;

                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                cards.forEach(card => {
                    const tags = (card.dataset.certTags || '');
                    if (filter === 'all' || tags.includes(filter)) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    })();

    // ──────────────────────────────────────────────
    // 12. Recruiter Mode Toggle
    // ──────────────────────────────────────────────
    (function initRecruiterMode() {
        const btn     = document.getElementById('recruiterModeBtn');
        const overlay = document.getElementById('recruiterOverlay');
        const closeBtn= document.getElementById('recruiterClose');
        if (!btn || !overlay) return;

        function openRecruiter() {
            overlay.removeAttribute('hidden');
            document.body.style.overflow = 'hidden';
            requestAnimationFrame(() => overlay.style.opacity = '1');
        }
        function closeRecruiter() {
            overlay.setAttribute('hidden', '');
            document.body.style.overflow = '';
        }

        btn.addEventListener('click', openRecruiter);
        if (closeBtn) closeBtn.addEventListener('click', closeRecruiter);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeRecruiter();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeRecruiter();
        });
    })();

    // ──────────────────────────────────────────────
    // 13. Project Modal (Case Studies)
    // ──────────────────────────────────────────────
    const projectData = {
        ai: {
            category: 'Python / FastAPI / OpenAI',
            title: 'AI Portfolio Assistant',
            liveLink: '#',
            codeLink: 'https://github.com/Milan07xt',
            desc: 'A professional AI assistant built with FastAPI and OpenAI that understands the full portfolio context and answers visitor questions dynamically in real time.',
            features: [
                'FastAPI backend with OpenAI API integration',
                'Context-aware responses about skills and projects',
                'Real-time streaming responses via Server-Sent Events',
                'Floating widget UI with smooth animation',
                'Session memory for conversation continuity',
            ],
            architecture: 'Python FastAPI REST endpoint receives user queries, injects portfolio context into a system prompt, and streams OpenAI GPT responses back to the browser widget.',
            tags: ['Python', 'FastAPI', 'OpenAI', 'JavaScript', 'Node.js'],
        },
        face: {
            category: 'Python / Django / OpenCV',
            title: 'Face Recognition Attendance System',
            liveLink: 'https://face-detection-attendance-woad.vercel.app/home/',
            codeLink: 'https://github.com/Milan07xt/SEM-06',
            desc: 'Real-time face recognition attendance tracking system. Uses OpenCV for face detection and Django REST Framework for backend API and attendance log management.',
            features: [
                'Real-time face detection with OpenCV and dlib',
                'Django REST Framework API for attendance records',
                'SQLite3 database for storing employee/student data',
                'Admin dashboard for report generation',
                'Attendance export to CSV',
            ],
            architecture: 'OpenCV captures video frames, dlib extracts facial embeddings, Python compares against known faces, Django REST API records attendance to SQLite3.',
            tags: ['Python', 'Django', 'OpenCV', 'REST API', 'SQLite3', 'dlib'],
        },
        gym: {
            category: 'Python / Django / SQLite',
            title: 'Gym Management System',
            liveLink: 'https://django-gym-management-system-websit-one.vercel.app/',
            codeLink: 'https://github.com/Milan07xt/Django-Gym-Management-System-Website',
            desc: 'Comprehensive Django-based gym management application for handling memberships, subscription plans, and payment tracking with a complete admin dashboard.',
            features: [
                'Member registration and profile management',
                'Subscription plan management with expiry tracking',
                'Payment recording and history dashboard',
                'Django Admin extended for gym operations',
                'Responsive frontend with Bootstrap',
            ],
            architecture: 'Django MVC architecture with SQLite3 database. Django ORM for all database operations, Django Admin for management interface, template-based views for public pages.',
            tags: ['Python', 'Django', 'SQLite3', 'HTML5', 'CSS3', 'Bootstrap'],
        },
        hotel: {
            category: 'HTML5 / CSS3 / JavaScript',
            title: 'Hotel Management Website',
            liveLink: 'https://hotel-website-project-kappa.vercel.app/index.html',
            codeLink: 'https://github.com/Milan07xt/Hotel-Website-Project',
            desc: 'Responsive hotel booking website with a modern UI design, interactive room gallery, booking flow, and fully optimized mobile experience.',
            features: [
                'Responsive design with CSS Grid and Flexbox',
                'Interactive room gallery with image carousel',
                'Smooth scroll and section animations',
                'Contact/booking form with validation',
                'Mobile-first approach and touch optimization',
            ],
            architecture: 'Pure HTML5, CSS3 and vanilla JavaScript. No framework dependencies. Deployed on Vercel with static site hosting.',
            tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Vercel'],
        },
    };

    (function initProjectModal() {
        const modal       = document.getElementById('projectModal');
        const closeBtn    = document.getElementById('modalCloseBtn');
        const modalCat    = document.getElementById('modalCategory');
        const modalTitle  = document.getElementById('modalTitle');
        const modalLive   = document.getElementById('modalLiveLink');
        const modalCode   = document.getElementById('modalCodeLink');
        const modalDesc   = document.getElementById('modalDesc');
        const modalFeat   = document.getElementById('modalFeatures');
        const modalArch   = document.getElementById('modalArchitecture');
        const modalTags   = document.getElementById('modalTags');
        if (!modal) return;

        function openModal(key) {
            const data = projectData[key];
            if (!data) return;
            modalCat.textContent   = data.category;
            modalTitle.textContent = data.title;
            modalLive.href         = data.liveLink;
            modalCode.href         = data.codeLink;
            modalDesc.textContent  = data.desc;
            modalArch.textContent  = data.architecture;
            modalFeat.innerHTML    = data.features.map(f => `<li>${f}</li>`).join('');
            modalTags.innerHTML    = data.tags.map(t => `<span class="ptag">${t}</span>`).join('');
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
        function closeModal() {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });

        // Expose for onclick attributes
        window.openAICaseStudy   = () => openModal('ai');
        window.openFaceCaseStudy = () => openModal('face');
        window.openGymCaseStudy  = () => openModal('gym');
        window.openHotelCaseStudy= () => openModal('hotel');
    })();

    // ──────────────────────────────────────────────
    // 14. Contact Form Submission
    // ──────────────────────────────────────────────
    (function initContactForm() {
        const form        = document.getElementById('contactForm');
        const status      = document.getElementById('formStatus');
        const submitBtn   = document.getElementById('contactSubmitBtn');
        const successModal= document.getElementById('contactSuccessModal');
        const successClose= document.getElementById('successCloseBtn');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
            }
            if (status) { status.textContent = ''; status.className = 'form-status'; }

            const data = {
                name:    form.querySelector('[name="name"]')?.value    || '',
                email:   form.querySelector('[name="email"]')?.value   || '',
                number:  form.querySelector('[name="number"]')?.value  || '',
                subject: form.querySelector('[name="subject"]')?.value || '',
                message: form.querySelector('[name="message"]')?.value || '',
                device:  navigator.userAgent,
            };

            try {
                const res = await fetch('/submit-contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const json = await res.json().catch(() => ({}));

                if (res.ok) {
                    form.reset();
                    if (successModal) {
                        successModal.classList.add('open');
                        document.body.style.overflow = 'hidden';
                    } else if (status) {
                        status.textContent = '✓ Message sent successfully!';
                        status.className = 'form-status success';
                    }
                } else {
                    throw new Error(json.message || 'Server error');
                }
            } catch (err) {
                if (status) {
                    status.textContent = '✗ Failed to send. Please email directly: rathodmilan216@gmail.com';
                    status.className = 'form-status error';
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                }
            }
        });

        // Close success modal
        if (successClose) {
            successClose.addEventListener('click', () => {
                successModal.classList.remove('open');
                document.body.style.overflow = '';
            });
        }
        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target === successModal) {
                    successModal.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        }
    })();

    // ──────────────────────────────────────────────
    // 15. Skills Galaxy — Pause on hover
    // ──────────────────────────────────────────────
    (function initGalaxy() {
        const galaxy = document.getElementById('skillsGalaxy');
        const nodes  = galaxy ? galaxy.querySelectorAll('.skill-node') : [];

        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                node.style.animationPlayState = 'paused';
            });
            node.addEventListener('mouseleave', () => {
                node.style.animationPlayState = 'running';
            });
        });
    })();

    // ──────────────────────────────────────────────
    // 16. GitHub Contribution Calendar (preserved)
    // ──────────────────────────────────────────────
    (function initContribGraph() {
        const grid   = document.getElementById('contrib-grid');
        const months = document.getElementById('contrib-months');
        if (!grid) return;

        const today = new Date();
        const days  = 371;
        const start = new Date(today);
        start.setDate(start.getDate() - days);

        const activityData = {
            '2025-09-12': 2, '2025-09-13': 3, '2025-09-20': 1,
            '2025-10-05': 4, '2025-10-06': 2, '2025-10-15': 3,
            '2025-10-22': 1, '2025-11-03': 5, '2025-11-04': 3,
            '2025-11-10': 2, '2025-11-17': 4, '2025-11-24': 1,
            '2025-12-01': 3, '2025-12-08': 2, '2025-12-15': 4,
            '2025-12-22': 1, '2025-12-29': 2, '2026-01-05': 3,
            '2026-01-12': 5, '2026-01-19': 2, '2026-01-26': 4,
            '2026-02-02': 3, '2026-02-09': 2, '2026-02-16': 5,
            '2026-02-23': 1, '2026-03-02': 4, '2026-03-09': 3,
            '2026-03-16': 2, '2026-03-23': 5, '2026-04-06': 3,
            '2026-04-13': 4, '2026-04-20': 2, '2026-04-27': 3,
            '2026-05-04': 5, '2026-05-11': 2, '2026-05-18': 4,
            '2026-05-25': 3, '2026-06-01': 5, '2026-06-08': 2,
            '2026-06-15': 4, '2026-06-22': 3, '2026-06-29': 2,
            '2026-07-06': 5, '2026-07-13': 4, '2026-07-20': 3,
            '2026-07-27': 2, '2026-08-03': 5, '2026-08-10': 4,
            '2026-08-17': 3, '2026-08-24': 5, '2026-08-31': 4,
            '2026-09-01': 3, '2026-09-02': 2,
        };

        function fmt(d) {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        }

        function getLevel(count) {
            if (!count) return 0;
            if (count <= 1) return 1;
            if (count <= 2) return 2;
            if (count <= 4) return 3;
            return 4;
        }

        const weekStart = new Date(start);
        weekStart.setDate(start.getDate() - start.getDay());

        for (let d = new Date(weekStart); d <= today; d.setDate(d.getDate() + 1)) {
            const dateStr = fmt(d);
            const count   = activityData[dateStr] || 0;
            const level   = getLevel(count);
            const cell    = document.createElement('div');
            cell.className= `contrib-cell level-${level}`;
            cell.title    = `${dateStr}: ${count} contribution${count !== 1 ? 's' : ''}`;
            grid.appendChild(cell);
        }

        // Month labels
        if (months) {
            const labels = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];
            labels.forEach(m => {
                const span = document.createElement('span');
                span.textContent = m;
                months.appendChild(span);
            });
        }
    })();

    // ──────────────────────────────────────────────
    // 17. Smooth scroll for anchor links
    // ──────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ──────────────────────────────────────────────
    // 18. Prefers Reduced Motion guard
    // ──────────────────────────────────────────────
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.reveal-up, .reveal-fade').forEach(el => el.classList.add('revealed'));
    }

})();

// ──────────────────────────────────────────────────
// CSS for contribution calendar (injected)
// ──────────────────────────────────────────────────
(function injectContribStyles() {
    const style = document.createElement('style');
    style.textContent = `
    .github-contribution-wrapper { display: none; }
    .contrib-cell {
        width: 11px; height: 11px;
        border-radius: 2px;
        background: #EBEDF0;
        display: inline-block;
        margin: 1px;
        cursor: pointer;
        transition: transform 0.15s;
    }
    .contrib-cell:hover { transform: scale(1.3); }
    .contrib-cell.level-1 { background: #9BE9A8; }
    .contrib-cell.level-2 { background: #40C463; }
    .contrib-cell.level-3 { background: #30A14E; }
    .contrib-cell.level-4 { background: #216E39; }
    #contrib-grid {
        display: grid;
        grid-template-rows: repeat(7, 13px);
        grid-auto-flow: column;
        gap: 2px;
    }
    `;
    document.head.appendChild(style);
})();

// Education Timeline Animations
const eduObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            eduObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll(".cgpa-ring-fill, .sem-fill, .timeline-line").forEach(el => {
    eduObserver.observe(el);
});

// Assign neon glow colors to glass-cards for the HD border lighting effect
(function initNeonBorders() {
    const neonColors = [
        { color: 'rgba(0, 229, 255, 0.8)', shadow: 'rgba(0, 229, 255, 0.4)' }, // Cyan
        { color: 'rgba(255, 234, 0, 0.8)', shadow: 'rgba(255, 234, 0, 0.4)' }, // Yellow
        { color: 'rgba(176, 38, 255, 0.8)', shadow: 'rgba(176, 38, 255, 0.4)' }, // Purple
        { color: 'rgba(0, 230, 118, 0.8)', shadow: 'rgba(0, 230, 118, 0.4)' }, // Green
        { color: 'rgba(41, 121, 255, 0.8)', shadow: 'rgba(41, 121, 255, 0.4)' }  // Blue
    ];
    
    document.querySelectorAll('.glass-card').forEach((card, index) => {
        const neon = neonColors[index % neonColors.length];
        card.style.setProperty('--glow-color', neon.color);
        card.style.setProperty('--glow-shadow', neon.shadow);
    });
})();

