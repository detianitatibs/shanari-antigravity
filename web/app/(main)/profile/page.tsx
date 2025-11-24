import Image from 'next/image';

export default function ProfilePage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <div className="mx-auto h-32 w-32 relative rounded-full overflow-hidden bg-zinc-200">
                    <Image
                        src="/itatibs.JPEG"
                        alt="Profile"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                <h1 className="text-3xl font-bold text-zinc-900">けい@どらぴあ</h1>
                <p className="text-zinc-600">System Engineer / ポケモンダブルバトルやるおじさん</p>
            </div>

            {/* Bio Section */}
            <div className="mx-auto max-w-2xl space-y-6">
                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-3">About Me</h2>
                    <p className="text-zinc-600 leading-relaxed">
                        ポケモンゲームのダブルバトルをよくやります。
                    </p>
                    <p className="text-zinc-600 leading-relaxed">
                        ITに関するお仕事をやりながら、1歳児の子育てもやってます。
                    </p>

                </section>

                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-3">Attributes</h2>
                    <div className="flex flex-wrap gap-2">
                        {['ポケモンSV', 'ダブルバトル', '子育て', 'Python', 'Solution Architect', 'AI'].map((skill) => (
                            <span
                                key={skill}
                                className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-3">Contact</h2>
                    <p className="text-zinc-600">
                        X: <a href="https://x.com/itatibs" target="_blank" className="text-indigo-600 hover:underline">itatibs</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
