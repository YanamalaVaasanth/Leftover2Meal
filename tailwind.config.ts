import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
      extend: {
        boxShadow: {
          'emerald-glow': '0 0 20px rgba(16, 185, 129, 0.4)',
          'amber-glow': '0 0 20px rgba(245, 158, 11, 0.4)',
          'liquid-glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
        backgroundImage: {
          'mesh-gradient': "radial-gradient(at 0% 0%, rgba(16, 185, 129, 0.15) 0px, transparent 50%)",
          'mesh-gradient-amber': "radial-gradient(at 0% 0%, rgba(245, 158, 11, 0.12) 0px, transparent 50%)",
        },
        colors: {
          ...{
            emerald: {
              DEFAULT: '#10B981',
              glow: 'rgba(16,185,129,0.4)',
            },
            amber: {
              DEFAULT: '#F59E0B',
              glow: 'rgba(245,158,11,0.4)',
            },
            dark: {
              DEFAULT: '#0F172A',
            },
          },
        },
        borderColor: {
          glass: 'rgba(255,255,255,0.10)',
        },
        spacing: {
          'spacing-xs': '4px',
          'spacing-sm': '8px',
          'spacing-md': '16px',
          'spacing-lg': '24px',
          'spacing-xl': '32px',
        },
        fontFamily: {
          poppins: ['Poppins', 'sans-serif'],
          inter: ['Inter', 'sans-serif'],
        },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow: "hsl(var(--secondary-glow))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "spacing-xs": "4px",
        "spacing-sm": "8px",
        "spacing-md": "16px",
        "spacing-lg": "24px",
        "spacing-xl": "32px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        "card-hover": "var(--shadow-card-hover)",
        glow: "0 0 20px rgba(132, 204, 22, 0.3)",
        "glow-sm": "0 0 12px rgba(132, 204, 22, 0.2)",
      },
      backdropBlur: {
        glass: "12px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "slide-in-right": {
          "0%": {
            transform: "translateX(20px)",
            opacity: "0"
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1"
          }
        },
        "slide-in-left": {
          "0%": {
            transform: "translateX(-20px)",
            opacity: "0"
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1"
          }
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)"
          },
          "50%": {
            transform: "translateY(-10px)"
          }
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)"
          },
          "50%": {
            transform: "translateY(-20px)"
          }
        },
        "glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 5px rgba(132, 204, 22, 0.5)"
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 20px rgba(132, 204, 22, 0.8)"
          }
        },
        "pulse-slow": {
          "0%, 100%": {
            opacity: "1"
          },
          "50%": {
            opacity: "0.7"
          }
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-1000px 0"
          },
          "100%": {
            backgroundPosition: "1000px 0"
          }
        },
        "gradient-shift": {
          "0%": {
            backgroundPosition: "0% 50%"
          },
          "50%": {
            backgroundPosition: "100% 50%"
          },
          "100%": {
            backgroundPosition: "0% 50%"
          }
        },
        "spin-slow": {
          "0%": {
            transform: "rotate(0deg)"
          },
          "100%": {
            transform: "rotate(360deg)"
          }
        },
        "tilt": {
          "0%, 100%": {
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)"
          },
          "50%": {
            transform: "perspective(1000px) rotateX(5deg) rotateY(5deg)"
          }
        },
        "pop": {
          "0%": {
            transform: "scale(0.9)",
            opacity: "0"
          },
          "50%": {
            transform: "scale(1.05)"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.4s ease-out",
        "slide-in-left": "slide-in-left 0.4s ease-out",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "gradient-shift": "gradient-shift 3s ease infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "tilt": "tilt 3s ease-in-out infinite",
        "pop": "pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
