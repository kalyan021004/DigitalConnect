import Scheme from "../models/Scheme.js";
export const getAllSchemes=async (req,res)=>{
    const schemes =await Scheme.find({isActive:true});
    res.json(schemes);
}

export const createScheme=async(req,res)=>{
    const scheme=await Scheme.create(req.body);
    res.status(201).json(scheme);

}

// controllers/schemeController.js
export const getSchemeById = async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) return res.status(404).json({ error: "Scheme not found" });
  res.json(scheme);
};

