# PudheKai – AI-Powered Career Recommendation Platform (India)

## 🎯 Platform Objective
Help Indian students (14+) discover the right career path by integrating psychological assessments, family context, and AI-driven guidance.

## ❓ Problem We Are Solving
- Career decisions are influenced more by family/society than personal fit.
- Limited exposure to diverse career options.
- Lack of personalized and scalable guidance systems.
- Socio-economic reality often ignored in mainstream counseling.

## 🧱 Our 4-Pillar Assessment Framework

| **Pillar**        | **Model/Approach**                        | **Purpose**                                         |
|-------------------|-------------------------------------------|-----------------------------------------------------|
| **Personality**   | HEXACO (Mini/Full)                        | Understand traits like honesty, openness, diligence  |
| **Interests**     | Holland’s RIASEC                          | Map vocational preferences                          |
| **Intelligence**  | MI (qualitative) + NIH Toolbox (quantitative) | Profile learning style + reasoning/cognitive ability |
| **Family Context**| Custom form (income, occupation, education, location) | Gauge external support, influence, and constraints |

## 🤖 AI Recommendation Engine
- Uses OpenAI GPT-4 to:
    - Match traits to careers
    - Suggest practical and aspirational roadmaps
    - Generate personalized guidance narratives
- Outputs include:
    - Top-fit careers
    - Skill/education roadmap
    - Motivation and explanation
    - Pragmatic vs ideal paths (based on context)

## 💡 Key Features

### Free Tier
- Short assessments (Mini HEXACO, RIASEC-Short)
- Basic report with 3 career clusters
- Simple download option

### Premium Tier
- Full assessments + family context
- Career roadmap + skill path
- Interactive dashboard with videos/resources
- Tracking, reassessments, and feedback loop

## 🧰 Tech Stack

### Frontend
- React + Next.js
- Tailwind + Shadcn/ui

### Backend
- Firebase Auth + Firestore
- Cloud Functions for logic
- Firebase Hosting + Analytics

### AI Layer
- GPT-4 API for:
    - Recommendations
    - Explanation generation
    - Career-path story building

### Admin
- Role-based access (admin/user)
- Firestore rules
- Optional dashboard (React or Firebase Console)

## 🗺️ Implementation Roadmap

### 🚀 Phase 1: MVP (Week 1–2)
- Free assessments (short HEXACO + RIASEC)
- User login + simple UI
- Display basic recommendations

### 💼 Phase 2: Premium Launch (Week 3–4)
- Full HEXACO, RIASEC, MI, NIH assessments
- Add family context layer
- GPT-based roadmap generation
- Payment system

### 📊 Phase 3: Feedback & Evolution (Week 5–6)
- Track user feedback & report usage
- Add progress dashboards
- Enable reassessments

### 🌍 Phase 4: Ecosystem & Scale (Post Week 6)
- Support Hindi, Marathi, etc.
- Partner with learning platforms (NSDC, Unacademy)
- Show real-time job market data

## 🧭 Strategic Vision
- Make personalized, AI-powered career mentoring accessible to all.
- Blend science with empathy: matching skills and dreams with reality.
- Empower students to think beyond conventional, context-limited choices.

# PudheKai – User Journey / Flow

---

## 1. Landing Page
- User lands on PudheKai home page (sees value prop, “Start Now” CTA).

---

## 2. Sign Up / Login
- Clicks “Start Now” or “Sign Up”.
- Options:
    - Sign Up with Google / Apple / Mobile+OTP / Email
    - OR, Login if already registered

---

## 3. Select User Role
- Student (default, highlighted)
- Parent
- Teacher
- (This sets up a relevant experience later.)

---

## 4. Profile Setup
- **Step 1:** Basic Info
    - Name, Age, Gender, Grade/Class, Location (city/town/village)
- **Step 2:** Family Context
    - Parent(s) education
    - Parent(s) occupation
    - Family income band
    - Urban/rural
    - Siblings (optional)
- **Step 3:** Preferences/Goals (optional)
    - Dream careers (if any), extracurriculars, favorite subjects

---

## 5. (Optional) Package Selection
- **Free (Basic):**
    - Core assessments & recommendations
- **Premium:**
    - Detailed roadmap, mentor access, personalized report, college shortlist, 1:1 session, etc.
- (User can skip and upgrade later; prompt can appear after the first assessment too.)

---

## 6. Dashboard / Assessment Hub
- Visual progress tracker: What’s done, what’s next
- Assessment menu:
    - [Start Personality Test]
    - [Start Interest Test] (locked until Personality done)
    - [Start Intelligence Test] (locked until previous done)
    - Family context (pre-filled, editable)
- Each test shows expected time, why it matters, “Resume” if incomplete

---

## 7. Assessment Tests (Sequential)
- **Personality Assessment:**
    - ~5-10 min, friendly quiz, scenario-based
- **Interest Assessment:**
    - ~6-8 min, multiple-choice and visual cues
- **Intelligence Assessment:**
    - ~8-10 min, gamified, real-world examples
- (Each test: progress bar, “Save & Continue Later”, feedback if left incomplete)

---

## 8. Assessment Results
- **Results Dashboard:**
    - Personality Type (with badge/graphic)
    - Top Interests
    - Intelligence Profile
    - Family Context summary (for context)

---

## 9. AI-Powered Career Recommendations
- **Personalized list of careers:**
    - Top 3-5 matches (with % fit, why it fits you)
    - For each: [View Details]
- **Actions:**
    - Download/Share basic report (PDF)
    - [Ask Mentor] / [Community Q&A]
    - [Upgrade to Premium] (to unlock more details or features)

---

## 10. Career Exploration & Planning
- **For each recommended career:**
    - Overview: Day in the life, key skills
    - Education pathways: Courses, streams, colleges (region/city filter)
    - Scholarships (if relevant)
    - Salary ranges, future scope
    - Set as goal, save for later

---

## 11. Mentor/Community Support (Optional/Premium)
- **Ask a Mentor:**
    - Text your questions, get expert answers
- **Community:**
    - Browse Q&A, upvote useful answers

---

## 12. Progress Tracking & Re-engagement
- **My Journey page:**
    - View progress, set reminders, download full report
    - Set/track goals (optional)
- **Periodic notifications:**
    - “Time to retake your interest test!” or “Check out new careers!”

---

## 13. Upgrade / Upsell Moments
- After viewing basic report or top recommendations, prompt to upgrade for:
    - Detailed career plan, personalized 1:1 counseling, college shortlist, progress tracking

---

## 14. Logout / Account Management
- Profile management
- Logout, data privacy options

---

## Typical User Flow Example
1. Land on page → Sign Up → Select “Student” → Fill profile → Skip or select package (Free/Premium)
2. Enter dashboard → Take Personality Test → Take Interest Test → Take Intelligence Test
3. View results → Get top career matches → Explore details → Download/share report
4. Ask mentor if premium or continue as free user → Set a goal → (Re-engage later for more features)

---

# UI Wireframe Notes

## 1. Landing Page
**Frame Size:** 1440x1024 (desktop, mobile responsive later)

### Header
- Left: PudheKai Logo
- Right: [Login] [Sign Up]

### Hero Section
- Headline: “What Next? Find Your Career Path with AI”
- Subheadline: “Discover your best-fit careers based on your personality, interests, and intelligence.”
- CTA Button: [Start Now]
- Illustration/Image: Student with roadmap or upward arrows (centered beside/below text)

### How it Works (Steps)
- 3 Columns:
    1. **Take Assessments** (icon: clipboard)
    2. **Get Recommendations** (icon: lightbulb)
    3. **Plan Your Journey** (icon: map pin)
- Simple step titles + 1 line explanation each

### Testimonials & Partners (optional for MVP)
- 2-3 quotes from students/parents
- Logos of any partners/schools

### Footer
- Links: About | Contact | FAQ | Privacy | Social

---

## 2. Sign Up / Login Page
**Frame Size:** 480x640 (centered modal or dedicated page)
- Logo at top
- Welcome text: “Create your account”
- [Google Sign Up] [Apple Sign Up]
- Divider: OR
- Fields: Name, Email/Mobile, Password
- [Continue] button
- Link: “Already have an account? Log in”

---

## 3. Profile Setup
**Frame Size:** 720x960 (centered card, step-by-step form)

### Step 1: Personal Info
- Fields: Name, Age, Gender, Grade/Class, Location

### Step 2: Family Context
- Dropdowns:
    - Parent Education (10th, 12th, Degree, etc.)
    - Parent Occupation
    - Family Income Range
    - Urban/Rural
    - Siblings (number)

### Progress Indicator (top or bottom)

### Action Buttons
- [Back] [Next]

---

## 4. Assessment Hub (Dashboard)
**Frame Size:** 1024x768
- Greeting: “Welcome, [Name]!”
- “Your Journey” progress bar
- Cards/List for each assessment:
    - Personality Test [Start/Resume]
    - Interest Test [Locked/Start]
    - Intelligence Test [Locked/Start]
    - Family Context [Review/Edit]
- Progress indicator
- [Help/FAQ] link

---

## 5. Assessment (Quiz) Screen
**Frame Size:** 800x600
- Progress: “Question 2 of 10”
- Fun illustration or icon
- Question text
- 3-5 option buttons (radio or card style)
- [Next] [Back] buttons
- Save & exit

---

## 6. Results Dashboard
**Frame Size:** 1024x768
- “Your Results” Title
- Personality type (card with type, short desc, icon)
- Top Interests (chips/badges)
- Intelligence Profile (horizontal bar, radar, or badge)
- Family Context summary
- [See Recommendations] button

---

## 7. Career Recommendation List
**Frame Size:** 1024x900
- Title: “Top Careers for You”
- List/Grid:
    - Career name, matching %, small icon
    - [View Details] button for each
- [Download Report] [Share] buttons
- [Book 1:1 Mentor] callout

---

## 8. Career Detail Page
**Frame Size:** 1024x900
- Career name, icon
- Why it matches you (summary)
- “Day in the Life” – collapsible card
- Skills needed (tags)
- Pathways: Education, Courses, Colleges (cards)
- Scholarships info (if available)
- Ask Mentor/Community Q&A section
- [Save] [Set as Goal] buttons

---

## 9. Mentor / Community Q&A
**Frame Size:** 800x700
- “Ask a Mentor” Title
- Textbox: “Type your question”
- [Attach File] (optional)
- [Send] button
- Recent questions/answers list

---

## 10. Upgrade to Premium
**Frame Size:** 600x800 (centered modal/page)
- Title: “Unlock More Guidance”
- List: Features (personalized roadmap, 1:1 calls, college shortlist)
- [Upgrade Now] button
- [Back] button 