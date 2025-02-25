# Web-Based Crypto Wallet (HD Wallet)

This is a Next.js-based web application that generates a secure seed phrase and derives multiple sub-wallets using Hierarchical Deterministic (HD) wallet principles.

## Features
- Generate a 12 or 24-word seed phrase.
- Derive multiple sub-wallets (accounts) from the seed phrase.
- View wallet addresses and corresponding private keys.
- Client-side generation for enhanced security.
- Minimalist and easy-to-use UI.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS
- **Wallet Library:** ethers.js / bitcoinjs-lib (depending on blockchain support)

## Installation

### Prerequisites
- Node.js (>= 16.x)
- npm or yarn

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/hrishabh6/Web3-Wallet.git
   cd Web3-Wallet
   ```
2. Install dependencies:
   ```bash
   npm install  # or yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev  # or yarn dev
   ```
4. Open `http://localhost:3000` in your browser.

## Usage
- Click "Generate Seed Phrase" to create a new seed.
- Save the seed phrase securely.
- Use the seed to generate multiple sub-wallets.
- Copy addresses and private keys as needed.

## Security Considerations
- **DO NOT** expose your seed phrase or private keys.
- Always use secure storage solutions.
- Consider integrating hardware wallet support for enhanced security.

## License
This project is open-source under the MIT License.

---
Feel free to modify this README to fit your project's specifics!

