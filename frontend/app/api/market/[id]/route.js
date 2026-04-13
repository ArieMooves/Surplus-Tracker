import { NextResponse } from 'next/server';
// import { pool } from '@/lib/db'; 

export async function GET(request, { params }) {
  const { id } = params;

  try {
    // Fetch asset details from PostgreSQL DB
    
    // Mock Data for logic demonstration
    const assetName = "Dell Monitor - Black"; 

    const searchQuery = assetName.replace(" - Black", ""); 

    // 3. Fetch from External Market 
    const marketResults = [
      { site: 'eBay', price: 45.00, condition: 'Used', link: '#' },
      { site: 'Amazon', price: 89.99, condition: 'Renewed', link: '#' }
    ];

    return NextResponse.json({ 
      assetName, 
      searchQuery, 
      listings: marketResults 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}
