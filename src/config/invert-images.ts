const invertedImages = ['AAPL', 'FIE.DE'];

export const shouldInvertImage = ({ src }: { src?: string }) => {
  return invertedImages.some((symbol) => src?.includes(symbol));
};
