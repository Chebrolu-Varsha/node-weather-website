const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3007

//Define path for Express config
const publicDirectory = path.join(__dirname,'../public')
const viewDirectory = path.join(__dirname,'../templates/views')
const partialspath = path.join(__dirname,'../templates/partials')


//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewDirectory)
hbs.registerPartials(partialspath)

//Setup static directory to serve
app.use(express.static(publicDirectory))

app.get('',(req,res)=> {
    res.render('index', {
        title: 'Weather',
        name: 'Varsha'
    })
})

app.get('/about',(req,res)=> {
    res.render('about',{
        title: 'About me',
        name: 'Varsha'
    })
})

app.get('/help',(req,res)=> {
    res.render('help',{
        helpText: 'This is some helpful text',
        title: 'Help',
        name: 'Varsha'
    })
})

app.get('/weather',(req,res)=>{

    if(!req.query.address)
    {
        return res.send({
            error: 'You must provide address'
        })
    }
    
    geocode(req.query.address,(error,{latitude,longitude,location}={}) =>
    {
        if(error)
        {
            return res.send({error})
        }
        forecast(latitude,longitude,(error,{temperature,feelsLike,description}={}) =>
        {
            if(error)
            {
                return res.send({error})
            }

            res.send({
                address: req.query.address,
                location,
                forecast: 'It is '+temperature+' degree out there. But it feels like '+feelsLike+' degree out. '+description
            })

        })
    })

    
})

app.get('/products', (req,res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*',(req,res)=>{
    res.render('404',{
        title: '404',
        name: 'Varsha',
        errormsg: 'Help article not found'
    })
})

app.get('*',(req,res)=>{
   res.render('404',{
    title: '404',
    name: 'Varsha',
    errormsg: 'Page not found'
   })
})

app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})

