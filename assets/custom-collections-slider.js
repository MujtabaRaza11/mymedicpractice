document.addEventListener('DOMContentLoaded', () => {
  // Force-reset scroll positions when the page loads
  setTimeout(() => {
    const sliders = document.querySelectorAll('.custom-collections__grid');
    sliders.forEach(slider => {
      // Force slider to start at 0
      slider.scrollLeft = 0;
    });
  }, 100);
  
  const sliders = document.querySelectorAll('.custom-collections__grid');
  
  sliders.forEach(slider => {
    // Force slider to start at 0 immediately
    slider.scrollLeft = 0;
    
    const prevButton = slider.parentNode.querySelector('.custom-collections__slider-arrow--prev');
    const nextButton = slider.parentNode.querySelector('.custom-collections__slider-arrow--next');
    
    if (!prevButton || !nextButton) return;
    
    // Calculate the scroll amount (one card width plus gap)
    const scrollAmount = () => {
      const card = slider.querySelector('.custom-collections__card');
      if (!card) return 340; // Default fallback (320px card + 20px gap)
      return card.offsetWidth + 20; // Card width + gap
    };
    
    // Function to check slider position and update button visibility
    const updateArrowVisibility = () => {
      // Check if at the start - use a stricter condition (exactly 0)
      prevButton.style.display = slider.scrollLeft <= 0 ? 'none' : 'flex';
      
      // Check if at the end
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth - 1;
      nextButton.style.display = slider.scrollLeft >= maxScrollLeft ? 'none' : 'flex';
      
      // Debug info if needed
      console.log(`Scroll position: ${slider.scrollLeft}, Max: ${maxScrollLeft}, First card visible: ${slider.scrollLeft <= 0}`);
    };
    
    // Initial arrow visibility check
    setTimeout(updateArrowVisibility, 300); // Delay to ensure DOM is ready
    
    // Update arrow visibility when window is resized
    window.addEventListener('resize', () => {
      // Reset scroll position when screen size changes
      slider.scrollLeft = 0;
      updateArrowVisibility();
    });
    
    // Update arrow visibility when slider is scrolled
    slider.addEventListener('scroll', updateArrowVisibility);
    
    prevButton.addEventListener('click', () => {
      slider.scrollBy({
        left: -scrollAmount(),
        behavior: 'smooth'
      });
    });
    
    nextButton.addEventListener('click', () => {
      slider.scrollBy({
        left: scrollAmount(),
        behavior: 'smooth'
      });
    });
    
    // Mouse drag functionality
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
      isDown = true;
      slider.classList.add('is-dragging');
      slider.style.cursor = 'grabbing';
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      
      // Prevent default behavior that might interfere with dragging
      e.preventDefault();
    });
    
    slider.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        slider.classList.remove('is-dragging');
        slider.style.cursor = 'grab';
      }
    });
    
    slider.addEventListener('mouseup', () => {
      isDown = false;
      slider.classList.remove('is-dragging');
      slider.style.cursor = 'grab';
      
      // Check arrow visibility after drag ends
      updateArrowVisibility();
    });
    
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5; // Multiply by 1.5 for faster movement
      slider.scrollLeft = scrollLeft - walk;
      
      // Update arrows during drag
      updateArrowVisibility();
    });
    
    // Set initial cursor style for slider
    slider.style.cursor = 'grab';
    
    // Add touch support for mobile
    slider.addEventListener('touchstart', (e) => {
      slider.classList.add('is-dragging');
    }, { passive: true });
    
    slider.addEventListener('touchend', () => {
      slider.classList.remove('is-dragging');
      
      // Check arrow visibility after touch ends
      updateArrowVisibility();
    });
    
    slider.addEventListener('touchmove', () => {
      // Update arrows during touch move
      updateArrowVisibility();
    }, { passive: true });
  });
  
  // Add debug elements to check slider positioning
  if (window.innerWidth <= 1200) {
    console.log('Mobile view detected, configuring slider debug');
    const slider = document.getElementById('collectionsSlider');
    if (slider) {
      // Force slider to start at beginning again after a delay
      setTimeout(() => {
        slider.scrollLeft = 0;
        console.log('Forced slider reset to position 0');
      }, 500);
    }
  }
}); 