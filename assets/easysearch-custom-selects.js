document.addEventListener("DOMContentLoaded", function(){
  setTimeout(function(){
    var  url = window.location.href.replace(/-esi\d{7}/, '');
    history.pushState(null, url);
  }, 3000);
});
document.addEventListener('easysearch_init', function (e){
  easysearch.widgetSelectorForCustomSelects = '.header-search-holder';

  function initCustomSelects()
  {
    easysearch.jq(easysearch.widgetSelectorForCustomSelects).find('.easysearch-select-holder > select').each(function(i, el){
      var $this = easysearch.jq(this);
      var $holder = $this.parent().closest('.easysearch-holder');

      $this.addClass('select-hidden');
      $this.wrap('<div class="select"></div>');
      $this.after('<div class="select-styled"><span class="select-styled-text"></span><span class="select-styled-arrow"></span></div>');

      var $styledSelect = $this.next('div.select-styled');
      var $list = easysearch.jq('<ul />', {'class': 'select-options'}).insertAfter($styledSelect);

      $styledSelect.click(function(e) {
        e.stopPropagation();
        easysearch.jq('div.select-styled.active').not(this).each(function(){
          easysearch.jq(this).removeClass('active');
        });
        easysearch.jq(this).toggleClass('active');
      });

      easysearch.jq(document).click(function() {
        $styledSelect.removeClass('active');
      });

      document.addEventListener('easysearch_loaded', function (e){
        initCustomSelectsOptions( $this, $styledSelect, $list );
      });

      initCustomSelectsOptions( $this, $styledSelect, $list );
    });
  }

  function initCustomSelectsOptions( $sel, $styledSelect, $list )
  {
    $list.empty();
    $styledSelect.children('.select-styled-text').text( ($sel.children('option:selected').length) ? $sel.children('option:selected').text() : $sel.children('option').eq(0).text() );

    var numberOfOptions = $sel.children('option').length;
    for (var i = 0; i < numberOfOptions; i++) {
        easysearch.jq('<li />', {
            text: $sel.children('option').eq(i).text(),
            rel: $sel.children('option').eq(i).val()
        }).appendTo($list);
    }

    var $listItems = $list.children('li');
    $listItems.click(function(e) {
      e.stopPropagation();
      var $holder = $(this).parent().closest('.easysearch-holder');
      $styledSelect.removeClass('active').children('.select-styled-text').text(easysearch.jq(this).text());
      $sel.val(easysearch.jq(this).attr('rel')).trigger('change');

      var $selectHolder = $styledSelect.parent().closest('.easysearch-select-holder');
      var $nextSelectHolder = $selectHolder.next('.easysearch-select-holder');
      if( $nextSelectHolder.length ) $nextSelectHolder.find('.select-styled').addClass('active');

      setTimeout(function(){
        $holder.find('.easysearch-select-holder .select').each(function(){
          var $sel  = easysearch.jq(this).children('select:first');
          var $styledSelect = easysearch.jq(this).children('.select-styled:first');
          var $list = easysearch.jq(this).children('.select-options:first');
          initCustomSelectsOptions( $sel, $styledSelect, $list );
        });
      }, 50);
    });
  }

  initCustomSelects();
});