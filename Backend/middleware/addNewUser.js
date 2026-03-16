const bcrypt = require('bcrypt');
const supabase = require('../db');

const addNewUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email and password are required'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if user already exists
    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      throw searchError;
    }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username,
        email,
        password: hashedPassword,
        role: role || 'user'
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = addNewUser;