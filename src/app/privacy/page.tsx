export default function Privacy() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="mb-4">
          This Privacy Policy describes how Playlist Generator (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) 
          collects, uses, and protects your information when you use our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            Tidal account information necessary for playlist creation and management
          </li>
          <li className="mb-2">
            Your music preferences and playlist data
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">
            To create and manage playlists on your behalf
          </li>
          <li className="mb-2">
            To improve our playlist generation algorithms
          </li>
          <li className="mb-2">
            To provide customer support
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Protection</h2>
        <p className="mb-4">
          We implement appropriate technical and organizational measures to protect your personal data 
          against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
          support@playlistgenerator.com
        </p>
      </section>

      <footer className="text-sm text-gray-600">
        Last updated: January 13, 2025
      </footer>
    </main>
  );
}
