import * as assert from "assert";
// import * as transducers-stats from "../src/index";
import { kalman } from "../src/index";
import { isNumber } from "util";

describe("kalman filter", () => {
    it("result length & type", () => {
        const input = [1, 2, 3];
        const result = [...kalman(0, 10e7, input)];
        assert.equal(result.length, input.length);

        for (let i = 0; i < result.length; ++i) {
            assert.equal(result[i].length, 2);
            assert.equal(isNumber(result[i][0]), true);
            assert.equal(isNumber(result[i][1]), true);
        }
    });
});
