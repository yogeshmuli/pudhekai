import React from "react";

type Testimonial = {
  id: string,
  avatar: string,
  name: string,
  role: string,
  quote: string,
};

const testimonials: Testimonial[] = [
  {
    id: "testimonial-1",
    avatar:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
    name: "Priya S.",
    role: "Class 12 Student",
    quote: `"PudheKai helped me discover my passion for data science. The AI recommendations were spot-on!"`,
  },
  {
    id: "testimonial-2",
    avatar:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg",
    name: "Arjun K.",
    role: "Engineering Student",
    quote: `"Finally found clarity about my career. The assessment was comprehensive and insightful."`,
  },
  {
    id: "testimonial-3",
    avatar:
      "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-5.jpg",
    name: "Mrs. Sharma",
    role: "Parent",
    quote: `"As a parent, I'm impressed by how well this platform guided my daughter's career decisions."`,
  },
];

function TestimonialCard({ id, avatar, name, role, quote }: Testimonial) {
  return (
    <div id={id} className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex items-center mb-4">
        <img src={avatar} alt={name} className="w-12 h-12 rounded-full mr-4" />
        <div>
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic">{quote}</p>
    </div>
  );
}

export default function TestimonialSection() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Students Say
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from students who found their path
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
