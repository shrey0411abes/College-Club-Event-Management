export const initialEvents = [
  {
    id: "evt-future-1",
    title: "Intro to Competitive Programming",
    description: "Learn the basics of competitive programming, algorithmic thinking, and how to get started on platforms like CodeChef.",
    category: "Workshop",
    date: "2026-11-15",
    time: "14:00",
    venue: "Computer Lab 1",
    imageUrl: "",
    featured: true,
  },
  {
    id: "evt-future-2",
    title: "Web Development Bootcamp",
    description: "A comprehensive bootcamp covering HTML, CSS, JavaScript, and React. Perfect for beginners wanting to build web apps.",
    category: "Bootcamp",
    date: "2026-11-22",
    time: "10:00",
    venue: "Seminar Hall",
    imageUrl: "",
    featured: false,
  },
  {
    id: "evt-future-3",
    title: "Hackathon: Code Red",
    description: "A 24-hour hackathon to build innovative solutions for real-world problems. Great prizes and mentorship available.",
    category: "Hackathon",
    date: "2026-12-05",
    time: "09:00",
    venue: "Main Auditorium",
    imageUrl: "",
    featured: false,
  },
  {
    id: "evt-future-4",
    title: "Tech Talk: AI and the Future",
    description: "Join us for an insightful talk on Artificial Intelligence, Machine Learning, and what the future holds for tech enthusiasts.",
    category: "Seminar",
    date: "2026-12-12",
    time: "16:00",
    venue: "Seminar Hall",
    imageUrl: "",
    featured: false,
  },
  {
    id: "evt-past-1",
    title: "Git and GitHub for Beginners",
    description: "A hands-on session on version control using Git and GitHub. Essential skills for every developer.",
    category: "Workshop",
    date: "2026-08-10",
    time: "15:00",
    venue: "Computer Lab 2",
    imageUrl: "",
    featured: false,
  },
  {
    id: "evt-past-2",
    title: "Data Structures Crash Course",
    description: "Brush up on your data structures before the interview season. Covering arrays, linked lists, trees, and graphs.",
    category: "Workshop",
    date: "2026-09-05",
    time: "11:00",
    venue: "Computer Lab 1",
    imageUrl: "",
    featured: false,
  }
];

export const initialRegistrations = [
  {
    id: "reg-1",
    eventId: "evt-future-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    collegeYear: "2nd Year",
    createdAt: new Date().toISOString()
  },
  {
    id: "reg-2",
    eventId: "evt-future-1",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "9123456780",
    collegeYear: "3rd Year",
    createdAt: new Date().toISOString()
  },
  {
    id: "reg-3",
    eventId: "evt-future-3",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    phone: "9988776655",
    collegeYear: "1st Year",
    createdAt: new Date().toISOString()
  }
];
