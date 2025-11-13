/*
module.exports = class CoursePage {
  data() {
    return {
      layout: 'layout.njk',
      pagination: {
        data: 'courses',
        size: 1,
        alias: 'course'
      },
      permalink: function(data) {
        // Add safety check for slug
        const slug = data.course.slug || data.course.name.toLowerCase().replace(/\s+/g, '-');
        return `/courses/${slug}/index.html`;
      },
      eleventyComputed: {
        title: function(data) {
          return `${data.course.name} | Jeevadhara`;
        }
      }
    };
  }

  render(data) {
    const { course } = data;
    
    // Safety check - if course data is missing, show error
    if (!course || !course.name) {
      return `
        <!DOCTYPE html>
        <html>
        <head><title>Error</title></head>
        <body>
          <h1>Course not found</h1>
          <a href="/">Back to Home</a>
        </body>
        </html>
      `;
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${course.name} | Jeevadhara</title>
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --primary-accent: #fcd800;
            --secondary-accent: #6ab0ff;
            --background-dark: rgba(30, 30, 46, 0.8);
            --content-dark: rgba(42, 42, 62, 0.8);
            --border-dark: rgba(255, 255, 255, 0.1);
        }
        body {
            font-family: 'Ubuntu', sans-serif;
            background: linear-gradient(135deg, #0a0a1a 0%, #000 100%); 
            color: #f0f0f0;
            line-height: 1.6;
            min-height: 100vh;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        header { text-align: center; margin-bottom: 40px; padding: 30px 0; border-bottom: 1px solid var(--border-dark); }
        h1 { font-size: 2.8rem; font-weight: 700; background: linear-gradient(90deg, var(--secondary-accent), #a8d2ff); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 15px; }
        .subtitle { font-size: 1.3rem; color: #aaa; font-weight: 300; margin: 0 auto 20px; }
        .back-link { display: inline-block; color: var(--primary-accent); text-decoration: none; font-weight: 500; transition: color 0.3s; margin-top: 10px; }
        .back-link:hover { color: #ffe64d; }
        main.course-accordion-area { background: var(--background-dark); border-radius: 15px; padding: 20px; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
        .subject-item { margin-bottom: 10px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-dark); }
        .subject-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: var(--content-dark); cursor: pointer; transition: background 0.3s; outline: none; }
        .subject-header:hover, .subject-header:focus { background: rgba(50, 50, 70, 0.8); box-shadow: inset 0 0 0 2px var(--primary-accent); }
        .subject-title { font-size: 1.3rem; font-weight: 500; color: var(--primary-accent); }
        .toggle-icon { font-size: 1.2rem; transition: transform 0.3s; }
        .subject-content { max-height: 0; overflow: hidden; transition: max-height 0.4s ease-in-out; background: rgba(30, 30, 46, 0.5); padding: 0 20px; }
        .subject-content.expanded { max-height: 2000px; padding: 20px; }
        .chapter-item { margin-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 15px; }
        .chapter-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 10px 0; transition: color 0.3s; color: #fff; font-weight: 500; outline: none; }
        .chapter-header:hover, .chapter-header:focus { color: var(--secondary-accent); }
        .chapter-title-text { font-size: 1.1rem; }
        .chapter-links { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-in-out; padding-left: 20px; background: rgba(0, 0, 0, 0.1); border-radius: 0 0 5px 5px; }
        .chapter-links.expanded { max-height: 500px; padding: 10px 20px; }
        .chapter-links a { display: block; padding: 8px 10px; color: var(--secondary-accent); text-decoration: none; border-radius: 4px; transition: background 0.3s; }
        .chapter-links a:hover { background: rgba(106, 176, 255, 0.1); }
        .chapter-links .quiz-link { color: var(--primary-accent); }
        .chapter-links .quiz-link:hover { background: rgba(252, 216, 0, 0.1); }
        @media (max-width: 768px) {
            h1 { font-size: 2.2rem; }
            .subtitle { font-size: 1.1rem; }
            .subject-title { font-size: 1.1rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${course.name}</h1>
            <p class="subtitle">Explore comprehensive preparation materials for ${course.name}</p>
            <a href="/" class="back-link">← Back to All Courses</a>
        </header>

        <main class="course-accordion-area" role="main">
            <h2 style="font-size: 1.8rem; color: #fff; margin-bottom: 25px; text-align: center;">Course Curriculum</h2>
            <div id="course-accordion">
                ${course.subjects && course.subjects.length > 0 ? course.subjects.map((subject, subjectIndex) => `
                    <div class="subject-item">
                        <div class="subject-header" role="button" aria-expanded="false" tabindex="0" id="subject-header-${subjectIndex}">
                            <div class="subject-details">
                                <div class="subject-title">${subject.name}</div>
                            </div>
                            <span class="toggle-icon">▼</span>
                        </div>
                        <div class="subject-content" aria-labelledby="subject-header-${subjectIndex}">
                            ${subject.chapters && subject.chapters.length > 0 ? subject.chapters.map((chapter, chapterIndex) => `
                                <div class="chapter-item">
                                    <div class="chapter-header" role="button" aria-expanded="false" tabindex="0" id="chapter-header-${subjectIndex}-${chapterIndex}">
                                        <span class="chapter-title-text">${chapter.name}</span>
                                        <span class="toggle-icon">▼</span>
                                    </div>
                                    <div class="chapter-links" aria-labelledby="chapter-header-${subjectIndex}-${chapterIndex}">
                                        <a href="${chapter.url}" class="study-link">Study Material</a>
                                        <a href="/quiz/?course=${course.slug || course.name.toLowerCase().replace(/\\s+/g, '-')}&subject=${subject.slug || subject.name.toLowerCase().replace(/\\s+/g, '-')}&chapter=${chapter.slug || chapter.name.toLowerCase().replace(/\\s+/g, '-')}" class="quiz-link">Practice Quiz</a>
                                    </div>
                                </div>
                            `).join('') : '<p style="color: #aaa; padding: 20px; text-align: center;">No chapters available yet.</p>'}
                        </div>
                    </div>
                `).join('') : '<p style="color: #aaa; padding: 40px; text-align: center;">No subjects available for this course yet.</p>'}
            </div>
        </main>
    </div>

    <script>
        function toggleAccordion(header, content, icon) {
            const isExpanded = content.classList.toggle('expanded');
            header.setAttribute('aria-expanded', isExpanded);
            icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.subject-header').forEach((header) => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.toggle-icon');
                
                header.addEventListener('click', () => toggleAccordion(header, content, icon));
                header.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAccordion(header, content, icon);
                    }
                });
            });

            document.querySelectorAll('.chapter-header').forEach((header) => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.toggle-icon');
                
                header.addEventListener('click', () => toggleAccordion(header, content, icon));
                header.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAccordion(header, content, icon);
                    }
                });
            });
        });
    </script>
</body>
</html>
    `;
  }
}; */

const fs = require('fs');
const path = require('path');

module.exports = class CoursePage {
  data() {
    return {
      layout: 'layout.njk',
      pagination: {
        data: 'courses',
        size: 1,
        alias: 'course'
      },
      permalink: function(data) {
        // Add safety check for slug
        const slug = data.course.slug || data.course.name.toLowerCase().replace(/\s+/g, '-');
        return `/courses/${slug}/index.html`;
      },
      eleventyComputed: {
        title: function(data) {
          return `${data.course.name} | Jeevadhara`;
        }
      }
    };
  }

  render(data) {
    const { course } = data;
    
    // Safety check - if course data is missing, show error
    if (!course || !course.name) {
      return `
        <!DOCTYPE html>
        <html>
        <head><title>Error</title></head>
        <body>
          <h1>Course not found</h1>
          <a href="/">Back to Home</a>
        </body>
        </html>
      `;
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${course.name} | Jeevadhara</title>
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --primary-accent: #fcd800;
            --secondary-accent: #6ab0ff;
            --background-dark: rgba(30, 30, 46, 0.8);
            --content-dark: rgba(42, 42, 62, 0.8);
            --border-dark: rgba(255, 255, 255, 0.1);
        }
        body {
            font-family: 'Ubuntu', sans-serif;
            background: linear-gradient(135deg, #0a0a1a 0%, #000 100%); 
            color: #f0f0f0;
            line-height: 1.6;
            min-height: 100vh;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 20px; }
        header { text-align: center; margin-bottom: 40px; padding: 30px 0; border-bottom: 1px solid var(--border-dark); }
        h1 { font-size: 2.8rem; font-weight: 700; background: linear-gradient(90deg, var(--secondary-accent), #a8d2ff); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 15px; }
        .subtitle { font-size: 1.3rem; color: #aaa; font-weight: 300; margin: 0 auto 20px; }
        .back-link { display: inline-block; color: var(--primary-accent); text-decoration: none; font-weight: 500; transition: color 0.3s; margin-top: 10px; }
        .back-link:hover { color: #ffe64d; }
        main.course-accordion-area { background: var(--background-dark); border-radius: 15px; padding: 20px; backdrop-filter: blur(10px); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3); }
        .subject-item { margin-bottom: 10px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-dark); }
        .subject-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: var(--content-dark); cursor: pointer; transition: background 0.3s; outline: none; }
        .subject-header:hover, .subject-header:focus { background: rgba(50, 50, 70, 0.8); box-shadow: inset 0 0 0 2px var(--primary-accent); }
        .subject-title { font-size: 1.3rem; font-weight: 500; color: var(--primary-accent); }
        .toggle-icon { font-size: 1.2rem; transition: transform 0.3s; }
        .subject-content { max-height: 0; overflow: hidden; transition: max-height 0.4s ease-in-out; background: rgba(30, 30, 46, 0.5); padding: 0 20px; }
        .subject-content.expanded { max-height: 2000px; padding: 20px; }
        .chapter-item { margin-bottom: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 15px; }
        .chapter-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding: 10px 0; transition: color 0.3s; color: #fff; font-weight: 500; outline: none; }
        .chapter-header:hover, .chapter-header:focus { color: var(--secondary-accent); }
        .chapter-title-text { font-size: 1.1rem; }
        .chapter-links { max-height: 0; overflow: hidden; transition: max-height 0.3s ease-in-out; padding-left: 20px; background: rgba(0, 0, 0, 0.1); border-radius: 0 0 5px 5px; }
        .chapter-links.expanded { max-height: 500px; padding: 10px 20px; }
        .chapter-links a { display: block; padding: 8px 10px; color: var(--secondary-accent); text-decoration: none; border-radius: 4px; transition: background 0.3s; }
        .chapter-links a:hover { background: rgba(106, 176, 255, 0.1); }
        .chapter-links .quiz-link { color: var(--primary-accent); }
        .chapter-links .quiz-link:hover { background: rgba(252, 216, 0, 0.1); }
        footer { text-align: center; margin-top: 50px; padding: 20px 0; color: #777; font-size: 0.9rem; border-top: 1px solid var(--border-dark); }
        @media (max-width: 768px) {
            h1 { font-size: 2.2rem; }
            .subtitle { font-size: 1.1rem; }
            .subject-title { font-size: 1.1rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${course.name}</h1>
            <p class="subtitle">Explore comprehensive preparation materials for ${course.name}</p>
            <a href="/" class="back-link">← Back to All Courses</a>
        </header>

        <main class="course-accordion-area" role="main">
            <h2 style="font-size: 1.8rem; color: #fff; margin-bottom: 25px; text-align: center;">Course Curriculum</h2>
            <div id="course-accordion">
                ${course.subjects && course.subjects.length > 0 ? course.subjects.map((subject, subjectIndex) => `
                    <div class="subject-item">
                        <div class="subject-header" role="button" aria-expanded="false" tabindex="0" id="subject-header-${subjectIndex}">
                            <div class="subject-details">
                                <div class="subject-title">${subject.name}</div>
                            </div>
                            <span class="toggle-icon">▼</span>
                        </div>
                        <div class="subject-content" aria-labelledby="subject-header-${subjectIndex}">
                            ${subject.chapters && subject.chapters.length > 0 ? subject.chapters.map((chapter, chapterIndex) => `
                                <div class="chapter-item">
                                    <div class="chapter-header" role="button" aria-expanded="false" tabindex="0" id="chapter-header-${subjectIndex}-${chapterIndex}">
                                        <span class="chapter-title-text">${chapter.name}</span>
                                        <span class="toggle-icon">▼</span>
                                    </div>
                                    <div class="chapter-links" aria-labelledby="chapter-header-${subjectIndex}-${chapterIndex}">
                                        <a href="${chapter.url}" class="study-link">Study Material</a>
                                        <a href="/quiz/?course=${course.slug}&subject=${subject.slug}&chapter=${chapter.slug}" class="quiz-link">Practice Quiz</a>
                                    </div>
                                </div>
                            `).join('') : '<p style="color: #aaa; padding: 20px; text-align: center;">No chapters available yet.</p>'}
                        </div>
                    </div>
                `).join('') : '<p style="color: #aaa; padding: 40px; text-align: center;">No subjects available for this course yet.</p>'}
            </div>
        </main>

        <footer>
            <p>© ${new Date().getFullYear()} Jeevadhara. All content is freely accessible.</p>
        </footer>
    </div>

    <script>
        function toggleAccordion(header, content, icon) {
            const isExpanded = content.classList.toggle('expanded');
            header.setAttribute('aria-expanded', isExpanded);
            icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
        }

        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('.subject-header').forEach((header) => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.toggle-icon');
                
                header.addEventListener('click', () => toggleAccordion(header, content, icon));
                header.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAccordion(header, content, icon);
                    }
                });
            });

            document.querySelectorAll('.chapter-header').forEach((header) => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.toggle-icon');
                
                header.addEventListener('click', () => toggleAccordion(header, content, icon));
                header.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAccordion(header, content, icon);
                    }
                });
            });
        });
    </script>
</body>
</html>
    `;
  }
};