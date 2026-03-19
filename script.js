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

// Global form submit handler: makes interception deterministic.
window.stackMergeWaitlistSubmit = async function(event) {
    if (!event) return false;

    const waitlistForm = document.getElementById('stack-merge-waitlist-form');
    const emailInput = document.getElementById('stack-merge-email');
    const statusEl = document.getElementById('stack-merge-waitlist-status');
    const submitBtn = document.getElementById('stack-merge-waitlist-submit');

    if (!waitlistForm || !emailInput || !statusEl || !submitBtn) return false;

    // Set these to your Supabase project values.
    const SUPABASE_URL = 'https://uoltymettcmvwrnchyja.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_3bpvc45QkWpFZ5ePTuUHhg_lZEaeIw3';
    const ENDPOINT = `${SUPABASE_URL}/rest/v1/waitlist_submissions`;

    function isValidEmail(email) {
        // Simple client-side validation (server-side RLS/policies still apply).
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function setStatus(message, kind) {
        statusEl.textContent = message || '';
        statusEl.dataset.kind = kind || '';
    }

    event.preventDefault();

    const email = (emailInput.value || '').trim();
    // Normalize trimmed value so validation + what the user sees match.
    emailInput.value = email;

    // Require both HTML5 email validity and a basic regex sanity check.
    const looksLikeEmail = emailInput.checkValidity() && isValidEmail(email);
    if (!email || !looksLikeEmail) {
        setStatus('Please enter a valid email address.', 'error');
        emailInput.focus();
        return false;
    }

    // If the user hasn't configured Supabase yet, fail clearly.
    if (SUPABASE_URL.includes('YOUR_PROJECT_REF') || SUPABASE_ANON_KEY.includes('YOUR_ANON_KEY')) {
        setStatus('Waitlist is not configured yet. Please contact Alec.', 'error');
        return false;
    }

    submitBtn.disabled = true;
    setStatus('Submitting...', 'pending');

    try {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                Prefer: 'return=minimal'
            },
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            setStatus('Thanks! You\'re on the waitlist.', 'success');
            emailInput.value = '';
            return false;
        }

        // Try to pull a helpful error message from Supabase.
        let details = '';
        try {
            const text = await res.text();
            // Supabase REST errors are usually JSON, but this keeps it resilient.
            try {
                const json = JSON.parse(text);
                details = json?.message || json?.error || '';
            } catch {
                details = text || '';
            }
        } catch {
            details = '';
        }

        if (res.status === 409) {
            setStatus('That email is already on the waitlist.', 'error');
            return false;
        }

        setStatus(details ? `Could not submit: ${details}` : 'Could not submit. Please try again.', 'error');
    } catch (err) {
        setStatus('Network error. Please try again later.', 'error');
    } finally {
        submitBtn.disabled = false;
    }

    return false;
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    initPage();
}
