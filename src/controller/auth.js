const User = require("../models/user");
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
  try{
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
      });
    }

    const {
      firstName,
      lastName,
      email,
      password
    } = req.body;

    const username = Math.random().toString();
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      username,
    });

    await newUser.save();
    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.authenticate(req.body.password)) {
      const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '10hr' });
      const { role, _id, firstName, lastName, email, fullName } = user;
      return res.status(200).json({
        token,
        user: {
          role,
          _id,
          firstName,
          lastName,
          email,
          fullName,
        }
      });
    } else {
      return res.status(400).json({ message: 'Invalid Password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: 'Something went wrong' });
  }
};


