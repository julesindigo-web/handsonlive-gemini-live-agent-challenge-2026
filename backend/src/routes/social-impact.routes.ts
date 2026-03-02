import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    // TODO: Get Firestore instance from app
    // const db = req.app.get('db');
    // const metrics = await getSocialImpactMetrics(db);

    // For now, return mock data
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

    res.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching social impact metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics',
    });
  }
});

export default router;
