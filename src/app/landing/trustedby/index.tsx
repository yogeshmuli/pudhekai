import React from "react";

const partners = [
    "IIT Delhi",
    "BITS Pilani",
    "DU",
    "VIT",
];

export default function TrustedBySection() {
    return (
        <section id="partners" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted By</h2>
                    <p className="text-gray-600">Leading educational institutions and organizations</p>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
                    {partners.map((partner, idx) => (
                        <div
                            key={partner}
                            className="bg-gray-200 px-8 py-4 rounded-lg font-semibold text-gray-700"
                        >
                            {partner}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}