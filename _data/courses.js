const fs = require('fs');
const path = require('path');

module.exports = function() {
  const coursesDir = './Courses';
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
    
    console.log('🔄 Scanning courses directory...');
    console.log('📁 Found courses:', courseFolders);
    
    courseFolders.forEach((courseName, index) => {
      const coursePath = path.join(coursesDir, courseName);
      
      // Generate course slug
      const courseSlug = courseName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[()]/g, '')
        .replace(/[^\w-]/g, '');
      
      const course = {
        id: index + 1,
        name: courseName,
        slug: courseSlug,
        subjects: []
      };
      
      // Get all subject folders inside course folder
      const subjectFolders = fs.readdirSync(coursePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      console.log(`📚 Course "${courseName}" (slug: ${courseSlug}) has subjects:`, subjectFolders);
      
      subjectFolders.forEach(subjectName => {
        const subjectPath = path.join(coursePath, subjectName);
        
        // Generate subject slug
        const subjectSlug = subjectName.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[()]/g, '')
          .replace(/[^\w-]/g, '');
        
        const subject = {
          name: subjectName,
          slug: subjectSlug,
          chapters: []
        };
        
        // Get all .md files inside subject folder
        const mdFiles = fs.readdirSync(subjectPath)
          .filter(file => file.endsWith('.md') && !file.startsWith('_'))
          .map(file => {
            const fileNameWithoutExt = path.basename(file, '.md');
            
            // Generate chapter slug
            const chapterSlug = fileNameWithoutExt.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[()]/g, '')
              .replace(/[^\w-]/g, '');
            
            // Create URL path
            const url = `/courses/${courseSlug}/${subjectSlug}/${chapterSlug}/`;
            
            return {
              name: fileNameWithoutExt,
              slug: chapterSlug,
              url: url
            };
          });
        
        console.log(`   📖 Subject "${subjectName}" (slug: ${subjectSlug}) has chapters:`, mdFiles.map(ch => ch.name));
        
        subject.chapters = mdFiles;
        course.subjects.push(subject);
      });
      
      courses.push(course);
    });
    
    console.log('✅ Final courses data:');
    courses.forEach(course => {
      console.log(`   - ${course.name} (${course.slug})`);
      course.subjects.forEach(subject => {
        console.log(`     └─ ${subject.name} (${subject.slug})`);
      });
    });
    
    return courses;
    
  } catch (error) {
    console.error('❌ Error building courses data:', error);
    return [];
  }
};