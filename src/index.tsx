import * as React from "react";
import { InitialFastInputOptions } from "./logic";
export { MaskItem } from "./mask/operations/regex-mask";
export  { InputState } from "./mask/operations/types";
import { FastInputMultiElement, OnMaskFunction, BaseFastInputProps, FastInputElementType } from "./view";
export { onMaskNumber } from "./mask/operations/number";
export { regexMask } from "./mask/operations/regex-mask";

type HTMLInputProps = Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">;
type HTMLTextAreaProps = Omit<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref">;

interface RefProp<T extends HTMLElement> {
    ref?: React.Ref<T>;
}


interface InputProps extends Omit<HTMLInputProps, "onChange">, InitialFastInputOptions, BaseFastInputProps, RefProp<HTMLInputElement> {
    value?: string;
}


interface TextAreaProps extends Omit<HTMLInputProps, "onChange">, InitialFastInputOptions, BaseFastInputProps, RefProp<HTMLTextAreaElement> {
    value?: string;
}


export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => <FastInputMultiElement ref={ref} {...props} elementType="input" />);
export const TextArea = React.forwardRef<HTMLTextAreaElement, InputProps>((props, ref) => <FastInputMultiElement ref={ref} {...props} elementType="textarea" />);