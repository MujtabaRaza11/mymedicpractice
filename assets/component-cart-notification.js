class CartNotification extends HTMLElement {
  constructor() {
    super();
    this.hideNotification = this.hideNotification.bind(this);
    this.querySelector('.cart-notification-continue_shopping').addEventListener('click', () => this.hideNotification());
    this.querySelector('.cart-notification__close').addEventListener('click', () => this.hideNotification());
    document.addEventListener('item-added-to-cart', (event) => this.updateNotification(event.detail));
  }

  disconnectedCallback() {
    this.querySelector('.cart-notification-continue_shopping').removeEventListener('click', this.hideNotification);
    this.querySelector('.cart-notification__close').removeEventListener('click', this.hideNotification);
  }

  updateNotification(updatedCartNotification) {
    const productElement = this.querySelector('#cart-notification-product');
    const optionsHTML = updatedCartNotification.options_with_values
      .map((option) => `<div class="product-option"><dt>${option.name}: </dt><dd>${option.value}</dd></div>`)
      .join('');

    const productHTML = `
        <div class="cart-notification-product__image">
          <img src="${updatedCartNotification.image}" alt="${updatedCartNotification.featured_image.alt}" width="70" height="70">
        </div>
        <div>
          <p class="caption-with-letter-spacing">Shopify</p>
          <h3 class="cart-notification-product__name h4">${updatedCartNotification.product_title}</h3>
          <dl>${optionsHTML}</dl>
        </div>
      `;

    productElement.innerHTML = productHTML;
    this.showNotification();
  }

  showNotification() {
    this.querySelector('#cart-notification').classList.add('cart-notification-open');
  }

  hideNotification() {
    this.querySelector('#cart-notification').classList.remove('cart-notification-open');
  }
}

customElements.define('cart-notification', CartNotification);