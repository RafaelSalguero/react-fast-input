import * as ops from "./basic";
import { InputState } from "./types";

test("insert", () => {
    const source: InputState = {
        text: "hola",
        cursor: 2 //después de la "o"
    }
    
    {
        //Insertar al principo
        const actual = ops.insert(source, "12", 0, false);
        expect(actual).toEqual({
            text: "12hola",
            cursor: 4
        });
    }

    {
        //Insertar al final
        const actual = ops.insert(source, "12", 4, false);
        expect(actual).toEqual({
            text: "hola12",
            cursor: 2
        });
    }

    {
        //Insertar en el cursor
        const actual = ops.insert(source, "12", 2, false);
        expect(actual).toEqual({
            text: "ho12la",
            cursor: 4
        });
    }

    {
        //Insertar antes del cursor
        const actual = ops.insert(source, "12", 1, false);
        expect(actual).toEqual({
            text: "h12ola",
            cursor: 4
        });
    }

    {
        //Insertar después del cursor
        const actual = ops.insert(source, "12", 3, false);
        expect(actual).toEqual({
            text: "hol12a",
            cursor: 2
        });
    }
});

test("remove", () => {
    const source: InputState = {
        text: "hola",
        cursor: 2 //después de la "o"
    }

    
    {
        //Borrar el principio:
        const actual = ops.remove(source, 0, 2);
        expect(actual).toEqual({
            text: "la",
            cursor: 0
        });
    }

    {
        //Borrar el final:
        const actual = ops.remove(source, 3, 1);
        expect(actual).toEqual({
            text: "hol",
            cursor: 2
        });
    }

    {
        //Borrar el final 2:
        const actual = ops.remove(source, 2, 2);
        expect(actual).toEqual({
            text: "ho",
            cursor: 2
        });
    }

    {
        //Borrar conteniendo el cursor:
        const actual = ops.remove(source, 1, 2);
        expect(actual).toEqual({
            text: "ha",
            cursor: 1
        });
    }
});

