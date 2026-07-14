import { useState } from 'react'
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const links = [['Home', '#home'], ['Games', '#games'], ['News', '#news'], ['Leaderboard', '#leaderboard']]
  return <header><nav><a className="logo" href="#home">MYSTIC<span>RAIDER</span></a><div className="links">{links.map(([text, target]) => <a href={target} key={text}>{text}</a>)}</div><div className="actions"><button>Sign in</button><button className="primary-button">Join now</button></div><button className="menu" onClick={() => setOpen(!open)} aria-label="Open menu">☰</button></nav>{open && <div className="mobile-links">{links.map(([text, target]) => <a onClick={() => setOpen(false)} href={target} key={text}>{text}</a>)}</div>}</header>
}
