import csv
import json
import re

"""


TODO: We need to think about the most common access patterns that
our viz provides so we can make more optimal indices. Bascially
we don't want to have to do a search over the entire keyspace
of lyrics or songs every time an update is made. These two that
I have made should be a good starting point.

Converts lyrics.csv into json objects with the following schemas:

song-index.json
{
    song_title: {
        lyrics: {
            word: number of occurences
        },
        year: year,
        artist: artist,
        rank: rank,
    }
}

lyric-year-index.json
{
    lyric: {
        year: count
    }
}

year-lyric-index.json 
{
    year: {
        lyric1: count1, 
        lyric2: count2, 
        ... 
    }
}

"""

chars_to_remove = "()?!,."

# Separates a song lyrics into component words
def tokenize_lyrics(lyric):
    lyric = lyric.lower()
    lyric = lyric.replace("\n", " ")
    lyric = lyric.replace("\\n", " ")
    lyric = lyric.replace("\\\"", "")

    for c in chars_to_remove:
        lyric = lyric.replace(c, "")

    return lyric.split() # Split into list on whitespace

# Takes a list of strings and returns a dict mapping
# each string to the number of times it was in the list
def count_lyrics(tokenized_lyrics):
    res = {}
    for lyric in tokenized_lyrics:
        if lyric not in res:
            res[lyric] = 0
        res[lyric] = res[lyric] + 1
    return res


def build_song_index():
    output = {}

    with open("lyrics.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            t = {}
            t["lyrics"] = count_lyrics(tokenize_lyrics(row["Lyrics"]))
            t["year"] = row["Year"]
            t["rank"] = row["Rank"]
            t["artists"] = row["Artist(s)"]
            t["URL"] = row["URL"]
            t["song"] = row["Song Title"]
            if len(t["lyrics"]) == 0:
                continue
            output[row["Song Title"]] = t

    with open("song-index.json", "w+", encoding="utf-8") as f:
        json.dump(output, f, sort_keys=True, indent=4, ensure_ascii=False)
    
def build_lyric_year_index():
    output = {}

    with open("lyrics.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            counts = count_lyrics(tokenize_lyrics(row["Lyrics"]))
            if len(counts) == 0:
                continue
            
            for w, c in counts.items():
                if w not in output:
                    output[w] = {}
                if row["Year"] not in output[w]:
                    output[w][row["Year"]] = 0
                output[w][row["Year"]] = output[w][row["Year"]] + c


    with open("lyric-year-index.json", "w+", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False)

def build_year_lyric_index():
    output = {}

    with open("lyrics.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            counts = count_lyrics(tokenize_lyrics(row["Lyrics"]))
            if len(counts) == 0:
                continue
            
            if row["Year"] not in output:
                output[row["Year"]] = {}

            for w, c in counts.items():
                if w not in output[row["Year"]]:
                    output[row["Year"]][w] = {}
                    output[row["Year"]][w]["text"] = w
                    output[row["Year"]][w]["size"] = 0

                output[row["Year"]][w]["size"] = output[row["Year"]][w]["size"] + c

                ''' {"text": "alone", "size": 1447}'''

    '''print(output["1990"])'''
    i = 0;
    res = {}
    for year, values in output.items():
        res[year] = [];
        if i < 2:
            print(year)
        for key, value in values.items():
            res[year].append(value);
            if i < 1:
                print(key)
                print(value)
            i += 1

    with open("year-lyric-index.json", "w+", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False)

def build_lyric_index():
    output = {}

    with open("lyrics.csv", "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            counts = count_lyrics(tokenize_lyrics(row["Lyrics"]))
            if len(counts) == 0:
                continue
            
            for w, c in counts.items():
                if w not in output:
                    output[w] = {}
                    output[w]["text"] = w
                    output[w]["size"] = 0
                output[w]["size"] = output[w]["size"] + c

    res = []
    for k, v in output.items():
        res.append(v)

    with open("lyric-index.json", "w+", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False)

if __name__ == "__main__":
    build_song_index()
    '''build_lyric_year_index()'''
    build_year_lyric_index()
    '''build_lyric_index()'''