import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Clock, 
  Award, 
  DollarSign, 
  Users, 
  Mail, 
  Sparkles,
  BookOpen
} from 'lucide-react';

const COURSES = [
  {
    id: "course-cs",
    name: "B.Tech in Computer Science & Engineering",
    degree: "Undergraduate (B.Tech)",
    duration: "4 Years (8 Semesters)",
    credits: 160,
    department: "Computer Science",
    tuition: "₹ 1,25,000 / semester",
    head: "Dr. Elena Rostova",
    contact: "elena.rostova@aits.edu",
    description: "Comprehensive software engineering, algorithms, AI, cloud computing, and cybersecurity curriculum with 6-month industry placement.",
    highlights: ["NVIDIA AI Supercomputing Center", "Mandatory Industry Internship", "Avg Package: ₹ 14.5 LPA"]
  },
  {
    id: "course-ai",
    name: "B.Tech in Artificial Intelligence & Data Science",
    degree: "Undergraduate (B.Tech)",
    duration: "4 Years (8 Semesters)",
    credits: 160,
    department: "Computer Science",
    tuition: "₹ 1,25,000 / semester",
    head: "Dr. Elena Rostova",
    contact: "ai-dept@aits.edu",
    description: "Specialized focus on Machine Learning, Deep Learning, Natural Language Processing, Computer Vision, and Big Data Analytics.",
    highlights: ["Quantum Computing Simulation", "PyTorch & TensorFlow Labs", "Highest Package: ₹ 54 LPA"]
  },
  {
    id: "course-cyber",
    name: "M.Tech in Cybersecurity & Cloud Computing",
    degree: "Postgraduate (M.Tech)",
    duration: "2 Years (4 Semesters)",
    credits: 72,
    department: "Computer Science",
    tuition: "₹ 95,000 / semester",
    head: "Prof. Marcus Vance",
    contact: "marcus.vance@aits.edu",
    description: "Advanced cryptography, network security, ethical hacking, cloud security architecture, and threat intelligence.",
    highlights: ["Cyber Range Security Lab", "CISO Mentorship Program", "Stipend up to ₹ 85,000/mo"]
  },
  {
    id: "course-robotics",
    name: "Ph.D. in Machine Learning & Robotics",
    degree: "Doctoral (Ph.D.)",
    duration: "3-5 Years",
    credits: 90,
    department: "Computer Science",
    tuition: "100% Fellowship Grant",
    head: "Dr. Elena Rostova",
    contact: "phd-admissions@aits.edu",
    description: "Cutting-edge research in reinforcement learning, humanoid robotics, computer vision, and neural network optimization.",
    highlights: ["₹ 38,000/mo Research Fellowship", "International Conference Grants", "Industry Lab Partnerships"]
  }
];

export default function CourseDirectory({ onQueryChat }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('All');

  const filteredCourses = COURSES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDegree = selectedDegree === 'All' || c.degree.includes(selectedDegree);
    return matchesSearch && matchesDegree;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 16px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GraduationCap size={30} color="#10b981" />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Academic Degree Programs & Directory
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Explore undergraduate, postgraduate, and doctoral engineering programs at AITS.
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            className="input-field"
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            style={{ width: '180px', fontSize: '0.85rem' }}
          >
            <option value="All">All Degrees</option>
            <option value="Undergraduate">Undergraduate (B.Tech)</option>
            <option value="Postgraduate">Postgraduate (M.Tech)</option>
            <option value="Doctoral">Doctoral (Ph.D.)</option>
          </select>

          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(540px, 1fr))', gap: '20px' }}>
        {filteredCourses.map((course) => (
          <div key={course.id} className="glass-panel glass-card-interactive" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className="badge-emerald">{course.degree}</span>
                <span className="badge-cyan" style={{ fontSize: '0.75rem' }}>{course.tuition}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                {course.name}
              </h3>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
                {course.description}
              </p>

              {/* Highlights */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
                {course.highlights.map((h, i) => (
                  <span key={i} className="badge-purple" style={{ fontSize: '0.72rem' }}>
                    ✦ {h}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> Duration: {course.duration}</div>
                <div><Users size={12} style={{ display: 'inline', marginRight: '4px' }} /> Chair: {course.head}</div>
              </div>

              <button
                className="btn-primary"
                onClick={() => onQueryChat(`Tell me all details about ${course.name} including admission and fees`)}
                style={{ fontSize: '0.8rem', padding: '8px 14px' }}
              >
                <Sparkles size={14} /> Ask AI Assistant
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
