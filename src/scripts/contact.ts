import {
  buildWeb3FormsPayload,
  validateContact,
} from './contact-validate';

export function initContactForm(form: HTMLFormElement): void {
  const status = form.querySelector<HTMLElement>('[data-contact-status]');
  const submitBtn = form.querySelector<HTMLButtonElement>('[data-contact-submit]');
  if (!status || !submitBtn) return;

  const setStatus = (message: string, ok: boolean) => {
    status.hidden = false;
    status.textContent = message;
    status.dataset.state = ok ? 'success' : 'error';
    status.className = ok
      ? 'rounded-md border border-green-200 bg-green-50 p-4 text-green-800'
      : 'rounded-md border border-red-200 bg-red-50 p-4 text-red-800';
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.hidden = true;

    const data = new FormData(form);
    const fields = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      projectType: String(data.get('projectType') ?? ''),
      botcheck: data.get('botcheck') === 'on' || data.get('botcheck') === 'true',
    };

    const validated = validateContact(fields);
    if (!validated.ok) {
      setStatus(validated.message, false);
      return;
    }

    const accessKey = import.meta.env.PUBLIC_WEB3FORMS_KEY;
    if (!accessKey) {
      setStatus(
        'Contact form is not properly configured. Please try again later or email hello@jfmdigitalworks.com directly.',
        false,
      );
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(
          buildWeb3FormsPayload(accessKey, {
            name: fields.name,
            email: fields.email,
            projectType: fields.projectType,
          }),
        ),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setStatus("Thanks! I'll respond within 24 hours.", true);
        form.reset();
      } else {
        setStatus(
          result?.message ||
            'Something went wrong. Please try again or email hello@jfmdigitalworks.com directly.',
          false,
        );
      }
    } catch {
      setStatus(
        'Network error. Please check your connection and try again, or email hello@jfmdigitalworks.com directly.',
        false,
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
