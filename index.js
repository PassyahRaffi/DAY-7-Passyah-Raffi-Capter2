const express = require('express')

const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')

const app = express()
const PORT = 7000
const db = require('./connection/db') // import connection data base
const upload = require('./middlewares/fileUpload')

app.set('view engine', 'hbs') // set up hbs
app.use('/public', express.static(__dirname + '/public')) // set public folder/path
app.use('/uploads', express.static(__dirname + '/uploads'))

app.use(express.urlencoded({extended: false}))

app.use(
    session({
        cookie: {
            maxAge: 2 * 60 * 60 * 1000, // penyimpanan data selama 2 jam, setelah 2 jam akan hilang
            secure: false,
            httpOnly: true,
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)
app.use(flash())


// FUNCTION FULL TIME
function getFullTime(time) {
    let month = ["Januari", "Febuari", "Maret", "April", "Mei", "Juni", "Juli", "September", "Oktober", "November", "Desember"];
    
    let date = time.getDate()
    let i = time.getMonth()
    let year = time.getFullYear()
    let hours = time.getHours()
    let minutes = time.getMinutes()
    let fullTime = `${date} ${month[i]} ${year} ${hours}:${minutes} WIB`    

    return fullTime;
}
// FUNCTION DISTANCE
function getDistanceTime(time) {
    let timePost = time;
    let timeNow = new Date();
    let distance = timeNow - timePost;

    // CONVERT TO DAY
    let milisecond = 1000; // dalam 1 detik = 1000 detik
    let secondInHours = 3600; // dalam 1 jam (berapa detik 60*60) = 3600 detik
    let hourseInDay = 23 // dalam 1 hari (berapa jam) = 23 jam (hitungan default)
    let second = 60; // dalam 1 detik
    let minutes = 60; // dalam 1 menit = 60 detik

    let distanceDay = distance / (milisecond * secondInHours * hourseInDay);
    let distanceHours = Math.floor(distance / (milisecond * second * minutes));
    let distanceMinutes = Math.floor(distance / (milisecond * second));
    let distanceSecond = Math.floor(distance / (milisecond - second));
    distanceDay = Math.floor(distanceDay);

    // CONDITION HARI
    if (distanceDay >= 1) {
        return `${distanceDay} day ago`;
    } else {

        // CONDITION JAM
        if (distanceHours >= 1) {
            return `${distanceHours} hours ago`;
        } else {

            // CONDITION MENIT
            if (distanceMinutes >= 1) {
                return `${distanceMinutes} minutes ago`;

                // CONDITION DETIK
            } else {
                return `${distanceSecond} second ago`;
            }
        }
    } 
}


// REGISTER
app.get('/register', function(request, response) {
    response.render('register')
})
app.post('/register', function(request, response) {

    // console.log(request.body);

    const {inputName, inputEmail, inputPassword} = request.body

    const hashedPassword = bcrypt.hashSync(inputPassword, 10)

    let query = `INSERT INTO tb_user(name, email, password)
    VALUES ('${inputName}', '${inputEmail}', '${hashedPassword}')`;

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function (err, result) {
            if (err) throw err

            response.redirect('/login')
        })
    })
})


// LOGIN
app.get('/login', function(request, response) {
    response.render('login')
})
app.post('/login', function(request, response) {

    const {inputEmail, inputPassword} = request.body
    // console.log(request.session);

    let query = `SELECT * FROM tb_user WHERE email = '${inputEmail}'`;

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function (err, result) {
            if (err) throw err
            // console.log(result.rows.length);

            if (result.rows.length == 0) {
                request.flash('danger', 'EMAIL BELUM TERDAFTAR!');
                console.log(inputEmail, 'EMAIL BELUM TERDAFTAR!');
                return response.redirect('/login');
            }

            const isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password)
            // console.log(isMatch);

            if (isMatch) {
                request.session.isLogin = true
                request.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email,
                }
                request.flash('success', 'LOGIN SUCCESS!')
                console.log(inputEmail, 'LOGIN SUCCESS!');
                response.redirect('/blog')

            } else {
                request.flash('danger', 'PASSWORD TIDAK COCOK!')
                console.log(inputEmail, 'PASSWORD TIDAK COCOK!');
                response.redirect('/login')
            }
        })
    })
})


// LOGOUT
app.get('/logout', function(request, response) {
    request.session.destroy()

    response.redirect('/login')
})


// HOME BLOG
app.get('/', function (request, response) {

    db.connect(function(err, client, done) {
        if (err) throw err

        let query = `SELECT * FROM tb_data`
        client.query(query, function (err, result) {
            if (err) throw err

            let td = result.rows
            response.render("index", {data: td})
        })
    })
})


// BLOG
app.get('/blog', function (request, response) {

    console.log(request.session);

    const query = `SELECT
    tb_blog.id,
    tb_blog.title, 
    tb_blog.content,
    tb_blog.image,
    tb_blog.post_at,
    tb_user.name AS author,
    tb_blog.author_id

    FROM tb_blog LEFT JOIN tb_user ON tb_blog.author_id = tb_user.id;`

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function(err, result) {
            if (err) throw err

            let dataView = result.rows

            let newData = dataView.map( function(data) {
                return {
                    ...data,
                    isLogin: request.session.isLogin,
                    postAt: getFullTime(data.post_at),
                    distance: getDistanceTime(data.post_at)
                }
            })
            response.render("blog", {isLogin : request.session.isLogin, user: request.session.user, blogs: newData})
        })
    })
})
// POST BLOG
app.post('/blog', upload.single('inputImage'), function(request, response) {

    let data = request.body;

    let image = request.file.filename
    // console.log(image);

    let authorId = request.session.user.id
    // console.log(authorId);

    let query = `INSERT INTO tb_blog (title, content, image, author_id) 
    VALUES ('${data.inputTitle}',
            '${data.inputContent}',
            '${image}', 
            '${authorId}')`;

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function (err, result) {
            if (err) throw err

            response.redirect('/blog')
        })
    })
})


// DELETE BLOG
app.get('/delete-blog/:id', function(request, response) {

    if(!request.session.isLogin){
        request.flash('danger', 'KAMU BELUM LOGIN!')
        console.log("KAMU BELUM LOGIN!");
        return response.redirect('/login')
    }

    let id = request.params.id;
    // console.log(id);

    let query = `DELETE FROM tb_blog WHERE id = ${id}`;

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function (err, result) {
            if (err) throw err
            
            response.redirect('/blog')
        })
    })
})


// EDIT POST
app.get('/edit-blog/:id', function (request,response) {

    let id = request.params.id
    let query = `SELECT * FROM tb_blog WHERE id = ${id}`

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function (err, result) {
            if (err) throw err
            
            let dataView = result.rows[0];
            // console.log(dataView);

            response.render('edit-blog', {blog: dataView, id: id});
        })
    })
})
// POST EDIT BLOG
app.post('/edit-blog/:id', upload.single('inputImage'), function(request, response) {

    let image = request.file.filename;
    let id = request.params.id;
    let data = request.body;
    let query = `UPDATE tb_blog SET 
    title = '${data.updateTitle}', 
    content = '${data.updateContent}',
    image = '${image}'
    WHERE id = ${id}`

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function(err, result) {
            if (err) throw err

            response.redirect('/blog')
        })
    })
})


// BLOG DETAIL
app.get('/blog-detail/:id', function (request, response) {

    let id = request.params.id
    const query = `SELECT
    tb_blog.id,
    tb_blog.title, 
    tb_blog.content,
    tb_blog.image,
    tb_blog.post_at,
    tb_user.name AS author,
    tb_blog.author_id

    FROM tb_blog LEFT JOIN tb_user ON tb_blog.author_id = tb_user.id WHERE tb_blog.id = ${id};`
    
    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function (err, result) {
            if (err) throw err

            let data = result.rows[0];

            let newData = {
                ...data,
                fullTime: getFullTime(data.post_at),
            }
            response.render('blog-detail', {id: id, blog: newData});
        })
    })
})


// ADD BLOG
app.get('/add-blog', function (request, response) {
    // console.log((request.session.isLogin));

    if(!request.session.isLogin) {
        request.flash('danger', 'PLEASE LOGIN!')    
        console.log('PLEASE LOGIN!');
        return response.redirect('/login')
    }

    response.render("add-blog", {user: request.session.user, isLogin: request.session.isLogin})    
})


// CONTACT FORM
app.get('/contactForm', function (request, response) {
    response.render("contactForm")    
})


// SERVER STARTING DAY 7 = PORT 7000
app.listen(PORT, function () {
    console.log(`Server starting on PORT ${PORT}`);    
})