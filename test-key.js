const https = require('https');

// Get key from arguments or environment or hardcode it (but be careful committing!)
const apiKey = process.argv[2] || process.env.OPENAI_API_KEY;

if (!apiKey) {
    console.error("❌ Error: No API key provided.");
    console.log("Usage: node test-key.js sk-proj-...");
    process.exit(1);
}

console.log(`🔑 Testing key: ${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`);

const options = {
    hostname: 'api.openai.com',
    path: '/v1/models',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);

            if (res.statusCode === 200) {
                console.log("✅ SUCCESS! Key is valid.");

                // Check for GPT-4o Realtime permissions specifically if possible
                const realtimeModel = response.data.find(m => m.id.includes('realtime'));
                console.log("models have acess are :", response.data)
                if (realtimeModel) {
                    console.log("✅ Realtime models found in your access list:", realtimeModel.id);
                } else {
                    console.log("⚠️ Note: 'gpt-realtime' models NOT explicitly listed. (This is common for some betas, but worth noting)");
                }

            } else {
                console.error(`❌ FAILED (Status: ${res.statusCode})`);
                console.error("Error Message:", response.error?.message || response);
            }
        } catch (e) {
            console.error("❌ Error parsing response:", e.message);
            console.log("Raw response:", data);
        }
    });
});

req.on('error', (error) => {
    console.error("❌ Network Error:", error.message);
});

req.end();
