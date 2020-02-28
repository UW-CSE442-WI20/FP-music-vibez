# Scrapes lyrics

import re
import csv
import urllib.request
import requests
from bs4 import BeautifulSoup
import lyricsgenius

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'}
 
# https://www.quora.com/Whats-a-good-API-to-use-to-get-song-lyrics
def get_lyrics_azlyrics(artist,song_title):
    artist = artist.lower()
    song_title = song_title.lower()
    # remove all except alphanumeric characters from artist and song_title
    artist = re.sub('[^A-Za-z0-9]+', "", artist)
    song_title = re.sub('[^A-Za-z0-9]+', "", song_title)
    if artist.startswith("the"):    # remove starting 'the' from artist e.g. the who -> who
        artist = artist[3:]
    url = "http://azlyrics.com/lyrics/"+artist+"/"+song_title+".html"
    
    try:
        content = urllib.request.urlopen(url).read()
        soup = BeautifulSoup(content, 'html.parser')
        lyrics = str(soup)
        # lyrics lies between up_partition and down_partition
        up_partition = '<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->'
        down_partition = '<!-- MxM banner -->'
        lyrics = lyrics.split(up_partition)[1]
        lyrics = lyrics.split(down_partition)[0]
        lyrics = lyrics.replace('<br>','').replace('</br>','').replace('</div>','').strip()
        return lyrics
    except Exception as e:
        return "Exception occurred \n" + str(e)

def get_lyrics_genius(artist, song_title):
    url = "https://genius.com/{}-{}-lyrics".format(artist.replace(" ", "-").strip().lower(), song_title.replace(" ", "-".strip().lower()))
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")
        lyrics = soup.find_all("div", {"class": "lyrics"})[0].get_text()
        a = str(lyrics).replace("<p>", "").replace("</p>", "").replace("<br>", "\\n").replace("<div>", "").replace("</div>", "").replace("<br/>","\\n")
        while a.startswith("\n"):
            a = a[3:]
        while a.endswith("\n"):
            a = a[:-3]
        return a
    except Exception as e:
        print(url)
        print("Exception occurred \n" + str(e))
        exit(1)

# Uses the lyricsgenius package to do a search
def get_lyrics_genius_package(artist, song_title):
    genius = lyricsgenius.Genius("GRyKhAue4YGkDk7I6iX4F2H5MVe-1jZ-KUlPXr0wuVflbkuHQSxLhSYcr5G-TpR0")
    song = genius.search_song(song_title, artist)
    return song.lyrics

def get_all_lyrics(filename):
    already_read = {}
    with open("lyrics.csv", "r") as out:
        reader = csv.DictReader(out)
        for row in reader:
            already_read["{}.{}".format(row["Year"], row["Rank"])] = row

    with open("lyrics.csv", "w+") as out:
        writer = csv.DictWriter(out, fieldnames=["Year", "Rank", "Song Title", "Artist(s)", "Lyrics"], dialect=csv.unix_dialect)
        writer.writeheader()
        with open(filename, "r") as f:
            reader = csv.DictReader(f, dialect=csv.unix_dialect)
            for row in reader:
                if row["Year"] != "2019":
                    continue
                if "{}.{}".format(row["Year"], row["Rank"]) in already_read:
                    writer.writerow(already_read["{}.{}".format(row["Year"], row["Rank"])])
                    continue

                print("Starting {}.{} {} by {}".format(row["Year"], row["Rank"], row["Song Title"], row["Artist(s)"]))
                lyrics = get_lyrics_genius_package(row["Artist(s)"], row["Song Title"])
                lyrics = lyrics.replace("\n", "\\n")
                lyrics = lyrics.replace("<br/>","\\n")
                lyrics = lyrics.strip()
                if "HTTP Error 404: Not Found" in lyrics:
                    print("404 ERROR ON {}.{} {} by {}".format(row["Year"], row["Rank"], row["Song Title"], row["Artist(s)"]))
                elif "HTTP Error 403" in lyrics:
                    print("403 ERROR ON {}.{} {} by {}".format(row["Year"], row["Rank"], row["Song Title"], row["Artist(s)"]))
                else:
                    row["Lyrics"] = lyrics
                    writer.writerow(row)

if __name__ == "__main__":
    get_all_lyrics("yearlySingles.csv")
    