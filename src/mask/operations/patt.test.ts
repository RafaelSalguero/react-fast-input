import * as ops from "./regex-mask";
import * as basic from "./basic";
import { InputState } from "./types";
import { MaskItem } from "./regex-mask";

const mask: MaskItem[] = [
    {
        mask: /\d/,
        str: " "
    }, {
        mask: /\d/,
        str: " "
    }, {
        mask: /-/,
        str: "-"
    }, {
        mask: /[A-Z]/,
        str: " "
    }, {
        mask: /[A-Z]/,
        str: " "
    }
];

test("empty", () => {
    const source: InputState = {
        text: "",
        cursor: 0
    };

    const expected: InputState = {
        text: "  -  ",
        cursor: 0
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});


test("none", () => {
    const source: InputState = {
        text: "01-AB",
        cursor: 0
    };

    const expected: InputState = {
        text: "01-AB",
        cursor: 0
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

test("delete num", () => {
    const source: InputState = {
        text: "0-AB",
        cursor: 1
    };

    const expected: InputState = {
        text: "0 -AB",
        cursor: 0
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});
