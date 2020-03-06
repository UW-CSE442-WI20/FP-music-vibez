from bs4 import BeautifulSoup
import requests
from datetime import date, timedelta
import time
import csv
import os

STARTING_WEEK = date(1964, 1, 4)

def scrape_hot_100_songs(date):
  '''
  Scrapes the billboard hot 100 songs

  Scrapes the Billboard Hot 100 songs during the given date
  and returns them as a 2-D array
  [['{date}', '{rank}', '{song name}', '{artist(s)}], ..., [...]]

  date must be a valid date for which a Billboard
  top 100 chart exists

  Parameters:
    date (datetime.date): Date of chart from when to get data

  Returns:
    The Billboard Hot 100 songs for the given date as a 2-D array
  '''

  # Make a request for the billboard top 100 page for the given date
  year = str(date.year)
  month = str(date.month)

  if date.month < 10:
    month = '0' + month
  day = str(date.day)
  if date.day < 10:
    day = '0' + day
  request_url = f'https://www.billboard.com/charts/hot-100/{year}-{month}-{day}'
  header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36'}
  response = requests.get(request_url, headers=header)
  soup = BeautifulSoup(response.text, "html.parser")

  # Extract relevant data from page
  song_names = soup.find_all(class_="chart-element__information__song text--truncate color--primary")
  artist_names = soup.find_all(class_="chart-element__information__artist text--truncate color--secondary")

  # Format data into dictionary and insert the top k songs into it
  res = []
  for i in range(100):
    try:
      song_name = song_names[i].string
      artist = artist_names[i].string
      rank = i + 1
      res.append([date.strftime("%m/%d/%Y"), rank, song_name, artist])
    except IndexError:
      print(f'Error received response {response} for date {date}')
      return None



  return res

def scrape_all_hot_100_songs():
  # Collect data from STARTING_WEEK up till 2020
  cur_date = STARTING_WEEK
  cur_year = cur_date.year
  while cur_year < 2020:
    # Collect data for current year
    hot_100s = []
    while cur_date.year == cur_year:
      print(f'Scraping for week of {cur_date}')

      # Collect data for current week
      cur_hot_100 = scrape_hot_100_songs(cur_date)
      if cur_hot_100 is not None:
        hot_100s.append(cur_hot_100)
        print(f'Succesfully scraped for week of {cur_date}')
        cur_date += timedelta(days=7)
      else:
        print("Trying again")

      # Wait before making another request
      time.sleep(5)

    filename = f'weekly-charts/weekly-charts-{cur_year}.csv'
    print(f'Writing data for current year to {filename}')
    num_entries = 0
    with open(filename, "w+", newline="") as f:
      writer = csv.writer(f, dialect=csv.unix_dialect)
      writer.writerow(["Year", "Rank", "Song Title", "Artist(s)"])
      # Iterate through weeks and write each song iff it's by one of our artists
      for week in hot_100s:
        for song in week:
          cur_artist = song[3]
          if 'Kanye West' in cur_artist or 'Michael Jackson' in cur_artist or \
             'Lady Gaga' in cur_artist or 'Queen' in cur_artist or 'The Beatles' in cur_artist:
            writer.writerow(song)
            num_entries += 1

    if num_entries == 0:
      print(f'No data to write, deleting file')
      os.remove(filename)
    else:
      print(f'Done writing for {cur_year}')

    cur_year = cur_date.year


if __name__ == "__main__":
  scrape_all_hot_100_songs()
