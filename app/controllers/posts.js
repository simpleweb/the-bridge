exports.index = async (req, res, next) => {
  try {
    res.render("posts/index", {
      data: [{sender: 'test_sender', timestamp: 'test_timestamp', body: 'text_body'}]
    });
  } catch (error) {
    return next(error);
  }
};
