import random from "lodash/random";
import moment from "moment";

const colors = ["#5470C6", "#EE6666", "green"];

export const MULTIPLE_AXIS_OPTION = {
	color: colors,
	tooltip: {
		trigger: "none",
		axisPointer: {
			type: "cross",
		},
	},
	legend: {},
	grid: {
		top: 40,
		bottom: 80,
	},
	dataZoom: [
		{
			type: "slider",
			yAxisIndex: 0,
			filterMode: "none",
		},
		{
			type: "inside",
			yAxisIndex: 0,
			filterMode: "none",
		},
	],
	xAxis: [
		{
			offset: 0,
			position: "bottom",
			type: "category",
			axisTick: {
				alignWithLabel: true,
			},
			axisLine: {
				onZero: false,
				lineStyle: {
					color: colors[1],
				},
			},
			axisPointer: {
				label: {
					formatter: function (params: any) {
						return (
							"Precipitation  " +
							params.value +
							(params.seriesData.length ? "：" + params.seriesData[0].data : "")
						);
					},
				},
			},
			// prettier-ignore
			data: ['2016-1', '2016-2', '2016-3', '2016-4', '2016-5', '2016-6', '2016-7', '2016-8', '2016-9', '2016-10', '2016-11', '2016-12'],
		},
		{
			type: "category",
			position: "bottom",
			offset: 20,
			axisTick: {
				alignWithLabel: true,
			},
			axisLine: {
				onZero: false,
				lineStyle: {
					color: colors[0],
				},
			},
			axisPointer: {
				label: {
					formatter: function (params: any) {
						return (
							"Precipitation  " +
							params.value +
							(params.seriesData.length ? "：" + params.seriesData[0].data : "")
						);
					},
				},
			},
			// prettier-ignore
			data: ['2015-1', '2015-2', '2015-3', '2015-4', '2015-5', '2015-6', '2015-7', '2015-8', '2015-9', '2015-10', '2015-11', '2015-12'],
		},
		{
			type: "category",
			position: "bottom",
			offset: 40,
			axisTick: {
				alignWithLabel: true,
			},
			axisLine: {
				onZero: false,
				lineStyle: {
					color: colors[2],
				},
			},
			axisPointer: {
				label: {
					formatter: function (params: any) {
						return (
							"Precipitation  " +
							params.value +
							(params.seriesData.length ? "：" + params.seriesData[0].data : "")
						);
					},
				},
			},
			// prettier-ignore
			data: ['2017-1', '2017-2', '2017-3', '2017-4', '2017-5', '2017-6', '2017-7', '2017-8', '2017-9', '2017-10', '2017-11', '2017-12'],
		},
	],
	yAxis: [
		{
			type: "value",
		},
	],
	series: [
		{
			name: "Precipitation(2015)",
			type: "line",
			smooth: true,
			emphasis: {
				focus: "series",
			},
			data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
		},
		{
			name: "Precipitation(2016)",
			type: "line",
			smooth: true,
			emphasis: {
				focus: "series",
			},
			data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7],
		},
		{
			name: "Precipitation(2017)",
			type: "line",
			smooth: true,
			emphasis: {
				focus: "series",
			},
			data: [5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7, 9.8],
		},
	],
};

export const LIST_TIME_FRAME = [
	{
		value: "last_15_mins",
		label: "Last 15 minutes",
	},
	{
		value: "last_30_mins",
		label: "Last 30 minutes",
	},
	{
		value: "yesterday",
		label: "Yesterday",
	},
	{
		value: "last_week",
		label: "Last week",
	},
	{
		value: "last_month",
		label: "Last month",
	},
	{
		value: "all_time",
		label: "All time",
	},
];

export const LIST_CHART_TYPE = [
	{
		value: "line_chart",
		label: "Line chart",
	},
	{
		value: "bar_chart",
		label: "bar chart",
	},
];

export const DARK_MODE_OPTION: any = {
	backgroundColor: "#1E294B",
	textStyle: {
		color: "white",
		fontFamily: "sans-serif",
		fontSize: 12,
		fontStyle: "normal",
		fontWeight: "normal",
	},
	title: {
		textStyle: {
			color: "white",
		},
	},
};

export const LIGHT_MODE_OPTION: any = {
	backgroundColor: "white",
	textStyle: {
		color: "#B9B8CE",
		fontFamily: "sans-serif",
		fontSize: "12",
		fontStyle: "normal",
		fontWeight: "normal",
	},
};

export const TITLE_OPTION = {
	title: {
		triggerEvent: true,
		text: "Echarts Line Chart",
		left: "1%",
	},
};

export const TOOLTIP_OPTION = {
	tooltip: {
		trigger: "none",
		axisPointer: {
			type: "cross",
		},
	},
};

export const GRID_OPTION = {
	grid: {
		top: "20%",
		left: "10%",
		right: "10%",
		bottom: "20%",
	},
};

export const TOOLBOX_OPTION = {
	toolbox: {
		right: 10,
		feature: {
			dataZoom: {
				yAxisIndex: "none",
			},
			restore: {},
			saveAsImage: {},
		},
	},
};

export const XAXIS_OPTION = {
	xAxis: {
		position: "bottom",
		triggerEvent: true,
	},
};

export const YAXIS_OPTION = {
	yAxis: {
		triggerEvent: true,
	},
};

export const SERIES_OPTION = {
	series: {
		triggerLineEvent: true,
		type: "line",
		lineStyle: {
			width: 0.5,
		},
		markLine: {
			silent: true,
			lineStyle: {
				color: "#333",
			},
			data: [
				{
					yAxis: 50,
				},
				{
					yAxis: 100,
				},
				{
					yAxis: 150,
				},
				{
					yAxis: 200,
				},
				{
					yAxis: 300,
				},
			],
		},
	},
};

export const VISUALMAP_OPTION = {
	visualMap: {
		top: 0,
		left: "auto",
		right: "auto",
		orient: "horizontal",
		textStyle: {
			color: "white",
		},
		pieces: [
			{
				gt: 0,
				lte: 50,
				color: "#39FE4D",
			},
			{
				gt: 50,
				lte: 100,
				color: "#FFE600",
			},
			{
				gt: 100,
				lte: 150,
				color: "#FF9A44",
			},
			{
				gt: 150,
				lte: 200,
				color: "#FE005B",
			},
			{
				gt: 200,
				lte: 300,
				color: "#00DBF9",
			},
			{
				gt: 300,
				color: "#6956FB",
			},
		],
		outOfRange: {
			color: "#999",
		},
	},
};

export const DEFAULT_OPTION: any = {
	...TITLE_OPTION,
	...TOOLTIP_OPTION,
	...GRID_OPTION,
	...TOOLBOX_OPTION,
	...XAXIS_OPTION,
	...YAXIS_OPTION,
	...SERIES_OPTION,
	...VISUALMAP_OPTION,
	...DARK_MODE_OPTION,
};

export const getDay = (value: string) => {
	switch (value) {
		case "last_15_mins":
			return "Mon";
		case "last_30_mins":
			return "Tue";
		case "yesterday":
			return "Wed";
		case "last_week":
			return "Thu";
		case "last_month":
			return "Fri";
		case "all_time":
			return "Sat";
		default:
			return "";
	}
};

export const getRows = (data: any) => {
	return data.map((i: any, index: any) => {
		console.log(i);
		return {
			id: index,
			object_name: `Breed Tank ${index}`,
			description: "Temperature Drop",
			average: random(1, 100) / 10,
			min: random(1, 100) / 10,
			max: random(1, 100) / 10,
			unit: "%",
			hide_all: "Hide",
			remove_all: "Remove",
			tag: ["Breed", "Tank1", "Chart"],
		};
	});
};

export const createFakeFullData = () => {
	let result: any = [];
	const COUNT = 100000;
	for (let i = 0; i < COUNT; i++) {
		const item = [
			moment()
				.add(COUNT - i, "days")
				.format("YYYY-MM-DD"),
			random(1, 500),
		];
		result.push(item);
	}
	return result;
};
