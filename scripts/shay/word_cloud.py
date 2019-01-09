import sqlite3
from wordcloud import WordCloud
import jieba
import jieba.analyse
import string
import matplotlib.pyplot as plt
import csv

def connect_db():
	cx = sqlite3.connect('data.db')
	return cx

def write_num(rows):
	headers = ['keywords','weight']
	with open('keywords.csv','w',newline="") as f:
		f_csv = csv.writer(f)
		if(headers):
			f_csv.writerow(headers)
		if(rows):
			for key, value in rows.items():
				f_csv.writerow([key, value])

cx = connect_db()
cu = cx.cursor()
sql = "SELECT content from DATE2017_03_10"
cu.execute(sql)
content_list = cu.fetchall()
text = ""
i = 0
for content in content_list:
	i = i+1
	content_text = str(content)[2:-5]
	content_text.translate(str.maketrans('','','您好'))
	text = text + " ".join(jieba.cut(content_text))
	if (i%200 == 0):
		print(i)

font = r'C:\Windows\Fonts\msyh.ttc'
result = jieba.analyse.textrank(text,topK=100,withWeight=True)
keywords = dict()
for r in result:
	keywords[r[0]]=r[1]

print(keywords)
write_num(keywords)

wordcloud = WordCloud(font_path=font,background_color='white',width=1000,height=800,).generate_from_frequencies(keywords)
plt.imshow(wordcloud, interpolation='bilinear')
plt.axis("off")
plt.show()
