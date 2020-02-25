"""
Scrapes Wikipedia's Billboard yearly hot 100 to build up a list of any songs that were in any yearly hot 100
"""

import urllib.request
from bs4 import BeautifulSoup as BS
import csv

# Writes the data to disk
def write(data):
    pass

# Reads any previously written data from disk
# If can't find any previously written data, returns an empty dict
def read():
    pass

# Scrapes wikipedias entry for the year's hot 100, and returns a list of
# that years hot 100, ordered by number
def scrapeYearlySingles(url):
    try:
        req = urllib.request.urlopen(url)
        article = req.read().decode()
        soup = BS(article, "html.parser")
        tables = soup.find_all("table", class_="sortable")
        year = url[-4:]
        res = []
        for table in tables:
            rank = 0
            for tr in table.find_all("tr"):
                tds = tr.find_all('td')
                if not tds:
                    continue

                rank += 1
                r = [year, rank]
                for td in tds[-2:]:
                    entry = td.text.strip()
                    if entry.startswith("\""):
                        entry = entry[1:]
                    if entry.endswith("\""):
                        entry = entry[:-1]
                    r = r + [entry]

                res.append(r)
                

        print("Scraped yearly singles for " + str(year))
        return res
    except Exception as e:
        print("Couldn't scrape yearly singles for " + str(year))
        print(e)
        return []

# Scrapes all year singles and writes them to yearlySingles.csv
def scrapeAllYearlySingles():
    urls =  ["https://en.wikipedia.org/wiki/Billboard_year-end_top_singles_of_" + str(year) for year in range(1946, 1949)]
    urls = urls + ["https://en.wikipedia.org/wiki/Billboard_year-end_top_30_singles_of_" + str(year) for year in range(1949, 1956)]
    urls = urls + ["https://en.wikipedia.org/wiki/Billboard_year-end_top_50_singles_of_" + str(year) for year in range(1956, 1959)]
    urls = urls + ["https://en.wikipedia.org/wiki/Billboard_Year-End_Hot_100_singles_of_" + str(year) for year in range(1959, 2020)]
    res = []
    for url in urls:
        res = res + scrapeYearlySingles(url)
    
    with open("yearlySingles.csv", "w+", newline="") as f:
        writer = csv.writer(f, dialect=csv.unix_dialect)
        writer.writerow(["Year", "Rank", "Song Title", "Artist(s)"])
        for row in res:
            writer.writerow(row)
    

def scrapeWeeklySingles(year):
    wikipedia.page("List_of_Billboard_Hot_100_number-one_singles_of_" + str(year))


if __name__ == "__main__":
    scrapeAllYearlySingles()