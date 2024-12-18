const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); 
const dotenv = require('dotenv');
const helmet = require('helmet');


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); 
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["*"], 
    
      },
    })
  );


const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;


mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('Error connecting to MongoDB:', err));


const userSchema = new mongoose.Schema({
    username: { type: String, required: true,  trim: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true,  lowercase: true },
    password: { type: String, required: true },
    time: { type: String }
});

const User = mongoose.model('User', userSchema);




app.post('/signup', async (req, res) => {
    try {
        const { username, mobile, email, password, time } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const newUser = new User({ username, mobile, email, password: hashedPassword, time });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        const token = jwt.sign(
            { id: user._id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );


        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                name: user.username,
                mobile: user.mobile,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const orderSchema = new mongoose.Schema({
    orderNumber : {type:Number , unique:true},
    name: { type: String, trim: true, required: true },
    mobile: { type: String, required: true },
    email: { type: String, lowercase: true, required: true },
    add: { type: String, required: true },
    pincode: { type: Number, required: true },
    state: { type: String, required: true },
    paytype: { type: String, required: true },
    items: { type: Object, required: true },
    cost: { type: Number, required: true }
});

const Order = mongoose.model('Order', orderSchema);


app.post('/submit-order', async (req, res) => {
    try {
        console.log('Incoming request body:', req.body);

        const { orderNumber ,name, mobile, email, add, pincode, state, paytype, items, cost } = req.body;

        
        if (!orderNumber || !name || !mobile || !email || !add || !pincode || !state || !paytype || !items || !cost) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        
        const newOrder = new Order({
            orderNumber,
            name,
            mobile,
            email,
            add,
            pincode,
            state,
            paytype,
            items,
            cost
        });

        await newOrder.save();

        res.status(201).json({ message: 'Order Submitted Successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Duplicate entry detected' });
        }

        console.error('Error in /submit-order:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});




app.post('/verify', async (req, res) => {
    try {
        const { token } = req.body;

        const decode = jwt.verify(token, JWT_SECRET);

        res.status(200).json(
            decode
        );

    }catch (error) {
        res.status(500).json({ error: error.message });
    }

  })







app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Helmet is protecting your app!');
  });
