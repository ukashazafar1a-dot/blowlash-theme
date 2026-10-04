// Part 1: Fixed initializeSlider function (ES5 compatible)
function initializeSlider() {
  var parents = document.querySelectorAll(".hero_main");
  if (parents.length === 0) {
    console.log("No hero_main elements found.");
    return;
  }

  parents.forEach(function(parent) {
    var elem = parent.querySelector(".hs-slider-main");
    var nextBtn = parent.querySelector(".next-btn") || null;
    var prevBtn = parent.querySelector(".prev-btn") || null;
    
    if (elem && !elem.classList.contains("flickity-enabled")) {
      var slides = elem.querySelectorAll(".single_slide");
      
      if(slides.length == 1 && nextBtn && prevBtn){
        nextBtn.style.display = 'none';
        prevBtn.style.display = 'none';
      }

      if (slides.length > 1) {
        var rotationAttr = elem.getAttribute("data-rotation");
        var rotation = rotationAttr ? parseInt(rotationAttr, 10) : 3000;
        
        var arrowsAttr = elem.getAttribute("data-arrows");
        var showArrows = arrowsAttr ? arrowsAttr.toLowerCase() === "true" : false;
        
        var dotsAttr = elem.getAttribute("data-dots");
        var showDots = dotsAttr ? dotsAttr.toLowerCase() === "true" : false;
        
        var autoplayAttr = elem.getAttribute("data-autoplay");
        var enableAutoplay = autoplayAttr ? autoplayAttr.toLowerCase() === "true" : false;

        var options = {
          cellAlign: "left",
          freeScroll: false,
          contain: true,
          prevNextButtons: false,
          draggable: true,
          wrapAround: true,
          pauseAutoPlayOnHover: false,
          adaptiveHeight: true,
          imagesLoaded: true,
          setGallerySize: false,
          pageDots: showDots,
          autoPlay: enableAutoplay ? rotation : false,
          cellSelector: ".single_slide"
        };

        var flkty = new Flickity(elem, options);

        if (showArrows && nextBtn && prevBtn) {
          nextBtn.addEventListener("click", function() { flkty.next(); });
          prevBtn.addEventListener("click", function() { flkty.previous(); });
        }
      }
    }
  });
}

// Part 2: Event listeners for initializeSlider
var shopifyEvents = [
  "shopify:block:select",
  "shopify:block:deselect", 
  "shopify:section:load",
  "shopify:section:reorder",
  "shopify:section:select",
  "shopify:section:deselect",
  "shopify:inspector:activate",
  "shopify:inspector:deactivate"
];

shopifyEvents.forEach(function(eventName) {
  document.addEventListener(eventName, initializeSlider);
});

document.addEventListener("DOMContentLoaded", initializeSlider);

window.addEventListener("resize", function() {
  if (window.innerWidth < 768) {
    initializeSlider();
  }
});

if (window.Shopify && window.Shopify.designMode) {
  initializeSlider();
}

// Part 3: hideProductModal function (from your original second code)
function hideProductModal() {
  var productModal = document.querySelectorAll('product-modal[open]');
  if (productModal) {
    productModal.forEach(function(modal) {
      if (modal.hide) modal.hide();
    });
  }
}

// Part 4: Additional Shopify event handlers (from your original second code)
document.addEventListener('shopify:block:select', function (event) {
  hideProductModal();
  var blockSelectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockSelectedIsSlide) return;

  var parentSlideshowComponent = event.target.closest('slideshow-component');
  if (parentSlideshowComponent && parentSlideshowComponent.pause) {
    parentSlideshowComponent.pause();
  }

  setTimeout(function () {
    if (parentSlideshowComponent && parentSlideshowComponent.slider && parentSlideshowComponent.slider.scrollTo) {
      parentSlideshowComponent.slider.scrollTo({
        left: event.target.offsetLeft,
      });
    }
  }, 200);
});

document.addEventListener('shopify:block:deselect', function (event) {
  var blockDeselectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockDeselectedIsSlide) return;
  var parentSlideshowComponent = event.target.closest('slideshow-component');
  if (parentSlideshowComponent && parentSlideshowComponent.autoplayButtonIsSetToPlay && parentSlideshowComponent.play) {
    parentSlideshowComponent.play();
  }
});

document.addEventListener('shopify:section:load', function() {
  hideProductModal();
  var zoomOnHoverScript = document.querySelector('[id^=EnableZoomOnHover]');
  if (zoomOnHoverScript) {
    var newScriptTag = document.createElement('script');
    newScriptTag.src = zoomOnHoverScript.src;
    zoomOnHoverScript.parentNode.replaceChild(newScriptTag, zoomOnHoverScript);
  }
});

document.addEventListener('shopify:section:unload', function(event) {
  document.querySelectorAll('[data-section="' + event.detail.sectionId + '"]').forEach(function(element) {
    element.remove();
  });
  document.body.classList.remove('overflow-hidden');
});

document.addEventListener('shopify:section:reorder', hideProductModal);
document.addEventListener('shopify:section:select', hideProductModal);
document.addEventListener('shopify:section:deselect', hideProductModal);
document.addEventListener('shopify:inspector:activate', hideProductModal);
document.addEventListener('shopify:inspector:deactivate', hideProductModal);