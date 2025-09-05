document.addEventListener('DOMContentLoaded', () => {
  const cardContainers = document.querySelectorAll('.card-container');
  const nextButton = document.querySelector('.next-button');
  const prevButton = document.querySelector('.prev-button');
  let currentCardIndex = 0;
  
  // Initialize first card as active
  cardContainers[0].classList.add('active');
  
  // Set up card carousel
  function showCard(index) {
    // Hide all cards
    cardContainers.forEach(card => {
      card.classList.remove('active');
      // Reset any active animations
      card.classList.remove('activated');
      // Reset flip state
      card.classList.remove('flipped');
    });
    
    // Show current card
    cardContainers[index].classList.add('active');
    createParticles(cardContainers[index]);
  }
  
  // Navigation buttons
  nextButton.addEventListener('click', () => {
    currentCardIndex = (currentCardIndex + 1) % cardContainers.length;
    showCard(currentCardIndex);
  });
  
  prevButton.addEventListener('click', () => {
    currentCardIndex = (currentCardIndex - 1 + cardContainers.length) % cardContainers.length;
    showCard(currentCardIndex);
  });
  
  // Create magic particles with appropriate color
  function createParticles(cardContainer) {
    const magicParticles = cardContainer.querySelector('.magic-particles');
    const magicGlow = cardContainer.querySelector('.magic-glow');
    
    magicParticles.innerHTML = '';
    const particleCount = 50;
    
    // Determine particle color based on card type
    let particleClass = '';
    if (magicGlow.classList.contains('red-glow')) {
      particleClass = 'red-particle';
    } else if (magicGlow.classList.contains('blue-glow')) {
      particleClass = 'blue-particle';
    } else if (magicGlow.classList.contains('white-glow')) {
      particleClass = 'white-particle';
    }
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      if (particleClass) {
        particle.classList.add(particleClass);
      }
      
      // Random size between 2px and 6px
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random animation
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;
      
      particle.style.animation = `
        particle-fade ${duration}s ease-out ${delay}s infinite,
        particle-move ${duration}s ease-out ${delay}s infinite
      `;
      
      magicParticles.appendChild(particle);
    }
  }
  
  // Create initial particles for first card
  createParticles(cardContainers[0]);
  
  // Set up card interactions for each card
  cardContainers.forEach(cardContainer => {
    const cardInner = cardContainer.querySelector('.card-inner');
    
    // Click events for flipping
    cardContainer.addEventListener('click', () => {
      if (cardContainer.classList.contains('active')) {
        cardContainer.classList.toggle('flipped');
      }
    });
    
    // Double click to "activate" the card with floating animation
    cardContainer.addEventListener('dblclick', () => {
      if (cardContainer.classList.contains('active') && 
          cardContainer.classList.contains('flipped')) {
        cardContainer.classList.toggle('activated');
        // Create new particles on activation
        if (cardContainer.classList.contains('activated')) {
          createParticles(cardContainer);
        }
      }
    });
    
    // Hover effect for 3D tilt
    cardContainer.addEventListener('mousemove', (e) => {
      // Only apply the 3D effect when the front is showing, active, and not activated
      if (cardContainer.classList.contains('active') &&
          cardContainer.classList.contains('flipped') && 
          !cardContainer.classList.contains('activated')) {
        const rect = cardContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        const tiltX = (y - 0.5) * 20; // Tilt up to 20 degrees
        const tiltY = (0.5 - x) * 20;
        
        cardInner.style.transform = `rotateY(180deg) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      }
    });
    
    // Reset transform when mouse leaves
    cardContainer.addEventListener('mouseleave', () => {
      if (cardContainer.classList.contains('active')) {
        if (cardContainer.classList.contains('flipped') && 
            !cardContainer.classList.contains('activated')) {
          cardInner.style.transform = 'rotateY(180deg)';
        } else if (!cardContainer.classList.contains('flipped')) {
          cardInner.style.transform = '';
        }
      }
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextButton.click();
    } else if (e.key === 'ArrowLeft') {
      prevButton.click();
    }
  });
});