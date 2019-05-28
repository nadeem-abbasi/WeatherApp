import React from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend
} from 'recharts';

const WeatherChart = (props) => {
	const { data, unit, classes } = props;
	return (
		<BarChart
			width={1000}
			height={300}
			data={data}
			className={classes.barChart}
		>
			<CartesianGrid strokearray="3 3" stroke="#d5d5d5" />
			<XAxis dataKey="date" label={{ value: `Day`, position: 'insideRight' }} />
			<YAxis
				label={{
					value: `Temperature ${unit === 'imperial' ? '°F' : '°C'}`,
					angle: -90,
					position: 'insideLeft'
				}}
				dataKey="temp"
			/>
			<Tooltip />
			<Legend value="Temperature" />
			<Bar
				dataKey="temp"
				name="Temperature"
				fill="#4dacec91"
				stroke="#4faeed"
				barSize={50}
			/>
		</BarChart>
	);
};

export default WeatherChart;
