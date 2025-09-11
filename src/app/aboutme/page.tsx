import MailIcon from "@/shared/icons/Mail";

export default function AboutMePage() {
    return (
        <div className="grid-background min-h-screen">
            <header className="p-3">
                <h1 className="text-4xl font-extrabold p-4">About Me</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 p-4 pt-0">
                    Hi there! 👋 Nice to meet you~
                </p>
            </header>

            <main className="p-3">
                {/* 基本信息 */}
                <div className="bg-white/20 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        基本信息
                    </h2>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">出生日期:</span>
                            <span>2002年9月7日</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">职业:</span>
                            <span>前端工程师</span>
                        </div>
                    </div>
                </div>

                {/* 技术栈 */}
                <div className="bg-white/20 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        技术栈
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "React",
                            "Next.js",
                            "TypeScript",
                            "Tailwind CSS",
                            "Node.js",
                            "PostgreSQL",
                        ].map((tech) => (
                            <span
                                key={tech}
                                className="bg-blue-600/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 工作经历 */}
                <div className="bg-white/20 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        工作经历
                    </h2>
                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-600 pl-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    亿纬锂能
                                </h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    2024年7月3日————至今
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">前端工程师</p>
                        </div>

                        <div className="border-l-4 border-green-600 pl-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    中电金信(实习)
                                </h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    2023年12月1日————2024年4月3日
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">字节跳动海外业务测试</p>
                        </div>

                        <div className="border-l-4 border-yellow-600 pl-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    万兴科技集团股份有限公司(实习)
                                </h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    2023年6月12日————2023年9月28日
                                </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">产品体验师</p>
                        </div>
                    </div>
                </div>

                {/* 联系方式 */}
                <div className="bg-white/20 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        联系我
                    </h2>
                    {/* <p className="text-gray-700 dark:text-gray-300 mb-4">
                        如果你想要联系我，可以通过以下方式：
                    </p> */}
                    <a
                        href="mailto:agcl01@icloud.com"
                        className="inline-flex items-center gap-2 text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        <MailIcon
                            width={20}
                            height={20}
                        />
                        agcl01@icloud.com
                    </a>
                </div>
            </main>
        </div>
    );
}
