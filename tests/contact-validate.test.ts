import { describe, expect, it } from 'vitest';
import {
  buildWeb3FormsPayload,
  validateContact,
} from '../src/scripts/contact-validate';

describe('validateContact', () => {
  it('rejects honeypot', () => {
    const result = validateContact({
      name: 'Ada',
      email: 'ada@example.com',
      projectType: 'Rapid Web Development',
      botcheck: true,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/spam/i);
  });

  it('rejects short name', () => {
    const result = validateContact({
      name: 'A',
      email: 'ada@example.com',
      projectType: 'Rapid Web Development',
      botcheck: false,
    });

    expect(result.ok).toBe(false);
  });

  it('rejects bad email', () => {
    const result = validateContact({
      name: 'Ada',
      email: 'not-an-email',
      projectType: 'Rapid Web Development',
      botcheck: false,
    });

    expect(result.ok).toBe(false);
  });

  it('accepts valid fields', () => {
    const result = validateContact({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      projectType: 'Rapid Web Development',
      botcheck: false,
    });

    expect(result).toEqual({ ok: true });
  });
});

describe('buildWeb3FormsPayload', () => {
  it('shapes payload like the Next site', () => {
    expect(
      buildWeb3FormsPayload('KEY', {
        name: 'Ada',
        email: 'ada@example.com',
        projectType: 'Rapid Web Development',
      }),
    ).toEqual({
      access_key: 'KEY',
      name: 'Ada',
      email: 'ada@example.com',
      subject: 'New Contact Form Submission: Rapid Web Development',
      message:
        'Project Type: Rapid Web Development\n\nSubmitted via contact form on jfmdigitalworks.com',
      from_name: 'JFM Digital Works Contact Form',
    });
  });
});
