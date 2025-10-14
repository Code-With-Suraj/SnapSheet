
import { GoogleGenAI, Type } from "@google/genai";
import type { TableData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PROMPT = `You are an expert data entry specialist. Your task is to accurately extract tabular data from an image.
- Analyze the provided image to identify the main table.
- Extract all data from the table, including the complete header row.
- Represent the extracted data as a JSON array of arrays. Each inner array must represent a single row from the table.
- Each element within a row's array must be a string representing the content of a single cell.
- Pay close attention to details: preserve the original order of rows and columns.
- If a cell spans multiple rows or columns (merged cells), repeat its value for each corresponding cell in the output grid to ensure a consistent rectangular structure.
- If a cell appears empty, represent it as an empty string "".
- Return ONLY the JSON data. Do not include any introductory text, markdown formatting (like \`\`\`json), or explanations.
- If you cannot find any table in the image, return an empty JSON array: [].`;

export const processImageToTable = async (
    base64Image: string,
    mimeType: string
): Promise<TableData> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: mimeType,
            },
        };
        const textPart = {
            text: PROMPT,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING
                        }
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        const parsedData: TableData = JSON.parse(jsonString);
        return parsedData;

    } catch (error) {
        console.error("Error processing image with Gemini API:", error);
        throw new Error("Failed to extract table data from the image.");
    }
};
