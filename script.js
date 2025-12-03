document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MENÚ MÓVIL (Hamburguesa)
    // ==========================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            });
        });
    }

    // ==========================================
    // 2. EFECTO MÁQUINA DE ESCRIBIR
    // ==========================================
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
        const current = this.wordIndex % this.words.length;
        const fullTxt = this.words[current];

        if(this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        let typeSpeed = 100;

        if(this.isDeleting) { typeSpeed /= 2; }

        if(!this.isDeleting && this.txt === fullTxt) {
            typeSpeed = this.wait;
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }

    const txtElement = document.querySelector('.txt-type');
    if (txtElement) {
        try {
            const words = JSON.parse(txtElement.getAttribute('data-words'));
            const wait = txtElement.getAttribute('data-wait');
            new TypeWriter(txtElement, words, wait);
        } catch(e) { console.error("Error TypeWriter", e); }
    }

    // ==========================================
    // 3. CARGAR REPOSITORIOS GITHUB
    // ==========================================
    const githubUsername = 'Madaru69';
    const repoContainer = document.getElementById('repos-container');

    if (repoContainer) {
        fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc`)
            .then(response => response.json())
            .then(repos => {
                repoContainer.innerHTML = '';
                const recentRepos = repos.filter(repo => !repo.fork).slice(0, 6);

                recentRepos.forEach(repo => {
                    const card = document.createElement('div');
                    card.classList.add('repo-card');
                    let langColor = '#ccc';
                    if (repo.language) {
                        const lang = repo.language.toLowerCase();
                        if (lang.includes('html')) langColor = '#e34c26';
                        else if (lang.includes('css')) langColor = '#563d7c';
                        else if (lang.includes('javascript')) langColor = '#f1e05a';
                        else if (lang.includes('python')) langColor = '#3572A5';
                    }

                    card.innerHTML = `
                        <div class="repo-header" style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                            <i class="far fa-folder-open" style="color:var(--text-main)"></i>
                            <a href="${repo.html_url}" target="_blank"><i class="fas fa-external-link-alt"></i></a>
                        </div>
                        <h3><a href="${repo.html_url}" target="_blank" style="color:#fff; text-decoration:none;">${repo.name}</a></h3>
                        <p style="font-size:0.9rem; color:#8b949e; margin-bottom:1.5rem;">${repo.description || 'Sin descripción disponible.'}</p>
                        <div class="repo-stats" style="margin-top:auto; display:flex; gap:15px; font-size:0.85rem;">
                            <span style="display:flex; align-items:center; gap:5px;">
                                <span style="width:10px; height:10px; border-radius:50%; background-color:${langColor}; display:inline-block;"></span>
                                ${repo.language || 'Varios'}
                            </span>
                            <span><i class="far fa-star"></i> ${repo.stargazers_count}</span>
                        </div>
                    `;
                    repoContainer.appendChild(card);
                });
            })
            .catch(error => {
                repoContainer.innerHTML = '<p style="text-align:center;">No se pudieron cargar los repositorios.</p>';
            });
    }

    // ==========================================
    // 4. FORMULARIO CONTACTO (FormSubmit AJAX)
    // ==========================================
    const form = document.getElementById("contact-form");
    
    if(form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault();
            const status = document.getElementById("form-status");
            const data = new FormData(event.target);
            const btn = form.querySelector('button');
            const originalBtnText = btn.innerText;
            
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "¡Mensaje enviado con éxito!";
                    status.style.display = 'block';
                    status.style.color = '#2ea043'; // Verde
                    form.reset();
                } else {
                    status.innerHTML = "Hubo un problema al enviar el mensaje.";
                    status.style.display = 'block';
                    status.style.color = '#da3633'; // Rojo
                }
            }).catch(error => {
                status.innerHTML = "Hubo un error de conexión.";
                status.style.display = 'block';
                status.style.color = '#da3633'; // Rojo
            }).finally(() => {
                btn.innerText = originalBtnText;
                btn.disabled = false;
            });
        });
    }
});
