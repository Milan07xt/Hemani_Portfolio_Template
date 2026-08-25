// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

    // 1. Custom Cursor & Spotlight Logic
    const cursor = document.getElementById("custom-cursor");
    const spotlight = document.getElementById("cursor-spotlight");

    // Only run if not on touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
            
            if (spotlight) {
                // Use a slightly delayed animation for the spotlight
                spotlight.animate({
                    left: `${e.clientX}px`,
                    top: `${e.clientY}px`
                }, { duration: 500, fill: "forwards" });
            }
        });

        // Interactive Card Lighting
        const interactiveCards = document.querySelectorAll(".workflow-card, .gallery-item, .persona-card, .lab-item");
        interactiveCards.forEach(card => {
            card.addEventListener("mousemove", e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            });
        });

        const links = document.querySelectorAll("a, button");
        links.forEach(link => {
            link.addEventListener("mouseenter", () => {
                if (link.classList.contains('btn')) {
                    cursor.classList.add("hover-cta");
                } else {
                    cursor.classList.add("hover-link");
                }
            });
            link.addEventListener("mouseleave", () => {
                cursor.classList.remove("hover-link", "hover-cta");
            });
        });

        // Add hover for project cards if they existed in HTML with specific classes
        const projects = document.querySelectorAll(".cs-image, .gallery-item");
        projects.forEach(proj => {
            proj.addEventListener("mouseenter", () => cursor.classList.add("hover-project"));
            proj.addEventListener("mouseleave", () => cursor.classList.remove("hover-project"));
        });
    }

    // 2. Theme Toggle Logic
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        const currentTheme = localStorage.getItem("theme");
        if (currentTheme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
            themeToggle.innerHTML = "☾";
        } else {
            themeToggle.innerHTML = "☀";
        }

        themeToggle.addEventListener("click", () => {
            const isLight = document.documentElement.getAttribute("data-theme") === "light";
            if (isLight) {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("theme", "dark");
                themeToggle.innerHTML = "☀";
            } else {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("theme", "light");
                themeToggle.innerHTML = "☾";
            }
        });
    }

    // 3. Navigation Scroll Effect
    const nav = document.getElementById("nav");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });

    // 3. GSAP Animations Registration
    gsap.registerPlugin(ScrollTrigger);

    // Initial Hero Animation Timeline
    const tlHero = gsap.timeline();
    tlHero.from(".hero-availability", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 })
        .from(".hero-title", { y: 40, opacity: 0, duration: 1, ease: "power3.out" }, "-=0.5")
        .from(".hero .label", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(".hero-desc", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(".hero .btn", { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.6")
        .from(".workflow-card", { x: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.7)" }, "-=1");

    // Split Screen Animation (DESIGN x DEVELOPMENT)
    const splitTl = gsap.timeline({
        scrollTrigger: {
            trigger: "#split-screen",
            start: "top center",
            end: "bottom center",
            scrub: 1
        }
    });

    splitTl.from(".split-design .split-list li", { x: -50, opacity: 0, stagger: 0.1 })
        .from("#split-x", { scale: 0, opacity: 0, rotation: -90, duration: 0.5 }, "-=0.5")
        .from(".split-dev .split-list li", { x: 50, opacity: 0, stagger: 0.1 }, "-=0.2");

    // Image Reveal Animations
    gsap.utils.toArray(".reveal-img").forEach(container => {
        gsap.from(container.querySelector("img"), {
            scrollTrigger: {
                trigger: container,
                start: "top 80%"
            },
            scale: 1.2,
            duration: 1.5,
            ease: "power3.out"
        });
    });

    // Academic Chart Animation
    ScrollTrigger.create({
        trigger: "#chart",
        start: "top 80%",
        onEnter: () => {
            gsap.utils.toArray(".chart-fill").forEach(bar => {
                gsap.to(bar, {
                    height: bar.getAttribute("data-height"),
                    duration: 1.5,
                    ease: "power3.out"
                });
            });
        },
        once: true
    });

    // Fade up sections generally
    gsap.utils.toArray(".section").forEach(section => {
        if (section.id === "split-screen") return; // Skip custom animated section

        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // ============================================================
    // 5. INTERACTIVE CANVAS POSTER STUDIO ENGINE
    // ============================================================
    const canvas = document.getElementById("interactive-poster-canvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        const viewport = document.getElementById("canvas-viewport");
        
        let width = 600;
        let height = 800;
        let dpr = window.devicePixelRatio || 1;
        
        let currentMode = "fluid";
        let currentTheme = "violet";
        let speed = 1.0;
        let densityLevel = 2; // 1: Low, 2: Med, 3: High
        let seed = Math.random() * 1000;
        let time = 0;
        let isRunning = false;
        let animFrameId = null;
        
        const themes = {
            violet: {
                bg: "#07070F",
                c1: "#7C6AFF",
                c2: "#FF6AC1",
                c3: "#00D4FF",
                accent: "#A78BFA",
                glow: "rgba(124, 106, 255, 0.45)"
            },
            cyan: {
                bg: "#050C16",
                c1: "#00D4FF",
                c2: "#00E5CC",
                c3: "#3B82F6",
                accent: "#38BDF8",
                glow: "rgba(0, 212, 255, 0.45)"
            },
            amber: {
                bg: "#100805",
                c1: "#FF9E00",
                c2: "#FF1493",
                c3: "#FFD700",
                accent: "#FB923C",
                glow: "rgba(255, 158, 0, 0.45)"
            },
            emerald: {
                bg: "#041209",
                c1: "#00FF88",
                c2: "#00E5CC",
                c3: "#39FF14",
                accent: "#34D399",
                glow: "rgba(0, 255, 136, 0.45)"
            }
        };

        const modeInfo = {
            fluid: {
                title: "NEON SYNTHESIS",
                sub: "ALGORITHMIC FLUIDITY & CHROMATIC CURVES",
                freq: "1.42 GHZ",
                nodes: "120 NODES"
            },
            matrix: {
                title: "CYBER MATRIX",
                sub: "3D ISOMETRIC MESH & WIREFRAME DEPTH",
                freq: "2.88 GHZ",
                nodes: "256 NODES"
            },
            kinetic: {
                title: "KINETIC TYPO",
                sub: "WAVE DISPLACEMENT & SWISS AVANT-GARDE",
                freq: "3.14 GHZ",
                nodes: "64 SLICES"
            },
            aurora: {
                title: "AURORA MESH",
                sub: "CONSTELLATION SPRINGS & PARTICLE NODES",
                freq: "0.95 GHZ",
                nodes: "160 NODES"
            }
        };

        const mouse = {
            x: width / 2,
            y: height / 2,
            targetX: width / 2,
            targetY: height / 2,
            isHovered: false,
            isDown: false,
            clickRipples: []
        };

        // Resize Canvas with High DPI scaling
        function resizeCanvas() {
            if (!viewport) return;
            const rect = viewport.getBoundingClientRect();
            width = rect.width || 500;
            height = rect.height || 667;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.scale(dpr, dpr);
            
            initParticles();
        }

        // Mouse & Touch Listeners
        viewport.addEventListener("mousemove", (e) => {
            const rect = viewport.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
            mouse.isHovered = true;
        });

        viewport.addEventListener("mouseleave", () => {
            mouse.isHovered = false;
            mouse.targetX = width / 2;
            mouse.targetY = height / 2;
        });

        viewport.addEventListener("mousedown", (e) => {
            mouse.isDown = true;
            const rect = viewport.getBoundingClientRect();
            mouse.clickRipples.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                radius: 5,
                maxRadius: Math.max(width, height) * 0.75,
                alpha: 1
            });
        });

        window.addEventListener("mouseup", () => {
            mouse.isDown = false;
        });

        // Touch support
        viewport.addEventListener("touchmove", (e) => {
            if (e.touches.length > 0) {
                const rect = viewport.getBoundingClientRect();
                mouse.targetX = e.touches[0].clientX - rect.left;
                mouse.targetY = e.touches[0].clientY - rect.top;
                mouse.isHovered = true;
            }
        }, { passive: true });

        // Particles collection for Aurora / Fluid
        let particles = [];
        function initParticles() {
            particles = [];
            const count = densityLevel === 1 ? 40 : densityLevel === 2 ? 80 : 140;
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    radius: Math.random() * 3 + 1.5,
                    baseRadius: Math.random() * 3 + 1.5,
                    phase: Math.random() * Math.PI * 2,
                    colorOffset: Math.random()
                });
            }
        }

        // Draw Fluid Mode
        function drawFluid(theme, t) {
            // Draw gradient background
            const bgGrad = ctx.createLinearGradient(0, 0, width, height);
            bgGrad.addColorStop(0, theme.bg);
            bgGrad.addColorStop(1, "#030307");
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Draw subtle geometric grid
            ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Layered Sine Plasma Waves with chromatic glow
            const waveLayers = [
                { color: theme.c1, amp: 55, freq: 0.008, speed: 0.02, offset: 0 },
                { color: theme.c2, amp: 45, freq: 0.012, speed: 0.028, offset: 1.5 },
                { color: theme.c3, amp: 65, freq: 0.006, speed: 0.018, offset: 3.0 }
            ];

            ctx.save();
            ctx.globalCompositeOperation = "screen";

            waveLayers.forEach((layer) => {
                ctx.beginPath();
                ctx.strokeStyle = layer.color;
                ctx.lineWidth = 3.5;
                ctx.shadowColor = layer.color;
                ctx.shadowBlur = 25;

                for (let x = 0; x <= width; x += 4) {
                    const mouseDist = Math.hypot(x - mouse.x, height / 2 - mouse.y);
                    const mouseWarp = Math.sin(mouseDist * 0.03 - t * 2) * Math.max(0, 80 - mouseDist * 0.2);
                    const y = height * 0.5 +
                        Math.sin(x * layer.freq + t * layer.speed * 60 + layer.offset + seed) * layer.amp +
                        Math.cos(x * layer.freq * 0.5 + t * 0.015) * 30 +
                        mouseWarp;
                    
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            // Glowing orbiting chromatic orbs
            const orbCount = densityLevel === 1 ? 4 : densityLevel === 2 ? 7 : 12;
            for (let i = 0; i < orbCount; i++) {
                const angle = t * 0.8 + (i * Math.PI * 2) / orbCount + seed;
                const distRadius = Math.min(width, height) * 0.28 + Math.sin(t * 1.2 + i) * 30;
                
                const orbCenterX = width / 2 + Math.cos(angle) * distRadius;
                const orbCenterY = height / 2 + Math.sin(angle * 1.3) * (distRadius * 0.75);

                // Gravitational pull toward mouse
                const dx = mouse.x - orbCenterX;
                const dy = mouse.y - orbCenterY;
                const d = Math.hypot(dx, dy);
                const pull = mouse.isHovered ? Math.max(0, (200 - d) / 200) * 45 : 0;
                
                const ox = orbCenterX + (d > 0 ? (dx / d) * pull : 0);
                const oy = orbCenterY + (d > 0 ? (dy / d) * pull : 0);
                const orbSize = 25 + Math.sin(t * 2 + i) * 10;

                const orbGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orbSize * 2.5);
                const col = i % 3 === 0 ? theme.c1 : i % 3 === 1 ? theme.c2 : theme.c3;
                orbGrad.addColorStop(0, col);
                orbGrad.addColorStop(0.5, `rgba(${hexToRgb(col)}, 0.4)`);
                orbGrad.addColorStop(1, "transparent");

                ctx.fillStyle = orbGrad;
                ctx.beginPath();
                ctx.arc(ox, oy, orbSize * 2.5, 0, Math.PI * 2);
                ctx.fill();

                // Inner core
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(ox, oy, orbSize * 0.2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }

        // Draw Matrix Mode
        function drawMatrix(theme, t) {
            ctx.fillStyle = theme.bg;
            ctx.fillRect(0, 0, width, height);

            const horizon = height * 0.38;
            const fov = 250;
            const tiltX = (mouse.x - width / 2) * 0.15;
            const tiltY = (mouse.y - height / 2) * 0.1;

            ctx.save();
            // Perspective ground grid
            ctx.strokeStyle = theme.c1;
            ctx.lineWidth = 1.2;
            ctx.shadowColor = theme.c1;
            ctx.shadowBlur = 12;

            const gridLines = densityLevel === 1 ? 12 : densityLevel === 2 ? 20 : 30;
            const offsetZ = (t * 40 * speed) % 50;

            for (let z = 50; z < 600; z += 40) {
                const currentZ = z - offsetZ;
                if (currentZ <= 10) continue;
                const scale = fov / (fov + currentZ);
                const y = horizon + (height - horizon) * scale + tiltY * (1 - scale);
                const alpha = Math.max(0, 1 - currentZ / 550);
                
                ctx.strokeStyle = `rgba(${hexToRgb(theme.c1)}, ${alpha * 0.7})`;
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Radial perspective rays
            for (let i = -gridLines; i <= gridLines; i++) {
                const xGround = width / 2 + i * 45 + tiltX;
                const alpha = Math.max(0.1, 1 - Math.abs(i) / gridLines);
                ctx.strokeStyle = `rgba(${hexToRgb(theme.c2)}, ${alpha * 0.6})`;
                ctx.beginPath();
                ctx.moveTo(width / 2 + tiltX * 0.5, horizon);
                ctx.lineTo(xGround, height);
                ctx.stroke();
            }

            // Rotating 3D Wireframe Polyhedron in the center
            const cubeSize = 75;
            const cx = width / 2 + (mouse.x - width / 2) * 0.1;
            const cy = horizon - 50 + Math.sin(t * 1.5) * 15;
            const rot = t * 0.8 + seed;

            const vertices = [
                [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
                [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
            ];

            const edges = [
                [0, 1], [1, 2], [2, 3], [3, 0],
                [4, 5], [5, 6], [6, 7], [7, 4],
                [0, 4], [1, 5], [2, 6], [3, 7]
            ];

            const projVerts = vertices.map(([vx, vy, vz]) => {
                // Rotate Y
                let x1 = vx * Math.cos(rot) - vz * Math.sin(rot);
                let z1 = vx * Math.sin(rot) + vz * Math.cos(rot);
                // Rotate X
                let y2 = vy * Math.cos(rot * 0.7) - z1 * Math.sin(rot * 0.7);
                let z2 = vy * Math.sin(rot * 0.7) + z1 * Math.cos(rot * 0.7);
                
                const factor = 180 / (220 + z2 * cubeSize * 0.5);
                return {
                    x: cx + x1 * cubeSize * factor,
                    y: cy + y2 * cubeSize * factor
                };
            });

            ctx.strokeStyle = theme.c3;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = theme.c3;
            ctx.shadowBlur = 20;

            edges.forEach(([p1, p2]) => {
                ctx.beginPath();
                ctx.moveTo(projVerts[p1].x, projVerts[p1].y);
                ctx.lineTo(projVerts[p2].x, projVerts[p2].y);
                ctx.stroke();
            });

            // Glowing nodes
            projVerts.forEach((v) => {
                ctx.fillStyle = "#FFFFFF";
                ctx.beginPath();
                ctx.arc(v.x, v.y, 4, 0, Math.PI * 2);
                ctx.fill();
            });

            // Sweeping radar scan line
            const scanY = (t * 90 * speed) % height;
            ctx.strokeStyle = `rgba(${hexToRgb(theme.c1)}, 0.4)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, scanY);
            ctx.lineTo(width, scanY);
            ctx.stroke();

            ctx.restore();
        }

        // Draw Kinetic Typo Mode
        function drawKinetic(theme, t) {
            ctx.fillStyle = theme.bg;
            ctx.fillRect(0, 0, width, height);

            ctx.save();
            
            // Dynamic kinetic text slabs
            const words = ["HEMANI", "DESIGN", "CODE", "FUTURES", "2026"];
            const slabHeight = height / (words.length + 1);

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = `900 ${Math.floor(width * 0.17)}px 'Syne', sans-serif`;

            words.forEach((word, index) => {
                const yBase = slabHeight * (index + 1);
                const sliceCount = densityLevel === 1 ? 8 : densityLevel === 2 ? 14 : 22;
                const wordHeight = 70;

                for (let s = 0; s < sliceCount; s++) {
                    const sliceY = yBase - wordHeight / 2 + (s * wordHeight) / sliceCount;
                    const sliceH = wordHeight / sliceCount + 1;
                    
                    const distToMouse = Math.abs(sliceY - mouse.y);
                    const mouseDisplace = mouse.isHovered ? Math.sin((sliceY - mouse.y) * 0.05) * Math.max(0, (150 - distToMouse) * 0.4) : 0;
                    const waveDisplace = Math.sin(t * 3 * speed + index * 1.5 + s * 0.4) * 25;
                    const finalX = width / 2 + waveDisplace + mouseDisplace;

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(0, sliceY, width, sliceH);
                    ctx.clip();

                    // Chromatic offset
                    if (s % 2 === 0) {
                        ctx.fillStyle = theme.c1;
                        ctx.fillText(word, finalX - 3, yBase);
                        ctx.fillStyle = theme.c2;
                        ctx.fillText(word, finalX + 3, yBase);
                    }
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillText(word, finalX, yBase);
                    ctx.restore();
                }
            });

            // Swiss geometric accents (circles & crosses)
            ctx.strokeStyle = theme.c3;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(width * 0.85, height * 0.18, 35, 0, Math.PI * 2);
            ctx.stroke();

            // Diagonal hazard lines in a corner
            ctx.strokeStyle = `rgba(${hexToRgb(theme.c1)}, 0.3)`;
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.moveTo(20 + i * 10, height - 60);
                ctx.lineTo(50 + i * 10, height - 20);
                ctx.stroke();
            }

            ctx.restore();
        }

        // Draw Aurora Mesh Mode
        function drawAurora(theme, t) {
            ctx.fillStyle = theme.bg;
            ctx.fillRect(0, 0, width, height);

            ctx.save();
            ctx.globalCompositeOperation = "screen";

            // Update and draw particles
            const connectDist = densityLevel === 1 ? 110 : densityLevel === 2 ? 85 : 65;

            particles.forEach((p, i) => {
                // Update position
                p.x += p.vx * speed;
                p.y += p.vy * speed;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse interaction (repel & attract)
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.hypot(dx, dy);
                if (mouse.isHovered && dist < 120) {
                    const force = (120 - dist) / 120;
                    p.x -= (dx / dist) * force * 4;
                    p.y -= (dy / dist) * force * 4;
                }

                // Draw connecting lines
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const pDist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (pDist < connectDist) {
                        const alpha = (1 - pDist / connectDist) * 0.6;
                        ctx.strokeStyle = `rgba(${hexToRgb(p.colorOffset > 0.5 ? theme.c1 : theme.c2)}, ${alpha})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Draw Particle Node
                const col = p.colorOffset > 0.66 ? theme.c1 : p.colorOffset > 0.33 ? theme.c2 : theme.c3;
                ctx.fillStyle = col;
                ctx.shadowColor = col;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius + Math.sin(t * 3 + p.phase) * 1, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.restore();
        }

        // Draw Mouse Click Ripples
        function drawRipples(theme) {
            for (let i = mouse.clickRipples.length - 1; i >= 0; i--) {
                const r = mouse.clickRipples[i];
                r.radius += 10 * speed;
                r.alpha -= 0.025;

                if (r.alpha <= 0 || r.radius >= r.maxRadius) {
                    mouse.clickRipples.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.strokeStyle = `rgba(${hexToRgb(theme.c1)}, ${r.alpha})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }
        }

        // Main Render Loop
        function render() {
            if (!isRunning) return;

            // Smooth mouse interpolation
            mouse.x += (mouse.targetX - mouse.x) * 0.1;
            mouse.y += (mouse.targetY - mouse.y) * 0.1;

            time += 0.016 * speed;
            const theme = themes[currentTheme] || themes.violet;

            ctx.clearRect(0, 0, width, height);

            if (currentMode === "fluid") {
                drawFluid(theme, time);
            } else if (currentMode === "matrix") {
                drawMatrix(theme, time);
            } else if (currentMode === "kinetic") {
                drawKinetic(theme, time);
            } else if (currentMode === "aurora") {
                drawAurora(theme, time);
            }

            drawRipples(theme);

            animFrameId = requestAnimationFrame(render);
        }

        // Helper hex to rgb
        function hexToRgb(hex) {
            hex = hex.replace("#", "");
            if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
            const num = parseInt(hex, 16);
            return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
        }

        // Update HUD Elements
        function updateHud() {
            const info = modeInfo[currentMode] || modeInfo.fluid;
            const titleEl = document.getElementById("hud-poster-title");
            const subEl = document.getElementById("hud-poster-sub");
            const freqEl = document.getElementById("hud-freq-val");
            const countEl = document.getElementById("hud-count-val");

            if (titleEl) titleEl.textContent = info.title;
            if (subEl) subEl.textContent = info.sub;
            if (freqEl) freqEl.textContent = info.freq;
            if (countEl) countEl.textContent = densityLevel === 1 ? "40 NODES" : densityLevel === 2 ? info.nodes : "240 NODES";
        }

        // Mode Switching
        const modeButtons = document.querySelectorAll(".mode-btn");
        modeButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                modeButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentMode = btn.getAttribute("data-mode");
                updateHud();
            });
        });

        // Theme Switching
        const paletteButtons = document.querySelectorAll(".palette-btn");
        paletteButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                paletteButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentTheme = btn.getAttribute("data-theme");
            });
        });

        // Sliders
        const speedSlider = document.getElementById("speed-slider");
        const speedDisplay = document.getElementById("speed-display");
        if (speedSlider && speedDisplay) {
            speedSlider.addEventListener("input", (e) => {
                speed = parseFloat(e.target.value);
                speedDisplay.textContent = `${speed.toFixed(1)}x`;
            });
        }

        const densitySlider = document.getElementById("density-slider");
        const densityDisplay = document.getElementById("density-display");
        if (densitySlider && densityDisplay) {
            densitySlider.addEventListener("input", (e) => {
                densityLevel = parseInt(e.target.value, 10);
                densityDisplay.textContent = densityLevel === 1 ? "Low" : densityLevel === 2 ? "Medium" : "High";
                initParticles();
                updateHud();
            });
        }

        // Randomize Seed Button
        const randBtn = document.getElementById("btn-randomize-poster");
        if (randBtn) {
            randBtn.addEventListener("click", () => {
                seed = Math.random() * 10000;
                initParticles();
                mouse.clickRipples.push({
                    x: width / 2,
                    y: height / 2,
                    radius: 10,
                    maxRadius: Math.max(width, height),
                    alpha: 1
                });
            });
        }

        // Download High-Res Canvas Poster (PNG) with Swiss Typography
        const downloadBtn = document.getElementById("btn-download-poster");
        if (downloadBtn) {
            downloadBtn.addEventListener("click", () => {
                // High-resolution export canvas (1800 x 2400)
                const exportCanvas = document.createElement("canvas");
                const exW = 1800;
                const exH = 2400;
                exportCanvas.width = exW;
                exportCanvas.height = exH;
                const exCtx = exportCanvas.getContext("2d");

                const theme = themes[currentTheme] || themes.violet;
                const info = modeInfo[currentMode] || modeInfo.fluid;

                // 1. Draw outer Swiss Poster Border & Background
                exCtx.fillStyle = theme.bg;
                exCtx.fillRect(0, 0, exW, exH);

                // 2. Render Art into central frame
                const margin = 100;
                const artW = exW - margin * 2;
                const artH = exH - margin * 2 - 200;
                const artY = margin + 120;

                // Scale and draw current canvas snapshot onto export canvas
                exCtx.save();
                exCtx.beginPath();
                exCtx.rect(margin, artY, artW, artH);
                exCtx.clip();
                exCtx.drawImage(canvas, margin, artY, artW, artH);
                exCtx.restore();

                // 3. Swiss Typography Header
                exCtx.fillStyle = "#FFFFFF";
                exCtx.font = "bold 32px 'Space Mono', monospace";
                exCtx.fillText("HEMANI VANVI // VISUAL SYNTHESIS LAB", margin, margin + 40);

                exCtx.font = "24px 'Space Mono', monospace";
                exCtx.fillStyle = theme.c1;
                exCtx.fillText("EDITION 2026 // POSTER NO. 08", exW - margin - 480, margin + 40);

                exCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
                exCtx.lineWidth = 3;
                exCtx.beginPath();
                exCtx.moveTo(margin, margin + 70);
                exCtx.lineTo(exW - margin, margin + 70);
                exCtx.stroke();

                // 4. Swiss Typography Footer & Metadata
                const footerY = exH - margin;
                exCtx.font = "900 80px 'Syne', sans-serif";
                exCtx.fillStyle = "#FFFFFF";
                exCtx.fillText(info.title, margin, footerY - 80);

                exCtx.font = "28px 'Space Mono', monospace";
                exCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
                exCtx.fillText(info.sub, margin, footerY - 35);

                exCtx.font = "22px 'Space Mono', monospace";
                exCtx.fillStyle = theme.c2;
                exCtx.fillText("HTML5 GENERATIVE CANVASES // ALGORITHMIC CODE & FORM", margin, footerY + 10);

                // Barcode on bottom right
                exCtx.fillStyle = "#FFFFFF";
                exCtx.fillRect(exW - margin - 220, footerY - 70, 220, 40);
                exCtx.font = "bold 20px 'Space Mono', monospace";
                exCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
                exCtx.fillText("VANVI.DESIGN // 2026", exW - margin - 220, footerY);

                // 5. Outer Frame Border
                exCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
                exCtx.lineWidth = 6;
                exCtx.strokeRect(margin / 2, margin / 2, exW - margin, exH - margin);

                // Convert to download link
                const dataUrl = exportCanvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.download = `hemani-canvas-poster-${currentMode}-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            });
        }

        // Intersection Observer to run animation only when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!isRunning) {
                        isRunning = true;
                        resizeCanvas();
                        render();
                    }
                } else {
                    isRunning = false;
                    if (animFrameId) cancelAnimationFrame(animFrameId);
                }
            });
        }, { threshold: 0.1 });

        observer.observe(viewport);
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        updateHud();
    }

    // ============================================================
    // 6. POSTER LIGHTBOX MODAL LOGIC
    // ============================================================
    const posterModal = document.getElementById("poster-lightbox-modal");
    const modalCloseBtn = document.getElementById("poster-modal-close");
    const modalImg = document.getElementById("modal-poster-img");
    const modalTitle = document.getElementById("modal-poster-title");
    const modalCat = document.getElementById("modal-poster-cat");
    const modalDesc = document.getElementById("modal-poster-desc");
    const modalDownload = document.getElementById("modal-download-link");

    if (posterModal) {
        // Open Modal when clicking a poster card
        const posterCards = document.querySelectorAll(".poster-card");
        posterCards.forEach(card => {
            card.addEventListener("click", () => {
                const src = card.getAttribute("data-src");
                const title = card.getAttribute("data-title");
                const cat = card.getAttribute("data-category");
                const desc = card.getAttribute("data-desc");

                if (modalImg) modalImg.src = src;
                if (modalTitle) modalTitle.textContent = title;
                if (modalCat) modalCat.textContent = cat;
                if (modalDesc) modalDesc.textContent = desc;
                if (modalDownload) {
                    modalDownload.href = src;
                    modalDownload.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '-')}-poster.jpg`);
                }

                posterModal.classList.add("active");
                posterModal.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden";
            });
        });

        // Close Modal
        function closeModal() {
            posterModal.classList.remove("active");
            posterModal.setAttribute("aria-hidden", "true");
            document.body.style.overflow = "";
        }

        if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);

        const backdrop = posterModal.querySelector(".poster-modal-backdrop");
        if (backdrop) backdrop.addEventListener("click", closeModal);

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && posterModal.classList.contains("active")) {
                closeModal();
            }
        });
    }
});

