import * as HTTPUtil from '@src/utils/request';

import musics from '@test/fixtures/musics.json';
import normalizedMusics from '@test/fixtures/musics_normalized.json';
import SpotifyClient from '../spotify';

jest.mock('@src/utils/request');

describe('Spotify client', () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<
    typeof HTTPUtil.Request
  >;
  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('should return the normalized musics from the Spotify api', async () => {
    mockedRequest.get.mockResolvedValue({ data: musics } as HTTPUtil.Response);

    const spotifyClient = new SpotifyClient(mockedRequest);
    const response = await spotifyClient.fetchMusics();
    expect(response).toEqual(normalizedMusics);
  });

  it('should return a generic error when trying to communicate with spotify client', async () => {
    const spotifyClient = new SpotifyClient(mockedRequest);

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    await expect(spotifyClient.fetchMusics()).rejects.toThrow(
      'Unexpected error when trying to communicate to SpotifyClient: Network Error',
    );
  });

  it('should return a SpotifyResponseError when the SpotifyClient service responds with error', async () => {
    MockedRequestClass.isRequestError.mockReturnValue(true);

    mockedRequest.get.mockRejectedValue({
      error: {
        status: 401,
        message: 'The access token expired',
      },
    });

    const spotifyClient = new SpotifyClient(mockedRequest);

    await expect(spotifyClient.fetchMusics()).rejects.toThrow(
      `Unexpected error when trying to communicate to SpotifyClient: Error: { error: The access token expired, statusCode: 401}
      `,
    );
  });
});
