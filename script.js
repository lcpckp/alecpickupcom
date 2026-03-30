function initPage() {
    // Accordion functionality
    const accordionSections = document.querySelectorAll('.accordion-section');

    accordionSections.forEach(section => {
        const header = section.querySelector('.accordion-header');
        if (!header) return;

        header.addEventListener('click', function() {
            // Toggle the active state of the clicked section only
            section.classList.toggle('active');
        });
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

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
