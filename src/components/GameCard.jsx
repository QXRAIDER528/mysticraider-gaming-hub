export default function GameCard({ game, onOpen }) {
  const initials = game.name.split(' ').map((word) => word[0]).join('')

  return <article className="game-card">
    <div className="game-art"><b>{initials}</b><span>Rating {game.rating}</span></div>
    <div><small>{game.type}</small><h3>{game.name}</h3><p className="game-summary">{game.summary}</p><div className="game-highlights">{game.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}</div><button className="card-link" onClick={onOpen}>View details -&gt;</button></div>
  </article>
}
