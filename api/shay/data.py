import csv
import time
import os
import pygal
from pygal.style import LightColorizedStyle as LCS, LightenStyle as LS

def count_num():
	path = "data"
	files = os.listdir(path)

	rows = []
	for file in files:
		i = 0
		with open("data/"+file,encoding='utf-8') as f:
			reader = csv.reader(f)
			header_row = next(reader)

			for row in reader:
				i = i+1
			date = file[0:4]+"-"+file[4:6]+"-"+file[6:8]
			num = i
			row = [date,num]
			rows.append(row)
			print(date+" "+str(num))
	return rows

def write_num(rows):
	headers = ['date','number']
	with open('number.csv','w',newline="") as f:
		f_csv = csv.writer(f)
		if(headers):
			f_csv.writerow(headers)
		if(rows):
			for row in rows:
				f_csv.writerow(row)

def draw_date_number():
	dates,nums = [], []
	with open("number.csv",encoding='utf-8') as f:
		reader = csv.reader(f)
		header_row = next(reader)
		for row in reader:
			dates.append(row[0])
			nums.append(int(row[1]))

	# print(dates,nums)
	my_style = LS('#333366', base_style=LCS)
	chart = pygal.Bar(style=my_style, x_label_rotation=45, show_legend=False)
	chart.title = 'Numbers of Spam Messages'
	chart.x_labels = dates
	chart.add('', nums)
	chart.render_to_file('numbers.svg')

# rows = count_num()
# write_num(rows)
draw_date_number()