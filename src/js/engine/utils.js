export const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const randomBoolean = () => Math.random() > 0.5;

export const equals3 = (a, b, c) => a !== null && a === b && b === c;
