import json
import jieba
import jieba.analyse
import re
from os import listdir
from os import path

# Configure files
files = list(filter(lambda string: string[-5:] == '.json', listdir('cleaned')))
files.sort()

for filename in files:
    full_filename = path.join('cleaned', filename)
    export_filename = path.join('with-segments', filename)
    # Hanzi filter
    not_hanzi_re = re.compile(u'[^⺀-⺙⺛-⻳⼀-⿕々〇〡-〩〸-〺〻㐀-䶵一-鿃豈-鶴侮-頻並-龎]', re.UNICODE)
    stopwords = [line.rstrip('\n') for line in open('assist-data/stopwords.txt')]
    def seg_words(string):
        seg = jieba.lcut(not_hanzi_re.sub('', string))
        return list(filter(lambda word: word not in stopwords, seg))

    data = json.load(open(full_filename))
    export_data = list(filter(lambda line: len(line[2]) != 0, map(lambda item: item[:2] + [seg_words(item[1])] + item[2:], data)))

    json.dump(export_data, open(export_filename, 'w'), ensure_ascii = False)
