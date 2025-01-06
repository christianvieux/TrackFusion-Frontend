"use client";
import React from "react";
import Link from "next/link";
import { Linkedin, Github, Mail, Phone } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen p-8 text-white">
      <div className="mx-auto max-w-4xl bg-black/30 border-2 border-gray-dark p-4 rounded-xl">
        <h1 className="mb-8 text-5xl font-semibold text-blue-light">Get in Touch</h1>
        
        <div className="mb-12 space-y-6 text-lg">
          <p>
            Thank you for exploring TrackFusion. As a full stack web developer, I'm always interested
            in discussing new opportunities, receiving feedback on my projects, or engaging in
            technical discussions about web development.
          </p>

          <div className="rounded-lg bg-purple-dark/50 p-8 shadow-inner">
            <h2 className="mb-6 text-3xl font-semibold text-blue-light">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-blue" />
                <a href="mailto:christianvieux.dev@gmail.com" 
                   className="hover:text-pink">
                  christianvieux.dev@gmail.com
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-blue" />
                <a href="tel:+19292445140" 
                   className="hover:text-pink">
                  (929) 244-5140
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <Linkedin className="h-6 w-6 text-blue" />
                <a href="https://linkedin.com/in/christian-vieux-dev" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hover:text-pink">
                  linkedin.com/in/christian-vieux-dev
                </a>
              </div>

              <div className="flex items-center space-x-4">
                <Github className="h-6 w-6 text-blue" />
                <a href="https://github.com/christianvieux" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="hover:text-pink">
                  github.com/christianvieux
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-purple-dark/50 p-8 shadow-inner">
            <h2 className="mb-4 text-2xl font-semibold text-blue">About This Project</h2>
            <p>
              TrackFusion is part of my web development portfolio, demonstrating expertise in:
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-blue-light">
              <div>• Next.js</div>
              <div>• React</div>
              <div>• Tailwind CSS</div>
              <div>• Responsive Design</div>
              <div>• API Integration</div>
              <div>• User Authentication</div>
            </div>
          </div>
        </div>

        <Link href="/home">
          <button className="rounded-lg border-2 border-purple bg-purple-dark/50 px-6 py-3 font-semibold text-blue-light shadow-inner hover:text-pink">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}