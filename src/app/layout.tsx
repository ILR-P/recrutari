import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

// latin-ext acoperă diacriticele românești (ă, â, î, ș, ț).
const display = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin", "latin-ext"] });
const sans = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: {
    default: "Ce tip de BESTan ești? · BEST Cluj-Napoca",
    template: "%s · BEST Cluj-Napoca",
  },
  description:
    "Descoperă BEST Cluj-Napoca și află ce tip de BESTan ești: organizator, călător, petrecăreț sau designer. Quiz interactiv cu mini-jocuri.",
  applicationName: "BEST Quiz",
  appleWebApp: { capable: true, title: "BEST Quiz", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0c0618",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ro"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-svh">
        <MotionProvider>
          <AnimatedBackground />
          <Navbar />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
