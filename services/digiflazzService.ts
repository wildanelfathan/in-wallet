// Dummy Digiflazz Service Implementation
// This is a mock implementation since no API keys are available

export interface DigiflazzProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'inactive';
  description?: string;
}

export interface DigiflazzTopupRequest {
  username: string;
  buyer_sku_code: string;
  customer_no: string;
  ref_id: string;
  sign: string;
  testing?: boolean;
}

export interface DigiflazzTopupResponse {
  ref_id: string;
  customer_no: string;
  buyer_sku_code: string;
  status: 'success' | 'pending' | 'failed';
  message: string;
  sn?: string;
  rc?: string;
}

export interface DigiflazzCheckStatusRequest {
  ref_id: string;
  sign: string;
}

export interface DigiflazzCheckStatusResponse {
  ref_id: string;
  customer_no: string;
  buyer_sku_code: string;
  status: 'success' | 'pending' | 'failed';
  message: string;
  sn?: string;
  rc?: string;
}

class DigiflazzService {
  private baseUrl = 'https://api.digiflazz.com/v1';
  private username = 'dummy_username';
  private apiKey = 'dummy_api_key';

  // Generate signature for API calls
  private generateSign(data: string): string {
    // In real implementation, this would be: md5(username + apiKey + ref_id)
    return 'dummy_signature_' + Date.now();
  }

  // Get product list
  async getProducts(): Promise<DigiflazzProduct[]> {
    // Mock response
    return [
      {
        id: 'xld10',
        name: 'XL 10K',
        category: 'Pulsa',
        price: 10000,
        status: 'active',
        description: 'XL 10K Pulsa'
      },
      {
        id: 'tsel10',
        name: 'Telkomsel 10K',
        category: 'Pulsa',
        price: 10000,
        status: 'active',
        description: 'Telkomsel 10K Pulsa'
      },
      {
        id: 'indosat10',
        name: 'Indosat 10K',
        category: 'Pulsa',
        price: 10000,
        status: 'active',
        description: 'Indosat 10K Pulsa'
      }
    ];
  }

  // Top up phone credit
  async topup(request: DigiflazzTopupRequest): Promise<DigiflazzTopupResponse> {
    // Mock successful response
    return {
      ref_id: request.ref_id,
      customer_no: request.customer_no,
      buyer_sku_code: request.buyer_sku_code,
      status: 'success',
      message: 'Top up successful',
      sn: 'SN' + Date.now(),
      rc: '00'
    };
  }

  // Check transaction status
  async checkStatus(request: DigiflazzCheckStatusRequest): Promise<DigiflazzCheckStatusResponse> {
    // Mock response
    return {
      ref_id: request.ref_id,
      customer_no: '081234567890',
      buyer_sku_code: 'xld10',
      status: 'success',
      message: 'Transaction completed',
      sn: 'SN' + Date.now(),
      rc: '00'
    };
  }

  // Get price list
  async getPriceList(): Promise<DigiflazzProduct[]> {
    return this.getProducts();
  }

  // Check deposit balance
  async checkBalance(): Promise<{ balance: number }> {
    return { balance: 1000000 }; // Mock balance
  }
}

export const digiflazzService = new DigiflazzService();
export default digiflazzService; 