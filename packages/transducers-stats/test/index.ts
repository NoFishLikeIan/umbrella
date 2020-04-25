import * as assert from "assert";
// import * as transducers-stats from "../src/index";
import { kalman } from "../src/index";
import { map, transduce } from "@thi.ng/transducers";
import { isNumber } from "util";

describe("transducers-stats", () => {
    it("tests pending");
});

describe("kalman filter", () => {
    it("result length & type", () => {
        const input = [1, 2, 3];
        const result = [
            ...(transduce(
                map((x: number) => x),
                kalman(0, 10e7),
                input
            ) as any),
        ];
        assert.equal(result.length, input.length + 1);

        for (let i = 0; i < result.length; ++i) {
            assert.equal(result[i].length, 2);
            assert.equal(isNumber(result[i][0]), true);
            assert.equal(isNumber(result[i][1]), true);
        }

        console.log({ result });
    });
});
