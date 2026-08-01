import { describe, expect, it } from 'vitest';
import { initNav, setNavOpen } from '../src/scripts/nav';

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

describe('initNav', () => {
  it('closes an open menu when clicking outside the toggle and panel', () => {
    document.body.innerHTML = `
      <button data-nav-toggle>
        <span data-nav-icon-open></span>
        <span data-nav-icon-close></span>
      </button>
      <nav data-nav-panel></nav>
      <main data-outside></main>
    `;

    initNav(document);

    const toggle = document.querySelector<HTMLElement>('[data-nav-toggle]')!;
    const panel = document.querySelector<HTMLElement>('[data-nav-panel]')!;
    const outside = document.querySelector<HTMLElement>('[data-outside]')!;

    toggle.click();
    expect(panel.hidden).toBe(false);

    outside.click();
    expect(panel.hidden).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });
});
