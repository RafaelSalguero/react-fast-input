import * as React from "react";
import { InitialFastInputOptions } from "./logic";
import { FastInputMultiElement, OnMaskFunction, BaseFastInputProps,  FastInputElementType } from "./view";

type HTMLInputProps = Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">;
type HTMLTextAreaProps = Omit<React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, "ref">;

interface RefProp {
    ref?: React.Ref<FastInputElementType>;
}

interface InputProps extends Omit<HTMLInputProps, "onChange">, InitialFastInputOptions, BaseFastInputProps, RefProp {
    value?: string;
}


interface TextAreaProps extends Omit<HTMLInputProps, "onChange">, InitialFastInputOptions, BaseFastInputProps, RefProp {
    value?: string;
}


export const FastInput = (props: InputProps) => <FastInputMultiElement {...props} elementType="input" />;
export const FastTextArea = (props: TextAreaProps) => <FastInputMultiElement {...props} elementType="textarea" />;