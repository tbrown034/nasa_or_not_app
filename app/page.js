import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-5xl font-bold">NASA or Not?</h1>
      <p className="text-xl ">
        Can you spot the difference between the real and AI-generated images?
        Challenge yourself with this cosmic guessing game.
      </p>
      <div className="flex gap-4">
        <Link
          className="p-2 border-2 rounded-xl hover:bg-white hover:text-blue-800 active:bg-blue-800 active:text-white"
          href="/apod"
        >
          APOD
        </Link>
        <Link
          className="p-2 border-2 rounded-xl hover:bg-white hover:text-blue-800 active:bg-blue-800 active:text-white"
          href="/random"
        >
          Random
        </Link>
        <Link
          className="p-2 border-2 rounded-xl hover:bg-white hover:text-blue-800 active:bg-blue-800 active:text-white"
          href="/apodvsai"
        >
          APOD vs. AI
        </Link>
      </div>
    </main>
  );
}
