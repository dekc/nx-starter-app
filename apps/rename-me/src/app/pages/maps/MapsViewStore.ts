import { MapboxLayer } from '@deck.gl/mapbox/typed';
import { RestClientService } from '../../services/RestService';
import { makeAutoObservable } from 'mobx';

interface State {
  portFeatures: GeoJSON.FeatureCollection;
  aisFeatures: GeoJSON.FeatureCollection;
  hoveredFeature: {
    feature: GeoJSON.Feature | null;
    position: [number, number];
  };
}

class MapsViewStore {
  private restService;
  private state: State = {
    portFeatures: {} as GeoJSON.FeatureCollection,
    aisFeatures: {} as GeoJSON.FeatureCollection,
    hoveredFeature: { feature: null, position: [-1, -1] },
  };

  constructor() {
    makeAutoObservable(this);
    this.restService = RestClientService.getInstance();
  }

  get portFeatures() {
    return this.state.portFeatures;
  }

  get aisFeatures() {
    return this.state.aisFeatures;
  }

  loadFeatures(urlStr: string, type: 'port' | 'ais') {
    const url = new URL(urlStr);
    this.restService
      .get$<GeoJSON.FeatureCollection>(url)
      .subscribe((features) => {
        if (type === 'port') {
          this.state.portFeatures = features;
        } else {
          this.state.aisFeatures = features;
        }
      });
  }

  get hoveredFeature() {
    return this.state.hoveredFeature;
  }

  setHoveredFeature(
    feature: GeoJSON.Feature | null = null,
    position: { x: number; y: number } = { x: -1, y: -1 }
  ) {
    this.state.hoveredFeature = {
      feature,
      position: [position.x, position.y],
    };
  }
}

export { MapsViewStore };
