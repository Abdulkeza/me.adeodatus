import { JWT } from "google-auth-library";

const API_ENDPOINT = "us-central1-aiplatform.googleapis.com";
const URL = `https://${API_ENDPOINT}/v1beta1/projects/${process.env.GOOGLE_KEY}/locations/us-central1/publishers/google/models/gemini-pro:streamGenerateContent`;

export const getIdToken = async () => {
    const client = new JWT({
        keyFile: "./aemcorner-8807863649e6.json",
        scopes: [
            "https://www.googleapis.com/auth/cloud-platform",
        ],
    });
    const idToken = await client.authorize();
    return idToken.access_token;
};

export const getTextGemini = async (prompt, temperature) => {
    const headers = {
        Authorization: `Bearer ` + (await getIdToken()),
        "Content-Type": "application/json",
    };

    const data = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
        ],
        generation_config: {
            maxOutputTokens: 2048,
            temperature: temperature || 0.5,
            topP: 0.8,
        },
    };

    const response = await fetch(URL, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        console.error(response.statusText);
        throw new Error("Gemini Error:" + response.statusText);
    }

    const result = await response.json();
    return result.map((r) => r?.candidates?.[0]?.content?.parts?.[0]?.text).join("");
};
