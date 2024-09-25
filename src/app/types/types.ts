// types.ts

export interface PricingPlan {
    name: string;
    users:string;
    price: string;
    credits: number;
    monthly_discount: string;
    billed: string;
    description: string;
    features: string[];
    excluded_features: string[];
    popularity: string;
    Details:string;
  }
  
  export interface PricingData {
    title: string;
    plans: PricingPlan[];
    note: string;
  }
  