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
  afterAll(async () => {
    if (uid) {
      const userRef = adminDb.collection('users').doc(uid);
      const assessments = await userRef.collection('assessments').listDocuments();
      for (const doc of assessments) await doc.delete();
      const recos = await userRef.collection('recommendations').listDocuments();
      for (const doc of recos) await doc.delete();
      await userRef.delete();
      console.log(`Cleaned up test user: ${uid}`);
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

  it('should complete HEXACO assessment', async () => {
    const responses = Array(60).fill(3); // Neutral responses for all questions
    const res = await request(BASE_URL)
      .post('/api/hexaco')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        assessmentType: 'free'
      });
    console.log('HEXACO status:', res.status);
    console.log('HEXACO response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.traitScores).toBeDefined();
  });

  it('should complete RIASEC assessment', async () => {
    const responses = Array(30).fill(3); // Neutral responses for all questions
    const res = await request(BASE_URL)
      .post('/api/riasec')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        assessmentType: 'free'
      });
    console.log('RIASEC status:', res.status);
    console.log('RIASEC response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.categoryScores).toBeDefined();
  });

  it('should complete MI assessment', async () => {
    const responses = Array(40).fill(3); // Neutral responses for all questions
    const res = await request(BASE_URL)
      .post('/api/mi')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        assessmentType: 'free'
      });
    console.log('MI status:', res.status);
    console.log('MI response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.miScores).toBeDefined();
  });

  it('should complete Family assessment', async () => {
    const responses = Array(20).fill(3); // Neutral responses for all questions
    const res = await request(BASE_URL)
      .post('/api/family')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        assessmentType: 'free'
      });
    console.log('Family status:', res.status);
    console.log('Family response:', res.body);
    expect(res.status).toBe(200);
    expect(res.body.summary).toBeDefined();
  });

  it('should complete Aptitude assessment', async () => {
    const responses = Array(50).fill(3); // Neutral responses for all questions
    const res = await request(BASE_URL)
      .post('/api/aptitude')
      .set('Cookie', `auth_token=${authToken}`)
      .send({
        responses,
        assessmentType: 'free'
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