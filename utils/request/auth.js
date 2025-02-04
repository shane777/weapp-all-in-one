export function userAuth(){
    return new Promise((resolve)=> {
        wx.bus.on("login", (res)=> {
            resolve(res)
        })
    })
}