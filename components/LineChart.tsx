import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function LineChart(props: any) {
    const series = [
        {
            name: "Guests",
            data: [19, 22, 20, 26],
        },
        {
            name: "Subs",
            data: [103, 105, 98, 83],
        },
    ];
    const options = {
        colors: [
            "#3D44CA",
            "#CA3D3D",
            "#E0CF42",
            "#59DB3F",
            "#E5AF34",
            "#AA50E1",
            "#A07C35",
            "#DF67D4",
            "#a9ed87",
            "#E5E5E5",
            "#979797",
            "#aaffc3",
            "#5DC3C2",
            "#90cde0",
            "#3ff527",
            "#f52727",
        ],
        xaxis: {
            title: {
                text: "Day",
            },
        },
        yaxis: {
            // title: {
            //     text: "Amount",
            // },
            labels: {
                formatter(val: any) {
                    if (["ERA", "WHP", "OBP", "OPS"].includes(props.selectedStat)) {
                        return parseFloat(val).toFixed(4);
                    } else {
                        return parseFloat(val).toFixed(0);
                    }
                },
            },
        },
        tooltip: {
            theme: "dark",
        },
        chart: {
            foreColor: "#BBB",
        },
        // markers: {
        //     size: 3,
        // },
    };

    return <Chart type="line" series={props.data} options={options} />;
}
