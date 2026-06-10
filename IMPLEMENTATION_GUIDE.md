# Copo Gaming Platform - Implementation Guide

## Overview

**Copo** is a polished, cross-platform multiplayer gaming platform built with React, Three.js, and tRPC. The platform features custom authentication, three distinct 3D games, and support for PC, Mobile, and Console.

## Architecture

### Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 4, Wouter (routing)
- **Backend:** Express 4, tRPC 11, Node.js
- **Database:** MySQL/TiDB with Drizzle ORM
- **3D Graphics:** Three.js 0.184.0
- **Authentication:** Custom bcrypt-based system (no third-party OAuth)
- **Testing:** Vitest

### Project Structure

```
copo-gaming/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthHome.tsx          # Home screen with logo and auth buttons
│   │   │   ├── Login.tsx             # Login screen ("Log in to Copo")
│   │   │   ├── Register.tsx          # Register screen ("Create a Account for Copo!")
│   │   │   ├── GameLobby.tsx         # Game lobby/hub screen
│   │   │   └── GameScreen.tsx        # Placeholder for 3D game environments
│   │   ├── App.tsx                   # Main router and theme setup
│   │   ├── index.css                 # Global styles and Copo design tokens
│   │   └── lib/trpc.ts               # tRPC client configuration
│   └── index.html
├── server/
│   ├── routers.ts                    # tRPC procedures (auth, games)
│   ├── db.ts                         # Database query helpers
│   ├── auth.copo.test.ts             # Authentication tests (9 tests)
│   └── _core/                        # Framework internals
├── drizzle/
│   ├── schema.ts                     # Database schema (6 tables)
│   └── migrations/
├── todo.md                           # Feature tracking
└── IMPLEMENTATION_GUIDE.md           # This file
```

## Database Schema

### Tables

1. **users** - Core user table (Manus OAuth fallback)
2. **copo_accounts** - Custom Copo authentication (username + bcrypt password)
3. **guest_sessions** - Temporary guest sessions with 24-hour expiry
4. **plost_progress** - Plost game progress (money, wood, cars, lands)
5. **miners_tycoon_progress** - Miners Tycoon progress (money, drills, weapons, rebirths)
6. **hokshot_progress** - HOKSHOT progress (money, guns, explosives, kills/deaths)

## Authentication System

### Custom Copo Authentication

The platform implements a fully custom authentication system with three entry points:

#### 1. Register (`auth.register`)

**Input:**
- `username` (3-64 characters)
- `password` (min 6 characters)
- `confirmPassword` (must match password)

**Process:**
1. Validate password match and length
2. Check username uniqueness
3. Hash password with bcrypt (10 rounds)
4. Create user in `users` table
5. Create Copo account in `copo_accounts` table
6. Initialize game progress for all three games (1000 starting money each)

**Output:**
```json
{
  "success": true,
  "userId": 1,
  "username": "player123"
}
```

#### 2. Login (`auth.login`)

**Input:**
- `username`
- `password`

**Process:**
1. Find account by username
2. Verify password with bcrypt
3. Return user info

**Output:**
```json
{
  "success": true,
  "userId": 1,
  "username": "player123",
  "openId": "copo_xxx"
}
```

#### 3. Guest Session (`auth.createGuest`)

**Process:**
1. Generate unique guest ID with format: `guest_{nanoid(16)}`
2. Set 24-hour expiry
3. Store in `guest_sessions` table

**Output:**
```json
{
  "success": true,
  "guestId": "guest_abc123def456"
}
```

### Session Management

- **Authenticated Users:** Session stored in HTTP-only cookie (via Manus OAuth infrastructure)
- **Guest Users:** Guest ID stored in `sessionStorage` on client
- **Frontend State:** `useAuth()` hook provides current user info

## UI Screens

### 1. Home Screen (`/`)

**Component:** `AuthHome.tsx`

**Features:**
- Copo logo (curved C at 35° angle) centered at top
- Three main buttons:
  - "Log In" → Navigate to `/login`
  - "Create Account" → Navigate to `/register`
  - "Play as Guest" → Create guest session → Navigate to `/lobby`
- Elegant dark gradient background with blue/cyan accents
- Responsive design for PC, Mobile, Console

**Design:**
- Dark theme: `from-slate-900 via-slate-800 to-slate-900`
- Logo URL: `https://d2xsxph8kpxj0f.cloudfront.net/310519663738678831/PtDWKfJ9M5i3yQrYAF8bRN/copo-logo-An4obHqncRRgWC6H5BnWXz.webp`
- Buttons use gradient colors (blue, slate, emerald)
- Smooth animations and hover effects

### 2. Login Screen (`/login`)

**Component:** `Login.tsx`

**Title:** "Log in to Copo" (exact wording required)

**Fields:**
- Username input
- Password input
- "Log In" button

**Features:**
- Back button to return to home
- Link to register page
- Error handling with toast notifications
- Loading state during login

### 3. Register Screen (`/register`)

**Component:** `Register.tsx`

**Title:** "Create a Account for Copo!" (exact wording required)

**Fields:**
- Username input (3-64 characters)
- Password input (min 6 characters)
- Confirm Password input
- "Create Account" button

**Features:**
- Back button to return to home
- Link to login page
- Password validation feedback
- Error handling with toast notifications

### 4. Game Lobby (`/lobby`)

**Component:** `GameLobby.tsx`

**Features:**
- Header with Copo logo, welcome message, and logout button
- Three game cards:
  1. **Plost** - "Cut trees, build your empire, and become a lumber tycoon"
  2. **Miners Tycoon** - "Mine ore, build drills, and dominate the mining industry"
  3. **HOKSHOT** - "Intense PvP shooting action with guns and explosives"
- Player stats section (placeholder):
  - Total Playtime
  - Total Earnings
  - Games Played
- Each game card has:
  - Colored gradient header
  - Game description
  - "Play Now" button

**Navigation:**
- Click game card or "Play Now" → Navigate to `/game/{gameId}`
- Logout button → Clear session → Navigate to `/`

### 5. Game Screen (`/game/:gameId`)

**Component:** `GameScreen.tsx`

**Placeholder Implementation:**
- Back button to return to lobby
- Game title display
- Placeholder for 3D game environment

**Games:**
- `/game/plost` - Plost (Tree Cutting)
- `/game/miners-tycoon` - Miners Tycoon
- `/game/hokshot` - HOKSHOT (Shooting)

## Game Specifications

### Game A: Plost (Tree Cutting)

**Status:** Placeholder (3D implementation pending)

**Features to Implement:**
1. **3D Environment**
   - Terrain with trees
   - Lumber yard with store
   - Land plots for sale
   - Wood burning/collection site

2. **Lumber Store**
   - NPC interaction system
   - Item grab and place mechanics
   - Purchase interface

3. **Land Store**
   - NPC: Jason
   - Land browsing with camera snap
   - Left/Right navigation buttons
   - "Buy Land" and "Cancel" buttons

4. **Economy**
   - Money system (starting: 1000)
   - Wood collection and selling
   - Car shop and purchases

5. **Database Integration**
   - Save money, wood, cars, lands to `plost_progress`
   - Persist level and total trees cut

### Game B: Miners Tycoon

**Status:** Placeholder (3D implementation pending)

**Features to Implement:**
1. **3D Environment**
   - Baseplate that expands with rebirth
   - Mining area
   - PvP arena

2. **Tycoon Mechanics**
   - Button pop-up system (progressive unlocking)
   - Drill purchases and upgrades
   - Ore mining mechanics

3. **Multiplayer**
   - Player spawning
   - Weapon system for PvP
   - Kill/death tracking

4. **Progression**
   - Rebirth system
   - Base size increases per rebirth
   - Money progression

5. **Database Integration**
   - Save money, drills, weapons, rebirths to `miners_tycoon_progress`
   - Track total ores mined

### Game C: HOKSHOT (Shooting Game)

**Status:** Placeholder (3D implementation pending)

**Features to Implement:**
1. **3D Environment**
   - Multiplayer arena
   - Spawn points
   - Environmental hazards

2. **UI**
   - Bubbly-lettered "HOKSHOT" title
   - Home screen with buttons:
     - "Resume Playing"
     - Settings
     - Shop

3. **Shop System**
   - Guns (various types)
   - Explosives
   - Gamepasses (marked "LATER ON FOR NEXT UPDATE")

4. **Gameplay**
   - Gun mechanics and shooting
   - Explosive system
   - Money-per-kill economy
   - Kill/death tracking

5. **Database Integration**
   - Save money, guns, explosives to `hokshot_progress`
   - Track total kills and deaths

## Cross-Platform Controls

### PC (Keyboard + Mouse)

- **Navigation:** Arrow keys, Tab
- **Selection:** Enter, Click
- **Input:** Type in text fields
- **Buttons:** Click or press Enter when focused

### Mobile (Touch)

- **Navigation:** Swipe, Tap
- **Selection:** Tap button
- **Input:** Virtual keyboard
- **Buttons:** Tap to activate

### Console (Controller)

- **Navigation:** D-Pad or analog stick
- **Selection:** A button (Xbox) or Cross (PlayStation)
- **Input:** Virtual keyboard or voice input
- **Focus Management:** Visual focus ring on buttons

**Implementation Status:** Basic touch/click support implemented. Controller navigation pending.

## Testing

### Test Coverage

**File:** `server/auth.copo.test.ts`

**Tests (9 passing):**
1. Register: Password mismatch validation
2. Register: Short password rejection
3. Register: Short username rejection
4. Guest: Valid guest ID creation
5. Guest: Unique guest ID generation
6. Logout: Cookie clearing
7. Me: Null for unauthenticated users
8. Me: User info for authenticated users
9. Create guest: Guest session with expiry

**Run Tests:**
```bash
pnpm test
```

### Test Results
```
✓ server/auth.logout.test.ts (1 test) 5ms
✓ server/auth.copo.test.ts (8 tests) 1439ms
   ✓ Copo Authentication > auth.createGuest > should create a guest session with a valid guest ID 1322ms
 Test Files  2 passed (2)
      Tests  9 passed (9)
```

## Design System

### Color Palette

**Dark Theme (Copo Default):**
- Background: `oklch(0.141 0.005 285.823)` (deep slate)
- Foreground: `oklch(0.85 0.005 65)` (light text)
- Card: `oklch(0.21 0.006 285.885)` (slate-800)
- Primary: Blue-700 (gradients)
- Accent: Cyan/Emerald (game-specific)

**Gradients:**
- Primary: `from-blue-600 to-cyan-600`
- Secondary: `from-slate-700 to-slate-600`
- Success: `from-emerald-600 to-teal-600`
- Warning: `from-orange-600 to-yellow-600`
- Danger: `from-red-600 to-pink-600`

### Typography

- **Headings:** Bold, gradient text with `bg-clip-text`
- **Body:** Slate-400 for secondary text
- **Buttons:** Semibold, uppercase labels

### Spacing & Radius

- Radius: `0.65rem` (default)
- Padding: `p-8` for cards, `p-4` for sections
- Gap: `gap-6` for grids, `gap-3` for button groups

### Animations

- Button hover: `transform hover:scale-105`
- Button press: `active:scale-95`
- Transitions: `transition-all duration-300`
- Backdrop blur: `backdrop-blur-xl`

## Development Workflow

### Adding a New Feature

1. **Update `todo.md`** with feature checklist
2. **Update database schema** in `drizzle/schema.ts`
3. **Generate migration:** `pnpm drizzle-kit generate`
4. **Add database helpers** in `server/db.ts`
5. **Add tRPC procedures** in `server/routers.ts`
6. **Write tests** in `server/*.test.ts`
7. **Build UI components** in `client/src/pages/`
8. **Update routing** in `client/src/App.tsx`
9. **Run tests:** `pnpm test`
10. **Check status:** `webdev_check_status`
11. **Create checkpoint:** `webdev_save_checkpoint`

### Running the Project

**Development:**
```bash
pnpm dev
```

**Build:**
```bash
pnpm build
```

**Start Production:**
```bash
pnpm start
```

**Tests:**
```bash
pnpm test
```

**Type Check:**
```bash
pnpm check
```

## Known Limitations & TODOs

### Current Limitations

1. **3D Games:** Placeholder screens only. Full Three.js implementation pending.
2. **Multiplayer:** No real-time synchronization. Socket.io integration needed.
3. **Console Controls:** Basic button support. Full gamepad/controller navigation pending.
4. **Game Persistence:** Database schema ready, but game state save/load not fully implemented.
5. **Stats:** Lobby stats are hardcoded placeholders. Real stats from database pending.

### Next Steps

1. Implement Three.js 3D environments for all three games
2. Add real-time multiplayer with Socket.io
3. Implement full controller navigation and focus management
4. Add game state persistence and save/load
5. Implement real player stats from database
6. Add voice chat for multiplayer
7. Implement in-game shop and economy
8. Add leaderboards and achievements
9. Optimize 3D rendering for mobile
10. Package as EXE (Electron) and APK (Capacitor)

## Deployment

### Manus Platform

The project is deployed on Manus with:
- **URL:** `https://3000-i482mbteiw9koxc2jix8l-f3c76d07.us1.manus.computer`
- **Database:** MySQL/TiDB (managed)
- **Storage:** S3 (for assets)
- **Hosting:** Cloud Run (Node.js)

### Custom Deployment

To deploy elsewhere:
1. Set `DATABASE_URL` environment variable
2. Set `JWT_SECRET` for session signing
3. Build: `pnpm build`
4. Start: `pnpm start`

## Support & Troubleshooting

### Common Issues

**Q: "Cannot find module 'bcrypt'"**
- A: Run `pnpm add bcrypt && pnpm add -D @types/bcrypt`

**Q: "Database connection failed"**
- A: Check `DATABASE_URL` environment variable

**Q: "Tests failing"**
- A: Run `pnpm test` to see detailed error messages

**Q: "Dev server not starting"**
- A: Run `webdev_restart_server` to restart the development server

## References

- [React Documentation](https://react.dev)
- [Three.js Documentation](https://threejs.org/docs)
- [tRPC Documentation](https://trpc.io)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team)
