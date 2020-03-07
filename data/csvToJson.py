import csv

def remove_quotes(str):
    '''
    Removes quotes from given string str
    requires: quotes are only found as the first and last characters in str
    return: str without beginning and ending quotes
    '''
    return str[1:len(str) - 1]

def csv_to_json():
    '''
    {
        "{artist}" :
            {
                "{song name}":
                    [
                        {
                            week: "01/20/2020",
                            rank: '1'
                        },
                        .
                        .
                        .
                    ],
                .
                .
                .
            },
        .
        .
        .
    }
    '''
    res = {'Kanye West': {}, 'Michael Jackson': {}, 'Queen': {}, 'The Beatles':, 'Lady Gaga': {}}
    for cur_year in range(1964, 2020):
        try:
            with open(f'weekly-charts-{cur_year}.csv', newline='') as csvfile:
                reader = csv.reader(csvfile, delimiter=',', quotechar='|')
                for song in reader:
                    date = song['Year']
                    rank = song['Rank']
                    song_title = song['Song Title']
                    artist = song['Artist(s)']

                    # Some time artist contains features so we want to remove those
                    if 'Kanye West' in artist:
                        artist = 'Kanye West'
                    elif 'Michael Jackson' in artist:
                        artist = 'Michael Jackson'
                    elif 'Queen' in artist:
                        artist = 'Queen'
                    elif 'The Beatles' in artist:
                        artist = 'The Beatles'
                    elif 'Lady Gaga' in artist:
                        artist = 'Lady Gaga'

                    artist_data = res[artist]

                    if song_title not in artist_data:
                        artist_data[song_title] = []

                    artist_data.append({'week': date, 'rank': rank})
        except FileNotFoundError:
            continue

    with open('weekly-charts.json', 'w', encoding='utf-8') as f:
        json.dump(word_data, f, indent=4, sort_keys=True)
