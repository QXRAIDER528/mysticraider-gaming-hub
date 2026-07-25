import { useState } from 'react'
import { countries } from '../data/countries.js'

export default function CommunityModal({ games, member, onClose, onJoin, firebaseReady, photoUploadsEnabled, user, onAuthenticate, onSignOut }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gamerTag, setGamerTag] = useState(member?.gamerTag ?? '')
  const [favoriteGame, setFavoriteGame] = useState(member?.favoriteGame ?? games[0].name)
  const [region, setRegion] = useState(member?.region ?? 'Kenya')
  const [gameUid, setGameUid] = useState(member?.gameUid ?? '')
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(member?.avatarUrl ?? '')
  const [rank, setRank] = useState(member?.rank ?? '')
  const [matchesPlayed, setMatchesPlayed] = useState(member?.matchesPlayed ?? 0)
  const [wins, setWins] = useState(member?.wins ?? 0)
  const [kills, setKills] = useState(member?.kills ?? 0)
  const [deaths, setDeaths] = useState(member?.deaths ?? 0)
  const [socialLinks, setSocialLinks] = useState(() => ({ youtube: member?.socialLinks?.youtube ?? '', twitch: member?.socialLinks?.twitch ?? '', tiktok: member?.socialLinks?.tiktok ?? '', discord: member?.socialLinks?.discord ?? '', kick: member?.socialLinks?.kick ?? '' }))
  const [message, setMessage] = useState('')

  const initials = (gamerTag.trim() || '?').split(/\s+/).map((part) => part[0]).join('').slice(0, 2)
  const numeric = (value) => Math.max(0, Number.parseInt(value || 0, 10) || 0)
  const winsNumber = numeric(wins)
  const matchesNumber = numeric(matchesPlayed)
  const winRate = matchesNumber ? `${((winsNumber / matchesNumber) * 100).toFixed(1)}%` : '0.0%'
  const kdRatio = numeric(deaths) ? (numeric(kills) / numeric(deaths)).toFixed(2) : numeric(kills) ? 'Perfect' : '0.00'

  function updateSocialLink(platform, value) {
    setSocialLinks((currentLinks) => ({ ...currentLinks, [platform]: value }))
  }

  function validSocialLinks() {
    const allowedHosts = {
      youtube: ['youtube.com', 'www.youtube.com', 'youtu.be'],
      twitch: ['twitch.tv', 'www.twitch.tv'],
      tiktok: ['tiktok.com', 'www.tiktok.com'],
      discord: ['discord.gg', 'discord.com', 'www.discord.com'],
      kick: ['kick.com', 'www.kick.com'],
    }
    try {
      return Object.entries(socialLinks).every(([platform, link]) => {
        if (!link.trim()) return true
        const url = new URL(link.trim())
        return url.protocol === 'https:' && allowedHosts[platform].includes(url.hostname)
      })
    } catch {
      return false
    }
  }

  async function submit(event) {
    event.preventDefault()
    const cleanTag = gamerTag.trim()
    if (!cleanTag) return
    if (!countries.some((country) => country.name === region)) {
      setMessage('Choose your country from the suggestions in the country search field.')
      return
    }
    if (!validSocialLinks()) {
      setMessage('Use a full https:// link from the matching official platform for each channel.')
      return
    }
    setMessage('')
    try {
      await onJoin({ gamerTag: cleanTag, favoriteGame, region, gameUid: gameUid.trim(), avatarFile: photoUploadsEnabled ? avatarFile : null, avatarUrl: member?.avatarUrl ?? '', rank: rank.trim(), matchesPlayed: matchesNumber, wins: Math.min(winsNumber, matchesNumber), kills: numeric(kills), deaths: numeric(deaths), socialLinks: Object.fromEntries(Object.entries(socialLinks).map(([platform, link]) => [platform, link.trim()])) })
    } catch (error) {
      const messages = {
        'permission-denied': 'Firebase blocked the save. Open Firestore > Rules, confirm the private rules were pasted, click Publish, then wait one minute and try again.',
        unavailable: 'Firebase is temporarily unavailable. Check your connection and try again.',
        'failed-precondition': 'Firebase needs one more setup step before it can save this profile. Try again in a minute.',
      }
      setMessage(messages[error.code] ?? `Your profile could not be saved (${error.code ?? 'unknown error'}). Please try again.`)
    }
  }

  function chooseAvatar(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/') || file.size >= 3 * 1024 * 1024) {
      setMessage('Choose an image smaller than 3 MB.')
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
    setMessage('')
  }

  async function authenticate(event) {
    event.preventDefault()
    setMessage('')
    try {
      await onAuthenticate({ mode, email: email.trim(), password })
    } catch (error) {
      const messages = {
        'auth/invalid-credential': 'That email or password is not correct.',
        'auth/email-already-in-use': 'An account already exists for that email. Sign in instead.',
        'auth/weak-password': 'Use a password with at least 6 characters.',
        'auth/invalid-email': 'Enter a valid email address.',
      }
      setMessage(messages[error.code] ?? 'Sign-in could not be completed. Please try again.')
    }
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
    <section className="game-modal community-modal" role="dialog" aria-modal="true" aria-labelledby="community-modal-title" onMouseDown={(event) => event.stopPropagation()}>
      <button className="modal-close" onClick={onClose} aria-label="Close community form">X</button>
      <p className="eyebrow">Community access</p>
      <h2 id="community-modal-title">{user ? (member ? 'Your private player profile' : 'Finish your player profile') : 'Secure MysticRaider access'}</h2>

      {!firebaseReady && <div className="setup-message"><p>Firebase is ready in the website code, but it is not connected to a Firebase project yet.</p><p>Set up the project, add its web values to the local <code>.env</code> file, then restart the website.</p></div>}

      {firebaseReady && !user && <>
        <p className="modal-description">Sign in with your email. This is your MysticRaider account, not your game account.</p>
        <form className="community-form" onSubmit={authenticate}>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="you@example.com" required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength="6" placeholder="At least 6 characters" required /></label>
          {message && <p className="form-message" role="alert">{message}</p>}
          <button className="primary-button" type="submit">{mode === 'signup' ? 'Create secure account' : 'Sign in securely'}</button>
        </form>
        <button className="text-button" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage('') }}>{mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>
      </>}

      {firebaseReady && user && <><p className="modal-description">Signed in as {user.email}. Only this account can read or edit the private profile below.</p><form className="community-form" onSubmit={submit}>
        <div className="avatar-editor"><div className="avatar-preview">{avatarPreview ? <img src={avatarPreview} alt="Your profile preview" /> : initials}</div><div><p>Profile photo</p>{photoUploadsEnabled ? <><label className="file-picker">Choose photo<input type="file" accept="image/*" onChange={chooseAvatar} /></label><small>Private to you for now. JPG, PNG, or WebP, up to 3 MB.</small></> : <small>Uploads are paused while the project is on Firebase's free plan. Your initials are used as your avatar.</small>}</div></div>
        <label>Gamer tag<input value={gamerTag} onChange={(event) => setGamerTag(event.target.value)} maxLength="18" placeholder="Your gamer tag" required /></label>
        <label>Favorite game<select value={favoriteGame} onChange={(event) => setFavoriteGame(event.target.value)}>{games.map((game) => <option key={game.name}>{game.name}</option>)}</select></label>
        <label>Home country <small>Choose your nation to join its community board. Your private details stay private.</small><input list="profile-country-list" value={region} onChange={(event) => setRegion(event.target.value)} placeholder="Search for your country" required /><datalist id="profile-country-list">{countries.map((country) => <option key={country.code} value={country.name} />)}</datalist></label>
        <label>Game UID <small>Optional - never enter a game password or code.</small><input value={gameUid} onChange={(event) => setGameUid(event.target.value)} maxLength="80" placeholder="Your in-game UID, if you choose to save it" /></label>
        <p className="privacy-note">Your UID is private profile data. It is protected by the database access rules; it is not displayed on community cards.</p>
        <div className="creator-links-editor"><div><p className="form-section-title">Creator links</p><small>Optional. Save only your public channel or Discord invite links. These are private to your player profile for now.</small></div><div className="creator-link-inputs"><label>YouTube<input type="url" value={socialLinks.youtube} onChange={(event) => updateSocialLink('youtube', event.target.value)} placeholder="https://youtube.com/@yourchannel" /></label><label>Twitch<input type="url" value={socialLinks.twitch} onChange={(event) => updateSocialLink('twitch', event.target.value)} placeholder="https://twitch.tv/yourchannel" /></label><label>TikTok<input type="url" value={socialLinks.tiktok} onChange={(event) => updateSocialLink('tiktok', event.target.value)} placeholder="https://tiktok.com/@yourname" /></label><label>Discord invite<input type="url" value={socialLinks.discord} onChange={(event) => updateSocialLink('discord', event.target.value)} placeholder="https://discord.gg/yourserver" /></label><label>Kick<input type="url" value={socialLinks.kick} onChange={(event) => updateSocialLink('kick', event.target.value)} placeholder="https://kick.com/yourchannel" /></label></div></div>
        <div className="stats-editor"><div><p className="form-section-title">Player stats</p><small>Enter your own current stats. Live game imports will be added only where a publisher officially allows them.</small></div><label>Current rank<input value={rank} onChange={(event) => setRank(event.target.value)} maxLength="40" placeholder="Example: Crown V" /></label><div className="stat-inputs"><label>Matches<input type="number" min="0" value={matchesPlayed} onChange={(event) => setMatchesPlayed(event.target.value)} /></label><label>Wins<input type="number" min="0" max={matchesPlayed || 0} value={wins} onChange={(event) => setWins(event.target.value)} /></label><label>Kills<input type="number" min="0" value={kills} onChange={(event) => setKills(event.target.value)} /></label><label>Deaths<input type="number" min="0" value={deaths} onChange={(event) => setDeaths(event.target.value)} /></label></div><div className="stat-summary"><span>WIN RATE <b>{winRate}</b></span><span>K/D <b>{kdRatio}</b></span></div></div>
        {message && <p className="form-message" role="alert">{message}</p>}
        <button className="primary-button" type="submit">Save private profile</button>
      </form><button className="text-button" onClick={onSignOut}>Sign out</button></>}
    </section>
  </div>
}
