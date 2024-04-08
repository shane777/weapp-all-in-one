import { gestureByTouches } from '../../utils/gesture'

Page({
    data:{

    },
    touchMoveStart: '',

    onTouchMove(e){
        if(this.touchMoveStart) return;
        this.touchMoveStart = e;
      },
    
      onTouchEnd(e){
        if(!this.touchMoveStart) return;
        const direction = gestureByTouches(this.touchMoveStart.changedTouches, e.changedTouches);
        this.touchMoveStart = '';
      },
})