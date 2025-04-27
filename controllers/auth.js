import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
/*REGISTER USERS*/
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation
    } = req.body;

    console.log("Registering user with the following data:", req.body);

    // Hash the password before saving to DB
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000)
    });

    // Save the user and log the saved user to confirm
    const saveUser = await newUser.save();
    console.log("User saved to DB:", saveUser);

    res.status(201).json(saveUser);
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: err.message });
  }
};


/*LOGGING IN*/
export const login= async(req,res)=>{
  try{
const{email,password}=req.body;
const user= await User.findOne({email:email});
if(!user)return res.status(400).json({msg:"user does not exist"});

const ismatch= await bcrypt.compare(password,user.password);
if(!ismatch)return res.status(400).json({msg:"invalid credentials"});

const token =jwt.sign({id:user._id},process.env.JWT_SECRET);
  delete user.password;
  res.status(200).json({token,user});
}catch(err){
    res.status(500).json({error:err.message});
  }
}
 