export default function Home() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">The Shows</h1>
      <p className="opacity-80">Discover, track, and rate TV & Movies.</p>
      <nav className="flex gap-4">
        <a className="underline" href="/discovery">
          Discovery
        </a>
        <a className="underline" href="/search">
          Search
        </a>
        <a className="underline" href="/collections">
          Your Collections
        </a>
      </nav>
    </div>
  );
}
