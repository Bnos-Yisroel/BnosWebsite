// source --> https://bnosyisroel.org/wp-content/plugins/contact-form-7-select-box-editor-button/js/jquery.ba-hashchange.min.js?ver=0.6 
/*
 * jQuery hashchange event - v1.3 - 7/21/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);
// source --> https://bnosyisroel.org/wp-content/plugins/contact-form-7-select-box-editor-button/js/wpcf-select-box.js?ver=0.6 
// Contact Form 7 Select Box Editor Button
// @see http://wordpress.org/extend/plugins/contact-form-7-select-box-editor-button/



jQuery(document).ready(function($) {
  var form = $('.wpcf7-form');
  
  var form_current_recipient = '';
  
  function wpcf7_update_select()
  {
    var hash = window.location.hash;
    var value;
    
    if (form_current_recipient != '')
    	value = form_current_recipient;
    else
    	value = decodeURIComponent(hash.substring(1).replace(/\+/g, '%20'));
    
    jQuery('#recipient').val(value);
    
    jQuery('.wpcf7-form select').each(function() {
  	 if (this.selectedIndex == -1)
  		 this.selectedIndex = 0;
    });
  }
  
  // Do it when contact form is reset (after succesful submit)
  form.bind('reset', function() {
	  // Workaround until this is fixed: http://wordpress.org/support/topic/plugin-contact-form-7-trigger-jquery-event
	  setTimeout(wpcf7_update_select, 50);
  });
  
  // Get current name from form before reset (needs Contact Form >= 3.3)
  $('.wpcf7').bind('submit.wpcf7', function () {
	  form_current_recipient = $('#recipient').val();
  });

  // Do it when hash changes (Link from same page, doesn't trigger ready again)
  $(window).hashchange(wpcf7_update_select);
  
  // Do it no!
  wpcf7_update_select();
});