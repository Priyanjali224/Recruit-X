import Vapi from '@vapi-ai/web';

export interface VapiVoiceConfig {
  publicKey?: string;
  assistantId?: string;
}

let vapiInstance: Vapi | null = null;

export function getVapiInstance(publicKey?: string): Vapi | null {
  if (typeof window === 'undefined') return null;
  
  const key = publicKey || process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  if (!key || key === 'your_vapi_public_key_here') {
    return null;
  }

  if (!vapiInstance) {
    try {
      vapiInstance = new Vapi(key);
    } catch (e) {
      console.warn('Failed to initialize Vapi Web SDK:', e);
      return null;
    }
  }

  return vapiInstance;
}

export const isVapiConfigured = (): boolean => {
  const key = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
  return !!key && key !== 'your_vapi_public_key_here' && key.length > 5;
};
