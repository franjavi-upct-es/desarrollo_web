const multer = require('multer');

// Configurar el almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
	cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
	cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
	cb(null, true);
    } else {
	cb(new Error('Solo se admiten imágenes .png, .jpeg, .jpg'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
