import gsap from "gsap";

export const proloaderAnim = () => {
  const tl = gsap.timeline();
  
  tl.to(".text-container span", {
    duration: 1,
    y: 0,
    opacity: 1,
    stagger: 0.2,
    ease: "power3.out"
  })
  .to(".text-container span", {
    duration: 0.8,
    y: -50,
    opacity: 0,
    stagger: 0.1,
    ease: "power3.in"
  }, "+=0.5")
  .to(".Proloader", {
    duration: 1,
    y: "-100%",
    ease: "power3.inOut"
  }, "-=0.3");
};