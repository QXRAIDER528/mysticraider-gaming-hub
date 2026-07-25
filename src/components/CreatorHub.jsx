const platforms = [
  { key: 'youtube', name: 'YouTube', description: 'Videos, Shorts, highlights, and live broadcasts.', href: 'https://www.youtube.com/' },
  { key: 'twitch', name: 'Twitch', description: 'Live gaming streams and creator communities.', href: 'https://www.twitch.tv/' },
  { key: 'tiktok', name: 'TikTok', description: 'Short clips, play recaps, and creator discovery.', href: 'https://www.tiktok.com/' },
  { key: 'discord', name: 'Discord', description: 'Squads, community servers, and voice channels.', href: 'https://discord.com/' },
  { key: 'kick', name: 'Kick', description: 'Live streams and gaming creators.', href: 'https://kick.com/' },
]

export default function CreatorHub({ member, onJoin }) {
  const links = member?.socialLinks ?? {}
  const connected = platforms.filter((platform) => links[platform.key])

  return <section id="streaming" className="section creator-section">
    <div className="creator-heading"><div><p className="eyebrow">CREATOR & STREAMING HUB</p><h2>Bring your community with you.</h2><p>Keep your official channel links in your private player profile, then jump to your streams, clips, and Discord community from one place.</p></div><button className="secondary-button" onClick={onJoin}>{member ? 'Manage my links' : 'Add my channels'}</button></div>
    <div className="creator-grid">{platforms.map((platform) => <article className="creator-card" key={platform.key}><span>{platform.name}</span><h3>{platform.description}</h3>{links[platform.key] ? <a className="creator-link" href={links[platform.key]} target="_blank" rel="noreferrer">Open your {platform.name} -&gt;</a> : <a href={platform.href} target="_blank" rel="noreferrer">Explore {platform.name} -&gt;</a>}</article>)}</div>
    <p className="creator-note">{connected.length ? `${connected.length} channel link${connected.length === 1 ? '' : 's'} saved privately to your player profile.` : 'This first version saves links only. Real “Sign in with YouTube, Twitch, TikTok, or Discord” connections will be added later after each platform’s secure approval setup.'}</p>
  </section>
}
