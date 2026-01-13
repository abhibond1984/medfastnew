import { GoogleGenAI, Type } from "@google/genai";
import { DoctorSearchParams, PrescriptionAnalysisResult } from "../types";

// Helper to get API client
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Searches for doctors using Gemini 2.5 Flash with Google Maps Grounding.
 */
export const findDoctors = async (params: DoctorSearchParams): Promise<{ text: string; chunks: any[] }> => {
  const ai = getAiClient();
  const { problem, location, useCurrentLocation, latitude, longitude } = params;

  let locationQuery = location;
  if (useCurrentLocation && !location) {
    locationQuery = "my current location";
  }

  const prompt = `Find the best healthcare options for "${problem}" in ${locationQuery}. 
  I need a detailed list of at least 5 top-rated doctors, clinics, or hospitals.
  
  In your narrative response, for each provider:
  1. Briefly describe their specific expertise related to ${problem}.
  2. Mention why they are highly rated (e.g., patient reviews, advanced technology).
  3. Ensure you provide a structured grounding using the available maps tool.
  
  Keep the narrative professional, helpful, and concise.`;

  const config: any = {
    tools: [{ googleMaps: {} }],
  };

  // Add location bias if available
  if (useCurrentLocation && latitude && longitude) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude,
          longitude,
        },
      },
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config,
    });

    return {
      text: response.text || "No details found.",
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
    };
  } catch (error) {
    console.error("Error finding doctors:", error);
    throw error;
  }
};

/**
 * Analyzes a prescription image using Gemini 3 Flash Preview.
 */
export const analyzePrescription = async (imageBase64: string): Promise<PrescriptionAnalysisResult> => {
  const ai = getAiClient();

  const prompt = `Analyze this medical prescription image. 
  Identify all prescribed medicines.
  For each medicine found, explain:
  1. The name of the medicine (or generic name).
  2. The purpose/usage (what condition it treats).
  3. The contents (active ingredients).
  4. Any visible dosage instructions (e.g., "1 tablet daily").
  5. Any standard warnings associated with this type of medicine.
  
  Also provide a brief overall summary of the prescription.
  If the handwriting is illegible, do your best to infer from context or mark as unclear.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: imageBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            medicines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING },
                  contents: { type: Type.STRING },
                  dosageInstructions: { type: Type.STRING },
                  warnings: { type: Type.STRING },
                },
                required: ["name", "purpose", "contents"],
              },
            },
            summary: { type: Type.STRING },
          },
          required: ["medicines", "summary"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as PrescriptionAnalysisResult;

  } catch (error) {
    console.error("Error analyzing prescription:", error);
    throw error;
  }
};