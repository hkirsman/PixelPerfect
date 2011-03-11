if (Drupal.jsEnabled) {
  $(document).ready(function () {
    strs = Drupal.settings.ppStrings;

    var img = new Image();
    $(img).load();
    img.src = strs.pp_mockup;

    $('<div id="pixelperfect-overlay"></div>')
      .appendTo('body')
      .css({
        'background-image': 'url('+ strs.pp_mockup +')', 
        'top' : strs.pp_top, 
        'left' : strs.pp_left, 
        'width' : img.width, 
        'height' : img.height
      })
      .mouseup(function () {
        $('#pp_top').val($('#pixelperfect-overlay').css('top'));
        $('#pp_left').val($('#pixelperfect-overlay').css('left'));
      })
      .draggable({
        stop: function(event, ui) {
          jQuery.post(Drupal.settings.basePath + 'pixelperfect/update-position', {
            top: $('#pixelperfect-overlay').css('top'),
            left: $('#pixelperfect-overlay').css('left'),
            id: strs.pp_mockup_id 
          });
        }
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
          d[e.which] = true; 
          if(oEnabled) {
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
                id: strs.pp_mockup_id 
              });
              console.log('f');
              e.preventDefault();
            }
          } else {
            //console.log('t');
            //return true;
            //$(window).keydown(function(e) { d[e.which] = false; return true; });
            //$(window).keyup(function(e) { return true; }); 
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
  });

  var ppMockupEnabled = 0;
  var ppMockup = function() {
    ppMockupEnabled = 1 - ppMockupEnabled;
    $('#pp_toggle').attr('checked', ppMockupEnabled ? 'checked' : '');
    $('#pixelperfect-overlay')
      .css({'background-image': 'url('+ strs.pp_mockup+')', 'display' : ppMockupEnabled ? 'block' : 'none'});
  };

  var ppInvertEnabled = 0;
  var ppInvert = function() {
    ppInvertEnabled = 1 - ppInvertEnabled;
    $('#pp_invert').attr('checked', ppInvertEnabled ? 'checked' : '');
    $('#pixelperfect-overlay')
      .css({'background-image': 'url('+ strs.pp_mockup_invert +')', 'display' : ppInvertEnabled ? 'block' : 'none'});
  };
}
