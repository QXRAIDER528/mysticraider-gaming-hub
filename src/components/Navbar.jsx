import { useState } from 'react'

export default function Navbar({ member, onJoin }) {
  const [open, setOpen] = useState(false)
  const links = [['Home', '#home'], ['Games', '#games'], ['Insights', '#insights'], ['Live', '#streaming'], ['News', '#news'], ['Leaderboard', '#leaderboard']]

  return <header><nav><a className="logo" href="#home">MYSTIC<span>RAIDER</span></a><div className="links">{links.map(([text, target]) => <a href={target} key={text}>{text}</a>)}</div><div className="actions">{member && <span className="member-chip">{member.gamerTag}</span>}<button className="primary-button" onClick={onJoin}>{member ? 'Player card' : 'Join now'}</button></div><button className="menu" onClick={() => setOpen(!open)} aria-label="Open menu">Menu</button></nav>{open && <div className="mobile-links">{links.map(([text, target]) => <a onClick={() => setOpen(false)} href={target} key={text}>{text}</a>)}<button className="primary-button" onClick={() => { setOpen(false); onJoin() }}>{member ? 'Player card' : 'Join now'}</button></div>}</header>
}
