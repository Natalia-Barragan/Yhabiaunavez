
// using native fetch if available, otherwise requires node-fetch
// import fetch from 'node-fetch'; 

async function diagnose() {
    try {
        console.log("Testing GET http://localhost:3000/products...");
        const response = await fetch('http://localhost:3000/products');

        console.log(`Status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            console.log("Response Text:", await response.text());
            return;
        }

        const data = await response.json();
        console.log("Data count:", data.length);

        // Write to file to avoid truncation
        const fs = await import('fs');
        fs.writeFileSync('temp-api-dump.json', JSON.stringify(data, null, 2));
        console.log("Dumped data to temp-api-dump.json");

        if (data.length > 0) {
            if ('sizes' in data[0]) {
                console.log("Sizes field exists.");
            } else {
                console.log("PROBABLE CAUSE: 'sizes' field is MISSING in API response!");
            }
        } else {
            console.log("No products found in DB.");
        }

    } catch (error) {
        console.error("Check failed:", error.message);
    }
}

diagnose();
