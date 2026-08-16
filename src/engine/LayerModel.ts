export type LayerType = 'image' | 'text' | 'shape' | 'draw' | 'group';

export type SemanticRole = 
  | 'background' 
  | 'subject' 
  | 'headline' 
  | 'subtitle' 
  | 'price' 
  | 'cta' 
  | 'logo' 
  | 'shape' 
  | 'generic';

export type ShapeType = 
  | 'rect' 
  | 'rounded-rect' 
  | 'circle' 
  | 'ellipse' 
  | 'triangle' 
  | 'star' 
  | 'polygon' 
  | 'line' 
  | 'arrow';

export interface ImageAdjustments {
  brightness: number; // -100 to 100, default 0
  contrast: number;   // -100 to 100, default 0
  saturation: number; // -100 to 100, default 0
  exposure: number;   // -100 to 100, default 0
  hue: number;        // -180 to 180, default 0
  temperature: number;// -100 to 100, default 0 (cool to warm)
  tint: number;       // -100 to 100, default 0
  blur: number;       // 0 to 50 px, default 0
  sharpen: number;    // 0 to 100, default 0
  grayscale: number;  // 0 to 100%, default 0
  sepia: number;      // 0 to 100%, default 0
  invert: number;     // 0 to 100%, default 0
}

export interface LayerEffects {
  shadow: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  glow: {
    enabled: boolean;
    color: string;
    blur: number;
  };
  innerShadow: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  border: {
    enabled: boolean;
    color: string;
    width: number;
    style: 'solid' | 'dashed';
  };
  duotone: {
    enabled: boolean;
    primaryColor: string;
    secondaryColor: string;
  };
}

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;     // degrees
  opacity: number;      // 0 to 1
  visible: boolean;
  locked: boolean;
  blendMode?: GlobalCompositeOperation;
  semanticRole?: SemanticRole;
  reconstructed?: {
    isReconstructed: boolean;
    confidence: number;
    originalBounds?: { x: number; y: number; width: number; height: number };
  };
}

export type MaskShape = 'none' | 'circle' | 'ellipse' | 'rounded';

export interface ImageLayer extends BaseLayer {
  type: 'image';
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  crop?: { x: number; y: number; width: number; height: number };
  flipHorizontal: boolean;
  flipVertical: boolean;
  cornerRadius: number;
  maskShape?: MaskShape;
  adjustments: ImageAdjustments;
  effects: LayerEffects;
}

export interface TextLayer extends BaseLayer {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline' | 'line-through';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  fill: string;
  letterSpacing: number; // px
  lineHeight: number;    // multiplier, e.g. 1.2
  stroke?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  padding?: number;
  effects: LayerEffects;
}

export interface ShapeLayer extends BaseLayer {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
  points?: number; // for star or polygon (default 5 or 6)
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle: number;
  };
  effects: LayerEffects;
}

export interface DrawPathPoint {
  x: number;
  y: number;
  pressure?: number;
}

export interface DrawPath {
  points: DrawPathPoint[];
  color: string;
  width: number;
  tool: 'brush' | 'pencil' | 'eraser' | 'highlighter';
  opacity: number;
}

export interface DrawLayer extends BaseLayer {
  type: 'draw';
  paths: DrawPath[];
  effects: LayerEffects;
}

export interface GroupLayer extends BaseLayer {
  type: 'group';
  childLayerIds: string[];
  isExpanded: boolean;
}

export type EditorLayer = ImageLayer | TextLayer | ShapeLayer | DrawLayer | GroupLayer;

export type VersionState = 'original' | 'edited' | 'unlocked' | 'reframed' | 'final';

export interface CanvasDocument {
  id: string;
  title: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  layers: EditorLayer[];
  selectedLayerIds: string[];
  lastSavedAt?: string;
  versionState?: VersionState;
}

export const DEFAULT_IMAGE_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  hue: 0,
  temperature: 0,
  tint: 0,
  blur: 0,
  sharpen: 0,
  grayscale: 0,
  sepia: 0,
  invert: 0,
};

export const DEFAULT_LAYER_EFFECTS: LayerEffects = {
  shadow: {
    enabled: false,
    color: 'rgba(0, 0, 0, 0.4)',
    blur: 10,
    offsetX: 4,
    offsetY: 4,
  },
  glow: {
    enabled: false,
    color: 'rgba(59, 130, 246, 0.6)',
    blur: 15,
  },
  innerShadow: {
    enabled: false,
    color: 'rgba(0, 0, 0, 0.5)',
    blur: 6,
    offsetX: 0,
    offsetY: 2,
  },
  border: {
    enabled: false,
    color: '#3B82F6',
    width: 2,
    style: 'solid',
  },
  duotone: {
    enabled: false,
    primaryColor: '#3B82F6',
    secondaryColor: '#EC4899',
  },
};
