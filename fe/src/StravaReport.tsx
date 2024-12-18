import React, { useEffect } from "react";
import { Report, ReportGroup } from './interface'
import { secondsToHHmm } from "./utils";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale, // Required for category-based axes
    LinearScale,   // Required for numeric axes
    BarElement,    // Required for bar charts
    Title,         // Optional, for chart titles
    Tooltip,       // Optional, for tooltips
    Legend,        // Optional, for legends
    ArcElement,
    Colors,
    PointElement,
    LineElement,
    LineController
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, Colors, PointElement, LineElement, LineController);

const GroupReport: React.FC<{ group: ReportGroup }> = (props) => {
    const members = props.group.members;
    const data = {
        labels: members.map((item) => item.name), // Use names as labels
        datasets: [
            {
                label: "Quãng đường (km)",
                data: members.map((item) => (item.distance / 1000).toFixed(2)), // Use distance for data points
                // backgroundColor: "rgba(75, 192, 192, 0.5)",
                // borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
                order: 1,
                yAxisID: 'y',
                type: "bar"
            }, {
                label: "Thời gian",
                data: members.map((item) => (item.movingTime / 1000)), // Convert meters to kilometers 
                borderWidth: 1,
                order: 0,
                type: "line",
            }
        ]
    };

    // Chart options
    const options = {
        responsive: true,
        // type: "scatter",
        indexAxis: "y" as const,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Biểu đồ quãng đường của từng thành viên trong nhóm",
            },
            scales: {
                y: {
                    stacked: true
                }
            }
        }
    };
    return (<div className="mb-6" >
        <h3 className="text-xl font-semibold mb-2">{props.group.name}</h3>
        <p className="mb-2">Quãng đường từng thành viên:</p>
        <table className="table-auto border-collapse border border-gray-300 dark:border-gray-700 w-full mb-4">
            <thead>
                <tr>
                    {/* <th className="border border-gray-300 dark:border-gray-700 px-2 py-1 w-[30px]">STT</th> */}
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-1 w-[50px]">Hạng</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Tên thành viên</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Quãng đường</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Hoạt động</th>
                    {/* <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Độ cao</th> */}
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Thời gian chạy</th>
                </tr>
            </thead>
            <tbody>
                {members.map((member, index) => (
                    <tr key={index}>
                        {/* <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-center">{index + 1}</td> */}
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-1 text-center">{member.rank}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2">
                            <div className="flex items-center">
                                <img src={`data:image/png;base64,${member.profile}`} className="w-[30px] h-[30px] rounded-full mr-2" />
                                <span className="mr-1 text-gray-500 ">#{index + 1}</span>
                                <span>{member.lastName} {member.firstName}</span>
                            </div>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{(member.distance / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 })} km</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{(member.activities).toLocaleString('en-US')}</td>
                        {/* <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{(member.elevGain).toLocaleString('en-US', { maximumFractionDigits: 0 })} m</td> */}
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{secondsToHHmm(member.movingTime)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div style={{ height: props.group.members.length * 40 + 100 }}>
            <Bar data={data as any} options={options} />
        </div>
    </div >
    )
}
const StravaReport: React.FC<{ data: Report }> = (props) => {
    const groups = props.data.reportGroups.sort((a, b) => a.totalDistance > b.totalDistance ? -1 : 1)
    // Lấy thời gian hiện tại
    const currentDate = new Date(props.data.reportTime).toLocaleString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
    });

    useEffect(() => {
        document.title = props.data.title
    }, [])

    const data = {
        labels: groups.map(x => x.name),
        datasets: [{
            label: "Tổng quãng đường (km)",
            data: groups.map((item) => (item.totalDistance / 1000).toFixed(2)), // Convert meters to kilometers 
            borderWidth: 1,
        },

        ]
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Tổng quản đường đã chạy của từng nhóm (km)",
            },
            // colors: {
            //     enabled: false,
            //     forceOverride: true
            // }
        },
    };
    return (
        <div className="sm:p-10 p-4 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 max-w-full">
            {/* Header section with logo and organization name */}
            <div className="flex items-center mb-6">
                <img
                    src="./logo.png"
                    alt="Siemens Busway Logo"
                    className="h-6 w-auto mr-6"
                />
                {/* <h1 className="text-3xl font-bold">Báo Cáo Hoạt Động Chạy Bộ</h1> */}
            </div>

            {/* Report Date */}
            <div className="mb-6">
            </div>

            <h1 className="text-3xl font-bold mb-4 text-center">Báo Cáo Hoạt Động Chạy Bộ</h1>
            <p className="text-lg font-semibold text-center">{currentDate}</p>
            <br />
            <section className="sm:flex justify-between">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">1. Tổng Quan Về Kết Quả</h2>
                    <div  >Tổng quãng đường đã chạy: <strong>{(groups.reduce((pre, current) => pre + current.totalDistance, 0) / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 })} km</strong></div>
                    <div >Tổng thời gian chạy: <strong>{secondsToHHmm(groups.reduce((pre, current) => pre + current.totalMovingTime, 0))}</strong></div>
                    <div  >Tổng hoạt động: <strong>{(groups.reduce((pre, current) => pre + current.totalActivities, 0)).toLocaleString('en-US')}</strong></div>
                    <div  >Hoạt động chạy bộ được chia làm 3 nhóm:</div>
                    <ul className="list-disc ml-6 mb-4">
                        {groups.map((x, index) => (
                            <li key={x.name}>
                                <span>Hạng {index + 1}: </span>
                                <strong>{x.name}</strong>
                                <div className="pl-5">Tổng quãng đường đã chạy: <strong>{(x.totalDistance / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 })} km</strong></div>
                                <div className="pl-5">Tổng thời gian chạy: <strong>{secondsToHHmm(x.totalMovingTime)}</strong></div>
                                <div className="pl-5">Tổng hoạt động: <strong>{(x.totalActivities).toLocaleString('en-US')}</strong></div>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className={` h-[400px]`}>
                    <Pie data={data} options={options} />
                </section>
            </section>

            <hr className="border-gray-300 dark:border-gray-700 mb-8" />

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Kết Quả Chi Tiết Của Từng Nhóm</h2>

                {
                    groups.map(x => (<GroupReport group={x} key={x.name} />))
                }
            </section>

            <hr className="border-gray-300 dark:border-gray-700 mb-8" />

            {/* TODO */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Nhận Xét</h2>
                <ul className="list-disc ml-6">
                    <li><strong>{groups[0]?.name}</strong> dẫn đầu về tổng quãng đường, nhờ vào sự đóng góp của các thành viên như {groups[0]?.members?.[0].name} và {groups[0]?.members?.[1].name}.</li>
                    <li><strong>{groups[1]?.name}</strong> tuy đứng thứ hai nhưng có đồng đều đóng góp cao giữa các thành viên.</li>
                    <li><strong>{groups[2]?.name}</strong> tuy quãng đường tổng thấp nhất nhưng vẫn có {groups[2]?.members?.[0].name} nổi bật với quãng đường chạy.</li>
                </ul>
                <p className="mt-4">Các nhóm nên tiếp tục duy trì phong trào chạy bộ, khuyến khích thành viên tham gia tích cực để đạt được kết quả cao hơn trong tuần tới.</p>
            </section>
        </div>
    );
};

export default StravaReport;
