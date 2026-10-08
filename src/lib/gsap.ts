import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // A barra de endereço do mobile redimensiona a viewport durante o scroll; sem isso os pins "pulam".
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };