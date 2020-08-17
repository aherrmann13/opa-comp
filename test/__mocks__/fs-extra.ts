export const mockStat = jest.fn();
export const mockCreateReadStream = jest.fn();
export const mockReaddirSync = jest.fn();
export const reset: () => void = () => {
  mockStat.mockReset();
  mockCreateReadStream.mockReset();
  mockReaddirSync.mockReset();
};
jest.mock('fs-extra', () => {
  return {
    stat: mockStat,
    createReadStream: mockCreateReadStream,
    readdirSync: mockReaddirSync
  };
});

jest.mock('fs', () => {
  return {
    readdirSync: mockReaddirSync
  };
});
