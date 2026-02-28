// Scroll reveal utility using IntersectionObserver
export function setupScrollReveal(selector = ".reveal", stagger = 0.08) {
  if (typeof window === "undefined") return;
  const elements = document.querySelectorAll(selector);
  let delay = 0;
  elements.forEach((el) => {
    (el as HTMLElement).style.opacity = "0";
    (el as HTMLElement).style.transform = "translateY(32px)";
  });
  const observer = new window.IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).style.transition = `opacity 0.7s cubic-bezier(.4,2,.6,1) ${delay}s, transform 0.7s cubic-bezier(.4,2,.6,1) ${delay}s`;
        (entry.target as HTMLElement).style.opacity = "1";
        (entry.target as HTMLElement).style.transform = "translateY(0)";
        delay += stagger;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  elements.forEach((el) => observer.observe(el));
}
