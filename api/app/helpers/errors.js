exports.notFound = (req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
};

exports.developmentErrors = (error, req, res, next) => {
  const status = error.status || 500;
  error.stack = error.stack || "";
  res.status(status);
  res.json({
    message: error.message,
    status: status,
    stackHighlighted: error.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      "<mark>$&</mark>"
    )
  });
};

exports.productionErrors = (error, req, res, next) => {
  const status = error.status || 500;
  res.status(status);
  res.json({
    status: status
  });
};
