import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for social impact metrics
    const metrics = {
      totalUsers: 12450,
      skillsLearned: 45230,
      completionRate: 87,
      impactScore: 9.2,
      skillCompletion: {
        cooking: 92,
        motorRepair: 85,
        hydroponics: 78,
        crafts: 75,
      },
      demographics: {
        vocationalStudents: 45,
        smeOwners: 30,
        remoteWorkers: 15,
        homeLearners: 10,
      },
      impactMetrics: {
        dropoutReduction: 70,
        potentialUsers: 2500000,
        satisfactionRate: 85,
      },
    };

    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching social impact metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
