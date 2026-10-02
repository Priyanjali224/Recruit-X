import { InterviewQuestion, InterviewSession } from '@/types/interview';
import { FeedbackReport } from '@/types/feedback';

export interface CategoryCardData {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionCount: number;
}

export const INTERVIEW_CATEGORIES: CategoryCardData[] = [
  {
    id: 'java',
    name: 'Java & OOP',
    category: 'Backend / Core',
    description: 'Master Object-Oriented Programming, JVM memory model, multi-threading, Streams, and collections.',
    icon: 'Coffee',
    tags: ['Core Java', 'OOP', 'Multithreading', 'JVM'],
    difficulty: 'Medium',
    questionCount: 10,
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    category: 'Core Computer Science',
    description: 'Arrays, Trees, Graphs, Dynamic Programming, Heap, sorting, and algorithmic complexity.',
    icon: 'Binary',
    tags: ['Trees', 'Graphs', 'DP', 'Time Complexity'],
    difficulty: 'Hard',
    questionCount: 10,
  },
  {
    id: 'sql',
    name: 'SQL & Database Design',
    category: 'Data & Storage',
    description: 'Complex joins, indexing strategies, normalization, transactions, query optimization, and ACID properties.',
    icon: 'Database',
    tags: ['PostgreSQL', 'Indexing', 'Joins', 'Transactions'],
    difficulty: 'Medium',
    questionCount: 10,
  },
  {
    id: 'dbms',
    name: 'DBMS Internals',
    category: 'Core Computer Science',
    description: 'B-Trees, Write-Ahead Logging, concurrency control, distributed transactions, and isolation levels.',
    icon: 'Layers',
    tags: ['ACID', 'Concurrency', 'B+ Trees', 'Locks'],
    difficulty: 'Hard',
    questionCount: 5,
  },
  {
    id: 'os',
    name: 'Operating Systems',
    category: 'Core Computer Science',
    description: 'Process scheduling, virtual memory, paging, deadlocks, race conditions, and system calls.',
    icon: 'Cpu',
    tags: ['Paging', 'Deadlocks', 'Threads', 'Syscalls'],
    difficulty: 'Medium',
    questionCount: 5,
  },
  {
    id: 'cn',
    name: 'Computer Networks',
    category: 'Infrastructure',
    description: 'TCP/IP vs UDP, OSI model, DNS resolution, HTTP/HTTPS, WebSockets, and SSL/TLS handshakes.',
    icon: 'Network',
    tags: ['TCP/IP', 'HTTP/3', 'DNS', 'TLS/SSL'],
    difficulty: 'Medium',
    questionCount: 5,
  },
  {
    id: 'javascript',
    name: 'Modern JavaScript (ES6+)',
    category: 'Frontend / Full Stack',
    description: 'Event Loop, Closures, Prototypal inheritance, Promises, Async/Await, and V8 engine mechanics.',
    icon: 'Code2',
    tags: ['Event Loop', 'Closures', 'Promises', 'ESNext'],
    difficulty: 'Medium',
    questionCount: 10,
  },
  {
    id: 'react',
    name: 'React.js & Performance',
    category: 'Frontend',
    description: 'Fiber architecture, custom hooks, Server Components, memoization, state management, and rendering cycles.',
    icon: 'Atom',
    tags: ['Hooks', 'Fiber', 'State', 'RSC'],
    difficulty: 'Medium',
    questionCount: 10,
  },
  {
    id: 'fullstack',
    name: 'Full Stack & System Design',
    category: 'Architecture',
    description: 'REST vs GraphQL, microservices, caching with Redis, load balancing, CDNs, and security best practices.',
    icon: 'Server',
    tags: ['System Design', 'APIs', 'Redis', 'Microservices'],
    difficulty: 'Hard',
    questionCount: 10,
  },
];

export const FALLBACK_QUESTIONS: Record<string, InterviewQuestion[]> = {
  java: [
    {
      id: 'q1',
      order: 1,
      question: 'What is the fundamental difference between an interface and an abstract class in Java, especially after Java 8 and 9?',
      category: 'Java',
      difficulty: 'Medium',
      idealAnswerKeyPoints: ['Multiple inheritance of type vs state', 'Default and static methods in Java 8', 'Private methods in Java 9', 'Constructors in abstract classes'],
    },
    {
      id: 'q2',
      order: 2,
      question: 'How does the JVM Garbage Collector identify unreachable objects, and what is the difference between Minor GC and Major GC?',
      category: 'Java',
      difficulty: 'Hard',
      idealAnswerKeyPoints: ['GC Roots and reachability analysis', 'Young Generation vs Old (Tenured) Generation', 'Stop-The-World pauses', 'Generational hypothesis'],
    },
    {
      id: 'q3',
      order: 3,
      question: 'Explain how `ConcurrentHashMap` achieves thread safety without locking the entire map like `Hashtable`.',
      category: 'Java',
      difficulty: 'Hard',
      idealAnswerKeyPoints: ['Segment locking (prior to Java 8)', 'Node CAS and synchronized on first bin node (Java 8+)', 'Read operations lock-free with volatile value fields'],
    },
  ],
  dsa: [
    {
      id: 'dsa-1',
      order: 1,
      question: 'How would you detect a cycle in a singly linked list, and what is the mathematical intuition behind Floyd’s Tortoise and Hare algorithm?',
      category: 'DSA',
      difficulty: 'Medium',
      idealAnswerKeyPoints: ['Slow pointer 1 step, fast pointer 2 steps', 'Relative speed difference of 1 step eliminates skipping', 'Time O(N) and Space O(1)'],
    },
    {
      id: 'dsa-2',
      order: 2,
      question: 'When should you choose a Breadth-First Search (BFS) over a Depth-First Search (DFS) for graph traversal?',
      category: 'DSA',
      difficulty: 'Medium',
      idealAnswerKeyPoints: ['Shortest path in unweighted graph', 'Level-order traversal', 'Memory tradeoff with queue vs call stack recursion'],
    },
  ],
  react: [
    {
      id: 'react-1',
      order: 1,
      question: 'Explain the internal workings of React Fiber and how concurrent rendering prevents main thread blocking.',
      category: 'React',
      difficulty: 'Hard',
      idealAnswerKeyPoints: ['Virtual DOM incremental reconciliation', 'Time slicing and requestIdleCallback/scheduler', 'Priority lanes and interruptible work units'],
    },
    {
      id: 'react-2',
      order: 2,
      question: 'What is the exact difference between `useMemo`, `useCallback`, and `React.memo`?',
      category: 'React',
      difficulty: 'Medium',
      idealAnswerKeyPoints: ['useMemo caches calculated values', 'useCallback caches function definitions', 'React.memo is a higher-order component preventing re-render based on props comparison'],
    },
  ],
};

export const SAMPLE_FEEDBACK_REPORT: FeedbackReport = {
  id: 'fb-sample-01',
  interviewId: 'interview-demo-101',
  userId: 'demo-user-123',
  createdAt: new Date().toISOString(),
  overallScore: 84,
  technicalScore: 88,
  problemSolvingScore: 82,
  communicationScore: 85,
  answerQualityScore: 84,
  confidenceScore: 80,
  relevanceScore: 89,
  strengths: [
    'Strong command of Object-Oriented Principles and Java memory management.',
    'Clear structure when articulating complex multi-threaded concurrency models.',
    'Accurately highlighted Java 8 default methods and Java 9 private methods in interface evolution.',
    'Confident tone and professional technical vocabulary throughout the session.',
  ],
  improvements: [
    'Elaborate more on practical production edge cases (e.g., memory leaks with thread locals).',
    'Structure responses using the STAR method (Situation, Task, Action, Result) for architecture trade-offs.',
    'Explicitly discuss time and space complexity metrics earlier when comparing data structures.',
  ],
  questionReviews: [
    {
      questionId: 'q1',
      order: 1,
      question: 'What is the fundamental difference between an interface and an abstract class in Java?',
      candidateAnswer: 'An interface defines a contract that multiple classes can implement, while an abstract class can maintain state and default constructors. Since Java 8, interfaces also support default and static methods.',
      score: 90,
      evaluation: 'Crisp and accurate explanation covering both theoretical concepts and modern Java version updates.',
      improvementSuggestion: 'Mention that interfaces cannot declare instance fields (only public static final constants).',
      keyPointsCovered: ['Contract vs State', 'Multiple implementation', 'Java 8 default methods'],
      keyPointsMissed: ['Field modifier constraints'],
    },
    {
      questionId: 'q2',
      order: 2,
      question: 'How does the JVM Garbage Collector identify unreachable objects?',
      candidateAnswer: 'The JVM uses GC Roots like local variables on stack frames, active threads, and static variables to trace live objects. Objects without a path to GC root are collected.',
      score: 85,
      evaluation: 'Great understanding of reachability analysis and root pointers.',
      improvementSuggestion: 'Briefly differentiate between Mark-and-Sweep, Copying GC, and Generational G1 collectors.',
      keyPointsCovered: ['GC Roots', 'Reachability graph', 'Stack and static references'],
      keyPointsMissed: ['Specific GC collectors (G1, ZGC)'],
    },
  ],
  recommendation: 'You have a solid technical foundation in Java core concepts. To reach senior-level interview readiness, practice explaining distributed system failure modes and latency trade-offs under high concurrency.',
  nextSteps: [
    'Practice 5 medium-difficulty Concurrency & Multithreading questions on RECRUIT X.',
    'Review JVM memory profiling techniques (JProfiler, VisualVM, heap dumps).',
    'Schedule a Full Stack System Design mock interview to practice architectural breadth.',
  ],
};
