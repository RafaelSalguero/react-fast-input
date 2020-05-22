import { InputState } from "./types";
import { replaceAll } from "./replace";
import { MaskItem, regexMask } from "./regex-mask";

interface NumberMaskOptions {
    /**True para separar los miles, por default es true */
    thousandSep: boolean;
    /**Cantidad de ceros en la parte entera, por default es 1*/
    int: number;
    /**Cantidad de ceros en la parte fraccionaria, por default es 2 */
    frac: number;
}

function optionsDefault(options?: Partial<NumberMaskOptions>): NumberMaskOptions {
    let ret = options ?? {};
    const ret2 = {
        frac: ret.frac ?? 2,
        int: ret.int ?? 1,
        thousandSep: ret.thousandSep ?? true
    };
    return ret2;
}

export function onMaskNumber(num: InputState, options?: Partial<NumberMaskOptions>): InputState {
    const opt = optionsDefault(options);

    //Quitar las commas:
    let ret = num;
    ret = replaceAll(ret, /,/, "", false);

    const split = ret.text.split(".");
    const intLen = Math.max(split[0]?.length ?? 0, opt.int);
    const fracLen = split[1]?.length ?? 0;


    const groupLen = 3;
    const firstGroupLen = intLen % groupLen;
    const fullLenGroups = Math.floor(intLen / groupLen);

    let mask: MaskItem[] = [];

    const firstZero = intLen - opt.int;
    let currDigit = 0;
    const addDigit = () => {
        mask.push({
            mask: /\d?/,
            str: currDigit >= firstZero ? "0" : ""
        });
        currDigit++;
    };

    const addDigits = (n: number) => {
        for (let i = 0; i < n; i++) {
            addDigit();
        }
    }

    addDigits(firstGroupLen);

    for (let i = 0; i < fullLenGroups; i++) {
        if (currDigit > 0 && opt.thousandSep) {
            mask.push({
                mask: /,?/,
                str: ","
            });
        }

        addDigits(groupLen);
    }

    if (opt.frac > 0) {
        mask.push({
            mask: /\./,
            str: "."
        });

        addDigits(opt.frac);
    }

    console.log(mask);

    return regexMask(ret, mask);
}