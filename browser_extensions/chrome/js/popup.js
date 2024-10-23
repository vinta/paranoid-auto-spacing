/*
 Utils
 */

function is_valid_url_for_spacing(url) {
  if (url.search(/^(http(s?)|file)/i) >= 0) {
    return true;
  }
  else {
    return false;
  }
}

function spacing_page() {
  pangu.spacingPage();
}

/*
 Angular
 */

var app = angular.module('app', []);

app.controller('PopupController', [
  '$scope',
  async function PopupController($scope) {
    angular.element('#god_of_spacing').html(utils_chrome.get_i18n('god_of_spacing'));

    // 切換 spacing_mode
    $scope.spacing_mode = await chrome.runtime.sendMessage({purpose: 'get_cache_setting', key: 'spacing_mode'});
    $scope.spacing_mode_display = utils_chrome.get_i18n($scope.spacing_mode);
    $scope.change_spacing_mode = function() {
      if ($scope.spacing_mode === 'spacing_when_load') {
        $scope.spacing_mode = 'spacing_when_click';
      }
      else if ($scope.spacing_mode === 'spacing_when_click') {
        $scope.spacing_mode = 'spacing_when_load';
      }

      $scope.spacing_mode_display = utils_chrome.get_i18n($scope.spacing_mode);

      chrome.runtime.sendMessage({purpose: 'set_cache_setting', key: 'spacing_mode', value: $scope.spacing_mode});
    };

    // 招喚空格之神
    $scope.call_god_of_spacing_display = utils_chrome.get_i18n('call_god_of_spacing');
    $scope.call_god_of_spacing = function() {
      /*
       取得當前的 tabs（如果有多個螢幕的話，就可能會有很多個）
       也可能包含 Developer Tools 的 tab
       */
      chrome.tabs.query({active: true}, function(tab_array) {
        for (var i = 0; i < tab_array.length; i++) {
          var tab = tab_array[i];

          // 略過 chrome:// 之類的 URL
          if (is_valid_url_for_spacing(tab.url)) {
            chrome.scripting.executeScript({
              target: {tabId: tab.id},
              func: spacing_page
            });
          }
          else {
            if (i === 0) {
              alert(utils_chrome.get_i18n('can_not_call_god_of_spacing'));
            }
          }
        }
      });
    };

    $scope.extension_rate_display = utils_chrome.get_i18n('extension_rate');
    $scope.extension_options_display = utils_chrome.get_i18n('extension_options');
    $scope.open_options_page = function() {
      chrome.tabs.create({url: 'pages/options.html'});
    };
    $scope.$apply()
  }
]);
