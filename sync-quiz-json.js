const fs = require('fs');
const path = require('path');

function syncQuizJSON() {
    const coursesDir = './Courses';
    const quizzesDir = './quizzes';
    
    console.log('🔄 Smart Sync Generator Started...\n');
    
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
        
        let totalFilesUpdated = 0;
        let totalNewChapters = 0;
        const orphanedChapters = [];
        
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
                
                // Get current chapters from file system
                const currentChapters = fs.readdirSync(subjectPath)
                    .filter(file => file.endsWith('.md') && !file.startsWith('_'))
                    .map(file => {
                        const fileNameWithoutExt = path.basename(file, '.md');
                        return fileNameWithoutExt.toLowerCase().replace(/\s+/g, '-');
                    });
                
                // Load existing JSON data or create new
                let existingData = {};
                if (fs.existsSync(jsonFilePath)) {
                    try {
                        existingData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
                        console.log(`📖 Loaded existing: ${courseSlug}/${subjectSlug}.json`);
                    } catch (error) {
                        console.log(`❌ Error reading ${jsonFilePath}, creating new file`);
                        existingData = {};
                    }
                }
                
                // Track changes
                let fileUpdated = false;
                const newChapters = [];
                const missingChapters = [];
                
                // Add new chapters from file system
                currentChapters.forEach(chapterSlug => {
                    if (!existingData.hasOwnProperty(chapterSlug)) {
                        existingData[chapterSlug] = [];
                        newChapters.push(chapterSlug);
                        fileUpdated = true;
                        totalNewChapters++;
                    }
                });
                
                // Identify orphaned chapters (in JSON but no .md file)
                Object.keys(existingData).forEach(chapterSlug => {
                    if (!currentChapters.includes(chapterSlug)) {
                        missingChapters.push(chapterSlug);
                        orphanedChapters.push({
                            course: courseSlug,
                            subject: subjectSlug,
                            chapter: chapterSlug,
                            questionCount: existingData[chapterSlug].length
                        });
                    }
                });
                
                // Write updated JSON file if changes were made
                if (fileUpdated || !fs.existsSync(jsonFilePath)) {
                    fs.writeFileSync(jsonFilePath, JSON.stringify(existingData, null, 2));
                    console.log(`✅ Updated: ${courseSlug}/${subjectSlug}.json`);
                    
                    if (newChapters.length > 0) {
                        console.log(`   ➕ Added chapters: ${newChapters.join(', ')}`);
                    }
                    
                    totalFilesUpdated++;
                } else {
                    console.log(`⏭️  No changes: ${courseSlug}/${subjectSlug}.json`);
                }
                
                // Report missing files
                if (missingChapters.length > 0) {
                    console.log(`   ⚠️  Orphaned chapters: ${missingChapters.join(', ')}`);
                }
            });
        });
        
        // Summary Report
        console.log('\n📊 Sync Complete!');
        console.log(`✅ Updated ${totalFilesUpdated} JSON files`);
        console.log(`🆕 Added ${totalNewChapters} new chapters`);
        
        if (orphanedChapters.length > 0) {
            console.log('\n⚠️  Orphaned Chapters Found:');
            orphanedChapters.forEach(orphan => {
                console.log(`   📂 ${orphan.course}/${orphan.subject}/${orphan.chapter}`);
                console.log(`      Questions: ${orphan.questionCount} (file missing from Courses/)`);
            });
            console.log('\n💡 Orphaned chapters are preserved with their questions.');
            console.log('   If you renamed files, update the chapter slugs in JSON.');
            console.log('   If you deleted files, manually remove the chapters from JSON.');
        }
        
        if (totalFilesUpdated === 0 && totalNewChapters === 0) {
            console.log('🎉 Everything is already in sync!');
        }
        
    } catch (error) {
        console.error('❌ Error during sync:', error);
    }
}

// Run the sync
syncQuizJSON();