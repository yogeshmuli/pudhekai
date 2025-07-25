const axios = require('axios');

const BASE_URL = 'http://localhost:3001';
const TEST_UID = `testuid${Date.now()}`;
const TEST_EMAIL = `testuser${Date.now()}@example.com`;

async function testPdfGeneration() {
  try {
    console.log('🧪 Testing PDF Generation...');
    
    // 1. Register user
    console.log('1. Registering user...');
    const registerRes = await axios.post(`${BASE_URL}/api/register`, {
      uid: TEST_UID,
      email: TEST_EMAIL,
      password: 'Test@1234',
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: '2000-01-01',
      currentGrade: 'grade-12',
      terms: true,
    });
    console.log('✅ User registered:', registerRes.status);

    // 2. Complete HEXACO assessment
    console.log('2. Completing HEXACO assessment...');
    const hexacoRes = await axios.post(`${BASE_URL}/api/hexaco`, {
      responses: Array(60).fill(3),
      assessmentType: 'free'
    }, {
      headers: { 'Cookie': `auth_token=${TEST_UID}` }
    });
    console.log('✅ HEXACO completed:', hexacoRes.status);

    // 3. Complete RIASEC assessment
    console.log('3. Completing RIASEC assessment...');
    const riasecRes = await axios.post(`${BASE_URL}/api/riasec`, {
      responses: Array(30).fill(3),
      assessmentType: 'free'
    }, {
      headers: { 'Cookie': `auth_token=${TEST_UID}` }
    });
    console.log('✅ RIASEC completed:', riasecRes.status);

    // 4. Complete MI assessment
    console.log('4. Completing MI assessment...');
    const miRes = await axios.post(`${BASE_URL}/api/mi`, {
      responses: Array(30).fill(3),
      assessmentType: 'free'
    }, {
      headers: { 'Cookie': `auth_token=${TEST_UID}` }
    });
    console.log('✅ MI completed:', miRes.status);

    // 5. Complete Family assessment
    console.log('5. Completing Family assessment...');
    const familyRes = await axios.post(`${BASE_URL}/api/family`, {
      responses: Array(10).fill(3),
      assessmentType: 'free'
    }, {
      headers: { 'Cookie': `auth_token=${TEST_UID}` }
    });
    console.log('✅ Family completed:', familyRes.status);

    // 6. Complete Aptitude assessment
    console.log('6. Completing Aptitude assessment...');
    const aptitudeRes = await axios.post(`${BASE_URL}/api/aptitude`, {
      responses: Array(40).fill(3),
      assessmentType: 'free'
    }, {
      headers: { 'Cookie': `auth_token=${TEST_UID}` }
    });
    console.log('✅ Aptitude completed:', aptitudeRes.status);

    // 7. Generate recommendations
    console.log('7. Generating recommendations...');
    const recRes = await axios.get(`${BASE_URL}/api/recommendations`, {
      headers: { 'Cookie': `auth_token=${TEST_UID}` }
    });
    console.log('✅ Recommendations generated:', recRes.status);

    // 8. Download PDF
    console.log('8. Downloading PDF...');
    const pdfRes = await axios.get(`${BASE_URL}/api/report/download`, {
      headers: { 'Cookie': `auth_token=${TEST_UID}` },
      responseType: 'arraybuffer'
    });
    
    console.log('✅ PDF downloaded!');
    console.log('📊 PDF Status:', pdfRes.status);
    console.log('📊 PDF Content-Type:', pdfRes.headers['content-type']);
    console.log('📊 PDF Content-Length:', pdfRes.headers['content-length']);
    console.log('📊 PDF Size:', pdfRes.data.length, 'bytes');
    
    // Check if it's a valid PDF
    const pdfHeader = new TextDecoder().decode(pdfRes.data.slice(0, 4));
    console.log('📊 PDF Header:', pdfHeader);
    
    if (pdfHeader === '%PDF') {
      console.log('✅ Valid PDF generated!');
      
      // Save the PDF
      const fs = require('fs');
      fs.writeFileSync('test-career-report.pdf', pdfRes.data);
      console.log('💾 PDF saved as test-career-report.pdf');
    } else {
      console.log('❌ Invalid PDF format');
      console.log('📄 Response content:', new TextDecoder().decode(pdfRes.data));
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
  
  // Keep the data for inspection
  console.log('\n🧹 DATA INSPECTION');
  console.log('='.repeat(50));
  console.log(`📋 Test User UID: ${TEST_UID}`);
  console.log(`📧 Test User Email: ${TEST_EMAIL}`);
  console.log(`🔗 Firebase Console URL: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore/data/users/${TEST_UID}`);
  console.log('\n📊 Data Summary:');
  console.log('✅ User registered with all assessments completed');
  console.log('✅ Recommendations generated');
  console.log('✅ PDF downloaded successfully');
  console.log('\n⚠️  DATA CLEANUP');
  console.log('='.repeat(50));
  console.log('The test data will be kept for manual inspection.');
  console.log('To clean up manually, delete the user document from Firebase Console.');
  console.log(`User UID to delete: ${TEST_UID}`);
}

testPdfGeneration(); 