
class Keyboard
  constructor: ->
    @keyarray = []
    for direction in ['left', 'up', 'right', 'down', 'space', "x"]
      @keyarray[direction] = false
      
    $("html").bind "keydown", (event) =>
      directions = {37:"left",38:"up",39:"right",40:"down",32:"space",88:"x"}
      @keyarray[directions[event.which]] = true
      
    $("html").bind "keyup", (event) =>
      directions = {37:"left",38:"up",39:"right",40:"down",32:"space",88:"x"}
      @keyarray[directions[event.which]] = false
      
  key: (which) ->
    return @keyarray[which]