import { describe, expect, it } from 'vitest';
import { setNavOpen } from '../src/scripts/nav';

function el(tag = 'div') {
  return document.createElement(tag);
}

describe('setNavOpen', () => {
  it('opens the menu', () => {
    const toggle = el('button');
    const panel = el();
    const openIcon = el();
    const closeIcon = el();

    setNavOpen(toggle, panel, openIcon, closeIcon, true);

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(panel.hidden).toBe(false);
    expect(openIcon.hidden).toBe(true);
    expect(closeIcon.hidden).toBe(false);
  });

  it('closes the menu', () => {
    const toggle = el('button');
    const panel = el();
    const openIcon = el();
    const closeIcon = el();

    setNavOpen(toggle, panel, openIcon, closeIcon, false);

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hidden).toBe(true);
    expect(openIcon.hidden).toBe(false);
    expect(closeIcon.hidden).toBe(true);
  });
});
