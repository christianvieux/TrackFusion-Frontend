// app/maintenance/page.js
"use client";

import React from "react";

export default function MaintenancePage() {
return (
    <div className="flex min-h-screen items-center justify-center text-white">
        <div className="mx-auto max-w-2xl text-center px-4">
            <h1 className="text-4xl font-bold mb-4">Website Under Maintenance</h1>
            <div className="p-8 rounded-lg">
                <p className="text-xl mb-4">
                    The website is currently being migrated to AWS.
                </p>
                <p className="text-lg mb-6">
                    The maintenance is expected to take 2-3 days. Please check back later.
                </p>
                <div className="text-green-lightest">
                    Thank you for your patience and understanding.
                </div>
            </div>
        </div>
    </div>
);
}