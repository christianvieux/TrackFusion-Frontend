export default function VideoBackground() {
    return (
        <>
            <video
                className="fixed inset-0 -z-20 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
            >
                <source src="/videos/Background.mp4" type="video/mp4" />
            </video>

            <div className="fixed inset-0 -z-10 bg-secondary/60" />
        </>
    )
}