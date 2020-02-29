# Scrapes lyrics

import re
import json
import sys
import csv
maxInt = sys.maxsize

while True:
    # decrease the maxInt value by factor 10 
    # as long as the OverflowError occurs.

    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)

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
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        lyrics = str(soup)
        # lyrics lies between up_partition and down_partition
        up_partition = '<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->'
        down_partition = '<!-- MxM banner -->'
        lyrics = lyrics.split(up_partition)[1]
        lyrics = lyrics.split(down_partition)[0]
        lyrics = lyrics.replace('<br>','').replace('</br>','').replace('</div>','').strip()
        return lyrics, url, response.status_code
    except Exception as e:
        return None, url, None

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

genius = lyricsgenius.Genius("GRyKhAue4YGkDk7I6iX4F2H5MVe-1jZ-KUlPXr0wuVflbkuHQSxLhSYcr5G-TpR0")
genius.verbose = False
genius.remove_section_headers = True
genius.skip_non_songs = False

# Uses the lyricsgenius package to do a search
def get_lyrics_genius_package(artist, song_title):
    #genius_artist = genius.search_artist(artist)
    #if genius_artist is None:
    return genius.search_song(song_title, artist)
    #return genius.search_song(song_title, genius_artist.name)

def clean_lyrics_string(lyrics):
    lyrics = lyrics.replace("<br/>","\\n")
    lyrics = lyrics.strip()
    lyrics = json.dumps(lyrics)
    while lyrics.startswith("\""):
        lyrics = lyrics[1:]
    while lyrics.endswith("\""):
        lyrics = lyrics[:-1]
    return lyrics

# Attempts to figure out if the genius url is actually the
# lyrics for the given song
def url_is_plausible(song, artist, url):
    if not url.endswith("lyrics") and not url.endswith("annotated"):
        return False
    parsed_url = url.replace("https://genius.com/", "").lower().replace("-lyrics","").replace("-annotated", "").split("-")
    parsed_artist = artist.lower().replace("'", "").replace("(", "").replace(")", "").split(" ")
    parsed_song = song.lower().replace("'", "").replace("(", "").replace(")", "").split(" ")

    count = 0
    for s in parsed_song:
        if s in parsed_url:
            count += 1
    
    for s in parsed_artist:
        if s in parsed_url:
            count += 1

    res = count / len(parsed_url) >= 0.6

    if not res:
        print("URL for {} is probably wrong: {}".format(song, url))
        print("\t%={}".format(count / len(parsed_url)))
        print("\tparsed_url = {}".format(parsed_url))
        print("\tparsed_artist = {}".format(parsed_artist))
        print("\tparsed_song = {}".format(parsed_song))

    return count / len(parsed_url) > 0.5


def get_all_lyrics_azlyrics(filename):
    
    # See if we have already started scraping so we can pick up where we left off
    already_read = {}
    try:
        with open("azlyrics.csv", "r") as out:
            reader = csv.DictReader(out)
            for row in reader:
                already_read["{}.{}".format(row["Year"], row["Rank"])] = row
    except FileNotFoundError as e:
        print("Could not read azlyrics.csv, starting from scratch")


    with open("azlyrics.csv", "w+") as out:
        writer = csv.DictWriter(out, fieldnames=["Year", "Rank", "Song Title", "Artist(s)", "Lyrics", "URL"], dialect=csv.unix_dialect)
        writer.writeheader()
        with open(filename, "r") as f:
            reader = csv.DictReader(f, dialect=csv.unix_dialect)
            count = 0
            for row in reader:
                count += 1
                if count % 10 == 0:
                    out.flush()
                if "{}.{}".format(row["Year"], row["Rank"]) in already_read:
                    writer.writerow(already_read["{}.{}".format(row["Year"], row["Rank"])])
                    continue
               
                lyrics, url, code = get_lyrics_azlyrics(row["Artist(s)"], row["Song Title"])

                if lyrics is None:
                    print("Could not find {} - {} - {} - {}".format(row["Year"], row["Rank"], row["Artist(s)"], row["Song Title"]))
                elif code != 200:
                    print("Status code is not 200 (was {}) for {} - {} - {} - {}".format(code, row["Year"], row["Rank"], row["Artist(s)"], row["Song Title"]))
                else:
                    print("Finished {} - {} - {} - {}".format(row["Year"], row["Rank"], row["Artist(s)"], row["Song Title"]))
                    row["Lyrics"] = clean_lyrics_string(lyrics)
                row["URL"] = url
                writer.writerow(row)

def get_all_lyrics(filename):

    # See if we have already started scraping so we can pick up where we left off
    already_read = {}
    try:
        with open("lyrics.csv", "r") as out:
            reader = csv.DictReader(out)
            for row in reader:
                already_read["{}.{}".format(row["Year"], row["Rank"])] = row
    except FileNotFoundError as e:
        print("Could not read lyrics.csv, starting from scratch")


    with open("lyrics.csv", "w+") as out:
        writer = csv.DictWriter(out, fieldnames=["Year", "Rank", "Song Title", "Artist(s)", "Lyrics", "URL"], dialect=csv.unix_dialect)
        writer.writeheader()
        with open(filename, "r") as f:
            reader = csv.DictReader(f, dialect=csv.unix_dialect)
            count = 0
            for row in reader:
                count += 1
                if count % 10 == 0:
                    out.flush()
                if "{}.{}".format(row["Year"], row["Rank"]) in already_read:
                    writer.writerow(already_read["{}.{}".format(row["Year"], row["Rank"])])
                    continue

                song = get_lyrics_genius_package(row["Artist(s)"], row["Song Title"])
                if song is None:
                    writer.writerow(row)
                    print("Could not find lyrics for {} {}!".format(row["Artist(s)"], row["Song Title"]))
                    continue

                lyrics = clean_lyrics_string(song.lyrics)

                if not url_is_plausible(row["Song Title"], row["Artist(s)"], song.url):
                    row["URL"] = song.url
                    writer.writerow(row)
                else:
                    print("Finished {} - {} - {} - {}".format(row["Year"], row["Rank"], row["Artist(s)"], row["Song Title"]))
                    row["Lyrics"] = lyrics
                    row["URL"] = song.url
                    writer.writerow(row)

if __name__ == "__main__":
    argv = sys.argv

    if len(argv) != 2:
        print("Must specify either 'genius' or 'azlyrics'")
        exit(1)
    
    if argv[1] == "genius":
        get_all_lyrics("yearlySingles.csv")
    elif argv[1] == "azlyrics":
        get_all_lyrics_azlyrics("yearlySingles.csv")
    else:
        print("Must specify either 'genius' or 'azlyrics'")
    
