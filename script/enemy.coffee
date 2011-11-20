

class Enemy

  constructor: (@eventmanager, @keyboard) ->
    @state = "normal"
    @isAlive = false
    
    @sprite = new Sprite
      "texture": "assets/images/test.png"
      "width": 50
      "height": 50
    
    @sprite.addImage "normal", Math.floor Math.random() * 10
    @sprite.addAnimation "normal", { frames: [0], fps: 3, loop: true, callback: @hello }
    @sprite.addAnimation "attack", { frames: [0,1,2,3,4].shuffle(), fps: 3, loop: true, callback: @hello }                                                                                                      
   
    @coor = new Vector( Math.random() * 640, Math.random() * 480 )
   
    @direction = new Vector( 1, 1 )
    if Math.random() > 0.5
      @direction = @direction.mult -1
    
    @speed = 0.1


  attack: (@targetCoor) ->
   console.log "Enemy  attack() targetCoor #{@targetCoor}"
   @state = "attack"
   @revive()
   rnd = Math.random()
   if rnd <= 0.2
     @coor.x = 0-200
     @coor.y = Math.random()*480
   else if rnd >= 0.3 and rnd <= 0.5
     @coor.x = 640+200
     @coor.y = Math.random()*480
   else if rnd >= 0.6 and rnd <= 0.8
     @coor.x = Math.random()*640
     @coor.y = 0-200
   else if rnd >= 0.9 and rnd <= 1
     @coor.x = Math.random()*640
     @coor.y = 480+200

   console.log "Nutria  attack() random coor #{@coor.x} #{@coor.y}"
   @direction = targetCoor.subtract(@coor).norm()
   console.log "Nutria  attack() new direction #{@direction.x} #{@direction.y}"

  
  update: (delta) ->
    if @isAlive      
      newDist = delta*@speed
      @coor = @coor.add(@direction.mult(newDist))   
      switch @state
        when "normal"
          if @coor.x > 640
            @direction.x = @direction.x * -1
            @coor.x = 640
          if @coor.x < 0
            @direction.x = @direction.x * -1
            @coor.x = 0
          if @coor.y > 480
            @direction.y = @direction.y * -1
            @coor.y = 480
          if @coor.y < 0
            @direction.y = @direction.y * -1
            @coor.y = 0
        


  render: (ctx) ->
    if @isAlive 
     ctx.save()
     ctx.translate @coor.x, @coor.y
     @sprite.render( @state, ctx )
     ctx.restore()
    
  hello: ->
    console.log "hello!"
  
  revive: ->
    @isAlive = true
  
  kill: ->
    console.log "kill"
    @isAlive = false

        