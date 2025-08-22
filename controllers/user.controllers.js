import User from "../queries/user.queries.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Get All User Controller
const getUsersController = (req, res) => {
  User.getAllUsers((err, result) => {
    if (err) return res.status(400).json({ error: err });
    res.json({ msg: "Users Get Succesfully!", result });
  });
};

// Get Single User Controller
const getSingleUserController = (req, res) => {
  const { id } = req.params;
  try {
    User.getSingleUser(id, (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "Fetching User Error", error: err.message });
      }

      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      res.status(200).json({ msg: "User Fetch Succesfully!", result });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Create User Controller
const createUserController = (req, res) => {
  const newUser = req.body;
  console.log(newUser);

  User.checkUserAlreadyExsist(newUser.email, async (err, result) => {
    if (err) {
      return res
        .status(400)
        .json({ msg: "User not Created", error: err.message });
    }

    if (result.length > 0) {
      return res
        .status(400)
        .json({ msg: "User Already Exist with this email!" });
    }

    const hashPassword = await bcrypt.hash(newUser.password, 10);

    console.log("Hash password ---> ", hashPassword);

    const createUser = {
      name: newUser.name,
      email: newUser.email,
      password: hashPassword,
    };

    // ✅ Only create user if not found
    User.createUser(createUser, (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "User not Created", error: err.message });
      }
      res.status(201).json({
        msg: "User Created Successfully!",
        user: { ...createUser, id: result.insertId },
      });
    });
  });
};

// Update User Controller
const updateUserController = (req, res) => {
  const id = req.params.id;
  const user = req.body;
  try {
    User.checkUserAlreadyExsist(user.email, (err, result) => {
      console.log("Result Data is ---> ", result);
      if (err) {
        return res
          .status(400)
          .json({ msg: "User not Updated", error: err.message });
      }

      if (result.length <= 0 && result[0]?.id !== id) {
        return res.status(400).json({ msg: "User not Found" });
      }
      if (result.length > 0 && result[0]?.id !== id) {
        return res
          .status(400)
          .json({ msg: "User Already Exist with this email!" });
      }
      User.updateUser(id, user, (err, result) => {
        if (err) return res.status(400).json({ error: err });
        res
          .status(200)
          .json({ msg: "User Updated Successfully!", user, result });
      });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Delete User Controller
const deleteUserController = (req, res) => {
  const id = req.params.id;
  try {
    User.deleteUser(id, (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ msg: "User not Deleted!", error: err.message });
      }

      res.status(200).json({ msg: "User Deleted Successfully!" });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

// Login User Controller
const loginUserController = (req, res) => {
  const user = req.body;
  try {
    User.loginUser(user.email, async (err, result) => {
      if (err)
        return res.status(400).json({ msg: "Password and Email Incorrect!" });
      if (result.length == 0) {
        return res.status(400).json({ msg: "Password and Email Incorrect!" });
      }
      const match = await bcrypt.compare(user.password, result[0].password);
      if (!match) {
        return res.status(400).json({ msg: "Password and Email Incorrect!" });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.status(200).json({ msg: "User Login Successfully", result, token });
    });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error", error });
  }
};

export default {
  getUsersController,
  getSingleUserController,
  createUserController,
  updateUserController,
  deleteUserController,
  loginUserController,
};
