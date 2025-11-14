module.exports = function(eleventyConfig) {
  return function(collectionApi) {
    const allItems = collectionApi.getAll();
    
    const searchableItems = allItems.filter(item => {
      // Include only pages that should be searchable
      return item.data.searchable !== false && 
             item.outputPath && 
             item.outputPath.endsWith('.html') &&
             !item.url.includes('/admin/') && // Exclude admin pages
             item.data.title; // Must have a title
    });

    return searchableItems.map(item => {
      // Extract plain text from content (remove HTML tags)
      let content = item.template?.frontMatter?.content || item.content || '';
      content = content.replace(/<[^>]*>/g, ' '); // Remove HTML tags
      content = content.replace(/\s+/g, ' ').trim(); // Normalize whitespace
      
      return {
        url: item.url,
        title: item.data.title,
        content: content.substring(0, 1000), // Limit content length
        description: item.data.description || '',
        tags: Array.isArray(item.data.tags) ? item.data.tags : [],
        date: item.date,
        layout: item.data.layout
      };
    });
  };
};