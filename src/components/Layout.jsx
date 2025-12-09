import { Fragment } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import '../styles/default.css'

const primaryLinks = [
  { label: 'Home', to: '/', end: true },
  { label: 'Introduction', to: '/introduction' },
  { label: 'Contract', to: '/contract' },
  { label: 'Students', to: '/students' },
  { label: 'Introductions Viewer', to: '/introductions-viewer' },
]

const secondaryLinks = [
  { label: 'Charlotte.edu', href: 'https://webpages.charlotte.edu/pvegesan/' },
  { label: 'GitHub', href: 'https://github.com/vasistavegesana' },
  { label: 'GitHub.io', href: 'https://vasistavegesana.github.io/' },
  { label: 'freeCodeCamp', href: 'https://www.freecodecamp.org/fcc-cb3c3e2c-eb2f-4452-ba5a-9b3270fdf6d0' },
  { label: 'Codecademy', href: 'https://www.codecademy.com/profiles/vasistavegesana' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vasista-vegesana-585aba1a5/' },
]


const Layout = () => (
  <div className="container">
    <header>
      <h1>Vasista Vegesana&apos;s Vibrant Vulture || ITIS 3135</h1>
      <nav aria-label="Primary navigation">
        {primaryLinks.map((link, index) => (
          <Fragment key={link.to}>
            <NavLink to={link.to} end={link.end}>
              {link.label}
            </NavLink>
            {index < primaryLinks.length - 1 && <span aria-hidden="true"></span>}
          </Fragment>
        ))}
      </nav>
    </header>

    <main>
      <Outlet />
    </main>

    <footer>
      <nav aria-label="Secondary navigation">
        {secondaryLinks.map((link, index) => (
          <Fragment key={link.href}>
            <a href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
            {index < secondaryLinks.length - 1 && <span aria-hidden="true"> || </span>}
          </Fragment>
        ))}
      </nav>

      <p>Page Built by Vibrant Vulture Web Works © 2025</p>

      


    </footer>
  </div>
)

export default Layout
