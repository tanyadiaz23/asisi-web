(function () {
  'use strict';

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function productName(link) {
    var card = link.closest('[data-product-name], article');
    var heading = card && card.querySelector('h1, h2, h3');
    return clean(link.dataset.productName || (card && card.dataset.productName) || (heading && heading.textContent) || link.textContent);
  }

  function send(eventName, parameters) {
    if (!window.ttq || typeof window.ttq.track !== 'function') return;
    window.ttq.track(eventName, parameters || {});
  }

  window.AsiSiTracking = {
    viewProduct: function (name, id) {
      send('ViewContent', {
        content_type: 'product',
        content_ids: id ? [String(id)] : undefined,
        description: clean(name) || 'ASI SI product'
      });
    },
    affiliateClick: function (name, destination, id) {
      send('ViewContent', {
        content_type: 'product',
        content_ids: id ? [String(id)] : undefined,
        description: 'Affiliate click: ' + (clean(name) || 'Affiliate product')
      });
    }
  };

  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href]');
    if (!link) return;

    var label = clean(link.textContent).toLowerCase();
    var isProductCta = link.matches('[data-tiktok-event="ViewContent"]') || label === 'ver solución' || label === 'ver solucion' || label === 'ver producto';
    var isAffiliate = link.matches('[data-affiliate-link], [rel~="sponsored"]');
    var name = productName(link);
    var id = link.dataset.contentId || '';

    if (isAffiliate) {
      window.AsiSiTracking.affiliateClick(name, link.href, id);
    } else if (isProductCta) {
      window.AsiSiTracking.viewProduct(name, id);
    }
  });
}());
