import type { MetadataRoute } from "next";

// Permite „Add to Home Screen” pe tabletele de la stand, cu afișare pe tot ecranul.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BEST Cluj-Napoca · Ce tip de BESTan ești?",
    short_name: "BEST Quiz",
    description: "Quiz interactiv de recrutare BEST Cluj-Napoca",
    start_url: "/",
    display: "fullscreen",
    orientation: "any",
    background_color: "#0c0618",
    theme_color: "#0c0618",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
