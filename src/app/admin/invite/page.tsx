"use client";
import { useState } from "react";
import InviteTable from "@/components/Invite/InviteTable";
import CreateInviteForm from "@/components/Invite/CreateForm";

export default function InvitePage() {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">邀请码管理</h1>
                <button
                    onClick={() => setShowForm((s) => !s)}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                    {showForm ? "收起表单" : "生成邀请码"}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg p-4 ">
                    <CreateInviteForm />
                </div>
            )}

            <InviteTable />
        </div>
    );
}
