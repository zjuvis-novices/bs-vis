#-*- coding:utf-8 -*-
import json
import os

path = "result/"
files = os.listdir(path)

data_1 = [0]*24
data_2 = [0]*24
data_3 = [0]*24
data_4 = [0]*24
data_5 = [0]*24

for file in files:
    with open(path+file,encoding="utf-8") as f:
        reader = json.loads(f.read())
        hour = int(file[14:16])
        for r in reader:
            data_5[hour] += 1
            if(r[8] == "诈骗"):
                data_1[hour] += 1
            elif(r[8] == "非法服务"):
                data_2[hour] += 1
            elif(r[8] == "广告"):
                data_3[hour] += 1
            elif(r[8] == "其他"):
                data_4[hour] += 1
    print(file+" done.")

print(data_1)
print(data_2)
print(data_3)
print(data_4)
print(data_5)