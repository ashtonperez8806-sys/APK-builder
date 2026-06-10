# Copo Gaming Platform - Setup & Deployment Guide

## Quick Start

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Type check
pnpm check
```

The dev server runs on `http://localhost:3000`

### Build & Production

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Overview

**Copo** is a cross-platform 3D gaming platform featuring:
- Custom authentication system (register, login, guest)
- Three playable 3D games built with Three.js
- Responsive design for PC, Mobile, and Console
- Real-time game state management
- Database persistence with Drizzle ORM

## Architecture

### Frontend Stack
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Three.js** - 3D graphics
- **Wouter** - Routing
- **Sonner** - Notifications

### Backend Stack
- **Express 4** - HTTP server
- **tRPC 11** - Type-safe RPC
- **Drizzle ORM** - Database access
- **MySQL/TiDB** - Database
- **bcrypt** - Password hashing

### Testing
- **Vitest** - Unit testing
- **9 authentication tests** - Full coverage

## Database Schema

### Core Tables

1. **users** - Manus OAuth integration (fallback)
2. **copo_accounts** - Custom Copo authentication
   - username (unique)
   - passwordHash (bcrypt)
3. **guest_sessions** - Temporary guest access
   - guestId (unique)
   - expiresAt (24-hour TTL)

### Game Progress Tables

4. **plost_progress** - Tree-cutting game state
   - money, wood, carsOwned, landsOwned
   - level, totalTreesCut

5. **miners_tycoon_progress** - Tycoon game state
   - money, drillsOwned, weaponsOwned
   - rebirthCount, baseSize, totalOresMined

6. **hokshot_progress** - Shooting game state
   - money, gunsOwned, explosivesOwned
   - totalKills, totalDeaths, level

## Authentication Flow

### Register
```
POST /api/trpc/auth.register
{
  username: string (3-64 chars)
  password: string (min 6 chars)
  confirmPassword: string (must match)
}
```

### Login
```
POST /api/trpc/auth.login
{
  username: string
  password: string
}
```

### Guest
```
POST /api/trpc/auth.createGuest
```

Returns unique guest ID with 24-hour expiry.

## Game Specifications

### Plost (Tree Cutting)
- **Objective:** Cut trees, collect wood, earn money
- **Mechanics:** Click to cut trees, sell wood, buy land
- **Economy:** Wood → Money → Land/Cars
- **NPCs:** Lumber Store, Jason (Land Store)

### Miners Tycoon
- **Objective:** Mine ore, expand base, earn money
- **Mechanics:** Buy drills, mine ore, rebirth for expansion
- **Progression:** Money → Drills → Rebirth → Bigger Base
- **Features:** Drill animation, ore deposits, rebirth multiplier

### HOKSHOT (Shooting)
- **Objective:** Shoot opponents, earn money per kill
- **Mechanics:** Shoot, respawn, buy weapons
- **Economy:** Kills → Money → Weapons/Explosives
- **Features:** Arena, obstacles, spawn points, shop

## Deployment

### Manus Platform (Current)
The project is deployed on Manus with:
- **URL:** `https://3000-i482mbteiw9koxc2jix8l-f3c76d07.us1.manus.computer`
- **Database:** MySQL/TiDB (managed)
- **Storage:** S3 (for assets)
- **Runtime:** Cloud Run (Node.js)

### Custom Deployment

#### Environment Variables
```
DATABASE_URL=mysql://user:pass@host:3306/copo
JWT_SECRET=your-secret-key
NODE_ENV=production
```

#### Docker
```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

#### Railway/Render/Vercel
1. Connect GitHub repository
2. Set environment variables
3. Deploy with `pnpm build && pnpm start`

## Packaging

### EXE (Windows/Mac)
```bash
# Using Electron
npm install -D electron electron-builder
npm run build:electron
```

### APK (Android)
```bash
# Using Capacitor
npm install -D @capacitor/core @capacitor/cli
npx cap add android
npx cap build android
```

## File Structure

```
copo-gaming/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AuthHome.tsx       # Home screen
│   │   │   ├── Login.tsx          # Login
│   │   │   ├── Register.tsx       # Register
│   │   │   ├── GameLobby.tsx      # Game selection
│   │   │   ├── PlostGame.tsx      # Plost game
│   │   │   ├── MinersTycoonGame.tsx # Miners Tycoon
│   │   │   ├── HokshotGame.tsx    # HOKSHOT game
│   │   │   └── GameScreen.tsx     # Game router
│   │   ├── App.tsx                # Main router
│   │   ├── index.css              # Global styles
│   │   └── lib/trpc.ts            # tRPC client
│   └── index.html
├── server/
│   ├── routers.ts                 # tRPC procedures
│   ├── db.ts                      # Database queries
│   ├── auth.copo.test.ts          # Auth tests
│   └── _core/                     # Framework
├── drizzle/
│   ├── schema.ts                  # Database schema
│   └── migrations/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── README_SETUP.md                # This file
```

## Testing

### Run All Tests
```bash
pnpm test
```

### Test Coverage
- ✅ Authentication (9 tests)
  - Register validation
  - Login verification
  - Guest session creation
  - Logout cookie clearing
  - User info retrieval

### Add New Tests
```typescript
// server/feature.test.ts
import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("feature", () => {
  it("should do something", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.feature.action();
    expect(result).toBeDefined();
  });
});
```

## Performance Optimization

### Frontend
- Code splitting with Vite
- Lazy loading game components
- Three.js LOD (Level of Detail)
- Responsive images

### Backend
- Database connection pooling
- Query optimization with Drizzle
- tRPC request batching
- Caching strategies

### Deployment
- CDN for static assets
- Gzip compression
- HTTP/2 support
- Cloud Run auto-scaling

## Troubleshooting

### Database Connection Failed
```
Error: Cannot connect to database
Solution: Check DATABASE_URL environment variable
```

### Three.js Not Rendering
```
Error: WebGL context lost
Solution: Check browser WebGL support, clear cache
```

### Authentication Issues
```
Error: Invalid credentials
Solution: Verify username/password, check bcrypt hash
```

### Build Errors
```
Error: Module not found
Solution: Run pnpm install, check imports
```

## Next Steps

### Planned Features
1. Real-time multiplayer with Socket.io
2. Advanced game mechanics
3. Leaderboards and achievements
4. Voice chat integration
5. Console controller support
6. Mobile app optimization
7. Payment integration (Stripe)
8. Social features (friends, guilds)

### Performance Improvements
1. Three.js optimization
2. Database query optimization
3. Frontend bundle size reduction
4. Server-side rendering (SSR)
5. Service worker caching

### Quality Assurance
1. E2E testing with Playwright
2. Performance monitoring
3. Error tracking (Sentry)
4. Analytics integration
5. User feedback collection

## Support & Resources

- **Documentation:** See `IMPLEMENTATION_GUIDE.md`
- **Tests:** Run `pnpm test` for full coverage
- **Development:** Run `pnpm dev` for hot reload
- **Build:** Run `pnpm build` for production

## License

This project is proprietary. All rights reserved.

---

**Last Updated:** June 10, 2026
**Version:** 1.0.0
**Status:** Active Development
