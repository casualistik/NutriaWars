

class Hero
  constructor: (@eventmanager, @keyboard) ->
    
    @state = "normal"
    @sprite = new Sprite
      "texture": "assets/images/hero.png"
      "width": 50
      "height": 50
      "key":
        "normal": 3
        "jumping": 5

    @coor = new Vector( 0, 0 )
    @speed = new Vector( 0, 0 )
    @omega = 0.001
    @gravity = 0.01
    @angle = 0
    
    
    # event Manager
   # @eventmanager.register "touchdown", @touchdown
  
  shoot: ->
    console.log   "shoot"
  

  touchdown: ->
    console.log "Hero says: Touchdown occurred"
  
  update: (delta) ->
    
    # left/right movement
    if @keyboard.key("right")
      @angle += @omega
      console.log "#{this} Right Angle:#{@angle}"
    else if @keyboard.key("left")
      @angle -= @omega 
      console.log "#{this} LEFT Angle:#{@angle}"
   
    # jump
    #if @keyboard.key("space") and @state isnt "jumping"
     # @state = "jumping"
      #@speed.y = -0.5
      
    @coor = @coor.add( @speed.mult delta )

  render: (ctx) ->
    ctx.save()
    ctx.translate @coor.x, @coor.y
    ctx.rotate @angle * (180/Math.PI)
    @sprite.render( @state, ctx )
    ctx.restore()



