import csv
import json

# Will need to change path for it to work in github page
LYRICS_FILENAME = 'C:/Users/alan-/Documents/CSE442/A4/FP-music-vibez/data/lyrics.csv'
LYRIC_DATA_DEST_FILENAME = 'C:/Users/alan-/Documents/CSE442/A4/FP-music-vibez/data/lyrics-data.json'

def remove_quotes(str):
    '''
    Removes quotes from given string str

    requires: quotes are only found as the first and last characters in str
    return: str without beginning and ending quotes
    '''
    return str[1:len(str) - 1]

def analyze_lyrics(file):
    '''
    Go through lyrics for each song and make json with word data for
    each year in lyrics.csv. Word data includes occurances, if the word
    is explicit, and artists who used that word and how much

    JSON format below:
    { 'some year': {
         'some word': {
             occurances: int,
             explicit: boolean,
             artists = {
                'some artist':  {
                    occurances: int
                 }
             }
         },
         'some other word': {
         .
         .
         .
         },
      },
      'some other year':
      .
      .
      .
    }
    '''
    years = {}
    with open(file, newline='') as csvfile:
        lyric_reader = csv.reader(csvfile, delimiter=',', quotechar='|')

        prev_year = -1
        for row in lyric_reader:
            cur_year = remove_quotes(row[0])
            if prev_year != cur_year:
                prev_year = cur_year
                # Dictionary of words for cur_year
                years[cur_year] = {}

            # Now parse through each word in lyrics
            artist = remove_quotes(row[3])
            lyrics = remove_quotes(row[4]).split()
            for word in lyrics:
                if word not in years[cur_year]:
                    # New word found
                    years[cur_year][word] = {}
                    years[cur_year][word]['occurances'] = 0
                    years[cur_year][word]['explicit'] = False
                    years[cur_year][word]['artists'] = {}

                years[cur_year][word]['occurances'] += 1

                if artist not in years[cur_year][word]['artists']:
                    # New artist found
                    years[cur_year][word]['artists'][artist] = {}
                    years[cur_year][word]['artists'][artist]['occurances'] = 0
                years[cur_year][word]['artists'][artist]['occurances'] += 1
    return years

word_data = analyze_lyrics(LYRICS_FILENAME)

with open(LYRIC_DATA_DEST_FILENAME, 'w', encoding='utf-8') as f:
    json.dump(word_data, f, indent=4, sort_keys=True)
