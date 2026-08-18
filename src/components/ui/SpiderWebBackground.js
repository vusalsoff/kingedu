"use client";

import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from "next-themes";

const particlesInit = async (engine) => {
  await loadSlim(engine);
};

export default function SpiderWebBackground() {
  const { resolvedTheme } = useTheme();

  const color = resolvedTheme === "dark" ? "#FF6B00" : "#FF6B00";
  const lineColor = resolvedTheme === "dark" ? "#FF6B00" : "#FF6B00";
  const opacity = resolvedTheme === "dark" ? 0.3 : 0.5;

  return (
    <ParticlesProvider init={particlesInit}>
      <Particles
        id="tsparticles"
        options={{
          background: {
            color: {
              value: "transparent",
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "grab", // creates the spider web grab effect
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 150,
                links: {
                  opacity: 0.5,
                },
              },
            },
          },
          particles: {
            color: {
              value: color,
            },
            links: {
              color: lineColor,
              distance: 150,
              enable: true,
              opacity: opacity,
              width: resolvedTheme === "dark" ? 1 : 2.5,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 60,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0, // Ensure it sits behind content
          pointerEvents: "none",
        }}
      />
    </ParticlesProvider>
  );
}
