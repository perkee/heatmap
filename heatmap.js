$(document).ready(function(){
  $('<p>I\'m a test paragraph.</p>').css('color','red').appendTo('#options');
  first = parseFloat($('td[contenteditable="true"]:first').text());
  range = {'max':first, 'min':first};
  flags = {'wasExtreme':false};
  rows = 2;
  cols = 2;
  
  $('table').after('<a id="plusrow">+</a><a id="pluscol">+</a>');
  $('#heatmap').css({
                      'width'  : $('#heatmap').width()  + $('#pluscol').width() ,
                      'height' : $('#heatmap').height() + $('#plusrow').height()
                    });
  findRange();
  paintCells();
//cell blur and focus
  //fixFocus($('td[contenteditable="true"]'));
  $('td[contenteditable="true"]').selectOnFocus();
//handle raw text***************************************************
  $('form').submit(function(event)
  {
    var lines = $('textarea:first').val().split('\n');
    $.each(lines, function(i,v)
    {
      lines[i] = v.split(' ');
    });
    addRows(lines.length - $('#heatmap > table > tbody > tr').length);
    echo(lines[0].length +' '+ $('#heatmap > table > tbody > tr:first > td').length);
    addCols(lines[0].length - $('#heatmap > table > tbody > tr:first > td').length + 1);
    $('#heatmap > table > tbody > tr').each(function(row)
    {
      $(this).children('td[contenteditable="true"]').each(function(column)
      {
        echo(row + ' ' + column);
      });
    });
    event.preventDefault();
    return false;
  });
//add a row*********************************************************
  $('#plusrow').click(function()
  {
    addRows(1);
  });
//add a column*********************************************************
  $('#pluscol').click(function(){
    addCols(1);
  });
//show & hide numbers****************************************************
  $('#toggleNumbers').click(function()
  {
    $('td[contenteditable="true"]').css('color',function(index,value)
    {
      if($(this).css('color') === 'rgb(0, 0, 0)' || $(this).css('color') === 'black')
        return $(this).css('background-color');
      else
        return 'rgb(0, 0, 0)';
    });
  });
});