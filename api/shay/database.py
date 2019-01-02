# import pymysql
import sqlite3
import csv
import time
import os
# def connect_mysql():
# 	cx = pymysql.connect(
# 		host = '',
# 		port = 3306,
# 		user = '',
# 		passwd = '',
# 		db = '',
# 		charset = 'utf8',
# 		)
# 	return cx

def connect_db():
	cx = sqlite3.connect('data.db')
	return cx

cx = connect_db()
cu = cx.cursor()
path = "data"
files = os.listdir(path)

for file in files:
	with open("data/"+file,encoding='utf-8') as f:
		reader = csv.reader(f)
		header_row = next(reader)

		date = file[0:4]+"-"+file[4:6]+"-"+file[6:8]
		date1 = "DATE"+file[0:4]+"_"+file[4:6]+"_"+file[6:8]
		sql = "CREATE TABLE "+date1+" (id INTEGER PRIMARY KEY,date TEXT,md5 TEXT,content TEXT,phone TEXT,conntime TEXT,recitime TEXT,lng TEXT,lat TEXT);"
		cu.execute(sql)

		for row in reader:
			md5 = row[0]
			content = row[1].replace("'","''")
			phone = row[2]
			conntimeArray = time.localtime(int(row[3])/1000)
			conntime = time.strftime("%Y-%m-%d %H:%M:%S", conntimeArray)
			recitimeArray = time.localtime(int(row[4])/1000)
			recitime = time.strftime("%Y-%m-%d %H:%M:%S", recitimeArray)
			lng = row[5]
			lat = row[6]
			sql = "insert into "+date1+" (date,md5,content,phone,conntime,recitime,lng,lat) values ('%s','%s','%s','%s','%s','%s','%s','%s')" % (date,md5,content,phone,conntime,recitime,lng,lat)
			try:
				cu.execute(sql)
			except:
				print(sql)
				continue
		cx.commit()
	print(file+" done.")

cx.close()
			