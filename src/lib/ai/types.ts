export interface AIResponse<T = any> {
  success: boolean;
  operation: string;
  outputUrl?: string | null;
  textLayers?: Array<{
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    fontWeight: number;
    fill: string;
  }>;
  maskUrl?: string | null;
  mimeType?: string;
  metadata?: Record<string, any>;
  error?: {
    code: string;
    message: string;
  } | null;
}

export interface AIOperationRequest {
  imageSrc: string; // Base64 data URL or HTTP URL
  maskSrc?: string; // Optional mask for cleanup/inpaint
  options?: {
    targetWidth?: number;
    targetHeight?: number;
    extendLeft?: number;
    extendRight?: number;
    extendUp?: number;
    extendDown?: number;
    blurRadius?: number;
    language?: string;
    pointCoords?: [number, number];
  };
}
