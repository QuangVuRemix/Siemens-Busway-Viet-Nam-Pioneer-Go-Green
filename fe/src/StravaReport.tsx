import React, { useEffect } from "react";
import { Report, ReportGroup } from './interface'
import { secondsToHHmm } from "./utils";
import { ResponsiveContainer, XAxis, YAxis, Legend, Bar, Cell, Pie, PieChart, ComposedChart, Line } from "recharts";
const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];
const GroupReport: React.FC<{ group: ReportGroup }> = (props) => {
    const members = props.group.members;

    return (<div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{props.group.name}</h3>
        <p className="mb-2">Quãng đường từng thành viên:</p>
        <table className="table-auto border-collapse border border-gray-300 dark:border-gray-700 w-full mb-4">
            <thead>
                <tr>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2 w-[40px]">STT</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2 w-[50px]">Hạng</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Tên thành viên</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Quãng đường</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Hoạt động</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Độ cao</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-2 py-2">Thời gian chạy</th>
                </tr>
            </thead>
            <tbody>
                {members.map((member, index) => (
                    <tr key={index}>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{index + 1}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{member.rank}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2">
                            <div className="flex">
                                <img src={member.profile} className="w-[30px] h-[30px] rounded-full mr-2" />
                                <span>{member.lastName} {member.firstName}</span>
                            </div>
                        </td>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{(member.distance / 1000).toLocaleString('en-US', { maximumFractionDigits: 2 })} km</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{(member.activities).toLocaleString('en-US')}</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{(member.elevGain).toLocaleString('en-US', { maximumFractionDigits: 0 })} m</td>
                        <td className="border border-gray-300 dark:border-gray-700 px-2 py-2 text-center">{secondsToHHmm(member.movingTime)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <p className="italic">*Biểu đồ cột cho Nhóm*</p>
        <div className={`w-[1230px] h-[400px]`}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                    width={800}
                    height={400}
                    data={members}
                    margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                    }}
                >
                    {/* <CartesianGrid stroke="#f5f5f5" /> */}
                    <XAxis dataKey="name" scale="auto" />
                    <YAxis unit={"m"} />
                    <Legend />
                    {/* <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" /> */}
                    <Bar dataKey="distance" barSize={20} fill="#413ea0" label="Quãng đường" />
                    <Line type="monotone" dataKey="movingTime" stroke="#ff7300" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
    )
}
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
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


    return (
        <div className="p-6 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 ">
            {/* Header section with logo and organization name */}
            <div className="flex items-center mb-6">
                <img
                    src="/logo.png"
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
                <p className="italic">*Biểu đồ tròn*</p>
                <div className={`w-[800px] h-[400px]`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={400} height={400} dataKey={"name"}>
                            <Legend />
                            <Pie
                                data={groups}
                                cx="50%"
                                cy="50%"
                                fill="#8884d8"
                                dataKey="totalDistance"
                                label={renderCustomizedLabel}
                            >
                                {groups.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* <div className={`w-[800px] h-[400px]`}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={groups}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis /> 
                            <Bar dataKey="totalDistance" fill="#8884d8"  
                            activeBar={<Rectangle fill="pink" stroke="blue" />} >
                                {groups.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                                ))}</Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>  */}
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
