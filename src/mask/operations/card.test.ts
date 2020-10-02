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


