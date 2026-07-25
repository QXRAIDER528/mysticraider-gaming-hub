import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import GameCard from './components/GameCard.jsx'
import Footer from './components/Footer.jsx'

const games = [
  ['NEON RIFT', 'Tactical shooter', 'Action', '4.9'],
  ['APEX VELOCITY', 'Racing', 'Racing', '4.8'],
  ['MYTHIC WILDS', 'Open-world RPG', 'Adventure', '4.7'],
  ['ZERO PROTOCOL', 'Battle royale', 'Action', '4.9'],
]

function SectionTitle({ eyebrow, title }) { return <div className="section-title"><p>{eyebrow}</p><h2>{title}</h2></div> }

export default function App() {
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const visibleGames = games.filter(([name, type, genre]) => {
    const matchesSearch = `${name} ${type} ${genre}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (selectedGenre === 'All' || selectedGenre === genre)
  })

  return <div className="site-shell">
    <Navbar />
    <main>
      <Hero />
      <section id="games" className="section">
        <SectionTitle eyebrow="Discover your next obsession" title="Trending games" />
        <div className="game-tools">
          <label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search games or genres" aria-label="Search games" /></label>
          <div className="filters">{['All', 'Action', 'Adventure', 'Racing'].map((genre) => <button className={selectedGenre === genre ? 'active' : ''} onClick={() => setSelectedGenre(genre)} key={genre}>{genre}</button>)}</div>
        </div>
        <div className="game-grid">{visibleGames.map(([name, type, , rating]) => <GameCard key={name} name={name} genre={type} rating={rating} />)}</div>
        {visibleGames.length === 0 && <p className="no-results">No games match that search. Try another title or genre.</p>}
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
