

class Camera

  constructor: (hash) ->
    @projection = hash["projection"]
    @vpWidth = hash["vpWidth"]
    @vpHeight = hash["vpHeight"]
    #@coor = new Vector( 100, 100 )
    @coor = new Vector( 0, 0 )
        
  update: (delta) ->

  apply: (ctx, callback) ->
    
    switch @projection
      when "normal"
        ctx.save()
       # ctx.translate -@vpWidth/2 - @coor.x, -@vpHeight/2 - @coor.y
        ctx.translate @coor.x, @coor.y
        callback()
        ctx.restore()
      when "iso"       
        ctx.save()
        ctx.scale 1, 0.5
        ctx.rotate Math.PI/4
        ctx.translate 200, -400
        callback()
        ctx.restore()
    
    
        