import * as ops from "./regex-mask";
import * as basic from "./basic";
import { InputState } from "./types";
import { MaskItem } from "./regex-mask";

test("credit card", () => {
    //Format: ##-##
    const mask: MaskItem[] = [
        {
            mask: /\d/,
            str: " ",
            after: true
        },
        {
            mask: /\d/,
            str: " ",
            after: true
        },
        {
            mask: /\-/,
            str: "-",
            after: false
        },
        {
            mask: /\d/,
            str: " ",
            after: true
        },
        {
            mask: /\d/,
            str: " ",
            after: true
        },
    ];


    const sourcePaste: InputState = {
        text: "1234",
        cursor: 4
    };

    const expectedPaste: InputState = {
        text: "12-34",
        cursor: 5
    };

    expect(ops.regexMask(sourcePaste, false, mask)).toEqual(expectedPaste);
});

//Format: ##-##
const maskOptional: MaskItem[] = [
    {
        mask: /\d?/,
        str: "",
        after: true
    },
    {
        mask: /\d?/,
        str: "",
        after: true
    },
    {
        mask: /\-?/,
        str: "-",
        after: false
    },
    {
        mask: /\d?/,
        str: "",
        after: true
    },
    {
        mask: /\d?/,
        str: "",
        after: true
    },
];


test("credit card optional 1", () => {

    const source: InputState = {
        text: "1",
        cursor: 1
    };

    const expected: InputState = {
        text: "1",
        cursor: 1
    };

    expect(ops.regexMask(source, false, maskOptional)).toEqual(expected);
});



test("credit card optional 2", () => {

    const source: InputState = {
        text: "12",
        cursor: 2
    };

    const expected: InputState = {
        text: "12",
        cursor: 2
    };

    expect(ops.regexMask(source, false, maskOptional)).toEqual(expected);
});

test("credit card optional 3", () => {

    const source: InputState = {
        text: "123",
        cursor: 3
    };

    const expected: InputState = {
        text: "12-3",
        cursor: 4
    };

    expect(ops.regexMask(source, false, maskOptional)).toEqual(expected);
});



test("credit card optional 4", () => {

    const source: InputState = {
        text: "12-",
        cursor: 3
    };

    const expected: InputState = {
        text: "12-",
        cursor: 3
    };

    expect(ops.regexMask(source, false, maskOptional)).toEqual(expected);
});

test("credit card optional 5", () => {

    const source: InputState = {
        text: "12-",
        cursor: 3
    };

    const expected: InputState = {
        text: "12-",
        cursor: 3
    };

    expect(ops.regexMask(source, true, maskOptional)).toEqual(expected);
});

test("credit card optional 5", () => {

    const source: InputState = {
        text: "12",
        cursor: 2
    };

    const expected: InputState = {
        text: "12",
        cursor: 2
    };

    expect(ops.regexMask(source, true, maskOptional)).toEqual(expected);
});