#-*- coding:utf-8 -*-
import json
import os

path_1 = "with-segments/"
path_2 = "word-frequency/"
files_1 = os.listdir(path_1)

for file in files_1:
    with open(path_1+file,encoding="utf-8") as f:
        reader = json.loads(f.read())
        counts = {}
        for r in reader:
            words = ""
            for rr in r[2]:
                words = words+" "+rr
            words = words.split(" ")
            for word in words:
                if len(word) <= 1:
                    continue
                else:
                    if word in counts.keys():
                        counts[word] += 1
                    else:
                        counts[word] = 1
        items = list(counts.items())
        items.sort(key=lambda x:x[1], reverse=True)
    
    with open(path_2+file[3:],"w",encoding="utf-8") as f:
        length = len(items)
        print(length)
        if length >= 51:
            f.write("[\n")
            for i in range(49):
                name,value = items[i]
                f.write("\t{\"name\":"+"\""+name+"\""+", \"value\":"+str(value)+"},\n")
            name,value = items[50]
            f.write("\t{\"name\":"+"\""+name+"\""+", \"value\":"+str(value)+"}\n]")
        elif length > 0:
            f.write("[\n")
            for i in range(length-2):
                name,value = items[i]
                f.write("\t{\"name\":"+"\""+name+"\""+", \"value\":"+str(value)+"},\n")
            name,value = items[length-1]
            f.write("\t{\"name\":"+"\""+name+"\""+", \"value\":"+str(value)+"}\n]")

    print(file[3:]+" done.")
    