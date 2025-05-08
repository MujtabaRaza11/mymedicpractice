document.addEventListener('DOMContentLoaded', function() {
  initCountdownTimers();
  
  // Re-initialize when Shopify section is reloaded
  document.addEventListener('shopify:section:load', function(event) {
    if (event.target.classList.contains('promotion-countdown-section')) {
      initCountdownTimers();
    }
  });
});

function initCountdownTimers() {
  const countdownSections = document.querySelectorAll('.promotion-countdown-section');
  
  countdownSections.forEach(section => {
    const endTimeStr = section.getAttribute('data-end-time');
    if (!endTimeStr) return;
    
    // Parse date string in format YYYY-MM-DD HH:MM:SS
    const endTime = parseCustomDateFormat(endTimeStr);
    if (!endTime) return;
    
    const sectionId = section.getAttribute('data-section-id');
    
    // Elements
    const daysEl = section.querySelector('[data-days]');
    const hoursEl = section.querySelector('[data-hours]');
    const minutesEl = section.querySelector('[data-minutes]');
    const secondsEl = section.querySelector('[data-seconds]');
    
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    
    // Set up countdown interval
    const countdownId = `countdown-${sectionId}`;
    
    // Clear any existing interval with the same ID
    if (window[countdownId]) {
      clearInterval(window[countdownId]);
    }
    
    // Initial update
    updateCountdown();
    
    // Set interval for countdown
    window[countdownId] = setInterval(updateCountdown, 1000);
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      // If countdown is finished
      if (distance < 0) {
        clearInterval(window[countdownId]);
        daysEl.textContent = '0';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
      }
      
      // Calculate time units
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Update elements
      daysEl.textContent = days;
      hoursEl.textContent = padZero(hours);
      minutesEl.textContent = padZero(minutes);
      secondsEl.textContent = padZero(seconds);
    }
  });
}

// Function to parse date in format YYYY-MM-DD HH:MM:SS
function parseCustomDateFormat(dateString) {
  // Check if the date is in ISO format already
  if (dateString.includes('T')) {
    return new Date(dateString).getTime();
  }
  
  // Parse format YYYY-MM-DD HH:MM:SS
  const pattern = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/;
  const match = dateString.match(pattern);
  
  if (match) {
    const [, year, month, day, hours, minutes, seconds] = match;
    return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
  }
  
  // Fallback to standard parsing
  return new Date(dateString).getTime();
}

function padZero(num) {
  return num < 10 ? '0' + num : num;
} 