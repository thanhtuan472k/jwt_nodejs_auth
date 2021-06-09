require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/auth');

app.use(express.json());

// database
let users = [
    {
        id: 1,
        username: 'thanhtuan',
        refreshToken: null
    },
    {
        id: 2,
        username: 'nhidepgai',
        refreshToken: null
    }
]


const generateTokens = payload => {
    const {id, username} = payload;
    // Create JWT
    const accessToken = jwt.sign({id, username}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5m'
    });
    
    const refreshToken = jwt.sign({id, username}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1h'
    });

    return {accessToken, refreshToken};
}

const updateRefreshToken = (username, refreshToken) => {
    users = users.map(user => {
        if (user.username === username) {
            return {
                ...user,
            refreshToken
            }
        }
        return user;
    });
}

app.post('/login', (req, res, next) => {
    const username = req.body.username;
    const user = users.find(user => user.username === username)

    if (!user) return res.sendStatus(401);
    
    const tokens = generateTokens(user);
    updateRefreshToken(username, tokens.refreshToken);

    console.log(users);

    res.json(tokens);
});

app.post('/token', (req, res, next) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) res.status(401);

    const user = user.find(user => user.refreshToken === refreshToken);
    if (!user) res.sendStatus(403);

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        const tokens = generateTokens(user);
        updateRefreshToken(user.username, tokens.refreshToken);

        res.json(tokens);
    } catch (error) {
        console.log(error);
        res.sendStatus(403);
    }
});

app.delete('/logout', verifyToken, (req, res, next) => {
    const user = user.find(user => user.id === req.userId);
    updateRefreshToken(user.username, null);
    console.log(users);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));