require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/auth');

app.use(express.json());

// const users = [
//     {
//         id: 1,
//         username: 'thanhtuan'
//     },
//     {
//         id: 2,
//         username: 'nhidepgai'
//     }
// ]

const posts = [
    {
        userId: 1,
        post: 'post tuan'
    },
    {
        userId: 2,
        post: 'post nhidepgai'
    },
    {
        userId: 2,
        post: 'post test'
    }
]

// app
app.get('/posts', verifyToken, (req, res, next) => {
    res.json(
        posts.filter(post => post.userId === req.userId)
    ); 
});

// app.post('/login', (req, res, next) => {
//     const username = req.body.username;
//     const user = users.find(user => user.username === username)
//     //console.log(user);

//     if (!user) return res.sendStatus(401);
    
//     // Create JWT
//     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
//         expiresIn: '15s'
//     });
//     res.json({accessToken});
// });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));