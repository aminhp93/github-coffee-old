import random from "lodash/random";
import moment from "moment";
import { useEffect, useRef } from "react";

export const DATE_FORMAT = "YYYY-MM-DD";
export const COLORS = ["#5470C6", "#EE6666", "green", "red", "blue"];

export const LIST_START_TIME_FRAME = [
	{
		value: "choose_from_calendar",
		label: "Choose from calendar",
		countDay: 0,
	},
	{
		value: "last_15_mins",
		label: "Last 15 minutes",
		countDay: 0,
	},
	{
		value: "last_30_mins",
		label: "Last 30 minutes",
		countDay: 0,
	},
	{
		value: "last_hour",
		label: "Last Hour",
		countDay: 0,
	},
	{
		value: "last_2_hours",
		label: "Last 2 hours",
		countDay: 0,
	},
	{
		value: "last_4_hours",
		label: "Last 4 hours",
		countDay: 0,
	},
	{
		value: "last_6_hours",
		label: "Last 6 hours",
		countDay: 0,
	},
	{
		value: "last_12_hours",
		label: "Last 12 hours",
		countDay: 0,
	},
	{
		value: "last_day",
		label: "Last Day",
		countDay: 1,
	},
	{
		value: "last_2_days",
		label: "Last 2 days",
		countDay: 2,
	},
	{
		value: "last_3_days",
		label: "Last 3 days",
		countDay: 3,
	},
	{
		value: "last_4_days",
		label: "Last 4 days",
		countDay: 4,
	},
	{
		value: "last_5_days",
		label: "Last 5 days",
		countDay: 5,
	},
	{
		value: "last_6_days",
		label: "Last 6 days",
		countDay: 6,
	},
	{
		value: "last_week",
		label: "Last Week",
		countDay: 7,
	},
	{
		value: "last_x_weeks",
		label: "Last X weeks",
		countDay: 14,
	},
	{
		value: "last_x_weeks_2",
		label: "Last x weeks 2",
		countDay: 21,
	},
	{
		value: "last_month",
		label: "Last month",
		countDay: 30,
	},
	{
		value: "last_3_months",
		label: "Last 3 months",
		countDay: 1 * 30 * 3,
	},
	{
		value: "last_6_months",
		label: "Last 6 months",
		countDay: 1 * 30 * 6,
	},
	{
		value: "last_year",
		label: "Last year",
		countDay: 1 * 30 * 12,
	},
	{
		value: "last_18_months",
		label: "Last 18 months",
		countDay: 1 * 30 * 18,
	},
];

export const LIST_END_TIME_FRAME = [
	{
		value: "choose_from_calendar",
		label: "Choose from calendar",
		countDay: 0,
	},
	{
		value: "next_15_mins",
		label: "15 minutes",
		countDay: 0,
	},
	{
		value: "next_30_mins",
		label: "30 minutes",
		countDay: 0,
	},
	{
		value: "next_hour",
		label: "Hour",
		countDay: 0,
	},
	{
		value: "next_2_hours",
		label: "2 hours",
		countDay: 0,
	},
	{
		value: "next_4_hours",
		label: "4 hours",
		countDay: 0,
	},
	{
		value: "next_6_hours",
		label: "6 hours",
		countDay: 0,
	},
	{
		value: "next_12_hours",
		label: "12 hours",
		countDay: 0,
	},
	{
		value: "next_day",
		label: "Day",
		countDay: 1,
	},
	{
		value: "next_2_days",
		label: "2 days",
		countDay: 2,
	},
	{
		value: "next_3_days",
		label: "3 days",
		countDay: 3,
	},
	{
		value: "next_4_days",
		label: "4 days",
		countDay: 4,
	},
	{
		value: "next_5_days",
		label: "5 days",
		countDay: 5,
	},
	{
		value: "next_6_days",
		label: "6 days",
		countDay: 6,
	},
	{
		value: "next_week",
		label: "Week",
		countDay: 7,
	},
	{
		value: "next_x_weeks",
		label: "X weeks",
		countDay: 14,
	},
	{
		value: "next_x_weeks_2",
		label: "x weeks 2",
		countDay: 21,
	},
	{
		value: "next_month",
		label: "month",
		countDay: 30,
	},
	{
		value: "next_3_months",
		label: "3 months",
		countDay: 1 * 30 * 3,
	},
	{
		value: "next_6_months",
		label: "6 months",
		countDay: 1 * 30 * 6,
	},
	{
		value: "next_year",
		label: "year",
		countDay: 1 * 30 * 12,
	},
	{
		value: "next_18_months",
		label: "18 months",
		countDay: 1 * 30 * 18,
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
		trigger: "axis",
		axisPointer: {
			type: "cross",
		},
		position: function (pt: any) {
			return [pt[0], "10%"];
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
			// restore: {},
			// saveAsImage: {},
		},
	},
};

export const XAXIS_OPTION = {
	xAxis: {
		position: "bottom",
		triggerEvent: true,
		type: "category",
		// axisLine: {
		// 	show: false
		// }
		// type: "log",
		nameTextStyle: {
			color: "red",
		},
		// data: [
		// 	{
		// 		textStyle: {
		// 			color: "red",
		// 		},
		// 	},
		// ],
		axisLabel: {
			// inside: true,
			// margin: 40,
			// formatter: [
			// 	'{a|Style "a" is applied to this snippet}',
			// 	'{b|Style "b" is applied to this snippet}This snippet use default style{x|use style "x"}',
			// ].join("\n"),
			// rich: {
			// 	a: {
			// 		color: "red",
			// 		lineHeight: 10,
			// 	},
			// 	b: {
			// 		backgroundColor: {
			// 			image: "xxx/xxx.jpg",
			// 		},
			// 		height: 40,
			// 	},
			// 	x: {
			// 		fontSize: 18,
			// 		fontFamily: "Microsoft YaHei",
			// 		borderColor: "#449933",
			// 		borderRadius: 4,
			// 	},
			// },
		},
		// minorTick: {
		// 	show: true,
		// },
		// minorSplitLine: {
		// 	show: true,
		// },
	},
};

export const YAXIS_OPTION = {
	yAxis: {
		triggerEvent: true,
		// min: 50,
		// max: 100,
		// minorTick: {
		// 	show: true,
		// },
		// minorSplitLine: {
		// 	show: true,
		// },
	},
};

export const SERIES_OPTION = {
	series: {
		triggerLineEvent: true,
		type: "line",
		lineStyle: {
			width: 0.5,
		},
		// markLine: {
		// 	silent: true,
		// 	lineStyle: {
		// 		color: "#333",
		// 	},
		// 	data: [
		// 		{ yAxis: 50 },
		// 		{ yAxis: 100 },
		// 		{ yAxis: 150 },
		// 		{ yAxis: 200 },
		// 		{ yAxis: 300 },
		// 		{ xAxis: 1 },
		// 		{ xAxis: 3 },
		// 		{ xAxis: 5 },
		// 		{ xAxis: 7 },
		// 	],
		// },
		clip: true,
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
	// ...XAXIS_OPTION,
	// ...YAXIS_OPTION,
	// ...SERIES_OPTION,
	// ...VISUALMAP_OPTION,
	...LIGHT_MODE_OPTION,
	color: COLORS,
	dataZoom: [
		{
			type: "inside",
			start: 50,
			end: 100,
		},

		{
			type: "slider",
			start: 50,
			end: 100,
		},
	],
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
	if (!data) return [];
	return data.map((i: any) => {
		return {
			id: i.id,
			object_name: i.name,
			description: `Description ${i.name}`,
			average: random(1, 100) / 10,
			min: random(1, 100) / 10,
			max: random(1, 100) / 10,
			unit: "%",
			hide: "Hide",
			remove: "Remove",
			color: i.color,
			toggle_right_axis: "Toggle",
		};
	});
};

export const initFakeData = () => {
	let result: any = [];
	const COUNT = 20;
	for (let i = 0; i < COUNT; i++) {
		const item = [moment().add(i, "days").format(DATE_FORMAT), random(1, 500)];
		result.push(item);
	}
	return result;
};

function getDatesInRange(startDate: any, endDate: any) {
	const date = new Date(startDate.getTime());

	const dates = [];

	while (date <= endDate) {
		dates.push(new Date(date));
		date.setDate(date.getDate() + 1);
	}

	return dates;
}

export const addFakeDataBetween = (startDate: any, endDate: any) => {
	const list = getDatesInRange(new Date(startDate), new Date(endDate));

	return list.map((i: any) => {
		return [moment(i).format(DATE_FORMAT), random(1, 500)];
	});
};

export const addFakeData = (date: any, count: number) => {
	let result: any = [];
	if (count > 0) {
		for (let i = 0; i < count; i++) {
			const item = [
				moment(date)
					.add(i + 1, "days")
					.format(DATE_FORMAT),
				random(1, 500),
			];
			result.push(item);
		}
	} else if (count < 0) {
		for (let i = count; i < 0; i++) {
			const item = [
				moment(date)
					.add(i + 1, "days")
					.format(DATE_FORMAT),
				random(1, 500),
			];
			result.push(item);
		}
	}
	console.log("addFakeData", result, date, count);

	return result;
};

export const DEFAULT_START_TIME_FRAME = LIST_START_TIME_FRAME[16];
export const DEFAULT_END_TIME_FRAME = LIST_END_TIME_FRAME[10];

export const waitApi = () => {
	return new Promise<void>((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, 500);
	});
};

export function useInterval(callback: any, delay: any) {
	const savedCallback = useRef();

	useEffect(() => {
		savedCallback.current = callback;
	});

	useEffect(() => {
		function tick() {
			// 👇️ ts-nocheck disables type checking for entire file
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-nocheck

			// 👇️ ts-ignore ignores any ts errors on the next line
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			savedCallback.current();
		}

		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

export const MULTIPLE_AXIS_DATA = [{ id: 1 }, { id: 2 }, { id: 3 }].map((i: any, index) => {
	const data = initFakeData();
	i.name = `Name ${index}`;
	i.offset = 20 * index;
	i.color = COLORS[index];
	i.seriesData = data.map((j: any) => j[1]);
	i.xAxisData = data.map((j: any) => j[0]);
	return i;
});

const getMarkLine = (data: any) => {
	const result: any = [];
	data.map((i: any, index: number) => {
		if (index % 1 === 0) {
			result.push({
				xAxis: index,
			});
		}
	});
	return result;
};

export const getNewOption = (newData: any, oldOption: any) => {
	return {
		...oldOption,
		legend: {
			data: newData.map((i: any) => {
				return i.name;
			}),
		},
		xAxis: newData.map((i: any) => {
			return {
				type: "category",
				position: "bottom",
				offset: i.offset,
				axisTick: {
					alignWithLabel: true,
				},
				axisLine: {
					onZero: false,
					lineStyle: {
						color: i.color,
					},
				},
				// axisPointer: {
				//     label: {
				//         formatter: function (params: any) {
				//             return (
				//                 // params.value +
				//                 (params.seriesData.length ? params.seriesData[0].data : "")
				//             );
				//         },
				//     },
				// },
				// prettier-ignore
				data: i.xAxisData,
				id: i.id,
			};
		}),
		yAxis: newData.map((i: any) => {
			return {
				type: "value",
				name: i.name,
				position: i.position,
			};
		}),
		series: newData.map((i: any) => {
			return {
				name: i.name,
				yAxisIndex: i.yAxisIndex,
				type: "line",
				smooth: true,
				emphasis: {
					focus: "series",
				},
				data: i.seriesData,
				id: i.id,
				lineStyle: {
					color: i.lineStyle?.color,
				},
				markLine: {
					symbol: ["none", "none"],
					label: { show: false },
					data: getMarkLine(i.xAxisData),
					lineStyle: {
						color: "#1E294B",
						type: "solid",
						opacity: 0.6,
						width: 0.6,
					},
				},
			};
		}),
	};
};
