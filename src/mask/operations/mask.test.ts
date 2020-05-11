import * as ops from "./mask";
import * as basic from "./basic";
import { InputState } from "./types";

//TODO: Cuando se borre un caracter y mas adelante no haya ni separadores ni caracteres diferentes que se borre en lugar de poner un espacio

test("insert space", () => {
    const mask ="###";
    const source: InputState = {
        text: "12 3",
        cursor: 3
    };

    const expected: InputState = {
        text: "12 ", 
        cursor: 3
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});

test("empty", () => {
    const mask ="-###-AA";
    const source: InputState = {
        text: "",
        cursor: 0
    };

    const expected: InputState = {
        text: "", 
        cursor: 0
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});

test("mask delete space", () => {
    const mask ="-###-AA";
    const source: InputState = {
        text: "-1 -BC",
        cursor: 2
    };

    const expected: InputState = {
        text: "-1  -BC", //Se relleno con un espacio 
        cursor: 2
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});


test("mask delete", () => {
    const mask ="-##-AA";
    const source: InputState = {
        text: "-1-A", 
        cursor: 2
    };

    const expected: InputState = {
        text: "-1 -A", //Se relleno con un espacio 
        cursor: 2
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});

test("mask delete 3", () => {
    const mask ="-##-AA";
    const source: InputState = {
        text: "-1-AB", 
        cursor: 2
    };

    const expected: InputState = {
        text: "-1 -AB", //Se relleno con un espacio 
        cursor: 2
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});

test("delete last -1", () => {
    const mask = "-##-AA-";
    const orig = "-12-AB-";
    const source: InputState = {
        text: "-12-A-",
        cursor: 5
    }  

    const expected: InputState = {
        text: "-12-A",
        cursor: 5
    };

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);

}) ;

test("insert wrong middle 3", () => {
    const mask = "-##-AA-";
    const orig = "-5 -  -";
    const source: InputState = {
        text: "-5A -  -",
        cursor: 3
    }  

    const expected: InputState = {
        text: "-5 -  -",
        cursor: 2
    };

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);

}) ;

test("insert after 0", () => {
    const source: InputState = {
        text: "",
        cursor: 0
    }  

    const expected: InputState = {
        text: "-",
        cursor: 0
    };

    const actual = basic.insert(source, "-", 0, true);
    expect(actual).toEqual(expected);

}) ;

test("mask initial", () => {
    const mask = "-##-AA-";
    const source: InputState = {
        text: "A",
        cursor: 1
    }

    const expected: InputState = {
        text: "-",
        cursor: 0
    };

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});

test("insert middle wrong", () => {
    const mask = "-##-AA-";
    const source: InputState = {
        text: "-123",
        cursor: 4
    }

    const expected: InputState = {
        text: "-12-",
        cursor: 3
    };

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});

test("insert middle wrong 2", () => {
    const orig = "-12-"
    const mask = "-##-AA-";
    const source: InputState = {
        text: "-123-",
        cursor: 4
    }

    const expected: InputState = {
        text: "-12-",
        cursor: 3
    };

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});




test("paste wrong format", ()=> {
    const mask ="-##-AA-";
    const source: InputState = {
        text: "AB12",  
        cursor: 4
    };

    const expected: InputState = {
        text: "-  - ",  
        cursor: 5
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
})

test("mask forbiden unformatted", () => {
    const mask ="-###-AA";
    const source: InputState = {
        text: "12B", //Se borro el segundo numero de la mascara
        cursor: 3
    };

    const expected: InputState = {
        text: "-12", //Se relleno con un espacio 
        cursor: 3
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});




 

test("insert middle", () => {
    const mask = "-##-AA-";
    const source: InputState = {
        text: "-12A",
        cursor: 4
    }

    const expected: InputState = {
        text: "-12-A",
        cursor: 5
    };

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});



test("delete last fixed", ()=> {
    const mask ="-##-AA-";
    const orig = "-12-AB-";
    const source: InputState = {
        text: "-12-AB", 
        cursor: 6
    };

    const expected: InputState = {
        text: "-12-AB-",  
        cursor: 6
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
})



test("insert space", ()=> {
    const mask ="-##-AA-";
    const orig = "-12-  -";
    const source: InputState = {
        text: "-12 -  -",  
        cursor: 4
    };

    const expected: InputState = {
        text: "-12-  -",  
        cursor: 4
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
})


test("mask forbiden formatted  2", () => {
    const mask ="-###-AA";
    const source: InputState = {
        text: "-12B", 
        cursor: 4
    };

    const expected: InputState = {
        text: "-12", 
        cursor: 3
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});




test("delete fixed", ()=> {
    const mask ="-##-AA-";
    const orig = "-12-  -";
    const source: InputState = {
        text: "-12  -", 
        cursor: 3
    };

    const expected: InputState = {
        text: "-12-  -",  
        cursor: 3
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
})

test("mask delete 2", () => {
    const mask ="-##-AA-";
    const source: InputState = {
        text: "-12-A-", 
        cursor: 5
    };

    const expected: InputState = {
        text: "-12-A", 
        cursor: 5
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});


test("mask forbiden formatted", () => {
    const mask ="-###-AA";
    const source: InputState = {
        text: "-123-ABC", //Se borro el segundo numero de la mascara
        cursor: 8
    };

    const expected: InputState = {
        text: "-123-AB", //Se relleno con un espacio 
        cursor: 7
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});





test("mask full number", () => {
    const mask ="-###-AA";
    const source: InputState = {
        text: "123AB", //Se borro el segundo numero de la mascara
        cursor: 5
    };

    const expected: InputState = {
        text: "-123-AB", //Se relleno con un espacio 
        cursor: 7
    }

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});






test("mask delete space", () => {
})





test("mask", () => {
    const mask = "-##-AA-";
    const source: InputState = {
        text: "12B",
        cursor: 3 //después de la "o"
    }

    const expected: InputState = {
        text: "-12-B",
        cursor: 5
    };

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});

test("mask 2", () => {
    const mask = "-##-AA-";
    const source: InputState = {
        text: "12",
        cursor: 2
    }

    const expected: InputState = {
        text: "-12-",
        cursor: 3
    };

    const actual = ops.mask(source, mask);
    expect(actual).toEqual(expected);
});


