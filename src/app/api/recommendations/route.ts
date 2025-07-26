import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@app/utils/getUserFromRequest';

export async function POST(request: NextRequest) {
    try {
        const userUid = await getUserFromRequest(request);
        if (!userUid) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { subscriptionId } = await request.json();

        // Check if all required assessments are completed
        const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {
            headers: {
                'Cookie': request.headers.get('cookie') || ''
            }
        });

        if (!profileResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
        }

        const profileData = await profileResponse.json();
        const assessments = profileData.assessments || {};

        // Check if all required assessments are completed
        const requiredTests = ['family', 'hexaco', 'riasec', 'mi'];
        const completedTests = requiredTests.filter(test => assessments[test]);

        if (completedTests.length < requiredTests.length) {
            return NextResponse.json({ 
                error: 'Please complete all required assessments before generating recommendations',
                missingTests: requiredTests.filter(test => !assessments[test])
            }, { status: 400 });
        }

        // Generate AI recommendations
        const recommendationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendations/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': request.headers.get('cookie') || ''
            },
            body: JSON.stringify({
                subscriptionId,
                assessments: completedTests
            })
        });

        if (!recommendationsResponse.ok) {
            return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
        }

        const recommendationsData = await recommendationsResponse.json();

        return NextResponse.json({
            success: true,
            recommendations: recommendationsData.recommendations
        });

    } catch (error) {
        console.error('Error generating recommendations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
