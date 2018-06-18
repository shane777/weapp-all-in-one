Page({
    data:{
        localImageUrls:[
            "/assets/feed-1.jpeg",
            "/assets/feed-2.jpg",
            "/assets/feed-3.jpeg",
        ], // not work.
        imageUrls:[
            "https://images.unsplash.com/photo-1490731678285-2e5640f5a918?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=97a37c4f31a47d1559661df0a69405cb&auto=format&fit=crop&w=2134&q=80",
            "https://images.unsplash.com/photo-1522688306378-fbb315c6ba9a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=575e00f1cc165c73a36e9e7c94ab34d8&auto=format&fit=crop&w=700&q=80",
            "https://images.unsplash.com/photo-1495001258031-d1b407bc1776?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5a79f9a8fe4dcb557ba2090caf817c29&auto=format&fit=crop&w=634&q=80"
        ]
    },
    preViewImage(e){
        const { imageUrls, localImageUrls } = this.data;
        wx.previewImage({
            current: imageUrls[0], // 当前显示图片的http链接
            urls: imageUrls, // 需要预览的图片http链接列表
            success: function(res){
                console.log("success");
                console.log(res);
            },
            fail: function(res){
                console.log("fail");
                console.log(res);
            },
            complete: function(res){
                console.log("complete");
                console.log(res);
            }
        })
    }
})