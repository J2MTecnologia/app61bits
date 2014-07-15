(function($) {
  "use strict";
  $.fn.extend({
    ////////////////////////////
    // Initialize Deletable List
    // Directly on the list
    ////////////////////////////
    UIDeletable : function ( options ) {
      /*
        options = {
          list: selector,
          editLabel : labelName || Edit,
          doneLabel : labelName || Done,
          deleteLabel : labelName || Delete,
          placement: left || right,
          callback : callback
        }
      */
      // Cache a reference to the list:
      var $this = this;
      // If no options, do nothing:
      if (!options) {
        return;
      }
      // If a list was provided, 
      // do older initialization:
      if (options && options.list) {
        return $.UIDeletable(options);
      // Otherwise pass in reference to list
      // and initialize with it:
      } else if (options && !options.list) {
        $.extend(options, {
          list: $this
        });
        return $.UIDeletable(options);
      }
    }
  });
  $.extend({
    ////////////////////////////
    // Initialize Deletable List
    ////////////////////////////
    UIDeletable : function ( options ) {
      /*
        options = {
          list: selector,
          editLabel : labelName || Edit,
          doneLabel : labelName || Done,
          deleteLabel : labelName || Delete,
          placement: left || right,
          callback : callback
        }
      */
      if (!options || !options.list || !options instanceof Array) {
        return;
      }
      var list = $(options.list);
      var editLabel = options.editLabel || 'Edit';
      var doneLabel = options.doneLabel || 'Done';
      var deleteLabel = options.deleteLabel || 'Delete';
      var placement = options.placement || 'right';
      var callback = options.callback || $.noop;
      var deleteButton;
      var editButton;
      var deletionIndicator;
      var button;
      var dispelDeletable = 'swiperight';
      var enableDeletable = 'swipeleft';
      var dir = $('html').attr('dir');
      dir = dir ? dir.toLowerCase() : '';
      if (dir === 'rtl') {
        dispelDeletable = 'swipeleft';
        enableDeletable = 'swiperight';
      }
      // Windows uses an icon for the delete button:
      if ($.isWin) deleteLabel = '';
      var height = $('li').eq(0)[0].clientHeight;
      deleteButton = $.concat('<a href="javascript:void(null)" class="button delete">', deleteLabel, '</a>');
      editButton = $.concat('<a href="javascript:void(null)" class="button edit">', editLabel, '</a>');
      deletionIndicator = '<span class="deletion-indicator"></span>';
      if (placement === 'left') {
        if (!list[0].classList.contains('deletable')) {
          list.closest('article').prev().prepend(editButton);
        }
      } else {
        if (!list[0].classList.contains('deletable')) {
          list.closest('article').prev().append(editButton);
          list.closest('article').prev().find('h1').addClass('buttonOnRight');
          list.closest('article').prev().find('.edit').addClass('align-flush');
          button = list.closest('article').prev().find('.edit');
        } else {
          button = list.closest('article').prev().find('.edit');
        }
      }
      list.find('li').forEach(function(ctx) {
        if (!$(ctx).has('.deletion-indicator').length) {
          $(ctx).prepend(deletionIndicator);
          $(ctx).append(deleteButton);
        }
      });
      list.addClass('deletable');
      var setupDeletability = function(callback, list, button) {
        $(function() {
          button.on('singletap', function() {
            var $this = this;
            if (this.classList.contains('edit')) {
              setTimeout(function() {
                $this.classList.remove('edit');
                $this.classList.add('done');
                $($this).text(doneLabel);
                $(list).addClass('showIndicators');
              });
            } else if (this.classList.contains('done')) {
              setTimeout(function() {
                $this.classList.remove('done');
                $this.classList.add('edit');
                $($this).text(editLabel);
                $(list).removeClass('showIndicators');
                $(list).find('li').removeClass('selected');
              });            
            }
          });
          $(list).off('singletap', '.deletion-indicator');
          $(list).on('singletap', '.deletion-indicator', function() {
            if ($(this).parent('li').hazClass('selected').length) {
              $(this).parent('li').removeClass('selected');
              return;
            } else {
              $(this).parent('li').addClass('selected');
            }
          });
        
          if ($.isiOS || $.isSafari) {
            $(list).on(dispelDeletable, 'li', function() {
              $(this).removeClass('selected');
            });
            $(list).on(enableDeletable, 'li', function() {
              $(this).addClass('selected');
            });
          }
          $(list).on('singletap', '.delete', function() {
            var $this = this;
            var direction = '-1000%';
            if ($('html').attr('dir') === 'rtl') direction = '1000%';
            $(this).siblings().css({'-webkit-transform': 'translate3d(' + direction + ',0,0)', '-webkit-transition': 'all 1s ease-out'});
            setTimeout(function() {
              callback.call(callback, $this);
              $($this).parent().remove();
            }, 500);
          });
        });    
      };
      return setupDeletability(callback, list, button);
    }
  });
})(window.$);