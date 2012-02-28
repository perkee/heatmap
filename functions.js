var first;
var range;
var flags;
var rows;
var cols;

function addRows(n)
{
  if(n < 1)
  {
    return;
  }
  var $newCells = '';
  for(var i = 0; i < n; i++)
  {
    $newCells += '<tr><td class="label">'+ (++rows) + '</td>';
    for(var j = 0; j < cols; j++)
    {
      $newCells += '<td contenteditable="true">0</td>';
    }
    $newCells += '</tr>';
    $($newCells).appendTo('#heatmap > table > tbody');
    $('#heatmap > table > tbody > tr:last > td[contenteditable="true"]').selectOnFocus();
  }
  //$('tr:last').after($newCells);
  //fixFocus($('tr:last td[contenteditable="true"]'));
  //$('table').css({'height': $('table').height() + $('tr:last').height()});
  $('#heatmap').css({'height': $('table').height() + $('#plusrow').height()});
}

function addCols(n)
{
  if(n < 1)
  {
    return;
  }
  for(var i = 0; i < n; i++)
  {
    $('th:last').after('<th>' + (++cols) + '</th>');
    $('tr').each(function(){
      $(this).children('td:last').after('<td contenteditable="true">0</td>');
      $(this).children('td:last').selectOnFocus();
    });
    $('table').css({'width': $('table').width() + 60});
    $('#heatmap').css({'width': $('table').width() + $('#pluscol').width()});
  }
}

(function($)//i have barely any idea what this line does
{
  $.fn.selectOnFocus = function (options)
  {
    fixFocus(this);
    return this;
    //return this.each(function()
    //{
    //  fixFocus($(this));
    //});
  };
})(jQuery); //nor this.

function echo(whatever)
{
  console.log(whatever);
}

function fixFocus(element)//element is a jQ object, not a JS handle
{
  element.focus(function()
  {
    SelectText($(this).get(0));
    var cellValue = parseFloat($(this).text());
    if(cellValue == range.min || cellValue == range.max)
    {
      flags.wasExtreme = true;
    }
  }).mouseup(function(event)
  {
    event.preventDefault();
  }).blur(function()
  {
    var cellValue = parseFloat($(this).text());
    if(cellValue > range.max)
    {
      range.max = cellValue;
      paintCells();
    }
    else if(cellValue < range.min)
    {
      range.min = cellValue;
      paintCells();
    }
    else //only repaint this cell, or maybe all of them.
    {
      if(flags.wasExtreme == true)
      {
        flags.wasExtreme = false;
        findRange();
        paintCells();
      }
      else
      {
        var hue = 240 - 240 * (cellValue - range.min)/(range.max - range.min);
        var bgstring = 'hsl(' + hue + ',100%,50%)';
        $(this).css({'background-color': bgstring});
      }
    }
  });
}

function findRange()
{
  first = parseFloat($('td[contenteditable="true"]:first').text());
  range = {'max':first, 'min':first};
  $('td[contenteditable="true"]').each(function()
  {
    var value = parseFloat($(this).text());
    if(value > range.max )
    {
      range.max = value;
    }
    if(value < range.min )
    {
      range.min = value;
    }
  });  
}

function paintCells()
{

  if(range.min == range.max)
  {
    $('td[contenteditable="true"]').css('background-color','white');
    console.log('all cells equal cannot heatmap');
    return;
  }

  $('tbody tr').each(function()
  {
    var row = ( 1 + $('tbody tr').index($(this)) );
    $(this).children('td[contenteditable="true"]').each(function()
    {
      //max should be 0
      //min should be 240
      var hue = 240 - 240 * (parseFloat($(this).text()) - range.min)/(range.max - range.min);
      var bgstring = 'hsl(' + hue + ',100%,50%)';
      $(this).css({'background-color': bgstring});
    });
  });
}

function SelectText(element)//element is a JS handle, not a jQ object
{
  var text = element;
  if ($.browser.msie)
  {
    var range = document.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  }
  else if ($.browser.mozilla || $.browser.opera)
  {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  else if ($.browser.safari)
  {
    var selection = window.getSelection();
    selection.setBaseAndExtent(text, 0, text, 1);
  }
}