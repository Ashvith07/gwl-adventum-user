import os
from flask import Flask, request, session
import cv2
import matplotlib.pyplot as plt
import numpy as np
import shutil
import glob
import pandas as pd
import pickle
import sys

Anomaly_Reference = pickle.load(open("Anomaly_Reference.pkl", "rb"))

app = Flask(__name__)
# what file extensions are allowed
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
# what methods we are using
@app.route('/', methods=['POST', 'GET'])
def entry_page():
    if request.method == 'GET':
        return "<h1>API TESTING</h1><p>This site is a prototype API for OUR ANNOTATION TOOL</p>"
    # if the request method is POST
    if request.method == 'POST':

        # requesting file name
        imgname = request.form['filename']
        f_name = imgname.replace('.png', '')
        print("Img_Name:", imgname)

        # requesting file path
        f_path = request.form['original_filepath']
        f_path = f_path.replace('/edit', '')
        f_path = f_path.replace("/", "\\")
        f_path = 'C:\\Users\\Adventum\\sse-images'+f_path
        print("Img_Path:", f_path+'\\'+imgname)

        # requesting Index and Hex code
        anomaly = request.form['Annotated']
        print('anomaly|hex:', anomaly)
        anomaly = anomaly.translate({ord('"'): None})
        anomaly = anomaly.translate({ord('['): None})
        anomaly = anomaly.translate({ord(']'): None})
        anomaly = anomaly.translate({ord('{'): None})
        anomaly = anomaly.translate({ord('}'): None})
        anomaly = anomaly.translate({ord(','): None})
        anomaly = anomaly.translate({ord('#'): None})
        anomaly = anomaly.replace("index", "")
        anomaly = anomaly.replace("anomaly_hexcode", "")

        # splitting the indexes and hexcodes in 2 lists
        anomaly = anomaly[1:]
        print('anomaly2:', anomaly)
        anomaly = list(anomaly.split(":"))
        print(anomaly)

        c = 1
        index = []
        hex_c = []
        print('ano_len:', len(anomaly))
        for i in range(0, len(anomaly)):
            if c % 2 == 0:
                index.append(int(anomaly[i]))
            c = c+1

        index = list(dict.fromkeys(index))
        index.sort()
        print("index:", index)

        # appening anomaly names & hex_codes according to the index sent
        anomaly_n = []
        rgb = []

        for ind in index:
            anomaly_n.append(Anomaly_Reference[ind][0])
            hex_c.append(Anomaly_Reference[ind][1])
            rgb.append(eval(Anomaly_Reference[ind][2]))
            print(ind, Anomaly_Reference[ind][1])

        anomaly_n2 = anomaly_n.copy()

        # Requesting the Labeled Image(BLOB DATA)
        img = request.files['file']

        # TARGET FODLER
        UPLOAD_FOLDER = 'E:\\OCT Project Winter\\Labelled\\'
        app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

        ndir = UPLOAD_FOLDER+f_name

        print('hex_c:', hex_c)
        print('anomaly_Name', anomaly_n2)

        # Making a DatafFrame having Hex_Code,Anomaly_Name and Index
        df = pd.DataFrame(
            {'Hex_Code': hex_c, 'Anomaly_Name': anomaly_n2, 'Index': index})

        # When a new IMAGE is Saved and no folder exists
        if os.path.exists(ndir) == True:
            shutil.rmtree(ndir)
        
        # making the parent folder
        os.mkdir(UPLOAD_FOLDER+f_name)

        # making the sub folders
        os.mkdir(ndir+'\\'+'original_img')
        os.mkdir(ndir+'\\'+'Masks')
        os.mkdir(ndir+'\\'+'Labbled_img')
        os.mkdir(ndir+'\\'+'Extracted_Masks')
        os.mkdir(ndir+'\\'+'White_Mask')
        os.mkdir(ndir+'\\'+'Refined_Mask')
        
        target = UPLOAD_FOLDER+f_name+'\\'+'Labbled_img'
        target2 = UPLOAD_FOLDER+f_name+'\\'+'Masks'
        target33 = UPLOAD_FOLDER+f_name+'\\'+'original_img'
        target3 = UPLOAD_FOLDER+f_name+'\\'+'Extracted_Masks'
        target4 = UPLOAD_FOLDER+f_name+'\\'+'White_Mask'
        target5 = UPLOAD_FOLDER+f_name+'\\'+'Refined_Mask'

        destination = "\\".join([target, 'label.png'])
        destination2 = "\\".join([target2, 'mask.png'])

        # saving the labeled img in the Labeled_Img folder
        img.save(destination)

        session['uploadFilePath'] = target

        orig_img = f_path+'\\'+imgname

        # Copying the Original_Img from the path to the Original_img folder
        shutil.copy2(orig_img, target33)

        # Pushing in RGB values in the dataframe respectively
        df['RGB'] = rgb
        df = df.append({'Hex_Code': '000000', 'Anomaly_Name': 'Black',
                        'Index': '0', 'RGB': '[0,0,0]'}, ignore_index=True)
        df.to_excel(ndir+'\\'+'export_dataframe.xlsx',
                    index=None, header=True)


        # ALGORITHM for detecting and Extracting just the labeled area(clubbed masks)
        def seperate_superimposed_image(name, name1):
            super_imposed = cv2.imread(name)
            for t in range(super_imposed.shape[0]):
                for y in range(super_imposed.shape[1]):
                    if super_imposed[t, y][0] == super_imposed[t, y][1] == super_imposed[t, y][2]:
                        super_imposed[t, y] = [0,0,0]
            cv2.imwrite(name1, super_imposed)

        seperate_superimposed_image(name=destination, name1=destination2)

        # ALGORITHM to extract single masks for different anomalies from the clubbed MASK IMG.
        def mask_creation(name, x, color_mask_path, white_mask_path, index, gray_mask):
            red = cv2.imread(name)
            red = cv2.cvtColor(red, cv2.COLOR_BGR2RGB)
            red_m = cv2.inRange(red, x, x)
            colored_masked_image = np.copy(red)
            colored_masked_image[red_m != 255] = [0, 0, 0]
            cv2.imwrite(color_mask_path, cv2.cvtColor(
                colored_masked_image, cv2.COLOR_RGB2BGR))

            temp_mask = np.zeros(gray_mask.shape)
            temp_mask[red_m == 255] = index
            gray_mask += temp_mask

            temp_mask[temp_mask == index] = 255
            cv2.imwrite(white_mask_path, temp_mask)

            return gray_mask

        temp_img = cv2.imread(destination2, 0)
        gray_mask = np.zeros(temp_img.shape)

        for ind, hex_code, rgb_code in zip(index, hex_c, rgb):
            color_mask_path = "/".join([target3, hex_code])+'.png'
            white_mask_path = "/".join([target4, hex_code])+'.png'
            gray_mask = mask_creation(destination2, tuple(
                rgb_code), color_mask_path, white_mask_path, ind, gray_mask)

        cv2.imwrite(target5+"/refined_mask.png", gray_mask)
        print("All Masks Written in Database")
        print("$$$ Done $$$")

    return ""

if __name__ == "__main__":
    app.secret_key = 'super secret key'
    app.config['SESSION_TYPE'] = 'filesystem'

    app.debug = True
    app.run(host='0.0.0.0', port='90')
