#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Prepare GeoJSON files for Mapbox Studio upload
async function prepareGeoJSONForMapbox() {
  console.log('🚀 Preparing GeoJSON files for Mapbox Studio upload...\n');

  // Files to process
  const files = [
    {
      input: '../public/data/chicago-tracts-ice.geojson',
      output: '../mapbox-upload/chicago-tracts-ice-prepared.geojson',
      name: 'Census Tracts'
    },
    {
      input: '../public/data/chicago-community-areas-ice.geojson',
      output: '../mapbox-upload/chicago-community-areas-ice-prepared.geojson',
      name: 'Community Areas'
    }
  ];

  // Create output directory
  const outputDir = path.join(__dirname, '../mapbox-upload');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const file of files) {
    console.log(`Processing ${file.name}...`);
    
    try {
      // Read the GeoJSON file
      const inputPath = path.join(__dirname, file.input);
      const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
      
      // Process features
      let processedFeatures = 0;
      let skippedFeatures = 0;
      
      const processedData = {
        type: 'FeatureCollection',
        features: data.features.map((feature, index) => {
          // Ensure feature has required properties
          if (!feature.properties) {
            skippedFeatures++;
            return null;
          }
          
          // Add feature ID if not present
          if (!feature.id) {
            feature.id = feature.properties.GEOID || feature.properties.community || index;
          }
          
          // Ensure numeric values are numbers (not strings)
          const props = feature.properties;
          ['ice_race', 'ice_income', 'ice_race_income', 'total_pop', 'white_nh', 'black_nh', 
           'hispanic', 'asian_nh', 'other_nh', 'quintile_race', 'quintile_income'].forEach(key => {
            if (props[key] !== undefined && props[key] !== null) {
              props[key] = parseFloat(props[key]);
            }
          });
          
          // Round ICE values to 4 decimal places for smaller file size
          ['ice_race', 'ice_income', 'ice_race_income'].forEach(key => {
            if (props[key] !== undefined && props[key] !== null) {
              props[key] = Math.round(props[key] * 10000) / 10000;
            }
          });
          
          // Remove unnecessary properties to reduce file size
          delete props.NAME;
          delete props.NAMELSAD;
          delete props.STATEFP;
          delete props.COUNTYFP;
          delete props.TRACTCE;
          
          processedFeatures++;
          return feature;
        }).filter(f => f !== null)
      };
      
      // Write processed file
      const outputPath = path.join(__dirname, file.output);
      fs.writeFileSync(outputPath, JSON.stringify(processedData));
      
      // Get file size
      const stats = fs.statSync(outputPath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ ${file.name}: ${processedFeatures} features processed, ${skippedFeatures} skipped`);
      console.log(`   Output: ${file.output} (${fileSizeMB} MB)\n`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file.name}:`, error.message);
    }
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Go to https://studio.mapbox.com');
  console.log('2. Click "Datasets" → "New dataset"');
  console.log('3. Upload the files from the mapbox-upload directory');
  console.log('4. After upload, click "Export to tileset" for each dataset');
  console.log('5. Note down the tileset IDs (e.g., username.chicago-tracts-ice)');
  console.log('\n💡 Tip: Use meaningful tileset names like:');
  console.log('   - sajor2000.chicago-census-tracts-ice');
  console.log('   - sajor2000.chicago-community-areas-ice');
}

// Run the script
prepareGeoJSONForMapbox().catch(console.error);