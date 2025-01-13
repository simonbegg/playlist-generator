export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          AI Playlist Generator
        </h1>
        <p className="text-center text-xl mb-8">
          Generate personalized playlists using AI and Tidal
        </p>
        {/* TODO: Add playlist generation form */}
      </div>
    </main>
  );
}
