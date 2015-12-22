import Ember from 'ember';

const { $ } = Ember;

var isCrossDomain = function(url) {
  // based on https://github.com/rails/jquery-ujs/blob/1d8a0adba131ca74188cdd22f7174ac92f372094/src/rails.js#L184
  var originAnchor = document.createElement('a');
  originAnchor.href = location.href;
  var urlAnchor = document.createElement('a');

  try {
    urlAnchor.href = url;
    // This is a workaround to a IE bug.
    urlAnchor.href = urlAnchor.href;

    // If URL protocol is false or is a string containing a single colon
    // *and* host are false, assume it is not a cross-domain request
    // (should only be the case for IE7 and IE compatibility mode).
    // Otherwise, evaluate protocol and host of the URL against the origin
    // protocol and host.
    return !(((!urlAnchor.protocol || urlAnchor.protocol === ':') && !urlAnchor.host) ||
      (originAnchor.protocol + '//' + originAnchor.host ===
        urlAnchor.protocol + '//' + urlAnchor.host));
  } catch (e) {
    // If there is an error parsing the URL, assume it is crossDomain.
    return true;
  }
}

export default {
  name: 'ember-cli-rails-addon-csrf',
  initialize() {
    $.ajaxPrefilter((options, originalOptions, xhr) => {
      const token = $('meta[name="csrf-token"]').attr('content');
      if (token && !isCrossDomain(originalOptions.url)) {
        xhr.setRequestHeader('X-CSRF-Token', token);
      }
    });
  },
};
