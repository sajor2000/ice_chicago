#!/usr/bin/env python3
"""
Generate all variations of static choropleth maps for Chicago ICE visualization
Creates comprehensive set of maps with different styles and overlays
"""

import json
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import Polygon
from matplotlib.collections import PatchCollection
import numpy as np
from pathlib import Path
from datetime import datetime

# Define paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "public" / "data"
PREPARED_DIR = PROJECT_DIR / "mapbox-upload"
OUTPUT_DIR = PROJECT_DIR / "static_maps_complete"

# Create organized output directories
OUTPUT_DIR.mkdir(exist_ok=True)
for subdir in ['by_measure', 'with_communities', 'priority_areas', 'combined']:
    (OUTPUT_DIR / subdir).mkdir(exist_ok=True)

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

def extract_coordinates(geometry):
    """Extract coordinates from various geometry types"""
    coords_list = []
    
    if geometry['type'] == 'Polygon':
        coords_list.append(geometry['coordinates'][0])
    elif geometry['type'] == 'MultiPolygon':
        for polygon in geometry['coordinates']:
            coords_list.append(polygon[0])
    
    return coords_list

def create_comprehensive_map(tract_data, community_data, ice_measure, config):
    """Create a comprehensive choropleth map with all features"""
    
    # Create figure
    fig, ax = plt.subplots(1, 1, figsize=(14, 16))
    
    # Process tract features
    tract_patches = []
    tract_colors = []
    priority_patches = []
    
    for feature in tract_data['features']:
        coords_list = extract_coordinates(feature['geometry'])
        
        for coords in coords_list:
            polygon = Polygon(coords)
            tract_patches.append(polygon)
            
            # Get ICE value and color
            ice_value = feature['properties'].get(ice_measure, None)
            color = get_color_for_value(ice_value)
            tract_colors.append(color)
            
            # Check if priority area
            if ice_value is not None and ice_value < -0.4 and config.get('show_priority'):
                priority_patches.append(polygon)
    
    # Create tract collection
    tract_collection = PatchCollection(
        tract_patches, 
        facecolors=tract_colors, 
        edgecolors='#e5e7eb', 
        linewidths=0.3
    )
    ax.add_collection(tract_collection)
    
    # Add community boundaries if requested
    if config.get('show_communities') and community_data:
        community_patches = []
        
        for feature in community_data['features']:
            coords_list = extract_coordinates(feature['geometry'])
            
            for coords in coords_list:
                polygon = Polygon(coords)
                community_patches.append(polygon)
        
        community_collection = PatchCollection(
            community_patches,
            facecolors='none',
            edgecolors='#1e293b',
            linewidths=2,
            linestyles='--',
            alpha=0.8
        )
        ax.add_collection(community_collection)
    
    # Highlight priority areas
    if config.get('show_priority') and priority_patches:
        priority_collection = PatchCollection(
            priority_patches,
            facecolors='none',
            edgecolors='#dc2626',
            linewidths=2.5,
            alpha=0.9
        )
        ax.add_collection(priority_collection)
    
    # Set plot limits
    ax.autoscale_view()
    
    # Set title
    ax.set_title(config['title'], fontsize=18, fontweight='bold', pad=20)
    
    # Add subtitle if provided
    if config.get('subtitle'):
        ax.text(0.5, 0.98, config['subtitle'], 
                transform=ax.transAxes, 
                ha='center', 
                fontsize=12, 
                style='italic')
    
    # Remove axes
    ax.set_axis_off()
    
    # Add comprehensive legend
    create_comprehensive_legend(ax, config)
    
    # Add metadata
    add_metadata(ax, ice_measure, tract_data)
    
    # Add north arrow
    add_north_arrow(ax)
    
    # Add scale bar (approximate)
    add_scale_bar(ax)
    
    # Tight layout
    plt.tight_layout()
    
    # Save figure
    output_path = OUTPUT_DIR / config['output_dir'] / f"{config['filename']}.png"
    plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
    print(f"  ✓ Saved: {output_path.name}")
    
    # Also save high-res version
    if config.get('save_highres'):
        highres_path = OUTPUT_DIR / config['output_dir'] / f"{config['filename']}_highres.png"
        plt.savefig(highres_path, dpi=600, bbox_inches='tight', facecolor='white')
        print(f"  ✓ Saved high-res: {highres_path.name}")
    
    plt.close()

def create_comprehensive_legend(ax, config):
    """Create a comprehensive legend with all elements"""
    legend_elements = []
    legend_labels = []
    
    # ICE value legend
    for value, color in sorted(ICE_COLORS.items(), reverse=True):
        legend_elements.append(
            mpatches.Rectangle((0, 0), 1, 1, fc=color, ec='black', linewidth=0.5)
        )
        
        if value == 1.0:
            legend_labels.append('≥ 0.8 (Extreme Privilege)')
        elif value == -1.0:
            legend_labels.append('≤ -0.8 (Extreme Deprivation)')
        elif value == 0.0:
            legend_labels.append('0.0 (Neutral)')
        else:
            legend_labels.append(f'{value:.1f}')
    
    # Add additional legend elements if needed
    if config.get('show_communities'):
        legend_elements.append(
            mpatches.Rectangle((0, 0), 1, 1, fc='none', ec='#1e293b', 
                             linewidth=2, linestyle='--')
        )
        legend_labels.append('Community Area Boundary')
    
    if config.get('show_priority'):
        legend_elements.append(
            mpatches.Rectangle((0, 0), 1, 1, fc='none', ec='#dc2626', linewidth=2.5)
        )
        legend_labels.append('Priority Area (ICE < -0.4)')
    
    # Create legend
    legend = ax.legend(
        handles=legend_elements,
        labels=legend_labels,
        loc='lower left',
        bbox_to_anchor=(0.02, 0.02),
        frameon=True,
        fancybox=True,
        shadow=True,
        title='Legend',
        title_fontsize=14,
        fontsize=11,
        ncol=1 if len(legend_elements) <= 15 else 2
    )
    
    legend.get_title().set_fontweight('bold')

def add_metadata(ax, ice_measure, data):
    """Add metadata to the map"""
    # Calculate statistics
    values = []
    for feature in data['features']:
        value = feature['properties'].get(ice_measure)
        if value is not None and not np.isnan(value):
            values.append(value)
    
    if values:
        stats_text = (
            f'Census Tracts: {len(values)}\n'
            f'Mean: {np.mean(values):.3f}\n'
            f'Median: {np.median(values):.3f}\n'
            f'Min: {np.min(values):.3f}\n'
            f'Max: {np.max(values):.3f}'
        )
        
        ax.text(0.98, 0.15, stats_text,
                transform=ax.transAxes, 
                fontsize=9, 
                ha='right', 
                va='bottom',
                bbox=dict(boxstyle='round,pad=0.5', facecolor='white', alpha=0.8))
    
    # Add data source
    ax.text(0.98, 0.02, 
            'Data: U.S. Census Bureau, ACS 2022 5-Year Estimates\n' + 
            f'Generated: {datetime.now().strftime("%Y-%m-%d")}',
            transform=ax.transAxes, 
            fontsize=8, 
            ha='right', 
            va='bottom',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.8))

def add_north_arrow(ax):
    """Add a north arrow to the map"""
    x, y = 0.95, 0.92
    ax.annotate('N', xy=(x, y), xytext=(x, y-0.04),
                xycoords='axes fraction',
                fontsize=16, fontweight='bold',
                ha='center', va='bottom',
                arrowprops=dict(arrowstyle='-|>', lw=2, color='black'))

def add_scale_bar(ax):
    """Add an approximate scale bar"""
    # This is approximate for Chicago's latitude
    ax.plot([0.8, 0.9], [0.05, 0.05], 'k-', lw=3, transform=ax.transAxes)
    ax.text(0.85, 0.06, '~5 miles', transform=ax.transAxes, 
            ha='center', fontsize=9)

def generate_all_map_variations():
    """Generate all map variations"""
    
    print("Loading data...")
    
    # Load prepared data
    tract_data = load_geojson(PREPARED_DIR / "chicago-tracts-ice-prepared.geojson")
    community_data = load_geojson(PREPARED_DIR / "chicago-community-areas-ice-prepared.geojson")
    
    # Define all map configurations
    measures = [
        {
            'column': 'ice_race',
            'name': 'Racial Segregation',
            'formula': '(White NH - Black NH) / Total Population'
        },
        {
            'column': 'ice_income',
            'name': 'Economic Segregation',
            'formula': '(High Income - Low Income) / Total Households'
        },
        {
            'column': 'ice_race_income',
            'name': 'Racialized Economic Segregation',
            'formula': '(White High Income - Black Low Income) / Total Households'
        }
    ]
    
    print("\nGenerating maps...\n")
    
    # 1. Basic maps by measure
    print("1. Basic choropleth maps:")
    for measure in measures:
        config = {
            'title': f'Chicago Census Tracts: ICE for {measure["name"]}',
            'subtitle': measure['formula'],
            'output_dir': 'by_measure',
            'filename': f'ice_{measure["column"][4:]}_basic',
            'show_communities': False,
            'show_priority': False
        }
        create_comprehensive_map(tract_data, None, measure['column'], config)
    
    # 2. Maps with community boundaries
    print("\n2. Maps with community boundaries:")
    for measure in measures:
        config = {
            'title': f'Chicago Census Tracts: ICE for {measure["name"]}',
            'subtitle': f'{measure["formula"]} | 77 Community Areas Shown',
            'output_dir': 'with_communities',
            'filename': f'ice_{measure["column"][4:]}_communities',
            'show_communities': True,
            'show_priority': False
        }
        create_comprehensive_map(tract_data, community_data, measure['column'], config)
    
    # 3. Maps with priority areas highlighted
    print("\n3. Maps with priority areas highlighted:")
    for measure in measures:
        config = {
            'title': f'Chicago Census Tracts: ICE for {measure["name"]}',
            'subtitle': f'{measure["formula"]} | Priority Areas (ICE < -0.4) in Red',
            'output_dir': 'priority_areas',
            'filename': f'ice_{measure["column"][4:]}_priority',
            'show_communities': True,
            'show_priority': True
        }
        create_comprehensive_map(tract_data, community_data, measure['column'], config)
    
    # 4. High-resolution versions for print
    print("\n4. High-resolution versions for print:")
    for measure in measures:
        config = {
            'title': f'Chicago Census Tracts: ICE for {measure["name"]}',
            'subtitle': measure['formula'],
            'output_dir': 'combined',
            'filename': f'ice_{measure["column"][4:]}_print',
            'show_communities': True,
            'show_priority': True,
            'save_highres': True
        }
        create_comprehensive_map(tract_data, community_data, measure['column'], config)
    
    print("\n" + "="*60)
    print("MAP GENERATION COMPLETE!")
    print("="*60)
    print(f"\nAll maps saved to: {OUTPUT_DIR}")
    print("\nGenerated categories:")
    print("  - by_measure/      : Basic choropleth maps")
    print("  - with_communities/: Maps with community boundaries")
    print("  - priority_areas/  : Maps highlighting extreme deprivation")
    print("  - combined/        : Full-featured maps (+ high-res versions)")
    print("\nTotal maps generated:", 
          len(list(OUTPUT_DIR.rglob("*.png"))))

if __name__ == "__main__":
    print("\nChicago ICE Comprehensive Map Generator")
    print("="*40)
    generate_all_map_variations()