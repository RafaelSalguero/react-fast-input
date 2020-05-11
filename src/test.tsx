import * as React from "react";
import { FastInputMultiElement } from "./view";
import { mask } from "./mask/operations/mask";

interface State {
    text1: string;
    text2: string;
    text3: string;
    text4: string;
    text5: string;
    text6: string;
}

export class FastInputTest extends React.PureComponent<{}, State>  {
    constructor(props: any) {
        super(props);
        this.state = {
            text1: "hola",
            text2: "",
            text3: "",
            text4: "",
            text5: "rafa",
            text6: "",
        };
    }

    render() {
        return (
            <div>
                <li>
                    <ul>
                        Texto fijo: {this.state.text1}
                        <br />
                        <FastInputMultiElement elementType="input" value={this.state.text1} onChange={x => { }} />
                    </ul>

                    <ul>
                        Texto libre: {this.state.text2}
                        <br />
                        <FastInputMultiElement elementType="input" value={this.state.text2} onChange={x => this.setState({ text2: x })} />
                    </ul>


                    <ul>
                        Texto libre 2: {this.state.text5}
                        <br />
                        <FastInputMultiElement elementType="input" value={this.state.text5} onChange={x => this.setState({ text5: x })} />
                    </ul>


                    <ul>
                        Texto libre 2: {this.state.text5}
                        <br />
                        <FastInputMultiElement elementType="input" value={this.state.text5} onChange={x => this.setState({ text5: x })} onEnter={() => console.log(this.state.text5)} />
                    </ul>

                    <ul>
                        Solo lectura: {this.state.text3}
                        <br />
                        <FastInputMultiElement elementType="input" value={this.state.text3} onChange={x => { }} />
                    </ul>


                    <ul>
                        Con máscara: {this.state.text6}
                        <br />
                        <FastInputMultiElement elementType="input" 
                            value={this.state.text6} 
                            onChange={x => this.setState({text6 : x})} 
                            onMask={x => mask(x, "-##-AA-")}
                            />
                    </ul>

                    <ul>
                        Con máscara (letras y espacio): {this.state.text6}
                        <br />
                        <FastInputMultiElement elementType="input" 
                            onMask={x => mask(x, "N*")}
                            />
                    </ul>

                    <ul>
                        Con máscara (numeros): {this.state.text6}
                        <br />
                        <FastInputMultiElement elementType="input" 
                            onMask={x => mask(x, "#*")}
                            />
                    </ul>

                    <ul>
                        Texto controlado: (quita las X) {this.state.text3}
                        <br />
                        <FastInputMultiElement elementType="input" value={this.state.text3} onChange={x => this.setState({ text3: x.replace(/X/g, "") })} />
                    </ul>


                    <ul>
                        Texto  nativo controlado libre {this.state.text4}
                        <br />
                        <input value={this.state.text4} onChange={x => this.setState({ text4: x.currentTarget.value })} />
                    </ul>

                    <ul>
                        Texto nativo no controlado
                        <br />
                        <input onChange={ev => {
                            ev.stopPropagation();
                            ev.preventDefault();
                        }} />
                    </ul>
                </li>
            </div>
        )
    }
}