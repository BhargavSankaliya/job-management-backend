const createResponse = require("../middlewares/response");

function validateSchema(model) {
    return (req, res, next) => {
        const doc = new model(req.body); // Create a new document instance

        const validationError = doc.validateSync(); // Validate without saving

        if (validationError) {
            const errorMessages = Object.values(validationError.errors).map(e => e.message);
            const response = createResponse(null, 400, errorMessages.join(', '), res);

            // Send validation error response before proceeding to the API logic
            return res.status(400).json(response);
        }

        // If validation passes, move on to the actual API handler
        next();
    };
}


module.exports = { validateSchema };