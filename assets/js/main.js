// Mobile Menu Toggle (Updated to include ARIA)
      const menuBtn = document.getElementById('menuBtn');
      const navLinks = document.getElementById('navLinks');
      
      menuBtn.addEventListener('click', () => {
          const isActive = navLinks.classList.toggle('active');
          menuBtn.setAttribute('aria-expanded', isActive);
      });

  // 4. Handle window resize (Removed the empty function, not strictly needed for this logic)
  // window.addEventListener('resize', function() {}); 