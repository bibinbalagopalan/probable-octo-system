/* module.exports = [
  {
    id: 1,
    name: "NEET-UG",
    subjects: [
      {
        name: "Biology",
        chapters: [
          { name: "Botany", url: "#" },
          { name: "Zoology", url: "#" },
          { name: "Genetics", url: "#" },
          { name: "Ecology", url: "#" }
        ]
      },
      {
        name: "Chemistry",
        chapters: [
          { name: "Organic Chemistry", url: "#" },
          { name: "Inorganic Chemistry", url: "#" },
          { name: "Physical Chemistry", url: "#" }
        ]
      },
      {
        name: "Physics",
        chapters: [
          { name: "Mechanics", url: "#" },
          { name: "Optics", url: "#" },
          { name: "Electromagnetism", url: "#" },
          { name: "Thermodynamics", url: "#" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "NEET-PG",
    subjects: [
      {
        name: "Anatomy",
        chapters: [
          { name: "Gross Anatomy", url: "#" },
          { name: "Histology", url: "#" },
          { name: "Embryology", url: "#" }
        ]
      },
      {
        name: "Physiology",
        chapters: [
          { name: "Cardiovascular", url: "#" },
          { name: "Respiratory", url: "#" },
          { name: "Neurophysiology", url: "#" }
        ]
      },
      {
        name: "Biochemistry",
        chapters: [
          { name: "Metabolism", url: "#" },
          { name: "Enzymology", url: "#" },
          { name: "Molecular Biology", url: "#" }
        ]
      }
    ]
  },
  {
    id: 3,
    name: "AIAPGET (AYU)",
    subjects: [
      {
        name: "Ayurveda",
        chapters: [
          { name: "Basic Principles", url: "#" },
          { name: "Dravyaguna", url: "#" },
          { name: "Rasashastra", url: "#" }
        ]
      },
      {
        name: "Modern Medicine",
        chapters: [
          { name: "Pathology", url: "#" },
          { name: "Pharmacology", url: "#" },
          { name: "Medicine", url: "#" }
        ]
      }
    ]
  }
]; */

const fs = require('fs');
const path = require('path');

module.exports = function() {
  const coursesDir = './Courses'; // Directly pointing to Courses folder
  const courses = [];
  
  try {
    // Check if courses directory exists
    if (!fs.existsSync(coursesDir)) {
      console.warn(`Courses directory not found: ${coursesDir}`);
      return [];
    }
    
    // Get all course folders
    const courseFolders = fs.readdirSync(coursesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    courseFolders.forEach((courseName, index) => {
      const coursePath = path.join(coursesDir, courseName);
      const course = {
        id: index + 1,
        name: courseName,
        subjects: []
      };
      
      // Get all subject folders inside course folder
      const subjectFolders = fs.readdirSync(coursePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      subjectFolders.forEach(subjectName => {
        const subjectPath = path.join(coursePath, subjectName);
        const subject = {
          name: subjectName,
          chapters: []
        };
        
        // Get all .md files inside subject folder
        const mdFiles = fs.readdirSync(subjectPath)
          .filter(file => file.endsWith('.md') && !file.startsWith('_'))
          .map(file => {
            const fileNameWithoutExt = path.basename(file, '.md');
            // Create URL path
            const url = `/courses/${courseName}/${subjectName}/${fileNameWithoutExt}/`;
            
            return {
              name: fileNameWithoutExt,
              url: url
            };
          });
        
        subject.chapters = mdFiles;
        course.subjects.push(subject);
      });
      
      courses.push(course);
    });
    
    return courses;
    
  } catch (error) {
    console.error('Error building courses data:', error);
    return [];
  }
};