class Statemanager
  constructor: (@parent, states) ->
    @statearray = {}
    @currentState = null
    for state in states  
      @addState state
    
  addState: (state) ->
    @statearray[state] = new stateclass[state] @parent
    @setState state unless @currentState? # when a state is added for the first time, it automatically becomes the @currentState

  setState: (state) ->
    console.log "EventManager setState #{state} !!!!! "
    if @currentState
      @currentState.destroy()
    @currentState = @statearray[state]
    @currentState.create()
