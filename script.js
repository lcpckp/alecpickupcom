function initPage() {
    // Accordion functionality
    const accordionSections = document.querySelectorAll('.accordion-section');

    accordionSections.forEach(section => {
        const header = section.querySelector('.accordion-header');
        if (!header) return;

        const content = section.querySelector('.accordion-content');

        header.addEventListener('click', function() {
            // Toggle the active state of the clicked section only
            const opening = !section.classList.contains('active');
            section.classList.toggle('active');
            if (!content) return;

            // Animate to the real content height so tall sections (games) aren't clipped
            if (opening) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.offsetHeight; // force reflow so the collapse animates
                content.style.maxHeight = '0px';
            }
        });

        if (content) {
            content.addEventListener('transitionend', function(event) {
                // Once open, drop the cap so lazy-loaded images can grow the section
                if (event.target === content && section.classList.contains('active')) {
                    content.style.maxHeight = 'none';
                }
            });
        }
    });

    initLightbox();
}

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('figcaption');
    let gallery = [];
    let index = 0;

    function show(i) {
        index = (i + gallery.length) % gallery.length;
        const shot = gallery[index];
        img.src = shot.href;
        img.alt = shot.querySelector('img').alt;
        caption.textContent = shot.dataset.caption + '  (' + (index + 1) + '/' + gallery.length + ')';
    }

    function close() {
        lightbox.hidden = true;
        document.body.classList.remove('lightbox-open');
        img.removeAttribute('src');
    }

    document.querySelectorAll('.shot[data-gallery]').forEach(shot => {
        shot.addEventListener('click', function(event) {
            event.preventDefault();
            gallery = Array.from(document.querySelectorAll(`.shot[data-gallery="${shot.dataset.gallery}"]`));
            show(gallery.indexOf(shot));
            lightbox.hidden = false;
            document.body.classList.add('lightbox-open');
        });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', close);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
    lightbox.addEventListener('click', function(event) {
        if (event.target === lightbox || event.target.tagName === 'FIGURE') close();
    });

    document.addEventListener('keydown', function(event) {
        if (lightbox.hidden) return;
        if (event.key === 'Escape') close();
        else if (event.key === 'ArrowLeft') show(index - 1);
        else if (event.key === 'ArrowRight') show(index + 1);
    });
}

window.stackMergeSupportSubmit = function(event) {
    if (!event) return false;

    const nameInput = document.getElementById('stack-merge-support-name');
    const emailInput = document.getElementById('stack-merge-support-email');
    const messageInput = document.getElementById('stack-merge-support-message');
    const statusEl = document.getElementById('stack-merge-support-status');

    if (!nameInput || !emailInput || !messageInput || !statusEl) return false;

    event.preventDefault();

    const name = (nameInput.value || '').trim();
    const email = (emailInput.value || '').trim();
    const message = (messageInput.value || '').trim();

    nameInput.value = name;
    emailInput.value = email;
    messageInput.value = message;

    if (!name || !email || !message || !emailInput.checkValidity()) {
        statusEl.textContent = 'Please complete all fields with a valid email address.';
        statusEl.dataset.kind = 'error';
        return false;
    }

    const subject = `Stack Merge Support: ${name}`;
    const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Question/Description:',
        message
    ].join('\n');

    const mailtoHref = `mailto:support@alecpickup.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoHref;

    statusEl.textContent = 'Opening your email app...';
    statusEl.dataset.kind = 'pending';
    return false;
};

window.tsukimiSupportSubmit = function(event) {
    if (!event) return false;

    const nameInput = document.getElementById('tsukimi-support-name');
    const emailInput = document.getElementById('tsukimi-support-email');
    const messageInput = document.getElementById('tsukimi-support-message');
    const statusEl = document.getElementById('tsukimi-support-status');

    if (!nameInput || !emailInput || !messageInput || !statusEl) return false;

    event.preventDefault();

    const name = (nameInput.value || '').trim();
    const email = (emailInput.value || '').trim();
    const message = (messageInput.value || '').trim();

    nameInput.value = name;
    emailInput.value = email;
    messageInput.value = message;

    if (!name || !email || !message || !emailInput.checkValidity()) {
        statusEl.textContent = 'Please complete all fields with a valid email address.';
        statusEl.dataset.kind = 'error';
        return false;
    }

    const subject = `Tsukimi Support: ${name}`;
    const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        '',
        'Question/Description:',
        message
    ].join('\n');

    const mailtoHref = `mailto:support@alecpickup.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoHref;

    statusEl.textContent = 'Opening your email app...';
    statusEl.dataset.kind = 'pending';
    return false;
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
