import json
import csv
import os

def count_num():
	path = "cleaned"
	files = os.listdir(path)

	rows = []
	for file in files:
		i = 0
		with open("cleaned/"+file,encoding='utf-8') as f:
			reader = json.load(f)
			for row in reader:
				i = i+1
			hour = file[0:-5]
			num = i
			row = [hour,num]
			rows.append(row)
			print(row)
	return rows

def write_num(rows):
	headers = ['hour', 'number']
	with open('number_by_hours.csv','w') as f:
		f_csv = csv.writer(f)
		if(headers):
			f_csv.writerow(headers)
		if(rows):
			for row in rows:
				f_csv.writerow(row)

rows = count_num()
write_num(rows)