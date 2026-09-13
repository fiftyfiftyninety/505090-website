
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  toggle?.setAttribute('aria-expanded','false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();

async function handleSubmit(e){
  e.preventDefault();

  const form = e.target;
  const status = form.querySelector('.form-status');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.textContent;

  status.textContent = 'Sending your inquiry…';
  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';

  try {
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      interest: formData.get('interest') || '',
      message: formData.get('message') || ''
    };

    const response = await fetch('https://505090-contact.wv6hjbw7b4.workers.dev/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to send your inquiry.');
    }

    status.textContent = 'Thank you. Your inquiry has been sent to 50/50/90.';
    form.reset();
  } catch (error) {
    status.textContent = 'Your inquiry could not be sent. Please try again in a moment.';
    console.error('50/50/90 contact form error:', error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }

  return false;
}
