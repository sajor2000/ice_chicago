#!/usr/bin/env python3
"""
Aggregate census tract ICE values to community area level
Creates population-weighted averages for each community area
"""

import json
import numpy as np
from pathlib import Path
from collections import defaultdict

# Define paths
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "public" / "data"
OUTPUT_DIR = PROJECT_DIR / "public" / "data"

# Chicago community area names
COMMUNITY_NAMES = {
    1: "Rogers Park", 2: "West Ridge", 3: "Uptown", 4: "Lincoln Square",
    5: "North Center", 6: "Lake View", 7: "Lincoln Park", 8: "Near North Side",
    9: "Edison Park", 10: "Norwood Park", 11: "Jefferson Park", 12: "Forest Glen",
    13: "North Park", 14: "Albany Park", 15: "Portage Park", 16: "Irving Park",
    17: "Dunning", 18: "Montclare", 19: "Belmont Cragin", 20: "Hermosa",
    21: "Avondale", 22: "Logan Square", 23: "Humboldt Park", 24: "West Town",
    25: "Austin", 26: "West Garfield Park", 27: "East Garfield Park", 28: "Near West Side",
    29: "North Lawndale", 30: "South Lawndale", 31: "Lower West Side", 32: "Loop",
    33: "Near South Side", 34: "Armour Square", 35: "Douglas", 36: "Oakland",
    37: "Fuller Park", 38: "Grand Boulevard", 39: "Kenwood", 40: "Washington Park",
    41: "Hyde Park", 42: "Woodlawn", 43: "South Shore", 44: "Chatham",
    45: "Avalon Park", 46: "South Chicago", 47: "Burnside", 48: "Calumet Heights",
    49: "Roseland", 50: "Pullman", 51: "South Deering", 52: "East Side",
    53: "West Pullman", 54: "Riverdale", 55: "Hegewisch", 56: "Garfield Ridge",
    57: "Archer Heights", 58: "Brighton Park", 59: "McKinley Park", 60: "Bridgeport",
    61: "New City", 62: "West Elsdon", 63: "Gage Park", 64: "Clearing",
    65: "West Lawn", 66: "Chicago Lawn", 67: "West Englewood", 68: "Englewood",
    69: "Greater Grand Crossing", 70: "Ashburn", 71: "Auburn Gresham", 72: "Beverly",
    73: "Washington Heights", 74: "Mount Greenwood", 75: "Morgan Park", 76: "O'Hare",
    77: "Edgewater"
}

def load_geojson(filepath):
    """Load a GeoJSON file"""
    with open(filepath, 'r') as f:
        return json.load(f)

def save_geojson(data, filepath):
    """Save a GeoJSON file"""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def aggregate_ice_values():
    """Aggregate tract-level ICE values to community areas"""
    
    print("Loading data...")
    
    # Load census tracts with ICE data
    tracts = load_geojson(DATA_DIR / "chicago-tracts-ice.geojson")
    
    # Load community areas
    communities = load_geojson(DATA_DIR / "chicago-community-areas-ice.geojson")
    
    # Create mapping of community area number to aggregated data
    community_data = defaultdict(lambda: {
        'total_pop': 0,
        'weighted_ice_race': 0,
        'weighted_ice_income': 0,
        'weighted_ice_race_income': 0,
        'tract_count': 0,
        'tracts_with_data': 0
    })
    
    print("Aggregating tract data to community areas...")
    
    # Process each tract
    for tract in tracts['features']:
        props = tract['properties']
        
        # Get community area number
        comm_area = props.get('community')
        if not comm_area:
            continue
            
        # Try to parse community area number
        try:
            if isinstance(comm_area, str) and comm_area.startswith('Area '):
                comm_num = int(comm_area.split(' ')[1])
            else:
                comm_num = int(comm_area)
        except:
            continue
        
        # Get population for weighting
        pop = props.get('total_pop', 0)
        if pop <= 0:
            continue
            
        # Get ICE values
        ice_race = props.get('ice_race')
        ice_income = props.get('ice_income')
        ice_race_income = props.get('ice_race_income')
        
        # Update community area data
        comm_data = community_data[comm_num]
        comm_data['total_pop'] += pop
        comm_data['tract_count'] += 1
        
        # Add weighted ICE values if available
        if ice_race is not None and not np.isnan(ice_race):
            comm_data['weighted_ice_race'] += ice_race * pop
            comm_data['tracts_with_data'] += 1
            
        if ice_income is not None and not np.isnan(ice_income):
            comm_data['weighted_ice_income'] += ice_income * pop
            
        if ice_race_income is not None and not np.isnan(ice_race_income):
            comm_data['weighted_ice_race_income'] += ice_race_income * pop
    
    # Calculate weighted averages and update community area features
    print("Calculating weighted averages...")
    
    updated_features = []
    summary_stats = {
        'ice_race': [],
        'ice_income': [],
        'ice_race_income': []
    }
    
    for feature in communities['features']:
        props = feature['properties']
        
        # Get community area number
        comm_name = props.get('community', '')
        try:
            if comm_name.startswith('Area '):
                comm_num = int(comm_name.split(' ')[1])
            else:
                comm_num = int(comm_name)
        except:
            updated_features.append(feature)
            continue
        
        # Get aggregated data
        comm_data = community_data.get(comm_num)
        
        if comm_data and comm_data['total_pop'] > 0:
            # Calculate weighted averages
            ice_race = comm_data['weighted_ice_race'] / comm_data['total_pop']
            ice_income = comm_data['weighted_ice_income'] / comm_data['total_pop']
            ice_race_income = comm_data['weighted_ice_race_income'] / comm_data['total_pop']
            
            # Update properties
            props['community_name'] = COMMUNITY_NAMES.get(comm_num, f'Area {comm_num}')
            props['community_number'] = comm_num
            props['ice_race'] = round(ice_race, 4)
            props['ice_income'] = round(ice_income, 4)
            props['ice_race_income'] = round(ice_race_income, 4)
            props['total_population'] = comm_data['total_pop']
            props['tract_count'] = comm_data['tract_count']
            props['tracts_with_data'] = comm_data['tracts_with_data']
            
            # Calculate quintiles
            props['ice_race_quintile'] = None  # Will calculate after all values
            props['ice_income_quintile'] = None
            props['ice_race_income_quintile'] = None
            
            # Mark priority areas
            props['extreme_deprivation_race'] = ice_race < -0.4
            props['extreme_deprivation_income'] = ice_income < -0.4
            props['extreme_deprivation_race_income'] = ice_race_income < -0.4
            
            # Collect for summary stats
            summary_stats['ice_race'].append(ice_race)
            summary_stats['ice_income'].append(ice_income)
            summary_stats['ice_race_income'].append(ice_race_income)
        else:
            # No data for this community area
            props['community_name'] = COMMUNITY_NAMES.get(comm_num, f'Area {comm_num}')
            props['community_number'] = comm_num
            props['ice_race'] = None
            props['ice_income'] = None
            props['ice_race_income'] = None
            props['total_population'] = 0
            props['tract_count'] = 0
            props['tracts_with_data'] = 0
        
        updated_features.append(feature)
    
    # Calculate quintiles
    print("Calculating quintiles...")
    
    for measure in ['ice_race', 'ice_income', 'ice_race_income']:
        values = [f['properties'][measure] for f in updated_features 
                 if f['properties'][measure] is not None]
        
        if values:
            quintile_breaks = np.percentile(values, [20, 40, 60, 80])
            
            for feature in updated_features:
                value = feature['properties'][measure]
                if value is not None:
                    quintile = 1
                    for i, break_point in enumerate(quintile_breaks):
                        if value > break_point:
                            quintile = i + 2
                    feature['properties'][f'{measure}_quintile'] = quintile
    
    # Create output GeoJSON
    output_data = {
        'type': 'FeatureCollection',
        'features': updated_features
    }
    
    # Save aggregated data
    output_path = OUTPUT_DIR / "chicago-community-areas-ice-aggregated.geojson"
    save_geojson(output_data, output_path)
    print(f"Saved aggregated data to: {output_path}")
    
    # Print summary statistics
    print("\n" + "="*50)
    print("COMMUNITY AREA ICE SUMMARY STATISTICS")
    print("="*50)
    print(f"Total community areas: {len(updated_features)}")
    print(f"Community areas with data: {len([f for f in updated_features if f['properties']['tract_count'] > 0])}")
    
    for measure in ['ice_race', 'ice_income', 'ice_race_income']:
        values = summary_stats[measure]
        if values:
            print(f"\n{measure.upper()}:")
            print(f"  Count: {len(values)}")
            print(f"  Min: {np.min(values):.3f}")
            print(f"  Max: {np.max(values):.3f}")
            print(f"  Mean: {np.mean(values):.3f}")
            print(f"  Median: {np.median(values):.3f}")
            print(f"  Priority Areas (< -0.4): {sum(1 for v in values if v < -0.4)}")
    
    return output_data

if __name__ == "__main__":
    print("Chicago Community Area ICE Aggregation")
    print("=====================================\n")
    
    aggregate_ice_values()