# Static Choropleth Map Generation

This directory contains Python scripts to generate static choropleth maps for Chicago ICE (Index of Concentration at the Extremes) data.

## Prerequisites

### Option 1: Simple Version (Recommended)
The simple version only requires basic Python packages:

```bash
pip install matplotlib numpy
```

### Option 2: Full GeoPandas Version
For the full-featured version with more capabilities:

```bash
pip install -r scripts/requirements.txt
```

This installs:
- `geopandas` - For advanced geospatial operations
- `matplotlib` - For creating figures
- `numpy` - For numerical operations
- `pandas` - For data manipulation
- `shapely` - For geometric operations
- `pyproj` - For coordinate transformations

## Usage

### 1. First, prepare the data (if not already done):
```bash
npm run prepare-mapbox
```

This creates optimized GeoJSON files in the `mapbox-upload/` directory.

### 2. Generate static maps:

**Simple version (recommended):**
```bash
npm run generate-maps
# or directly:
python3 scripts/generate_static_maps_simple.py
```

**Full GeoPandas version:**
```bash
python3 scripts/generate_static_maps.py
```

## Output

The scripts generate static choropleth maps in the `static_maps/` directory:

### Simple Version Output:
- `chicago_ice_race_simple.png` - Racial segregation map
- `chicago_ice_income_simple.png` - Economic segregation map  
- `chicago_ice_race_income_simple.png` - Racialized economic segregation map

### Full Version Output (if using generate_static_maps.py):
For each ICE measure (race, income, race_income), generates:
- Basic census tract map
- Map with community area boundaries
- Map with priority areas highlighted
- Both PNG and PDF formats

## Map Features

- **Color Scale**: Matches the web application (-1 to +1 scale)
  - Deep red: Extreme deprivation (-1.0)
  - White: Neutral (0.0)
  - Deep blue: Extreme privilege (1.0)
  
- **Legend**: Shows ICE value ranges
- **Data Source**: U.S. Census Bureau, ACS 2022 5-Year Estimates
- **Resolution**: 300 DPI for publication quality

## Customization

Edit the Python scripts to:
- Change figure size (default: 12x14 inches)
- Modify color schemes
- Add/remove map elements
- Change output formats
- Adjust DPI for different use cases

## Troubleshooting

1. **ModuleNotFoundError**: Install required packages with pip
2. **FileNotFoundError**: Run `npm run prepare-mapbox` first
3. **Memory issues**: The simple version uses less memory than GeoPandas

## Example Use Cases

- Academic publications
- Reports and presentations
- Print materials
- Social media graphics
- Grant proposals