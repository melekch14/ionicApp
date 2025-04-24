const authService = require('../services/authService');

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const result = await authService.registerUser(fullName, email, password);
    res.json({ message: result });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};
