

class Nutria

  constructor: (@eventmanager, @keyboard) ->
    @state = "normal"
    @isAlive = true
    @sprite = new Sprite
      "texture": "assets/images/test.png"
      "width": 50
      "height": 50
    
    @sprite.addImage "normal", Math.floor Math.random() * 10
    @sprite.addAnimation "normal", { frames: [0,1,2,3,4].shuffle(), fps: 3, loop: true, callback: @hello }
    @coor = new Vector( Math.random() * 640, Math.random() * 480 )
    @speed = new Vector( 0.1, 0.1 )
    if Math.random() > 0.5
      @speed = @speed.mult -1
    @direction = new Vector(0, 0)


  attack: (@toCoor) ->
   console.log "Nutria  reset() toCoor #{@toCoor}"
   @isAlive = true
   @state = "normal"
   rnd = Math.random()
   if rnd >= 0 and rnd <= 0.2
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

   console.log "Nutria  reset() coor #{@coor.x} #{@coor.y}"
  # @direction = toCoor.subtract(@coor).norm()


  
  update: (delta) ->
    if @isAlive         
      switch @state
        when "normal"
          @coor = @coor.add( @speed.mult delta )
          if @coor.x > 640
            @speed.x = @speed.x * -1
            @coor.x = 640
          if @coor.x < 0
            @speed.x = @speed.x * -1
            @coor.x = 0
          if @coor.y > 480
            @speed.y = @speed.y * -1
            @coor.y = 480
          if @coor.y < 0
            @speed.y = @speed.y * -1
            @coor.y = 0
         when "attack"
          @coor = @coor.add( @speed.mult delta )
        


  render: (ctx) ->
     ctx.save()
     ctx.translate @coor.x, @coor.y
     @sprite.render( @state, ctx )
     ctx.restore()
    
  hello: ->
    console.log "hello!"
    
        