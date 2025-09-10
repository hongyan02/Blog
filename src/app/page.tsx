import { Footer } from "@/shared/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AgCl",
    description: "AgCl's blog HomePage",
};

export default function Home() {
    return (
        <div className="min-h-screen grid-background">
            <div className="min-h-screen">
                <header>
                    <h1></h1>
                </header>
            </div>
            <Footer />
        </div>
    );
}
