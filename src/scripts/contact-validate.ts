export type ContactFields = {
  name: string;
  email: string;
  projectType: string;
  botcheck: boolean;
};

export type ValidateResult =
  | { ok: true }
  | { ok: false; message: string };

export function validateContact(fields: ContactFields): ValidateResult {
  if (fields.botcheck) {
    return { ok: false, message: 'Spam detected. Please try again.' };
  }
  if (!fields.name || fields.name.trim().length < 2) {
    return { ok: false, message: 'Please enter a valid name.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(fields.email)) {
    return { ok: false, message: 'Please enter a valid email address.' };
  }
  if (!fields.projectType) {
    return { ok: false, message: 'Please select a project type.' };
  }

  return { ok: true };
}

export function buildWeb3FormsPayload(
  accessKey: string,
  fields: Omit<ContactFields, 'botcheck'>,
) {
  return {
    access_key: accessKey,
    name: fields.name,
    email: fields.email,
    subject: `New Contact Form Submission: ${fields.projectType}`,
    message: `Project Type: ${fields.projectType}\n\nSubmitted via contact form on jfmdigitalworks.com`,
    from_name: 'JFM Digital Works Contact Form',
  };
}
