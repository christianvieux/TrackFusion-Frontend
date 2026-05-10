"use client";

import Link from "next/link";
import Image from "next/image";
import EmblaCarousel from "../carousel/EmblaCarousel.jsx";

/* -------------------- */
/* CONFIG */
/* -------------------- */

const carouselOptions = { loop: true, duration: 30 };
const carouselSettings = { autoPlay: true };

const buttonClass =
  "rounded-lg border border-accent bg-transparent px-5 py-2 font-semibold text-primary transition hover:bg-accent hover:text-accent-foreground";

const cardClass =
  "rounded-2xl bg-secondary p-8 shadow-card transition hover:scale-[1.02] hover:bg-secondary-hover";

/* -------------------- */
/* DATA */
/* -------------------- */

const features = [
  {
    title: "Audio Upload System",
    description:
      "Upload and manage your audio files with support for WAV, MP3, and other formats.",
    icon: "🎵",
  },
  {
    title: "Smart Search",
    description:
      "Find tracks using filters like genre, mood, and more.",
    icon: "🔍",
  },
  {
    title: "Content Management",
    description:
      "Organize audio with tags, collections, and playlists.",
    icon: "📂",
  },
  {
    title: "Community Features",
    description:
      "Connect, share, and collaborate with other creators.",
    icon: "👥",
  },
];

const steps = [
  {
    title: "Create Account",
    description: "Sign up and get started instantly.",
    image: "/illustrations/Signup.png",
  },
  {
    title: "Upload",
    description: "Upload your audio files.",
    image: "/illustrations/Upload-cuate.png",
  },
  {
    title: "Browse & Listen",
    description: "Explore tracks from others.",
    image: "/illustrations/Listen.png",
  },
  {
    title: "Save & Share",
    description: "Save and share your favorites.",
    image: "/illustrations/Share.png",
  },
];

/* -------------------- */
/* SLIDES */
/* -------------------- */

const slides = [
  <section key="hero" className="z-50 flex flex-col gap-5 p-4">
    <h1 className="max-w-4xl pb-5 text-5xl font-semibold text-primary">
      Discover and Share Your Soundtrack
    </h1>

    <h2 className="pb-5 text-3xl text-foreground">
      <span className="text-accent">Upload</span>,{" "}
      <span className="text-accent">Explore</span>,{" "}
      <span className="text-accent">Enjoy</span>
    </h2>

    <p className="max-w-2xl pb-5 text-lg text-muted-foreground">
      TrackFusion is your creative audio hub. Share music, vocals,
      sound effects, and more.
    </p>

    <div className="flex flex-wrap gap-5">
      <Link href="/signup" className={buttonClass}>
        Get Started
      </Link>

      <Link href="/feed" className={buttonClass}>
        Explore Tracks
      </Link>
    </div>
  </section>,

  <section key="features" className="z-50 text-center">
    <h2 className="mb-20 text-4xl font-semibold text-primary">
      Features
    </h2>

    <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
      {features.map(({ title, description, icon }) => (
        <article key={title} className={`flex items-start ${cardClass}`}>
          <span className="mr-6 text-5xl">{icon}</span>

          <div className="text-left">
            <h3 className="mb-3 text-2xl font-semibold text-accent">
              {title}
            </h3>

            <p className="text-muted-foreground">
              {description}
            </p>
          </div>
        </article>
      ))}
    </div>
  </section>,

  <section key="how-it-works" className="z-50 text-center">
    <h2 className="mb-16 text-4xl font-semibold text-primary">
      How It Works
    </h2>

    <div className="flex flex-wrap justify-center gap-10">
      {steps.map(({ title, description, image }, index) => (
        <article
          key={title}
          className="relative flex w-64 flex-col items-center rounded-2xl bg-secondary p-6 shadow-card transition hover:bg-secondary-hover"
        >
          <div className="absolute -top-7 flex size-14 items-center justify-center rounded-full bg-primary shadow-lg">
            <span className="text-3xl font-bold text-background">
              {index + 1}
            </span>
          </div>

          <Image
            src={image}
            alt={title}
            width={180}
            height={180}
            className="mb-4 mt-4 object-contain"
          />

          <h3 className="mb-3 text-2xl font-semibold text-accent">
            {title}
          </h3>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </article>
      ))}
    </div>
  </section>,
];

/* -------------------- */
/* PAGE */
/* -------------------- */

export default function Home() {
  return (
    <main className="relative overflow-x-hidden text-foreground">
      <EmblaCarousel
        slides={slides}
        options={carouselOptions}
        custom_settings={carouselSettings}
        className="!z-20 overflow-auto"
      />

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="night absolute inset-x-0 -top-[450px] sm:-top-[300px] md:-top-[500px] lg:-top-[100px]"
          style={{ minHeight: "100%" }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="shooting_star" />
          ))}
        </div>
      </div>
    </main>
  );
}