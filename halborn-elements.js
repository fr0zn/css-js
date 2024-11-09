class HalbornHeader extends HTMLElement {
    constructor(title, section) {
        super();

        // Creating the container and applying the class
        const container = document.createElement('div');
        container.classList.add('header-container'); // Use existing CSS class

        let preTitle;

        if (section) {
            // Creating and styling pre-title
            preTitle = document.createElement('div');
            preTitle.classList.add('pre-title'); // Use existing CSS class
            preTitle.textContent = section
        } else {
            preTitle = document.createElement('img');
            const logoSrc = 'https://www.halborn.com/logotext-blk.svg'; // Replace with the path to your logo
            const logoSize = '100px'; // Set the logo width
            preTitle.src = logoSrc;
            preTitle.alt = 'Logo';

            // Style the logo
            preTitle.style.width = logoSize;
            preTitle.style.height = 'auto';
            preTitle.style.opacity = '0.8'; // Optional: slight transparency
            preTitle.style.filter = 'invert(100%) brightness(200%)'; // Converts to white
            preTitle.style.margin = '5px 0';
        }

        // Creating and styling main title
        const titleElem = document.createElement('div');
        titleElem.classList.add('title'); // Use existing CSS class
        titleElem.textContent = title || '';

        // Append elements to the container
        container.appendChild(preTitle);
        container.appendChild(titleElem);
        this.appendChild(container); // Directly append to the custom element
    }
}

// Define the custom element
customElements.define('halborn-header', HalbornHeader);

class HalbornColumns extends HTMLElement {
    constructor() {
        super();
        this.classList.add('halborn-columns-container'); // Assume this class is styled globally
    }

    connectedCallback() {
        this.updateColumns();
    }

    static get observedAttributes() {
        return ['columns'];
    }

    attributeChangedCallback() {
        this.updateColumns();
    }

    updateColumns() {
        const columnsAttribute = this.getAttribute('columns');

        if (columnsAttribute) {
            // Check if `columns` is a single integer or a list of sizes
            if (/^\d+$/.test(columnsAttribute.trim())) {
                // If columns is a single integer, set evenly sized columns
                const columnCount = parseInt(columnsAttribute, 10);
                this.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
            } else {
                // Otherwise, treat columns as a list of sizes
                const columnsArray = columnsAttribute.split(',').map(value => value.trim());
                this.style.gridTemplateColumns = columnsArray.join(' ');
            }
        } else {
            // Default to equal columns based on child count if `columns` is not specified
            const columnCount = this.childElementCount;
            this.style.gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
        }
    }
}

// Register the custom element
customElements.define('halborn-columns', HalbornColumns);

class HalbornTOC extends HTMLElement {
    constructor() {
        super();

        // Container for the TOC items
        const container = document.createElement('div');
        container.classList.add('toc-container');

        // TOC list container
        const ul = document.createElement('ul');
        ul.classList.add('toc-list');

        // Variable to track the last section text added
        let lastSectionText = '';

        // Find all section elements with the `halborn-section` attribute
        document.querySelectorAll('section[halborn-section]').forEach((section) => {
            // Get the section text, convert to lowercase for consistency
            const sectionText = section.getAttribute('halborn-section').toLowerCase();

            // Only add the section if it is not the same as the last added section
            if (sectionText !== lastSectionText) {
                lastSectionText = sectionText; // Update the last section text

                // Create a TOC item as a link for the unique section
                const li = document.createElement('li');
                li.classList.add('toc-item');

                // Create the link element
                const link = document.createElement('a');
                link.textContent = section.getAttribute('halborn-section'); // Use original case for display
                link.href = `#/${section.getAttribute('id')}`; // Set href to the section ID

                // Append link to the TOC item
                li.appendChild(link);
                ul.appendChild(li);
            }
        });

        container.appendChild(ul);
        this.appendChild(container); // Append the container directly to the light DOM
    }
}

customElements.define('halborn-toc', HalbornTOC);


// HalbornCover.js

class HalbornCover extends HTMLElement {
    constructor() {
        super();

        // Create container div with the class `cover-content`
        const container = document.createElement('div');
        container.classList.add('cover-content');

        const imgContainer = document.createElement('div');

        imgContainer.classList.add('cover-img-container');

        // Create image element
        const img = document.createElement('img');
        img.classList.add('cover-image');
        img.src = this.getAttribute('src') || 'https://www.halborn.com/logotext-blk.svg';
        img.alt = 'Cover Image';
        img.style.width = '100%';

        imgContainer.appendChild(img);
        container.appendChild(imgContainer);

        // Create tagline div
        const tagline = document.createElement('div');
        tagline.classList.add('cover-tagline');

        // Create horizontal line
        const line = document.createElement('hr');
        line.classList.add('cover-line');
        tagline.appendChild(line);

        // Create "EST. 2019" span
        const estText = document.createElement('span');
        estText.classList.add('cover-est');
        estText.textContent = this.getAttribute('est') || '// EST. 2019';
        tagline.appendChild(estText);

        // Create subtitle
        const subtitle = document.createElement('h2');
        subtitle.classList.add('cover-subtitle');
        subtitle.textContent = this.getAttribute('subtitle') || 'ELITE BLOCKCHAIN SECURITY SOLUTIONS';
        tagline.appendChild(subtitle);

        // Append tagline to container
        container.appendChild(tagline);

        // Append container to the shadow DOM
        this.appendChild(container);
        this.style.width = '100%';
    }

    static get observedAttributes() {
        return ['src', 'est', 'subtitle'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') {
            this.querySelector('.cover-image').src = newValue;
        } else if (name === 'est') {
            this.querySelector('.cover-est').textContent = newValue;
        } else if (name === 'subtitle') {
            this.querySelector('.cover-subtitle').textContent = newValue;
        }
    }
}

// Register the custom element
customElements.define('halborn-cover', HalbornCover);

document.addEventListener('DOMContentLoaded', () => {

    let sections = document.querySelectorAll(".reveal .slides section");
    let lastSectionText = null;

    sections.forEach((section, index) => {
        // skip first section
        if (index === 0) {
            return;
        }

        // Get the title from the data attribute
        const title = section.getAttribute("halborn-title");
        const sectionText = section.getAttribute('halborn-section');

        // TITLE
        const effectiveSectionText = sectionText || lastSectionText;
        if (sectionText) {
            lastSectionText = sectionText; // Update the last section value only if a new one is provided
        }

        const effectiveTitle = title || 'Untitled'; // Default to 'Untitled' if title is missing

        // Create a new HalbornHeader instance with the title and effective section
        const header = new HalbornHeader(effectiveTitle, effectiveSectionText);

        // Insert the header at the beginning of the section
        // section.prepend(header);

        // Create header div and set its content and class
        const headerDiv = document.createElement("div");
        headerDiv.classList.add("header");
        // headerDiv.textContent = title;

        headerDiv.appendChild(header);

        // TITLE

        // Create content div, move all existing content into it, and apply class
        const contentDiv = document.createElement("div");
        contentDiv.classList.add("content");
        while (section.firstChild) {
            contentDiv.appendChild(section.firstChild); // Move each child into contentDiv
        }

        // Logo
        // Create a new img element for the logo
        const logo = document.createElement('img');
        const logoSrc = 'https://www.halborn.com/logotext-blk.svg'; // Replace with the path to your logo
        const logoSize = '50px'; // Set the logo width
        logo.src = logoSrc;
        logo.alt = 'Logo';


        // Style the logo
        logo.style.position = 'absolute';
        logo.style.bottom = '20px';
        logo.style.right = '20px';
        logo.style.width = logoSize;
        logo.style.height = 'auto';
        logo.style.opacity = '0.8'; // Optional: slight transparency
        logo.style.filter = 'invert(100%) brightness(200%)'; // Converts to white

        // Clear the section and append the new header and content divs
        section.appendChild(headerDiv);
        section.appendChild(contentDiv);

        section.appendChild(logo);
    });

});