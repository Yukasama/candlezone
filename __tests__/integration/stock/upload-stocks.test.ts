import { uploadStocks } from '@/actions/stock/upload-stocks';

describe('upload-stocks', () => {
  it('should call upload-stocks', async () => {
    await uploadStocks({});
    expect(uploadStocks).toHaveBeenCalledTimes(1);
  });
});
