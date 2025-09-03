import LoginForm from "@/components/auth/LoginForm";

export default function Login() {
    return (
        <div>
            <header className="p-3">
                <h1 className="text-2xl font-bold">Hi!👋,最近还好吗？</h1>
            </header>
            <main>
                <LoginForm />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    什么？？还没有账号！
                    <a
                        href="/games/register"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        去注册！
                    </a>
                </p>
            </main>
        </div>
    );
}
