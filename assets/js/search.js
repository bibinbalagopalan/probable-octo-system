class JeevadharaSearch {
  constructor() {
    this.index = null;
    this.documents = null;
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      // Load search index
      const response = await fetch('/search-index.json');
      const searchData = await response.json();
      
      this.index = lunr.Index.load(searchData.index);
      this.documents = searchData.documents;
      this.isInitialized = true;
      
      this.setupEventListeners();
      console.log('Search initialized successfully');
    } catch (error) {
      console.error('Failed to initialize search:', error);
    }
  }

  setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    const searchForm = searchInput.closest('form');

    // Create results container
    const searchResults = document.createElement('div');
    searchResults.id = 'search-results';
    searchResults.className = 'search-results';
    searchForm.appendChild(searchResults);

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      
      searchTimeout = setTimeout(() => {
        const query = e.target.value.trim();
        this.handleSearch(query, searchResults);
      }, 300);
    });

    searchInput.addEventListener('focus', () => {
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        this.handleSearch(query, searchResults);
      }
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchForm.contains(e.target)) {
        searchResults.style.display = 'none';
      }
    });

    // Prevent form submission
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        this.handleSearch(query, searchResults);
      }
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        searchResults.style.display = 'none';
        searchInput.blur();
      }
    });
  }

  handleSearch(query, searchResults) {
    if (!this.isInitialized) {
      searchResults.innerHTML = '<div class="search-loading">Search loading...</div>';
      searchResults.style.display = 'block';
      return;
    }

    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }

    const results = this.search(query);
    this.displayResults(results, query, searchResults);
  }

  search(query) {
    try {
      const searchResults = this.index.search(query);
      
      return searchResults
        .map(result => {
          const doc = this.documents[result.ref];
          if (!doc) return null;
          
          return {
            url: result.ref,
            title: doc.title,
            description: doc.description,
            tags: doc.tags,
            score: result.score
          };
        })
        .filter(Boolean)
        .slice(0, 8);
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  displayResults(results, query, searchResults) {
    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="no-results">
          No results found for "<strong>${this.escapeHtml(query)}</strong>"
        </div>
      `;
      searchResults.style.display = 'block';
      return;
    }

    searchResults.innerHTML = results.map(result => `
      <div class="search-result-item">
        <a href="${result.url}" class="search-result-link">
          <div class="search-result-title">${this.escapeHtml(result.title)}</div>
          ${result.description ? `
            <div class="search-result-desc">${this.escapeHtml(result.description)}</div>
          ` : ''}
          <div class="search-result-meta">
            <div class="search-result-url">${result.url}</div>
            ${result.tags && result.tags.length > 0 ? `
              <div class="search-result-tags">${result.tags.slice(0, 2).join(', ')}</div>
            ` : ''}
          </div>
        </a>
      </div>
    `).join('');

    searchResults.style.display = 'block';
  }

  escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new JeevadharaSearch();
  });
} else {
  new JeevadharaSearch();
}