// Sachin
// 32-Bit Integer Shifts and Masks visualization
// Specify two arguments and a bitwise operation
// On compute the resulting bits will be displayed

const e = React.createElement, c = React.Component;

// Valid bitwise operators are '|', '&', '>>', '<<', '^'
const operators = ['&', '|', '^'], shifts = ['>>', '<<'], allowed_operators = [...operators, ...shifts];

// Each bit is displayed as a circle
// 1 (blue), 0 (none)
const Bit = (props) => e("circle", {
		cx : `calc(${props.x + .5} * 3.125%)`,
		cy : props.y,
		r : `1.56%`,
		fill : props.on === '1' ? "blue" : "none",
		stroke : "black",
		strokeWidth : "1",
	});

// Each integer is displayed as a row of 32 bits
// There are either 2 or 3 Integers displayed depending on the operator
const BitDisplay = (props) => {
	const mapBits = (bits, y) => bits.map((on, i)=>e(Bit, { x: i, y: y, on: on }));
	const line = e("line", { x1: 0, y1: 80, x2: "100%", y2: 80 });
	return e("svg", null, ...mapBits(props.arg1, 60), ...mapBits(props.arg2 || [], 20), line, ...mapBits(props.result, 100));
}

// 2 number inputs for each side of the operator
const NumberIn = (props) => e('input', {
	type : "number",
	onChange : (e)=>props.onChange(parseInt(e.target.value)),
	placeholder : `Argument ${props.arg}`,
});

const OperatorIn = props => e('input', {
	type : "text",
	onChange : (e)=>props.onChange(e.target.value),
	placeholder : "Operator",
});

const zeroArray = size => Array(size).fill(0);

const getBitArray = num => {
	const arr = num.toString(2).split('');
	return zeroArray(32 - arr.length).concat(arr);
}

class Main extends c
{
	constructor(props)
	{
		super(props);
		this.state = {
			arg1 : 0,
			arg2 : 0,
			result : [0],
			operation : "",
			error : false,
		}
	}

	compute()
	{
		const { arg1, arg2, operation, error } = this.state;
		if (!error) this.setState({ result : eval(`${arg1} ${operation} ${arg2}`) });
	}

	render()
	{
		const { arg1, arg2, result, operation, error } = this.state;
		const arg1In = e(NumberIn, { onChange: (num)=>this.setState({ arg1: num }), arg: 1 });
		const arg2In = e(NumberIn, { onChange: (num)=>this.setState({ arg2: num }), arg: 2 });
		const operatorIn = e(OperatorIn, { onChange: (e)=>this.setState({ operation: e, error: !allowed_operators.includes(e) }) });

		const button = e("button", { onClick : ()=>this.compute() }, "Compute");
		const errormsg = error ? e("span", null, "\tInvailed operator") : null;

		const bits = e(BitDisplay, {
			arg1: getBitArray(arg1),
			arg2: operators.includes(operation) ? getBitArray(arg2) : null,
			result: getBitArray(result)
		});

		return e(React.Fragment, null, arg1In, operatorIn, arg2In, button, errormsg, bits);
	}
}

function run()
{
	const element = e(Main);
	ReactDOM.render(element, document.getElementById('root'))
}