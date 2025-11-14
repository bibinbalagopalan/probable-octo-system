const lunr = require('lunr');

module.exports = class SearchIndex {
  async data() {
    return {
      permalink: '/search-index.json',
      eleventyExcludeFromCollections: true
    };
  }

  render(data) {
    const searchData = data.collections.searchData || [];
    
    // Build Lunr index
    const index = lunr(function() {
      this.ref('url');
      this.field('title', { boost: 10 });
      this.field('content', { boost: 5 });
      this.field('description', { boost: 3 });
      this.field('tags', { boost: 2 });

      searchData.forEach(doc => {
        this.add(doc);
      });
    });

    // Return both index and data
    return JSON.stringify({
      index: index,
      documents: searchData.reduce((acc, doc) => {
        acc[doc.url] = {
          title: doc.title,
          description: doc.description,
          tags: doc.tags
        };
        return acc;
      }, {})
    });
  }
};