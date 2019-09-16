const express=require('express');
const app=express();
const keys=require('./config/keys');
const passport=require('passport');
const GoogleStrategy=require('passport-google-oauth20').Strategy;


//MongoDB
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/newDatabase',{useNewUrlParser:true},{ useUnifiedTopology: true });
const schema=mongoose.Schema;
const userSchema=new schema({
    googleID: String,
    name: String
});
const Users=mongoose.model('Users',userSchema);

passport.use(
    new GoogleStrategy({
            clientID:keys.google_ClientID,
            clientSecret:keys.google_ClientSecret,
            callbackURL:'/auth/google/callback'
        },
        function(accessToken,refreshToken,profile,done) {
            //console.log('accessToken:'+accessToken);
            //console.log('refreshToken:'+refreshToken);
            //console.log(profile);
            Users.findOne({googleID: profile.id}).then((currentUser) => {
                if (currentUser) {
                    console.log(currentUser);
                } else {
                    new Users({
                        googleID: profile.id,
                        name: profile.displayName
                    }).save().then((newUser) => {
                        console.log('new user' + newUser)
                    })
                }
            })
        }));
            //ROUTES
    app.get('/auth/google',passport.authenticate('google',{
        scope:['profile']
    })),

    app.get('/auth/google/callback',passport.authenticate('google',(req,res)=>{
        res.send("you've reached the callback URL");
    })),

    app.listen(5000,()=>{
console.log('server running on a port')
})