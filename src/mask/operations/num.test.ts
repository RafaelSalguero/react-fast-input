import * as ops from "./regex-mask";
import * as basic from "./basic";
import { InputState } from "./types";
import { MaskItem } from "./regex-mask";
import { onMaskNumber } from "./number";

test("raw 1", () => {
    const mask: MaskItem[] = [
        {
            mask: /\d{1,3}/,
            str: "",
            after: true
        }, {
            mask: /,?/,
            str: ",",
            after: true
        }, {
            mask: /\d{1,3}/,
            str: "",
            after: true
        }, {
            mask: /\./,
            str: ".",
            after: true
        }, {
            mask: /\d/,
            str: "0",
            after: true
        }, {
            mask: /\d/,
            str: "0",
            after: true
        }
    ];

    const source: InputState = {
        text: "123456.00",
        cursor: 6
    };

    const expected: InputState = {
        text: "123,456.00",
        cursor: 7
    };

    const actual = ops.regexMask(source, false, mask);
    expect(actual).toEqual(expected);
});

test("num 1", () => {
    const source: InputState = {
        text: "123456.00",
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
        text: "123,456.00",
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
        text: "123,456.10",
        cursor: 9
    };

    const expected: InputState = {
        text: "123,456.10",
        cursor: 9
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});


test("num 5", () => {
    const source: InputState = {
        text: "123,46.10",
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
        text: "12346.10",
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
        text: "12346.10",
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

test("num 8", () => {
    const source: InputState = {
        text: "",
        cursor: 0
    };

    const expected: InputState = {
        text: "000",
        cursor: 3
    };

    const actual =  onMaskNumber(source, {
        int: 3,
        frac: 0,
    });
    expect(actual).toEqual(expected);
});

test("num 9", () => {
    const source: InputState = {
        text: "09",
        cursor: 2
    };

    const expected: InputState = {
        text: "9.00",
        cursor: 1
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});

test("num 10", () => {
    const source: InputState = {
        text: ".00",
        cursor: 0
    };

    const expected: InputState = {
        text: "0.00",
        cursor: 1
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});


test("num 11", () => {
    const source: InputState = {
        text: "100",
        cursor: 3
    };

    const expected: InputState = {
        text: "1.00",
        cursor: 4
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});


test("num 12", () => {
    const source: InputState = {
        text: "1.",
        cursor: 2
    };

    const expected: InputState = {
        text: "1.00",
        cursor: 2
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});

test("num 13", () => {
    const source: InputState = {
        text: "1",
        cursor: 1
    };

    const expected: InputState = {
        text: "1.00",
        cursor: 1
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});

test("num 14", () => {
    const source: InputState = {
        text: "10010",
        cursor: 3
    };

    const expected: InputState = {
        text: "100.10",
        cursor: 3
    };

    const actual =  onMaskNumber(source);
    expect(actual).toEqual(expected);
});
