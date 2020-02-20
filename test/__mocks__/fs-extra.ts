export const mockStat = jest.fn();
export const mockCreateReadStream = jest.fn();
export const reset: () => void = () => {
  mockStat.mockReset();
  mockCreateReadStream.mockReset();
};
jest.mock('fs-extra', () => {
  return {
    stat: mockStat,
    createReadStream: mockCreateReadStream
  };
});
