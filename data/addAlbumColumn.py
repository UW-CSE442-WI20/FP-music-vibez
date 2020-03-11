import csv
from tqdm import tqdm
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Make enviroment variables
SPOTIPY_CLIENT_ID = "8bad0b10fa7d46aaa2df96abdef90967"
SPOTIPY_CLIENT_SECRET  = "7b6c8f94a95d40919881a3275c1dc55a"

def remove_quotes(str):
    '''
    Removes quotes from given string str
    requires: quotes are only found as the first and last characters in str
    return: str without beginning and ending quotes
    '''
    return str[1:len(str) - 1]

def get_album_name(song, artist):
  '''
  Returns the name of the album the given song is on
  None is returned if album cannot be found
  '''
  query = f'{song} {artist}'
  results = sp.search(query, type='track')['tracks']['items']

  if len(results) == 0:
    return None

  for cur_result in results:
    album_type = cur_result['album']['album_type']
    if album_type == 'album':
      album_id = cur_result['album']['uri']
      return sp.album(album_id)['name']

  # no album of type 'album' found in results
  return None

def add_album_data(src, dest):
  '''
  Reads csv from src with header ['Year', 'Rank', 'Song Title', 'Artist(s)']
  and adds album data. Result is written to des with header
  ['Year', 'Rank', 'Song Title', 'Artist(s)', 'Album']. If a song (row) does
  not have an album, then the value none is written
  @param src: file path for source csv file
  @param dest: file path for destination csv file
  '''

  # Iterate through all songs in the csv file and get the album data for each
  new_data = []
  with open(src, newline='') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar='|')
    next(reader, None)
    new_data.append(['Year', 'Rank', 'Song Title', 'Artist(s)', 'Album'])
    for song in tqdm(reader):
      # remove_quotes because csv adds unneccessary quotes to each value
      date = remove_quotes(song[0])
      rank = remove_quotes(song[1])
      song_title = remove_quotes(song[2])
      artist = remove_quotes(song[3])
      album_name = get_album_name(song_title, artist)
      if album_name is None:
        # No album exists for song
        album_name = 'none'

      new_data.append([date, rank, song_title, artist, album_name])

  # Write to the destination file
  with open(dest, "w+", newline="") as f:
        writer = csv.writer(f, dialect=csv.unix_dialect)
        for row in new_data:
          writer.writerow(row)



if __name__ == "__main__":
  add_album_data('drive/My Drive/chart-data/kanye-west-weekly-charts.csv', 'drive/My Drive/chart-data/with-album/kanye-west-weekly-charts.csv')
  add_album_data('drive/My Drive/chart-data/lady-gaga-weekly-charts.csv', 'drive/My Drive/chart-data/with-album/lady-gaga-weekly-charts.csv')
  add_album_data('drive/My Drive/chart-data/queen-weekly-charts.csv', 'drive/My Drive/chart-data/with-album/queen-weekly-charts.csv')
  add_album_data('drive/My Drive/chart-data/michael-jackson-weekly-charts.csv', 'drive/My Drive/chart-data/with-album/michael-jackson-weekly-charts.csv')
  add_album_data('drive/My Drive/chart-data/the-beatles-weekly-charts.csv', 'drive/My Drive/chart-data/with-album/the-beatles-weekly-charts.csv')
