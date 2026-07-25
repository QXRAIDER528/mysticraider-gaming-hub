import animeHero from '../assets/mysticraider-anime-hero.png'

export default function Hero({ onJoin }) {
  return <section id="home" className="hero hero-art" style={{ '--hero-art': `url(${animeHero})` }}><div className="hero-copy"><p className="eyebrow">YOUR NEXT ADVENTURE STARTS HERE</p><h1>PLAY BEYOND<br />THE <span>ORDINARY.</span></h1><p className="lead">A vibrant hub for gamers who live for the clutch, the quest, and the next impossible win.</p><div className="hero-actions"><a className="primary-button" href="#games">Explore games</a><button className="secondary-button" onClick={onJoin}>Join community</button></div><div className="stats"><b>25K<span>+</span><small>PLAYERS</small></b><b>120<span>+</span><small>GAMES</small></b></div></div></section>
}
