
type CardData = {
    id: string;
    bgColor: string;
    icon: React.ReactNode;
    title: string;
    description: string;
};

const cards: CardData[] = [
    {
        id: "step-1",
        bgColor: "bg-primary",
        icon: (
            <svg className="text-white text-2xl" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="clipboard" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={32} height={32}>
                <path fill="currentColor" d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"></path>
            </svg>
        ),
        title: "Take Assessments",
        description: "Complete personality and skill assessments to understand your strengths and interests.",
    },
    {
        id: "step-2",
        bgColor: "bg-accent",
        icon: (
            <svg className="text-white text-2xl" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="lightbulb" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width={32} height={32}>
                <path fill="currentColor" d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2l0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63 31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2 14.3 15.4 21.4l0 0c19.8 27.1 39.7 54.4 49.2 86.2H272zM192 512c44.2 0 80-35.8 80-80V416H112v16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9 50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"></path>
            </svg>
        ),
        title: "Get Recommendations",
        description: "Receive AI-powered career suggestions tailored to your unique profile and preferences.",
    },
    {
        id: "step-3",
        bgColor: "bg-green-500",
        icon: (
            <svg className="text-white text-2xl" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-location-dot" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={32} height={32}>
                <path fill="currentColor" d="M408 120c0 54.6-73.1 151.9-105.2 192c-7.7 9.6-22 9.6-29.6 0C241.1 271.9 168 174.6 168 120C168 53.7 221.7 0 288 0s120 53.7 120 120zm8 80.4c3.5-6.9 6.7-13.8 9.6-20.6c.5-1.2 1-2.5 1.5-3.7l116-46.4C558.9 123.4 576 135 576 152V422.8c0 9.8-6 18.6-15.1 22.3L416 503V200.4zM137.6 138.3c2.4 14.1 7.2 28.3 12.8 41.5c2.9 6.8 6.1 13.7 9.6 20.6V451.8L32.9 502.7C17.1 509 0 497.4 0 480.4V209.6c0-9.8 6-18.6 15.1-22.3l122.6-49zM327.8 332c13.9-17.4 35.7-45.7 56.2-77V504.3L192 449.4V255c20.5 31.3 42.3 59.6 56.2 77c20.5 25.6 59.1 25.6 79.6 0zM288 152a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"></path>
            </svg>
        ),
        title: "Plan Your Journey",
        description: "Create a personalized roadmap with actionable steps to achieve your career goals.",
    },
];

function Card({ id, bgColor, icon, title, description }: CardData) {
    return (
        <div id={id} className="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
            <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                {icon}
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
    );
}

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-xl text-gray-600">Simple steps to discover your perfect career path</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {cards.map(card => (
                        <Card key={card.id} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
}
