import RegisterForm from "@/components/auth/RegisterForm";

export default function Register() {
    return (
        <div className="h-screen">
            <header className="p-3">
                <h1 className="text-2xl font-bold">Hi!👋,欢迎你的到来～</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    注册一个账号，就可以开始使用此游戏模块的大部分功能了！！
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    为了不收集个人信息，注册采取邀请制，你可以随时
                    <a
                        href="mailto:agcl01@icloud.com"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        联络我
                    </a>
                    ，我会邀请你加入游戏模块的使用！
                </p>
            </header>
            <main>
                <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className=" dark:bg-gray-800 rounded-lg p-3">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            注册账号
                        </h2>
                        <p className="mt-4 text-gray-700 dark:text-gray-300">
                            请填写以下信息注册账号：
                        </p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                        <RegisterForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
