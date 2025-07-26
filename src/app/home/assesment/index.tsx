import { SolidButton } from "@app/components/buttons";
import ProgressBar from "@app/components/progressBar";
import React from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@app/hooks";
import { setTestName } from "@app/slice/assesement.slice"

const assessmentData = [
    {
        id: "family",
        iconBg: "bg-orange-100",
        icon: (
            <svg className="text-orange-600 text-xl" width={24} height={24} aria-hidden="true" viewBox="0 0 576 512">
                <path fill="currentColor" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
            </svg>
        ),
        status: { label: "Available", class: "bg-warning text-white" },
        title: "Family Context",
        description: "Share your family background and support system.",
        progress: 0,
        progressColor: "bg-orange-500",
        button: { label: "Start Test", class: "bg-primary text-white hover:bg-primary/90", disabled: false },
    },
    {
        id: "hexaco",
        iconBg: "bg-green-100",
        icon: (
            <svg className="text-green-600 text-xl" width={24} height={24} aria-hidden="true" viewBox="0 0 640 512">
                <path fill="currentColor" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
            </svg>
        ),
        status: { label: "Available", class: "bg-success text-white" },
        title: "HEXACO Personality Test",
        description: "Discover your unique personality traits and work preferences.",
        progress: 0,
        progressColor: "bg-green-600",
        button: { label: "Start Test", class: "bg-primary text-white hover:bg-primary/90", disabled: false },
    },
    {
        id: "riasec",
        iconBg: "bg-blue-100",
        icon: (
            <svg className="text-blue-600 text-xl" width={24} height={24} aria-hidden="true" viewBox="0 0 640 512">
                <path fill="currentColor" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
            </svg>
        ),
        status: { label: "Available", class: "bg-info text-white" },
        title: "RIASEC Interest Test",
        description: "Explore your career interests and preferences.",
        progress: 0,
        progressColor: "bg-blue-600",
        button: { label: "Start Test", class: "bg-primary text-white hover:bg-primary/90", disabled: false },
    },
    {
        id: "mi",
        iconBg: "bg-purple-100",
        icon: (
            <svg className="text-purple-600 text-xl" width={24} height={24} aria-hidden="true" viewBox="0 0 640 512">
                <path fill="currentColor" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
            </svg>
        ),
        status: { label: "Available", class: "bg-purple-600 text-white" },
        title: "Multiple Intelligence Test",
        description: "Discover your learning style and intelligence types.",
        progress: 0,
        progressColor: "bg-purple-600",
        button: { label: "Start Test", class: "bg-primary text-white hover:bg-primary/90", disabled: false },
    },
    {
        id: "aptitude",
        iconBg: "bg-pink-100",
        icon: (
            <svg className="text-pink-600 text-xl" width={24} height={24} aria-hidden="true" viewBox="0 0 512 512">
                <path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 96c44.2 0 80 35.8 80 80s-35.8 80-80 80-80-35.8-80-80 35.8-80 80-80zm0 352c-52.9 0-99.9-25.8-128.7-65.7 1.1-40.7 83.6-62.9 128.7-62.9s127.6 22.2 128.7 62.9C355.9 430.2 308.9 456 256 456z" />
            </svg>
        ),
        status: { label: "Premium Only", class: "bg-pink-600 text-white" },
        title: "Aptitude Test",
        description: "Test your logical reasoning and problem-solving skills.",
        progress: 0,
        progressColor: "bg-pink-600",
        button: { label: "Start Test", class: "bg-primary text-white hover:bg-primary/90", disabled: false },
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
    const router = useRouter()
    const dispatch = useAppDispatch();
    const handleTest = async () => {
        // Dispatch an action or perform any logic needed when the button is clicked
        dispatch(setTestName(id));
        router.push(`/assessment/`);
    }
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
            {/* <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{progress === 100 ? "Completion" : "Progress"}</span>
                    <span>{progress === 100 ? "Complete" : `${progress}%`}</span>
                </div>
                <ProgressBar

                    percent={progress}
                    barClass={`${progressColor} h-2 rounded-full`}
                    labelClass="text-xs text-gray-500"
                />
            </div> */}
            <SolidButton
                onClick={() => {
                    handleTest();
                }}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${button.class}`}
                disabled={button.disabled}
            >
                {button.label}
            </SolidButton>
        </div>
    );
}

export default function AssessmentHub({ elligibility, assesement, subscription }: any) {
    let mappedData = assessmentData.map((card) => {
        const isCompleted = assesement?.find((a: any) => a.type === card.id);
        const canTake = elligibility?.[card.id]?.canTake;
        
        // Check if aptitude test is available based on subscription
        const isAptitudeAvailable = card.id === "aptitude" ? 
            (subscription?.tier === "paid") : true;
        
        return {
            ...card,
            status: {
                label: isCompleted ? "Completed" : 
                       !canTake ? "Not Available" :
                       !isAptitudeAvailable ? "Premium Only" : "Available",
                class: isCompleted ? "bg-success text-white" : 
                       !canTake ? "bg-gray-300 text-gray-700" :
                       !isAptitudeAvailable ? "bg-pink-600 text-white" : "bg-success text-white",
            },
            opacity: (!canTake || !isAptitudeAvailable) ? "opacity-50 cursor-not-allowed" : "",
            button: {
                ...card.button,
                label: isCompleted ? "Completed" : 
                       !canTake ? "Not Available" :
                       !isAptitudeAvailable ? "Upgrade Required" : card.button.label,
                disabled: !canTake || !isAptitudeAvailable,
            },
        }
    })
    return (
        <section id="assessment-hub" className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Assessment Hub</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mappedData.map(card => (
                    <AssessmentCard key={card.id} {...card} />
                ))}
            </div>
        </section>
    );
}