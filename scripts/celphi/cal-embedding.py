import json
import sys
from os import listdir
from os import path
from functools import reduce

# Constructing embedding dictionary
embedding = open('embedding/filtered.word')
dictionary = {}
i = 0
for line in embedding:
    splitted = line.rstrip('\n').rstrip(' ').split(' ')
    word = splitted[0]
    vector = list(map(float, splitted[1:]))
    dictionary[word] = vector
    i += 1
    sys.stdout.write('\r{percentage:.2f}%'.format(percentage = 100 * i / 165215))

print()

# Configure files
files = list(filter(lambda string: string[-5:] == '.json', listdir('with-segments')))
files.sort()

j = 0
for filename in files:
    full_filename = path.join('with-segments', filename)
    export_filename = path.join('with-embeddings', filename)
    def mean_embedding(wordlist):
        try:
            filtered = filter(lambda word: word in dictionary, wordlist)
            mapped = list(map(lambda word: dictionary[word], filtered))
            vec_plus = lambda vec_a, vec_b: list(map(lambda a, b: a + b, vec_a, vec_b))
            summed = reduce(vec_plus, mapped)
            mean = list(map(lambda x: x/len(mapped), summed))
            return mean
        except:
            return []
    
    data = json.load(open(full_filename))
    export_data = list(map(lambda item: item[:3] + [mean_embedding(item[2])] + item[3:], data))
    json.dump(export_data, open(export_filename, 'w'), ensure_ascii = False)
    j += 1
    sys.stdout.write('\r{percentage:.2f}%'.format(percentage = 100 * j / 1512))

print()