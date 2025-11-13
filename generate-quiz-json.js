const fs = require('fs');
const path = require('path');

function generateQuizJSON() {
    const coursesDir = './Courses';
    const quizzesDir = './quizzes';
    
    console.log('📁 Scanning Courses directory...');
    
    try {
        // Ensure quizzes directory exists
        if (!fs.existsSync(quizzesDir)) {
            fs.mkdirSync(quizzesDir, { recursive: true });
            console.log('✅ Created quizzes directory');
        }
        
        // Get all course folders
        const courseFolders = fs.readdirSync(coursesDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        
        let totalFilesCreated = 0;
        let totalChaptersFound = 0;
        
        courseFolders.forEach(courseName => {
            const coursePath = path.join(coursesDir, courseName);
            const courseSlug = courseName.toLowerCase().replace(/\s+/g, '-');
            const courseQuizzesDir = path.join(quizzesDir, courseSlug);
            
            // Create course directory in quizzes
            if (!fs.existsSync(courseQuizzesDir)) {
                fs.mkdirSync(courseQuizzesDir, { recursive: true });
            }
            
            // Get all subject folders
            const subjectFolders = fs.readdirSync(coursePath, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            
            subjectFolders.forEach(subjectName => {
                const subjectPath = path.join(coursePath, subjectName);
                const subjectSlug = subjectName.toLowerCase().replace(/\s+/g, '-');
                const jsonFilePath = path.join(courseQuizzesDir, `${subjectSlug}.json`);
                
                // Get all chapters (markdown files)
                const chapterFiles = fs.readdirSync(subjectPath)
                    .filter(file => file.endsWith('.md') && !file.startsWith('_'))
                    .map(file => {
                        const fileNameWithoutExt = path.basename(file, '.md');
                        return fileNameWithoutExt.toLowerCase().replace(/\s+/g, '-');
                    });
                
                totalChaptersFound += chapterFiles.length;
                
                // Create JSON structure
                const quizData = {};
                chapterFiles.forEach(chapterSlug => {
                    quizData[chapterSlug] = []; // Empty array for questions
                });
                
                // Write JSON file (only if it doesn't exist or is empty)
                if (!fs.existsSync(jsonFilePath) || fs.statSync(jsonFilePath).size === 0) {
                    fs.writeFileSync(jsonFilePath, JSON.stringify(quizData, null, 2));
                    console.log(`✅ Created: quizzes/${courseSlug}/${subjectSlug}.json`);
                    totalFilesCreated++;
                } else {
                    console.log(`⏭️  Skipped: quizzes/${courseSlug}/${subjectSlug}.json (already exists)`);
                }
            });
        });
        
        console.log('\n🎉 Generation Complete!');
        console.log(`📊 Created ${totalFilesCreated} new JSON files`);
        console.log(`📚 Found ${totalChaptersFound} chapters across all courses`);
        console.log(`📍 JSON files are ready in the /quizzes/ directory`);
        console.log('\n💡 Next steps:');
        console.log('   1. Open the JSON files and add your questions');
        console.log('   2. Each chapter array should contain question objects like:');
        console.log(`      {
        "question": "Your question here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correct": 0,
        "explanation": "Explanation of the answer"
      }`);
        
    } catch (error) {
        console.error('❌ Error generating quiz JSON:', error);
    }
}

// Run the generator
generateQuizJSON();