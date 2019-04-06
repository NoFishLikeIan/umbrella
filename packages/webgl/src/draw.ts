import { isArray } from "@thi.ng/checks";
import { ModelSpec } from "./api";
import { error } from "./error";
import { bindTextures } from "./texture";
import { isGL2Context } from "./utils";

export const draw = (specs: ModelSpec | ModelSpec[]) => {
    const _specs = isArray(specs) ? specs : [specs];
    for (let i = 0, n = _specs.length; i < n; i++) {
        const spec = _specs[i];
        const indices = spec.indices;
        const gl = spec.shader.gl;
        bindTextures(spec.textures);
        spec.shader.bind(spec);
        if (indices) {
            indices.buffer.bind();
            if (spec.instances) {
                drawInstanced(gl, spec);
            } else {
                gl.drawElements(
                    spec.mode,
                    spec.numItems,
                    indices.data instanceof Uint32Array
                        ? gl.UNSIGNED_INT
                        : gl.UNSIGNED_SHORT,
                    0
                );
            }
        } else {
            if (spec.instances) {
                drawInstanced(gl, spec);
            } else {
                gl.drawArrays(spec.mode, 0, spec.numItems);
            }
        }
        spec.shader.unbind(null);
    }
};

const drawInstanced = (gl: WebGLRenderingContext, spec: ModelSpec) => {
    const isGL2 = isGL2Context(gl);
    const ext = !isGL2 && gl.getExtension("ANGLE_instanced_arrays");
    if (!(isGL2 || ext)) {
        error("instancing not supported");
    }
    const sattribs = spec.shader.attribs;
    const iattribs = spec.instances.attribs;
    spec.shader.bindAttribs(iattribs);
    for (let id in iattribs) {
        const attr = sattribs[id];
        if (attr) {
            let div = iattribs[id].divisor;
            div = div !== undefined ? div : 1;
            isGL2
                ? (<WebGL2RenderingContext>gl).vertexAttribDivisor(
                      attr.loc,
                      div
                  )
                : ext.vertexAttribDivisorANGLE(attr.loc, div);
        }
    }
    if (spec.indices) {
        const type =
            spec.indices.data instanceof Uint32Array
                ? gl.UNSIGNED_INT
                : gl.UNSIGNED_SHORT;
        isGL2
            ? (<WebGL2RenderingContext>gl).drawElementsInstanced(
                  spec.mode,
                  spec.numItems,
                  type,
                  0,
                  spec.instances.numItems
              )
            : ext.drawElementsInstancedANGLE(
                  spec.mode,
                  spec.numItems,
                  type,
                  0,
                  spec.instances.numItems
              );
    } else {
        isGL2
            ? (<WebGL2RenderingContext>gl).drawArraysInstanced(
                  spec.mode,
                  0,
                  spec.numItems,
                  spec.instances.numItems
              )
            : ext.drawArraysInstancedANGLE(
                  spec.mode,
                  0,
                  spec.numItems,
                  spec.instances.numItems
              );
    }
    // reset attrib divisors to allow non-instanced draws later on
    for (let id in iattribs) {
        const attr = sattribs[id];
        attr &&
            (isGL2
                ? (<WebGL2RenderingContext>gl).vertexAttribDivisor(attr.loc, 0)
                : ext.vertexAttribDivisorANGLE(attr.loc, 0));
    }
    spec.shader.unbind(null);
};