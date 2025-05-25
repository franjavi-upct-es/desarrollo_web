const User = require("../models/User")
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
exports.registerUser = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    // Validar: Comprobar que no haya campos vacíos
    if (!fullName || !email || !password) {
		return res.status(400).json({ message: "Hacen falta todos los campos" });
    }

    try {
	// Comprobar si existe el email
	const existingUser = await User.findOne({ email });
	if (existingUser) {
	    return res.status(400).json({ message: "Dirección de correo ya en uso" });
	}

	// Crear el usuario
	const user = await User.create({
	    fullName,
	    email,
	    password,
	    profileImageUrl,
	});

	res.status(201).json({
	    id: user._id,
	    user,
	    token: generateToken(user._id),
	});
    } catch (err) {
	res
	    .status(500)
	    .json({ message: "Error registrando al usuario", error: err.message });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
	return res.status(400).json({ message: "Todos los campos son requeridos" });
    } 
    try {
	const user = await User.findOne({ email });
	if (!user || !(await user.comparePasswords(password))) {
	    return res.status(400).json({ message: "Credenciales inválidas" });
	}

	res.status(200).json({
	    id: user._id,
	    user,
	    token: generateToken(user._id),
	});
    } catch (err) {
	res
	    .status(500)
	    .json({ message: "Error registrando al usuario", error: err.message });
    }
};

// Get User Info
exports.getUserInfo = async (req, res) => {
    try {
	const user = await User.findById(req.user.id).select("-password");

	if (!user) {
	    return res.status(404).json({ message: "Usuario no encontrado" });
	}

	res.status(200).json(user);
    } catch (err) {
	res
	    .status(500)
	    .json({ message: "Error registrando al usuario", error: err.message });
    }
};
