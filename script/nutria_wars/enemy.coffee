

class Enemy

  constructor: (@eventmanager, @keyboard) ->
    @state = "normal"
    @isAlive = false
    
    @sprite = new Sprite
      "texture": "assets/images/enemy.png"
      "width": 50
      "height": 50
    
    @sprite.addImage "normal", Math.floor Math.random() * 10
    @sprite.addAnimation "normal", { frames: [0], fps: 3, loop: false, callback: @done }
    @sprite.addAnimation "attack", { frames: [0,1,2,3,4], fps: 3, loop: true, callback: @done }                                                                                                      
   
    @coor = new Vector( Math.random() * 640, Math.random() * 480 )
   
    @direction = new Vector( 1, 1 )
    if Math.random() > 0.5
      @direction = @direction.mult -1
    
    @minSpeed = 0.1
    @speed = @minSpeed+Math.random()*0.2
  
  attack: (@targetCoor) ->
   @state = "attack"
   @speed = @minSpeed+Math.random()*0.2
   rnd = Math.random()*1.1
   if rnd <= 0.2
     @coor.x = 0-@sprite.width
     @coor.y = Math.random()*480
   else if rnd >= 0.3 and rnd <= 0.5
     @coor.x = 640+@sprite.width
     @coor.y = Math.random()*480
   else if rnd >= 0.6 and rnd <= 0.8
     @coor.x = Math.random()*640
     @coor.y = 0-@sprite.height
   else if rnd >= 0.9 and rnd <= 1.1
     @coor.x = Math.random()*640
     @coor.y = 480+@sprite.height

   @direction = targetCoor.subtract(@coor).norm()
   @revive()
  
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
    
  done: ->
    #console.log "hello!"
  
  revive: ->
    @isAlive = true
  
  kill: ->
    console.log "Enemy: kill()"
    @isAlive = false

        