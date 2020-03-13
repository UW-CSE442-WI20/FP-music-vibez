import csv

def remove_quotes(str):
    '''
    Removes quotes from given string str
    requires: quotes are only found as the first and last characters in str
    return: str without beginning and ending quotes
    '''
    return str[1:len(str) - 1]

def clean_album_title(title):
    # remove ()
    # fix casing]
    # trim

    title = title.lower()
    result = ""
    first_letter = True
    for char in title:
        if char == '(':
            break
        elif char == ' ':
            first_letter = True
            result += char
        elif first_letter:
            result += char.upper()
            first_letter = False
        else:
            result += char
    return result.strip()


def clean_album_titles(src, dst):
    data = []

    with open(src, newline='') as csvfile:
        reader = csv.reader(csvfile, delimiter=',', quotechar='|')
        header = reader.__next__()
        for song in reader:
            date = remove_quotes(song[0])
            rank = remove_quotes(song[1])
            song_title = remove_quotes(song[2])
            cur_artist = remove_quotes(song[3])
            album_title = clean_album_title(remove_quotes(song[4]))
            data.append([date, rank, song_title, cur_artist, album_title])

    with open(dst, "w+", newline="") as csvfile:
        writer = csv.writer(csvfile, dialect=csv.unix_dialect)
        for song in data:
            writer.writerow(song)

if __name__ == '__main__':
    clean_album_titles('weekly-charts/dirty/kanye-west-weekly-charts.csv', 'weekly-charts/kanye-west-weekly-charts.csv')
    clean_album_titles('weekly-charts/dirty/lady-gaga-weekly-charts.csv', 'weekly-charts/lady-gaga-weekly-charts.csv')
    clean_album_titles('weekly-charts/dirty/michael-jackson-weekly-charts.csv', 'weekly-charts/michael-jackson-weekly-charts.csv')
    clean_album_titles('weekly-charts/dirty/queen-weekly-charts.csv', 'weekly-charts/queen-weekly-charts.csv')
    clean_album_titles('weekly-charts/dirty/the-beatles-weekly-charts.csv', 'weekly-charts/the-beatles-weekly-charts.csv')
