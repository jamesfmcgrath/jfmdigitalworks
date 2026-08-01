export function setNavOpen(
  toggle: HTMLElement,
  panel: HTMLElement,
  openIcon: HTMLElement,
  closeIcon: HTMLElement,
  open: boolean,
): void {
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  panel.hidden = !open;
  openIcon.hidden = open;
  closeIcon.hidden = !open;
}

export function initNav(root: ParentNode = document): void {
  const toggle = root.querySelector<HTMLElement>('[data-nav-toggle]');
  const panel = root.querySelector<HTMLElement>('[data-nav-panel]');
  const openIcon = root.querySelector<HTMLElement>('[data-nav-icon-open]');
  const closeIcon = root.querySelector<HTMLElement>('[data-nav-icon-close]');
  if (!toggle || !panel || !openIcon || !closeIcon) return;

  let open = false;
  setNavOpen(toggle, panel, openIcon, closeIcon, false);

  const close = () => {
    open = false;
    setNavOpen(toggle, panel, openIcon, closeIcon, false);
  };

  toggle.addEventListener('click', () => {
    open = !open;
    setNavOpen(toggle, panel, openIcon, closeIcon, open);
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', close);
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (
      open &&
      target instanceof Node &&
      !toggle.contains(target) &&
      !panel.contains(target)
    ) {
      close();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) {
      close();
      toggle.focus();
    }
  });
}
