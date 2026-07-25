import animeHero from '../assets/mysticraider-anime-hero.png'

export default function Hero({ onJoin }) {
  return <section id="home" className="hero hero-art" style={{ '--hero-art': `url(${animeHero})` }}>
    <div className="hero-copy">
      <p className="eyebrow">YOUR NEXT ADVENTURE STARTS HERE</p>
      <h1>PLAY BEYOND<br />THE <span>ORDINARY.</span></h1>
      <p className="lead">A vibrant hub for gamers who live for the clutch, the quest, and the next impossible win.</p>
      <div className="hero-actions"><a className="primary-button" href="#games">Explore games</a><button className="secondary-button" type="button" onClick={onJoin}>Join community</button></div>
      <div className="hero-signals" aria-label="MysticRaider principles"><span><b>PRIVATE</b><small>player profiles</small></span><span><b>COUNTRY</b><small>community boards</small></span><span><b>CREATOR</b><small>channel links</small></span></div>
    </div>
  </section>
}
