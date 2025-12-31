import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"

const Hero: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "hero-container")}>
      <div class="hero-content">
        <h1 class="hero-title">Digital Garden</h1>
        <p class="hero-subtitle">A curated collection of thoughts, code, and explorations.</p>
      </div>
    </div>
  )
}

Hero.css = `
.hero-container {
  position: relative;
  text-align: center;
  padding: 8rem 1rem 6rem;
  margin-bottom: 2rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Gradient Orbs */
.hero-container::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.15), transparent 70%);
  z-index: 0;
  filter: blur(80px);
  pointer-events: none;
}

.hero-container::after {
  content: "";
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, -20%);
  width: 800px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.1), transparent 70%);
  z-index: 0;
  filter: blur(100px);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
  animation: float 6s ease-in-out infinite;
}

.hero-title {
  font-family: var(--headerFont);
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  padding-bottom: 0.2rem; /* Prevent clipping of descenders/glow */
  
  /* Gradient Text */
  background: linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradientShift 5s ease infinite;
}

.hero-subtitle {
  font-family: var(--bodyFont);
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--gray);
  margin: 0 auto;
  max-width: 500px;
  font-weight: 400;
  opacity: 0.9;
}

/* Animations */
@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Dark mode adjustments if needed */
[saved-theme="dark"] .hero-container::before {
  background: radial-gradient(circle, rgba(124, 58, 237, 0.25), transparent 70%);
}

@media (max-width: 600px) {
  .hero-container {
    padding: 5rem 1rem 3rem;
  }
  
  .hero-title {
    font-size: 2.75rem;
    letter-spacing: -0.03em;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-container::before {
    width: 300px;
    height: 300px;
  }
}
`

export default (() => Hero) satisfies QuartzComponentConstructor
