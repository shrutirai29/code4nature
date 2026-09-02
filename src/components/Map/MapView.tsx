import { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';

const layerToggles = [
  { id: 'boundary', label: 'Panchayat boundary', color: '#276749' },
  { id: 'mgnrega', label: 'MGNREGA assets', color: '#3182ce' },
  { id: 'vegetation', label: 'Vegetation', color: '#38a169' },
  { id: 'agricultural', label: 'Agricultural land', color: '#d69e2e' },
  { id: 'potential', label: 'Potential carbon areas', color: '#68d391' },
];

// Mock GeoJSON features for the Panchayat
function getPanchayatGeoJSON() {
  return {
    type: 'FeatureCollection' as const,
    features: [
      // Panchayat boundary
      {
        type: 'Feature' as const,
        properties: { type: 'boundary', name: 'Demo Village Panchayat' },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [72.25, 24.10],
            [72.35, 24.10],
            [72.38, 24.15],
            [72.35, 24.20],
            [72.25, 24.20],
            [72.22, 24.15],
            [72.25, 24.10],
          ]],
        },
      },
      // Agricultural land areas
      {
        type: 'Feature' as const,
        properties: { type: 'agricultural', name: 'Northern farmland', area: '420 ha', detail: 'Primarily cotton and groundnut' },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [72.26, 24.14],
            [72.32, 24.14],
            [72.32, 24.18],
            [72.26, 24.18],
            [72.26, 24.14],
          ]],
        },
      },
      {
        type: 'Feature' as const,
        properties: { type: 'agricultural', name: 'Eastern farmland', area: '380 ha', detail: 'Cereals and pulses' },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [72.33, 24.12],
            [72.37, 24.12],
            [72.37, 24.16],
            [72.33, 24.16],
            [72.33, 24.12],
          ]],
        },
      },
      // Vegetation areas
      {
        type: 'Feature' as const,
        properties: { type: 'vegetation', name: 'Common land vegetation', ndvi: '0.42', detail: 'Scattered tree cover and shrubs' },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [72.23, 24.13],
            [72.26, 24.13],
            [72.26, 24.17],
            [72.23, 24.17],
            [72.23, 24.13],
          ]],
        },
      },
      // Potential carbon project areas
      {
        type: 'Feature' as const,
        properties: { type: 'potential', name: 'Agroforestry zone', potential: '420-650 tCO₂e/yr', detail: 'Suitable for tree planting along field boundaries' },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [72.28, 24.13],
            [72.30, 24.13],
            [72.30, 24.15],
            [72.28, 24.15],
            [72.28, 24.13],
          ]],
        },
      },
    ],
  };
}

// MGNREGA asset points
function getMGNREGAAssets() {
  return {
    type: 'FeatureCollection' as const,
    features: [
      { type: 'Feature' as const, properties: { type: 'mgnrega', name: 'Farm Pond', year: '2024', relevance: 'Land restoration / water management' }, geometry: { type: 'Point' as const, coordinates: [72.27, 24.15] } },
      { type: 'Feature' as const, properties: { type: 'mgnrega', name: 'Check Dam', year: '2023', relevance: 'Water conservation / soil moisture' }, geometry: { type: 'Point' as const, coordinates: [72.30, 24.16] } },
      { type: 'Feature' as const, properties: { type: 'mgnrega', name: 'Tree Plantation', year: '2024', relevance: 'Carbon sequestration / biodiversity' }, geometry: { type: 'Point' as const, coordinates: [72.25, 24.14] } },
      { type: 'Feature' as const, properties: { type: 'mgnrega', name: 'Bund Planting', year: '2025', relevance: 'Soil conservation / carbon storage' }, geometry: { type: 'Point' as const, coordinates: [72.33, 24.17] } },
      { type: 'Feature' as const, properties: { type: 'mgnrega', name: 'Waste Land Development', year: '2023', relevance: 'Land restoration / vegetation' }, geometry: { type: 'Point' as const, coordinates: [72.24, 24.16] } },
      { type: 'Feature' as const, properties: { type: 'mgnrega', name: 'Nala Treatment', year: '2024', relevance: 'Soil conservation / water management' }, geometry: { type: 'Point' as const, coordinates: [72.35, 24.13] } },
    ],
  };
}

export default function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    boundary: true,
    mgnrega: true,
    vegetation: true,
    agricultural: true,
    potential: true,
  });
  const [showToggles, setShowToggles] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: [72.30, 24.15],
      zoom: 12,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      const panchayatData = getPanchayatGeoJSON();
      const mgnregaData = getMGNREGAAssets();

      // Add polygon layers
      map.addSource('panchayat', { type: 'geojson', data: panchayatData });
      map.addSource('mgnrega', { type: 'geojson', data: mgnregaData });

      // Boundary
      map.addLayer({
        id: 'boundary-fill',
        type: 'fill',
        source: 'panchayat',
        filter: ['==', ['get', 'type'], 'boundary'],
        paint: { 'fill-color': '#276749', 'fill-opacity': 0.08 },
      });
      map.addLayer({
        id: 'boundary-line',
        type: 'line',
        source: 'panchayat',
        filter: ['==', ['get', 'type'], 'boundary'],
        paint: { 'line-color': '#276749', 'line-width': 2.5, 'line-dasharray': [5, 3] },
      });

      // Agricultural
      map.addLayer({
        id: 'agricultural-fill',
        type: 'fill',
        source: 'panchayat',
        filter: ['==', ['get', 'type'], 'agricultural'],
        paint: { 'fill-color': '#d69e2e', 'fill-opacity': 0.15 },
      });
      map.addLayer({
        id: 'agricultural-border',
        type: 'line',
        source: 'panchayat',
        filter: ['==', ['get', 'type'], 'agricultural'],
        paint: { 'line-color': '#d69e2e', 'line-width': 1.5 },
      });

      // Vegetation
      map.addLayer({
        id: 'vegetation-fill',
        type: 'fill',
        source: 'panchayat',
        filter: ['==', ['get', 'type'], 'vegetation'],
        paint: { 'fill-color': '#38a169', 'fill-opacity': 0.2 },
      });
      map.addLayer({
        id: 'vegetation-border',
        type: 'line',
        source: 'panchayat',
        filter: ['==', ['get', 'type'], 'vegetation'],
        paint: { 'line-color': '#38a169', 'line-width': 1.5 },
      });

      // Potential carbon areas
      map.addLayer({
        id: 'potential-fill',
        type: 'fill',
        source: 'panchayat',
        filter: ['==', ['get', 'type'], 'potential'],
        paint: { 'fill-color': '#68d391', 'fill-opacity': 0.25 },
      });
      map.addLayer({
        id: 'potential-border',
        type: 'line',
        source: 'panchayat',
        filter: ['==', ['get', 'type'], 'potential'],
        paint: { 'line-color': '#68d391', 'line-width': 2 },
      });

      // MGNREGA points
      map.addLayer({
        id: 'mgnrega-points',
        type: 'circle',
        source: 'mgnrega',
        paint: {
          'circle-radius': 7,
          'circle-color': '#3182ce',
          'circle-stroke-color': 'white',
          'circle-stroke-width': 2,
        },
      });

      // Click handler
      const handleClick = (e: maplibregl.MapMouseEvent) => {
        const features = map.queryRenderedFeatures(e.point);
        if (features.length > 0) {
          const props = features[0].properties;
          if (props && props.name) {
            setSelectedFeature(props as Record<string, string>);
          }
        }
      };

      map.on('click', handleClick);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Toggle layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const layerMap: Record<string, string[]> = {
      boundary: ['boundary-fill', 'boundary-line'],
      agricultural: ['agricultural-fill', 'agricultural-border'],
      vegetation: ['vegetation-fill', 'vegetation-border'],
      potential: ['potential-fill', 'potential-border'],
      mgnrega: ['mgnrega-points'],
    };

    Object.entries(activeLayers).forEach(([layerId, visible]) => {
      const layerNames = layerMap[layerId] || [];
      layerNames.forEach((name) => {
        try {
          map.setLayoutProperty(name, 'visibility', visible ? 'visible' : 'none');
        } catch {
          // Layer may not be loaded yet
        }
      });
    });
  }, [activeLayers]);

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-sage-200">
        <h3 className="font-semibold text-sm text-charcoal-900">Panchayat Map</h3>
        <button
          onClick={() => setShowToggles(!showToggles)}
          className="text-xs text-charcoal-600 hover:text-charcoal-900 flex items-center gap-1"
        >
          Layers {showToggles ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Layer toggles */}
      {showToggles && (
        <div className="px-4 py-2 bg-earth-50 border-b border-sage-200 flex flex-wrap gap-2">
          {layerToggles.map((layer) => (
            <label key={layer.id} className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={activeLayers[layer.id]}
                onChange={() => toggleLayer(layer.id)}
                className="rounded border-sage-300 accent-forest-700"
              />
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: layer.color }} />
              <span className="text-charcoal-700">{layer.label}</span>
            </label>
          ))}
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-80" />

      {/* Feature info panel */}
      {selectedFeature && (
        <div className="px-4 py-3 bg-forest-50 border-t border-forest-200 animate-fade-in">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-forest-700 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-charcoal-900">{selectedFeature.name}</h4>
                {selectedFeature.area && <p className="text-xs text-charcoal-600">Area: {selectedFeature.area}</p>}
                {selectedFeature.year && <p className="text-xs text-charcoal-600">Year: {selectedFeature.year}</p>}
                {selectedFeature.potential && <p className="text-xs text-forest-700 font-medium">Potential: {selectedFeature.potential}</p>}
                {selectedFeature.ndvi && <p className="text-xs text-charcoal-600">NDVI: {selectedFeature.ndvi}</p>}
                {selectedFeature.relevance && <p className="text-xs text-charcoal-600">{selectedFeature.relevance}</p>}
                {selectedFeature.detail && <p className="text-xs text-charcoal-600 mt-1">{selectedFeature.detail}</p>}
              </div>
            </div>
            <button
              onClick={() => setSelectedFeature(null)}
              className="text-charcoal-500 hover:text-charcoal-900 text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-2 text-xs text-charcoal-500 border-t border-sage-100">
        Mock GIS data for demonstration. Click on features for details.
      </div>
    </div>
  );
}
