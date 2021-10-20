exports.createPostValidator = (req, res, next) => {
  // Title
  req.check("title", "Write a title!").notEmpty();
  req
    .check("title", "Title must be between 4 to 120 characters.")
    .isLength({ min: 4, max: 120 });
  // Tag
  req.check("tag", "Write a tag!").notEmpty();
  req
    .check("tag", "Tag must be between 2 to 20 characters.")
    .isLength({ min: 2, max: 20 });
  // Body
  req.check("description", "Write a description!").notEmpty();
  req
    .check("description", "Description must be between 3 to 200 characters.")
    .isLength({ min: 2, max: 20 });
  // Check for multiple errors
  const errors = req.validationErrors();
  // If errors appear show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0]; // Extract the first one and give it to the users
    return res.status(400).json({ error: firstError });
  }
  // Proceed to the next middleware
  next();
};

exports.userSignupValidator = (req, res, next) => {
  // Name
  req.check("name", "Artist Name is required!").notEmpty();
  req
    .check("name", "Artist Name must be between 4 to 14 characters.")
    .isLength({ min: 4, max: 14 });
  // Email
  req.check("email", "Email is required!").notEmpty();
  req
    .check("email", "Email must be between 3 to 32 characters.")
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @.")
    .isLength({ min: 3, max: 32 });
  // Password
  req.check("password", "Password is required!").notEmpty();
  req
    .check("password")
    .isLength({ min: 6 })
    .withMessage("Password must contain at least 6 or more characters.")
    .matches(/\d/)
    .withMessage("Password must contain at least one number.");
  // Check for multiple errors
  const errors = req.validationErrors();
  // If errors appear show the first one as they happen
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0]; // Extract the first one and give it to the users
    return res.status(400).json({ error: firstError });
  }
  // Proceed to the next middleware
  next();
};
