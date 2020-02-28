import csv
import json
# from profanity_check.profanity_check import predict as predict_explicit

# Will need to change path for it to work in github page
LYRICS_FILENAME = 'C:/Users/alan-/Documents/CSE442/A4/FP-music-vibez/data/lyrics.csv'
DATA_DEST_FILENAME = 'C:/Users/alan-/Documents/CSE442/A4/FP-music-vibez/data/lyrics-data.json'

def remove_quotes(str):
    '''
    Removes quotes from given string str

    requires: quotes are only found as the first and last characters in str
    return: str without beginning and ending quotes
    '''
    return str[1:len(str) - 1]

def get_data(data, goal_val, primary_key):
    '''
    data:   Array of dictionaries each containing the given primary_key
    goal_val:    The value the primary_key must equal
    primary_key: Field name for the Primary Key in the dictionary

    returns the dictionary containing the data where the primary_key is equal
            to the goal_val. If such dictionary does not exist, then None is returned

    e.g data is array with format
        [{field_a: x, field_b: y}, ...]
        calling get_data(main_data, 5, field_a) would return the dictionary
        where field_a is equal to 5
    '''
    # Look for dictionary corrosponding to given word
    for dict in data:
        if dict[primary_key] == goal_val:
            # Found word data
            return dict

    # No data exists for given str
    return None


def analyze_lyrics(file):
    '''
    Go through lyrics for each song and make json with word data for
    each year in given file. Word data includes occurances, if the word
    is explicit, and artists who used that word and how much

    JSON format below:
    
    {
        'some year': [
                {
                    text: 'some word',
                    occurances: 4,
                    explicit: true,
                    artists: [
                        {
                            artist: 'some artist',
                            occurances: 1
                        },
                        {
                            artist: 'some other artist',
                            occurances: 2
                        },
                        .
                        .
                        .
                    ]
                },
                {
                    text: 'some other word',
                    occurances: 5
                    explict: false,
                    artists: [
                        .
                        .
                        .
                    ]
                }
                .
                .
                .
            ],
        'some other year': [
            .
            .
            .
            ],
        .
        .
        .
    }

    '''
    data = {}
    with open(file, newline='') as csvfile:
        lyric_reader = csv.reader(csvfile, delimiter=',', quotechar='|')

        # Go through each song
        prev_year = -1
        for row in lyric_reader:
            cur_year = remove_quotes(row[0])
            if prev_year != cur_year:
                prev_year = cur_year
                # Dictionary of words for cur_year
                data[cur_year] = []
            year_data = data[cur_year]

            # Now parse through each word in lyrics
            artist = remove_quotes(row[3])
            lyrics = remove_quotes(row[4]).split()
            for word in lyrics:
                word_data = get_data(year_data, word, 'text')
                if word_data is None:
                    # New word encountered
                    word_data = {}
                    word_data['text'] = word
                    word_data['explicit'] = False
                    word_data['artists'] = []
                    word_data['occurances'] = 0
                    year_data.append(word_data)
                word_data['occurances'] += 1

                artist_data = get_data(word_data['artists'], artist, 'artist')

                if artist_data is None:
                    # New artist found
                    artist_data = {}
                    artist_data['artist'] = artist
                    artist_data['occurances'] = 0
                    word_data['artists'].append(artist_data)
                artist_data['occurances'] += 1

    return data

word_data = analyze_lyrics(LYRICS_FILENAME)

with open(DATA_DEST_FILENAME, 'w', encoding='utf-8') as f:
    json.dump(word_data, f, indent=4, sort_keys=True)
