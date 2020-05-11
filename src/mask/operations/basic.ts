import { InputState } from "./types";

/**Operaciones de cadena pero que llevan un control del carret */


/**Inserta una cadena en cierto indice
 * Si el indice encaja con el cursor el cursor se considera posterior a la sección de insersión,
 * este es el modo "normal" de inserción. (Ej, cada tecla que se presiona es un insert)
 * @param after Si es true y el indice encaja con el cursor, se considera el cursor *anterior* a la sección de inserción 
 * por lo que el cursor no se mueve, si no, se considera el cursor *después*, por lo que si se mueve. El modo más comun de operación
 * es con @param after == false ya que así se comporta un input (ej, al escribir un caracter el cursor se mueve hacia adelante)
*/
export function insert(source: InputState, value: string, index: number, after: boolean ): InputState {
    const cursorAfterIndex = after ? (source.cursor > index ) : (source.cursor >= index );
    
    return {
        text: source.text.substr(0, index) + value + source.text.substr(index, source.text.length - index),
        cursor:
            (cursorAfterIndex? source.cursor + value.length : source.cursor)
    }
}

/**Quita un pedazo de la cadena */
export function remove(source: InputState, index: number, len: number): InputState {
    return {
        text: source.text.substr(0, index) + source.text.substr(index + len, source.text.length - index - len),
        cursor:
            (source.cursor >= index + len ? source.cursor - len :
                source.cursor > index ? index :
                    source.cursor)
    }
}

export function concat(source: InputState, value: string) {
    return insert(source, value, source.text.length, false);
}

