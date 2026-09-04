# SenseMath (QAMA Mental Estimation Calculator)

A mental estimation calculator built on the **QAMA** (*Quick Approximations, Meaningful Arithmetic*) philosophy invented by physicist Ilan Samson.

Instead of outputting answers passively, **SenseMath** prompts you to enter a reasonable approximation before unlocking the exact result.

## Features

- **Mode 1: Enter Task**: Type any mathematical expression (arithmetic, powers, roots, parentheses) and supply your estimate before the calculator confirms it.
- **Mode 2: Simulate Problem**: Practice mental estimation across arithmetic, decimals, percentages, and scientific powers of 10.
- **Adjustable Tolerance**: Choose from Strict (±5%), Standard (±10%), Relaxed (±20%), or custom percentages (2% - 50%).
- **Visual Accuracy Gauge**: Interactive number line showing exact answer, allowed acceptance window, and your estimate.
- **Zero API Dependency**: 100% client-side calculation, parsing, and Web Audio feedback. Runs completely offline.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deploying to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and select this repository.
3. Click **Deploy**. Vercel will auto-detect Vite with no special configuration required.

## License

[MIT](LICENSE)
