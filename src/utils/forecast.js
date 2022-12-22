const request = require('request')

const forecast = (latitude,longitude,callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=b735dc8ef2ff3bf415ef4f48c72c2a1b&query='+latitude + ',' + longitude +'&units=f'
    request({url,json:true}, (error,{body})=> {
        if(error)
        {
            callback('Unable to connect to weather service',undefined)
        }
        else if(body.error)
        {
            callback('Unable to find loacation',undefined)
        }
        else
        {
            callback(undefined,{
                temperature: body.current.temperature,
                feelsLike: body.current.feelslike,
                description: body.current.weather_descriptions[0]
            })
        }
    })

}

module.exports = forecast