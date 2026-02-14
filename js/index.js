const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Referencia al contenedor de texto
const uiLayer = document.getElementById('text-container');

let width, height;

// Estados: 'idle' (inicio), 'assembling' (formando), 'falling' (cayendo)
let animationState = 'idle'; 

const particleCount = 1600; 
const heartScale = 16;      

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function getRandomHeartTarget() {
    const t = Math.random() * Math.PI * 2;
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    
    const r = Math.sqrt(Math.random()); 
    x *= r;
    y *= r;

    return {
        x: x * heartScale,
        y: -y * heartScale
    };
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.depth = Math.random(); 

        this.x = Math.random() * width;
        const floorPerspective = (1 - this.depth) * 50; 
        this.y = height - (Math.random() * 100) - floorPerspective; 
        
        this.idleX = this.x;
        this.idleY = this.y;

        const target = getRandomHeartTarget();
        this.targetX = (width / 2) + target.x;
        this.targetY = (height / 2) + target.y;

        this.size = 0.5 + (this.depth * 3); 
        this.hue = 340 + Math.random() * 20; 
        this.lightness = 20 + (this.depth * 60); 
        this.maxAlpha = 0.2 + (this.depth * 0.8); 
        this.alpha = this.maxAlpha;

        this.speed = 0.005 + (this.depth * 0.005); 
        this.floatOffset = Math.random() * 100; 
        
        this.vy = 0; 
        this.gravity = 0.02 + Math.random() * 0.02; 
        this.bounce = 0.3 + Math.random() * 0.2; 
        this.fadeSpeed = 0.003 + Math.random() * 0.005; 
    }

    update() {
        const time = Date.now() * 0.001;

        if (animationState === 'idle') {
            const movementScale = 1 + (this.depth * 20); 
            this.x = this.idleX + Math.sin(time + this.floatOffset) * movementScale;
            this.y = this.idleY + Math.cos(time * 0.5 + this.floatOffset) * (movementScale * 0.5);
        } 
        else if (animationState === 'assembling') {
            this.x += (this.targetX - this.x) * this.speed;
            this.y += (this.targetY - this.y) * this.speed;

            const dist = Math.abs(this.targetX - this.x) + Math.abs(this.targetY - this.y);
            if (dist < 20) {
                this.floatOffset += 0.03;
                this.x += Math.cos(this.floatOffset) * 0.5; 
                this.y += Math.sin(this.floatOffset) * 0.5; 
            }
        }
        else if (animationState === 'falling') {
            this.vy += this.gravity; 
            this.y += this.vy;       
            
            this.x += Math.sin(this.floatOffset) * 0.3;
            this.floatOffset += 0.02;

            if (this.alpha > 0) this.alpha -= this.fadeSpeed;
            else this.alpha = 0;

            if (this.y + this.size > height) {
                this.y = height - this.size; 
                this.vy *= -this.bounce;     
            }
        }
    }

    draw() {
        if (this.alpha <= 0) return;
        ctx.fillStyle = `hsla(${this.hue}, 90%, ${this.lightness}%, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particles = [];

function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height); 
    
    particles.sort((a, b) => a.depth - b.depth);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animate);
}

init();
animate();

// --- LÓGICA DEL CLICK ---
// Aquí agregamos el listener a 'window' en lugar de 'canvas'
// Esto asegura que el click funcione aunque le des al texto por error
window.addEventListener('click', () => {

    console.log(Date.now());
    const titulo = document.getElementById('title');
    const pista = document.getElementById('subtitle');
    
    if (animationState === 'idle') {

        
        // AQUÍ OCULTAMOS EL TEXTO
        if (uiLayer) {
            uiLayer.style.opacity = '0'; 
            // Opcional: Para evitar que interfiera después, podemos moverlo
            // setTimeout(() => uiLayer.style.display = 'none', 1000);
        }

        
        // ************************* CONDICION DE ARRANQUE DE LA ANIMACION ***************************
        console.log(Date.now());
        if ( Date.now() > new Date("2026-02-14T11:01:00").getTime() ){
            animationState = 'assembling';
            console.log(Date.now());
        }
        else{
            // const titulo = document.getElementById('title');
            // const pista = document.getElementById('subtitle');

            // titulo.textContent = "Aun no es el momento, intentalo mas tarde";
            // pista.textContent = "Pista: fecha de aniversario convertido en hora";
            // if (uiLayer) {
            //     // uiLayer.style.display = 'block'; // Si usaste el timeout opcional
            //     uiLayer.style.opacity = '1'; 
            // }
            setTimeout(() => {
                
                if ( titulo.textContent == "Aun no es el momento, intentalo mas tarde" ){
                    titulo.textContent = "Prueba de vuelta";
                    pista.textContent = "Haz click, cuando estes segura.";
                }
                else{
                    titulo.textContent = "Aun no es el momento, intentalo mas tarde";
                    pista.textContent = "Pista: fecha de aniversario convertido en hora";
                }
                


                uiLayer.style.opacity = '1';
            }, 1000);
        }
        // **********************************************************************************************


    } else if (animationState === 'assembling') {
        animationState = 'falling';
        
        setTimeout(() => {

            titulo.textContent = "Feliz San Valentin Trufa";
            pista.textContent = "Espero te guste el detalle :).";

            uiLayer.style.opacity = '1';
        }, 1000);

        
    } else if (animationState === 'falling') {
        animationState = 'idle';


        titulo.textContent = "Comencemos";
        pista.textContent = "Haz click";


        init(); 
        
        // AQUÍ MOSTRAMOS EL TEXTO DE NUEVO
        if (uiLayer) {
            // uiLayer.style.display = 'block'; // Si usaste el timeout opcional

            uiLayer.style.opacity = '1'; 
        }
    }
});



