import { Layer, UpdateParameters } from "@deck.gl/core/typed";

class SimpleGlLayer extends Layer {
  getShaders(shaders: any) {
    return super.getShaders({
      ...shaders,
      inject: {
        "vs:#decl": `
        attribute float instanceRadius;
        attribute vec3 instanceColor;
        varying vec3 color;
        `,
        "vs:#main-end": `
        color = instanceColor;
        gl_PointSize = instanceRadius * 2.0;
        `,
        "fs:#decl": `
        varying vec3 color;
        `,
        "fs:#main-start": `
        float r = length(gl_PointCoord.xy - vec2(0.5, 0.5));
        if (r > 0.5) {
          discard;
        }
        gl_FragColor = vec4(color, 1.0);
        `,
      },
    });
  }

  initializeState() {
    const { gl } = this.context;
    const attributeManager = this.getAttributeManager();

    const shaders = this.getShaders();
  }

  updateState(params: UpdateParameters<Layer<{}>>): void {

  }

  draw({ uniforms }) {
    const { gl } = this.context;
    this.state.model.setUniforms(uniforms).draw();
  }

}

export { SimpleGlLayer}
