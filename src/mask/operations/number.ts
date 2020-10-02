import { InputState } from "./types";
import { replaceAll, trimLeft } from "./replace";
import { MaskItem, regexMask } from "./regex-mask";

interface NumberMaskOptions {
    /**True para separar los miles, por default es true */
    thousandSep: boolean;
    /**Cantidad de ceros en la parte entera, por default es 1*/
    int: number;
    /**Cantidad de ceros en la parte fraccionaria, por default es 2 */
    frac: number;
    /**true para terminar con punto decimal incluso si @see frac == 0 */
    dot: boolean;
}

function optionsDefault(options?: Partial<NumberMaskOptions>): NumberMaskOptions {
    let ret = options ?? {};
    const ret2 = {
        frac: ret.frac ?? 2,
        int: ret.int ?? 1,
        thousandSep: ret.thousandSep ?? true,
        dot: ret.dot ?? false
    };
    return ret2;
}

export function onMaskNumber(num: InputState, options?: Partial<NumberMaskOptions>): InputState {
    const opt = optionsDefault(options);

    //Quitar las commas:
    let ret = num;
    ret = replaceAll(ret, /,/, "", false);
    //Quita los ceros a la izquierda:
    ret = trimLeft(ret, "0");

    const split = ret.text.split(".");
    const fracLen = split[1]?.length;
    const intLen = Math.max(
        (split[0]?.length ?? 0) - (fracLen == undefined ? opt.frac : 0)
        , opt.int);

    const groupLen = 3;
    const firstGroupLen = intLen % groupLen;
    const fullLenGroups = Math.floor(intLen / groupLen);

    let mask: MaskItem[] = [];

    const firstZero = intLen - opt.int;
    let currDigit = 0;
    const addInt = () => {
        const zeroPad = currDigit >= firstZero;
        mask.push({
            mask: /\d?/,
            str: zeroPad ? "0" : "",
            after: !zeroPad,
            emptyFill: true
        });
        currDigit++;
    };

    const addFrac = () => {
        mask.push({
            mask: /\d/,
            str: "0",
            after: true
        });
    }

    const addInts = (n: number) => {
        for (let i = 0; i < n; i++) {
            addInt();
        }
    }

    const addFracs = (n: number) => {
        for (let i = 0; i < n; i++) {
            addFrac();
        }
    }

    addInts(firstGroupLen);

    for (let i = 0; i < fullLenGroups; i++) {
        if (currDigit > 0 && opt.thousandSep) {
            mask.push({
                mask: /,?/,
                str: ",",
                after: true,
                emptyFill: true
            });
        }

        addInts(groupLen);
    }

    if (opt.frac > 0) {
        mask.push({
            mask: /\.?/,
            str: ".",
            after: true,
            emptyFill: true
        });

        addFracs(opt.frac);
    } else if (opt.frac == 0 && opt.dot) {
        mask.push({
            mask: /\.?/,
            str: ".",
            after: false,
            emptyFill: true
        });
    }

    return regexMask(ret, false, mask);
}