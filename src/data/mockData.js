// Seed data shared across Student / Faculty / Admin portals.
// In a production build this would come from a REST/GraphQL API + a real
// video/signalling backend (e.g. WebRTC SFU) for the multi-student feeds.

export const currentStudent = {
  id: 'STU-2025-118',
  name: 'Santosh Reddy',
  email: 'santosh.cs@college.edu',
  course: 'B.Tech CSE, 6th Semester'
}

export const currentFaculty = {
  id: 'FAC-041',
  name: 'Dr. Priya Sharma',
  role: 'Faculty',
  dept: 'Computer Science'
}

export const currentAdmin = {
  id: 'ADM-001',
  name: 'Admin User',
  role: 'Super Admin'
}

export const upcomingExam = {
  id: 'EX-DSA-2025',
  title: 'Data Structures and Algorithms',
  subtitle: 'End Semester Exam',
  date: 'May 18, 2025',
  time: '11:00 AM - 01:00 PM',
  duration: 120, // minutes
  totalQuestions: 25
}

export const questionBank = [
  { id: 1, text: 'What is the time complexity of binary search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, marks: 1 },
  { id: 2, text: 'Which data structure uses FIFO order?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1, marks: 1 },
  { id: 3, text: 'What is the worst-case time complexity of Quick Sort?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], answer: 2, marks: 1 },
  { id: 4, text: 'A binary tree where every node has 0 or 2 children is called?', options: ['Full binary tree', 'Complete binary tree', 'Skewed tree', 'AVL tree'], answer: 0, marks: 1 },
  { id: 5, text: 'Which of the following is not a linear data structure?', options: ['Array', 'Linked List', 'Tree', 'Stack'], answer: 2, marks: 1 },
  { id: 6, text: 'What is the space complexity of merge sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'], answer: 2, marks: 1 },
  { id: 7, text: 'Which traversal visits the root node first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], answer: 1, marks: 1 },
  { id: 8, text: 'A hash table resolves collisions using linked lists — this is called?', options: ['Open addressing', 'Chaining', 'Probing', 'Rehashing'], answer: 1, marks: 1 },
  { id: 9, text: 'Which sorting algorithm is stable?', options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'], answer: 2, marks: 1 },
  { id: 10, text: 'The maximum number of children a node can have in a binary tree is?', options: ['1', '2', '3', 'Unlimited'], answer: 1, marks: 1 },
  { id: 11, text: 'Dijkstra\u2019s algorithm is used to find?', options: ['Minimum spanning tree', 'Shortest path', 'Topological sort', 'Strongly connected components'], answer: 1, marks: 1 },
  { id: 12, text: 'Which data structure is used in recursion?', options: ['Queue', 'Stack', 'Array', 'Graph'], answer: 1, marks: 1 },
  { id: 13, text: 'What is the average time complexity of a hash table lookup?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], answer: 0, marks: 1 },
  { id: 14, text: 'Which of these is a self-balancing binary search tree?', options: ['B-Tree', 'AVL Tree', 'Trie', 'Heap'], answer: 1, marks: 1 },
  { id: 15, text: 'What is the time complexity of binary search?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1, marks: 1 },
  { id: 16, text: 'Which of these operations is NOT O(1) on average for a dynamic array?', options: ['Access by index', 'Push at end', 'Insert at beginning', 'Peek at end'], answer: 2, marks: 1 },
  { id: 17, text: 'A graph with no cycles is called a?', options: ['Tree', 'DAG', 'Both Tree and DAG can apply', 'Complete graph'], answer: 2, marks: 1 },
  { id: 18, text: 'Which algorithm uses a greedy approach for MST?', options: ['Bellman-Ford', 'Kruskal\u2019s', 'Floyd-Warshall', 'DFS'], answer: 1, marks: 1 },
  { id: 19, text: 'What does BFS use internally to visit nodes level-by-level?', options: ['Stack', 'Queue', 'Priority Queue', 'Recursion only'], answer: 1, marks: 1 },
  { id: 20, text: 'What is the height of a balanced binary tree with n nodes?', options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 1, marks: 1 }
]

export const pastResults = [
  { exam: 'Data Structures and Algorithms', date: 'May 18, 2025', duration: '120 Min', score: null, status: 'Completed' },
  { exam: 'Database Management Systems', date: 'May 12, 2025', duration: '90 Min', score: '78 / 100', status: 'Completed' },
  { exam: 'Operating Systems', date: 'May 05, 2025', duration: '90 Min', score: '85 / 100', status: 'Completed' },
  { exam: 'Computer Networks', date: 'Apr 28, 2025', duration: '90 Min', score: '92 / 100', status: 'Completed' }
]

export const studentRoster = [
  { id: 'STU-101', name: 'Rahul Kumar', score: 92, grade: 'A', status: 'Passed', flagged: false },
  { id: 'STU-102', name: 'Sneha Reddy', score: 85, grade: 'A', status: 'Passed', flagged: false },
  { id: 'STU-103', name: 'Amit Verma', score: 55, grade: 'C', status: 'Passed', flagged: true, flagReason: 'Multiple People Detected' },
  { id: 'STU-104', name: 'John Mathew', score: 32, grade: 'F', status: 'Failed', flagged: false },
  { id: 'STU-105', name: 'Pooja Singh', score: 74, grade: 'B', status: 'Passed', flagged: false },
  { id: 'STU-106', name: 'Rohan Das', score: 61, grade: 'C', status: 'Passed', flagged: true, flagReason: 'Looking Away Frequently' },
  { id: 'STU-107', name: 'Irfan Khan', score: 88, grade: 'A', status: 'Passed', flagged: false },
  { id: 'STU-108', name: 'Neha Joshi', score: 45, grade: 'D', status: 'Passed', flagged: true, flagReason: 'Mobile Phone Detected' },
  { id: 'STU-109', name: 'Arjun Nair', score: 79, grade: 'B', status: 'Passed', flagged: false }
]

export const scoreDistribution = [
  { name: '80-100', value: 42, color: '#16a34a' },
  { name: '60-79', value: 45, color: '#2563eb' },
  { name: '40-59', value: 20, color: '#d97706' },
  { name: '0-39', value: 13, color: '#dc2626' }
]

export const adminRecentExams = [
  { name: 'Data Structures', date: 'May 18, 2025 10:00 AM', duration: '120 Min', students: 120, status: 'Live' },
  { name: 'Database Systems', date: 'May 17, 2025 02:00 PM', duration: '90 Min', students: 95, status: 'Completed' },
  { name: 'Operating Systems', date: 'May 16, 2025 10:00 AM', duration: '90 Min', students: 100, status: 'Completed' },
  { name: 'Computer Networks', date: 'May 15, 2025 02:00 PM', duration: '90 Min', students: 80, status: 'Completed' }
]

export const systemAlertsSeed = [
  { time: '10:15 AM', text: '3 students detected with multiple faces', level: 'warn' },
  { time: '10:12 AM', text: '5 suspicious activities detected', level: 'danger' },
  { time: '09:58 AM', text: '2 students switched tabs multiple times', level: 'warn' }
]

export const simulatedStudentFeed = [
  { id: 'STU-101', name: 'Rahul Kumar', hue: 205 },
  { id: 'STU-102', name: 'Sneha Reddy', hue: 330 },
  { id: 'STU-103', name: 'Amit Verma', hue: 25 },
  { id: 'STU-105', name: 'Pooja Singh', hue: 150 },
  { id: 'STU-106', name: 'Rohan Das', hue: 265 },
  { id: 'STU-107', name: 'Irfan Khan', hue: 45 },
  { id: 'STU-108', name: 'Neha Joshi', hue: 190 },
  { id: 'STU-109', name: 'Arjun Nair', hue: 100 }
]
