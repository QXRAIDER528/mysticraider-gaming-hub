const previewProfiles = [
  { gamerTag: 'NyxViper', favoriteGame: 'PUBG MOBILE', region: 'Kenya', status: 'Ultimate Royale contender' },
  { gamerTag: 'PixelShujaa', favoriteGame: 'CALL OF DUTY: MOBILE', region: 'Kenya', status: 'Ranked multiplayer' },
  { gamerTag: 'LunaByte', favoriteGame: 'VALORANT', region: 'Global', status: 'Tactical squad captain' },
]

function initials(name) { return name.split(/\s+/).map((part) => part[0]).join('').slice(0, 2) }

export default function CommunityProfiles({ member, onJoin }) {
  const profiles = member ? [{ ...member, status: 'Your local player card', isYou: true }, ...previewProfiles] : previewProfiles
  return <section id="community" className="section profiles-section"><div className="profiles-heading"><div><p className="eyebrow">PLAYER PROFILES</p><h2>Meet the community.</h2></div><button className="secondary-button" onClick={onJoin}>{member ? 'Edit your card' : 'Create your card'}</button></div><div className="profiles-grid">{profiles.map((profile) => <article className={`player-profile ${profile.isYou ? 'profile-you' : ''}`} key={profile.gamerTag}><div className="profile-avatar">{profile.isYou && profile.avatarUrl ? <img src={profile.avatarUrl} alt="Your player avatar" /> : initials(profile.gamerTag)}</div><div><p className="profile-label">{profile.isYou ? 'YOUR PRIVATE PROFILE' : 'COMMUNITY PREVIEW'}</p><h3>{profile.gamerTag}</h3><p className="profile-game">{profile.favoriteGame}</p><p className="profile-region">{profile.region} - {profile.status}</p>{profile.isYou && <p className="profile-stats">{profile.rank || 'Unranked'} · {profile.wins ?? 0} wins · {profile.kills ?? 0} kills</p>}</div></article>)}</div></section>
}
