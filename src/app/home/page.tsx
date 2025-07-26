// placeholder home page component
"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import DashboardHeader from "@app/components/header/dashboardheader";
import ProgressBar from "@app/components/progressBar";
import AssessmentHub from "./assesment";
import { SolidButton } from "@app/components/buttons";
import { fetchProfile } from "@app/thunk/profile.thunk"
import { useAppDispatch } from "@app/hooks";
import { useRouter } from "next/navigation";

type UserProfile = {
    user?: {
        firstName: string;
        lastName: string;
        email: string;
        dateOfBirth: string;
        currentGrade: string;
    };
    assessments?: {
        hexaco?: any;
        riasec?: any;
        multipleIntelligence?: any;
        aptitude?: any;
    };
    eligibility?: {
        hexaco: {
            canTake: boolean;
        },
        riasec: {
            canTake: boolean;
        },
        multipleIntelligence: {
            canTake: boolean;
        },
        aptitude: {
            canTake: boolean;
        },
        family: {
            canTake: boolean;
        }
    }
};

type Subscription = {
    id: string;
    tier: 'free' | 'paid';
    status: 'active' | 'pending' | 'expired';
    createdAt: any;
    expiresAt: any;
};

export default function Home() {
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [checkingSubscription, setCheckingSubscription] = useState(true);
    const dispatch = useAppDispatch();
    const router = useRouter();

    useEffect(() => {
        checkSubscriptionAndRedirect();
    }, []);

    const checkSubscriptionAndRedirect = async () => {
        try {
            setCheckingSubscription(true);
            const response = await fetch('/api/subscription/current');
            
            if (response.ok) {
                // User has subscription, fetch profile and show dashboard
                const subData = await response.json();
                setSubscription(subData.subscription);
                await fetchUserProfile();
            } else {
                // No subscription, redirect to tier selection
                router.push('/tier-selection');
                return;
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
            router.push('/tier-selection');
            return;
        } finally {
            setCheckingSubscription(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            // Assuming you have a way to get the user's UID
            setLoading(true);
            let response = await dispatch(fetchProfile()).unwrap();
            if (response) {
                console.log("Profile fetched successfully:", response);
                setProfile(response);
            }
            setLoading(false);

        } catch (error) {
            setLoading(false);
            console.error("Failed to fetch profile:", error);
            router.push("/login");
        }
    };

    const progressPercent = 50; // Change this value to update progress
    
    const handleGetAIRecommendations = async () => {
        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: subscription?.id
                }),
            });

            if (response.ok) {
                // Redirect to report page with subscription ID
                router.push(`/report?subscription=${subscription?.id}`);
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'Failed to generate recommendations');
            }
        } catch (error) {
            console.error('Error getting AI recommendations:', error);
            alert('Failed to generate recommendations. Please try again.');
        }
    };
    
    if (checkingSubscription || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">{checkingSubscription ? 'Checking subscription...' : 'Loading profile...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <DashboardHeader />
            <main id="main-content" className="p-8">
                <section id="welcome-section" className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {profile?.user?.firstName}</h2>
                    <p className="text-gray-600 text-lg font-bold">Your Career Assessment Dashboard</p>
                </section>
                {/* Progress */}
                <section id="journey-progress" className="mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">Your Assessment Progress</h3>
                            {/* <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                {progressPercent}% Complete
                            </span> */}
                        </div>
                        <ProgressBar percent={progressPercent} />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Getting Started</span>
                            <span>Career Discovery</span>
                            <span>Path Planning</span>
                            <span>Goal Achievement</span>
                        </div>

                    </div>
                </section>
                {/* Assesment Hub */}
                <AssessmentHub elligibility={profile?.eligibility} assesment={profile?.assessments} subscription={subscription} />
                
                {/* AI Recommendations Section */}
                {profile?.assessments && Object.keys(profile.assessments).length >= 4 && (
                  <section id="ai-recommendations" className="mb-8">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 rounded-xl p-3">
                            <svg className="text-green-600 text-xl" width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">All Assessments Complete!</h4>
                            <p className="text-gray-600 text-sm">Generate AI-powered career recommendations</p>
                          </div>
                        </div>
                        <button
                          onClick={handleGetAIRecommendations}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl"
                        >
                          🤖 Get AI Recommendations
                        </button>
                      </div>
                    </div>
                  </section>
                )}
                
                {/* faq */}
                <section id="help-section" className="mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 rounded-xl p-3 ">
                                    <i className="text-blue-600 text-xl " data-fa-i2svg=""><svg height={30} className="svg-inline--fa fa-circle-question" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-question" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37-3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"></path></svg></i>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-800">Need Help?</h4>
                                    <p className="text-gray-600 text-sm">Get answers to frequently asked questions</p>
                                </div>
                            </div>
                            <SolidButton
                                href="/faq"
                                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                            >
                                View FAQs
                            </SolidButton>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}