// Sachin
// Mastermind game

const e = React.createElement, c = React.Component;
const clear = '#dae7ff';

const colors = {
	"A": 'red',
	"B": 'orange',
	"C": 'yellow',
	"D": 'green',
	"E": 'blue',
	"F": 'purple'
};

const borderColor = '#444141';

const correct = 'correct', almost = 'almost', wrong = 'wrong';
const feedbackColors = {
	correct: 'red',
	almost: 'white',
	wrong: clear
}

const width = 4, height = 12;
const cellSize = 20, cellBorder = 5;
const bigCell = cellSize + 2*cellBorder;

const Cell = (props) => e('rect', {
	x: props.x,
	y: props.y,
	width: cellSize,
	height: cellSize,
	onClick: ()=>props.onClick(),
	style: { fill: props.color }
});

const BigCell = (props) => e('rect', {
	x: props.x,
	y: props.y,
	width: bigCell,
	height: bigCell,
	style: { fill: borderColor }
});

const SmallCell = (props) => e('rect', {
	x: props.loc[0] + props.x * cellSize/2,
	y: props.loc[1] + props.y * cellSize/2,
	width: cellSize/2,
	height: cellSize/2,
	style: { fill: props.color }
});

const Feedback = (props) => {
	const { x, y, feedback } = props;
	const locs = [[0, 0], [1, 0], [0, 1], [1, 1]];
	const rects = feedback.map((f, i) => e(SmallCell, {
		loc: [x, y],
		x: locs[i][0],
		y: locs[i][1],
		color: feedbackColors[f]
	}));

	return e(React.Fragment, null, ...rects);
}

const random = _ => Object.keys(colors)[Math.floor(Math.random()*6)];

class Main extends c
{
	constructor(props)
	{
		super(props);
		this.state = {
			currentColor: 'A',
			grid: Array(height).fill().map(x=>Array(width).fill('_')),
			level: 0,
			solution: Array(4).fill().map(x=>random()),
			feedback: Array(height).fill().map(x=>Array(4).fill(wrong)),
			won: false
		};
		window.addEventListener('keydown',(e)=>this.handleKeyPress(e));
	}
	
	handleKeyPress(e)
	{
		if (e.code.substring(0,5) === 'Digit')
		{
			const num = parseInt(e.key)-1;
			if (num < 6)
			{
				this.setState({ currentColor : Object.keys(colors)[num] });
			}
		}
		else if (e.code === 'Enter')
		{
			const { grid, currentColor, level } = this.state;
			const i = grid[level].reduce((acc, x, i) => (x === '_' && acc === null) ? i : acc, null);
			grid[level][i] = currentColor;
			this.setState({ grid: grid });
		}
		else if (e.key === 'c')
		{
			const { grid, level } = this.state;
			grid[level] = grid[level].map(x=>'_');
			this.setState({ grid: grid });
		}
		else if (e.key === ' ')
		{
			this.turn();
		}
		else if (e.key === 'r')
		{
			this.setState({
				grid: Array(height).fill().map(x=>Array(width).fill('_')),
				level: 0,
				solution: Array(4).fill().map(x=>random()),
				feedback: Array(height).fill().map(x=>Array(4).fill(wrong)),
				won: false
			})
		}
	}

	changeColor(i, j)
	{
		const { grid, currentColor, level } = this.state;
		if (i === level)
		{
			grid[i][j] = currentColor;
			this.setState({ grid: grid });
		}
	}

	turn()
	{
		const { grid, level, solution, feedback, won } = this.state;
		if (!grid[level].includes('_') && !won && level < height)
		{
			const correctNum = solution.reduce((acc, x, i) => x === grid[level][i] ? acc + 1 : acc, 0);
			const reducedSolution = solution.map((x, i) => x === grid[level][i] ? '?' : x).join('');
			const reducedGuess = grid[level].map((x, i) => x === solution[i] ? '?' : x).join('');

			const solColorNum = Object.keys(colors).map(k => (reducedSolution.match(new RegExp(k, 'g')) || []).length);
			const rowColorNum = Object.keys(colors).map(k => (reducedGuess.match(new RegExp(k, 'g')) || []).length);

			const colorNum = solColorNum.reduce((acc, x, i) => x <= rowColorNum[i] ? acc + x : acc, 0);

			feedback[level] = Array(correctNum).fill(correct).concat(Array(colorNum).fill(almost).concat(Array( 4 - correctNum - colorNum).fill(wrong)));

			const won = feedback[level].reduce((acc, x) => x !== correct ? false : acc, true)

			this.setState({ level: level + 1, feedback: feedback, won: won });
		}
	}

	render()
	{
		const { currentColor, grid, feedback, won, level } = this.state;
		const colorSelectors = Object.keys(colors).map((k,i)=>e(Cell, {
			x: cellSize + cellBorder,
			y: i*(bigCell) + cellBorder,
			color: colors[k],
			onClick: ()=>this.setState({ currentColor: k })
		}));

		const selected = e(BigCell, { x: cellSize, y: (currentColor.charCodeAt(0) - 'A'.charCodeAt(0)) * bigCell });

		const board = grid.map((row, i)=>row.map((elm, j) => e(Cell, {
			x: 3 * (cellSize + cellBorder) + cellBorder + j*(cellSize + cellBorder),
			y: cellBorder + i*(cellSize + cellBorder),
			color: colors[elm] || clear,
			onClick: ()=>this.changeColor(i, j)
		}))).flat();

		const background = e('rect', {
			x: 3 * (cellSize + cellBorder),
			y: 0,
			width: (width * (cellSize + cellBorder)) + cellBorder,
			height: (height * (cellSize + cellBorder)) + cellBorder,
			fill: borderColor
		});

		const button = e("button", { onClick: ()=>this.turn() }, "Take a Turn");

		const feedbackRects = feedback.map((f, i) => e(Feedback, {
			x: 3 * (cellSize + cellBorder) + (width * (cellSize + cellBorder)) + 2 * cellBorder,
			y: cellBorder + i * (cellSize + cellBorder),
			feedback: f
		}));

		const svg = e('svg', {
			width: 5 * (cellSize + cellBorder) + (width * (cellSize + cellBorder)),
			height:  height * (cellSize + cellBorder) + cellBorder,
		}, selected, ...colorSelectors, background, ...board, ...feedbackRects);

		return e(React.Fragment, null, svg, won ? e('span', null, "WINNER") : level < height ? button : e('span', null, 'LOST'));
	}
}

run = _ => ReactDOM.render(e(Main), document.getElementById('root'));