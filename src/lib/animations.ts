/**
 * Premium Animation Utilities
 * Scroll-based animations, sequence animations, and more
 */

// Intersection Observer for scroll reveal animations
export const setupScrollAnimations = () => {
  if (typeof window === "undefined") return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    observer.observe(element);
  });

  return observer;
};

// Staggered animation sequence
export const staggerChildren = (
  container: HTMLElement | null,
  delay: number = 0.1
) => {
  if (!container) return;

  const children = container.querySelectorAll("[data-stagger]");
  children.forEach((child, index) => {
    const element = child as HTMLElement;
    element.style.animationDelay = `${index * delay}s`;
  });
};

// Counter animation for stats
export const animateCounter = (
  target: number,
  duration: number = 2000,
  callback?: (value: number) => void
) => {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    callback?.(Math.floor(current));
  }, 16);

  return timer;
};

// Parallax effect
export const setupParallax = () => {
  const elements = document.querySelectorAll("[data-parallax]");

  const handleScroll = () => {
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const speed = parseFloat(
        (element as HTMLElement).dataset.parallax || "0.5"
      );
      const yOffset = window.scrollY;
      const elementOffset = yOffset + rect.top;

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        (element as HTMLElement).style.transform = `translateY(${
          (yOffset - elementOffset) * speed
        }px)`;
      }
    });
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
};

// Blur on scroll effect
export const setupBlurOnScroll = () => {
  const navbar = document.querySelector(".navbar-blur-on-scroll");

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar?.classList.add("scrolling");
    } else {
      navbar?.classList.remove("scrolling");
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
};

// 3D tilt effect for cards
export const setup3DTilt = (cards: NodeListOf<Element>) => {
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = (card as HTMLElement).getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = (e as MouseEvent).clientX - centerX;
      const mouseY = (e as MouseEvent).clientY - centerY;

      const rotateX = -(mouseY / rect.height) * 10;
      const rotateY = (mouseX / rect.width) * 10;

      (card as HTMLElement).style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      (card as HTMLElement).style.transition = "transform 0.1s";
    });

    card.addEventListener("mouseleave", () => {
      (card as HTMLElement).style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
      (card as HTMLElement).style.transition = "transform 0.3s ease-out";
    });
  });
};

// Ripple effect on click
export const setupRippleEffect = () => {
  document.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest(
      "[data-ripple]"
    ) as HTMLElement;
    if (!target) return;

    const ripple = document.createElement("span");
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = (e as MouseEvent).clientX - rect.left - size / 2;
    const y = (e as MouseEvent).clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple");

    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
};

// Sticky header animation with gradient background reveal
export const setupStickyHeader = () => {
  const header = document.querySelector(".sticky-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
};

// Initialize all animations (call this in effect)
export const initializeAnimations = () => {
  setupScrollAnimations();
  setupParallax();
  setupBlurOnScroll();
  setup3DTilt(document.querySelectorAll("[data-tilt-3d]"));
  setupRippleEffect();
  setupStickyHeader();
};
