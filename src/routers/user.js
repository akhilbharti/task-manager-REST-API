const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const { ObjectID } = require("mongodb");
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeMail, sendCancelMail } = require("../emails/account");

//creating a user router
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeMail(user.email, user.name);

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//login router
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    // res.send({ user: user.getPublicProfile(), token });
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

//logging out router of single session
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

//log out of all session
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const IsValidOper = updates.every(update => {
    return allowedUpdates.includes(update);
  });
  if (!IsValidOper) {
    return res.status(400).send("error: Invalid Property update!!");
  }
  try {
    updates.forEach(update => {
      req.user[update] = req.body[update];
    });
    await req.user.save();

    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.delete("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  try {
    // const user = await User.findByIdAndDelete(req.user._id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    await req.user.remove();
    sendCancelMail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = new multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("should be an image for format .jpg,.jpeg,.png"));
    }
    cb(undefined, true);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .png()
      .resize({ width: 250, height: 250 })
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
    console.log("workdd");
  } catch (e) {
    res.send(e);
    console.log("bdfff");
  }
});

// router.delete("/users/me/avatar", auth, async (req, res) => {
//   req.user.avatar = null;
//   await req.user.save();
//   res.send(req.user);
// });

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
  // if (user) {
  //   res.send(
  //     '<img src="data:image/jpg;base64,' + user.avatar.toString("base64") + '">'
  //   );
  // } else {
  //   res.status(404).send({ error: "user not found" });
  // }
});

module.exports = router;
