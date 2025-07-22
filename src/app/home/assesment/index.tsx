import { SolidButton } from "@app/components/buttons";
import ProgressBar from "@app/components/progressBar";
import React from "react";

const assessmentData = [
    {
        id: "personality-test-card",
        iconBg: "bg-green-100",
        icon: (
            <svg className="text-green-600 text-xl" width={24} height={24} aria-hidden="true" viewBox="0 0 640 512">
                <path fill="currentColor" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z"></path>
            </svg>
        ),
        status: { label: "In Progress", class: "bg-success text-white" },
        title: "Personality Test",
        description: "Discover your unique personality traits and work preferences",
        progress: 60,
        progressColor: "bg-green-600",
        button: { label: "Resume Test", class: "bg-success text-white hover:bg-green-600", disabled: false },
    },
    {
        id: "interest-test-card",
        iconBg: "bg-blue-100",
        icon: (
            <svg className="text-blue-600 text-xl" width={24} height={24} aria-hidden="true" viewBox="0 0 512 512">
                <path fill="currentColor" d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path>
            </svg>
        ),
        status: {
            label: (
                <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <svg className="mr-1" width={14} height={14} aria-hidden="true" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"></path>
                    </svg>
                    Locked
                </span>
            ),
            class: "",
        },
        title: "Interest Test",
        description: "Explore your interests and passion areas",
        progress: 0,
        progressColor: "bg-blue-600",
        button: { label: "Complete Personality Test First", class: "bg-gray-300 text-gray-500 cursor-not-allowed", disabled: true },
        opacity: "opacity-60",
    },
    {
        id: "intelligence-test-card",
        iconBg: "bg-purple-100",
        icon: (
            <svg className="text-purple-600 text-xl" width={24} height={24} aria-hidden="true" viewBox="0 0 512 512">
                <path fill="currentColor" d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56z"></path>
            </svg>
        ),
        status: {
            label: (
                <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <svg className="mr-1" width={14} height={14} aria-hidden="true" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"></path>
                    </svg>
                    Locked
                </span>
            ),
            class: "",
        },
        title: "Intelligence Test",
        description: "Assess your cognitive abilities and problem-solving skills",
        progress: 0,
        progressColor: "bg-gray-300",
        button: { label: "Complete Previous Tests First", class: "bg-gray-300 text-gray-500 cursor-not-allowed", disabled: true },
        opacity: "opacity-60",
    },
    {
        id: "family-context-card",
        iconBg: "bg-orange-100",
        icon: (
            <svg className="text-orange-600 text-xl" width={24} height={24} aria-hidden="true" viewBox="0 0 576 512">
                <path fill="currentColor" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"></path>
            </svg>
        ),
        status: { label: "Review Needed", class: "bg-warning text-white" },
        title: "Family Context",
        description: "Share your family background and support system",
        progress: 100,
        progressColor: "bg-orange-500",
        button: { label: "Review & Edit", class: "bg-warning text-white hover:bg-yellow-600", disabled: false },
    },
];

function AssessmentCard({
    id,
    iconBg,
    icon,
    status,
    title,
    description,
    progress,
    progressColor,
    button,
    opacity,
}: any) {
    return (
        <div
            id={id}
            className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${opacity || ""}`}
            style={{ transform: "translateY(0px)" }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`${iconBg} rounded-xl p-3`}>{icon}</div>
                {typeof status.label === "string" ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>{status.label}</span>
                ) : (
                    status.label
                )}
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
            <p className="text-gray-600 text-sm mb-4">{description}</p>
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{progress === 100 ? "Completion" : "Progress"}</span>
                    <span>{progress === 100 ? "Complete" : `${progress}%`}</span>
                </div>
                <ProgressBar

                    percent={progress}
                    barClass={`${progressColor} h-2 rounded-full`}
                    labelClass="text-xs text-gray-500"
                />
            </div>
            <SolidButton
                className={`w-full py-3 rounded-xl font-medium transition-colors ${button.class}`}
                disabled={button.disabled}
            >
                {button.label}
            </SolidButton>
        </div>
    );
}

export default function AssessmentHub() {
    return (
        <section id="assessment-hub" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Assessment Hub</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {assessmentData.map(card => (
                    <AssessmentCard key={card.id} {...card} />
                ))}
            </div>
        </section>
    );
}