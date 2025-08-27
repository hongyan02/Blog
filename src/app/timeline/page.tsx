import TimeLine from "@/components/Timeline/TimeLine";

export default function TimeLinePage() {
    const data = [
        { date: "2023-01-01", title: "新年过好年", content: "新年快乐 🎉" },
        {
            date: "2023-03-05",
            title: "学习 Tailwind",
            content: "学习 Tailwind",
            bilibiliUrl: "https://player.bilibili.com/player.html?bvid=BV1B7411m7LV",
        },
        { date: "2023-06-20", title: "写时间轴组件", content: "时间轴组件" },
    ];

    return (
        <div className="grid-background min-h-screen p-3">
            <h1 className="text-4xl font-extrabold p-4">琐碎点滴</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 p-4 pt-0">what's happend!</p>
            {data.map((item, index) => (
                <TimeLine
                    key={index}
                    date={item.date}
                    title={item.title}
                    content={item.content}
                    bilibiliUrl={item.bilibiliUrl}
                />
            ))}
        </div>
    );
}
