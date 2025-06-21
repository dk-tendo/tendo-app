export interface Theme {
  id: string;
  name: string;
  description: string;
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  borderColor?: string;
  primaryFontFamily?: Font;
  fontSize?: string;
  fontWeight?: string;
  languageCode: string;
}

export interface Font {
  value: string;
  url: string;
  type: string;
  fontType: string;
}
