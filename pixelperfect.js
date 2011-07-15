(function($) {
  $(document).ready(function() {
    if (Drupal.settings.ppReady) {
      strs = Drupal.settings.ppStrings;

      var img = new Image();
      $(img).load().attr('src', strs.pp_mockup);

      $(window).load(function() {
        $('<div id="pixelperfect-overlay-wrapper"><div id="pixelperfect-overlay"></div></div>').appendTo('body');

        $('#pixelperfect-overlay')
          .draggable({ opacity: 0.5 })
          .css({
            'background-image': 'url('+ encodeURI(strs.pp_mockup) +')', 
            'top' : strs.pp_top, 
            'left' : strs.pp_left, 
            'width' : img.width, 
            'height' : img.height
          })
          .mouseup(function () {
            $('#pp_top').val($('#pixelperfect-overlay').css('top'));
            $('#pp_left').val($('#pixelperfect-overlay').css('left'));

            jQuery.post(Drupal.settings.basePath + 'pixelperfect/update-position', {
              top: $('#pixelperfect-overlay').css('top'),
              left: $('#pixelperfect-overlay').css('left'),
              id: $('#pp-options').val() 
            });
          })
          .fadeTo(0, 0.5);
      });

      x = 1; 
      d = {};

      function newv(v,a,b) {
          $('#pp_top').val($('#pixelperfect-overlay').css('top'));
          $('#pp_left').val($('#pixelperfect-overlay').css('left'));

          var n = parseInt(v, 10) - (d[a] ? x : 0) + (d[b] ? x : 0);
          return n;
      }
      
      var oEnabled = 0;
      var oEnable = function() {
        oEnabled = 1 - oEnabled;
        if(oEnabled) {
          $(window).keydown(function(e) { 
            if(oEnabled && e.which >= 37 && e.which <= 40) {
              d[e.which] = true; 
              e.preventDefault();
            }
          });
          $(window).keyup(function(e) { 
            if(oEnabled) {
              d[e.which] = false; 
              if(e.which >= 37 && e.which <= 40) {
                jQuery.post(Drupal.settings.basePath + 'pixelperfect/update-position', {
                  top: $('#pixelperfect-overlay').css('top'),
                  left: $('#pixelperfect-overlay').css('left'),
                  id: $('#pp-options').val()
                });
                e.preventDefault();
              }
            }
          });
        }
      }

      setInterval(function() {
          $('#pixelperfect-overlay').css({
              left: function(i,v) { 
                return newv($(this).css('left'), 37, 39); 
              },
              top: function(i,v) { 
                return newv($(this).css('top'), 38, 40); 
              }
          });
      }, 100);
      $('<div id="pixelperfect-toggle"><input id="pp_top" type="hidden" value="'+ strs.pp_top +'"><input id="pp_left" type="hidden" value="'+ strs.pp_left +'" /></div>')
        .appendTo($('body'));
      $('<select id="pp-options">' + strs.pp_options + '</select>')  
        .appendTo($('#pixelperfect-toggle'))
        .change(function() {
          jQuery.post(Drupal.settings.basePath + 'pixelperfect/load-mockup', {
            id: $('#pp-options').val()
          },
          function (d,t,x) {
            response = jQuery.parseJSON(d);
            strs.pp_mockup = response.mockup;
            strs.pp_mockup_invert = response.mockup_invert;
            strs.pp_top = response.mockup_top;
            strs.pp_left = response.mockup_left;
            img.src = response.mockup;

            $(img).load(function() {
              $('#pixelperfect-overlay')
                .css({
                  'background-image': 'url('+ encodeURI(strs.pp_mockup) +')',
                  'top' : strs.pp_top,
                  'left' : strs.pp_left,
                  'width' : img.width,
                  'height' : img.height
                });
              });
          });
        });
      $('<label for="pp_toggle">'+ strs.pp_toggle +'</label><input id="pp_toggle" type="checkbox" />')
        .appendTo($('#pixelperfect-toggle'))
        .click(function() {
          ppMockup(); 
          oEnable();
        });
      $('<label for="pp_invert">'+ strs.pp_invert +'</label><input id="pp_invert" type="checkbox" />')
        .appendTo($('#pixelperfect-toggle'))
        .click(function() {
          ppInvert(); 
          oEnable();
        });
    }
  });

  var ppMockupEnabled = 0;
  var ppInvertEnabled = 0;

  var ppMockup = function() {
    ppMockupEnabled = 1 - ppMockupEnabled;
    $('#pp_toggle').attr('checked', ppMockupEnabled ? 'checked' : '');
    ppInvertEnabled = 0;
    $('#pp_invert').attr('checked','');
    $('#pixelperfect-overlay')
      .css({'background-image': 'url('+ encodeURI(strs.pp_mockup) +')'});
    $('#pixelperfect-overlay-wrapper')
      .css({'display' : ppMockupEnabled ? 'block' : 'none'});
  };

  var ppInvert = function() {
    ppInvertEnabled = 1 - ppInvertEnabled;
    $('#pp_invert').attr('checked', ppInvertEnabled ? 'checked' : '');
    ppMockupEnabled = 0;
    $('#pp_toggle').attr('checked','');
    $('#pixelperfect-overlay')
      .css({'background-image': 'url('+ encodeURI(strs.pp_mockup_invert) +')'});
    $('#pixelperfect-overlay-wrapper')
      .css({'display' : ppInvertEnabled ? 'block' : 'none'});
  };

})(jQuery);
