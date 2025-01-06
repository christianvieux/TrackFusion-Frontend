// terms.js
"use client";
import React from "react";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen p-8 text-white">
      <div className="mx-auto max-w-4xl bg-black/30 border-2 border-gray-dark p-4 rounded-xl">
        <h1 className="mb-8 text-5xl font-semibold text-blue-light">Terms of Service</h1>
        
        <div className="space-y-6 text-lg">
          <p>
            Welcome to TrackFusion. This is a portfolio project created for demonstration
            purposes. By using this service, you acknowledge that:
          </p>

          <div className="rounded-lg bg-purple-dark/50 p-6 shadow-inner">
            <h2 className="mb-4 text-2xl font-semibold text-blue">Usage Terms</h2>
            <div className="space-y-4">
              <p>1. This is a demonstration project and not a commercial service.</p>
              <p>2. Features are provided for demonstration purposes only.</p>
              <p>3. User data may not be permanently stored or secured.</p>
              <p>4. The service may be modified or terminated at any time.</p>
            </div>
          </div>

          <div className="rounded-lg bg-purple-dark/50 p-6 shadow-inner">
            <h2 className="mb-4 text-2xl font-semibold text-blue">Content Guidelines</h2>
            <div className="space-y-4">
              <p>1. Users are responsible for the content they upload.</p>
              <p>2. Copyrighted material should not be uploaded without permission.</p>
              <p>3. Inappropriate or illegal content is strictly prohibited.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}