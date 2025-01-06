"use client";
import React from "react";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen p-8 text-white">
      <div className="mx-auto max-w-4xl bg-black/30 border-2 border-gray-dark p-4 rounded-xl">
        <h1 className="mb-8 text-5xl font-semibold text-blue-light">About TrackFusion</h1>
        
        <div className="mb-12 space-y-6 text-lg">
          <p>
            TrackFusion is a portfolio project that showcases modern web development capabilities
            while creating a practical music platform. Built with Next.js and React, it demonstrates
            the implementation of complex features in a user-friendly interface.
          </p>

          <div className="rounded-lg bg-purple-dark/50 p-6 shadow-inner">
            <h2 className="mb-4 text-3xl font-semibold text-blue-light">Our Platform Features</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-semibold text-blue">Music Streaming</h3>
                <p>Access and enjoy a diverse collection of audio tracks directly through our intuitive web interface.</p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-blue">Social Sharing</h3>
                <p>Share your musical discoveries with others and explore what fellow music enthusiasts are listening to.</p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold text-blue">Personal Library</h3>
                <p>Create your own collection by saving and organizing your favorite tracks in a personalized library.</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-3xl font-semibold text-blue-light">Technical Overview</h2>
            <p>
              This project demonstrates proficiency in modern web technologies including:
              Next.js, React, Tailwind CSS, and responsive design principles. It showcases
              implementation of user authentication, file handling, and API integration.
            </p>
          </div>
        </div>

        <div className="flex space-x-6">
          <Link href="/contact">
            <button className="rounded-lg border-2 border-purple bg-purple-dark/50 px-6 py-3 font-semibold text-blue-light shadow-inner hover:text-pink">
              Contact Developer
            </button>
          </Link>
          <Link href="/feed">
            <button className="rounded-lg border-2 border-purple bg-purple-dark/50 px-6 py-3 font-semibold text-blue-light shadow-inner hover:text-pink">
              Explore Platform
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}