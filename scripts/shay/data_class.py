#-*- coding:utf-8 -*-
import json
import os
import re

path_1 = "with-segments/"
path_2 = "result/"
files_1 = os.listdir(path_1)

i = 0
fraud_num,fraud_num_1,fraud_num_2,fraud_num_3,fraud_num_4 = 0,0,0,0,0
illegal_num,illegal_num_1,illegal_num_2,illegal_num_3,illegal_num_4 = 0,0,0,0,0
ad_num,ad_num_1,ad_num_2,ad_num_3,ad_num_4,ad_num_5,ad_num_6,ad_num_7,ad_num_8,ad_num_9 = 0,0,0,0,0,0,0,0,0,0
other_num = 0

for file in files_1:
    with open(path_1+file,encoding="utf-8") as f:
        reader = json.loads(f.read())
        for r in reader:
            content = r[1].replace("'","''").replace(" ","")
            content = re.sub(r"[A-Za-z0-9\!\%\[\]\，\。]", "", content)
            i = i+1
            if "奖" in content:
                fraud_num += 1
                fraud_num_1 += 1
                r.append("诈骗")
                r.append("中奖诈骗")
            elif "信用卡" in content and ("取现" in content or "款" in content):
                fraud_num += 1
                fraud_num_2 += 1
                r.append("诈骗")
                r.append("信用卡诈骗")
            elif "红包" in content:
                fraud_num += 1
                fraud_num_3 += 1
                r.append("诈骗")
                r.append("虚假红包")
            elif "请登录" in content:
                fraud_num += 1
                fraud_num_4 += 1
                r.append("诈骗")
                r.append("钓鱼网站")
            elif "票" in content or "代开" in content:
                illegal_num += 1
                illegal_num_1 += 1
                r.append("非法服务")
                r.append("代开发票")
            elif "办证" in content or "刻章" in content or "保真" in content:
                illegal_num += 1
                illegal_num_2 += 1
                r.append("非法服务")
                r.append("办证刻章")
            elif "女" in content or "妞" in content or "妹" in content:
                illegal_num += 1
                illegal_num_3 += 1
                r.append("非法服务")
                r.append("色情服务")
            elif "注" in content or "赌" in content:
                illegal_num += 1
                illegal_num_4 += 1
                r.append("非法服务")
                r.append("赌博")
            elif "行" in content:
                ad_num += 1
                ad_num_1 += 1
                r.append("广告")
                r.append("银行广告")
            elif "房" in content or "首付" in content or "院" in content or "公寓" in content:
                ad_num += 1
                ad_num_2 += 1
                r.append("广告")
                r.append("房地产广告")
            elif "教" in content or "培训" in content:
                ad_num += 1
                ad_num_3 += 1
                r.append("广告")
                r.append("教育培训")
            elif "车" in content:
                ad_num += 1
                ad_num_4 += 1
                r.append("广告")
                r.append("汽车广告")
            elif "游" in content:
                ad_num += 1
                ad_num_5 += 1
                r.append("广告")
                r.append("旅游广告")
            elif "贷" in content:
                ad_num += 1
                ad_num_6 += 1
                r.append("广告")
                r.append("贷款广告")
            elif "招" in content:
                ad_num += 1
                ad_num_7 += 1
                r.append("广告")
                r.append("招聘广告")
            elif "网" in content or "链接" in content:
                ad_num += 1
                ad_num_8 += 1
                r.append("广告")
                r.append("网站广告")
            elif "定金" in content or "无需" in content or "退订" in content:
                ad_num += 1
                ad_num_9 += 1
                r.append("广告")
                r.append("其他广告")
            else:
                other_num += 1
                r.append("其他")
                r.append("其他")

    with open(path_2+file,"w",encoding="utf-8") as f:
        f.write("[")
        j = 0
        for r in reader:
            j += 1
            if j != 1:
                f.write(",")
            json.dump(r,f,ensure_ascii=False,indent=4)
        f.write("]")
    
    print(file+" done.")

print("垃圾短信总数 "+str(i))
print("诈骗 "+str(fraud_num)+"\t"+"%.2f%%" % (fraud_num/i*100))
print(" -中奖诈骗 "+str(fraud_num_1)+"\t"+"%.2f%%" % (fraud_num_1/i*100))
print(" -信用卡诈骗 "+str(fraud_num_2)+"\t"+"%.2f%%" % (fraud_num_2/i*100))
print(" -虚假红包 "+str(fraud_num_3)+"\t"+"%.2f%%" % (fraud_num_3/i*100))
print(" -钓鱼网站 "+str(fraud_num_4)+"\t"+"%.2f%%" % (fraud_num_4/i*100))
print("非法服务 "+str(illegal_num)+"\t"+"%.2f%%" % (illegal_num/i*100))
print(" -代开发票 "+str(illegal_num_1)+"\t"+"%.2f%%" % (illegal_num_1/i*100))
print(" -办证刻章 "+str(illegal_num_2)+"\t"+"%.2f%%" % (illegal_num_2/i*100))
print(" -色情服务 "+str(illegal_num_3)+"\t"+"%.2f%%" % (illegal_num_3/i*100))
print(" -赌博 "+str(illegal_num_4)+"\t"+"%.2f%%" % (illegal_num_4/i*100))
print("广告 "+str(ad_num)+"\t"+"%.2f%%" % (ad_num/i*100))
print(" -银行广告 "+str(ad_num_1)+"\t"+"%.2f%%" % (ad_num_1/i*100))
print(" -房地产广告 "+str(ad_num_2)+"\t"+"%.2f%%" % (ad_num_2/i*100))
print(" -教育培训 "+str(ad_num_3)+"\t"+"%.2f%%" % (ad_num_3/i*100))
print(" -汽车广告 "+str(ad_num_4)+"\t"+"%.2f%%" % (ad_num_4/i*100))
print(" -旅游广告 "+str(ad_num_5)+"\t"+"%.2f%%" % (ad_num_5/i*100))
print(" -贷款广告 "+str(ad_num_6)+"\t"+"%.2f%%" % (ad_num_6/i*100))
print(" -招聘广告 "+str(ad_num_7)+"\t"+"%.2f%%" % (ad_num_7/i*100))
print(" -网站推广 "+str(ad_num_8)+"\t"+"%.2f%%" % (ad_num_8/i*100))
print(" -其他广告 "+str(ad_num_9)+"\t"+"%.2f%%" % (ad_num_9/i*100))
print("其他 "+str(other_num)+"\t"+"%.2f%%" % (other_num/i*100))