"use client";
import React, { useEffect, useState } from "react";
import EmblaCarousel from "../carousel/EmblaCarousel.jsx";
import Link from "next/link";
import Image from 'next/image';

const SLIDES = [
  // {/* Title */}
  <div key="title" className="z-50 *:z-50 flex flex-col gap-5 p-4">
    <h1 className="pb-5 text-5xl font-semibold text-blue-light">
      Discover and Share Your Soundtrack
    </h1>
    <h2 className="pb-5 text-3xl">
      <span className="text-blue">Upload</span>,{" "}
      <span className="text-blue">Explore</span>, and{" "}
      <span className="text-blue">Enjoy</span> Audio Effortlessly
    </h2>
    {/* Supporting Text: */}
    <h3 className="text-1xl w-1/2 pb-5">
      Welcome to TrackFusion, your creative audio hub. Share everything from
      music tracks and sound effects to vocals and instrumentals. Whether you're
      a producer, sound designer, musician, or audio enthusiast, there's a place
      for your sound here.
    </h3>
    {/* Call to Action (CTA) Buttons: */}
    <div className="flex space-x-10 text-blue-light">
      <Link href="/signup">
        <button className="text-1xl data-[hover]:bg-sky-500 rounded-lg border-2 border-purple bg-purple-dark/50 px-4 py-2 font-semibold shadow-inner hover:text-pink data-[active]:bg-blue">
          Get Started
        </button>
      </Link>
      <Link href="/feed">
        <button className="text-1xl data-[hover]:bg-sky-500 rounded-lg border-2 border-purple bg-purple-dark/50 px-4 py-2 font-semibold shadow-inner hover:text-pink data-[active]:bg-blue">
          Explore Tracks
        </button>
      </Link>
    </div>
  </div>,
  // {/* Feature Highlights:x */}
  <div key="feature-highlights" className="z-50 *:z-50 text-center">
    <h2 className="mb-20 text-4xl font-semibold text-blue-light">
      Project Features
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto">
      {[
        {
          feature: "Audio Upload System",
          description: "Upload and manage your audio files with support for WAV, MP3, and other common formats.",
          icon: "🎵",
        },
        {
          feature: "Smart Search",
          description: "Find the perfect track using our advanced search with filters for genre, mood, and more.",
          icon: "🔍",
        },
        {
          feature: "Content Management",
          description: "Organize your audio files with custom tags, collections, and playlists.",
          icon: "📂",
        },
        {
          feature: "Community Features",
          description: "Connect with other creators, share your work, and collaborate on projects.",
          icon: "👥",
        },
      ].map(({ feature, description, icon }, index) => (
        <div
          key={`feature-${index}`}
          className="flex items-start p-8 bg-gradient-to-br from-purple-light/20 to-purple-dark/20 rounded-2xl backdrop-blur-sm 
                     transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple/20"
        >
          <span className="text-5xl mr-6">{icon}</span>
          <div className="text-left">
            <h3 className="text-2xl font-semibold text-blue-light mb-3">
              {feature}
            </h3>
            <p className="text-blue-dark/90 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>,
  // {/* How It Works Section: */}
  <div key="How_It_Works" className="z-50 *:z-50 text-center">
    <p className="mb-16 text-4xl font-semibold text-blue-light">
      How It Works.
    </p>
    <div className="flex flex-wrap justify-center gap-10 text-blue-dark">
      {[
        //Create account
        {
          step: "Create Account",
          description:
            "Sign up for a free account to start uploading and sharing your audio.",
          image: "/illustrations/Signup.png",
        },
        {
          step: "Upload",
          description: "Choose your audio file from your device.",
          image: "/illustrations/Upload-cuate.png",
        },
        // Browse and Listen
        {
          step: "Browse & Listen",
          description:
            "Discover and listen to audio tracks from other users.",
          image: "/illustrations/Listen.png",
        },
        {
          step: "Save & Share",
          description:
            "Save your tracks to your account and share them with the world.",
          image: "/illustrations/Share.png",
        },
      ].map(({ step, description, image }, index) => {
        return (
          <div
            key={`step-${index}`}
            className="relative flex w-64 flex-col items-center rounded-lg bg-purple-light/60 p-6 shadow-inner"
          >
            {/* Step Number Circle */}
            <div className="absolute -top-7 flex size-14 items-center justify-center rounded-full bg-purple text-white shadow-lg">
              <p className="text-4xl font-bold text-blue-light">{index + 1}</p>
            </div>

            {/* Illustration */}
            <div className="mb-4 mt-4">
              <Image
          src={image}
          alt={`${step} illustration`}
          width={180}
          height={180}
          className="object-contain"
              />
            </div>

            {/* Content */}
            <div className="text-center">
              <h3 className="mb-3 text-2xl font-semibold text-blue-light">
          {step}
              </h3>
              <p className="text-sm text-blue-dark">{description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>,
];

export default function Home() {
  // Values
  const OPTIONS = { loop: true, duration: 30 };
  const custom_settings = { autoPlay: true };
  const SLIDE_COUNT = 5;

  return (
      <div id="home" className="relative size-full text-white">
        {/* Carousel */}
        <EmblaCarousel
          slides={SLIDES}
          options={OPTIONS}
          custom_settings={custom_settings}
          className="z-10"
        />

        <div className="night absolute !z-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="!z-0 *:z-0 shooting_star"></div>
          ))}
        </div>
      </div>
  );
}
