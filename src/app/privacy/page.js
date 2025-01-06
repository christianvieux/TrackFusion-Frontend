// privacy.js
"use client";
import React from "react";
import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen p-8 text-white">
      <div className="mx-auto max-w-4xl bg-black/30 border-2 border-gray-dark p-4 rounded-xl">
        <h1 className="mb-8 text-5xl font-semibold text-blue-light">Privacy Policy</h1>
        
        <div className="space-y-6 text-lg">
          <p>
            TrackFusion is committed to demonstrating good privacy practices as part of this
            portfolio project. This policy outlines how user data would be handled in a
            production environment.
          </p>

          <div className="rounded-lg bg-purple-dark/50 p-6 shadow-inner">
            <h2 className="mb-4 text-2xl font-semibold text-blue">Data Collection</h2>
            <div className="space-y-4">
              <p>For demonstration purposes, we may collect:</p>
              <p>• Basic account information (username, email)</p>
              <p>• Usage data and preferences</p>
              <p>• Uploaded content history</p>
            </div>
          </div>

          <div className="rounded-lg bg-purple-dark/50 p-6 shadow-inner">
            <h2 className="mb-4 text-2xl font-semibold text-blue">Data Usage</h2>
            <div className="space-y-4">
              <p>• To demonstrate user authentication functionality</p>
              <p>• To showcase content management features</p>
              <p>• To display platform usage statistics</p>
            </div>
          </div>

          <p className="mt-6 text-sm">
            Note: This is a portfolio project, and no actual user data is stored or processed
            for commercial purposes.
          </p>
        </div>
      </div>
    </div>
  );
}