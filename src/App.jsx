import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import GameCard from './components/GameCard.jsx'
import Footer from './components/Footer.jsx'

const games = [
  ['NEON RIFT', 'Tactical shooter', '4.9'],
  ['APEX VELOCITY', 'Racing', '4.8'],
  ['MYTHIC WILDS', 'Open-world RPG', '4.7'],
  ['ZERO PROTOCOL', 'Battle royale', '4.9'],
]

function SectionTitle({ eyebrow, title }) { return <div className="section-title"><p>{eyebrow}</p><h2>{title}</h2></div> }

export default function App() {
  return <div className="site-shell">
    <Navbar />
    <main>
      <Hero />
      <section id="games" className="section">
        <SectionTitle eyebrow="Discover your next obsession" title="Trending games" />
        <div className="game-grid">{games.map(([name, genre, rating]) => <GameCard key={name} name={name} genre={genre} rating={rating} />)}</div>
      </section>
      <section id="news" className="section">
        <SectionTitle eyebrow="From the arena" title="Fresh gaming intel" />
        <div className="news-grid">
          {['Season 09 lands with an all-new competitive arena.', 'The world championship prize pool just got bigger.', 'Five creator-built worlds to play this weekend.'].map((headline, i) => <article className="news-card" key={headline}><div className={`news-art art-${i + 1}`} /><small>{['PATCH NOTES', 'ESPORTS', 'COMMUNITY'][i]} · THIS WEEK</small><h3>{headline}</h3><a href="#news">Read story →</a></article>)}
        </div>
      </section>
      <section id="leaderboard" className="section leaderboard-section">
        <div><SectionTitle eyebrow="Own the leaderboard" title="Legends are made here." /><p className="body-copy">Track the competition, chase your next milestone, and earn your place among the community’s elite.</p><button className="secondary-button">View all rankings ↗</button></div>
        <div className="leaderboard"><div className="table-head"><span>RANK</span><span>PLAYER</span><span>REGION</span><span>XP</span></div>{[['01', 'NyxViper', 'KE', '9,842'], ['02', 'ArcadeGhost', 'US', '9,616'], ['03', 'LunaByte', 'BR', '9,281'], ['04', 'VoidWarden', 'GB', '8,904']].map(([rank, name, region, xp]) => <div className="player" key={name}><b>{rank}</b><span><i>{name[0]}</i>{name}</span><em>{region}</em><strong>{xp}</strong></div>)}</div>
      </section>
    </main>
    <Footer />
  </div>
}
