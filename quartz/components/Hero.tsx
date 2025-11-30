import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const Hero: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "hero-container")}>
      <h1 class="hero-title">Welcome to the Digital Garden</h1>
      <p class="hero-subtitle">
        A curated collection of thoughts, code, and explorations in technology.
      </p>
      <div class="hero-actions">
        <a href="/Core-Concepts" class="hero-btn primary">Start Exploring</a>
        <a href="/graph" class="hero-btn secondary">View Graph</a>
      </div>
    </div>
  )
}

Hero.css = `
.hero-container {
  text-align: center;
  padding: 6rem 1rem 4rem;
  margin-bottom: 3rem;
  background: linear-gradient(180deg, var(--light) 0%, var(--highlight) 100%);
  border-radius: 12px;
  border: 1px solid var(--lightgray);
}

.hero-title {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(120deg, var(--secondary), var(--tertiary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.4rem;
  line-height: 1.6;
  color: var(--gray);
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -10px var(--secondary);
}

.hero-btn.primary {
  background-color: var(--secondary);
  color: var(--light);
}

.hero-btn.secondary {
  background-color: transparent;
  border: 2px solid var(--secondary);
  color: var(--secondary);
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-container {
    padding: 4rem 1rem 3rem;
  }
}
`

export default (() => Hero) satisfies QuartzComponentConstructor
