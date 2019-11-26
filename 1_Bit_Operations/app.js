// Sachin
// 32-Bit Integer Shifts and Masks visualization
// Specify two arguments and a bitwise operation
// On compute the resulting bits will be displayed

"use strict";

// Each bit is displayed as a circle
// 1 (blue), 0 (none)
class Bit extends c
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		const circle = e("circle", {
			cx : `calc(${this.props.x} * 3.125%)`,
			cy : this.props.y,
			r : `1.56%`,
			fill : this.props.on === '1' ? "blue" : "none",
			stroke : "black",
			strokeWidth : "1",
		});
		return circle;
	}
}

// Each integer is displayed as a row of 32 bits
// There are either 2 or 3 Integers displayed depending on the operator
class BitDisplay extends c
{
	constructor(props)
	{
		super(props);
	}

	zeroArray(size){
		return Array(size).fill().map((n)=>0);
	}

	render()
	{
		var bitarray = this.props.bits.map((c, i)=>e(Bit, {x : i+.5,
			y : 60,
			on : c
		}));

		if (this.props.vbits != null)
		{
			const vbits = this.props.vbits.map((c, i)=>e(Bit, {x : i+.5,
				y : 20,
				on : c
			}));

			bitarray = bitarray.concat(vbits);
		}

		const result = this.props.result.map((c, i)=>e(Bit, {x : i+.5,
			y : 100,
			on : c
		}));

		const line = e("line", {
			x1 : 0,
			y1 : 80,
			x2 : "100%",
			y2 : 80,
			style : {
				stroke : "rgb(0,0,0)",
				strokeWidth : 2,
			}
		});

		const svg = e("svg",
			{
				style : {
					width : "100%",
					height : "80%",
					marginTop : "1%",
				}
			},
			...bitarray, line, ...result);
		return svg;
	}
}

// 2 number inputs for each side of the operator
class NumberInput extends c
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		const input = e('input', {
			type : "number",
			onChange : (e)=>this.props.onChange(e),
			placeholder : `Argument ${this.props.arg}`,
			style : {
				border : "none",
				borderBottom : "2px solid black"
			}
		});
		return input;
	}
}

// Valid bitwise operators are '|', '&', '>>', '<<', '^'
class OperatorInput extends c
{
	constructor(props)
	{
		super(props);
	}

	render()
	{
		const input = e('input', {
			type : "text",
			onChange : (e)=>this.props.onChange(e),
			placeholder : "Operator",
			style : {
				border : "none",
				borderBottom : "2px solid black"
			}
		});
		return input;
	}
}

class Main extends c
{
	constructor(props){
		super(props);

		this.state = {
			length : 32,
			number : 0,
			nbits : [0],
			value : 0,
			vbits : null,
			rbits : [0],
			shift : "",
			error : false,
		}
	}

	getBinary(val)
	{
		return val.toString(2).split('');
	}

	numChange(e)
	{
		const temp = parseInt(e.target.value);
		this.setState({
			number : temp,
			nbits : this.getBinary(temp),
		});
	}

	shiftChange(e)
	{
		const val = e.target.value;
		var vbits = null;

		if (val === "&" || val === "|" || val === '^')
		{
			vbits = this.getBinary(this.state.value);
		}

		this.setState({
			shift : val,
			vbits : vbits,
		});
	}

	valChange(e)
	{
		const temp = parseInt(e.target.value);

		var vbits = null;

		if (this.state.shift === "&" || this.state.shift === "|" || this.state.shift === '^')
		{
			vbits = this.getBinary(temp);
		}

		this.setState({
			value : temp,
			vbits : vbits,
		});
	}

	zeroArray(size)
	{
		return Array(size).fill().map((n)=>0);
	}

	getBitArray(arr)
	{
		if (arr == null)
		{
			return null;
		}
		var bitarray = arr;
		if (this.state.length < arr.length)
		{
			bitarray.splice(0, (arr.length - this.state.length));
		}
		else
		{
			bitarray = this.zeroArray(this.state.length - arr.length).concat(bitarray);
		}

		return bitarray;
	}

	compute()
	{
		var temp = this.state.number;
		var vbits = null;
		var error = false;

		if (this.state.shift === ">>")
		{
			temp = this.state.number >> this.state.value;
		}
		else if (this.state.shift === "<<")
		{
			temp = this.state.number << this.state.value;
		}
		else if (this.state.shift === "&")
		{
			temp = this.state.number & this.state.value;
			vbits = this.getBinary(this.state.value);
		}
		else if (this.state.shift === "|")
		{
			temp = this.state.number | this.state.value;
			vbits = this.getBinary(this.state.value);
		}
		else if (this.state.shift === "^")
		{
			temp = this.state.number ^ this.state.value;
			vbits = this.getBinary(this.state.value);
		}
		else
		{
			error = true;
		}

		this.setState({
				rbits : this.getBinary(temp),
				vbits : vbits,
				error : error,
			});
	}

	render()
	{
		const numberInput = e(NumberInput, {
			onChange : (e)=>this.numChange(e),
			arg : 1
		});

		const operatorInput = e(OperatorInput, {
			onChange : (e)=>this.shiftChange(e),
		})

		const valueInput = e(NumberInput, {
			onChange : (e)=>this.valChange(e),
			arg : 2
		});

		const button = e("button", {
			onClick : ()=>this.compute(),
			style : {
				marginLeft : "1%",
				borderRadius: "8px",
			}
		}, "Compute");

		const errormessage = e("span", {
			style : {
				color : "red"
			}
		}, this.state.error ? "\tInvailed operator" : "");

		const bitDisplay = e(BitDisplay, {
			bits : this.getBitArray(this.state.nbits),
			vbits : this.getBitArray(this.state.vbits),
			result : this.getBitArray(this.state.rbits),
			length : this.state.length
		});

		const header = e("h1", {
			style : {
				textAlign : "center"
			}
		}, "32-Bit Integer Shifts and Masks");


		return e("div", null, header, numberInput, operatorInput, valueInput, button, errormessage, bitDisplay);
	}
}

function run()
{
	const element = e(Main, null);
	ReactDOM.render(element, document.getElementById('root'));
}