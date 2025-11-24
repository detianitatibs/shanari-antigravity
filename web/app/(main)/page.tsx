import { Button } from '../../components/atoms/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
          Welcome to Shanari
        </h1>
        <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
          しゃなりとしたパーソナルウェブサイトです。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-4xl">
        {/* Profile Tile */}
        <div className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="text-lg font-semibold text-zinc-900">Profile</h3>
          <p className="mt-2 text-zinc-500">
            自己紹介
          </p>
          <div className="mt-4">
            <Link href="/profile">
              <Button variant="secondary" size="sm">
                View Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Blog Tile */}
        <div className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="text-lg font-semibold text-zinc-900">Blog</h3>
          <p className="mt-2 text-zinc-500">
            日記、構築記事、技術記事など
          </p>
          <div className="mt-4">
            <Link href="/blog">
              <Button variant="secondary" size="sm">
                Read Blog
              </Button>
            </Link>
          </div>
        </div>

        {/* Portfolio/Works Tile (Placeholder) */}
        {/*
        <div className="group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <h3 className="text-lg font-semibold text-zinc-900">Works</h3>
          <p className="mt-2 text-zinc-500">
            Check out my projects and contributions.
          </p>
          <div className="mt-4">
            <Button variant="secondary" size="sm" disabled>
              Coming Soon
            </Button>
          </div>
        </div>
        */}
      </div>
    </div>
  );
}
