import * as React from "react";
import { State, initialState, reduce, execReduceAction, ReduceActionData, ValueChangeType, InitialFastInputOptions } from "./logic";
import { omit, deepEquals } from "simple-pure-utils";
import { InputState } from "./mask/operations/types";

/**Tipo del elemento dibujado */
export type FastInputElementType = HTMLInputElement | HTMLTextAreaElement;
/**Tipo del inner ref */
type RefType = FastInputElementType | null;

interface InputProps extends Pick<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "onChange" | "onBlur" | "onKeyPress" | "ref"> {
}

/**Se llama con cada cambio del texto y devuelve un nuevo texto y posición del cursor.
 * Permite manipular el contenido del input conservando el cursor, útil para aplicar máscaras. Puede usar las ocpiones de 
 * @see mask.operations para manipular al InputState.
 * La máscara se aplica antes de lanzar los eventos de @see onChange y se puede aplicar una máscara y mantener
 * el debounce del FastInput
 */
export interface OnMaskFunction {
    (state: InputState, backspace: boolean): InputState;
}

export interface BaseFastInputProps {
    value?: string;
    onChange?: (x: string) => void;
    onEnter?: () => void;

    /**@see OnMaskFunction */
    onMask?: OnMaskFunction;
}

export interface InputRefProps {
    /**Ref del elemento dibujado, ya sea el input o el textArea */
    innerRef?: React.Ref<FastInputElementType>;
}

interface Props
    extends Omit<InputProps, "onChange" | "ref">,
    InitialFastInputOptions,
    BaseFastInputProps {
    /**El elemento con el que se dibujará el fastInput, por default es un input*/
    elementType: "input" | "textarea";

}

/**Establece el valor de un ref */
function callRef<T>(ref: React.Ref<T> | undefined, instance: T | null): void {
    if (ref == null) {
        return;
    }
    if (typeof (ref) == "function") {
        return ref(instance);
    }
    //Note que este es un caso correcto de modificar directamente el current de un ref. Vea https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065#issuecomment-547325736
    (ref as any).current = instance
}

/**Un input con debounce */
class FastInputMultiElementInnerRef extends React.PureComponent<Props & InputRefProps, never> {
    constructor(props: Props) {
        super(props);
        this.logicState = initialState(props);
    }

    /**Estado actual, es modificado por el reducer */
    logicState: State<string>;
    input: RefType = null;

    /**True para colorear el input cuando cambie de color */
    testMode: boolean = false;

    handleRef = (ref: RefType) => {
        if (this.input != ref) {
            callRef(this.props.innerRef, ref);
            this.input = ref;
            if (ref != null) {
                //Actualizar el prop inicial:
                this.dispatch({
                    type: "UserChange",
                    source: "props",
                });
            } else {
                this.dispatch({
                    type: "SetMode",
                    mode: "unmounted"
                });
            }
        }
    }


    /**Manda llamar a un setState y devuelve la promesa del mismo, sirve para esperarse a que react procese el batch de cambios, en realidad el setState no hace ningun cambio en el state */
    waitForStateUpdate = () => new Promise<void>((resolve) => this.setState({}, resolve));

    /**Obtiene la información del componente que necesita el executeReduceAction */
    getReduceActionData = (): ReduceActionData<string> => {
        const input = this.input;
        return {
            input: input ? {
                value: input.value,
                onChange: x => input.value = x
            } : undefined,
            prop: {
                value: this.props.value || "",
                onChange: x => this.props.onChange?.(x)
            }
        };
    }

    colorearInput = () => {
        if (this.input) {
            this.input.style.background =
                this.logicState.mode == "controlled" ? "cyan" :
                    this.logicState.mode == "initial" ? "lightgreen" :
                        this.logicState.mode == "test" ? "yellow" :
                            "white";
        }
    }

    dispatch = (action: ValueChangeType<string>) => {
        const next = reduce<string>(this.logicState, action);
        if (next.state) {
            this.logicState = next.state;
        }

        if (this.testMode) {
            this.colorearInput();
        }

        //Cechar si no hay side-effects
        if (next.effect == null)
            return;

        //Si el value y onChange es undefined lo consideramos como no controlado
        const uncontrolled = this.props.value == undefined && this.props.onChange == undefined;
        if (!uncontrolled) {
            execReduceAction(this.logicState, next.effect, this.getReduceActionData, this.dispatch, this.waitForStateUpdate);
        }
    }

    componentDidUpdate(prevProps: Props) {
        const propValueChanged = this.input!.value != this.props.value && (this.props.value != prevProps.value);
        if (propValueChanged) {
            this.dispatch({
                type: "UserChange",
                source: "props"
            });
        }
    }

    applyMask = (backspace: boolean) => {
        const input = this.input!;
        if (this.props.onMask) {
            //Si no tiene selección se considera al final del texto (como si se acabara de pegar el valor)
            const origHasCursor = input.selectionEnd != null;
            const initialState: InputState = {
                text: input.value,
                cursor: input.selectionEnd ?? input.value.length
            };
            const nextState = this.props.onMask(initialState, backspace);

            const didChanged = !deepEquals(initialState, nextState);

            if (didChanged) {
                //Sólo se cambia si si cambio
                input.value = nextState.text;
                if (origHasCursor) {
                    input.selectionStart = nextState.cursor;
                    input.selectionEnd = nextState.cursor;
                }
            }
        }
    }

    onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {

        const inputType : string = (ev.nativeEvent as any).inputType ;
            const backspace = inputType == "deleteContentBackward";
        this.applyMask(backspace);
        this.dispatch({
            type: "UserChange",
            source: "ref"
        });
    }

    onBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
        this.dispatch({
            type: "priorityEvent"
        });

        this.props.onBlur?.(ev);
    }


    private handleKeyPress = async (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.key == "Enter") {
            this.dispatch({
                type: "priorityEvent"
            });
            await this.waitForStateUpdate();
            this.props.onEnter?.();
        }

        this.props.onKeyPress?.(ev);
    };

    render() {
        const inputProps = omit(this.props, ["value", "onChange", "onEnter", "disableFastInput", "elementType", "onMask", "innerRef"]);

        const elementProps = {
            ...inputProps,
            onChange: this.onInputChange,
            onBlur: this.onBlur,
            onKeyPress: this.handleKeyPress,
            ref: this.handleRef
        };

        return React.createElement(this.props.elementType, elementProps);
    }
}

/**Un input con debounce */
export const FastInputMultiElement = React.forwardRef(function FastInputMultiElementForwardRef(props: Props, ref: React.Ref<FastInputElementType>) {
    return <FastInputMultiElementInnerRef innerRef={ref} {...props} />
});