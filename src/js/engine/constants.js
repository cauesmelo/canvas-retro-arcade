export const defaultFontSize = 12;

const fontWithSize = (size) => `${size ?? defaultFontSize}px 'Press Start 2P'`;

export const constants = {
  primaryColor: '#12ce5d',
  backgroundColor: '#000000',
  windowHeight: 320,
  windowWidth: 480,
  font: fontWithSize(defaultFontSize),
  fontWithSize,
  textAlign: 'center',
};
