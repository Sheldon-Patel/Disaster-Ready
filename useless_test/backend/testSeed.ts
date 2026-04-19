import { seedEarthquakeModule, seedFloodModule, seedFireModule, seedCycloneModule, seedHeatwaveModule, seedDroughtModule, seedTornadoModule, seedGasLeakModule, seedCollapseModule } from './src/services/seedData.ts';
[seedEarthquakeModule, seedFloodModule, seedFireModule, seedCycloneModule, seedHeatwaveModule, seedDroughtModule, seedTornadoModule, seedGasLeakModule, seedCollapseModule].forEach(fn => {
  const code = fn.toString();
  if (code.includes('Never. Always use the stairs')) {
    console.log("Found in: " + fn.name);
  }
});
