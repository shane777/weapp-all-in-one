const PATH_MAPPING = {
    'HOME': '/pages/index/index',
    'LOGS': '/subPackageA/pages/logs/logs'
}


module.exports = Behavior({
    data: {
        PATHS: {
            'HOME': 'HOME',
            'LOGS': 'LOGS'
        }
    },
    methods: {
        onNavigateTo: function(e){
            const { dataset = {} } = e.currentTarget;
            const { destination = '' } = dataset
            console.log(destination)

            if(!destination || !PATH_MAPPING[destination]) return
            wx.navigateTo({ 
                url: PATH_MAPPING[destination],
                fail(err){
                    console.error(err)
                }
            })
        }
    }
})