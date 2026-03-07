const text = "I create stuff. Sometimes it's code, sometimes it's fast.";
let index = 0;
const target = document.querySelector(".sub-welcome");

function typeWriter() {
  if (index < text.length) {
    target.textContent += text[index];
    index++;
    setTimeout(typeWriter, 50);
  }
}
typeWriter();

const sections = document.querySelectorAll("section, .about-me-text, .experience-text, .project-cards");
window.addEventListener("scroll", () => {
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      sec.style.opacity = 1;
      sec.style.transform = "translateY(0)";
      sec.style.transition = "all 0.8s ease-out";
    }
  });

  document.querySelectorAll(".parallax").forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0.3;
    el.style.transform = `translateY(${window.scrollY * speed}px)`;
  });
});

const cards = document.querySelectorAll(".project-card");
cards.forEach(card => {
  const overlay = card.querySelector(".overlay");
  const content = card.querySelector(".project-content");

  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 12;
    const rotateY = (x - centerX) / 12;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.1)`;
    card.style.transition = "transform 0.05s ease-out";

    content.style.transform = `translateX(${(x - centerX) / 15}px) translateY(${(y - centerY) / 15}px)`;
    overlay.style.boxShadow = `${-(x - centerX)/8}px ${(y - centerY)/8}px 30px rgba(34,197,94,0.8), inset 0 0 25px rgba(34,197,94,0.2)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    card.style.transition = "transform 0.5s ease";
    content.style.transform = "translateX(0) translateY(0)";
    overlay.style.boxShadow = "0 0 15px rgba(0,0,0,0.6), inset 0 0 10px rgba(0,0,0,0.3)";
  });
});

const topBtn = document.createElement("button");
topBtn.textContent = "↑";
topBtn.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  font-size: 18px;
  border: none;
  border-radius: 6px;
  background-color: #22C55E;
  color: #fff;
  cursor: pointer;
  display: none;
  z-index: 1000;
`;
document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
topBtn.addEventListener("click", () => window.scrollTo({top: 0, behavior: "smooth"}));

const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
canvas.style.cssText = `
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  pointer-events:none;
  z-index:500;
`;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

class Particle {
  constructor(x, y, vx, vy, size, color){
    this.x = x || Math.random()*width;
    this.y = y || Math.random()*height;
    this.vx = vx || (Math.random()-0.5)*0.7;
    this.vy = vy || (Math.random()-0.5)*0.7;
    this.size = size || Math.random()*2+1;
    this.color = color || "#22C55E";
    this.alpha = 1;
  }
  update(){
    this.x += this.vx;
    this.y += this.vy;
    if(this.x<0||this.x>width) this.vx*=-1;
    if(this.y<0||this.y>height) this.vy*=-1;
  }
  draw(){
    ctx.fillStyle = `rgba(34,197,94,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fill();
  }
}

const particles = [];
for(let i=0;i<100;i++) particles.push(new Particle());

const clickParticles = [];
document.addEventListener('click', e => {
  for(let i=0;i<15;i++){
    const angle = Math.random()*Math.PI*2;
    const speed = Math.random()*4 + 1;
    clickParticles.push(new Particle(e.clientX,e.clientY,
      Math.cos(angle)*speed, Math.sin(angle)*speed,
      Math.random()*3+1));
  }
});

const cursorTrail = [];
document.addEventListener('mousemove', e => {
  cursorTrail.push({x:e.clientX, y:e.clientY, alpha:1});
});

const blob = document.createElementNS("http://www.w3.org/2000/svg","svg");
blob.setAttribute("width","300");
blob.setAttribute("height","300");
blob.style.cssText = `
  position: fixed;
  top:50px;
  left:50px;
  z-index:400;
  opacity:0.2;
`;
document.body.appendChild(blob);

const blobPath = document.createElementNS("http://www.w3.org/2000/svg","path");
blobPath.setAttribute("fill","#22C55E");
blob.appendChild(blobPath);

let blobAngle = 0;
function animateBlob(){
  const t = Date.now()*0.002;
  const r1 = 100+Math.sin(t)*20;
  const r2 = 100+Math.cos(t)*20;
  const r3 = 80+Math.sin(t*1.3)*15;
  const r4 = 120+Math.cos(t*0.7)*25;
  const pathData = `
    M ${150+r1*Math.cos(blobAngle)} ${150+r1*Math.sin(blobAngle)}
    C ${150+r2*Math.cos(blobAngle+1)} ${150+r2*Math.sin(blobAngle+1)},
      ${150+r3*Math.cos(blobAngle+2)} ${150+r3*Math.sin(blobAngle+2)},
      ${150+r4*Math.cos(blobAngle+3)} ${150+r4*Math.sin(blobAngle+3)}
  `;
  blobPath.setAttribute("d",pathData);
  requestAnimationFrame(animateBlob);
}
animateBlob();

const interactiveText = document.querySelectorAll(".welcome, .name");
document.addEventListener("mousemove", e => {
  const x = e.clientX/window.innerWidth - 0.5;
  const y = e.clientY/window.innerHeight - 0.5;
  interactiveText.forEach(el => {
    el.style.transform = `translate(${x*15}px, ${y*15}px)`;
  });
});


function animate() {
  ctx.clearRect(0,0,width,height);

  for(let p of particles){ p.update(); p.draw(); }
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 100){
        ctx.strokeStyle = `rgba(34,197,94,${1-dist/100})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x,particles[i].y);
        ctx.lineTo(particles[j].x,particles[j].y);
        ctx.stroke();
      }
    }
  }

  for(let i=0;i<cursorTrail.length;i++){
    const t = cursorTrail[i];
    ctx.fillStyle = `rgba(34,197,94,${t.alpha})`;
    ctx.beginPath();
    ctx.arc(t.x,t.y,5,0,Math.PI*2);
    ctx.fill();
    t.alpha -= 0.04;
    if(t.alpha<=0) cursorTrail.splice(i,1);
  }

  for(let i=0;i<clickParticles.length;i++){
    const p = clickParticles[i];
    p.update();
    p.draw();
    p.alpha -= 0.05;
    if(p.alpha <=0) clickParticles.splice(i,1);
  }

  requestAnimationFrame(animate);
}
animate();

let themeColors = {
  bg: "#020617",
  particle: "#22C55E",
  cursor: "#22C55E",
  overlayShadow: "rgba(34,197,94,0.7)"
};