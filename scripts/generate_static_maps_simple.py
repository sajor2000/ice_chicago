#!/usr/bin/env python3
"""
Simplified version to generate static choropleth maps for Chicago ICE visualization
Works with the prepared GeoJSON files in mapbox-upload directory
"""

import json
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import Polygon
from matplotlib.collections import PatchCollection
import numpy as np
from pathlib import Path

# Define paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "mapbox-upload"
OUTPUT_DIR = PROJECT_DIR / "static_maps"

# Create output directory
OUTPUT_DIR.mkdir(exist_ok=True)

# ICE color scale
ICE_COLORS = {
    -1.0: '#67000d',  # Deep red (extreme deprivation)
    -0.8: '#a50f15',
    -0.6: '#cb181d',
    -0.4: '#ef3b2c',
    -0.2: '#fb6a4a',
    0.0: '#ffffff',   # White (neutral)
    0.2: '#6baed6',
    0.4: '#3182bd',
    0.6: '#08519c',
    0.8: '#084594',
    1.0: '#08306b',   # Deep blue (extreme privilege)
}

def get_color_for_value(value):
    """Get color for an ICE value"""
    if value is None or np.isnan(value):
        return '#cccccc'
    
    # Find the appropriate color bracket
    breakpoints = sorted(ICE_COLORS.keys())
    for i in range(len(breakpoints) - 1):
        if breakpoints[i] <= value < breakpoints[i + 1]:
            return ICE_COLORS[breakpoints[i]]
    
    # Handle edge cases
    if value <= -1.0:
        return ICE_COLORS[-1.0]
    elif value >= 1.0:
        return ICE_COLORS[1.0]
    
    return '#cccccc'

def load_geojson(filepath):
    """Load a GeoJSON file"""
    with open(filepath, 'r') as f:
        return json.load(f)

def create_simple_choropleth(geojson_path, ice_measure, title, output_name):
    """Create a choropleth map from GeoJSON data"""
    
    # Load data
    print(f"Loading {geojson_path}...")
    data = load_geojson(geojson_path)
    
    # Create figure
    fig, ax = plt.subplots(1, 1, figsize=(12, 14))
    
    # Process features
    patches = []
    colors = []
    
    for feature in data['features']:
        if feature['geometry']['type'] == 'Polygon':
            coords = feature['geometry']['coordinates'][0]
            polygon = Polygon(coords)
            patches.append(polygon)
            
            # Get ICE value
            ice_value = feature['properties'].get(ice_measure, None)
            color = get_color_for_value(ice_value)
            colors.append(color)
        
        elif feature['geometry']['type'] == 'MultiPolygon':
            for polygon_coords in feature['geometry']['coordinates']:
                polygon = Polygon(polygon_coords[0])
                patches.append(polygon)
                
                # Get ICE value
                ice_value = feature['properties'].get(ice_measure, None)
                color = get_color_for_value(ice_value)
                colors.append(color)
    
    # Create patch collection
    p = PatchCollection(patches, facecolors=colors, edgecolors='#e5e7eb', linewidths=0.5)
    ax.add_collection(p)
    
    # Set plot limits
    ax.autoscale_view()
    
    # Set title
    ax.set_title(title, fontsize=16, fontweight='bold', pad=20)
    
    # Remove axes
    ax.set_axis_off()
    
    # Add legend
    legend_elements = []
    legend_labels = []
    
    for value, color in sorted(ICE_COLORS.items(), reverse=True):
        legend_elements.append(
            mpatches.Rectangle((0, 0), 1, 1, fc=color, ec='black', linewidth=0.5)
        )
        
        if value == 1.0:
            legend_labels.append('≥ 0.8 (Extreme Privilege)')
        elif value == -1.0:
            legend_labels.append('≤ -0.8 (Extreme Deprivation)')
        else:
            legend_labels.append(f'{value:.1f}')
    
    ax.legend(
        handles=legend_elements,
        labels=legend_labels,
        loc='lower left',
        bbox_to_anchor=(0.02, 0.02),
        frameon=True,
        fancybox=True,
        shadow=True,
        title='ICE Value',
        title_fontsize=12,
        fontsize=10
    )
    
    # Add data source
    ax.text(0.98, 0.02, 'Data: U.S. Census Bureau, ACS 2022 5-Year Estimates',
            transform=ax.transAxes, fontsize=8, ha='right', va='bottom',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))
    
    # Tight layout
    plt.tight_layout()
    
    # Save figure
    output_path = OUTPUT_DIR / f"{output_name}.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
    print(f"Saved: {output_path}")
    
    plt.close()

def main():
    """Generate all static maps"""
    
    print("Chicago ICE Static Map Generator (Simple Version)")
    print("=" * 50)
    
    # Check if data exists
    tract_file = DATA_DIR / "chicago-tracts-ice-prepared.geojson"
    community_file = DATA_DIR / "chicago-community-areas-ice-prepared.geojson"
    
    if not tract_file.exists():
        print(f"Error: {tract_file} not found!")
        print("Please run 'npm run prepare-mapbox' first to generate the prepared files.")
        return
    
    # Map configurations
    maps = [
        {
            'file': tract_file,
            'measure': 'ice_race',
            'title': 'Chicago Census Tracts: ICE for Racial Segregation\n(White NH - Black NH) / Total Population',
            'output': 'chicago_ice_race_simple'
        },
        {
            'file': tract_file,
            'measure': 'ice_income',
            'title': 'Chicago Census Tracts: ICE for Economic Segregation\n(High Income - Low Income) / Total Households',
            'output': 'chicago_ice_income_simple'
        },
        {
            'file': tract_file,
            'measure': 'ice_race_income',
            'title': 'Chicago Census Tracts: ICE for Racialized Economic Segregation\n(White High Income - Black Low Income) / Total Households',
            'output': 'chicago_ice_race_income_simple'
        },
    ]
    
    # Generate maps
    for config in maps:
        print(f"\nGenerating {config['output']}...")
        create_simple_choropleth(
            config['file'],
            config['measure'],
            config['title'],
            config['output']
        )
    
    print(f"\n✓ All maps generated successfully!")
    print(f"Output directory: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()