import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
//Register Routes

export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            role,
            village,
            district,
            state
        } = req.body;
        if (["gram_panchayat", "state_admin", "doctor_admin"].includes(role)) {
            const exists = await User.findOne({ role });
            if (exists) {
                return res.status(400).json({
                    error: '${role} already exists'
                });
            }



        }
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role,
            village,
            district,
            state
        });

        res.status(201).json({ message: "Registered Successfully" });

    } catch (err) {
        res.status(500).json({ error: "err.message" });

    }
}


// Login

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing login fields" });
    }

    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
