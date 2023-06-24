
import { LayerProps } from '@deck.gl/core/typed';
import { LineLayer } from '@deck.gl/layers/typed';
import {  LngLatBounds } from 'mapbox-gl';

type RGBColor = [number, number, number, number];

type  CursorLayerProps = LayerProps & {
  cursorPosition: [number, number];
  color?: RGBColor;
  bounds: LngLatBounds;
  width?: number;
}


type Position = [number, number];

type TargetPosition = {
  sourcePosition: Position;
  targetPosition: Position;
};

class CursorLayer extends LineLayer<TargetPosition,CursorLayerProps> {
  constructor(props: CursorLayerProps) {
    super({
      ...props,
      data: CursorLayer.generateCrosshairData(props),
      getColor: props.color ?? [255, 0, 0, 255],
      getWidth: props.width ?? 2,
      getSourcePosition: (d: TargetPosition) =>  d.sourcePosition,
      getTargetPosition: (d: TargetPosition) => d.targetPosition,
      pickable: false,
    });
  }

  private static generateCrosshairData(props: CursorLayerProps): TargetPosition[] {
    const { cursorPosition, bounds } = props;

    return [
            {
        sourcePosition: [bounds.getWest(), cursorPosition[1]],
        targetPosition: [bounds.getEast(), cursorPosition[1]],
      },
      {
        sourcePosition: [cursorPosition[0], bounds.getNorth()],
        targetPosition: [cursorPosition[0], bounds.getSouth()],
      },

    ];
  }
}

export { CursorLayer }
