class Stats
  instance = null
  @getInstance: ->
    if not instance?
      instance = new @
    instance
  
  @score = 0
  @time = 0
  @maxLives = 5
  @lives = 0
  
  @toString: ->
    str = ' lives: '+Stats.lives
    str += ' | '
    str += ' score: '+Stats.score
    str += ' | '
    str += 'time: '+Math.floor(Stats.time/1000)
    return str
    
  constructor: ->
    console.log "Stats constructor()"
    @coor = new Vector(0,0)
  
  init: ->
    console.log "Stats: Singelton initialized. Static Attributes will be reseted!"
    Stats.score = 0
    Stats.time = 0
    Stats.lives = Stats.maxLives
    
  update: (delta) ->
    Stats.time += delta
   
