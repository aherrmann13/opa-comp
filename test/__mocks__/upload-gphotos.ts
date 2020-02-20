export const mockSignIn = jest.fn();
export const mockUpload = jest.fn();
export const reset: () => void = () => {
  mockSignIn.mockReset();
  mockUpload.mockReset();
};
jest.mock('upload-gphotos', () => ({
  __esModule: true,
  GPhotos: jest.fn().mockImplementation(() => {
    return {
      signin: mockSignIn,
      upload: mockUpload
    };
  })
}));
