# Chicago ICE Static Maps - Complete Collection

This directory contains a comprehensive collection of static choropleth maps visualizing the Index of Concentration at the Extremes (ICE) for Chicago census tracts.

## 📁 Directory Structure

### `by_measure/` - Basic Choropleth Maps
Simple, clean maps showing ICE values for each measure:
- **ice_race_basic.png** - Racial segregation (White NH - Black NH)
- **ice_income_basic.png** - Economic segregation (High - Low income)
- **ice_race_income_basic.png** - Racialized economic segregation

### `with_communities/` - Maps with Community Areas
Same as above but with Chicago's 77 community area boundaries overlaid:
- **ice_race_communities.png** - With dashed community boundaries
- **ice_income_communities.png** - Shows neighborhood divisions
- **ice_race_income_communities.png** - Helps identify specific areas

### `priority_areas/` - Extreme Deprivation Highlighted
Maps highlighting census tracts with ICE < -0.4 (extreme deprivation):
- **ice_race_priority.png** - Red borders show priority areas
- **ice_income_priority.png** - Identifies economically deprived areas
- **ice_race_income_priority.png** - Shows intersectional deprivation

### `combined/` - Full-Featured Print-Ready Maps
Complete maps with all features for publication/print use:
- **ice_*_print.png** - Standard resolution (300 DPI)
- **ice_*_print_highres.png** - High resolution (600 DPI) for large prints

## 🎨 Map Features

### Color Scale
- **Deep Red** (-1.0): Extreme deprivation
- **White** (0.0): Neutral/balanced
- **Deep Blue** (1.0): Extreme privilege

### Visual Elements
- **Legend**: Full ICE value scale with labels
- **North Arrow**: Orientation indicator
- **Scale Bar**: Approximate distance reference
- **Statistics Box**: Mean, median, min, max values
- **Data Source**: Census attribution and generation date
- **Community Boundaries**: 77 Chicago community areas (when shown)
- **Priority Areas**: Red borders for ICE < -0.4 (when shown)

## 📊 Data Summary

- **Total Census Tracts**: 1,332
- **Data Source**: U.S. Census Bureau, ACS 2022 5-Year Estimates
- **ICE Measures**:
  - Race: (White NH - Black NH) / Total Population
  - Income: (≥$100k - <$25k) / Total Households
  - Race-Income: (White ≥$100k - Black <$25k) / Total Households

## 🖨️ Usage Guidelines

### For Digital Display
- Use maps from `by_measure/` or `with_communities/`
- Standard 300 DPI resolution is sufficient
- PNG format preserves quality

### For Print Publications
- Use maps from `combined/` directory
- Choose `_highres.png` versions for large format printing
- 600 DPI ensures crisp output at any size

### For Presentations
- `priority_areas/` maps effectively highlight disparities
- Community boundaries help audience orient themselves
- Consider using consistent measure across slides

### For Academic Papers
- Full-featured maps from `combined/` include all metadata
- Statistics box provides quantitative context
- High-resolution versions ensure journal quality

## 📈 Key Findings Visible in Maps

1. **Spatial Clustering**: Extreme values cluster geographically
2. **South/West Disparities**: Clear patterns of segregation
3. **Priority Areas**: Concentrated in specific neighborhoods
4. **Community Variations**: Some areas show internal diversity

## 🔄 Regenerating Maps

To regenerate or update these maps:

```bash
# From project root
python3 scripts/generate_all_maps.py
```

Requirements: matplotlib, numpy (no heavy GIS dependencies needed)

## 📝 Citation

When using these maps, please cite:
```
Data Source: U.S. Census Bureau, American Community Survey 2022 5-Year Estimates
Visualization: Chicago ICE Analysis Project, [Year]
Measure: Krieger et al. Index of Concentration at the Extremes
```

---
Generated on: 2024-07-24