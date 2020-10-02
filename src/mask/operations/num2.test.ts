

import * as ops from "./regex-mask";
import * as basic from "./basic";
import { InputState } from "./types";
import { MaskItem } from "./regex-mask";
import { onMaskNumber } from "./number";

test("num 4", () => {
    const source: InputState = {
        text: "",
        cursor: 0
    };

    const expected: InputState = {
        text: "0.00",
        cursor: 1
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});