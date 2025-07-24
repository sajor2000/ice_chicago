# Chicago ICE Visualization

A modern, interactive web application for visualizing racial and economic segregation patterns in Chicago using the Index of Concentration at the Extremes (ICE).

## Features

- **Interactive Mapbox GL Map**: Smooth, professional cartographic visualization
- **Three ICE Measures**: 
  - Racial segregation (White non-Hispanic vs Black non-Hispanic)
  - Economic segregation (High vs Low income households)
  - Combined racial-economic segregation
- **Modern UI/UX**: Clean, minimalist design with glassmorphism effects
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real Census Data**: Uses 2022 ACS 5-year estimates for Chicago's 866 census tracts
- **Priority Area Highlighting**: Identify areas with extreme deprivation (ICE < -0.4)

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Mapbox GL JS** for mapping
- **Framer Motion** for animations
- **React Map GL** for React integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Mapbox account and access token

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chicago-ice-viz-v2
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local and add your Mapbox token
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Data Sources

- **Census Data**: U.S. Census Bureau ACS 5-Year Estimates (2022)
- **Geographic Boundaries**: Census TIGER/Line Shapefiles
- **ICE Methodology**: Based on Krieger et al. (2016)

## Project Structure

```
chicago-ice-viz-v2/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── map/              # Map-related components
│   ├── panels/           # UI panels
│   └── ui/               # Reusable UI components
├── lib/                   # Utility functions and config
│   ├── mapbox-config.ts  # Mapbox configuration
│   ├── constants.ts      # App constants
│   └── types.ts          # TypeScript types
└── public/               
    └── data/             # GeoJSON data files
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Build for Production

```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Acknowledgments

- Urban Health Equity Lab for the ICE analysis methodology
- U.S. Census Bureau for providing the data
- Mapbox for the mapping platform