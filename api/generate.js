export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { productName } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API Key missing in Vercel settings' });
    }

    if (!productName) {
        return res.status(400).json({ error: 'Product name required' });
    }

    const promptText = `Aap YouTube ke sabse top tech aur product reviewer hain. 
Product: "${productName}" ka ek bilkul detailed, technical aur YouTube Script style me full review Hindi me likhein. 

Jisme ye sabhi sections detail me cover hon:
1. 🌟 Overall Score & Verdict Summary
2. 📦 Unboxing & Build Quality
3. 🔬 Full Technical Specifications
4. ⚡ Performance & Real-World Test
5. 📸 Camera / Display / Sound Quality
6. ✅ Kyun Kharidna Chahiye (Detailed Pros)
7. ❌ Kyun Nahi Kharidna Chahiye (Detailed Cons)
8. 🎯 Kiske Liye Sahi Hai (Who Should Buy?)

Style energetic, professional aur clear Hinglish/Hindi rakhein.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json(data);
        } else {
            return res.status(response.status).json({ error: data.error?.message || 'Gemini API Error' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}
