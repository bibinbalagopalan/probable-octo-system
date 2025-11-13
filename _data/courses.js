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