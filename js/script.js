// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Custom Cursor Logic
    const cursor = document.getElementById("custom-cursor");
    
    // Only run if not on touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("mousemove", (e) => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });

        const links = document.querySelectorAll("a, button");
        links.forEach(link => {
            link.addEventListener("mouseenter", () => {
                if(link.classList.contains('btn')) {
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

    // 2. Navigation Scroll Effect
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
            document.querySelectorAll(".chart-fill").forEach(bar => {
                bar.style.height = bar.getAttribute("data-height");
                bar.style.transition = "height 1.5s cubic-bezier(0.16, 1, 0.3, 1)";
            });
        },
        once: true
    });

    // Fade up sections generally
    gsap.utils.toArray(".section").forEach(section => {
        if(section.id === "split-screen") return; // Skip custom animated section
        
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
});