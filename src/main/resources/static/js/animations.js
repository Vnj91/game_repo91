/**
 * Animation System
 */
const animations = {
  initParticles() {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      this.createParticle();
    }
  },
  
  createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 20) + 's';
    
    utils.$('#particles').appendChild(particle);
    
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
      this.createParticle();
    }, 30000);
  },
  
  initMagneticCursor() {
    document.addEventListener('mousemove', (e) => {
      const cursor = utils.$('#magnetic-cursor');
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  },
  
  createConfetti() {
    const canvas = utils.$('#confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 100; i++) {
      confettiPieces.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      confettiPieces.forEach((piece, index) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.rotationSpeed;
        
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.rotation * Math.PI / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
        
        if (piece.y > canvas.height + 10) {
          confettiPieces.splice(index, 1);
        }
      });
      
      if (confettiPieces.length > 0) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    animate();
  },
  
  init() {
    this.initParticles();
    this.initMagneticCursor();
  }
};
