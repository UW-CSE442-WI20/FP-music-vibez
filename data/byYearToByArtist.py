import csv

def remove_quotes(str):
    '''
    Removes quotes from given string str
    requires: quotes are only found as the first and last characters in str
    return: str without beginning and ending quotes
    '''
    return str[1:len(str) - 1]

def byYearToByArtist(artist, destfilename):
    artist_res = []
    for cur_year in range(1964, 2020):
        try:
            with open(f'weekly-charts/by-year/weekly-charts-{cur_year}.csv', newline='') as csvfile:
                reader = csv.reader(csvfile, delimiter=',', quotechar='|')
                for song in reader:
                    date = remove_quotes(song[0])
                    rank = remove_quotes(song[1])
                    song_title = remove_quotes(song[2])
                    cur_artist = remove_quotes(song[3])

                    # Some time artist contains features so we want to remove those
                    if artist in cur_artist:
                        artist_res.append([date, rank, song_title, artist])
        except FileNotFoundError:
            continue

    with open(destfilename, "w+", newline="") as f:
      writer = csv.writer(f, dialect=csv.unix_dialect)
      writer.writerow(["Year", "Rank", "Song Title", "Artist(s)"])
      for song in artist_res:
          writer.writerow(song)

if __name__ == "__main__":
    byYearToByArtist('The Beatles', 'weekly-charts/the-beatles-weekly-charts.csv')
    byYearToByArtist('Queen', 'weekly-charts/queen-weekly-charts.csv')
    byYearToByArtist('Michael Jackson', 'weekly-charts/michael-jackson-weekly-charts.csv')
    byYearToByArtist('Lady Gaga', 'weekly-charts/lady-gaga-weekly-charts.csv')
    byYearToByArtist('Kanye West', 'weekly-charts/kanye-west-weekly-charts.csv')
