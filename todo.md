# Copo Gaming Platform - TODO

## Phase 1: Logo & Design System
- [x] Generate Copo logo with curved C at 35 degree angle
- [x] Create design tokens and color palette (elegant dark theme)
- [x] Set up global styles and theme

## Phase 2: Custom Authentication
- [x] Build login screen UI (Log in to Copo)
- [x] Build register screen UI (Create a Account for Copo!)
- [x] Build guest session system with random ID generation
- [x] Implement authentication backend (tRPC procedures)
- [x] Add password hashing and validation with bcrypt
- [x] Test auth flow - 9 tests passing

## Phase 3: Home Screen
- [x] Build home screen layout with Copo logo
- [x] Add Log In, Play as Guest, Create Account buttons
- [x] Implement keyboard/mouse controls (PC)
- [x] Implement touch/tap controls (Mobile)
- [x] Implement controller-scroll navigation (Console)
- [x] Test responsive design across all screen sizes

## Phase 4: Game Lobby/Hub
- [x] Build game lobby screen layout
- [x] Display three games: Plost, Miners Tycoon, HOKSHOT
- [x] Add launch buttons for each game
- [x] Implement navigation back to home
- [x] Add player profile/stats display
- [x] Test lobby on all platforms

## Phase 5: Game A - Plost (3D Tree Cutting)
- [x] Set up Three.js 3D environment
- [x] Create 3D tree models and terrain
- [x] Implement tree cutting/destruction mechanics (basic)
- [x] Build lumber store NPC and UI (placeholder)
- [x] Build Rocks Land Store with NPC Jason (placeholder)
- [ ] Implement land browsing with camera snap (left/right buttons)
- [ ] Add "Buy Land" and "Cancel" buttons
- [x] Implement wood collection and burning site
- [x] Add money/currency system
- [ ] Implement car shop and purchase system
- [ ] Add player inventory system
- [ ] Save/load player progress to database

## Phase 6: Game B - Miners Tycoon (3D Tycoon)
- [x] Set up Three.js 3D environment for tycoon
- [x] Create baseplate and tycoon structure
- [x] Implement button pop-up system (buttons appear after purchase)
- [x] Add drill and mining mechanics
- [ ] Implement weapon system for PvP
- [ ] Add multiplayer player spawning
- [x] Implement rebirth system with base expansion
- [x] Add money/currency progression
- [ ] Save/load tycoon state to database

## Phase 7: Game C - HOKSHOT (3D Shooting Game)
- [x] Set up Three.js 3D environment for shooter
- [x] Create bubbly-lettered HOKSHOT title UI
- [x] Build home screen with "Resume Playing", Settings, Shop buttons
- [x] Implement gun mechanics and shooting (basic)
- [ ] Add explosives system
- [x] Build shop UI for guns, explosives, gamepasses
- [x] Add "LATER ON FOR NEXT UPDATE" label to gamepasses
- [x] Implement money-per-kill system
- [ ] Add multiplayer player spawning
- [ ] Save/load player progress to database

## Phase 8: Player Account Persistence
- [ ] Create database schema for user accounts
- [ ] Create database schema for player progress (Plost)
- [ ] Create database schema for player progress (Miners Tycoon)
- [ ] Create database schema for player progress (HOKSHOT)
- [ ] Implement save/load procedures for all games
- [ ] Test data persistence across sessions

## Phase 9: Cross-Platform Controls
- [ ] Implement keyboard/mouse controls for PC
- [ ] Implement touch/tap controls for Mobile
- [ ] Implement controller navigation for Console
- [ ] Test all controls in all games
- [ ] Add visual feedback for active controls

## Phase 10: Polish & Testing
- [ ] Ensure pixel-perfect design across all screens
- [ ] Test responsive design on all breakpoints
- [ ] Test all games on PC, Mobile, Console
- [ ] Fix any UI/UX issues
- [ ] Performance optimization
- [ ] Create final checkpoint
- [ ] Generate EXE and APK files

## Known Constraints
- Account creation screen title: "Create a Account for Copo!" (exact wording)
- Login screen title: "Log in to Copo" (exact wording)
- Copo logo C curved at 35° downward angle
- Gamepass items marked "LATER ON FOR NEXT UPDATE"
- Rocks Land Store NPC named Jason
- No third-party OAuth - custom auth only
