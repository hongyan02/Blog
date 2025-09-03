export function Footer() {
    return (
        <footer className="max-w-7xl mx-auto px-4 py-1 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                &copy; 2024-{new Date().getFullYear()}{" "}
                <a href="https://agcl.ink" className="text-blue-600">
                    AgCl
                </a>
                &nbsp;
                <a href="https://beian.miit.gov.cn/#/Integrated/index" className="text-blue-600">
                    湘ICP备2025131827号
                </a>
            </p>
        </footer>
    );
}
