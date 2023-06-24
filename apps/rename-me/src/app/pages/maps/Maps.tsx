import { Box, styled, useTheme } from '@mui/material';
import { MouseEventHandler, useCallback, useEffect, useState } from 'react';
import Map, {
  FullscreenControl,
  Layer,
  NavigationControl,
  ScaleControl,
  ViewState,
  useControl,
  useMap,
} from 'react-map-gl';
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed';
import {
  BitmapLayer,
  GeoJsonLayer,
  LineLayer,
  ScatterplotLayer,
} from '@deck.gl/layers/typed';
import { TileLayer, _WMSLayer as WMSLayer } from '@deck.gl/geo-layers/typed';
import { PickingInfo } from '@deck.gl/core/typed';
import { LngLatBounds, LngLat } from 'mapbox-gl';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { provider, useInstance } from 'react-ioc';
import { observer } from 'mobx-react-lite';

import { MapsViewStore } from './MapsViewStore';
import { CursorLayer } from './CursorLayer';
import { ConnectableObservable } from 'rxjs';
import { CrosshairLayer } from './CrosshairLayer';

const PORT_FETCH_URL = import.meta.env.VITE_PORT_FEATURES_URL;
const AIS_FETCH_URL = import.meta.env.VITE_AIS_FEATURES_URL;
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const mapMode = {
  dark: 'mapbox://styles/mapbox/dark-v10',
  light: 'mapbox://styles/mapbox/light-v11',
};

const openSeaMapStyle = {
  version: 8,
  name: 'OpenSeaMap',
  sources: {
    'openseamap-base-tiles': {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
    'openseamap-seamarks-tiles': {
      type: 'raster',
      tiles: ['https://t1.openseamap.org/seamark/{z}/{x}/{y}.png'],
      tileSize: 256,
    },
    // 'marine-traffic-tiles': {
    //   type: 'raster',
    //   tiles: [
    //     'https://tiles.marinetraffic.com/ais_helpers/shiptilesingle.aspx?output=png&sat=1&grouping=shiptype&tile_size=256&legends=1&zoom={z}&X={x}&Y={y}',
    //   ],
    //   tileSize: 256,
    // },
  },
  layers: [
    {
      id: 'osm-base-tiles',
      type: 'raster',
      source: 'openseamap-base-tiles',
      minzoom: 0,
      maxzoom: 22,
    },
    {
      id: 'openseamap-seamarks-tiles',
      type: 'raster',
      source: 'openseamap-seamarks-tiles',
      minzoom: 0,
      maxzoom: 22,
    },
    // {
    //   id: 'marine-traffic-tiles',
    //   type: 'raster',
    //   source: 'marine-traffic-tiles',
    //   minzoom: 0,
    //   maxzoom: 22,
    // },
  ],
  attribution:
    'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
};

const StyledContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 'calc(100% - 64px)', // 64px is the height of the footer
}));

const StyledBox = styled(Box)(({ theme }) => ({
  width: '95%',
  height: '95%',
  border: '1px solid #4a4242',
  // overflow: 'hidden',
}));

const StyledTooltip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  margin: '8px',
  padding: '4px',
  background: 'rgba(0, 0, 0, 0.8)',
  color: '#fff',
  maxWidth: '300px',
  fontSize: '10px',
  zIndex: 9,
  pointerEvents: 'none',
}));

const baseLayerId = 'land'; // The ID of the base layer you want to change the opacity of
const opacityValue = 0.1;

const Maps = observer(() => {
  const theme = useTheme();
  const viewStore = useInstance(MapsViewStore);
  const mapRef = useMap();

  const [viewState, setViewState] = useState<Partial<ViewState>>({
    latitude: 49.12576389,
    longitude: -123.2545722,
    zoom: 9,
    pitch: 0,
    bearing: 0,
  });
  const [bounds, setBounds] = useState<LngLatBounds>(new LngLatBounds(new LngLat(0,0), new LngLat(0,0)));

  const [cursorPosition, setCursorPosition] = useState<[number, number]>([0,0]);

  useEffect(() => {
    viewStore.loadFeatures(PORT_FETCH_URL, 'port');
    viewStore.loadFeatures(AIS_FETCH_URL, 'ais');
  }, [viewStore]);

  const handleCursorMove = (event: mapboxgl.MapLayerMouseEvent) => {
    if (!event) return;
    // console.log(event.lngLat)
    // const [x, y] = [event.clientX, event.clientY];
    // setCursorPosition([event.point.x, event.point.y]);
   setBounds(event.target.getBounds());
    setCursorPosition([event.lngLat.lng, event.lngLat.lat]);

    // const lnglat = mapRef.current?.unproject([x, y]);
    // console.debug('lnglat', lnglat);
    // setCursorPosition(lnglat);
  };

  const portFeaturesLayer = new GeoJsonLayer({
    id: 'port-features',
    data: viewStore.portFeatures,
    stroked: true,
    filled: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 1,
    getLineColor: [55, 55, 55],
    getFillColor: [200, 200, 200, 200],
    getRadius: 100,
    getLineWidth: 1,
    getElevation: 30,
    pickable: true,
    autoHighlight: true,
    // onEdit: ({ updatedData }) => {
    //   console.log('GeoJson Updated!!');
    //   console.log(updatedData);
    // },
  });

  const aisFeaturesLayer = new GeoJsonLayer({
    id: 'ais-features',
    data: viewStore.aisFeatures,
    stroked: true,
    filled: true,
    extruded: true,
    lineWidthScale: 20,
    lineWidthMinPixels: 1,
    getLineColor: [255, 55, 55],
    getFillColor: [255, 100, 100, 200],
    pointRadiusUnits: 'pixels',
    getRadius: 2,
    getLineWidth: 1,
    getElevation: 30,
    pickable: true,
    autoHighlight: true,
    // onEdit: ({ updatedData }) => {
    //   console.log('GeoJson Updated!!');
    //   console.log(updatedData);
    // },
  });

  const scatterplotLayer = new ScatterplotLayer({
    id: 'my-scatterplot',
    data: [
      {
        position: [-123.05248501, 49.30332997, 0],
        size: 300,
        id: 'my-scatterplot',
      },
    ],
    getPosition: (d) => d.position,
    getRadius: (d) => d.size,
    getFillColor: [255, 0, 0],
    pickable: true,
    autoHighlight: true,
  });
  // https://wms.sevencs.com/?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=GIS-ENC-OFFSHORE&CSBOOL=181&CSVALUE=,%2C%2C%2C%2C2&CRS=EPSG%3A3857&STYLES=&WIDTH=1263&HEIGHT=853&BBOX=-13558679.785932953%2C4511045.883005289%2C-13365599.852484597%2C4641447.4532598
  const encLayer = new WMSLayer({
    id: 'enc-layer',
    // data: 'https://wms.sevencs.com',
    // layers: ['ENC'],
    data: 'https://chartserver.seaportopx.com',
    layers: ['ENC'],
    serviceType: 'wms',
    opacity: 0.3,
  });

  const trafficLayer = new TileLayer({
    id: 'traffic-layer',
    data: 'https://tiles.marinetraffic.com/ais_helpers/shiptilesingle.aspx?output=png&sat=1&grouping=shiptype&tile_size=256&legends=1&zoom={z}&X={x}&Y={y}',
    tileSize: 256,
    minZoom: 0,
    maxZoom: 22,
    opacity: 0.5,
    renderSubLayers: (props) => {
      const { data, boundingBox } = props.tile;

      return new BitmapLayer(props, {
        id: `bitmap-traffic-layer-${props.tile.id}`,
        image: data,
        bounds: [
          boundingBox[0][0],
          boundingBox[0][1],
          boundingBox[1][0],
          boundingBox[1][1],
        ],
      });
    },
  });

  const depthLayer = new WMSLayer({
    id: 'depth-layer',
    data: 'https://depth.openseamap.org/cgi-bin/mapserv.fcgi',
    loadOptions: {
      fetch: {
        headers: {
          'Sec-Fetch-Mode': 'no-cors',
          'Sec-Fetch-Site': 'same-site',
          'Sec-Fetch-Dest': 'image',
        },
      },
    },
    layers: [
      'contour',
      // 'trackpoints_cor1_test_dbs_10',
      // 'trackpoints_cor1_test_10',
      // 'test_zoom_10_cor_1_points_10',
      // 'test_zoom_9_cor_1_points_10',
      // 'test_zoom_8_cor_1_points_10',
      // 'test_zoom_7_cor_1_points_10',
      // 'test_zoom_6_cor_1_points_10',
      // 'test_zoom_5_cor_1_points_10',
      // 'test_zoom_4_cor_1_points_10',
      // 'test_zoom_3_cor_1_points_10',
      // 'test_zoom_2_cor_1_points_10',
    ],
    // data: 'https://chartserver.seaportopx.com',
    // layers: ['ENC'],
    serviceType: 'wms',
    srs: 'EPSG:900913',
    opacity: 0.4,
  });

  // const crosshairLayer = new LineLayer({
  //   id: "crosshair-layer",
  //   data: [
  //     { position: [100, 100], color: [255, 0,0], strokeWidth: 1 },
  //     { position: [window.innerWidth, 0], color: [255, 0,0], strokeWidth: 1 },
  //     { position: [0, window.innerHeight], color: [255, 0,0], strokeWidth: 1 },
  //     { position: [window.innerWidth, window.innerHeight], color: [255, 0,0], strokeWidth: 1 },
  //   ],
  //   getColor: (d) => d.color,
  //   getWidth: (d) => d.strokeWidth,
  //   getPositions: (d) => d.position,
  //   pickable: false,
  // });

  // const onHover = useCallback(
  //   (event: MapLayerMouseEvent) => {
  //     const { features, point } = event;
  //     const hoveredFeature =
  //       features && features.find((f) => f.layer.id === 'port-features');
  //     viewStore.setHoveredFeature(hoveredFeature, point);
  //   },
  //   [viewStore]
  // );

  const cursorLayer = new CrosshairLayer({
    id: 'crosshair-layer',
    cursorPosition,
    bounds,
    thickness: 1,
    color: [0, 0, 0, 255],
  });

  return (
    <StyledContainer>
      <StyledBox>
        <Map
          {...viewState}
          reuseMaps
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          style={{
            height: '100%',
            width: '100%',
          }}
          mapStyle={openSeaMapStyle}
          onMove={(evt) => setViewState(evt.viewState)}
          cursor='crosshair'
          onMouseMove={handleCursorMove}
          // onRender={(event) => event.target.resize()}
        >
          <FullscreenControl />
          <NavigationControl visualizePitch />
          <ScaleControl />

          <Layer {...parkLayer} />

          <DeckGLOverlay
            style={{pointerEvents: 'none', cursor: 'none'}}
            interleaved
            getCursor={() => 'none'}
            layers={[portFeaturesLayer]}
            getTooltip={getTooltip}
          />
           <DeckGLOverlay layers={[cursorLayer, depthLayer]} />

          {/* {viewStore.hoveredFeature.feature && (
            <StyledTooltip
              style={{
                left: viewStore.hoveredFeature.position[0],
                top: viewStore.hoveredFeature.position[1],
              }}
            >
              <div>
                Name: {viewStore.hoveredFeature.feature?.properties?.name}
              </div>
              <div>
                Identifying Features:{' '}
                {viewStore.hoveredFeature.feature?.properties?.value}
              </div>
            </StyledTooltip>
          )} */}
        </Map>
      </StyledBox>
    </StyledContainer>
  );
});

const DeckGLOverlay = (
  props: MapboxOverlayProps & {
    interleaved?: boolean;
  }
) => {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
};

const parkLayer = {
  id: 'landuse_park',
  type: 'fill' as const,
  source: 'mapbox',
  'source-layer': 'landuse',
  filter: ['==', 'class', 'park'],
  paint: {
    'fill-color': '#4E3FC8',
  },
};

const getTooltip = (info: PickingInfo) => {
  const d = info.object;
  let tooltip = undefined;
  if (d) {
    tooltip = d.properties?.name ?? d.properties?.MMSI ?? d.id;
  }

  if (tooltip) {
    return {
      text: tooltip,
      style: {
        position: 'absolute',
        borderRadius: '4px',
        border: '2px solid #fff',
        margin: '8px',
        padding: '4px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        maxWidth: '300px',
        fontSize: '10px',
        zIndex: 9,
        pointerEvents: 'none',
      },
    };
  }

  return null;
};

const cursorDims = (info: PickingInfo) => {
  const viewport = info.viewport;
  if (!viewport) {
    return null;
  }
  const width = viewport.width;
  const height = viewport.height;
  const center = viewport.unproject([width / 2, height / 2]);
  const topLeft = viewport.unproject([0, 0]);
  const topRight = viewport.unproject([width, 0]);
  const bottomLeft = viewport.unproject([0, height]);
  const bottomRight = viewport.unproject([width, height]);

  return { center, topLeft, topRight, bottomLeft, bottomRight };
};

export default provider(MapsViewStore)(Maps);

//depth.openseamap.org/cgi-bin/mapserv.fcgi?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=TRUE&LAYERS=trackpoints_cor1_test_dbs_10%2Ctrackpoints_cor1_test_10%2Ctest_zoom_10_cor_1_points_10%2Ctest_zoom_9_cor_1_points_10%2Ctest_zoom_8_cor_1_points_10%2Ctest_zoom_7_cor_1_points_10%2Ctest_zoom_6_cor_1_points_10%2Ctest_zoom_5_cor_1_points_10%2Ctest_zoom_4_cor_1_points_10%2Ctest_zoom_3_cor_1_points_10%2Ctest_zoom_2_cor_1_points_10&WIDTH=256&HEIGHT=256&SRS=EPSG%3A900913&STYLES=&BBOX=1408887.3053523675%2C6966165.009797823%2C1487158.822316388%2C7044436.526761843

// https://depth.openseamap.org/cgi-bin/mapserv.fcgi?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=TRUE&LAYERS=trackpoints_cor1_test_dbs_10%2Ctrackpoints_cor1_test_10%2Ctest_zoom_10_cor_1_points_10%2Ctest_zoom_9_cor_1_points_10%2Ctest_zoom_8_cor_1_points_10%2Ctest_zoom_7_cor_1_points_10%2Ctest_zoom_6_cor_1_points_10%2Ctest_zoom_5_cor_1_points_10%2Ctest_zoom_4_cor_1_points_10%2Ctest_zoom_3_cor_1_points_10%2Ctest_zoom_2_cor_1_points_10&WIDTH=256&HEIGHT=256&SRS=EPSG%3A900913&STYLES=&BBOX=-13932330.019595645%2C6418264.391049679%2C-13893194.261113634%2C6457400.1495316895

// https://tiles.marinetraffic.com/ais_helpers/shiptilesingle.aspx?output=png&sat=1&grouping=shiptype&tile_size=512&legends=1&zoom=9&X=41&Y=88


// https://localhost:7246/traces/data/current/image?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&LAYERS=Wind-Trace&STYLES=&CRS=EPSG:4326&ZOOMLEVEL=7.166126611265988&DATE=2023-05-21T00:00:00&PROJECT=current&INTERPOLATION=NearestNeighbor
