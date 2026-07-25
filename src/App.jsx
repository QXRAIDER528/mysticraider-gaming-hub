import { useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { auth, db, firebaseReady, photoUploadsEnabled, storage } from './firebase.js'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import GameCard from './components/GameCard.jsx'
import GameDetailsModal from './components/GameDetailsModal.jsx'
import CommunityModal from './components/CommunityModal.jsx'
import CommunityProfiles from './components/CommunityProfiles.jsx'
import StrategyBoard from './components/StrategyBoard.jsx'
import CreatorHub from './components/CreatorHub.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'
import { countries, countryCodeFor } from './data/countries.js'
import animeWorldBackground from './assets/mysticraider-anime-world-bg.png'

const games = [
  { name: 'PUBG MOBILE', type: 'Battle royale', genre: 'Battle Royale', rating: '4.8', publisher: 'KRAFTON / Level Infinite', platforms: ['Android', 'iOS'], site: 'https://www.pubgmobile.com/', highlights: ['100-player matches', 'World of Wonder'], summary: 'Squad up, loot, and outlast 100 players in a mobile battle royale.', description: 'PUBG MOBILE drops players onto large maps to scavenge gear, drive vehicles, and be the last team standing as the playzone closes in.', profile: { bestFor: 'Squad survival', matchStyle: 'Tactical battle royale', coreLoop: 'Loot - rotate - survive', playStyle: 'A large-map survival shooter where positioning, vehicle use, communication, and smart rotations matter as much as aim.', features: ['Solo, duo, and squad matchmaking', 'Classic survival maps and rotating experiences', 'World of Wonder player-created maps'], firstStep: 'Start in unranked squad matches, learn one map, then try World of Wonder with friends.' } },
  { name: 'CALL OF DUTY: MOBILE', type: 'Multiplayer shooter', genre: 'Shooter', rating: '4.8', publisher: 'Activision', platforms: ['Android', 'iOS'], site: 'https://www.callofduty.com/mobile', highlights: ['5v5 multiplayer', 'Battle Royale'], summary: 'Classic multiplayer maps, battle royale, and intense mobile action.', description: 'Call of Duty: Mobile brings team-based multiplayer, battle royale, iconic maps, and a large roster of operators to mobile devices.', profile: { bestFor: 'Fast competitive matches', matchStyle: 'Multiplayer and battle royale', coreLoop: 'Loadout - objective - rank up', playStyle: 'A rapid mobile shooter built around familiar Call of Duty modes, customizable loadouts, and both short multiplayer rounds and bigger battle royale matches.', features: ['Team multiplayer and objective modes', 'Custom weapons and loadouts', 'Battle Royale for larger-scale play'], firstStep: 'Try a few public multiplayer matches to find a weapon class you like before taking on ranked play.' } },
  { name: 'FORTNITE', type: 'Battle royale and creative', genre: 'Battle Royale', rating: '4.7', publisher: 'Epic Games', platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Android'], site: 'https://www.fortnite.com/', highlights: ['Battle Royale', 'Creator worlds'], summary: 'Battle, build, and discover thousands of player-made experiences.', description: 'Fortnite combines Battle Royale with a large creative ecosystem of games and experiences made by Epic and its community.', profile: { bestFor: 'Battle and discovery', matchStyle: 'Competitive and social', coreLoop: 'Drop in - adapt - discover', playStyle: 'One account can lead to Battle Royale matches, Epic-made modes, and a wide variety of creator-built worlds for different kinds of play.', features: ['Battle Royale with seasonal updates', 'Creative and community-made experiences', 'Solo and team-focused sessions'], firstStep: 'Use Discover to find a mode that suits you, then join a squad once you are comfortable with the controls.' } },
  { name: 'VALORANT', type: '5v5 tactical shooter', genre: 'Shooter', rating: '4.8', publisher: 'Riot Games', platforms: ['PC', 'PlayStation 5', 'Xbox Series X|S'], site: 'https://playvalorant.com/', highlights: ['5v5 rounds', 'Unique agents'], summary: 'Precision gunplay meets agents with distinctive tactical abilities.', description: 'VALORANT is a competitive 5v5 shooter where teams attack and defend across short rounds using sharp aim, smart coordination, and agent abilities.', profile: { bestFor: 'Coordinated 5v5 teams', matchStyle: 'Round-based tactical shooter', coreLoop: 'Plan - execute - adapt', playStyle: 'Small teams alternate between attack and defense, combining precise shooting with agent abilities and communication across multiple rounds.', features: ['Distinct agents and tactical abilities', 'Round-based attack and defense', 'Competitive progression and team communication'], firstStep: 'Choose one or two agents to learn, play the tutorials and unranked modes, then move into competitive when ready.' } },
  { name: 'MINECRAFT', type: 'Sandbox survival', genre: 'Sandbox', rating: '4.9', publisher: 'Mojang Studios', platforms: ['PC', 'Console', 'Android', 'iOS'], site: 'https://www.minecraft.net/', highlights: ['Creative mode', 'Cross-play'], summary: 'Build anything, explore endless worlds, and survive the night.', description: 'Minecraft is an open-world sandbox adventure built around crafting, exploration, survival, and creating worlds alone or with friends.', profile: { bestFor: 'Building and exploration', matchStyle: 'Open-ended sandbox', coreLoop: 'Gather - craft - create', playStyle: 'A flexible block-based world where you can survive, build enormous projects, explore, or play together depending on the mode and server.', features: ['Creative building with unlimited resources', 'Survival progression and exploration', 'Shared worlds and cross-platform play options'], firstStep: 'Create a Survival world to learn crafting or choose Creative if you want to build freely from the start.' } },
  { name: 'FREE FIRE', type: 'Battle royale', genre: 'Battle Royale', rating: '4.6', publisher: 'Garena', platforms: ['Android', 'iOS'], site: 'https://ff.garena.com/en/', highlights: ['Quick matches', 'Free Fire MAX'], summary: 'Fast mobile matches built for quick squads and sharp decisions.', description: 'Free Fire is a mobile battle royale with varied modes, quick matches, and a global community of players.', profile: { bestFor: 'Quick mobile squads', matchStyle: 'Fast battle royale', coreLoop: 'Drop - equip - outplay', playStyle: 'A fast-paced mobile battle royale with shorter sessions, character choices, and team decisions that reward quick reactions.', features: ['Quick battle royale sessions', 'Character and team combinations', 'Multiple game modes and events'], firstStep: 'Learn the landing areas in casual matches, then play with a squad and work on coordinated rotations.' } },
]

const featuredCountryBoards = {
  Kenya: [['01', 'NyxViper', 'KE', '9,842'], ['02', 'PixelShujaa', 'KE', '9,012'], ['03', 'AmaniStorm', 'KE', '8,745'], ['04', 'KifaruX', 'KE', '8,216']],
  Uganda: [['01', 'KampalaAce', 'UG', '8,910'], ['02', 'PearlViper', 'UG', '8,602'], ['03', 'NileStorm', 'UG', '8,276'], ['04', 'CraneByte', 'UG', '7,980']],
  Tanzania: [['01', 'KilimanjaroX', 'TZ', '8,844'], ['02', 'SafariShade', 'TZ', '8,419'], ['03', 'Coastline', 'TZ', '8,104'], ['04', 'Mwamba', 'TZ', '7,846']],
  Rwanda: [['01', 'KigaliCore', 'RW', '8,701'], ['02', 'VirungaAim', 'RW', '8,352'], ['03', 'HillsideX', 'RW', '8,027'], ['04', 'NovaKivu', 'RW', '7,774']],
  Ethiopia: [['01', 'AddisArc', 'ET', '8,656'], ['02', 'AbyssalAim', 'ET', '8,311'], ['03', 'LalibelaX', 'ET', '7,995'], ['04', 'BlueNile', 'ET', '7,740']],
  Somalia: [['01', 'MogadishuX', 'SO', '8,487'], ['02', 'HornViper', 'SO', '8,147'], ['03', 'CoastalCore', 'SO', '7,886'], ['04', 'DesertByte', 'SO', '7,612']],
}

const videoHighlights = [
  { game: 'PUBG MOBILE', title: 'World of Wonder', description: 'Discover player-built maps, custom modes, and creative challenges.', href: 'https://www.pubgmobile.com/en-US/home.shtml', action: 'Explore World of Wonder' },
  { game: 'CALL OF DUTY: MOBILE', title: 'DMZ: Recon', description: 'Watch the official mode overview for extraction-focused PvPvE action.', href: 'https://www.callofduty.com/mobile', action: 'Watch on Call of Duty' },
  { game: 'FORTNITE', title: 'Battle Royale and Creative', description: 'See what is happening in Battle Royale and Epic-created worlds.', href: 'https://www.fortnite.com/', action: 'Watch on Fortnite' },
  { game: 'VALORANT', title: 'Tactical plays', description: 'Jump into official agent, map, and competitive game videos.', href: 'https://playvalorant.com/', action: 'Watch on VALORANT' },
]

const trendingNews = [
  { game: 'FORTNITE', date: 'Trending now', title: 'DC Sirens bring the heat to Fortnite.', href: 'https://www.fortnite.com/', art: 'art-1' },
  { game: 'VALORANT', date: 'Competitive update', title: 'New anti-boosting and smurfing countermeasures announced.', href: 'https://playvalorant.com/en-us/news/announcements/', art: 'art-2' },
  { game: 'CALL OF DUTY: MOBILE', date: 'Season update', title: 'Season 6: Take Your Heart is now in the spotlight.', href: 'https://www.callofduty.com/mobile', art: 'art-3' },
  { game: 'MINECRAFT', date: 'Game drop', title: 'Chaos Cubed adds a fresh cave biome and block-powered surprises.', href: 'https://www.minecraft.net/en-us/article', art: 'art-4' },
  { game: 'FREE FIRE', date: 'Patch notes', title: 'OB54 patch notes and new updates are live from Garena.', href: 'https://ff.garena.com/en/', art: 'art-5' },
  { game: 'PUBG MOBILE', date: 'Events', title: 'New events and community-created experiences are featured now.', href: 'https://www.pubgmobile.com/en-US/events.shtml', art: 'art-6' },
]

function SectionTitle({ eyebrow, title }) {
  return <div className="section-title"><p>{eyebrow}</p><h2>{title}</h2></div>
}

export default function App() {
  const [search, setSearch] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [leaderboardCountry, setLeaderboardCountry] = useState('Kenya')
  const [selectedGame, setSelectedGame] = useState(null)
  const [member, setMember] = useState(() => {
    if (firebaseReady) return null
    try { return JSON.parse(window.localStorage.getItem('mysticraider-member')) } catch { return null }
  })
  const [user, setUser] = useState(null)
  const [strategyPosts, setStrategyPosts] = useState([])
  const [communityOpen, setCommunityOpen] = useState(false)

  useEffect(() => {
    if (!firebaseReady) return undefined
    return onAuthStateChanged(auth, async (signedInUser) => {
      setUser(signedInUser)
      if (!signedInUser) {
        setMember(null)
        return
      }
      try {
        const snapshot = await getDoc(doc(db, 'profiles', signedInUser.uid))
        setMember(snapshot.exists() ? snapshot.data() : null)
      } catch {
        setMember(null)
      }
    })
  }, [])

  useEffect(() => {
    if (!firebaseReady || !user) {
      setStrategyPosts([])
      return undefined
    }
    const postsQuery = query(collection(db, 'strategyPosts'), orderBy('createdAt', 'desc'), limit(12))
    return onSnapshot(postsQuery, (snapshot) => setStrategyPosts(snapshot.docs.map((post) => ({ id: post.id, ...post.data() }))), () => setStrategyPosts([]))
  }, [user])

  useEffect(() => {
    if (member?.region && countries.some((country) => country.name === member.region)) setLeaderboardCountry(member.region)
  }, [member])

  const selectedCountry = countries.find((country) => country.name === leaderboardCountry)
  const currentCountry = selectedCountry?.name ?? 'Kenya'
  const playerCountryRow = member?.region === currentCountry
    ? [['YOU', member.gamerTag, countryCodeFor(currentCountry), `${member.wins ?? 0}W / ${member.kills ?? 0}K`]]
    : []
  const countryRows = [...playerCountryRow, ...(featuredCountryBoards[currentCountry] ?? [])]

  const visibleGames = games.filter((game) => {
    const matchesSearch = `${game.name} ${game.type} ${game.genre} ${game.summary}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (selectedGenre === 'All' || selectedGenre === game.genre)
  })

  async function saveMember(profile) {
    if (firebaseReady) {
      if (!user) throw new Error('Sign in required')
      let avatarUrl = profile.avatarUrl ?? member?.avatarUrl ?? ''
      if (profile.avatarFile && photoUploadsEnabled) {
        const imageRef = ref(storage, `profile-images/${user.uid}/avatar-${Date.now()}`)
        await uploadBytes(imageRef, profile.avatarFile, { contentType: profile.avatarFile.type })
        avatarUrl = await getDownloadURL(imageRef)
      }
      const { avatarFile, ...profileData } = profile
      const savedProfile = { ...profileData, avatarUrl, updatedAt: serverTimestamp() }
      await setDoc(doc(db, 'profiles', user.uid), savedProfile, { merge: true })
      setMember({ ...profileData, avatarUrl })
      setCommunityOpen(false)
      return
    }
    window.localStorage.setItem('mysticraider-member', JSON.stringify(profile))
    setMember(profile)
    setCommunityOpen(false)
  }

  async function authenticate({ mode, email, password }) {
    if (!firebaseReady) throw new Error('Firebase is not configured')
    if (mode === 'signup') return createUserWithEmailAndPassword(auth, email, password)
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function signOutMember() {
    await signOut(auth)
  }

  async function publishStrategy({ title, body, game, category }) {
    if (!user || !member) throw new Error('Sign in required')
    await addDoc(collection(db, 'strategyPosts'), { authorId: user.uid, authorName: member.gamerTag, game, category, title, body, createdAt: serverTimestamp() })
  }

  return <div className="site-shell" style={{ '--world-background': `url(${animeWorldBackground})` }}>
    <Navbar member={member} onJoin={() => setCommunityOpen(true)} />
    <main>
      <Hero onJoin={() => setCommunityOpen(true)} />

      <section className="community-band"><div><p className="eyebrow">MYSTICRAIDER COMMUNITY</p><h2>{member ? `Welcome back, ${member.gamerTag}.` : user ? 'Finish setting up your profile.' : 'Find your squad. Build your legend.'}</h2><p>{member ? `${member.favoriteGame} player - ${member.region}` : firebaseReady ? 'Sign in to create a private player profile and optionally keep your game UID protected.' : 'Secure sign-in is ready to connect to Firebase.'}</p></div><button className="primary-button" onClick={() => setCommunityOpen(true)}>{member ? 'Edit private profile' : user ? 'Finish profile' : 'Join securely'}</button></section>

      <CommunityProfiles member={member} onJoin={() => setCommunityOpen(true)} />
      <StrategyBoard games={games} member={member} posts={strategyPosts} user={user} onJoin={() => setCommunityOpen(true)} onPublish={publishStrategy} />
      <CreatorHub member={member} onJoin={() => setCommunityOpen(true)} />

      <section id="games" className="section">
        <SectionTitle eyebrow="Discover your next obsession" title="Trending games" />
        <div className="game-tools">
          <label className="search-box"><span>Search</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search games or genres" aria-label="Search games" /></label>
          <div className="filters">{['All', 'Battle Royale', 'Shooter', 'Sandbox'].map((genre) => <button className={selectedGenre === genre ? 'active' : ''} onClick={() => setSelectedGenre(genre)} key={genre}>{genre}</button>)}</div>
        </div>
        <div className="game-grid">{visibleGames.map((game) => <GameCard key={game.name} game={game} onOpen={() => setSelectedGame(game)} />)}</div>
        {visibleGames.length === 0 && <p className="no-results">No games match that search. Try another title or genre.</p>}
      </section>

      <section id="highlights" className="section">
        <SectionTitle eyebrow="OFFICIAL GAMEPLAY" title="Watch highlights" />
        <div className="video-grid">{videoHighlights.map((video, index) => <article className={`video-card video-${index + 1}`} key={video.title}><div className="video-card-top"><span>{video.game}</span><span className="video-play">Play</span></div><div><h3>{video.title}</h3><p>{video.description}</p><a href={video.href} target="_blank" rel="noreferrer">{video.action} -&gt;</a></div></article>)}</div>
      </section>

      <section id="news" className="section">
        <SectionTitle eyebrow="FROM OFFICIAL GAME CHANNELS" title="Trending now" />
        <p className="news-intro">Curated game updates and announcements. Open any story to read the full post from the publisher.</p>
        <div className="news-grid">{trendingNews.map((article) => <article className="news-card" key={article.title}><div className={`news-art ${article.art}`} /><small>{article.game} - {article.date}</small><h3>{article.title}</h3><a href={article.href} target="_blank" rel="noreferrer">Read official update -&gt;</a></article>)}</div>
      </section>

      <section id="leaderboard" className="section leaderboard-section">
        <div><SectionTitle eyebrow="COUNTRY COMMUNITY BOARD" title="Play for your nation." /><p className="body-copy">Search for any country, choose your home nation, and join its board with your private player profile. Player data stays private unless we later add a separate public opt-in.</p><button className="secondary-button" onClick={() => setCommunityOpen(true)}>{member ? 'Update my country' : 'Choose my country'}</button></div>
        <div className="leaderboard"><label className="country-picker">FIND A COUNTRY<input list="leaderboard-country-list" value={leaderboardCountry} onChange={(event) => setLeaderboardCountry(event.target.value)} placeholder="Search countries" aria-label="Search country leaderboards" /><datalist id="leaderboard-country-list">{countries.map((country) => <option key={country.code} value={country.name} />)}</datalist></label>{selectedCountry ? <><div className="country-board-heading"><span>{currentCountry}</span><small>{member?.region === currentCountry ? 'YOUR PROFILE IS JOINED' : 'COMMUNITY BOARD'}</small></div><div className="table-head"><span>RANK</span><span>PLAYER</span><span>COUNTRY</span><span>STATS</span></div>{countryRows.length ? countryRows.map(([rank, name, code, stats]) => <div className={rank === 'YOU' ? 'player player-you' : 'player'} key={`${currentCountry}-${name}`}><b>{rank}</b><span><i>{name[0]}</i>{name}</span><em>{code}</em><strong>{stats}</strong></div>) : <div className="country-empty"><b>No players are displayed on the {currentCountry} board yet.</b><p>Choose {currentCountry} in your private profile to join it from your own view.</p></div>}</> : <div className="country-empty"><b>Choose a country from the search suggestions.</b><p>Every country has its own community board.</p></div>}</div>
      </section>
      <About />
    </main>
    <Footer />
    {selectedGame && <GameDetailsModal game={selectedGame} onClose={() => setSelectedGame(null)} />}
    {communityOpen && <CommunityModal games={games} member={member} onClose={() => setCommunityOpen(false)} onJoin={saveMember} firebaseReady={firebaseReady} photoUploadsEnabled={photoUploadsEnabled} user={user} onAuthenticate={authenticate} onSignOut={signOutMember} />}
  </div>
}
