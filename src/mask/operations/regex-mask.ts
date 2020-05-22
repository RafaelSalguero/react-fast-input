import { InputState } from "./types";
import { insert, remove } from "./basic";
import { assertUnreachable } from "simple-pure-utils";

export interface MaskItem {
    /**Mascara a encajar en esta parte, el regex debe de
     * encajar por completo o no encajar con los caracteres deseados */
    mask: RegExp;
    /**Si la mascara no encaja, que caracter insertar */
    str: string;
    /**Si insertar con after */
    after: boolean;
}

function testFull(patt: RegExp, str: string) {
    const r = patt.exec(str);
    if (r == null) return false;
    return r[0].length == str.length;
}

export function regexMask(source: InputState, mask: MaskItem[]): InputState {
    let i = 0, maskPos = 0;

    let curr = "";
    let ret = source;
    while (maskPos < mask.length && i < ret.text.length) {
        const maskChar = mask[maskPos];
        const sourceChar = ret.text[i];
        curr += sourceChar;
        if (testFull(maskChar.mask, curr)) {
            i++;
            continue;
        }

        if (curr.length > 1) {
            curr = "";
            //Si la ultima mascara encajó con algo
            maskPos++;
        } else {
            //La ultima mascara no encajó

            //Checar si la ultima encaja con una cadena vacía:
            if(!testFull(maskChar.mask, "")) {
                ret = remove(ret, i, 1);
            }
            ret = insert(ret, maskChar.str, i, maskChar.after);

            i += maskChar.str.length;
        }
    }
    if (curr.length > 0) {
        //Si la ultima mascara encajó con algo
        curr = "";
        maskPos++;
    }

    
    //Poner los fijos que faltan:
    while (maskPos < mask.length) {
        const maskChar = mask[maskPos];

        const rep = maskChar.str;
        ret = insert(ret, rep, ret.text.length, maskChar.after);
        maskPos++;
        i += rep.length;
    }

    //Quitar la ultima parte de la cadena
    if (i < ret.text.length) {
        ret = remove(ret, i, ret.text.length - i);
    }

    

    return ret;
}