// Mark that this script has loaded
window.tagFilterLoaded = true;

document.addEventListener('DOMContentLoaded', function() {
  const tagButtons = document.querySelectorAll('.tag-filter-btn');
  const postItems = document.querySelectorAll('.post-item');
  const showAllButton = document.getElementById('show-all-posts');
  
  // Function to update active button
  function updateActiveButton(activeButton) {
    tagButtons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
  }
  
  // Function to filter posts by tag
  function filterPostsByTag(selectedTag) {
    postItems.forEach(post => {
      const postTags = post.getAttribute('data-tags').split(',');
      if (selectedTag === 'all' || postTags.includes(selectedTag)) {
        post.style.display = 'block';
      } else {
        post.style.display = 'none';
      }
    });
    
    // Hide year headers that have no visible posts
    const yearHeaders = document.querySelectorAll('.archive__subtitle');
    yearHeaders.forEach(header => {
      const nextElements = [];
      let nextElement = header.nextElementSibling;
      
      // Collect all post items until next year header
      while (nextElement && !nextElement.classList.contains('archive__subtitle')) {
        if (nextElement.classList.contains('post-item')) {
          nextElements.push(nextElement);
        }
        nextElement = nextElement.nextElementSibling;
      }
      
      // Show/hide year header based on visible posts
      const hasVisiblePosts = nextElements.some(post => post.style.display !== 'none');
      header.style.display = hasVisiblePosts ? 'block' : 'none';
    });
  }
  
  // Add click event listeners to tag buttons
  tagButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tag = this.getAttribute('data-tag') || 'all';
      updateActiveButton(this);
      filterPostsByTag(tag);
    });
  });
});
