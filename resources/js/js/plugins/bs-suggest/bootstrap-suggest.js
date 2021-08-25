/**
* Bootstrap Search Suggest
* @desc This is a search suggestion plugin based on the bootstrap button drop-down menu component, which must be used on the button drop-down menu component.
* @author renxia <lzwy0820 # qq.com>
* @github https://github.com/lzwme/bootstrap-suggest-plugin.git
    * @since 2014-10-09
* ================================================= ==============================
 * (c) Copyright 2014-2019 https://lzw.me All Rights Reserved.
 ********************************************************************************/

(function(factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else if (typeof exports === "object" && typeof module === "object") {
    factory(require("jquery"));
  } else if (window.jQuery) {
    factory(window.jQuery);
  } else {
    throw new Error("Not found jQuery.");
  }
})(function($) {
  var VERSION = "VERSION_PLACEHOLDER";
  var $window = $(window);
    var isIe = "ActiveXObject" in window; // Used to judge the compatibility of IE
    var inputLock; // Used to lock the search when Chinese input method is input

    // Browser versions under ie and chrome 51 and above, padding is not calculated when a scroll bar appears
  var chromeVer = navigator.userAgent.match(/Chrome\/(\d+)/);
  if (chromeVer) {
    chromeVer = +chromeVer[1];
  }
  var notNeedCalcPadding = isIe || chromeVer > 51;

    // some constants
  var BSSUGGEST = "bsSuggest";
  var onDataRequestSuccess = "onDataRequestSuccess";
  var DISABLED = "disabled";
  var TRUE = true;
  var FALSE = false;

  function isUndefined(val) {
    return val === void 0;
  }

  /**
   * Error handling
   */
  function handleError(e1, e2) {
    if (!window.console || !window.console.trace) {
      return;
    }
    console.trace(e1);
    if (e2) {
      console.trace(e2);
    }
  }
  /**
   * 获取当前 tr 列的关键字数据
   */
  function getPointKeyword($list) {
    return $list.data();
  }
  /**
   * 设置或获取输入框的 alt 值
   */
  function setOrGetAlt($input, val) {
    return isUndefined(val) ? $input.attr("alt") : $input.attr("alt", val);
  }
  /**
   * 设置或获取输入框的 data-id 值
   */
  function setOrGetDataId($input, val) {
    return val !== void 0
      ? $input.attr("data-id", val)
      : $input.attr("data-id");
  }
  /**
   * 设置选中的值
   */
  function setValue($input, keywords, options) {
    if (!keywords || !keywords.key) {
      return;
    }

    var separator = options.separator || ",",
      inputValList,
      inputIdList,
      dataId = setOrGetDataId($input);

    if (options && options.multiWord) {
      inputValList = $input.val().split(separator);
      inputValList[inputValList.length - 1] = keywords.key;

      //多关键字检索支持设置id --- 存在 bug，不建议使用
      if (!dataId) {
        inputIdList = [keywords.id];
      } else {
        inputIdList = dataId.split(separator);
        inputIdList.push(keywords.id);
      }

      setOrGetDataId($input, inputIdList.join(separator))
        .val(inputValList.join(separator))
        .focus();
    } else {
      setOrGetDataId($input, keywords.id || "")
        .val(keywords.key)
        .focus();
    }

    $input
      .data("pre-val", $input.val())
      .trigger("onSetSelectValue", [
        keywords,
        (options.data.value || options._lastData.value)[keywords.index]
      ]);
  }
  /**
   * 调整选择菜单位置
   * @param {Object} $input
   * @param {Object} $dropdownMenu
   * @param {Object} options
   */
  function adjustDropMenuPos($input, $dropdownMenu, options) {
    if (!$dropdownMenu.is(":visible")) {
      return;
    }

    var $parent = $input.parent();
    var parentHeight = $parent.height();
    var parentWidth = $parent.width();

    if (options.autoDropup) {
      setTimeout(function() {
        var offsetTop = $input.offset().top;
        var winScrollTop = $window.scrollTop();
        var menuHeight = $dropdownMenu.height();

        if (
          // 自动判断菜单向上展开
          $window.height() + winScrollTop - offsetTop < menuHeight && // 假如向下会撑长页面
          offsetTop > menuHeight + winScrollTop // 而且向上不会撑到顶部
        ) {
          $parent.addClass("dropup");
        } else {
          $parent.removeClass("dropup");
        }
      }, 10);
    }

    // 列表对齐方式
    var dmcss = {};
    if (options.listAlign === "left") {
      dmcss = {
        left: $input.siblings("div").width() - parentWidth,
        right: "auto"
      };
    } else if (options.listAlign === "right") {
      dmcss = {
        left: "auto",
        right: 0
      };
    }

    // ie 下，不显示按钮时的 top/bottom
    if (isIe && !options.showBtn) {
      if (!$parent.hasClass("dropup")) {
        dmcss.top = parentHeight;
        dmcss.bottom = "auto";
      } else {
        dmcss.top = "auto";
        dmcss.bottom = parentHeight;
      }
    }

    // 是否自动最小宽度
    if (!options.autoMinWidth) {
      dmcss.minWidth = parentWidth;
    }
    /* else {
            dmcss['width'] = 'auto';
        }*/

    $dropdownMenu.css(dmcss);

    return $input;
  }
  /**
   * 设置输入框背景色
   * 当设置了 indexId，而输入框的 data-id 为空时，输入框加载警告色
   */
  function setBackground($input, options) {
    var inputbg, bg, warnbg;
    if ((options.indexId === -1 && !options.idField) || options.multiWord) {
      return $input;
    }

    bg = options.inputBgColor;
    warnbg = options.inputWarnColor;

    var curVal = $input.val();
    var preVal = $input.data("pre-val");

    if (setOrGetDataId($input) || !curVal) {
      $input.css("background", bg || "");

      if (!curVal && preVal) {
        $input.trigger("onUnsetSelectValue").data("pre-val", "");
      }

      return $input;
    }

    inputbg = $input
      .css("backgroundColor")
      .replace(/ /g, "")
      .split(",", 3)
      .join(",");
    // 自由输入的内容，设置背景色
    if (!~warnbg.indexOf(inputbg)) {
      $input
        .trigger("onUnsetSelectValue") // 触发取消data-id事件
        .data("pre-val", "")
        .css("background", warnbg);
    }

    return $input;
  }
  /**
   * 调整滑动条
   */
  function adjustScroll($input, $dropdownMenu, options) {
    // 控制滑动条
    var $hover = $input.parent().find("tbody tr." + options.listHoverCSS),
      pos,
      maxHeight;

    if ($hover.length) {
      pos = ($hover.index() + 3) * $hover.height();
      maxHeight = +$dropdownMenu.css("maxHeight").replace("px", "");

      if (pos > maxHeight || $dropdownMenu.scrollTop() > maxHeight) {
        pos = pos - maxHeight;
      } else {
        pos = 0;
      }

      $dropdownMenu.scrollTop(pos);
    }
  }
  /**
   * 解除所有列表 hover 样式
   */
  function unHoverAll($dropdownMenu, options) {
    $dropdownMenu
      .find("tr." + options.listHoverCSS)
      .removeClass(options.listHoverCSS);
  }
  /**
   * 验证 $input 对象是否符合条件
   *   1. 必须为 bootstrap 下拉式菜单
   *   2. 必须未初始化过
   */
  function checkInput($input, $dropdownMenu, options) {
    if (
      !$dropdownMenu.length || // 过滤非 bootstrap 下拉式菜单对象
      $input.data(BSSUGGEST) // 是否已经初始化的检测
    ) {
      return FALSE;
    }

    $input.data(BSSUGGEST, {
      options: options
    });

    return TRUE;
  }
  /**
   * Data format detection
   * Check whether ajax returns successful data or data parameter data is valid
   * data 格式：{"value": [{}, {}...]}
   */
  function checkData(data) {
    var isEmpty = TRUE,
      o;

    for (o in data) {
      if (o === "value") {
        isEmpty = FALSE;
        break;
      }
    }
    if (isEmpty) {
      handleError("The format of the returned data is incorrect!");
      return FALSE;
    }
    if (!data.value.length) {
      // handleError('返回数据为空!');
      return FALSE;
    }

    return data;
  }
  /**
   * 判断字段名是否在 options.effectiveFields 配置项中
   * @param  {String} field   要判断的字段名
   * @param  {Object} options
   * @return {Boolean}        effectiveFields 为空时始终返回 true
   */
  function inEffectiveFields(field, options) {
    var effectiveFields = options.effectiveFields;

    return !(
      field === "__index" ||
      (effectiveFields.length && !~$.inArray(field, effectiveFields))
    );
  }
  /**
   * 判断字段名是否在 options.searchFields 搜索字段配置中
   */
  function inSearchFields(field, options) {
    return ~$.inArray(field, options.searchFields);
  }
  /**
   * 通过下拉菜单显示提示文案
   */
  function showTip(tip, $input, $dropdownMenu, options) {
    $dropdownMenu
      .html('<div style="padding:10px 5px 5px">' + tip + "</div>")
      .show();
    adjustDropMenuPos($input, $dropdownMenu, options);
  }
  /**
   * 显示下拉列表
   */
  function showDropMenu($input, options) {
    var $dropdownMenu = $input.parent().find("ul:eq(0)");
    if (!$dropdownMenu.is(":visible")) {
      // $dropdownMenu.css('display', 'block');
      $dropdownMenu.show();
      $input.trigger("onShowDropdown", [options ? options.data.value : []]);
    }
  }
  /**
   * 隐藏下拉列表
   */
  function hideDropMenu($input, options) {
    var $dropdownMenu = $input.parent().find("ul:eq(0)");
    if ($dropdownMenu.is(":visible")) {
      // $dropdownMenu.css('display', '');
      $dropdownMenu.hide();
      $input.trigger("onHideDropdown", [options ? options.data.value : []]);
    }
  }
  /**
   * 下拉列表刷新
   * 作为 fnGetData 的 callback 函数调用
   */
  function refreshDropMenu($input, data, options) {
    var $dropdownMenu = $input.parent().find("ul:eq(0)"),
      len,
      i,
      field,
      index = 0,
      tds,
      html = [
        '<table class="table table-condensed table-sm" style="margin:0">'
      ],
      idValue,
      keyValue; // 作为输入框 data-id 和内容的字段值
    var dataList = data.value;

    if (!data || !(len = dataList.length)) {
      if (options.emptyTip) {
        showTip(options.emptyTip, $input, $dropdownMenu, options);
      } else {
        $dropdownMenu.empty();
        hideDropMenu($input, options);
      }
      return $input;
    }

    // 相同数据，不用继续渲染了
    if (
      options._lastData &&
      JSON.stringify(options._lastData) === JSON.stringify(data) &&
      $dropdownMenu.find("tr").length === len
    ) {
      showDropMenu($input, options);
      return adjustDropMenuPos($input, $dropdownMenu, options);
    }
    options._lastData = data;

    /** 显示于列表中的字段 */
    var columns = options.effectiveFields.length
      ? options.effectiveFields
      : $.map(dataList[0], function(val, key) {
          return key;
        });

    // 生成表头
    if (options.showHeader) {
      html.push("<thead><tr>");
      $.each(columns, function(index, field) {
        if (!inEffectiveFields(field, options)) return;

        html.push(
          "<th>",
          options.effectiveFieldsAlias[field] || field,
          index === 0 ? "(" + len + ")" : "", // Total number of records in the first column of the table header
          "</th>"
        );

        index++;
      });
      html.push("</tr></thead>");
    }
    html.push("<tbody>");

    // console.log(data, len);
    // Add data by column
    var dataI;
    var maxOptionCount = Math.min(options.maxOptionCount, len);
    for (i = 0; i < maxOptionCount; i++) {
      index = 0;
      tds = [];
      dataI = dataList[i];
      idValue = dataI[options.idField];
      keyValue = dataI[options.keyField];

      for (field in dataI) {
        // Mark as value and as id value
        if (isUndefined(keyValue) && options.indexKey === index) {
          keyValue = dataI[field];
        }
        if (isUndefined(idValue) && options.indexId === index) {
          idValue = dataI[field];
        }
        index++;
      }

      $.each(columns, function(index, field) {
        // Only valid fields are shown in the list
        if (inEffectiveFields(field, options)) {
          tds.push('<td data-name="', field, '">', dataI[field], "</td>");
        }
      });

      html.push(
        '<tr data-index="',
        dataI.__index || i,
        '" data-id="',
        idValue,
        '" data-key="',
        keyValue,
        '">',
        tds.join(""),
        "</tr>"
      );
    }
    html.push("</tbody></table>");

    $dropdownMenu.html(html.join(""));
    showDropMenu($input, options);
    //.show();

    // When scrollbar exists, delay to adjust the padding at the end of the animation
    setTimeout(function() {
      if (notNeedCalcPadding) {
        return;
      }

      var $table = $dropdownMenu.find("table:eq(0)"),
        pdr = 0,
        mgb = 0;

      if (
        $dropdownMenu.height() < $table.height() &&
        +$dropdownMenu.css("minWidth").replace("px", "") < $dropdownMenu.width()
      ) {
        pdr = 18;
        mgb = 20;
      }

      $dropdownMenu.css("paddingRight", pdr);
      $table.css("marginBottom", mgb);
    }, 301);

    adjustDropMenuPos($input, $dropdownMenu, options);

    return $input;
  }
  /**
   * ajax get data
   * @param  {Object} options
   * @return {Object}         $.Deferred
   */
  function ajax(options, keyword) {
    keyword = keyword || "";

    var preAjax = options._preAjax;

    if (preAjax && preAjax.abort && preAjax.readyState !== 4) {
      // console.log('abort pre ajax');
      preAjax.abort();
    }

    var ajaxParam = {
      type: "GET",
      dataType: options.jsonp ? "jsonp" : "json",
      timeout: 5000
    };

    // jsonp
    if (options.jsonp) {
      ajaxParam.jsonp = options.jsonp;
    }

    // Custom ajax request parameter generation method
    var adjustAjaxParam,
      fnAdjustAjaxParam = options.fnAdjustAjaxParam;

    if ($.isFunction(fnAdjustAjaxParam)) {
      adjustAjaxParam = fnAdjustAjaxParam(keyword, options);

      // options.fnAdjustAjaxParam returns false, then terminate the ajax request
      if (FALSE === adjustAjaxParam) {
        return;
      }

      $.extend(ajaxParam, adjustAjaxParam);
    }

    // url adjustment
    ajaxParam.url = (function() {
      if (!keyword || ajaxParam.data) {
        return ajaxParam.url || options.url;
      }

      var type = "?";
      if (/=$/.test(options.url)) {
        type = "";
      } else if (/\?/.test(options.url)) {
        type = "&";
      }

      return options.url + type + encodeURIComponent(keyword);
    })();

    return (options._preAjax = $.ajax(ajaxParam)
      .done(function(result) {
        options.data = options.fnProcessData(result);
      })
      .fail(function(err) {
        if (options.fnAjaxFail) {
          options.fnAjaxFail(err, options);
        }
      }));
  }
  /**
   * Check if keyword and value contain each other
   * @param  {String}  keyword Keywords entered by the user
   * @param  {String}  key     The key of the matching field
   * @param  {String}  value   The value corresponding to the key field
   * @param  {Object}  options
   * @return {Boolean}         Contained / not included
   */
  function isInWord(keyword, key, value, options) {
    value = $.trim(value);

    if (options.ignorecase) {
      keyword = keyword.toLocaleLowerCase();
      value = value.toLocaleLowerCase();
    }

    return (
      value &&
      (inEffectiveFields(key, options) || inSearchFields(key, options)) && // Must be in a valid search field
      (~value.indexOf(keyword) || // Match value contains keywords
        (options.twoWayMatch && ~keyword.indexOf(value))) // Keywords contain matching values
    );
  }
  /**
   * Get data through ajax or json parameters
   */
  function getData(keyword, $input, callback, options) {
    var data,
      validData,
      filterData = {
        value: []
      },
      i,
      key,
      len,
      fnPreprocessKeyword = options.fnPreprocessKeyword;

    keyword = keyword || "";
    // Keyword preprocessing method before obtaining data
    if ($.isFunction(fnPreprocessKeyword)) {
      keyword = fnPreprocessKeyword(keyword, options);
    }

    // Given the url parameter, request from the server ajax
    // console.log(options.url + keyword);
    if (options.url) {
      var timer;
      if (options.searchingTip) {
        timer = setTimeout(function() {
          showTip(
            options.searchingTip,
            $input,
            $input.parent().find("ul"),
            options
          );
        }, 600);
      }

      ajax(options, keyword)
        .done(function(result) {
          callback($input, options.data, options); // for refreshDropMenu
          $input.trigger(onDataRequestSuccess, result);
          if (options.getDataMethod === "firstByUrl") {
            options.url = null;
          }
        })
        .always(function() {
          timer && clearTimeout(timer);
        });
    } else {
      // If the url parameter is not given, it is obtained from the data parameter
      data = options.data;
      validData = checkData(data);
      // Local data data is filtered locally
      if (validData) {
        if (keyword) {
          // Match when the input is not empty
          len = data.value.length;
          for (i = 0; i < len; i++) {
            for (key in data.value[i]) {
              if (
                data.value[i][key] &&
                isInWord(keyword, key, data.value[i][key] + "", options)
              ) {
                filterData.value.push(data.value[i]);
                filterData.value[filterData.value.length - 1].__index = i;
                break;
              }
            }
          }
        } else {
          filterData = data;
        }
      }

      callback($input, filterData, options);
    } // else
  }
  /**
   * data processing
   * When url gets data, the processing of the data is used as the callback processing after fnGetData
   */
  function processData(data) {
    return checkData(data);
  }
  /**
   * Get clearable button
   */
  function getIClear($input, options) {
    var $iClear = $input.prev("i.clearable");

    // Whether the input content can be cleared (add clear button)
    if (options.clearable && !$iClear.length) {
      $iClear = $(
        '<i class="clearable glyphicon glyphicon-remove fa fa-plus"></i>'
      ).prependTo($input.parent());
    }

    return $iClear
      .css({
        position: "absolute",
        top: "calc(50% - 6px)",
        transform: "rotate(45deg)",
        // right: options.showBtn ? Math.max($input.next('.input-group-btn').width(), 33) + 2 : 12,
        zIndex: 4,
        cursor: "pointer",
        width: "14px",
        lineHeight: "14px",
        textAlign: "center",
        fontSize: 12
      })
      .hide();
  }
  /**
   * Default configuration options
   * @type {Object}
   */
  var defaultOptions = {
      url: null, // URL of request data
      jsonp: null, // Setting this parameter name will enable jsonp function, otherwise use json data structure
      data: {
          value: []
      }, // Prompt the data used, pay attention to the format
      indexId: 0, // The number of the data in each group of data, as the data-id of the input input box, set to -1 and idField is empty, this value is not set
      indexKey: 0, // The number of each group of data, as the content of the input input box
      idField: "", // Which field of each group of data is used as the data-id, the priority is higher than the indexId setting (recommended)
      keyField: "", // Which field of each group of data is used as the input box content, the priority is higher than the indexKey setting (recommended)

    /* Search related */
    autoSelect: TRUE, // Whether the value is automatically selected when the keyboard up / down arrow keys
        allowNoKeyword: TRUE, // Whether to allow data to be requested without keywords
        getDataMethod: "firstByUrl", // How to get data, url: always request from url; data: get from options.data; firstByUrl: get all data from Url for the first time, then get from options.data
        delayUntilKeyup: FALSE, // when the way to get data is firstByUrl, whether to request data when there is input delay
        ignorecase: FALSE, // Whether to ignore the case when the front end searches for a match
        effectiveFields: [], // Fields that are effectively displayed in the list, all fields that are not valid are filtered, and all are valid by default.
        effectiveFieldsAlias: {}, // Alias ​​object for effective fields, used for header display
        searchFields: [], // Effective search fields, used when searching filtered data from the front end, but not necessarily displayed in the list. effectiveFields configuration fields are also used for search filtering
        twoWayMatch: TRUE, // Whether to search in both directions. True means that the input keyword is included or included in the matching field, and the match is considered to be successful. If false, the input keyword is included in the matching field and the match is considered to be successful.
        multiWord: FALSE, // Multi-keyword support separated by delimiters
        separator: ",", // The separator when multiple keywords are supported, the default is a half-width comma
        delay: 300, // Delay time interval for search trigger, in milliseconds
        emptyTip: "", // The content displayed when the query is empty, can be html
        searchingTip: "Searching ...", // The content of the prompt displayed during ajax search, when the search time is longer, the prompt is being searched
        hideOnSelect: FALSE, // Whether to hide the selection list when the mouse clicks the selected value from the list
        maxOptionCount: 200, // Select the maximum number of options displayed in the list, the default is 200

    /* UI */
    autoDropup: FALSE, // Select whether the menu automatically determines whether to expand upward. Set to true, when the drop-down menu height exceeds the form, and the upward direction will not be covered by the form, then select the menu to pop up
        autoMinWidth: FALSE, // Whether to automatically minimize the width, set to false, the minimum width is not less than the width of the input box
        showHeader: FALSE, // Whether to display the header of the selection list. When true, the header is displayed if the effective field is greater than one column
        showBtn: TRUE, // Whether to show the drop-down button
        inputBgColor: "", // The background color of the input box, when it is different from the background color of the container, the configuration of this item may be required
        inputWarnColor: "rgba (255,0,0, .1)", // The content of the input box is not the warning color when the drop-down list is selected
        listStyle: {
        "padding-top": 0,
            "max-height": "375px",
            "max-width": "800px",
            overflow: "auto",
            width: "auto",
            transition: "0.3s",
            "-webkit-transition": "0.3s",
            "-moz-transition": "0.3s",
            "-o-transition": "0.3s",
            "word-break": "keep-all",
            "white-space": "nowrap"
    }, // List style control
    listAlign: "left", // Prompt list alignment position, left / right / auto
        listHoverStyle: "background: # 07d; color: #fff", // style of the mouse hover of the list box
        listHoverCSS: "jhover", // style name of the mouse hover of the list box
        clearable: FALSE, // Whether the input content can be cleared

        /* key */
    keyLeft: 37, // Left arrow key, different operating systems may have differences, so you can define your own
        keyUp: 38, // Up arrow key
        keyRight: 39, // right arrow key
        keyDown: 40, // Down arrow key
        keyEnter: 13, // Enter key

        /* methods */
    fnProcessData: processData, // Method for formatting data, return data format refer to data parameter
        fnGetData: getData, // The method of obtaining data, generally do not set it if there is no special requirement
        fnAdjustAjaxParam: null, // Adjust the ajax request parameter method for more request configuration requirements. Such as further processing of request keywords, modification of timeout period, etc.
        fnPreprocessKeyword: null, // Before searching the filtered data, further process the input keywords. Note that the string should be returned
        fnAjaxFail: null // callback method when ajax fails
  };

  var methods = {
    init: function(options) {
        // parameter settings
      var self = this;
      options = options || {};

        // The default configuration effectively displays more than one field, the list header is displayed, otherwise it is not displayed
      if (
        isUndefined(options.showHeader) &&
        options.effectiveFields &&
        options.effectiveFields.length > 1
      ) {
        options.showHeader = TRUE;
      }

      options = $.extend(TRUE, {}, defaultOptions, options);

        // The old method is compatible
      if (options.processData) {
        options.fnProcessData = options.processData;
      }

      if (options.getData) {
        options.fnGetData = options.getData;
      }

      if (
        options.getDataMethod === "firstByUrl" &&
        options.url &&
        !options.delayUntilKeyup
      ) {
        ajax(options).done(function(result) {
          options.url = null;
          self.trigger(onDataRequestSuccess, result);
        });
      }

        // Mouse to the entry style
      if (!$("#" + BSSUGGEST).length) {
        $("head:eq(0)").append(
          '<style id="' +
            BSSUGGEST +
            '">.' +
            options.listHoverCSS +
            "{" +
            options.listHoverStyle +
            "}</style>"
        );
      }

      return self.each(function() {
        var $input = $(this),
          $parent = $input.parent(),
          $iClear = getIClear($input, options),
          isMouseenterMenu,
          keyupTimer, // keyup 与 input 事件延时定时器
          $dropdownMenu = $parent.find("ul:eq(0)");

        // 兼容 bs4
        $dropdownMenu.parent().css("position", "relative");

          // Verify that the input box object meets the conditions
        if (!checkInput($input, $dropdownMenu, options)) {
          console.warn(
            "Not a standard bootstrap drop-down menu or initialized:",
            $input
          );
          return;
        }

          // Whether to show the button
        if (!options.showBtn) {
          $input.css("borderRadius", 4);
          $parent
            .css("width", "100%")
            .find(".btn:eq(0)")
            .hide();
        }

          // Remove the disabled class and disable auto completion
        $input
          .removeClass(DISABLED)
          .prop(DISABLED, FALSE)
          .attr("autocomplete", "off");
        // dropdown-menu Add decoration
        $dropdownMenu.css(options.listStyle);

          // default background color
        if (!options.inputBgColor) {
          options.inputBgColor = $input.css("backgroundColor");
        }

          // Start event processing
        $input
            .on ("keydown.bs", function (event) {
                var currentList, tipsKeyword; // The selected keyword on the prompt list

                // Handle keyboard events only when the prompt layer is displayed
                if (! $dropdownMenu.is (":visible")) {
                    setOrGetDataId ($input, "");
                    return;
                }

            currentList = $dropdownMenu.find("." + options.listHoverCSS);
            tipsKeyword = ""; // The selected keyword on the reminder list

            unHoverAll($dropdownMenu, options);

            if (event.keyCode === options.keyDown) {
                // If you pressed the down arrow key
              if (!currentList.length) {
                  // If none of the prompt list is selected, select the first one in the list
                tipsKeyword = getPointKeyword(
                  $dropdownMenu.find("tbody tr:first").mouseover()
                );
              } else if (!currentList.next().length) {
                  // If it is the last one selected, then deselect it, it can be considered that the input box is selected, and restore the entered value
                if (options.autoSelect) {
                  setOrGetDataId($input, "").val(setOrGetAlt($input));
                }
              } else {
                  // select the next line
                tipsKeyword = getPointKeyword(currentList.next().mouseover());
              }
                // control slider
              adjustScroll($input, $dropdownMenu, options);

              if (!options.autoSelect) {
                return;
              }
            } else if (event.keyCode === options.keyUp) {
                // If you pressed the up arrow key
              if (!currentList.length) {
                tipsKeyword = getPointKeyword(
                  $dropdownMenu.find("tbody tr:last").mouseover()
                );
              } else if (!currentList.prev().length) {
                if (options.autoSelect) {
                  setOrGetDataId($input, "").val(setOrGetAlt($input));
                }
              } else {
                  // select the previous line
                tipsKeyword = getPointKeyword(currentList.prev().mouseover());
              }

                // control slider
              adjustScroll($input, $dropdownMenu, options);

              if (!options.autoSelect) {
                return;
              }
            } else if (event.keyCode === options.keyEnter) {
              tipsKeyword = getPointKeyword(currentList);
              hideDropMenu($input, options);
            } else {
              setOrGetDataId($input, "");
            }

            // Settings tipsKeyword
            // console.log(tipsKeyword);
            setValue($input, tipsKeyword, options);
          })
          .on("compositionstart.bs", function(event) {
            // Chinese input starts, lock
            // console.log('compositionstart');
            inputLock = TRUE;
          })
          .on("compositionend.bs", function(event) {
              // End of Chinese input, unlock
            // console.log('compositionend');
            inputLock = FALSE;
          })
          .on("keyup.bs input.bs paste.bs", function(event) {
            var word;

            if (event.keyCode) {
              setBackground($input, options);
            }

              // If the popped key is the Enter, Up or Down arrow keys, return
            if (
              ~$.inArray(event.keyCode, [
                options.keyDown,
                options.keyUp,
                options.keyEnter
              ])
            ) {
              $input.val($input.val()); // Let the mouse input jump to the end
              return;
            }

            clearTimeout(keyupTimer);
            keyupTimer = setTimeout(function() {
              // console.log('input keyup', event);

                // locked state, return
              if (inputLock) {
                return;
              }

              word = $input.val();

                // Return if the input box value has not changed
              if ($.trim(word) && word === setOrGetAlt($input)) {
                return;
              }

                // Record the value of the input box before pressing the key to check whether the value has changed when the key pops up
              setOrGetAlt($input, word);

              if (options.multiWord) {
                word = word.split(options.separator).reverse()[0];
              }

                // Whether to allow null data query
              if (!word.length && !options.allowNoKeyword) {
                return;
              }

              options.fnGetData($.trim(word), $input, refreshDropMenu, options);
            }, options.delay || 300);
          })
          .on("focus.bs", function() {
            // console.log('input focus');
            adjustDropMenuPos($input, $dropdownMenu, options);
          })
          .on("blur.bs", function() {
            if (!isMouseenterMenu) {
                // Instead of entering the drop-down list state, hide the list
              hideDropMenu($input, options);
              inputLock = true;
              setTimeout(function() {
                inputLock = FALSE;
              });
            }
          })
          .on("click.bs", function() {
            // console.log('input click');
            var word = $input.val();

            if (
              $.trim(word) &&
              word === setOrGetAlt($input) &&
              $dropdownMenu.find("table tr").length
            ) {
              return showDropMenu($input, options);
            }

            if ($dropdownMenu.is(":visible")) {
              return;
            }

            if (options.multiWord) {
              word = word.split(options.separator).reverse()[0];
            }

              // Whether to allow null data query
            if (!word.length && !options.allowNoKeyword) {
              return;
            }

            // console.log('word', word);
            options.fnGetData($.trim(word), $input, refreshDropMenu, options);
          });

          // When the drop-down button is clicked
        $parent
          .find(".btn:eq(0)")
          .attr("data-toggle", "")
          .click(function() {
            if (!$dropdownMenu.is(":visible")) {
              if (options.url) {
                $input.click().focus();
                if (!$dropdownMenu.find("tr").length) {
                  return FALSE;
                }
              } else {
                  // Display all data without keyword filtering
                refreshDropMenu($input, options.data, options);
              }
              showDropMenu($input, options);
            } else {
              hideDropMenu($input, options);
            }

            return FALSE;
          });

          // When sliding in the list, the input box loses focus
        $dropdownMenu
          .mouseenter(function() {
            // console.log('mouseenter')
            isMouseenterMenu = 1;
            $input.blur();
          })
          .mouseleave(function() {
            // console.log('mouseleave')
            isMouseenterMenu = 0;
            $input.focus();
          })
          .on("mouseenter", "tbody tr", function() {
              // Move event on the line
            unHoverAll($dropdownMenu, options);
            $(this).addClass(options.listHoverCSS);

            return FALSE; // stop bubbling
          })
          .on("mousedown", "tbody tr", function() {
            var keywords = getPointKeyword($(this));
            setValue($input, keywords, options);
            setOrGetAlt($input, keywords.key);
            setBackground($input, options);

            if (options.hideOnSelect) {
              hideDropMenu($input, options);
            }
          });

          // Clear button exists
        if ($iClear.length) {
          $iClear.click(function() {
            setOrGetDataId($input, "").val("");
            setBackground($input, options);
          });

          $parent
            .mouseenter(function() {
              if (!$input.prop(DISABLED)) {
                $iClear
                  .css(
                    "right",
                    options.showBtn
                      ? Math.max($input.next().width(), 33) + 2
                      : 12
                  )
                  .show();
              }
            })
            .mouseleave(function() {
              $iClear.hide();
            });
        }
      });
    },
    show: function() {
      return this.each(function() {
        $(this).click();
      });
    },
    hide: function() {
      return this.each(function() {
        hideDropMenu($(this));
      });
    },
    disable: function() {
      return this.each(function() {
        $(this)
          .attr(DISABLED, TRUE)
          .parent()
          .find(".btn:eq(0)")
          .prop(DISABLED, TRUE);
      });
    },
    enable: function() {
      return this.each(function() {
        $(this)
          .attr(DISABLED, FALSE)
          .parent()
          .find(".btn:eq(0)")
          .prop(DISABLED, FALSE);
      });
    },
    destroy: function() {
      return this.each(function() {
        var evNameList =
          "click.bs keydown.bs compositionstart.bs compositionend.bs keyup.bs input.bs paste.bs focus.bs click.bs";
        $(this)
          .off(evNameList)
          .removeData(BSSUGGEST)
          .removeAttr("style")
          .parent()
          .find(".btn:eq(0)")
          .off()
          .show()
          .attr("data-toggle", "dropdown")
          .prop(DISABLED, FALSE) // .addClass(DISABLED);
          .next()
          .css("display", "")
          .off();
      });
    },
    version: function() {
      return VERSION;
    }
  };

  $.fn[BSSUGGEST] = function(options) {
    // Method judgment
    if (typeof options === "string" && methods[options]) {
      var inited = TRUE;
      this.each(function() {
        if (!$(this).data(BSSUGGEST)) {
          return (inited = FALSE);
        }
      });
        // As long as there is one uninitialized, all methods are not executed, unless it is init or version
      if (!inited && "init" !== options && "version" !== options) {
        return this;
      }

        // If it is a method, the first parameter is the function name, and the second is the function parameter
      return methods[options].apply(this, [].slice.call(arguments, 1));
    } else {
        // Call the initialization method
      return methods.init.apply(this, arguments);
    }
  };
});
