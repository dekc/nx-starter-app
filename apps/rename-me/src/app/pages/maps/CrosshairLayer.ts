import { CompositeLayer, Layer, LayerProps } from '@deck.gl/core/typed';
import {  LngLatBounds } from 'mapbox-gl';
import { CursorLayer } from './CursorLayer';

type RGBColor = [number, number, number, number];
type Position = [number, number];

type CrosshairLayerProps = LayerProps & {
  cursorPosition: Position;
  color?: RGBColor;
  bounds: LngLatBounds;
  thickness?: number;
};

type CrosshairLayerState = {
  cursorPosition: Position;
  bounds: LngLatBounds;
  color: RGBColor;
  thickness: number;
};

class CrosshairLayer extends CompositeLayer<CrosshairLayerProps> {
  state: {
    bounds: LngLatBounds;
    cursorPosition: Position;
    color: RGBColor;
    thickness: number;
  }

  constructor(props: CrosshairLayerProps) {
    super(props);
    this.state = this.initializeState();
  }

  initializeState() {
    return {
      cursorPosition: this.props.cursorPosition,
      bounds: this.props.bounds,
      color: this.props.color || [255, 255, 255, 255],
      thickness: this.props.thickness ?? 1,
    };
  }

  updateState({ props }: { props: CrosshairLayerProps }) {
    this.setState({
      ...this.state,
      cursorPosition: props.cursorPosition,
      thickness: props.thickness,
      color: props.color,
      bounds: props.bounds,
    });
  }

  renderLayers(): Layer[] {
    const { cursorPosition, bounds, color, thickness } = this.state as CrosshairLayerState;

    // const center = viewport.unproject([width / 2, height / 2]);
    // const topLeft = viewport.unproject([0, 0]);
    // const topRight = viewport.unproject([width, 0]);
    // const bottomLeft = viewport.unproject([0, height]);
    // const bottomRight = viewport.unproject([width, height]);

    const innerCursor = new CursorLayer({
      id: 'inner-cursor',
      cursorPosition,
      color: [255, 255, 255, 255],
      width: thickness + 3,
      bounds
    });

    const outerCursor = new CursorLayer({
      id: 'outer-cursor',
      cursorPosition,
      color,
      width: thickness,
      bounds
    });

    return [innerCursor, outerCursor];
  }
}
CrosshairLayer.layerName = 'CrosshairLayer';
export { CrosshairLayer };
