import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const rawAssetName = "Dell Monitor - Black"; 

    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a surplus asset specialist. Convert this inventory name into a clean manufacturer model name for price matching: "${rawAssetName}". Return ONLY the model name.`;

    const result = await model.generateContent(prompt);
    const cleanName = result.response.text().trim();

    return NextResponse.json({ 
      original: rawAssetName,
      searchQuery: cleanName,
      suggestedPrice: "45.00", // Placeholder calculation
      condition: "Good",
      listings: [
          { site: 'eBay', price: 42.50, condition: 'Used', link: 'https://www.ebay.com/sch/i.html?_nkw=' + encodeURIComponent(cleanName) },
          { site: 'Amazon', price: 55.00, condition: 'Renewed', link: '#' },
          { site: 'Internal', price: 35.00, condition: 'Surplus', link: '#' }
      ]
    });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market data", details: error.message },
      { status: 500 }
    );
  }
}
