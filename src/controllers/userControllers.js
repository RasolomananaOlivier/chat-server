const getAllUsers = (req, res) => {
  res.send("Get all Users");
};

const getOneUser = (req, res) => {
  return;
};

const createOneUser = (req, res) => {
  res.send("Creating user");
};

const updateOneUser = (req, res) => {
  return;
};

const deleteOneUser = (req, res) => {
  return;
};

const UserControllers = {
  getAllUsers,
  getOneUser,
  createOneUser,
  updateOneUser,
  deleteOneUser,
};

module.exports = UserControllers;
