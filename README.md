# Schedulr - Base MiniApp

Effortless group scheduling and niche service booking on Base.

## Features

- **Niche Service Finder**: Discover and book specialized services
- **Group Scheduling**: Coordinate with friends to find common availability
- **Smart Waitlists**: Get notified when cancellations open up slots
- **Automated Reminders**: Never miss an appointment again

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local` and add your OnchainKit API key
   - Get your API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base network integration via MiniKit
- **UI**: Tailwind CSS with custom design system
- **Identity**: OnchainKit for wallet and social features
- **TypeScript**: Full type safety throughout

## Architecture

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx           # Main landing page
├── providers.tsx      # MiniKit and OnchainKit setup
└── globals.css        # Tailwind and custom styles

components/
├── ui/                # Reusable UI components
├── layout/            # Layout components
└── features/          # Feature-specific components

lib/
├── types.ts           # TypeScript type definitions
├── utils.ts           # Utility functions
└── constants.ts       # App constants and mock data
```

## Base MiniApp Features

- **Social Integration**: Leverages Farcaster identity and social features
- **Micro-transactions**: Premium features via Base network payments
- **Frame Actions**: In-frame booking and scheduling actions
- **Notifications**: Real-time updates for bookings and availability

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_CHAIN_NAME=base
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
