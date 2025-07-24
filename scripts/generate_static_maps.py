#!/usr/bin/env python3
"""
Generate static choropleth maps for Chicago ICE visualization
Creates publication-quality figures for race, income, and race-income ICE measures
"""

import json
import geopandas as gpd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.colors import LinearSegmentedColormap
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# Define paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "public" / "data"
OUTPUT_DIR = PROJECT_DIR / "static_maps"

# Create output directory
OUTPUT_DIR.mkdir(exist_ok=True)

# ICE color scale matching the web app
ICE_COLORS = [
    '#67000d',  # -1.0: Deep red (extreme deprivation)
    '#a50f15',  # -0.8
    '#cb181d',  # -0.6
    '#ef3b2c',  # -0.4
    '#fb6a4a',  # -0.2
    '#ffffff',  #  0.0: White (neutral)
    '#6baed6',  #  0.2
    '#3182bd',  #  0.4
    '#08519c',  #  0.6
    '#084594',  #  0.8
    '#08306b',  #  1.0: Deep blue (extreme privilege)
]

ICE_BREAKPOINTS = [-1.0, -0.8, -0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0]

# Create custom colormap
def create_ice_colormap():
    """Create a custom colormap matching the web app colors"""
    n_bins = len(ICE_COLORS) - 1
    cmap_list = []
    
    for i in range(n_bins):
        start_val = (ICE_BREAKPOINTS[i] + 1) / 2  # Normalize to 0-1
        end_val = (ICE_BREAKPOINTS[i + 1] + 1) / 2
        cmap_list.append((start_val, ICE_COLORS[i]))
        cmap_list.append((end_val, ICE_COLORS[i]))
    
    return LinearSegmentedColormap.from_list('ice_colormap', cmap_list)

def load_data():
    """Load Chicago census tract and community area data"""
    print("Loading GeoJSON data...")
    
    # Load census tracts with ICE data
    tracts = gpd.read_file(DATA_DIR / "chicago-tracts-ice.geojson")
    
    # Load community areas
    communities = gpd.read_file(DATA_DIR / "chicago-community-areas.geojson")
    
    # Ensure CRS is set
    if tracts.crs is None:
        tracts.set_crs('EPSG:4326', inplace=True)
    if communities.crs is None:
        communities.set_crs('EPSG:4326', inplace=True)
    
    print(f"Loaded {len(tracts)} census tracts and {len(communities)} community areas")
    
    return tracts, communities

def create_choropleth_map(gdf, column, title, output_name, communities=None, show_priority=False):
    """Create a single choropleth map"""
    
    # Create figure and axis
    fig, ax = plt.subplots(1, 1, figsize=(12, 14))
    
    # Filter out missing values
    valid_data = gdf[gdf[column].notna()].copy()
    
    # Create the choropleth
    valid_data.plot(
        column=column,
        cmap=create_ice_colormap(),
        linewidth=0.1,
        edgecolor='#e5e7eb',
        vmin=-1.0,
        vmax=1.0,
        ax=ax,
        legend=False
    )
    
    # Add community area boundaries if provided
    if communities is not None:
        communities.boundary.plot(
            ax=ax,
            color='#1e293b',
            linewidth=1.5,
            linestyle='--',
            alpha=0.8
        )
    
    # Highlight priority areas (ICE < -0.4) if requested
    if show_priority:
        priority = valid_data[valid_data[column] < -0.4]
        if len(priority) > 0:
            priority.boundary.plot(
                ax=ax,
                color='#dc2626',
                linewidth=2,
                alpha=0.8
            )
    
    # Set title
    ax.set_title(title, fontsize=18, fontweight='bold', pad=20)
    
    # Remove axes
    ax.set_axis_off()
    
    # Add custom legend
    legend_elements = []
    for i in range(len(ICE_BREAKPOINTS) - 1):
        label = f'{ICE_BREAKPOINTS[i]:.1f} to {ICE_BREAKPOINTS[i+1]:.1f}'
        if ICE_BREAKPOINTS[i] == -1.0:
            label = f'≤ {ICE_BREAKPOINTS[i+1]:.1f} (Extreme Deprivation)'
        elif ICE_BREAKPOINTS[i+1] == 1.0:
            label = f'≥ {ICE_BREAKPOINTS[i]:.1f} (Extreme Privilege)'
        
        legend_elements.append(
            mpatches.Rectangle((0, 0), 1, 1, fc=ICE_COLORS[i], ec='black', linewidth=0.5)
        )
    
    # Create legend
    legend = ax.legend(
        handles=legend_elements[::-1],  # Reverse order (high to low)
        labels=[
            '0.8 to 1.0 (Extreme Privilege)',
            '0.6 to 0.8',
            '0.4 to 0.6',
            '0.2 to 0.4',
            '0.0 to 0.2',
            '-0.2 to 0.0',
            '-0.4 to -0.2',
            '-0.6 to -0.4',
            '-0.8 to -0.6',
            '-1.0 to -0.8 (Extreme Deprivation)'
        ],
        loc='lower left',
        bbox_to_anchor=(0.02, 0.02),
        frameon=True,
        fancybox=True,
        shadow=True,
        title='ICE Value',
        title_fontsize=12,
        fontsize=10
    )
    
    # Add north arrow
    x, y = 0.95, 0.95
    ax.annotate('N', xy=(x, y), xytext=(x, y-0.04),
                xycoords='axes fraction',
                fontsize=16, fontweight='bold',
                ha='center', va='bottom',
                arrowprops=dict(arrowstyle='-|>', lw=2, color='black'))
    
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
    
    # Also save as PDF
    output_path_pdf = OUTPUT_DIR / f"{output_name}.pdf"
    plt.savefig(output_path_pdf, bbox_inches='tight', facecolor='white')
    print(f"Saved: {output_path_pdf}")
    
    plt.close()

def generate_all_maps():
    """Generate all static choropleth maps"""
    
    # Load data
    tracts, communities = load_data()
    
    # Map configurations
    maps_config = [
        {
            'column': 'ice_race',
            'title': 'Chicago Census Tracts: ICE for Racial Segregation\n(White NH - Black NH) / Total Population',
            'output': 'chicago_ice_race_tracts'
        },
        {
            'column': 'ice_income',
            'title': 'Chicago Census Tracts: ICE for Economic Segregation\n(High Income - Low Income) / Total Households',
            'output': 'chicago_ice_income_tracts'
        },
        {
            'column': 'ice_race_income',
            'title': 'Chicago Census Tracts: ICE for Racialized Economic Segregation\n(White High Income - Black Low Income) / Total Households',
            'output': 'chicago_ice_race_income_tracts'
        }
    ]
    
    # Generate maps
    for config in maps_config:
        print(f"\nGenerating {config['output']}...")
        
        # Basic map
        create_choropleth_map(
            tracts, 
            config['column'], 
            config['title'],
            config['output'],
            communities=None,
            show_priority=False
        )
        
        # Map with community boundaries
        create_choropleth_map(
            tracts, 
            config['column'], 
            config['title'] + '\n(with Community Area Boundaries)',
            config['output'] + '_with_communities',
            communities=communities,
            show_priority=False
        )
        
        # Map with priority areas highlighted
        create_choropleth_map(
            tracts, 
            config['column'], 
            config['title'] + '\n(Priority Areas Highlighted in Red)',
            config['output'] + '_priority',
            communities=communities,
            show_priority=True
        )
    
    # Generate summary statistics
    print("\n" + "="*50)
    print("Summary Statistics:")
    print("="*50)
    
    for config in maps_config:
        col = config['column']
        valid_data = tracts[tracts[col].notna()][col]
        
        print(f"\n{config['column'].upper()}:")
        print(f"  Count: {len(valid_data)}")
        print(f"  Min: {valid_data.min():.3f}")
        print(f"  Max: {valid_data.max():.3f}")
        print(f"  Mean: {valid_data.mean():.3f}")
        print(f"  Median: {valid_data.median():.3f}")
        print(f"  Priority Areas (< -0.4): {(valid_data < -0.4).sum()}")

if __name__ == "__main__":
    print("Chicago ICE Static Map Generator")
    print("================================\n")
    
    # Check if required packages are installed
    try:
        import geopandas
        import matplotlib
        print("✓ Required packages installed")
    except ImportError as e:
        print("✗ Missing required packages!")
        print("\nPlease install with:")
        print("pip install geopandas matplotlib")
        exit(1)
    
    # Generate all maps
    generate_all_maps()
    
    print(f"\n✓ All maps generated successfully!")
    print(f"Output directory: {OUTPUT_DIR}")