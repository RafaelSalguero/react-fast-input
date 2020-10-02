

import * as ops from "./regex-mask";
import * as basic from "./basic";
import { InputState } from "./types";
import { MaskItem } from "./regex-mask";
import { onMaskNumber } from "./number";


test("num 7.1", () => {
    const source: InputState = {
        text: ".1",
        cursor: 2
    };

    const expected: InputState = {
        text: "0.10",
        cursor: 3
    };

    const actual =  onMaskNumber(source, {
        thousandSep: false
    });
    expect(actual).toEqual(expected);
});
