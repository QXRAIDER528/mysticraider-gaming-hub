# MysticRaider Gaming Hub

MysticRaider Gaming Hub is an independent gaming community platform for discovering games, sharing strategies, representing your country, and bringing creator communities together.

## What is included

- Futuristic anime-inspired gaming interface
- Game discovery with search, profiles, and official links
- Firebase email sign-in and private player profiles
- Country-based community boards
- Private player-entered stats and game insights
- Creator Hub for YouTube, Twitch, TikTok, Discord, and Kick links
- Responsive design for desktop and mobile

## Local development

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local address shown in the terminal, usually `http://localhost:5173`.

## Firebase setup

Create a Firebase web app, then copy `.env.example` to `.env` and enter the Firebase web configuration values. Never commit `.env`.

Enable Firebase Authentication with Email/Password and create a Cloud Firestore database. Before allowing player profiles or creator links to save, publish the matching rules in `firestore.rules` through the Firebase Console.

## Ownership and license

MysticRaider is the public platform brand and founder identity. This repository is proprietary and is provided under the [MysticRaider Proprietary License](LICENSE). No reuse, copying, or distribution is permitted without written permission.

## Public launch

The project will be deployed to Firebase Hosting. A brand contact email, custom domain, privacy policy, and public platform terms will be added before public launch.
