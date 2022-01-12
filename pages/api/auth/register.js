import connectDB from '../../../utils/connectDB'
import Users from '../../../models/userModel'
import valid from '../../../utils/valid'
import bcrypt from 'bcrypt'
import {
  createAccessToken,
  createRefreshToken,
} from "../../../utils/generateToken";


connectDB()

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      await register(req, res)
      break;
  }
}

const register = async (req, res) => {
  try {
    const { name, email, password, cf_password } = req.body

    const errMsg = valid(name, email, password, cf_password)
    if (errMsg) return res.status(400).json({ err: errMsg })

    const user = await Users.findOne({ email })
    if (user) return res.status(400).json({ err: 'This email already exists.' })

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = new Users({
      name, email, password: passwordHash, cf_password
    })

    const access_token = createAccessToken({ id: newUser._id });
    const refresh_token = createRefreshToken({ id: newUser._id });

    await newUser.save()

    res.json({
      msg: "Register Success!",
      refresh_token,
      access_token,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        root: newUser.root,
      },
    });
  } catch (err) {
    return res.status(500).json({ err: err.message })
  }
}