const express = require("express");
const path = require("path");
const app = express();
const LogInCollection = require("./mongo");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const templatePath = path.join(__dirname, '../tempelates');
const publicPath = path.join(__dirname, '../public');
console.log(publicPath);

app.set('view engine', 'hbs');
app.set('views', templatePath);
app.use(express.static(publicPath));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            if (checking.password === req.body.password) {
                return res.send("User details already exist");
            }
            return res.send("User details exist but password is incorrect");
        } else {
            await LogInCollection.insertMany([data]);
            return res.status(201).render("home", { naming: req.body.name });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Error processing request");
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (check && check.password === req.body.password) {
            return res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` });
        } else {
            return res.send("Incorrect password or username");
        }
    } catch (e) {
        console.error("Error:", e);
        return res.status(500).send("Error processing request");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
