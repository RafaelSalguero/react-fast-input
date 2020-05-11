import { InputState } from "./types";
import { findAll, getReplaceAllIndices, ReplaceIndex } from "simple-pure-utils";
import * as ops from "./basic";

/**
 * En la cadena @param source, reemplaza la sección (@param index, @param len) con el texto @param replace
 * @param after Véase la descripción en @see insert
 */
export function replateAt(source: InputState, index: number, len: number, replace: string, after: boolean  ): InputState {
    let ret = source;
    ret = ops.remove(ret, index, len);
    ret = ops.insert(ret, replace, index, after);
    return ret;
}


/**
 * Reemplaza todas las apariciones de un regex o cadena
 * @param after Véase la descripción en @see insert
 */
export function replaceAll(source: InputState, pattern: RegExp | string, replace: string, after: boolean ): InputState {
    const all = findAll(source.text, pattern);
    const replaces = all.map(x => {
        if (typeof (pattern) == "string") {
            return {
                ...x,
                result: replace
            };
        }

        pattern.lastIndex = 0;
        const str = source.text.substr(x.index, x.len);
        const result = str.replace(pattern, replace);

        return {
            ... x,
            result: replace
        }
    });

    const indices = getReplaceAllIndices(replaces.map<ReplaceIndex>(x => ({
        index: x.index,
        inputLength: x.len,
        outputLength: x.result.length
    })));


    let ret: InputState = source;
    for(var i = 0; i < replaces.length; i++) {
        const ix = indices[i];
        const rep = replaces[i];

        ret = replateAt(ret, ix, rep.len, rep.result, after);
    }
    return ret;
}