// --- EFECTO MÁQUINA DE ESCRIBIR ---
const TypeWriter = function(txtElement, words, wait = 3000) {
    this.txtElement = txtElement;
    this.words = words;
    this.txt = '';
    this.wordIndex = 0;
    this.wait = parseInt(wait, 10);
    this.type();
    this.isDeleting = false;
}

TypeWriter.prototype.type = function() {
    // Indice actual de palabra
    const current = this.wordIndex % this.words.length;
    // Obtener texto completo de la palabra actual
    const fullTxt = this.words[current];

    // Check si está borrando
    if(this.isDeleting) {
        // Borrar caracter
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        // Agregar caracter
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    // Insertar txt en el elemento
    this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

    // Velocidad de tipeo inicial
    let typeSpeed = 100;

    if(this.isDeleting) {
        typeSpeed /= 2;
    }

    // Si la palabra está completa
    if(!this.isDeleting && this.txt === fullTxt) {
        // Pausa al final
        typeSpeed = this.wait;
        this.isDeleting = true;
    } else if(this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.wordIndex++;
        typeSpeed = 500; // Pausa antes de empezar la nueva palabra
    }

    setTimeout(() => this.type(), typeSpeed);
}

// Inicializar en el DOM Load
document.addEventListener('DOMContentLoaded', init);

function init() {
    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        new TypeWriter(txtElement, words, wait);
    }
    
    // Mantener la lógica de tus repositorios y menú aquí abajo...
    // (Copia aquí el código de GitHub y Menú Móvil que te di antes)
}
