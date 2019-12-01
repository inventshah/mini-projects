// Sachin
// 24 Game Solver

const e = React.createElement, c = React.Component;

const operators = ["+++", "++-", "++*", "++/", "+-+", "+--", "+-*", "+-/", "+*+", "+*-", "+**", "+*/", "+/+", "+/-", "+/*", "+//", "-++", "-+-", "-+*", "-+/", "--+", "---", "--*", "--/", "-*+", "-*-", "-**", "-*/", "-/+", "-/-", "-/*", "-//", "*++", "*+-", "*+*", "*+/", "*-+", "*--", "*-*", "*-/", "**+", "**-", "***", "**/", "*/+", "*/-", "*/*", "*//", "/++", "/+-", "/+*", "/+/", "/-+", "/--", "/-*", "/-/", "/*+", "/*-", "/**", "/*/", "//+", "//-", "//*", "///"];
const indices = ["0123", "0132", "0213", "0231", "0312", "0321", "1023", "1032", "1203", "1230", "1302", "1320", "2013", "2031", "2103", "2130", "2301", "2310", "3012", "3021", "3102", "3120", "3201", "3210"];

const labels = "First Second Third Fourth".split(' ').map(s => s.concat(" Number"));

const computeTrees = (nums, opers) => {
	return [`(${nums[0]} ${opers[0]} ${nums[1]}) ${opers[1]} (${nums[2]} ${opers[2]} ${nums[3]})`,
	`((${nums[0]} ${opers[0]} ${nums[1]}) ${opers[1]} ${nums[2]}) ${opers[2]} ${nums[3]}`,
	`${nums[0]} ${opers[0]} (${nums[1]} ${opers[1]} (${nums[2]} ${opers[2]} ${nums[3]}))`,
	`(${nums[0]} ${opers[0]} (${nums[1]} ${opers[1]} ${nums[2]})) ${opers[2]} ${nums[3]}`,
	`${nums[0]} ${opers[0]} (${nums[1]} ${opers[1]} (${nums[2]} ${opers[2]} ${nums[3]}))`].map(tree => [tree, eval(tree)]);
}

const NumberIn = (props) => e('input', {
	type : "number",
	onChange : (e)=>props.onChange(parseFloat(e.target.value)),
	placeholder : props.arg
});

class Main extends c
{
	constructor(props)
	{
		super(props);
		this.state = { nums: [0,0,0,0] }
	}

	compute()
	{
		const { nums } = this.state;
		const answer = indices.map(j => operators.map(o => computeTrees(nums.map((x, i) => nums[j[i]]), o)))
			.flat().flat()
			.filter(v => v[1] === 24)
			.map(v => v[0])
			.reduce((unq, x) => unq.includes(x) ? unq : unq.concat(x), [])
			.map(a => e("p", null, a));
		this.setState({ result : answer.length ?  answer : [e('span', null, 'No Answer Found')] });
	}

	render()
	{
		const { result, nums } = this.state;

		const button = e("button", { onClick : ()=>this.compute() }, "Solve");
		const argsIn = labels.map((x, j) => e(NumberIn, { onChange: num=>this.setState({ nums: nums.map((n, i) => i === j ? num : n) }), arg: x }));

		return e(React.Fragment, null, ...argsIn, button, e('br'), ...(result || []));
	}
}

run = _ => ReactDOM.render(e(Main), document.getElementById('root'));