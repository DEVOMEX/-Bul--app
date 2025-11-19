import { GoogleGenAI } from "@google/genai";
import { Job, LocationData } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Uses Gemini Maps Grounding to find real businesses nearby that match a job query.
 * This simulates finding "potential" job openings at real locations.
 */
export const findNearbyOpportunities = async (
  query: string,
  location: LocationData
): Promise<Job[]> => {
  if (!apiKey) {
    console.warn("API Key missing, returning empty list.");
    return [];
  }

  try {
    const prompt = `Find 5 places nearby that match the category "${query}" (e.g. restaurants, offices, shops) that might be hiring. Return a list of places.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        },
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) return [];

    const groundingChunks = candidates[0].groundingMetadata?.groundingChunks;
    if (!groundingChunks) return [];

    const foundJobs: Job[] = [];

    // Parse grounding chunks to create "Job" objects
    groundingChunks.forEach((chunk, index) => {
      // Handle both Maps (chunk.maps) and Search (chunk.web) grounding results
      // Cast to any to handle potential type definition mismatches
      const c = chunk as any;
      const data = c.maps || c.web;

      if (data?.uri && data?.title) {
          // Create a potential job listing from the map result
          foundJobs.push({
            id: `ai-job-${index}-${Date.now()}`,
            title: `${query} (Potansiyel)`,
            companyName: data.title,
            description: `Bu işletme (${data.title}) konumunuza yakın ve "${query}" aramanızla eşleşiyor. Açık pozisyonlar için iletişime geçebilirsiniz.`,
            salary: "Belirtilmedi",
            location: {
                latitude: location.latitude, // Fallback to user loc if map loc is generic, but ideally we'd parse the snippet
                longitude: location.longitude,
                address: "Haritada Görüntüle"
            },
            employerId: "ai-system",
            employerName: "İşBul Asistanı",
            postedAt: new Date(),
            isAiGenerated: true,
            mapsUri: data.uri
          });
      }
    });

    return foundJobs;

  } catch (error) {
    console.error("Error fetching nearby opportunities:", error);
    return [];
  }
};

/**
 * Helps employers generate a professional job description.
 */
export const generateJobDescription = async (title: string, company: string): Promise<string> => {
    if (!apiKey) return "Harika bir çalışma ortamı sunuyoruz. Detaylar için iletişime geçin.";

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a short, professional, and inviting job description (in Turkish) for a "${title}" position at "${company}". Max 50 words.`,
        });
        return response.text || "Detaylar için iletişime geçin.";
    } catch (error) {
        console.error("Error generating description:", error);
        return "Detaylar için iletişime geçin.";
    }
}