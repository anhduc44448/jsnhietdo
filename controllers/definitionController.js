import { Definition } from "../models/definitions.js";

export const getDefinitions = async (req, res) => {
  try {
    const definitions = await Definition.find();
    res.json(definitions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getActiveDefinition = async (req, res) => {
  try {
    const activeDefinition = await Definition.findOne({ active: true });
    res.json(activeDefinition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
