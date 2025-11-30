import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { classNames } from "../../util/lang"

const Hero: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "hero-container")}>
      <h1 class="hero-title">Digital Garden</h1>
      <p class="hero-subtitle">
        A curated collection of thoughts, code, and explorations.
      </p>
    </div>
  )
}

Hero.css = `
.hero-container {
  text-align: center;
  padding: 4rem 1rem 2rem;
  margin-bottom: 2rem;
  /* Minimalist background - transparent or very subtle */
  background: transparent; 
}

.hero-title {
  font-family: var(--headerFont);
  font-size: 3rem;
  font-weight: 300; /* Lighter weight for elegance */
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-bottom: 0.5rem;
  color: var(--dark);
}

.hero-subtitle {
  font-family: var(--bodyFont);
  font-size: 1.1rem;
  line-height: 1.5;
  color: var(--gray);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
}

.hero-links {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-container {
    padding: 3rem 1rem 1.5rem;
  }
}
`

export default (() => Hero) satisfies QuartzComponentConstructor
