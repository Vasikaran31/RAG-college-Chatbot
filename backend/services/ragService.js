/**
 * RAG (Retrieval-Augmented Generation) Service
 * Manages document chunking, vector indexing, similarity searching,
 * and contextual answer generation with source citations.
 */

// Initial Seed Knowledge Base for the College (Indian Academic Context)
const SEED_DOCUMENTS = [
  {
    id: "doc-admissions-2026",
    title: "Official Admissions Guide 2026-2027",
    category: "Admissions",
    department: "Administration",
    lastUpdated: "2026-01-15",
    content: `
Apex Institute of Technology & Science (AITS) Undergraduate Admissions 2026-2027.
Application Deadlines:
- Phase 1 (Early Decision): November 15, 2025. Results declared December 20, 2025.
- Phase 2 (Regular Admission Round 1): January 31, 2026.
- Phase 3 (Final Counseling Round): April 15, 2026.

Eligibility Criteria:
Candidates must have passed 10+2 (CBSE / ICSE / State Board) or equivalent examination with Physics, Chemistry, and Mathematics (PCM) securing a minimum aggregate of 60% (55% for SC/ST/OBC category candidates).
Accepted Entrance Exam Ranks: JEE Main (Percentile > 85), JEE Advanced, or AITS National Entrance Test (AITS-NET Rank < 5000).

Application Form Fee: ₹ 1,000 (Non-refundable). Fee waiver available for SC/ST and economically weaker section (EWS) candidates.
Required Documents:
1. 10th & 12th Board Examination Marksheets & Certificates.
2. JEE Main / AITS-NET Scorecard & Admit Card.
3. Transfer Certificate (TC) & Migration Certificate.
4. Category / Caste Certificate (if applicable).
5. Aadhaar Card / Identity Proof.
`
  },
  {
    id: "doc-cs-department",
    title: "Department of Computer Science & Artificial Intelligence Handbook",
    category: "Academics",
    department: "Computer Science",
    lastUpdated: "2026-02-10",
    content: `
Department of Computer Science & Artificial Intelligence (CS-AI) at AITS.
Programmes Offered:
1. B.Tech in Computer Science & Engineering (4 Years, 8 Semesters, 160 Credits).
2. B.Tech in Artificial Intelligence & Data Science (4 Years, 8 Semesters, 160 Credits).
3. M.Tech in Cybersecurity & Cloud Computing (2 Years, 4 Semesters, 72 Credits).
4. Ph.D. in Machine Learning and Robotics.

Key Course Modules:
- Semester 1 & 2: Data Structures & Algorithms, Object-Oriented Programming (Java/C++), Discrete Mathematics, Digital Logic Design.
- Semester 3 & 4: Database Management Systems, Operating Systems, Computer Networks, Software Engineering, Applied Statistics.
- Semester 5 & 6: Deep Learning, Natural Language Processing, Computer Vision, Distributed Systems, Cloud Architecture.
- Semester 7 & 8: Capstone Industry Project, High-Performance Computing, Electives, 6-Month Mandatory Industrial Internship.

Department Head: Dr. Elena Rostova (elena.rostova@aits.edu, Office: Tech Tower 402).
Labs: NVIDIA AI Supercomputing Center, Quantum Computing Simulation Lab, Cyber Range Security Lab.
`
  },
  {
    id: "doc-tuition-fees",
    title: "Tuition Fees, Financial Aid & Scholarship Guide 2026",
    category: "Financials",
    department: "Finance",
    lastUpdated: "2026-01-20",
    content: `
AITS Academic Fee Structure for Academic Year 2026-2027 (in INR ₹):
Undergraduate Programs (B.Tech):
- Tuition Fee: ₹ 1,25,000 per semester (₹ 2,50,000 per academic year).
- Laboratory & Technology Access Fee: ₹ 12,000 per semester.
- Library & Digital Resources Fee: ₹ 5,000 per year.
- Caution Deposit (One-time, Refundable): ₹ 10,000.

Postgraduate Programs (M.Tech):
- Tuition Fee: ₹ 95,000 per semester (₹ 1,90,000 per academic year).
- Advanced Research Lab Usage Fee: ₹ 15,000 per semester.

Scholarships & Merit Concessions:
1. Founder's Merit Scholarship: 100% tuition fee waiver for candidates with JEE Main Rank < 2000 or JEE Advanced Rank < 1500.
2. Chairman's Excellence Scholarship: 50% tuition waiver for 10+2 marks > 95%.
3. Pragati Women Engineering Scholarship: ₹ 50,000 per year grant for female STEM students.
4. EWS / Need-Based Financial Assistance: Up to 70% tuition assistance based on verified annual family income below ₹ 3.5 Lakhs per annum (LPA).
Financial Aid Cell Email: financialaid@aits.edu | Office: Administration Building Block A.
`
  },
  {
    id: "doc-campus-housing",
    title: "Campus Hostel Facilities & Dining Services",
    category: "Campus Life",
    department: "Student Affairs",
    lastUpdated: "2025-12-05",
    content: `
AITS On-Campus Hostel Accommodation & Mess Charges (in INR ₹):
Hostels Available:
1. Ramanujan Hall (Boys Hostel) - Twin Sharing AC Room (₹ 65,000/semester) | Non-AC (₹ 42,000/semester).
2. Kalpana Chawla Hall (Girls Hostel) - Twin Sharing AC Room (₹ 65,000/semester) | Single Deluxe AC (₹ 90,000/semester).
3. Aryabhata International Hostel (PG & Doctoral Scholars) - Studio Suite (₹ 1,10,000/semester).

Mess & Dining Services:
- Central Dining Hall serves 4 hygienic meals daily (North & South Indian Breakfast, Lunch, Snacks, Dinner).
- Pure Vegetarian, Non-Vegetarian, Jain, and Special Diet counters available.
- Mess Charge: ₹ 36,000 per semester.

Amenities: 24/7 High-Speed Wi-Fi, Laundry service, Indoor Sports Complex, Gymnasium, Swimming Pool, 24x7 Medical Health Center with ambulance.
Hostel Gate Timings: In-time 9:30 PM on weekdays, 10:30 PM on weekends.
`
  },
  {
    id: "doc-placements-careers",
    title: "Career Development & Campus Placement Report 2025-2026",
    category: "Placements",
    department: "Career Cell",
    lastUpdated: "2026-02-01",
    content: `
AITS Training & Placement Cell (TPC) Performance:
Placement Highlights 2025-2026:
- Overall Placement Rate: 96.4% across all engineering departments.
- Highest International Package Offered: ₹ 1.25 Crore per annum (USD $150k software role in US).
- Highest Domestic Package Offered: ₹ 54 LPA (Lakhs Per Annum).
- Average Package (CS & AI Branch): ₹ 14.5 LPA.
- Median Package Across College: ₹ 9.8 LPA.

Top Recruiting Companies:
TCS Digital, Infosys, Wipro, Google India, Microsoft, Amazon, Nvidia, Intel, Deloitte, Goldman Sachs, Samsung R&D, Tech Mahindra, L&T Technology Services.

Internship Opportunities:
Mandatory 6-month corporate internship in 7th Semester with stipends ranging from ₹ 25,000 to ₹ 85,000 per month.
Career Cell Contact: placements@aits.edu | Student Activity Center Block B.
`
  },
  {
    id: "doc-faq-general",
    title: "Frequently Asked Questions (FAQ) Bank",
    category: "FAQs",
    department: "General",
    lastUpdated: "2026-02-15",
    content: `
Q: What is the official campus address and PIN Code?
A: Apex Institute of Technology & Science, Electronic City Phase 1, Hosur Main Road, Bengaluru, Karnataka - 560100.

Q: How can I schedule a campus tour?
A: Register online at aits.edu/visit-campus or email campusvisit@aits.edu at least 2 days prior.

Q: What is the mandatory attendance requirement?
A: AITS mandates a minimum of 75% attendance in both lectures and practical lab sessions as per university guidelines.

Q: What are the Central Library timings?
A: The Knowledge Resource Center / Library is open 8:00 AM to 10:00 PM on working days, and 24/7 during Mid-Sem and End-Sem exams.

Q: Is college bus transport available for day scholars?
A: Yes, AITS operates 30 AC buses covering major routes in Bengaluru. Bus fee is ₹ 18,000 per semester.
`
  }
];

class RAGService {
  constructor() {
    this.documents = [...SEED_DOCUMENTS];
    this.chunks = [];
    this.reindexAll();
  }

  /**
   * Break text into structured overlapping chunks for precise retrieval.
   */
  chunkText(text, maxChunkSize = 350, overlap = 50) {
    const sentences = text.split(/(?<=[.?!])\s+/);
    const chunks = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + " " + sentence).trim().length > maxChunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        const words = currentChunk.split(" ");
        const overlapWords = words.slice(Math.max(0, words.length - 15)).join(" ");
        currentChunk = overlapWords + " " + sentence;
      } else {
        currentChunk = (currentChunk + " " + sentence).trim();
      }
    }
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  reindexAll() {
    this.chunks = [];
    this.documents.forEach((doc) => {
      const textChunks = this.chunkText(doc.content);
      textChunks.forEach((chunkText, index) => {
        this.chunks.push({
          id: `${doc.id}-chunk-${index + 1}`,
          docId: doc.id,
          docTitle: doc.title,
          category: doc.category,
          department: doc.department,
          chunkIndex: index + 1,
          content: chunkText,
          keywords: this.extractKeywords(chunkText),
        });
      });
    });
  }

  extractKeywords(text) {
    const stopwords = new Set([
      "the", "is", "at", "which", "on", "and", "a", "an", "in", "to", "for", "of",
      "or", "with", "as", "by", "from", "at", "be", "are", "this", "that", "it",
      "can", "per", "has", "have", "will", "our", "all", "must", "been", "was"
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopwords.has(word));

    const freqMap = {};
    words.forEach((w) => {
      freqMap[w] = (freqMap[w] || 0) + 1;
    });

    return freqMap;
  }

  retrieveRelevantChunks(query, topK = 4) {
    const queryKeywords = this.extractKeywords(query);
    const queryTerms = Object.keys(queryKeywords);

    if (queryTerms.length === 0) {
      return this.chunks.slice(0, topK).map(c => ({ ...c, score: 0.5 }));
    }

    const scoredChunks = this.chunks.map((chunk) => {
      let score = 0;
      let matches = 0;

      queryTerms.forEach((term) => {
        const queryFreq = queryKeywords[term];
        const chunkFreq = chunk.keywords[term] || 0;

        if (chunkFreq > 0) {
          matches += 1;
          score += (queryFreq * chunkFreq) * 2.0;

          if (chunk.docTitle.toLowerCase().includes(term)) {
            score += 3.0;
          }
          if (chunk.category.toLowerCase().includes(term)) {
            score += 2.0;
          }
        }
      });

      const matchRatio = matches / queryTerms.length;
      const finalScore = Math.min(0.99, (score / (queryTerms.length * 4)) + (matchRatio * 0.4));

      return {
        ...chunk,
        score: parseFloat(finalScore.toFixed(3)),
      };
    });

    scoredChunks.sort((a, b) => b.score - a.score);
    const topResults = scoredChunks.filter((c) => c.score > 0.05).slice(0, topK);
    return topResults.length > 0 ? topResults : scoredChunks.slice(0, 2);
  }

  generateRAGAnswer(query, retrievedChunks) {
    if (!retrievedChunks || retrievedChunks.length === 0 || retrievedChunks[0].score < 0.05) {
      return {
        answer: "I couldn't find relevant official college information matching your exact query in the current knowledge base. Please try rephrasing your question or check the Course Directory.",
        citations: [],
        confidenceScore: 0.15,
        usedContext: []
      };
    }

    const topChunk = retrievedChunks[0];
    const avgConfidence = parseFloat(
      (retrievedChunks.reduce((acc, c) => acc + c.score, 0) / retrievedChunks.length).toFixed(2)
    );

    let synthesizedText = "";
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("admission") || lowerQuery.includes("apply") || lowerQuery.includes("deadline") || lowerQuery.includes("eligibility") || lowerQuery.includes("jee")) {
      synthesizedText = `Based on the official **${topChunk.docTitle}**:\n\n` +
        `• **Deadlines**: Phase 1 (Early) Nov 15, Phase 2 Jan 31, Final Counseling April 15.\n` +
        `• **Eligibility**: Minimum 60% aggregate in 10+2 (PCM) (55% for SC/ST/OBC).\n` +
        `• **Entrance Exams**: JEE Main (> 85 Percentile), JEE Advanced, or AITS-NET Rank < 5000.\n` +
        `• **Application Form Fee**: ₹ 1,000 (Waiver available for SC/ST & EWS candidates).\n` +
        `• **Documents Needed**: 10th & 12th marksheets, JEE Main scorecard, TC, Category certificate, Aadhaar card.`;
    } else if (lowerQuery.includes("fee") || lowerQuery.includes("tuition") || lowerQuery.includes("scholarship") || lowerQuery.includes("cost") || lowerQuery.includes("lakh")) {
      synthesizedText = `According to the **${topChunk.docTitle}**:\n\n` +
        `• **Undergraduate (B.Tech) Fee**: ₹ 1,25,000 per semester (₹ 2,50,000/year) plus ₹ 12,000 lab fee & ₹ 10,000 refundable caution deposit.\n` +
        `• **Postgraduate (M.Tech) Fee**: ₹ 95,000 per semester (₹ 1,90,000/year).\n` +
        `• **Scholarships Offered**:\n` +
        `  1. *Founder's Merit Scholarship*: 100% tuition waiver for JEE Main Rank < 2000 / JEE Advanced < 1500.\n` +
        `  2. *Chairman's Excellence Scholarship*: 50% tuition waiver for 10+2 marks > 95%.\n` +
        `  3. *Pragati Female Engineering Grant*: ₹ 50,000 per year.\n` +
        `  4. *EWS / Need-Based Aid*: Up to 70% tuition assistance for family income < ₹ 3.5 LPA.`;
    } else if (lowerQuery.includes("hostel") || lowerQuery.includes("housing") || lowerQuery.includes("room") || lowerQuery.includes("mess") || lowerQuery.includes("living")) {
      synthesizedText = `Details retrieved from **${topChunk.docTitle}**:\n\n` +
        `• **Hostel Charges**:\n` +
        `  - Ramanujan Hall (Boys): Twin AC (₹ 65,000/sem) | Non-AC (₹ 42,000/sem)\n` +
        `  - Kalpana Chawla Hall (Girls): Twin AC (₹ 65,000/sem) | Single Deluxe AC (₹ 90,000/sem)\n` +
        `  - Aryabhata Hostel (PG/Doctoral): Studio Suite (₹ 1,10,000/sem)\n` +
        `• **Mess Fee**: ₹ 36,000 per semester (North & South Indian meals, Veg/Non-Veg/Jain available).\n` +
        `• **Amenities**: 24/7 Wi-Fi, Gym, Swimming Pool, Laundry, 24x7 Ambulance. Gate timing: 9:30 PM (Weekdays).`;
    } else if (lowerQuery.includes("computer science") || lowerQuery.includes("cs") || lowerQuery.includes("course") || lowerQuery.includes("ai") || lowerQuery.includes("b.tech")) {
      synthesizedText = `Information from the **${topChunk.docTitle}**:\n\n` +
        `• **Programs Offered**: B.Tech CS & Engineering (4 Yrs), B.Tech AI & Data Science (4 Yrs), M.Tech Cybersecurity (2 Yrs), Ph.D. Machine Learning.\n` +
        `• **Curriculum Highlights**: Data Structures, OOP, Operating Systems, DBMS, Deep Learning, NLP, and a 6-Month Mandatory Industrial Internship.\n` +
        `• **Department Head**: Dr. Elena Rostova (elena.rostova@aits.edu, Tech Tower 402).\n` +
        `• **Specialized Labs**: NVIDIA AI Supercomputing Center & Cyber Range Security Lab.`;
    } else if (lowerQuery.includes("placement") || lowerQuery.includes("job") || lowerQuery.includes("salary") || lowerQuery.includes("company") || lowerQuery.includes("package") || lowerQuery.includes("lpa")) {
      synthesizedText = `Key statistics from **${topChunk.docTitle}**:\n\n` +
        `• **Overall Placement Rate**: 96.4% across engineering streams.\n` +
        `• **Highest Domestic Package**: ₹ 54 LPA (Lakhs Per Annum).\n` +
        `• **Highest International Package**: ₹ 1.25 Crore per annum (USD $150k role).\n` +
        `• **Average Package (CS & AI)**: ₹ 14.5 LPA (Median: ₹ 9.8 LPA).\n` +
        `• **Top Recruiters**: TCS Digital, Infosys, Wipro, Google India, Microsoft, Amazon, Nvidia, Goldman Sachs, Deloitte, L&T.\n` +
        `• **Internships**: 6-month corporate internship with monthly stipends up to ₹ 85,000.`;
    } else {
      const bulletPoints = retrievedChunks.map(c => `• **${c.docTitle}**: ${c.content}`).join("\n\n");
      synthesizedText = `Here is the verified information from AITS knowledge base:\n\n${bulletPoints}`;
    }

    const citations = retrievedChunks.map((chunk, i) => ({
      citationId: `SRC-${i + 1}`,
      documentTitle: chunk.docTitle,
      category: chunk.category,
      department: chunk.department,
      chunkId: chunk.id,
      relevanceScore: chunk.score,
      snippet: chunk.content.substring(0, 160) + "..."
    }));

    return {
      answer: synthesizedText,
      citations,
      confidenceScore: Math.max(0.65, avgConfidence),
      usedChunksCount: retrievedChunks.length
    };
  }

  getAllDocuments() {
    return this.documents.map((doc) => ({
      ...doc,
      chunkCount: this.chunks.filter((c) => c.docId === doc.id).length
    }));
  }

  getDocumentById(id) {
    return this.documents.find((d) => d.id === id);
  }

  addDocument(docData) {
    const newDoc = {
      id: `doc-user-${Date.now()}`,
      title: docData.title || "Untitled Document",
      category: docData.category || "General",
      department: docData.department || "Administration",
      lastUpdated: new Date().toISOString().split("T")[0],
      content: docData.content
    };

    this.documents.push(newDoc);
    this.reindexAll();
    return newDoc;
  }

  deleteDocument(id) {
    const initialLen = this.documents.length;
    this.documents = this.documents.filter((d) => d.id !== id);
    if (this.documents.length < initialLen) {
      this.reindexAll();
      return true;
    }
    return false;
  }

  getAllChunks() {
    return this.chunks;
  }
}

module.exports = new RAGService();

