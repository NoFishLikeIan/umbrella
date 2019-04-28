import { assert } from "@thi.ng/api";
import {
    FboOpts,
    GL_COLOR_ATTACHMENT0_WEBGL,
    GL_MAX_COLOR_ATTACHMENTS_WEBGL,
    IFbo,
    ITexture
} from "./api";
import { error } from "./error";
import { RBO } from "./rbo";
import { isGL2Context } from "./utils";

/**
 * WebGL framebuffer wrapper w/ automatic detection & support for
 * multiple render targets (color attachments) and optional depth
 * buffer. Multiple targets are only supported if the
 * `WEBGL_draw_buffers` extension is available. The max. number of
 * attachments can be obtained via the `maxAttachments` property of the
 * FBO instance.
 *
 * ```
 * // create FBO w/ 2 render targets
 * fbo = new FBO(gl, { tex: [tex1, tex2] });
 * ```
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/WEBGL_draw_buffers
 */
export class FBO implements IFbo {
    gl: WebGLRenderingContext;
    fbo: WebGLFramebuffer;
    ext: WEBGL_draw_buffers;
    maxAttachments: number;

    constructor(gl: WebGLRenderingContext, opts?: Partial<FboOpts>) {
        this.gl = gl;
        this.fbo = gl.createFramebuffer();
        this.ext = !isGL2Context(gl)
            ? gl.getExtension("WEBGL_draw_buffers")
            : undefined;
        this.maxAttachments = gl.getParameter(GL_MAX_COLOR_ATTACHMENTS_WEBGL);
        opts && this.configure(opts);
    }

    bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
        return true;
    }

    unbind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        return true;
    }

    release() {
        this.gl.deleteFramebuffer(this.fbo);
        delete this.fbo;
        delete this.ext;
        return true;
    }

    configure(opts: Partial<FboOpts>) {
        const gl = this.gl;
        this.bind();
        if (opts.tex) {
            assert(
                opts.tex.length < this.maxAttachments,
                `too many attachments (max. ${this.maxAttachments})`
            );
            const attachments: number[] = [];
            for (let i = 0; i < opts.tex.length; i++) {
                const attach = GL_COLOR_ATTACHMENT0_WEBGL + i;
                gl.framebufferTexture2D(
                    gl.FRAMEBUFFER,
                    attach,
                    gl.TEXTURE_2D,
                    opts.tex[i].tex,
                    0
                );
                attachments[i] = attach;
            }
            if (this.ext) {
                this.ext.drawBuffersWEBGL(attachments);
            } else if (isGL2Context(gl)) {
                gl.drawBuffers(attachments);
            }
        }
        if (opts.depth) {
            opts.depth instanceof RBO
                ? gl.framebufferRenderbuffer(
                      gl.FRAMEBUFFER,
                      gl.DEPTH_ATTACHMENT,
                      gl.RENDERBUFFER,
                      opts.depth.buffer
                  )
                : gl.framebufferTexture2D(
                      gl.FRAMEBUFFER,
                      gl.DEPTH_ATTACHMENT,
                      gl.TEXTURE_2D,
                      (<ITexture>opts.depth).tex,
                      0
                  );
        }
        return this.validate();
    }

    validate() {
        const gl = this.gl;
        const err = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        switch (err) {
            case gl.FRAMEBUFFER_COMPLETE:
                return true;
            case gl.FRAMEBUFFER_UNSUPPORTED:
                error("FBO unsupported");
            case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                error("FBO incomplete attachment");
            case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                error("FBO incomplete dimensions");
            case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                error("FBO incomplete missing attachment");
            default:
                error(`FBO error: ${err}`);
        }
    }
}

export const fbo = (gl: WebGLRenderingContext, opts?: Partial<FboOpts>) =>
    new FBO(gl, opts);