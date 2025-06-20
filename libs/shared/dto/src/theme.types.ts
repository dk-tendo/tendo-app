export interface ThemeSchema {
  id: string;
  name: string;
  description: string;
  backgroundColor?: string;
  textColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  borderColor?: string;
  primaryFontFamily?: FontSchema;
  fontSize?: string;
  fontWeight?: string;
  languageCode: string;
}

export interface FontSchema {
  value: string;
  url: string;
  type: string;
  fontType: string;
}
