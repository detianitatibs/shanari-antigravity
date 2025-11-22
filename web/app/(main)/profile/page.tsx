import { Icon } from '../../../components/atoms/Icon';

export default function ProfilePage() {
    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <div className="mx-auto h-32 w-32 rounded-full bg-zinc-200 flex items-center justify-center">
                    <Icon name="user" className="h-16 w-16 text-zinc-400" />
                </div>
                <h1 className="text-3xl font-bold text-zinc-900">Keisuke Tokuda</h1>
                <p className="text-zinc-600">Software Engineer / Web Developer</p>
            </div>

            {/* Bio Section */}
            <div className="mx-auto max-w-2xl space-y-6">
                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-3">About Me</h2>
                    <p className="text-zinc-600 leading-relaxed">
                        Hello! I&apos;m a software engineer based in Japan. I enjoy building web applications
                        and exploring new technologies. This website is my personal space to share
                        my thoughts and projects.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-zinc-900 mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {['TypeScript', 'React', 'Next.js', 'Node.js', 'Python', 'Docker', 'GCP'].map((skill) => (
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
                        You can reach me via email at <a href="mailto:example@example.com" className="text-indigo-600 hover:underline">example@example.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
