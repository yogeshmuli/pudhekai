import request from 'supertest';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
const serviceAccount = require('../../src/keys/serviceAccountKey.json');

const BASE_URL = 'http://localhost:3000';
const TEST_EMAIL = `testuser${Date.now()}@example.com`;
const TEST_PASSWORD = 'Test@1234';
const TEST_FIRSTNAME = 'Test';
const TEST_LASTNAME = 'User';

let uid = '';
let authToken = '';

// Initialize Firebase Admin for cleanup
if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}
const adminDb = getFirestore();
const adminAuth = getAuth();

describe('Full User Flow Integration Test', () => {
  // Increase timeout for this test suite
  jest.setTimeout(60000); // 60 seconds
  
  afterAll(async () => {
    if (uid) {
      console.log('\n🧹 CLEANUP PHASE');
      console.log('='.repeat(50));
      console.log(`📋 Test User UID: ${uid}`);
      console.log(`📧 Test User Email: ${TEST_EMAIL}`);
      console.log(`🔗 Firebase Console URL: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore/data/users/${uid}`);
      console.log('\n📊 Data Summary:');
      
      try {
        const userRef = adminDb.collection('users').doc(uid);
        const userDoc = await userRef.get();
        
        if (userDoc.exists) {
          const userData = userDoc.data();
          console.log(`👤 User Data: ${JSON.stringify(userData, null, 2)}`);
        }
        
        // Check assessments
        const assessments = await userRef.collection('assessments').listDocuments();
        console.log(`📝 Assessments Found: ${assessments.length}`);
        for (const doc of assessments) {
          const data = await doc.get();
          console.log(`  - ${doc.id} (${data.data()?.type || 'unknown'}): ${JSON.stringify(data.data(), null, 2)}`);
        }
        
        // Check recommendations
        const recos = await userRef.collection('recommendations').listDocuments();
        console.log(`💡 Recommendations Found: ${recos.length}`);
        for (const doc of recos) {
          const data = await doc.get();
          console.log(`  - ${doc.id}: ${JSON.stringify(data.data(), null, 2)}`);
        }
        
        // Check subscriptions
        const subscriptions = await adminDb.collection('subscriptions').where('userId', '==', uid).get();
        console.log(`🔑 Subscriptions Found: ${subscriptions.size}`);
        for (const doc of subscriptions.docs) {
          const data = doc.data();
          console.log(`  - ${doc.id}: ${JSON.stringify(data, null, 2)}`);
        }
        
        console.log('\n⚠️  DATA CLEANUP');
        console.log('='.repeat(50));
        
        // Check if we should skip the wait (for CI/CD or fast testing)
        const skipWait = process.env.SKIP_CLEANUP_WAIT === 'true';
        
        if (skipWait) {
          console.log('⏭️  Skipping wait (SKIP_CLEANUP_WAIT=true)');
        } else {
          console.log('The test data will be deleted in 10 seconds...');
          console.log('You can inspect the data in Firebase Console before it gets deleted.');
          console.log('To keep the data for inspection, press Ctrl+C to stop the test.');
          console.log('To skip wait, set SKIP_CLEANUP_WAIT=true');
          
          // Wait 10 seconds for manual inspection (reduced from 30)
          await new Promise(resolve => setTimeout(resolve, 10000));
        }
        
        // Cleanup
        console.log('\n🗑️  Starting cleanup...');
        for (const doc of assessments) {
          await doc.delete();
          console.log(`  ✅ Deleted assessment: ${doc.id}`);
        }
        for (const doc of recos) {
          await doc.delete();
          console.log(`  ✅ Deleted recommendation: ${doc.id}`);
        }
        
        // Cleanup subscriptions
        for (const doc of subscriptions.docs) {
          await doc.ref.delete();
          console.log(`  ✅ Deleted subscription: ${doc.id}`);
        }
        
        await userRef.delete();
        console.log(`  ✅ Deleted user: ${uid}`);
        console.log('✅ Cleanup completed successfully!');
        
      } catch (error) {
        console.error('❌ Error during cleanup:', error);
      }
    }
  });

  it('should register a new user', async () => {
    uid = `testuid${Date.now()}`;
    const res = await request(BASE_URL)
      .post('/api/register')
      .send({
        uid: uid,
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        firstName: TEST_FIRSTNAME,
        lastName: TEST_LASTNAME,
        dateOfBirth: '2000-01-01',
        currentGrade: 'grade-12',
        terms: true,
      });
    console.log('Registration status:', res.status);
    console.log('Registration response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should create Firebase Auth user and get ID token', async () => {
    // Create a Firebase Auth user
    const userRecord = await adminAuth.createUser({
      uid: uid,
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      displayName: `${TEST_FIRSTNAME} ${TEST_LASTNAME}`,
    });
    
    // For testing purposes, use the UID as the auth token
    // This will be handled by the modified getUserFromRequest function
    authToken = uid;
    
    console.log('Created Firebase Auth user:', userRecord.uid);
    console.log('Using UID as auth token for testing');
  });

  it('should create a free subscription for testing', async () => {
    const res = await request(BASE_URL)
      .post('/api/subscription/create')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        tier: 'free',
        paymentDetails: null
      });
    
    console.log('Subscription creation status:', res.status);
    console.log('Subscription creation response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.subscription).toBeDefined();
    expect(res.body.subscription.tier).toBe('free');
    expect(res.body.subscription.status).toBe('active');
    expect(res.body.subscription.subscriptionKey).toBeDefined();
    
    console.log('✅ Free subscription created successfully');
    console.log(`📋 Subscription Key: ${res.body.subscription.subscriptionKey}`);
  });

  it('should complete HEXACO assessment', async () => {
    // Create realistic responses using actual Firebase question IDs (1-5 scale)
    const responses: { [key: string]: number } = {};
    const hexacoIds = ['a1', 'a10', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'c1', 'c10', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'e1', 'e10', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'h1', 'h10', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'o1', 'o10', 'o2', 'o3', 'o4', 'o5', 'o6', 'o7', 'o8', 'o9', 'x1', 'x10', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9'];
    
    // Use first 24 questions (4 per trait for free assessment)
    const selectedIds = hexacoIds.slice(0, 24);
    for (const questionId of selectedIds) {
      responses[questionId] = Math.floor(Math.random() * 5) + 1; // Random 1-5
    }
    
    const res = await request(BASE_URL)
      .post('/api/hexaco')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        assessmentType: 'free',
        subscriptionId: null // Will use active free subscription
      });
    console.log('HEXACO status:', res.status);
    console.log('HEXACO response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.traitScores).toBeDefined();
  });

  it('should complete RIASEC assessment', async () => {
    // Create realistic responses using actual Firebase question IDs (1-5 scale)
    const responses: { [key: string]: number } = {};
    const riasecIds = ['a1', 'a2', 'a3', 'a4', 'a5', 'c1', 'c2', 'c3', 'c4', 'c5', 'e1', 'e2', 'e3', 'e4', 'e5', 'i1', 'i2', 'i3', 'i4', 'i5', 'r1', 'r2', 'r3', 'r4', 'r5', 's1', 's2', 's3', 's4', 's5'];
    
    // Use first 12 questions (2 per category for free assessment)
    const selectedIds = riasecIds.slice(0, 12);
    for (const questionId of selectedIds) {
      responses[questionId] = Math.floor(Math.random() * 5) + 1; // Random 1-5
    }
    
    const res = await request(BASE_URL)
      .post('/api/riasec')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        assessmentType: 'free',
        subscriptionId: null // Will use active free subscription
      });
    console.log('RIASEC status:', res.status);
    console.log('RIASEC response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.categoryScores).toBeDefined();
  });

  it('should complete MI assessment', async () => {
    // Create realistic responses using actual Firebase question IDs (1-5 scale)
    const responses: { [key: string]: number } = {};
    const miIds = ['mi1', 'mi2', 'mi3', 'mi4', 'mi5', 'mi6', 'mi7', 'mi8'];
    
    // Use all 8 MI questions
    for (const questionId of miIds) {
      responses[questionId] = Math.floor(Math.random() * 5) + 1; // Random 1-5
    }
    
    const res = await request(BASE_URL)
      .post('/api/mi')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        assessmentType: 'free',
        subscriptionId: null // Will use active free subscription
      });
    console.log('MI status:', res.status);
    console.log('MI response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.miScores).toBeDefined();
  });

  it('should complete Family assessment', async () => {
    // Create realistic string responses for family context
    const responses: { [key: string]: string } = {
      fc1: "Middle Income",
      fc2: "City / Urban area", 
      fc3: "Undergraduate degree / Diploma",
      fc4: "Salaried Job",
      fc5: "Supportive within family circumstances",
      fc6: "Some, but not in my immediate family",
      fc7: "Regional + Hindi/English",
      fc8: "No, always lived in the same place"
    };
    const res = await request(BASE_URL)
      .post('/api/family')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        subscriptionId: null // Will use active free subscription
      });
    console.log('Family status:', res.status);
    console.log('Family response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.summary).toBeDefined();
  });

  it('should complete Aptitude assessment', async () => {
    // Create realistic answer indices using actual Firebase question IDs (0-3 for multiple choice)
    const responses: { [key: string]: number } = {};
    const aptitudeIds = ['cr1', 'cr10', 'cr2', 'cr3', 'cr4', 'cr5', 'cr6', 'cr7', 'cr8', 'cr9', 'lr1', 'lr10', 'lr2', 'lr3', 'lr4', 'lr5', 'lr6', 'lr7', 'lr8', 'lr9', 'nr1', 'nr10', 'nr2', 'nr3', 'nr4', 'nr5', 'nr6', 'nr7', 'nr8', 'nr9', 'pr1', 'pr10', 'pr2', 'pr3', 'pr4', 'pr5', 'pr6', 'pr7', 'pr8', 'pr9'];
    
    // Use all 40 aptitude questions
    for (const questionId of aptitudeIds) {
      responses[questionId] = Math.floor(Math.random() * 4); // Random 0-3
    }
    
    const res = await request(BASE_URL)
      .post('/api/aptitude')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        assessmentType: 'free',
        subscriptionId: null // Will use active free subscription
      });
    console.log('Aptitude status:', res.status);
    console.log('Aptitude response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.categories).toBeDefined();
  });

  it('should generate recommendations', async () => {
    const res = await request(BASE_URL)
      .get('/api/recommendations')
      .set('Cookie', `auth_token=${authToken}`);
    console.log('Recommendations status:', res.status);
    console.log('Recommendations response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.recommendations).toBeDefined();
    expect(Array.isArray(res.body.recommendations)).toBe(true);
  });

  it('should generate career report', async () => {
    const res = await request(BASE_URL)
      .get('/api/report')
      .set('Cookie', `auth_token=${authToken}`);
    console.log('Report status:', res.status);
    console.log('Report response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.studentName).toBeDefined();
    expect(res.body.summary).toBeDefined();
    expect(res.body.recommendations).toBeDefined();
  });

  it('should download PDF report', async () => {
    const res = await request(BASE_URL)
      .get('/api/report/download')
      .set('Cookie', `auth_token=${authToken}`);
    console.log('PDF download status:', res.status);
    console.log('PDF content type:', res.headers['content-type']);
    console.log('PDF content length:', res.headers['content-length']);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/pdf');
    expect(parseInt(res.headers['content-length'] || '0')).toBeGreaterThan(0);
  });

  it('should fetch user profile', async () => {
    const res = await request(BASE_URL)
      .get('/api/profile')
      .set('Cookie', `auth_token=${authToken}`);
    console.log('Profile status:', res.status);
    console.log('Profile response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.assessments).toBeDefined();
    expect(res.body.eligibility).toBeDefined();
  });
}); 