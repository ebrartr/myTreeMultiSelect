
/* MyTreeMultiSelect v1.0.0 | (c) Ebrar Haşlak | MIT Licensed */

var MyTreeMultiSelect = {
    Init: function InitTreeMultiSelect(selector, onChangeFunctionInPage = null, jsonData = null, kirilimlaraCheckBoxBirak = true, multiple = true, tooltipMessageArray = null) {

        var result = {};

        var treeSelectObj = $(selector);
        var treeSelectObjId = treeSelectObj.attr('id');

        result.treeSelectObj = treeSelectObj;
        result.treeSelectObjId = treeSelectObjId;

        ekranAyar(treeSelectObj);

        var options = {
            allowBatchSelection: kirilimlaraCheckBoxBirak,
            sortable: true,
            searchable: true,
            enableSelectAll: true,
            selectAllText: 'Tümünü Seç',
            unselectAllText: 'Temzile',
            hideSidePanel: true,
            sectionDelimiter: '->',
            startCollapsed: true,
            onChange: function (allSelectedItems, addedItems, removedItems) {

                if (!multiple) {

                    if (addedItems.length > 0) {

                        for (var i = 0; i < allSelectedItems.length; i++) {

                            var kontrolEdilen = $(allSelectedItems[i].node);
                            var suanSecilen = $(addedItems[0].node);

                            if (kontrolEdilen.attr('data-value') != suanSecilen.attr('data-value'))
                                $(kontrolEdilen).children('input').trigger('click');

                        }
                    }

                }

                $('#' + treeSelectObjId + '_Header').html(resetHeader(selector,treeSelectObj));

                if (onChangeFunctionInPage)
                    window[onChangeFunctionInPage](allSelectedItems, addedItems, removedItems);

            }
        };

        if (jsonData && typeof (jsonData) === 'object') {

            treeSelectObj.parent().find('div').remove();

            $(selector + ' option').remove();

            treeSelectObj.val(null);

            for (var i = 0; i < jsonData.length; i++) {

                if (jsonData[i].Hiyerarsi) {

                    treeSelectObj.append('<option  data-section="' + jsonData[i].Hiyerarsi + '" value="' + jsonData[i].Value + '">' + jsonData[i].Text + '</option>');

                } else {

                    treeSelectObj.append('<option  data-section="' + jsonData[i].hiyerarsi + '" value="' + jsonData[i].value + '">' + jsonData[i].text + '</option>');
                }
            }

        }

        result.treeObj = treeSelectObj.treeMultiselect(options)[0];

        var treeHeaderDiv = $('<div class="col-12 treeSelectHeader form-control" id="' + treeSelectObjId + '_Header" hide></div>');

        treeSelectObj.parent().prepend(treeHeaderDiv);

        resetHeader(selector, treeSelectObj);

        $('div.tree-multiselect .auxiliary input.search').prop('placeholder', 'Ara...');

        $('div.tree-multiselect .auxiliary input.search').keyup(function () {

            if ($(this).val()) {

                $(this).siblings().hide();

            } else {

                $(this).siblings().show();
            }

        });

        $('div.tree-multiselect .auxiliary .select-all-container span.select-all').html('<i class="fadeIn animated bx bx-check" title="Tümünü Seç"></i>');
        $('div.tree-multiselect .auxiliary .select-all-container span.unselect-all').html('<i class="fadeIn animated bx bx-trash-alt" title="Seçimleri Kaldır"></i>');

        var _treeObjDiv = treeSelectObj.parent().find('.tree-multiselect').hide();

        treeHeaderDiv.click(function () {

            if (treeHeaderDiv.hasClass('showTree')) {

                _treeObjDiv.hide();
                treeHeaderDiv.removeClass('showTree');
            } else {

                var digerTreeSelect = $('.treeSelectHeader.showTree').trigger('click');

                _treeObjDiv.show();
                treeHeaderDiv.addClass('showTree');

                treeHeaderDiv.siblings('.tree-multiselect').find('.search').focus();
                treeHeaderDiv.siblings('.tree-multiselect').find('.search').val('');
                treeHeaderDiv.siblings('.tree-multiselect').find('.search').trigger('input');
                treeHeaderDiv.siblings('.tree-multiselect').find('.search').siblings().show();
            }
        });

        $(document).on('click', function (e) {

            if (!$(event.target).closest('.treeSelectHeader').length && !$(event.target).parents().hasClass('tree-multiselect')) {

                $('.treeSelectHeader.showTree').trigger('click');

            }

        });

        treeSelectObj.parent().addClass('treeSelectParent');

        result.SerbestBirak = function () {
            result.treeObj.remove();//remove metodu plugin in kendi metodudur bkz. https://github.com/patosai/tree-multiselect.js/
        }

        result.OptionlariKaldir = function () {
            $('#' + result.treeSelectObjId + ' option').remove();
        }

        result.GetValue = function () {

            return result.treeSelectObj.val();
        }

        result.SetOptionToolTips = function (tooltipMessageArray) {

            if (typeof (tooltipMessageArray) == 'object') {

                for (var i = 0; i < tooltipMessageArray.length; i++) {

                    $(result.treeSelectObj.siblings('.tree-multiselect').find('label')[tooltipMessageArray[i].ItemIndex]).append('<i class="fadeIn animated bx bx-info-circle custom-bx" data-bs-toggle="tooltip" data-bs-placement="top" title="' + tooltipMessageArray[i].Message + '" data-bs-html="true"></i>');

                }
            }

        }

        if (tooltipMessageArray) {

            result.SetOptionToolTips(tooltipMessageArray);
        }

        $('[data-bs-toggle="tooltip"]').tooltip();

        return result;
    }
}

function resetHeader(selector, treeSelectObject) {

    var headerObj = $(selector+ '_Header');

    headerObj.html('');

    var faSecilen = null;
    var adet = 0;

    if (treeSelectObject.val() && treeSelectObject.val().length >0) {

        adet = treeSelectObject.val().length;

        var secilenlerText = $(selector + ' option:selected').map(function () {
            return '<span class=&quot;badge bg-primary secilenItem&quot;>' + $(this).text()+'</span>';
        }).get().join('');

        faSecilen = $('<a data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-html="true" title="' + secilenlerText + '"><i class="myPulse fadeIn animated float-end bxSecilen"></i></a>');

        faSecilen.tooltip();
    }

    headerObj.append('<span style="color:blue">' + adet + '</span> seçili');

    if (faSecilen)
        headerObj.append(faSecilen);

}

function ekranAyar(treeSelectObj) {
    if (treeSelectObj.parent().is('div') && !treeSelectObj.parent().parent().is('div')) {

        var newParentDiv = $('<div class="col-12"></div>');

        treeSelectObj.parent().append(newParentDiv);

        newParentDiv.append(treeSelectObj);
    }
}

(function ($) {

    $.fn.MySelectTree = function (options) {

        var ayar = $.extend({}, {

            selector: $(this).attr("id"),
            onChangeFunctionInPage: null,
            jsonData: null,
            kirilimlaraCheckBoxBirak: true,
            multiple: true,
            tooltipMessageArray : []

        }, options);

        if (!(ayar.selector && typeof (ayar.selector) === 'string')) {

            alert('Ayar hatası!');

            return null;
        }

        return MyTreeMultiSelect.Init('#' + ayar.selector, ayar.onChangeFunctionInPage, ayar.jsonData, ayar.kirilimlaraCheckBoxBirak, ayar.multiple, ayar.tooltipMessageArray);

    };

}(jQuery));