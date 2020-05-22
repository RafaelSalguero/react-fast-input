import * as ops from "./regex-mask";
import * as basic from "./basic";
import { InputState } from "./types";
import { MaskItem } from "./regex-mask";

const mask: MaskItem[] = [
    {
        mask: /\d?/,
        str: " ",
        after: true
    }, {
        mask: /\d?/,
        str: " ",
        after: true
    }, {
        mask: /\d?/,
        str: " ",
        after: true
    },  {
        mask: /-?/,
        str: "-",
        after: true
    }, {
        mask: /[A-Z]?/,
        str: " ",
        after: true
    }, {
        mask: /[A-Z]?/,
        str: " ",
        after: true
    }
];


test("empty", () => {
    const source: InputState = {
        text: "",
        cursor: 0
    };

    const expected: InputState = {
        text: "   -  ",
        cursor: 0
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});


test("none", () => {
    const source: InputState = {
        text: "012-AB",
        cursor: 0
    };

    const expected: InputState = {
        text: "012-AB",
        cursor: 0
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

test("delete num", () => {
    const source: InputState = {
        text: "01-AB",
        cursor: 2
    };

    const expected: InputState = {
        text: "01 -AB",
        cursor: 2
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});


test("insert no mask", () => {
    const source: InputState = {
        text: "012AB",
        cursor: 5
    };

    const expected: InputState = {
        text: "012-AB",
        cursor: 6
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});


test("delete space", () => {
    const source: InputState = {
        text: "13-AB",
        cursor: 0
    };

    const expected: InputState = {
        text: "13 -AB",
        cursor: 0
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});