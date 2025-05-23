/**
 * ModalOpener component
 * 
 * A unified modal opener for all modal types in the theme.
 * Used by quick-add-modal, product-monogram-popup, and other modals.
 */
if (!customElements.get('modal-opener')) {
  class ModalOpener extends HTMLElement {
    constructor() {
      super();

      const button = this.querySelector('button');

      if (!button) return;
      button.addEventListener('click', () => {
        const modal = document.querySelector(this.getAttribute('data-modal'));
        if (modal) {
          modal.show(button);
        }
      });
    }
  }

  customElements.define('modal-opener', ModalOpener);
}