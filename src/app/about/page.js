import React from 'react'

import {
    StaticPageButton,
    StaticPageCard,
    StaticPageShell,
} from '../components/StaticPage'

const platformFeatures = [
    {
        title: 'Stream tracks',
        description:
            'Listen to uploaded audio tracks through a simple web player.',
    },
    {
        title: 'Save favorites',
        description:
            'Keep tracks you like in your own library so they are easier to find later.',
    },
    {
        title: 'Share music',
        description:
            'Share tracks with other users and explore what people are listening to.',
    },
]

export default function AboutPage() {
    return (
        <StaticPageShell title="About TrackFusionWeb">
            <div className="mb-8 space-y-5 text-sm leading-6 sm:text-base">
                <p>
                    TrackFusionWeb is a music streaming portfolio project I built
                    to practice building a real full stack app. Users can
                    upload, play, save, and share audio tracks in one place.
                </p>

                <StaticPageCard
                    title="What the app does"
                    titleClassName="text-2xl text-primary"
                >
                    <div className="space-y-4">
                        {platformFeatures.map(({ title, description }) => (
                            <div key={title}>
                                <h3 className="mb-1 text-base font-semibold text-primary sm:text-lg">
                                    {' '}
                                    {title}
                                </h3>

                                <p>{description}</p>
                            </div>
                        ))}
                    </div>
                </StaticPageCard>

                <section className="mt-8">
                    <h2 className="mb-3 text-2xl font-semibold text-primary">
                        {' '}
                    </h2>

                    <p>
                        The project is built with Next.js, React, Tailwind CSS,
                        and an Express API. It includes authentication, audio
                        uploads, API requests, responsive layouts, and custom
                        playback features.
                    </p>
                </section>
            </div>

            <div className="flex flex-wrap gap-6">
                <StaticPageButton href="/contact">
                    Contact Developer
                </StaticPageButton>

                <StaticPageButton href="/feed">
                    Explore Platform
                </StaticPageButton>
            </div>
        </StaticPageShell>
    )
}
