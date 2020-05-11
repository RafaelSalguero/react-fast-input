import { assertUnreachable, delay } from "keautils";

/**Si el valor proviene de los props o del ref */
type ValueOrigin = "props" | "ref";

/**
 * Indica el modo en el que está operando el input
 * "inital" - el primer render es "controlled" y se pasa al modo test
 * "test" - Continua siendo controlled pero verifica si los props cambiaron como esperado despues de un onChange, si no, se convierte en controlled definitivamente, si si, se vuelve uncontrolled
 * "uncontrolled" - 
 * "controlled"
 */
export type Mode = "initial" | "test" | "uncontrolled" | "controlled" | "unmounted";

export interface State<T> {
    mode: Mode;
    lastChange?: {
        source: ValueOrigin,
        value: T
    }
}

/**Opciones para inicializar el fastInput */
export interface InitialFastInputOptions {
    /**Pone el fast-input en modo "controlled" desde el inicio */
    disableFastInput?: boolean;
}

export const initialState = (options: InitialFastInputOptions): State<any> => ({
    mode: options.disableFastInput ? "controlled" : "initial",
})

/**Indica que hay que actualizar ya sea llamar al onChange o establecer el valor del input */
export interface UpdateEffect {
    order: "user" | "now" | "event";
    source: ValueOrigin;
}

export interface ReduceResult<T> {
    /**El siguiente state */
    state?: State<T>;
    /**El efecto que va a ocasionar*/
    effect?: UpdateEffect;
}

export type ValueChangeType<T> = UserChangeAction | SetModeAction | ImmediateChange<T> | onPriorityEventAction;

interface UserChangeAction {
    type: "UserChange",
    /**Que fue lo que lanzó el cambio  */
    source: ValueOrigin;
}

/**Cuando el control se tiene que actualizar de inmediato porque tuvo un evento importante */
interface onPriorityEventAction {
    type: "priorityEvent",
}

/**Establece el mode */
interface SetModeAction {
    type: "SetMode",
    mode: Mode
}

/**Cambiar el valor ahora */
interface ImmediateChange<T> {
    type: "ImmediateChange",
    source: ValueOrigin,
    value: ReduceActionData<T>
}

export function reduce<T>(state: State<T>, change: ValueChangeType<T>): ReduceResult<T> {
    switch (change.type) {
        case "UserChange":
            //Cambio el value del prop
            return {
                effect: {
                    order: "user",
                    source: change.source
                }
            };
        case "priorityEvent":
            return {
                effect: {
                    order: "event",
                    source: "ref"
                }
            }
        case "ImmediateChange":
            if (!change.value.input) {
                return {};
            }

            return {
                state: {
                    ...state,
                    lastChange: {
                        source: change.source,
                        value: (change.source == "props" ? change.value.prop : change.value.input).value,
                    }
                },
                effect: {
                    order: "now",
                    source: change.source
                }
            }

        case "SetMode": {
            return {
                state: {
                    ...state,
                    mode: change.mode
                },
            };
        }
        default:
            assertUnreachable(change);

    }
}

export interface ValOnChage<T> {
    value: T;
    onChange: (x: T) => void;
}

export interface ReduceActionData<T> {
    prop: ValOnChage<T>;
    /**Si esta indefinido es que ya se hizo el unmount */
    input: ValOnChage<T> | undefined;
}

function commitNow<T>(data: ReduceActionData<T>, source: ValueOrigin) {
    const x = source == "props" ?
        {
            dest: data.input,
            source: data.prop
        } : {
            dest: data.prop,
            source: data.input
        };
    if (!(x.dest && x.source))
        return;

    x.dest.onChange(x.source.value);
}

/**Ejecuta los side-efects de @param action */
export async function execReduceAction<T>(
    state: State<T>,
    action: UpdateEffect,
    getData: () => ReduceActionData<T>,
    dispatch: (action: ValueChangeType<T>) => void,
    waitForStateChange: () => PromiseLike<void>
) {
    if (state.mode == "unmounted")
        return;
    const data = getData();
    if (!data.input)
        return;


    if (data.input.value == data.prop.value) {
        return;
    }

    const source = action.source;
    if (action.order == "now") {
        //Actualización inmediata:
        commitNow(data, source);
        return;
    }

    //Estos modos sincronizan de inmediato el input/onChange (lo mantienen controlado):
    const controlInputNow = state.mode == "initial" || state.mode == "test" || state.mode == "controlled" ||
        (state.mode == "uncontrolled" && action.source == "props");

    const controlPropsNow = source == "ref" && (controlInputNow || action.order == "event");
    //Actualiza los props pero con un delay
    const controlPropsDelay = source == "ref" && !controlPropsNow;

    //Se verifica si es controlled al cambiar el ref:
    const verifyControlledAfterChange =
        source == "ref" &&
        (state.mode == "initial" || state.mode == "test" || state.mode == "uncontrolled");

    const changeModeToTest = state.mode == "initial";

    const dispatchImmediateChange = (source: ValueOrigin) => {
        dispatch({
            type: "ImmediateChange",
            source: source,
            value: data
        });
    }

    if (changeModeToTest) {
        dispatch({
            type: "SetMode",
            mode: "test"
        });
    }

    //true si se hizo un onChange
    let onChangeDone: boolean | undefined;
    if (controlPropsNow) {
        dispatchImmediateChange("ref");
        onChangeDone = true;
    }

    await waitForStateChange();

    if (controlInputNow) {
        dispatchImmediateChange("props");
    }

    if (controlPropsDelay) {
        await delay(1000);
        const nextData = getData();
        if (!nextData.input)
            return;

        //Si el valor ya está estable despues del delay lo reportamos
        onChangeDone = nextData.input.value == data.input.value;
        if (onChangeDone) {
            dispatchImmediateChange("ref");
        }
    }

    //No tiene caso verificar onChangeDone
    if (verifyControlledAfterChange && onChangeDone) {
        //Nos esperamos a que el onChange reportado tome efecto:
        await waitForStateChange();

        /**Si para este punto los props no estan iguales al valor reportado en el onChange, significa
                    * que el usuario esta procesando los props de alguna manera, así que cambiamos a modo controlled
                   */
        const nextData = getData();
        const wasControlled = nextData.prop.value != data.input.value;
        dispatch({
            type: "SetMode",
            mode: wasControlled ? "controlled" : "uncontrolled"
        });
        if (wasControlled) {
            dispatch({
                type: "ImmediateChange",
                source: "props",
                value: nextData
            });
        }
    }

}