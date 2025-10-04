import type { Country } from './definitions';

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

export async function getExchangeRate(baseCurrency: string): Promise<{ rates: Record<string, number> } | null> {
    if(!process.env.EXCHANGE_RATE_API_KEY) {
        console.warn("EXCHANGE_RATE_API_KEY not set. Using mock data.");
        // Mock data for development if API key is not present
        return {
            rates: {
                USD: 1.0,
                EUR: 0.92,
                GBP: 0.79,
                JPY: 157.0,
            }
        };
    }

  try {
    // Note: The provided API URL in the prompt is for a specific service.
    // Real implementation might need an API key. We will use a fallback.
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    const data = await response.json();
    return { rates: data.conversion_rates };
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
}
