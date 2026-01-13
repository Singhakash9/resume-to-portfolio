export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">
        Resume → Portfolio Generator
      </h1>

      <p className="mb-6 text-gray-600">
        Upload your resume and generate a professional portfolio website
      </p>

      <a
        href="/editor/"
        className="bg-black text-white px-6 py-3 rounded"
      >
        Get Started
      </a>
    </main>
  );
}
