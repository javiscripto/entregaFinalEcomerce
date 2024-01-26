import multer from 'multer'

export const createMulterMiddleware = (routePart) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const destination = `files/${routePart}/`;
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            cb(null, file.fieldname + '-' + file.originalname);
        }
    });

    return multer({ storage: storage });
};