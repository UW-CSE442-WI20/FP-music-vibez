import csv

titles = {}
with open("yearlySingles.csv", "r") as f:
    reader = csv.DictReader(f, dialect=csv.unix_dialect)
    for row in reader:
        title = row["Song Title"]
        if title not in titles:
            titles[title] = 0
        titles[title] = titles[title] + 1

for t, c in titles.items():
    if c > 1:
        print("{} has {} occurances".format(t, c))
    else:
        print("{} is unique!".format(t))