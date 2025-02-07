import bcrypt from "bcryptjs";
import User from "../authentication/user.js";
import passport from 'passport';

// Handle user registration
export const registerUser = async (req, res) => {
    try {
      console.log('Received Data:', req.body);
      const { username, email, password } = req.body;
  
      // Check if all fields are there
      if(!username || !email || !password){
        return res.status(400).json({ error:"all fields are required"});
      }

  
      // Check if the user already exists
      console.log('Checking if user exists...');
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
  
      // Hash the password
      console.log("Hasing user's password");
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user
      const newUser = await User.create({ username, email, password: hashedPassword });
  
      return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error('Registration Error:', error.stack);
      if (error.name === 'SequelizeValidationError') {
          return res.status(400).json({ error: 'Validation error', details: error.errors });
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

//login
export const login = async (req, res, next) => {
    try{
        const { username, password } = req.body;
        if(!username || !password){
          return res.status(400).json({ error:"both username and password are required"});
        }

        const user = await User.findOne({ where: { username } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json(factoryResponse(401, "Invalid credentials"));
        }
        req.login(user, (err) =>
            err ? next(err) : res.json(factoryResponse(200, "Login successful! Welcome!"))
        );
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

//handles logout
export const logout = (req, res) => {
  req.logout((err) => {
      if (err) {
          console.error('Logout error:', err);
          return res.status(500).json({ error: 'Logout failed' });
      }
      req.session.destroy((err) => {
          if (err) {
              console.error('Session destruction error:', err);
              return res.status(500).json({ error: 'Session destruction failed' });
          }
          res.clearCookie('connect.sid');
          res.status(200).json({ message: 'Logged out successfully' });
      });
  });
};


