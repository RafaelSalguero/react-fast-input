import { InputState } from "./types";
import { remove, insert } from "./basic";
import { replaceAll } from "./replace";
import { regexMask, MaskItem } from "./regex-mask";

function charMatches(regex: string | RegExp | undefined, sourceChar: string) {
    if (regex == null)
        return false;

    return (
        (typeof (regex) == "string") ? regex == sourceChar :
            (regex.test(sourceChar) || sourceChar == " ")
    );
}

/**Devuelve true si esta mascara es una de repetición */
function isStarMask(mask: string): boolean {
    return mask.length == 2 && mask[1] == "*";
}



/**Devuelve el patron de un caracter de la máscara, puede ser un regex para los comodines 
 * o una cadena fija
 */
function getCharRegex(c: string) {
    return c == "#" ? /^\d$/ :
        c == "A" ? /^[a-zñáú]$/i :
            c == "S" ? /^[fm]$/i :
                c == "N" ? /^[a-zñáú\s]$/i :
                    c == "@" ? /^[a-zñáú\d]$/i :
                        c == "." ? /^.$/ :
                            c;
}

/**Aplica una mascara de repetición */
function starMask(source: InputState, mask: RegExp): InputState {
    const patt = new RegExp("(?!" + mask.source + ").", mask.flags);
    const ret = replaceAll(source, patt, "", false);
    return ret;
}



export function mask(source: InputState, mask: string): InputState {

    const rmask = mask.split("").map<MaskItem>(x => {
        const rc = getCharRegex(x);
        const regex = typeof (rc) == "string" ? new RegExp("^\\" + rc + "$") : rc;
        const str = typeof (rc) == "string" ? rc : " ";
        return {
             mask: regex,
             str: str
        };
    })
    return regexMask(source, rmask);
}

/**Aplica una mascara
 * @param mask Un regex para una parte variable de la cadena o un string para una parte fija
*/
export function regexMask2(source: InputState, mask: (RegExp | string)[]): InputState {
    //Si la cadena es vacia se devuelve vacía
    if (source.text == "") {
        return {
            text: "",
            cursor: 0
        }
    }


    let ret = source;

    let i = 0, maskPos = 0;
    let preventAppendMask = false;
    while (i < ret.text.length && maskPos < mask.length) {
        const sourceChar = ret.text[i];
        const maskChar = mask[maskPos];
        const regex = maskChar;

        const nextMaskChar = mask[maskPos + 1];
        const nextRegex = nextMaskChar;

        if (
            (typeof (regex) == "string") ? regex == sourceChar :
                (regex.test(sourceChar) || sourceChar == " ")) {
            //El caracter encaja, nos pasamos al siguiente
            i++;
            maskPos++;
            continue;
        }
        //El caracter no encaja, si es fijo, se inserta a la cadena
        if (typeof (regex) == "string") {
            if (sourceChar == " ") {
                const nextSourceChar = ret.text[i + 1];
                if (nextSourceChar == maskChar) {
                    ret = remove(ret, i, 2);
                    ret = insert(ret, maskChar, i, false);
                    maskPos++;
                } else {
                    ret = insert(ret, regex, i, true);
                    maskPos++;
                }
                i++;
            } else {
                //Este look-ahead previene los caracteres insertados al final de un
                //grupo de comodines (es la prueba "insert middle wrong 2")
                //Se revisa el cursor para saber si ese caracter es el que recién escribieron
                if (!charMatches(nextRegex, sourceChar) && ret.cursor == (i + 1)) {
                    ret = remove(ret, i, 1);

                } else {
                    ret = insert(ret, regex, i, true);
                    maskPos++;
                    i++;
                }
            }
            ;
        } else {


            if (typeof (nextRegex) == "string" && sourceChar == nextRegex) {
                if (ret.cursor > i) {
                    ret = insert(ret, " ", i, true);
                    i += 1;
                    maskPos++;
                } else {
                    if (charMatches(nextRegex, sourceChar) &&
                        (ret.cursor >= (ret.text.length - 1)) //Esta condicion arregla el "mask delete"
                    ) {
                        ret = remove(ret, i, 1);
                        //Esta parte arregla el delete last -1              
                        maskPos++;
                        preventAppendMask = true;
                    } else {
                        ret = insert(ret, " ", i, true);
                        i += 1;
                        maskPos++;
                    }
                }
            } else {
                ret = remove(ret, i, 1);
                if (i < ret.cursor) {
                    //Si esta al final de la cadena, no sustituye por espacio un caracter vacio
                    ret = insert(ret, " ", i, false);
                    i += 1;
                    maskPos++;
                }
            }
        }
    }


    //Poner todos los fijos que faltan:
    while (!preventAppendMask && (maskPos < mask.length)) {
        const maskChar = mask[maskPos];
        const regex = maskChar;
        if (typeof (regex) != "string") {
            break;
        }

        //No queremos que se mueva el cursor
        ret = insert(ret, regex, ret.text.length, true);
        maskPos++;
        i++;
    }

    //Quitar la ultima parte de la cadena
    if (i < ret.text.length) {
        ret = remove(ret, i, ret.text.length - i);
    }
    return ret;
}
