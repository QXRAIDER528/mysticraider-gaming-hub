import { useEffect, useState } from 'react'

export default function GameDetailsModal({ game, onClose }) {
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="game-modal" role="dialog" aria-modal="true" aria-labelledby="game-modal-title" onMouseDown={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close game details">X</button>
      <p className="eyebrow">Game spotlight</p>
      <h2 id="game-modal-title">{game.name}</h2>
      <p className="modal-meta">{game.type} <span>Rating {game.rating}</span></p>
      <p className="modal-publisher">Published by {game.publisher}</p>
      <div className="profile-tabs" role="tablist" aria-label={`${game.name} profile sections`}>
        {['overview', 'play', 'highlights'].map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>{tab === 'play' ? 'How it plays' : tab}</button>)}
      </div>

      {activeTab === 'overview' && <div className="profile-panel">
        <p className="modal-description">{game.description}</p>
        <div className="profile-facts">
          <div><span>Best for</span><b>{game.profile.bestFor}</b></div>
          <div><span>Match style</span><b>{game.profile.matchStyle}</b></div>
          <div><span>Core loop</span><b>{game.profile.coreLoop}</b></div>
        </div>
        <div className="platforms"><p>Available on</p><div>{game.platforms.map((platform) => <span key={platform}>{platform}</span>)}</div></div>
      </div>}

      {activeTab === 'play' && <div className="profile-panel how-it-plays">
        <p>{game.profile.playStyle}</p>
        <div className="profile-list"><span>What to expect</span><ul>{game.profile.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
        <div className="profile-list"><span>Good first step</span><p>{game.profile.firstStep}</p></div>
      </div>}

      {activeTab === 'highlights' && <div className="profile-panel">
        <div className="modal-highlights"><p>Community highlights</p><ul>{game.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>
        <p className="official-note">MysticRaider does not collect your publisher password or game account token. Official game pages open in a separate tab.</p>
      </div>}

      <a className="primary-button" href={game.site} target="_blank" rel="noreferrer">Visit official game page -&gt;</a>
    </section>
  </div>
}
