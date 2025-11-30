import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const Header: QuartzComponent = ({ children }: QuartzComponentProps) => {
  return children.length > 0 ? <header>{children}</header> : null
}

Header.css = `
header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem 0;
  gap: 1.5rem;
  flex-wrap: wrap; /* Allow wrapping for multi-row layout */
}

header h1 {
  margin: 0;
  flex: auto;
}

/* Force search to take full width on a new line if it's the last item */
header .search {
  flex-basis: 100%;
  order: 10; /* Ensure it comes last visually if needed, though DOM order usually suffices */
  margin-top: 0.5rem;
  width: 100%;
  max-width: none;
}
`

export default (() => Header) satisfies QuartzComponentConstructor
