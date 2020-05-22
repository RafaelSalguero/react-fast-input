import * as ops from "./regex-mask";
import * as basic from "./basic";
import { InputState } from "./types";
import { MaskItem } from "./regex-mask";
import { onMaskNumber } from "./number";

test("raw 1", () => {
    const mask: MaskItem[] = [
        {
            mask: /\d{1,3}/,
            str: ""
        }, {
            mask: /,?/,
            str: ","
        }, {
            mask: /\d{1,3}/,
            str: ""
        }, {
            mask: /\./,
            str: "."
        }, {
            mask: /\d/,
            str: "0"
        }, {
            mask: /\d/,
            str: "0"
        }
    ];

    const source: InputState = {
        text: "123456",
        cursor: 6
    };

    const expected: InputState = {
        text: "123,456.00",
        cursor: 7
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

test("num 1", () => {
    const source: InputState = {
        text: "123456",
        cursor: 6
    };

    const expected: InputState = {
        text: "123,456.00",
        cursor: 7
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});

test("num 2", () => {
    const source: InputState = {
        text: "123,456.",
        cursor: 7
    };

    const expected: InputState = {
        text: "123,456.00",
        cursor: 7
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});


test("num 3", () => {
    const source: InputState = {
        text: "123,456.1",
        cursor: 9
    };

    const expected: InputState = {
        text: "123,456.10",
        cursor: 9
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});

test("num 4", () => {
    const source: InputState = {
        text: "",
        cursor: 0
    };

    const expected: InputState = {
        text: "0.00",
        cursor: 0
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});

test("num 5", () => {
    const source: InputState = {
        text: "123,46.1",
        cursor: 5
    };

    const expected: InputState = {
        text: "12,346.10",
        cursor: 5
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});

test("num 6", () => {
    const source: InputState = {
        text: "12346.1",
        cursor: 2
    };

    const expected: InputState = {
        text: "12,346.10",
        cursor: 2
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});


test("num 7", () => {
    const source: InputState = {
        text: "12346.1",
        cursor: 2
    };

    const expected: InputState = {
        text: "12346.10",
        cursor: 2
    };

    const actual =  onMaskNumber(source, {
        thousandSep: false
    });
    expect(actual).toEqual(expected);
});


test("num 7", () => {
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

test("num 8", () => {
    const source: InputState = {
        text: "",
        cursor: 0
    };

    const expected: InputState = {
        text: "000",
        cursor: 0
    };

    const actual =  onMaskNumber(source, {
        int: 3,
        frac: 0
    });
    expect(actual).toEqual(expected);
});

test("num 8", () => {
    const source: InputState = {
        text: "",
        cursor: 0
    };

    const expected: InputState = {
        text: "000",
        cursor: 0
    };

    const actual =  onMaskNumber(source, {
        int: 3,
        frac: 0
    });
    expect(actual).toEqual(expected);
});

test("num 8", () => {
    const source: InputState = {
        text: "",
        cursor: 0
    };

    const expected: InputState = {
        text: "000",
        cursor: 0
    };

    const actual =  onMaskNumber(source, {
        int: 3,
        frac: 0
    });
    expect(actual).toEqual(expected);
});