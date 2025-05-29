import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Modality } from "@google/genai";
import * as fs from "node:fs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
console.log("API Key:", process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({ apiKey: `${process.env.GEMINI_API_KEY}` });
// const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });
//

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    console.log("User message:", userMessage);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: [userMessage],
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });
    for (const part of response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
        res.json({ reply: part.text });
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync("gemini-native-image.png", buffer);
        console.log("Image saved as gemini-native-image.png");
      }
    }

    // const assistantMessage = response.text;
    // res.json({ reply: assistantMessage });
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error al comunicarse con Gemini" });
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
