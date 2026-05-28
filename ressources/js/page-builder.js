export class PageBuilder {
    constructor(language = 'en') {
        this.language = language;
        this.sections = {};
        this.translations = {};
        this.container = document.getElementById('main-screen');
        this.sidebar = document.querySelector('.sidebar');
    }

    setTranslations(translations) {
        this.translations = translations;
    }

    addSection(id, titleKey, contentRenderer) {
        this.sections[id] = {
            titleKey: titleKey,
            render: contentRenderer
        };
    }

    init() {
        this.renderSidebar();
        this.renderInitialContent();
    }

    setLanguage(lang) {
        this.language = lang;
        this.updateUI();
    }

    updateUI() {
        this.renderSidebar();
        this.reRenderContent();
        
        // Update page title based on active section
        const activeBtn = this.sidebar?.querySelector('.nav-btn.active');
        if (activeBtn) {
            const sectionId = activeBtn.getAttribute('data-section');
            if (this.sections[sectionId]) {
                this.updatePageTitle(this.sections[sectionId].titleKey);
            }
        }
    }

    reRenderContent() {
        Object.keys(this.sections).forEach(id => {
            const section = this.sections[id];
            const sectionDiv = document.getElementById(id);
            if (sectionDiv) {
                sectionDiv.innerHTML = section.render(this.language);
            }
        });
    }

    renderSidebar() {
        if (!this.sidebar) return;

        // Find existing buttons to preserve active state if any
        const activeSectionId = this.sidebar.querySelector('.nav-btn.active')?.getAttribute('data-section');

        // Clear existing buttons but keep deco blocks
        const decoBlocks = this.sidebar.querySelectorAll('.deco-block');
        const navFiller = this.sidebar.querySelector('.nav-filler');
        const lcars47 = this.sidebar.querySelector('div[style*="lcars-gold"]');
		const lang = this.sidebar.querySelectorAll('.lang-switch');

        this.sidebar.innerHTML = '';
		lang.forEach(el => this.sidebar.appendChild(el));
        decoBlocks.forEach(block => this.sidebar.appendChild(block));

        Object.keys(this.sections).forEach((id, index) => {
            const section = this.sections[id];
            const button = document.createElement('button');
            const isActive = activeSectionId ? (id === activeSectionId) : (index === 0);
            button.className = `nav-btn ${isActive ? 'active' : ''}`;
            button.setAttribute('data-section', id);
            button.textContent = this.t(section.titleKey);
            this.sidebar.appendChild(button);
        });

        if (navFiller) this.sidebar.appendChild(navFiller);
        if (lcars47) this.sidebar.appendChild(lcars47);
    }

    renderInitialContent() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        Object.keys(this.sections).forEach((id, index) => {
            const section = this.sections[id];
            const sectionDiv = document.createElement('div');
            sectionDiv.id = id;
            sectionDiv.className = `viewer-content ${index === 0 ? 'active' : ''}`;
            sectionDiv.innerHTML = section.render(this.language);
            this.container.appendChild(sectionDiv);
        });

        // Set initial page title
        const firstSectionId = Object.keys(this.sections)[0];
        if (firstSectionId) {
            this.updatePageTitle(this.sections[firstSectionId].titleKey);
        }
    }

    setupNavigation() {
        // This is now handled in main.js
    }

    updatePageTitle(titleKey) {
        document.title = `JDI-Coding | ${this.t(titleKey)}`;
    }

    t(key) {
        return this.translations[this.language]?.[key] || key;
    }
}
