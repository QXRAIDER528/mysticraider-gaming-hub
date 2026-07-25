import { useState } from 'react'

const categories = ['Strategy', 'Loadout', 'Game insight', 'Squad callout']

export default function StrategyBoard({ games, member, posts, user, onJoin, onPublish }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [game, setGame] = useState(games[0].name)
  const [category, setCategory] = useState(categories[0])
  const [message, setMessage] = useState('')
  const [publishing, setPublishing] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setMessage('')
    setPublishing(true)
    try {
      await onPublish({ title: title.trim(), body: body.trim(), game, category })
      setTitle('')
      setBody('')
      setMessage('Insight shared with signed-in MysticRaider players.')
    } catch {
      setMessage('Your insight could not be shared. Refresh and try again.')
    } finally {
      setPublishing(false)
    }
  }

  return <section id="insights" className="section insights-section">
    <div className="insights-intro"><p className="eyebrow">PLAYER INTEL</p><h2>Insights and strategies.</h2><p>Share what works: rotations, loadouts, map ideas, and squad calls. Never post account passwords, recovery codes, or private UIDs.</p></div>
    <div className="insights-layout">
      <div className="strategy-feed">{posts.length ? posts.map((post) => <article className="strategy-post" key={post.id}><div className="post-meta"><span>{post.game}</span><span>{post.category}</span></div><h3>{post.title}</h3><p>{post.body}</p><small>Shared by {post.authorName}</small></article>) : <div className="strategy-empty"><b>No insights yet.</b><p>Be the first player to share a useful tip with the community.</p></div>}</div>
      {user && member ? <form className="strategy-form" onSubmit={submit}><p className="eyebrow">SHARE YOUR INTEL</p><label>Game<select value={game} onChange={(event) => setGame(event.target.value)}>{games.map((item) => <option key={item.name}>{item.name}</option>)}</select></label><label>Type<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} minLength="4" maxLength="80" placeholder="Example: Safer late-game rotations" required /></label><label>Your insight<textarea value={body} onChange={(event) => setBody(event.target.value)} minLength="12" maxLength="1000" placeholder="Explain the strategy in your own words..." required /></label>{message && <p className="strategy-message">{message}</p>}<button className="primary-button" type="submit" disabled={publishing}>{publishing ? 'Sharing...' : 'Share insight'}</button></form> : <aside className="strategy-lock"><p className="eyebrow">MEMBERS ONLY</p><h3>Have a strategy worth sharing?</h3><p>Create a secure player profile first. Your game UID is never shown in posts.</p><button className="primary-button" onClick={onJoin}>Join securely</button></aside>}
    </div>
  </section>
}
