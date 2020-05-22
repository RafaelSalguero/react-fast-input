import * as ops from "./regex-mask";
import * as basic from "./basic";
import { InputState } from "./types";
import { MaskItem } from "./regex-mask";

//TODO: Cuando se borre un caracter y mas adelante no haya ni separadores ni caracteres diferentes que se borre en lugar de poner un espacio

test("num 1", () => {
    //##
    const mask: MaskItem[] = [
        {
            mask: /\d/,
            str: ""
        },
        {
            mask: /\d/,
            str: ""
        }
    ];

    const source: InputState = {
        text: "1X",
        cursor: 2
    };

    const expected: InputState = {
        text: "1",
        cursor: 1
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});


/*
test("num N 1", () => {
    const mask: MaskItem[] = [
        {
            mask: /\d{1,3}/,
            str: ""
        },
    ];

    const source: InputState = {
        text: "123",
        cursor: 3
    };

    const expected: InputState = {
        text: "123",
        cursor: 3
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

test("num N 2", () => {
    const mask: MaskItem[] = [
        {
            mask: /\d{1,3}/,
            str: ""
        }, {
            mask: /\d{1,3}/,
            str: ""
        }
    ];

    const source: InputState = {
        text: "12A",
        cursor: 3
    };

    const expected: InputState = {
        text: "12",
        cursor: 2
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

test("num dot 1", () => {
    const mask: MaskItem[] = [
        {
            mask: /\d+/,
            str: "0"
        }, {
            mask: /\./,
            str: "."
        },
    ];

    const source: InputState = {
        text: "12A",
        cursor: 3
    };

    const expected: InputState = {
        text: "12.",
        cursor: 3
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

test("num dot 2", () => {
    const mask: MaskItem[] = [
        {
            mask: /\d+/,
            str: "0"
        }, {
            mask: /\./,
            str: "."
        },
    ];

    const source: InputState = {
        text: "12.",
        cursor: 3
    };

    const expected: InputState = {
        text: "12.",
        cursor: 3
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

test("num dot 3", () => {
    const mask: MaskItem[] = [
        {
            mask: /\d+/,
            str: "0"
        }, {
            mask: /\./,
            str: "."
        }, {
            mask: /\d+/,
            str: "0"
        }
    ];

    const source: InputState = {
        text: "12.",
        cursor: 3
    };

    const expected: InputState = {
        text: "12.0",
        cursor: 3
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

test("num dot 4", () => {
    const mask: MaskItem[] = [
        {
            mask: /\d+/,
            str: "0"
        }, {
            mask: /\./,
            str: "."
        }, {
            mask: /\d+/,
            str: "0"
        }
    ];

    const source: InputState = {
        text: "0",
        cursor: 1
    };

    const expected: InputState = {
        text: "0.0",
        cursor: 1
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

test("num space 1", () => {
    const mask: MaskItem[] = [
        {
            mask: /\d/,
            str: " "
        }, {
            mask: /\d/,
            str: " "
        }, {
            mask: /\d/,
            str: " "
        },
    ];

    const source: InputState = {
        text: "12 3",
        cursor: 3
    };

    const expected: InputState = {
        text: "12 ",
        cursor: 3
    };

    const actual = ops.regexMask(source, mask);
    expect(actual).toEqual(expected);
});

*/